#!/usr/bin/env node
// Drive Watcher — Intelligent Inbox for FadeJunkie Drop Zone
// Recursively watches all folders/files in Google Drive "FadeJunkie Drop Zone".
// Reads new files directly from Drive, classifies them, updates project state.
//
// node drive-watcher.mjs              → daemon (polls every 60s)
// node drive-watcher.mjs --once       → one-shot (poll once, exit)
// node drive-watcher.mjs --interval 30 → custom poll interval

import { spawnSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { tmpdir } from 'os';

const ROOT = join(fileURLToPath(import.meta.url), '..');
const MANIFEST_FILE = join(ROOT, '.drive-manifest.json');
const DROP_ZONE_ID = '1UBF3RD4m2bfKXBJezlqao-GX07PfvxXa';

// ── Project Registry ──────────────────────────────────────────────────────────
// Maps Drive folder names → project config. Used to associate files with projects.

const PROJECTS = {
  WCORWIN: {
    driveFolder: 'WCORWIN',
    crmSlug: 'wcorwin',
    contextFile: join(ROOT, 'seo-engine', 'context', 'clients', 'wcorwin.md'),
    keywords: ['wcorwin', 'corwin', 'weichert', 'new braunfels'],
  },
};

// ── CLI Args ──────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const ONCE = args.includes('--once');
let INTERVAL = 60;
const intIdx = args.indexOf('--interval');
if (intIdx !== -1 && args[intIdx + 1]) INTERVAL = parseInt(args[intIdx + 1], 10) || 60;

// ── Shell Helpers ─────────────────────────────────────────────────────────────

function bashEsc(s) {
  return s.replace(/'/g, "'\\''");
}

function gws(subCmd, paramsObj, extraFlags = '') {
  const paramsJSON = JSON.stringify(paramsObj);
  const cmd = `gws drive files ${subCmd} --params '${bashEsc(paramsJSON)}'${extraFlags ? ' ' + extraFlags : ''}`;
  const result = spawnSync('bash', ['-c', cmd], { encoding: 'utf8', timeout: 30_000 });
  try { return JSON.parse(result.stdout); } catch { return null; }
}

/** Read a file's content directly from Drive. Returns string or null. */
function gwsRead(fileId, fileName) {
  const tmp = join(tmpdir(), `dw-${Date.now()}-${fileName}`);
  const params = JSON.stringify({ fileId, alt: 'media' });
  const cmd = `gws drive files get --params '${bashEsc(params)}' -o '${bashEsc(tmp)}'`;
  const result = spawnSync('bash', ['-c', cmd], { encoding: 'utf8', timeout: 30_000 });
  if (result.status !== 0) return null;
  try {
    const content = readFileSync(tmp, 'utf8');
    try { require('fs').unlinkSync(tmp); } catch {}
    return content;
  } catch {
    // Binary file — can't read as utf8, clean up
    try { require('fs').unlinkSync(tmp); } catch {}
    return null;
  }
}

function log(msg) {
  const ts = new Date().toISOString().slice(0, 19).replace('T', ' ');
  console.log(`[${ts}] ${msg}`);
}

function readJSON(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')); }
  catch { return null; }
}

function writeJSON(path, data) {
  writeFileSync(path, JSON.stringify(data, null, 2) + '\n', 'utf8');
}

// ── Manifest — tracks what we've already seen ────────────────────────────────

function loadManifest() {
  return readJSON(MANIFEST_FILE) || { seen: {}, lastPoll: null };
}

function saveManifest(manifest) {
  manifest.lastPoll = new Date().toISOString();
  writeJSON(MANIFEST_FILE, manifest);
}

// ── Recursive Drive Scanner ──────────────────────────────────────────────────

/**
 * Recursively list all files and folders under a Drive folder.
 * Returns flat array of { id, name, mimeType, path } where path is the
 * breadcrumb trail (e.g. "WCORWIN/wcorwin-core-files/seo-audit.md").
 */
function scanFolder(folderId, pathPrefix = '') {
  const q = `'${folderId}' in parents and trashed=false`;
  const result = gws('list', { q, fields: 'files(id,name,mimeType,createdTime,modifiedTime)' });
  if (!result?.files) return [];

  const items = [];
  for (const file of result.files) {
    const filePath = pathPrefix ? `${pathPrefix}/${file.name}` : file.name;
    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

    items.push({
      id: file.id,
      name: file.name,
      mimeType: file.mimeType,
      path: filePath,
      isFolder,
      createdTime: file.createdTime,
      modifiedTime: file.modifiedTime,
    });

    // Recurse into subfolders
    if (isFolder) {
      items.push(...scanFolder(file.id, filePath));
    }
  }
  return items;
}

// ── File Classification ──────────────────────────────────────────────────────

function classifyFile(file, content) {
  const ext = extname(file.name).toLowerCase();
  const nameLower = file.name.toLowerCase();

  // By extension
  if (ext === '.pdf') {
    if (nameLower.includes('receipt') || nameLower.includes('invoice')) return 'receipt';
    if (nameLower.includes('proposal') || nameLower.includes('retainer')) return 'proposal';
    if (nameLower.includes('agreement') || nameLower.includes('contract')) return 'agreement';
    if (nameLower.includes('audit') || nameLower.includes('summary')) return 'deliverable';
    return 'document';
  }
  if (['.png', '.jpg', '.jpeg', '.webp', '.gif', '.heic', '.svg'].includes(ext)) return 'image';
  if (['.mp3', '.wav', '.m4a', '.ogg'].includes(ext)) return 'audio';
  if (['.mp4', '.mov', '.avi', '.webm'].includes(ext)) return 'video';
  if (['.md', '.txt'].includes(ext)) {
    // Try to classify by content
    if (content) {
      if (/audit|score|pillar/i.test(content)) return 'audit';
      if (/voice|tone|email|skill/i.test(content)) return 'skill';
      if (/keyword|seo|ranking/i.test(content)) return 'seo-doc';
    }
    return 'document';
  }

  return 'other';
}

/** Determine which project a file belongs to based on its path and name */
function matchProject(file) {
  for (const [key, project] of Object.entries(PROJECTS)) {
    // Check if file is in the project's Drive folder
    if (file.path.startsWith(project.driveFolder + '/')) return key;
    // Check keywords in filename
    for (const kw of project.keywords) {
      if (file.name.toLowerCase().includes(kw)) return key;
    }
  }
  return null;
}

// ── Actions ──────────────────────────────────────────────────────────────────

function addNote(text) {
  const notesPath = join(ROOT, 'cc-notes.json');
  const notes = readJSON(notesPath) || { notes: [] };
  notes.notes.unshift({
    id: Date.now(),
    text,
    createdAt: new Date().toISOString(),
  });
  notes.lastUpdated = new Date().toISOString();
  writeJSON(notesPath, notes);
}

function updateCRM(slug, fileName, fileType) {
  const crmPath = join(ROOT, 'cc-crm.json');
  const crm = readJSON(crmPath);
  if (!crm?.prospects) return;

  const prospect = crm.prospects.find(p =>
    p.name?.toLowerCase().includes(slug) ||
    p.notes?.toLowerCase().includes(slug)
  );
  if (!prospect) return;

  const now = new Date().toISOString().slice(0, 10);

  if (fileType === 'receipt') {
    if (!prospect.payments) prospect.payments = [];
    const nextMonth = prospect.payments.length + 1;
    prospect.payments.push({
      month: nextMonth,
      amount: prospect.value || 0,
      date: now,
      method: 'auto-ingested — verify',
      receipt: fileName,
    });
    prospect.lastContact = now;
    log(`CRM: added payment month ${nextMonth} for ${prospect.name}`);
  }

  if (!prospect.history) prospect.history = [];
  prospect.history.push({
    status: prospect.status || 'active',
    date: now,
    note: `Drive: ${fileName} (${fileType})`,
  });

  crm.lastUpdated = new Date().toISOString();
  writeJSON(crmPath, crm);
}

function updateMetrics(fileType) {
  if (fileType !== 'receipt') return;
  const metricsPath = join(ROOT, 'cc-metrics.json');
  const metrics = readJSON(metricsPath);
  if (!metrics) return;
  if (!metrics.notes) metrics.notes = [];
  const now = new Date().toISOString().slice(0, 10);
  metrics.notes.push({ date: now, key: 'mrr', note: 'New receipt ingested via Drive — verify amount' });
  writeJSON(metricsPath, metrics);
}

function broadcastSSE() {
  try {
    spawnSync('bash', ['-c', 'curl -s http://localhost:4747/api/status > /dev/null 2>&1'], { timeout: 3000 });
  } catch {}
}

// ── Process a Single New File ────────────────────────────────────────────────

function processFile(file) {
  if (file.isFolder) {
    log(`  📁 New folder: ${file.path}`);
    addNote(`Drive: new folder "${file.path}" detected`);
    return;
  }

  const ext = extname(file.name).toLowerCase();
  const isReadable = ['.md', '.txt', '.csv', '.json', '.html', '.xml', '.js', '.ts'].includes(ext);

  // Read content if text-based
  let content = null;
  if (isReadable) {
    content = gwsRead(file.id, file.name);
    if (content) {
      log(`  Read ${content.length} chars from ${file.name}`);
    }
  }

  const fileType = classifyFile(file, content);
  const projectKey = matchProject(file);

  log(`  Type: ${fileType} | Project: ${projectKey || 'unmatched'} | Path: ${file.path}`);

  // Build a summary of what this file is
  let summary = `${file.name} (${fileType})`;
  if (content) {
    // Extract first meaningful line as a description
    const firstLine = content.split('\n').find(l => l.trim() && !l.startsWith('---'));
    if (firstLine) summary += ` — ${firstLine.trim().substring(0, 100)}`;
  }

  // Project-specific updates
  if (projectKey) {
    const project = PROJECTS[projectKey];

    // Update CRM for receipts, agreements, deliverables
    if (['receipt', 'proposal', 'agreement', 'deliverable', 'audit'].includes(fileType)) {
      updateCRM(project.crmSlug, file.name, fileType);
    }

    // Update metrics for receipts
    updateMetrics(fileType);
  }

  // Log to notes
  const noteText = projectKey
    ? `Drive [${projectKey}]: ${summary}`
    : `Drive: ${summary}`;
  addNote(noteText);

  // Log content preview for readable files
  if (content && content.length > 0) {
    const preview = content.substring(0, 300).replace(/\n/g, ' ').trim();
    log(`  Preview: ${preview}...`);
  }
}

// ── Main Poll ────────────────────────────────────────────────────────────────

function poll() {
  const manifest = loadManifest();

  log('Scanning FadeJunkie Drop Zone...');
  const allItems = scanFolder(DROP_ZONE_ID);
  log(`Found ${allItems.length} items total`);

  // Find new items (not in manifest)
  const newItems = allItems.filter(item => !manifest.seen[item.id]);

  if (newItems.length === 0) {
    log('No new files.');
    saveManifest(manifest);
    return 0;
  }

  log(`${newItems.length} new item(s) detected:`);

  for (const item of newItems) {
    processFile(item);
    manifest.seen[item.id] = {
      name: item.name,
      path: item.path,
      type: item.mimeType,
      seenAt: new Date().toISOString(),
    };
  }

  saveManifest(manifest);
  broadcastSSE();
  return newItems.length;
}

// ── Entry Point ──────────────────────────────────────────────────────────────

function main() {
  log('Drive Watcher starting');
  log(`Mode: ${ONCE ? 'one-shot' : `daemon (${INTERVAL}s interval)`}`);
  log(`Drop Zone: ${DROP_ZONE_ID}`);

  if (ONCE) {
    const count = poll();
    log(`Done. ${count} new item(s) processed.`);
    process.exit(0);
  }

  poll();
  setInterval(poll, INTERVAL * 1000);
}

main();
