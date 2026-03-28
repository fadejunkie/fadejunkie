#!/usr/bin/env node
/**
 * Lobe Cron Runner
 *
 * Generates a task from instructions + design-rules, drops it in Lobe's inbox,
 * runs Lobe with bypass permissions, then commits + pushes to fadejunkie main.
 *
 * Usage:  node lobe/cron/runner.mjs
 * Cron:   Every 15 minutes via Windows Task Scheduler
 */

import { readFileSync, writeFileSync, existsSync, readdirSync } from 'fs';
import { execSync, spawn } from 'child_process';
import { join, resolve } from 'path';

const ROOT = resolve(import.meta.dirname, '..', '..');
const LOBE_DIR = join(ROOT, 'lobe');
const INBOX = join(LOBE_DIR, 'inbox');
const CRON_DIR = join(LOBE_DIR, 'cron');
const INSTRUCTIONS = join(CRON_DIR, 'instructions.md');
const DESIGN_RULES = join(CRON_DIR, 'design-rules.md');
const LOCKFILE = join(CRON_DIR, '.running');
const LOGFILE = join(CRON_DIR, 'cron.log');

// ── Helpers ──────────────────────────────────────────────────────────────────

function log(msg) {
  const ts = new Date().toISOString();
  const line = `[${ts}] ${msg}`;
  console.log(line);
  try {
    const existing = existsSync(LOGFILE) ? readFileSync(LOGFILE, 'utf8') : '';
    // Keep last 500 lines
    const lines = existing.split('\n').slice(-500);
    lines.push(line);
    writeFileSync(LOGFILE, lines.join('\n') + '\n');
  } catch { /* log failures are non-fatal */ }
}

function timestamp() {
  return new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
}

function gitExec(cmd) {
  return execSync(cmd, { cwd: ROOT, encoding: 'utf8', timeout: 30_000 }).trim();
}

// ── Preflight ────────────────────────────────────────────────────────────────

// Prevent overlapping runs
if (existsSync(LOCKFILE)) {
  const lockAge = Date.now() - new Date(readFileSync(LOCKFILE, 'utf8').trim()).getTime();
  if (lockAge < 12 * 60 * 1000) { // 12 min — allow some overlap margin for 15-min cycle
    log('SKIP: Previous run still active (lockfile age: ' + Math.round(lockAge / 60000) + 'min)');
    process.exit(0);
  }
  log('WARN: Stale lockfile detected, removing');
}
writeFileSync(LOCKFILE, new Date().toISOString());

function cleanup() {
  try { if (existsSync(LOCKFILE)) execSync(`rm "${LOCKFILE}"`); } catch {}
}
process.on('exit', cleanup);
process.on('SIGINT', () => { cleanup(); process.exit(1); });
process.on('SIGTERM', () => { cleanup(); process.exit(1); });

// Validate required files
if (!existsSync(INSTRUCTIONS)) {
  log('FATAL: Missing instructions.md at ' + INSTRUCTIONS);
  process.exit(1);
}
if (!existsSync(DESIGN_RULES)) {
  log('FATAL: Missing design-rules.md at ' + DESIGN_RULES);
  process.exit(1);
}

// Skip if Lobe inbox already has unprocessed tasks
const pending = readdirSync(INBOX).filter(f => f.endsWith('.md') || f.endsWith('.txt'));
if (pending.length > 0) {
  log('SKIP: Lobe inbox has ' + pending.length + ' unprocessed task(s): ' + pending.join(', '));
  process.exit(0);
}

// ── Generate Task ────────────────────────────────────────────────────────────

const instructions = readFileSync(INSTRUCTIONS, 'utf8');
const designRules = readFileSync(DESIGN_RULES, 'utf8');
const ts = timestamp();

const taskContent = `<!-- execute -->
<!-- max-turns: 25 -->

# Cron — Spot & Fix — ${ts}

> One imperfection. One fix. One design system update. Then stop.

---

${instructions}

---

## Design Rules Reference

${designRules}

---

## Post-Fix Protocol

1. Run \`npm run build\` in \`app/\` to verify no build errors
2. Stage changed files: \`git -C "${ROOT}" add -A\`
3. Commit: \`git -C "${ROOT}" commit -m "cron: <what you fixed> — <which file>"\`
4. Push: \`git -C "${ROOT}" push origin main\`
5. If build fails, revert your change and log \`BUILD FAILED\` — never push broken code
`;

const taskFilename = `cron-spot-fix-${ts}.md`;
const taskPath = join(INBOX, taskFilename);
writeFileSync(taskPath, taskContent);
log('Task created: ' + taskFilename);

// ── Run Lobe ─────────────────────────────────────────────────────────────────

log('Spawning Lobe agent...');

// Build env without CLAUDECODE to bypass nested session check
const cleanEnv = { ...process.env };
delete cleanEnv.CLAUDECODE;

const lobe = spawn('node', [join(ROOT, 'node_modules', 'tsx', 'dist', 'cli.mjs'), join(ROOT, 'lobe', 'lobe.ts')], {
  cwd: ROOT,
  stdio: ['pipe', 'pipe', 'pipe'],
  env: cleanEnv,
  timeout: 12 * 60 * 1000, // 12 min hard timeout (must finish before next 15-min cycle)
});

// Feed "check" command then keep stdin open
lobe.stdin.write('check\n');
setTimeout(() => { try { lobe.stdin.end(); } catch {} }, 8 * 60 * 1000);

let stdout = '';
let stderr = '';

lobe.stdout.on('data', (d) => { stdout += d.toString(); });
lobe.stderr.on('data', (d) => { stderr += d.toString(); });

lobe.on('close', (code) => {
  log('Lobe exited with code: ' + code);

  if (stdout.length > 0) {
    log('STDOUT (last 500 chars): ' + stdout.slice(-500));
  }
  if (stderr.length > 0) {
    log('STDERR (last 500 chars): ' + stderr.slice(-500));
  }

  // Check if Lobe already pushed (task instructions tell it to)
  // If not, do a safety push
  try {
    const status = gitExec('git status --porcelain');
    if (status.length > 0) {
      log('Unpushed changes detected, running safety commit+push...');
      gitExec('git add -A');
      gitExec(`git commit -m "cron: spot-fix ${ts} (runner safety commit)"`);
      gitExec('git push origin main');
      log('Safety push complete');
    } else {
      log('No uncommitted changes — Lobe handled the push or made no changes');
    }
  } catch (e) {
    log('Git safety push failed: ' + e.message);
  }

  log('Cron run complete');
  process.exit(code || 0);
});
