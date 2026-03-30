#!/usr/bin/env node
// FadeJunkie Control Center — Enterprise Server v2
// node control-center/cc-server.mjs → http://localhost:4747
//
// Routes:
//   GET  /                       serve cc-dashboard.html
//   GET  /sse                    Server-Sent Events: real-time push
//   GET  /api/status             full workspace status
//   GET  /api/envvars            env vars (masked)
//   GET  /api/health             live HTTP health checks
//   GET  /api/audit              codebase audit items
//   GET  /api/audit-detail?num=N full description of audit item
//   GET  /api/tasks              task history
//   GET  /api/resources          resource hub
//   GET  /api/plan               full markdown of a pending plan file
//   GET  /api/metrics            business KPI tracker
//   POST /api/approve            approve pending plan → agent inbox
//   POST /api/task               send new task to agent inbox
//   POST /api/goal-toggle        toggle a goal item in goals.md
//   POST /api/metrics            update a KPI value
//   DELETE /api/pending          reject/delete a pending plan
//   GET  /api/reveal             reveal env var value (localhost only)
//   GET  /api/crm                prospect CRM
//   POST /api/crm                add prospect
//   PATCH /api/crm               update prospect
//   DELETE /api/crm              delete prospect
//   GET  /api/content            content calendar
//   POST /api/content            add content item
//   PATCH /api/content           update content item
//   DELETE /api/content          delete content item
//   GET  /api/projections        MRR pipeline projections
//   GET  /api/seo-insights       latest SEO Engine deliverables
//   GET  /api/task-history       all completed agent tasks

import { createServer }                                     from 'http';
import { execSync }                                         from 'child_process';
import { readdirSync, readFileSync, existsSync,
         writeFileSync, unlinkSync, mkdirSync,
         statSync, watch }                                  from 'fs';
import { join }                                             from 'path';

const ROOT = 'C:/Users/twani/fadejunkie';
const PORT = process.env.PORT ? Number(process.env.PORT) : 4747;
const CC_DIR        = join(ROOT, 'control-center');
const METRICS_FILE  = join(CC_DIR, 'cc-metrics.json');
const CRM_FILE      = join(CC_DIR, 'cc-crm.json');
const CONTENT_FILE  = join(CC_DIR, 'cc-content.json');
const NOTES_FILE    = join(CC_DIR, 'cc-notes.json');

// ── SSE client registry ────────────────────────────────────────────────────────
const sseClients = new Set();
let lastStatusHash = '';

function broadcast(event, data) {
  const payload = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
  sseClients.forEach(res => {
    try { res.write(payload); }
    catch { sseClients.delete(res); }
  });
}

// ── Filesystem helpers ─────────────────────────────────────────────────────────
function git(cmd) {
  try { return execSync(`git -C "${ROOT}" ${cmd}`, { encoding: 'utf-8' }).trim(); }
  catch { return ''; }
}

function ls(rel) {
  try {
    return readdirSync(join(ROOT, rel))
      .filter(f => (f.endsWith('.md') || f.endsWith('.txt')) && f !== '.gitkeep');
  } catch { return []; }
}

function read(rel) {
  try { return readFileSync(join(ROOT, rel), 'utf-8'); }
  catch { return ''; }
}

function parseEnvFile(rel) {
  const raw  = read(rel);
  const vars = {};
  for (const line of raw.split('\n')) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    const val = trimmed.slice(eq + 1).trim().replace(/^['"]|['"]$/g, '');
    vars[key] = val;
  }
  return vars;
}

function maskValue(val) {
  if (!val || val.length < 8) return '••••••••';
  if (val.startsWith('http')) return val;
  const show = Math.min(8, Math.floor(val.length * 0.2));
  return val.slice(0, show) + '•'.repeat(Math.max(4, val.length - show - 4)) + val.slice(-4);
}

// ── Metrics (persistent JSON) ──────────────────────────────────────────────────
function loadMetrics() {
  if (!existsSync(METRICS_FILE)) {
    const defaults = {
      users:    { count: 0, target: 10,  label: 'Real Barbers',     unit: 'users',   updated: '' },
      mrr:      { count: 0, target: 0,   label: 'Monthly Revenue',  unit: 'USD',     updated: '' },
      prospects:{ count: 0, target: 3,   label: 'Warm Prospects',   unit: 'leads',   updated: '' },
      outreach: { count: 0, target: 1,   label: 'Outreach Sent',    unit: 'msgs',    updated: '' },
      clients:  { count: 0, target: 1,   label: 'First Client',     unit: 'clients', updated: '' },
      affiliate:{ count: 0, target: 0,   label: 'Affiliate Clicks', unit: 'clicks',  updated: '' },
      profiles: { count: 0, target: 3,   label: 'Demo Profiles',    unit: 'live',    updated: '' },
      notes:    [],
    };
    writeFileSync(METRICS_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try { return JSON.parse(readFileSync(METRICS_FILE, 'utf-8')); }
  catch { return {}; }
}

function saveMetrics(data) {
  writeFileSync(METRICS_FILE, JSON.stringify(data, null, 2));
}

// ── Data builders ─────────────────────────────────────────────────────────────
const ENV_CATEGORIES = {
  'NEXT_PUBLIC_CONVEX_URL':      { label: 'Convex API URL',     cat: 'Convex',   sensitive: false },
  'NEXT_PUBLIC_CONVEX_SITE_URL': { label: 'Convex Site URL',    cat: 'Convex',   sensitive: false },
  'CONVEX_DEPLOYMENT':           { label: 'Convex Deployment',  cat: 'Convex',   sensitive: false },
  'SETUP_SCRIPT_RAN':            { label: 'Init Flag',          cat: 'Internal', sensitive: false },
  'anthropic_api':               { label: 'Anthropic API Key',  cat: 'AI',       sensitive: true  },
  'vercel_api':                  { label: 'Vercel API Token',   cat: 'Deploy',   sensitive: true  },
  'cf_token':                    { label: 'Cloudflare Token',   cat: 'Deploy',   sensitive: true  },
  'google_places_api':           { label: 'Google Places API',  cat: 'Geo',      sensitive: true  },
};

function buildGit() {
  const branch      = git('branch --show-current') || 'master';
  const statusLines = git('status --short').split('\n').filter(Boolean);
  const dirty       = statusLines.length;
  const commits     = git('log --oneline -8').split('\n').filter(Boolean).map(line => {
    const sp = line.indexOf(' ');
    return { hash: line.slice(0, sp), msg: line.slice(sp + 1) };
  });
  const modified  = statusLines.filter(l => l.match(/^ M|^M /)).length;
  const added     = statusLines.filter(l => l.startsWith('A ')).length;
  const untracked = statusLines.filter(l => l.startsWith('?')).length;
  return { branch, dirty, modified, added, untracked, commits };
}

function buildAgents() {
  const defs = [
    { name: 'FUNKIE',     dir: 'funkie',     role: 'Primary Operator — Planning & Execution', color: 'amber'  },
    { name: 'LOBE',       dir: 'lobe',       role: 'Frontend Specialist — UI & Design',       color: 'violet' },
    { name: 'SEO ENGINE', dir: 'seo-engine', role: 'SEO Strategist — Content & Search',       color: 'cyan'   },
  ];

  return defs.map(ag => {
    const inbox   = ls(`${ag.dir}/inbox`);
    const pending = ls(`${ag.dir}/outbox/pending`);
    const done    = ls(`${ag.dir}/outbox`).filter(f => f.startsWith('_done-'));

    const pendingDetails = pending.map(f => {
      const content   = read(`${ag.dir}/outbox/pending/${f}`);
      const firstLine = content.split('\n').find(l => l.startsWith('#'))?.replace(/^#+\s*/, '') ?? f;
      const preview   = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 3).join(' ').slice(0, 200);
      return { file: f, title: firstLine, preview };
    });

    const outboxDir  = join(ROOT, ag.dir, 'outbox');
    const allResults = [];
    try {
      readdirSync(outboxDir)
        .filter(f => f.endsWith('.md') && !f.startsWith('.') && !f.startsWith('_done-'))
        .forEach(f => {
          const stat = statSync(join(outboxDir, f));
          allResults.push({ file: f, mtime: stat.mtimeMs });
        });
    } catch {}

    const latest = allResults.sort((a, b) => b.mtime - a.mtime)[0]
      ?.file.replace(/-\d{4}-\d{2}-\d{2}T[\d\-]+Z\.md$/, '').replace(/-/g, ' ') ?? '';

    // Last done timestamp for Burn Clock + Pulse Ring
    let lastDoneTime = null;
    try {
      const doneTimes = done.map(f => statSync(join(ROOT, ag.dir, 'outbox', f)).mtimeMs);
      if (doneTimes.length) lastDoneTime = new Date(Math.max(...doneTimes)).toISOString();
    } catch {}

    return { name: ag.name, dir: ag.dir, role: ag.role, color: ag.color,
             inbox, pending: pendingDetails, doneCount: done.length, latest,
             taskCount: allResults.length, lastDoneTime };
  });
}

function buildGoals() {
  const goalsText = read('funkie/memory/goals.md');
  const sections  = goalsText.split(/^## /m).filter(Boolean);
  let total = 0, done = 0;
  const arms = [];

  for (const section of sections) {
    const lines   = section.split('\n');
    const title   = lines[0].trim();
    if (!title.startsWith('Q1')) continue;

    const armName = title.includes('Platform') ? 'Platform' : 'Services';
    const subs    = [];
    let cur       = null;

    for (const line of lines.slice(1)) {
      if (line.startsWith('### ')) {
        if (cur) subs.push(cur);
        cur = { name: line.replace(/^###\s*/, '').trim(), items: [], labels: [] };
      } else if (line.match(/^- \[[ x]\]/) && cur) {
        const checked = line.includes('[x]');
        const label   = line.replace(/^- \[[ x]\]\s*/, '').trim();
        total++;
        if (checked) done++;
        cur.items.push(checked);
        cur.labels.push(label);
      }
    }
    if (cur) subs.push(cur);
    arms.push({ name: armName, subsections: subs });
  }

  return { total, done, pct: total ? Math.round((done / total) * 100) : 0, arms };
}

function buildRecentActivity() {
  const ctx      = read('context/fadejunkie.md');
  const actMatch = ctx.match(/## Recent Activity([\s\S]*?)(?=\n##|$)/);
  if (!actMatch) return [];
  return actMatch[1].split('\n')
    .filter(l => l.startsWith('|') && !l.includes('---') && !l.includes('Date'))
    .map(row => {
      const cells = row.split('|').map(s => s.trim()).filter(Boolean);
      if (cells.length < 3) return null;
      const [date, task, impact, what = ''] = cells;
      return { date, task, impact, what };
    })
    .filter(Boolean).reverse().slice(0, 10);
}

function buildStrategyContext() {
  const ctx = read('context/fadejunkie.md');
  const extract = (header) => {
    const m = ctx.match(new RegExp(`## ${header}([\\s\\S]*?)(?=\\n##|$)`));
    return m ? m[1].trim() : '';
  };
  const visionRaw = extract('Vision');
  const bmodelRaw = extract('Business Model');
  const bmodelRows = [];
  const tableMatch = bmodelRaw.match(/\|.*\|/g) || [];
  tableMatch.filter(l => !l.includes('---') && !l.includes('Stream')).forEach(row => {
    const cells = row.split('|').map(s => s.trim()).filter(Boolean);
    if (cells.length >= 3) bmodelRows.push({ stream: cells[0], arm: cells[1], mechanism: cells[2] });
  });
  const vision = visionRaw.split('\n').find(l => l.trim() && !l.startsWith('#')) ?? '';
  return {
    vision, businessModel: bmodelRows,
    techStack: ['Next.js 16', 'Convex', 'Tailwind CSS 4', 'Radix UI', '@convex-dev/auth'],
    activeFeatures: ['Community Feed', 'Barber Profiles', 'Shop Builder', 'Barber/School Directory',
                     'Resources & Affiliates', 'Flashcards (344 cards)', 'Practice Test', 'TDLR Exam Guide'],
  };
}

function buildAudit() {
  const auditText = read('funkie/outbox/pending/codebase-audit.md');
  if (!auditText) return { available: false, items: [] };

  const items = [];
  let currentPriority = null;
  const lines = auditText.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const sectionMatch = line.match(/^###\s+P(\d)/);
    if (sectionMatch) { currentPriority = `P${sectionMatch[1]}`; continue; }
    const itemMatch = line.match(/^\*\*\d+\.\s+(.+?)\*\*\s*$/);
    if (itemMatch && currentPriority) {
      // Collect description (next non-header lines until next item or blank+blank)
      const descLines = [];
      let j = i + 1;
      while (j < lines.length && !lines[j].match(/^\*\*\d+\./) && !lines[j].match(/^###/) && !lines[j].match(/^---/)) {
        if (lines[j].trim()) descLines.push(lines[j].trim());
        j++;
      }
      const description = descLines.join(' ').slice(0, 400);
      const filesMatch  = description.match(/\*\*Files:\*\*\s*(.+?)(?:\s*-\s*\*\*|$)/);
      const files       = filesMatch ? filesMatch[1].replace(/`/g, '').split(',').map(s => s.trim()) : [];
      items.push({ priority: currentPriority, title: itemMatch[1].trim(), description, files, done: false });
    }
  }

  const counts = { P0: 0, P1: 0, P2: 0, P3: 0 };
  items.forEach(i => { counts[i.priority] = (counts[i.priority] || 0) + 1; });
  return { available: true, items, counts, total: items.length };
}

function buildTaskHistory() {
  const agents = [
    { name: 'FUNKIE', dir: 'funkie' },
    { name: 'LOBE', dir: 'lobe' },
    { name: 'SEO ENGINE', dir: 'seo-engine' },
  ];
  const history = [];
  for (const ag of agents) {
    const outboxDir = join(ROOT, ag.dir, 'outbox');
    try {
      readdirSync(outboxDir)
        .filter(f => f.endsWith('.md') && !f.startsWith('.'))
        .forEach(f => {
          const isDone = f.startsWith('_done-');
          const stat   = statSync(join(outboxDir, f));
          const tsMatch = f.match(/(\d{4}-\d{2}-\d{2}T[\d\-]+Z)\.md$/);
          const date   = tsMatch ? tsMatch[1].slice(0, 10) : stat.mtime.toISOString().slice(0, 10);
          const name   = f.replace(/^_done-/, '').replace(/-\d{4}-\d{2}-\d{2}T[\d\-]+Z\.md$/, '').replace(/-/g, ' ');
          history.push({ agent: ag.name, file: f, name, date, done: isDone, mtime: stat.mtimeMs });
        });
    } catch {}
  }
  return history.sort((a, b) => b.mtime - a.mtime).slice(0, 40);
}

function buildEnvVars() {
  const raw  = parseEnvFile('app/.env.local');
  return Object.entries(raw).map(([key, val]) => {
    const meta = ENV_CATEGORIES[key] ?? {
      label: key, cat: 'Other', sensitive: !key.startsWith('NEXT_PUBLIC'),
    };
    return { key, label: meta.label, cat: meta.cat, sensitive: meta.sensitive,
             masked: meta.sensitive ? maskValue(val) : val };
  });
}

function buildResources() {
  const env = parseEnvFile('app/.env.local');
  return [
    { cat: 'Deployment', links: [
      { label: 'Vercel Dashboard',      url: 'https://vercel.com/dashboard' },
      { label: 'Convex Dashboard',      url: 'https://dashboard.convex.dev' },
      { label: 'Cloudflare DNS',        url: 'https://dash.cloudflare.com' },
    ]},
    { cat: 'AI & APIs', links: [
      { label: 'Anthropic Console',     url: 'https://console.anthropic.com' },
      { label: 'Google Cloud Console',  url: 'https://console.cloud.google.com' },
    ]},
    { cat: 'Codebase', links: [
      { label: 'GitHub',                url: 'https://github.com' },
      { label: 'FadeJunkie App',        url: 'http://localhost:3000' },
      { label: 'Convex Cloud',          url: env['NEXT_PUBLIC_CONVEX_URL'] ?? '#' },
    ]},
    { cat: 'Docs', links: [
      { label: 'Convex Docs',           url: 'https://docs.convex.dev' },
      { label: 'Next.js Docs',          url: 'https://nextjs.org/docs' },
      { label: 'Tailwind v4',           url: 'https://tailwindcss.com/docs' },
      { label: 'Claude API',            url: 'https://docs.anthropic.com' },
      { label: '@convex-dev/auth',      url: 'https://labs.convex.dev/auth' },
    ]},
    { cat: 'SEO & Analytics', links: [
      { label: 'Search Console',        url: 'https://search.google.com/search-console' },
      { label: 'Google Analytics',      url: 'https://analytics.google.com' },
    ]},
  ];
}

function buildStatus() {
  return {
    timestamp:      new Date().toISOString(),
    git:            buildGit(),
    agents:         buildAgents(),
    goals:          buildGoals(),
    recentActivity: buildRecentActivity(),
    strategy:       buildStrategyContext(),
    audit:          buildAudit(),
    metrics:        loadMetrics(),
    insights:       buildInsights(),
    projections:    buildProjections(),
    crm:            loadCRM(),
    content:        loadContent(),
  };
}

// ── Health checks (async) ──────────────────────────────────────────────────────
function fetchHealth(url, timeoutMs = 3000) {
  return new Promise(resolve => {
    const proto = url.startsWith('https') ? 'https' : 'http';
    import(proto).then(({ default: mod }) => {
      const start = Date.now();
      try {
        const req = mod.get(url, { timeout: timeoutMs }, res => {
          const ms = Date.now() - start;
          res.resume();
          resolve({ ok: true, status: res.statusCode, ms });
        });
        req.on('timeout', () => { req.destroy(); resolve({ ok: false, status: null, ms: timeoutMs }); });
        req.on('error',   () => resolve({ ok: false, status: null, ms: Date.now() - start }));
      } catch { resolve({ ok: false, status: null, ms: 0 }); }
    }).catch(() => resolve({ ok: false, status: null, ms: 0 }));
  });
}

async function buildHealth() {
  const env = parseEnvFile('app/.env.local');
  const convexUrl = env['NEXT_PUBLIC_CONVEX_URL'] ?? '';
  const checks = await Promise.all([
    fetchHealth('http://localhost:3000').then(r => ({ name: 'App (localhost:3000)', ...r })),
    convexUrl
      ? fetchHealth(`${convexUrl}/version`).then(r => ({ name: 'Convex API', ...r }))
      : Promise.resolve({ name: 'Convex API', ok: false, status: null, ms: 0 }),
    fetchHealth('http://localhost:4747/api/status').then(r => ({ name: 'CC Server', ...r })),
  ]);
  return { timestamp: new Date().toISOString(), services: checks };
}

// ── Approve / Task / Goal / Plan / Pending actions ────────────────────────────

function approveAgentPlan(agent, filename) {
  const pendingPath = join(ROOT, agent, 'outbox', 'pending', filename);
  const inboxPath   = join(ROOT, agent, 'inbox', filename);
  if (!existsSync(pendingPath)) return { ok: false, error: `Not found in pending: ${filename}` };
  if (existsSync(inboxPath))   return { ok: false, error: `Already in inbox: ${filename}` };
  let content = readFileSync(pendingPath, 'utf-8');
  if (!content.includes('<!-- execute -->')) content = `<!-- execute -->\n${content}`;
  const inboxDir = join(ROOT, agent, 'inbox');
  if (!existsSync(inboxDir)) mkdirSync(inboxDir, { recursive: true });
  writeFileSync(inboxPath, content, 'utf-8');
  unlinkSync(pendingPath);
  broadcast('agent-update', { type: 'approve', agent, file: filename });
  return { ok: true, message: `Approved: ${filename} → ${agent}/inbox/` };
}

function rejectPendingPlan(agent, filename) {
  const pendingPath = join(ROOT, agent, 'outbox', 'pending', filename);
  if (!existsSync(pendingPath)) return { ok: false, error: `Not found: ${filename}` };
  const content = readFileSync(pendingPath, 'utf-8');
  // Archive to a rejected folder for reference
  const rejectedDir = join(ROOT, agent, 'outbox', 'rejected');
  if (!existsSync(rejectedDir)) mkdirSync(rejectedDir, { recursive: true });
  writeFileSync(join(rejectedDir, filename), content, 'utf-8');
  unlinkSync(pendingPath);
  broadcast('agent-update', { type: 'reject', agent, file: filename });
  return { ok: true, message: `Rejected: ${filename} archived to ${agent}/outbox/rejected/` };
}

function sendTask(agent, filename, content) {
  const inboxDir  = join(ROOT, agent, 'inbox');
  const inboxPath = join(inboxDir, filename);
  if (!existsSync(inboxDir)) mkdirSync(inboxDir, { recursive: true });
  if (existsSync(inboxPath)) return { ok: false, error: `File already exists in inbox: ${filename}` };
  writeFileSync(inboxPath, content, 'utf-8');
  broadcast('agent-update', { type: 'new-task', agent, file: filename });
  return { ok: true, message: `Task sent: ${filename} → ${agent}/inbox/` };
}

function getPlan(agent, filename) {
  const pendingPath = join(ROOT, agent, 'outbox', 'pending', filename);
  if (!existsSync(pendingPath)) return { ok: false, error: 'Plan not found' };
  const content = readFileSync(pendingPath, 'utf-8');
  return { ok: true, agent, file: filename, content };
}

function toggleGoal(armName, subsectionName, labelText, checked) {
  const goalsPath = join(ROOT, 'funkie', 'memory', 'goals.md');
  let content     = readFileSync(goalsPath, 'utf-8');
  // Find the exact line and toggle it
  const escapedLabel = labelText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const unchecked    = new RegExp(`^(- \\[ \\] )${escapedLabel}$`, 'm');
  const checkedRe    = new RegExp(`^(- \\[x\\] )${escapedLabel}$`, 'm');
  if (checked && unchecked.test(content)) {
    content = content.replace(unchecked, `- [x] ${labelText}`);
  } else if (!checked && checkedRe.test(content)) {
    content = content.replace(checkedRe, `- [ ] ${labelText}`);
  } else {
    return { ok: false, error: 'Goal item not found or state mismatch' };
  }
  writeFileSync(goalsPath, content, 'utf-8');
  broadcast('goals-update', { arm: armName, subsection: subsectionName, label: labelText, checked });
  return { ok: true, message: `Goal ${checked ? 'checked' : 'unchecked'}: ${labelText}` };
}

function revealEnvVar(key) {
  const raw = parseEnvFile('app/.env.local');
  if (!(key in raw)) return { ok: false, error: 'Key not found' };
  return { ok: true, key, value: raw[key] };
}

// ── CRM (Services Arm Prospect Tracker) ───────────────────────────────────────
function loadCRM() {
  if (!existsSync(CRM_FILE)) {
    const defaults = { prospects: [], lastUpdated: '' };
    writeFileSync(CRM_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try { return JSON.parse(readFileSync(CRM_FILE, 'utf-8')); }
  catch { return { prospects: [], lastUpdated: '' }; }
}

function saveCRM(data) {
  data.lastUpdated = new Date().toISOString();
  writeFileSync(CRM_FILE, JSON.stringify(data, null, 2));
}

function crmAddProspect(prospect) {
  const data = loadCRM();
  const newProspect = {
    id:          Date.now(),
    name:        prospect.name || 'Unknown',
    type:        prospect.type || 'barbershop',    // barbershop | brand | school
    contact:     prospect.contact || '',
    instagram:   prospect.instagram || '',
    status:      prospect.status || 'identified',  // identified | contacted | meeting | proposal | closed | lost
    value:       prospect.value || 0,              // estimated monthly value $
    notes:       prospect.notes || '',
    lastContact: prospect.lastContact || new Date().toISOString().slice(0, 10),
    createdAt:   new Date().toISOString().slice(0, 10),
    history:     [],
  };
  data.prospects.push(newProspect);
  saveCRM(data);
  broadcast('crm-update', data);
  return { ok: true, prospect: newProspect, crm: data };
}

function crmUpdateProspect(id, updates) {
  const data = loadCRM();
  const idx  = data.prospects.findIndex(p => p.id === id);
  if (idx === -1) return { ok: false, error: 'Prospect not found' };
  const prev = { ...data.prospects[idx] };
  data.prospects[idx] = { ...prev, ...updates, id };
  // Log history entry if status changed
  if (updates.status && updates.status !== prev.status) {
    data.prospects[idx].history = [
      { date: new Date().toISOString().slice(0, 10), action: `Status: ${prev.status} → ${updates.status}`, note: updates.notes || '' },
      ...(prev.history || []),
    ].slice(0, 20);
  }
  saveCRM(data);
  broadcast('crm-update', data);
  return { ok: true, prospect: data.prospects[idx], crm: data };
}

function crmDeleteProspect(id) {
  const data = loadCRM();
  data.prospects = data.prospects.filter(p => p.id !== id);
  saveCRM(data);
  broadcast('crm-update', data);
  return { ok: true, crm: data };
}

// ── Content Calendar ───────────────────────────────────────────────────────────
function loadContent() {
  if (!existsSync(CONTENT_FILE)) {
    const defaults = {
      items: [
        { id: 1, title: 'How to Nail the TDLR Practical Exam', type: 'blog', status: 'idea', audience: 'Students', priority: 'high', targetDate: '', notes: '' },
        { id: 2, title: 'Top 10 Clippers for Barbers in 2026', type: 'blog', status: 'idea', audience: 'Barbers', priority: 'high', targetDate: '', notes: '' },
        { id: 3, title: 'FadeJunkie Platform Launch Announcement', type: 'social', status: 'idea', audience: 'All', priority: 'medium', targetDate: '', notes: '' },
      ],
      lastUpdated: '',
    };
    writeFileSync(CONTENT_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try { return JSON.parse(readFileSync(CONTENT_FILE, 'utf-8')); }
  catch { return { items: [], lastUpdated: '' }; }
}

function saveContent(data) {
  data.lastUpdated = new Date().toISOString();
  writeFileSync(CONTENT_FILE, JSON.stringify(data, null, 2));
}

function contentAdd(item) {
  const data  = loadContent();
  const newId = Math.max(0, ...data.items.map(i => i.id)) + 1;
  const newItem = {
    id:         newId,
    title:      item.title || 'Untitled',
    type:       item.type || 'blog',         // blog | social | video | email
    status:     item.status || 'idea',       // idea | writing | review | scheduled | published
    audience:   item.audience || 'All',      // Barbers | Students | Shops | All
    priority:   item.priority || 'medium',   // high | medium | low
    targetDate: item.targetDate || '',
    notes:      item.notes || '',
    createdAt:  new Date().toISOString().slice(0, 10),
  };
  data.items.push(newItem);
  saveContent(data);
  broadcast('content-update', data);
  return { ok: true, item: newItem, content: data };
}

function contentUpdate(id, updates) {
  const data = loadContent();
  const idx  = data.items.findIndex(i => i.id === id);
  if (idx === -1) return { ok: false, error: 'Item not found' };
  data.items[idx] = { ...data.items[idx], ...updates, id };
  saveContent(data);
  broadcast('content-update', data);
  return { ok: true, item: data.items[idx], content: data };
}

function contentDelete(id) {
  const data  = loadContent();
  data.items  = data.items.filter(i => i.id !== id);
  saveContent(data);
  broadcast('content-update', data);
  return { ok: true, content: data };
}

// ── Notes (quick scratch pad) ──────────────────────────────────────────────────
function loadNotes() {
  if (!existsSync(NOTES_FILE)) {
    const defaults = { notes: [], lastUpdated: '' };
    writeFileSync(NOTES_FILE, JSON.stringify(defaults, null, 2));
    return defaults;
  }
  try { return JSON.parse(readFileSync(NOTES_FILE, 'utf-8')); }
  catch { return { notes: [] }; }
}

function addNote(text) {
  const data = loadNotes();
  const note = { id: Date.now(), text, createdAt: new Date().toISOString() };
  data.notes.unshift(note);
  data.notes    = data.notes.slice(0, 50); // keep last 50
  data.lastUpdated = new Date().toISOString();
  writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
  broadcast('notes-update', data);
  return { ok: true, note, notes: data };
}

function deleteNote(id) {
  const data = loadNotes();
  data.notes = data.notes.filter(n => n.id !== id);
  data.lastUpdated = new Date().toISOString();
  writeFileSync(NOTES_FILE, JSON.stringify(data, null, 2));
  broadcast('notes-update', data);
  return { ok: true, notes: data };
}

// ── Git diff / rich changelog ──────────────────────────────────────────────────
function getGitDiff(hash) {
  if (!hash || hash.includes(';') || hash.includes('&') || hash.includes('|')) {
    return { ok: false, error: 'Invalid hash' };
  }
  try {
    const diff  = git(`show ${hash} --stat --no-color`);
    const body  = git(`show ${hash} --no-color --format="" -p`).slice(0, 8000);
    const msg   = git(`log -1 --format="%s" ${hash}`);
    const date  = git(`log -1 --format="%ad" --date=short ${hash}`);
    const author= git(`log -1 --format="%an" ${hash}`);
    return { ok: true, hash, msg, date, author, stat: diff.slice(0, 2000), diff: body };
  } catch (e) { return { ok: false, error: e.message }; }
}

// ── Business Insights Engine ───────────────────────────────────────────────────
function buildInsights() {
  const metrics = loadMetrics();
  const crm     = loadCRM();
  const content = loadContent();
  const goals   = buildGoals();

  const today      = new Date();
  const q1End      = new Date('2026-03-31');
  const daysLeft   = Math.max(0, Math.ceil((q1End - today) / 86400000));
  const insights   = [];
  const highlights = [];

  // ── Goal Velocity ──
  if (goals.total > 0 && goals.done === 0 && daysLeft > 0) {
    insights.push({
      type:    'warning',
      icon:    '⚡',
      title:   'No goals completed yet',
      body:    `${daysLeft} days left in Q1. Pick one goal and move on it today.`,
      action:  'Open Q1 Goals → mark first item done',
    });
  } else if (goals.done > 0) {
    const pace = (goals.done / goals.total) * 100;
    highlights.push({ label: 'Goal velocity', value: `${goals.done}/${goals.total}`, sub: `${Math.round(pace)}% complete` });
  }

  // ── User Growth ──
  const users    = metrics.users;
  const needed   = (users?.target || 10) - (users?.count || 0);
  const perDay   = daysLeft > 0 ? (needed / daysLeft).toFixed(1) : 0;
  if (needed > 0) {
    insights.push({
      type:   'action',
      icon:   '👥',
      title:  `Need ${needed} more barbers to hit Q1 target`,
      body:   `${daysLeft} days left. Need ~${perDay} signups/day. Focus: demo profiles, direct outreach.`,
      action: 'Create barber outreach task → FUNKIE',
    });
  } else if (users?.count >= users?.target) {
    highlights.push({ label: 'Barber signups', value: users.count, sub: '🎯 Q1 target hit!' });
  }

  // ── Revenue ──
  const mrr = metrics.mrr;
  if ((mrr?.count || 0) === 0) {
    insights.push({
      type:   'action',
      icon:   '💰',
      title:  'Revenue is $0 — Pro tier not launched',
      body:   'No payment processor, no Pro tier, no affiliate tracking. Define Pro tier features first.',
      action: 'Send "Define Pro Tier" task → FUNKIE',
    });
  }

  // ── CRM ──
  const identified  = crm.prospects?.filter(p => p.status === 'identified').length ?? 0;
  const contacted   = crm.prospects?.filter(p => p.status === 'contacted').length ?? 0;
  const stalePros   = crm.prospects?.filter(p => {
    if (!p.lastContact) return false;
    const daysSince = (today - new Date(p.lastContact)) / 86400000;
    return daysSince > 7 && p.status !== 'closed' && p.status !== 'lost';
  }) ?? [];

  if (stalePros.length > 0) {
    insights.push({
      type:   'warning',
      icon:   '📞',
      title:  `${stalePros.length} prospect${stalePros.length > 1 ? 's' : ''} not contacted in 7+ days`,
      body:   stalePros.map(p => p.name).join(', '),
      action: 'Follow up → update status in CRM',
    });
  }

  if ((metrics.clients?.count || 0) === 0 && crm.prospects?.length > 0) {
    const closestPro = crm.prospects.filter(p => p.status === 'contacted' || p.status === 'meeting');
    if (closestPro.length > 0) {
      highlights.push({ label: 'Closest to close', value: closestPro[0].name, sub: closestPro[0].status });
    }
  }

  // ── Content ──
  const publishing  = content.items?.filter(i => i.status === 'writing' || i.status === 'review').length ?? 0;
  const published   = content.items?.filter(i => i.status === 'published').length ?? 0;
  const highPriIdle = content.items?.filter(i => i.priority === 'high' && i.status === 'idea').length ?? 0;

  if (highPriIdle > 0) {
    insights.push({
      type:   'action',
      icon:   '✍️',
      title:  `${highPriIdle} high-priority content item${highPriIdle > 1 ? 's' : ''} still at "idea"`,
      body:   content.items?.filter(i => i.priority === 'high' && i.status === 'idea').map(i => i.title.slice(0, 50)).join(' · '),
      action: 'Move to "writing" → assign to SEO Engine',
    });
  }

  if (published > 0) {
    highlights.push({ label: 'Content published', value: published, sub: `${publishing} in progress` });
  }

  // ── P0 Issues ──
  const audit = buildAudit();
  if (audit.counts?.P0 > 0) {
    insights.push({
      type:   'critical',
      icon:   '🚨',
      title:  `${audit.counts.P0} P0 issues blocking platform`,
      body:   audit.items?.filter(i => i.priority === 'P0').map(i => i.title).join(' · '),
      action: 'Approve codebase-audit.md → FUNKIE execute',
    });
  }

  return {
    daysLeft,
    q1End:      '2026-03-31',
    insights,
    highlights,
    score:      Math.max(0, 100 - (insights.length * 15) + (goals.done * 5) + ((metrics.users?.count || 0) * 3)),
  };
}

// ── Revenue Projections ────────────────────────────────────────────────────────
function buildProjections() {
  const crm     = loadCRM();
  const metrics = loadMetrics();
  const today   = new Date();
  const q1End   = new Date('2026-03-31');
  const daysLeft = Math.max(0, Math.ceil((q1End - today) / 86400000));

  // Close probability by stage
  const CLOSE_RATE = { identified: 0.10, contacted: 0.30, meeting: 0.60, proposal: 0.80, closed: 1.0 };

  const prospects = crm.prospects || [];
  let pipelineValue = 0;
  let weightedValue = 0;
  const byStage = {};

  for (const p of prospects) {
    const rate = CLOSE_RATE[p.status] ?? 0;
    const val  = Number(p.value) || 0;
    pipelineValue += val;
    weightedValue += val * rate;
    byStage[p.status] = (byStage[p.status] || 0) + 1;
  }

  const currentMRR   = Number(metrics.mrr?.count) || 0;
  const projectedMRR = Math.round(weightedValue + currentMRR);
  const daysToFirstDollar = currentMRR > 0 ? 0 : (weightedValue > 0 ? Math.round(daysLeft * 0.4) : null);

  // Service arm potential: ~4 clients × avg ticket
  const avgTicket  = prospects.length > 0 ? Math.round(pipelineValue / prospects.length) : 500;
  const clientTarget = Number(metrics.clients?.target) || 2;
  const serviceMRR = clientTarget * avgTicket;

  return {
    currentMRR,
    projectedMRR,
    pipelineValue,
    weightedValue: Math.round(weightedValue),
    prospectsTotal: prospects.length,
    byStage,
    daysLeft,
    daysToFirstDollar,
    serviceMRR,
    summary: projectedMRR > 0
      ? `Weighted pipeline: $${weightedValue.toLocaleString()}/mo — ${prospects.length} prospect${prospects.length !== 1 ? 's' : ''}`
      : 'No pipeline value yet. Add prospects to CRM.',
  };
}

function buildChangelog() {
  const lines = git('log --oneline -20').split('\n').filter(Boolean);
  return lines.map(line => {
    const sp   = line.indexOf(' ');
    const hash = line.slice(0, sp);
    const msg  = line.slice(sp + 1);
    const date = git(`log -1 --format="%ad" --date=short ${hash}`);
    try {
      const stat   = git(`diff --stat ${hash}^..${hash} 2>/dev/null`);
      const files  = (stat.match(/\d+ files? changed/)?.[0] ?? '').replace(' changed', '');
      const ins    = stat.match(/(\d+) insertions?/)?.[1] ?? '0';
      const del    = stat.match(/(\d+) deletions?/)?.[1] ?? '0';
      return { hash, msg, date, files, insertions: ins, deletions: del };
    } catch { return { hash, msg, date, files: '', insertions: '0', deletions: '0' }; }
  });
}

// ── File watcher → SSE broadcast ──────────────────────────────────────────────
const WATCH_PATHS = [
  'funkie/inbox', 'funkie/outbox', 'funkie/outbox/pending',
  'lobe/inbox',   'lobe/outbox',   'lobe/outbox/pending',
  'seo-engine/inbox', 'seo-engine/outbox', 'seo-engine/outbox/pending',
  'context',
];

let debounceTimer = null;
for (const rel of WATCH_PATHS) {
  const absPath = join(ROOT, rel);
  if (!existsSync(absPath)) continue;
  try {
    watch(absPath, { recursive: false }, (_event, _filename) => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        const status     = buildStatus();
        const statusStr  = JSON.stringify(status);
        if (statusStr !== lastStatusHash) {
          lastStatusHash = statusStr;
          broadcast('status', status);
        }
      }, 500);
    });
  } catch {}
}

// ── HTTP Routing helpers ──────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin':  '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

function json(res, data, status = 200) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', ...CORS });
  res.end(JSON.stringify(data, null, 2));
}

function parseBody(req) {
  return new Promise(resolve => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => { try { resolve(JSON.parse(body)); } catch { resolve({}); } });
  });
}

function safeName(s) {
  return typeof s === 'string' && !s.includes('..') && !s.includes('/') && !s.includes('\\') && s.length > 0 && s.length < 200;
}

// ── Server ─────────────────────────────────────────────────────────────────────
const server = createServer(async (req, res) => {
  const url    = new URL(req.url, `http://localhost:${PORT}`);
  const path   = url.pathname;
  const method = req.method;

  if (method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }

  // ── SSE ──────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/sse') {
    res.writeHead(200, {
      'Content-Type':  'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection':    'keep-alive',
      ...CORS,
    });
    res.write(':ok\n\n');
    // Send initial status
    try { res.write(`event: status\ndata: ${JSON.stringify(buildStatus())}\n\n`); } catch {}
    sseClients.add(res);
    const pingIv = setInterval(() => {
      try { res.write(':ping\n\n'); } catch { clearInterval(pingIv); sseClients.delete(res); }
    }, 25000);
    req.on('close', () => { clearInterval(pingIv); sseClients.delete(res); });
    return;
  }

  // ── GET / ─────────────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/') {
    const htmlPath = join(CC_DIR, 'cc-dashboard.html');
    if (existsSync(htmlPath)) {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(readFileSync(htmlPath, 'utf-8'));
    } else {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(`<!DOCTYPE html><html><body style="background:#0f0a04;color:#fff4ea;font-family:monospace;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:12px"><h2 style="color:#d97706">FADEJUNKIE CC</h2><p>Dashboard not built. API live: <a href="/api/status" style="color:#d97706">/api/status</a></p></body></html>`);
    }
    return;
  }

  // ── GET /api/status ───────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/status') {
    try { json(res, buildStatus()); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/envvars ──────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/envvars') {
    try { json(res, { vars: buildEnvVars() }); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/health ───────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/health') {
    try { json(res, await buildHealth()); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/audit ────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/audit') {
    try { json(res, buildAudit()); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/audit-detail ─────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/audit-detail') {
    const num    = parseInt(url.searchParams.get('num') ?? '0', 10);
    const audit  = buildAudit();
    const item   = audit.items[num - 1];
    if (!item) { json(res, { ok: false, error: 'Item not found' }, 404); return; }
    json(res, { ok: true, item, num });
    return;
  }

  // ── GET /api/tasks ────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/tasks') {
    try { json(res, { tasks: buildTaskHistory() }); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/resources ────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/resources') {
    try { json(res, { categories: buildResources() }); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/plan ─────────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/plan') {
    const agent    = url.searchParams.get('agent');
    const filename = url.searchParams.get('file');
    if (!safeName(agent) || !safeName(filename)) { json(res, { ok: false, error: 'Invalid params' }, 400); return; }
    json(res, getPlan(agent, filename));
    return;
  }

  // ── GET /api/metrics ──────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/metrics') {
    try { json(res, loadMetrics()); } catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── POST /api/approve ─────────────────────────────────────────────────────
  if (method === 'POST' && path === '/api/approve') {
    const body = await parseBody(req);
    if (!safeName(body.agent) || !safeName(body.file)) {
      json(res, { ok: false, error: 'Invalid agent or file' }, 400); return;
    }
    json(res, approveAgentPlan(body.agent, body.file));
    return;
  }

  // ── POST /api/task ────────────────────────────────────────────────────────
  if (method === 'POST' && path === '/api/task') {
    const body = await parseBody(req);
    if (!safeName(body.agent) || !safeName(body.file) || typeof body.content !== 'string') {
      json(res, { ok: false, error: 'agent, file, content required' }, 400); return;
    }
    json(res, sendTask(body.agent, body.file, body.content));
    return;
  }

  // ── POST /api/goal-toggle ─────────────────────────────────────────────────
  if (method === 'POST' && path === '/api/goal-toggle') {
    const body = await parseBody(req);
    if (typeof body.label !== 'string' || typeof body.checked !== 'boolean') {
      json(res, { ok: false, error: 'label and checked required' }, 400); return;
    }
    json(res, toggleGoal(body.arm, body.subsection, body.label, body.checked));
    return;
  }

  // ── POST /api/metrics ─────────────────────────────────────────────────────
  if (method === 'POST' && path === '/api/metrics') {
    const body = await parseBody(req);
    const data = loadMetrics();
    if (body.key && body.key in data && typeof body.count === 'number') {
      data[body.key].count   = body.count;
      data[body.key].updated = new Date().toISOString().slice(0, 10);
      if (body.note) {
        if (!data.notes) data.notes = [];
        data.notes.unshift({ date: new Date().toISOString().slice(0, 10), key: body.key, note: body.note });
        data.notes = data.notes.slice(0, 20); // keep last 20 notes
      }
      saveMetrics(data);
      broadcast('metrics-update', data);
      json(res, { ok: true, metrics: data });
    } else {
      json(res, { ok: false, error: 'Invalid key or count' }, 400);
    }
    return;
  }

  // ── DELETE /api/pending ───────────────────────────────────────────────────
  if (method === 'DELETE' && path === '/api/pending') {
    const body = await parseBody(req);
    if (!safeName(body.agent) || !safeName(body.file)) {
      json(res, { ok: false, error: 'Invalid agent or file' }, 400); return;
    }
    json(res, rejectPendingPlan(body.agent, body.file));
    return;
  }

  // ── GET /api/reveal ───────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/reveal') {
    const clientIp = req.socket.remoteAddress;
    if (!['::1', '127.0.0.1', '::ffff:127.0.0.1'].includes(clientIp)) {
      json(res, { ok: false, error: 'Localhost only' }, 403); return;
    }
    const key = url.searchParams.get('key');
    if (!key) { json(res, { ok: false, error: 'key required' }, 400); return; }
    json(res, revealEnvVar(key));
    return;
  }

  // ── GET /api/insights ────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/insights') {
    try { json(res, buildInsights()); }
    catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/projections ──────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/projections') {
    try { json(res, buildProjections()); }
    catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/seo-insights ─────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/seo-insights') {
    try {
      const seoOutbox = join(ROOT, 'seo-engine', 'outbox');
      const seoInsights = [];
      if (existsSync(seoOutbox)) {
        const files = readdirSync(seoOutbox)
          .filter(f => !f.startsWith('_done-') && f.endsWith('.md'))
          .sort((a, b) => b.localeCompare(a))
          .slice(0, 5);
        for (const f of files) {
          const content = readFileSync(join(seoOutbox, f), 'utf-8');
          const title   = content.split('\n').find(l => l.startsWith('# '))?.replace(/^#+\s*/, '') ?? f;
          const preview = content.split('\n').filter(l => l.trim() && !l.startsWith('#')).slice(0, 2).join(' ').slice(0, 200);
          seoInsights.push({ file: f, title, preview });
        }
      }
      json(res, { insights: seoInsights });
    } catch (e) { json(res, { insights: [], error: e.message }); }
    return;
  }

  // ── GET /api/git-diff ────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/git-diff') {
    const hash = url.searchParams.get('hash');
    if (!hash) { json(res, { ok: false, error: 'hash required' }, 400); return; }
    json(res, getGitDiff(hash));
    return;
  }

  // ── GET /api/changelog ────────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/changelog') {
    try { json(res, { log: buildChangelog() }); }
    catch (e) { json(res, { error: e.message }, 500); }
    return;
  }

  // ── GET /api/task-history ─────────────────────────────────────────────────
  if (method === 'GET' && path === '/api/task-history') {
    const agents = ['funkie', 'lobe', 'seo-engine'];
    const history = [];
    for (const agent of agents) {
      const outboxDir = join(ROOT, agent, 'outbox');
      try {
        const files = readdirSync(outboxDir).filter(f => f.startsWith('_done-') && f.endsWith('.md'));
        for (const f of files) {
          const taskName = f.replace(/^_done-/, '').replace(/\.md$/, '');
          // Look for matching timestamped result file
          const resultFiles = readdirSync(outboxDir).filter(r => r.startsWith(taskName + '-') && r.endsWith('.md') && !r.startsWith('_done-'));
          let timestamp = null;
          if (resultFiles.length > 0) {
            const tsMatch = resultFiles[0].match(/(\d{4}-\d{2}-\d{2}T[\d-]+Z)\.md$/);
            if (tsMatch) timestamp = tsMatch[1].replace(/T(\d{2})-(\d{2})-(\d{2})-\d+Z$/, 'T$1:$2:$3Z');
          }
          history.push({ agent, task: taskName, timestamp, date: timestamp ? timestamp.slice(0, 10) : null });
        }
      } catch {}
    }
    history.sort((a, b) => (b.timestamp || '').localeCompare(a.timestamp || ''));
    json(res, { history });
    return;
  }

  // ── Notes ─────────────────────────────────────────────────────────────────
  if (path === '/api/notes') {
    if (method === 'GET') { json(res, loadNotes()); return; }
    const body = await parseBody(req);
    if (method === 'POST') {
      if (!body.text?.trim()) { json(res, { ok: false, error: 'text required' }, 400); return; }
      json(res, addNote(body.text.trim())); return;
    }
    if (method === 'DELETE') {
      if (!body.id) { json(res, { ok: false, error: 'id required' }, 400); return; }
      json(res, deleteNote(body.id)); return;
    }
  }

  // ── CRM ───────────────────────────────────────────────────────────────────
  if (path === '/api/crm') {
    if (method === 'GET') { json(res, loadCRM()); return; }
    const body = await parseBody(req);
    if (method === 'POST') {
      if (!body.name) { json(res, { ok: false, error: 'name required' }, 400); return; }
      json(res, crmAddProspect(body)); return;
    }
    if (method === 'PATCH') {
      if (!body.id) { json(res, { ok: false, error: 'id required' }, 400); return; }
      json(res, crmUpdateProspect(body.id, body)); return;
    }
    if (method === 'DELETE') {
      if (!body.id) { json(res, { ok: false, error: 'id required' }, 400); return; }
      json(res, crmDeleteProspect(body.id)); return;
    }
  }

  // ── Content Calendar ───────────────────────────────────────────────────────
  if (path === '/api/content') {
    if (method === 'GET') { json(res, loadContent()); return; }
    const body = await parseBody(req);
    if (method === 'POST') {
      if (!body.title) { json(res, { ok: false, error: 'title required' }, 400); return; }
      json(res, contentAdd(body)); return;
    }
    if (method === 'PATCH') {
      if (!body.id) { json(res, { ok: false, error: 'id required' }, 400); return; }
      json(res, contentUpdate(body.id, body)); return;
    }
    if (method === 'DELETE') {
      if (!body.id) { json(res, { ok: false, error: 'id required' }, 400); return; }
      json(res, contentDelete(body.id)); return;
    }
  }

  res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found');
});

server.listen(PORT, () => {
  console.log(`\n  ┌──────────────────────────────────────────────┐`);
  console.log(`  │   FADEJUNKIE CC — SERVER v2  :${PORT}            │`);
  console.log(`  └──────────────────────────────────────────────┘`);
  console.log(`\n  http://localhost:${PORT}`);
  console.log(`\n  Routes: / | /sse | /api/status | /api/envvars`);
  console.log(`          /api/health | /api/audit | /api/audit-detail`);
  console.log(`          /api/tasks | /api/resources | /api/plan`);
  console.log(`          /api/metrics | /api/approve | /api/task`);
  console.log(`          /api/goal-toggle | DELETE /api/pending | /api/reveal\n`);
});
