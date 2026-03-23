import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const SEO_ENGINE_ROOT = path.join(WORKSPACE_ROOT, "seo-engine");
const INBOX_DIR = path.join(SEO_ENGINE_ROOT, "inbox");
const OUTBOX_DIR = path.join(SEO_ENGINE_ROOT, "outbox");
const PENDING_DIR = path.join(SEO_ENGINE_ROOT, "outbox", "pending");
const FADEJUNKIE_SEO_FILE = path.join(SEO_ENGINE_ROOT, "context", "fadejunkie-seo.md");
const CLIENTS_DIR = path.join(SEO_ENGINE_ROOT, "context", "clients");
const GROWTH_FILE = path.join(SEO_ENGINE_ROOT, "memory", "seo-knowledge.md");
const SESSION_FILE = path.join(SEO_ENGINE_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are the SEO Engine — Anthony's dedicated SEO strategist and deliverable producer.

You serve two mandates:
1. FadeJunkie SEO — grow organic visibility for fadejunkie.com (barber community, state board tools, local SEO)
2. Inbound Client SEO — produce professional SEO deliverables for Anthony's clients

Deliverable types you produce:
- Keyword research reports (primary + LSI, intent mapping, difficulty/volume estimates)
- Technical SEO audits (crawlability, meta, schema, Core Web Vitals recommendations, canonical issues)
- Content briefs (target keyword, outline, word count, internal link targets, schema type)
- SEO strategy documents (6-month roadmap, quick wins, priority matrix)
- On-page optimization checklists
- Competitor gap analysis
- Local SEO packs (Google Business Profile copy, citation building list, NAP consistency check)
- Backlink outreach templates

Research methodology:
- Use WebSearch to analyze SERPs for target keywords before recommending
- Use WebFetch to audit competitor pages, pull schema, inspect title/meta patterns
- Cite all sources in deliverables
- Always include difficulty assessment and effort/impact matrix

Output standards:
- All deliverables written in clean, professional markdown
- Include executive summary for client-facing docs
- Quantify everything: search volume estimates, difficulty scores, timeline
- Never fabricate metrics — always clearly label estimates vs. verified data

---

## Workflow

### Context
At the start of every task you receive two context blocks:
1. SEO Knowledge — accumulated patterns and methodology from memory/seo-knowledge.md
2. Project/Client Context — fadejunkie-seo.md (default) or the active client file

After completing any EXECUTE task, update ${GROWTH_FILE} — append new patterns, sources, or insights learned.

### Plan vs Execute Mode
Tasks arrive in two modes — check the task headers:

**PLAN mode** (default — no <!-- execute --> flag):
- Research SERPs, competitor pages, and related sources using WebSearch and WebFetch
- Do NOT write final deliverables yet
- Write a detailed plan to: ${PENDING_DIR}/<task-name>.md
- Plan format:
  ## Plan: <task-name>
  ### Strategy
  ### Deliverables I'll Produce
  ### Sources to Review
  ### Ready to execute

**EXECUTE mode** (task starts with <!-- execute -->):
- Produce full deliverables based on the approved plan
- Write timestamped result to ${OUTBOX_DIR}/<task-name>-<timestamp>.md
- Update ${GROWTH_FILE} with any new patterns/insights

### No Direct App Edits
The SEO Engine does NOT edit the Next.js codebase in ${WORKSPACE_ROOT}/app/.
When changes need to land in the app (meta tags, sitemaps, structured data), produce a task brief and note it at the end of the deliverable — Anthony will drop it in funkie/inbox/ for Funkie to execute.

Own every recommendation. Cite your sources. Be precise.`;

// ── Task header parsing ────────────────────────────────────────────────────────

interface TaskHeaders {
  executeMode: boolean;
  clientSlug: string | null;
}

function parseTaskHeaders(content: string): TaskHeaders {
  const executeMode = content.startsWith("<!-- execute -->");
  const clientMatch = content.match(/<!--\s*client:\s*([a-zA-Z0-9_-]+)\s*-->/);
  const clientSlug = clientMatch ? clientMatch[1].toLowerCase() : null;
  return { executeMode, clientSlug };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function saveSession(sessionId: string) {
  fs.writeFileSync(SESSION_FILE, sessionId, "utf-8");
}

function loadLastSession(): string | null {
  try {
    const id = fs.readFileSync(SESSION_FILE, "utf-8").trim();
    return id || null;
  } catch {
    return null;
  }
}

function loadSeoKnowledge(): string {
  try {
    return fs.readFileSync(GROWTH_FILE, "utf-8").trim();
  } catch {
    return "";
  }
}

function loadProjectContext(clientSlug: string | null): string {
  if (clientSlug) {
    const clientFile = path.join(CLIENTS_DIR, `${clientSlug}.md`);
    try {
      const content = fs.readFileSync(clientFile, "utf-8").trim();
      if (content) return content;
      console.warn(`  [warn] Client file not found: ${clientFile} — falling back to fadejunkie-seo.md`);
    } catch {
      console.warn(`  [warn] Could not read client file: ${clientFile} — falling back to fadejunkie-seo.md`);
    }
  }
  try {
    return fs.readFileSync(FADEJUNKIE_SEO_FILE, "utf-8").trim();
  } catch {
    return "";
  }
}

function getInboxTasks(): string[] {
  try {
    return fs
      .readdirSync(INBOX_DIR)
      .filter((f) => f.endsWith(".md") || f.endsWith(".txt"))
      .sort();
  } catch {
    return [];
  }
}

function getPendingTasks(): string[] {
  try {
    return fs
      .readdirSync(PENDING_DIR)
      .filter((f) => f.endsWith(".md") || f.endsWith(".txt"))
      .sort();
  } catch {
    return [];
  }
}

function writeOutbox(taskName: string, result: string, sessionId: string): string {
  const ts = new Date().toISOString().replace(/[:.]/g, "-");
  const outFile = path.join(OUTBOX_DIR, `${taskName}-${ts}.md`);
  const content = `# Result: ${taskName}\n\nTimestamp: ${ts}\nSession: ${sessionId}\n\n---\n\n${result}\n`;
  fs.writeFileSync(outFile, content, "utf-8");
  return outFile;
}

function writePending(taskName: string, plan: string): string {
  const outFile = path.join(PENDING_DIR, `${taskName}.md`);
  fs.writeFileSync(outFile, plan, "utf-8");
  return outFile;
}

// ── Query ─────────────────────────────────────────────────────────────────────

async function runQuery(
  userPrompt: string,
  opts: { executeMode?: boolean; clientSlug?: string | null; resumeSession?: string } = {}
): Promise<{ result: string; sessionId: string }> {
  const knowledge = loadSeoKnowledge();
  const projectContext = loadProjectContext(opts.clientSlug ?? null);

  const modeLine = opts.executeMode ? "<!-- execute -->\n\n" : "";
  const knowledgeBlock = knowledge ? `## SEO Knowledge\n\n${knowledge}\n\n---\n\n` : "";
  const contextBlock = projectContext ? `## Project Context\n\n${projectContext}\n\n---\n\n` : "";
  const fullPrompt = `${modeLine}${knowledgeBlock}${contextBlock}## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd: SEO_ENGINE_ROOT,
      model: "claude-opus-4-6",
      systemPrompt: SYSTEM_PROMPT,
      allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebSearch", "WebFetch"],
      permissionMode: "default",
      maxTurns: 40,
      ...(opts.resumeSession ? { resume: opts.resumeSession } : {}),
    },
  })) {
    if ("result" in message) {
      result = String(message.result);
    }
    if ("sessionId" in message && message.sessionId) {
      sessionId = String(message.sessionId);
    }
  }

  return { result, sessionId };
}

// ── Inbox processing ──────────────────────────────────────────────────────────

async function processTask(taskFile: string, silent = false) {
  const taskPath = path.join(INBOX_DIR, taskFile);
  if (!fs.existsSync(taskPath)) return;

  const taskContent = fs.readFileSync(taskPath, "utf-8").trim();
  if (!taskContent) return;

  const taskName = path.basename(taskFile, path.extname(taskFile));
  const { executeMode, clientSlug } = parseTaskHeaders(taskContent);

  if (!silent) {
    const clientNote = clientSlug ? ` [client: ${clientSlug}]` : "";
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} (${executeMode ? "EXECUTE" : "PLAN"})${clientNote}`);
    process.stdout.write("seo-engine → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { executeMode, clientSlug });
  console.log(result);

  const sid = sessionId || `no-session-${Date.now()}`;
  if (sessionId) saveSession(sessionId);

  if (executeMode) {
    // Write full deliverable to outbox
    const outFile = writeOutbox(taskName, result, sid);
    console.log(`\n  [outbox] ${path.basename(outFile)}`);
  } else {
    // Write plan to pending/
    const pendingFile = writePending(taskName, result);
    console.log(`\n  [pending] ${path.basename(pendingFile)}`);
    console.log(`  → Review plan, then: approve ${taskName}`);
  }

  if (sessionId) console.log(`  [session] ${sessionId}`);

  // Archive source task
  const doneFile = path.join(OUTBOX_DIR, `_done-${taskFile}`);
  fs.renameSync(taskPath, doneFile);
}

async function processInbox() {
  const tasks = getInboxTasks();
  if (tasks.length === 0) {
    console.log("  [inbox] No pending tasks.\n");
    return;
  }
  console.log(`  [inbox] ${tasks.length} task(s) found\n`);
  for (const taskFile of tasks) {
    try {
      await processTask(taskFile);
    } catch (err) {
      console.error(`  [error] ${taskFile}:`, err instanceof Error ? err.message : err);
    }
  }
}

// ── Approve ───────────────────────────────────────────────────────────────────

function approveTask(taskName: string) {
  const pendingFile = path.join(PENDING_DIR, `${taskName}.md`);
  if (!fs.existsSync(pendingFile)) {
    const matches = getPendingTasks().filter((f) => f.startsWith(taskName));
    if (matches.length === 0) {
      console.log(`  [approve] No pending task found: ${taskName}`);
      console.log(`  Available: ${getPendingTasks().join(", ") || "none"}`);
      return;
    }
    return approveTask(path.basename(matches[0], path.extname(matches[0])));
  }

  const plan = fs.readFileSync(pendingFile, "utf-8");
  const executeContent = `<!-- execute -->\n\n${plan}`;
  const inboxFile = path.join(INBOX_DIR, `${taskName}.md`);
  fs.writeFileSync(inboxFile, executeContent, "utf-8");
  fs.unlinkSync(pendingFile);
  console.log(`  [approve] Moved to inbox: ${taskName}.md`);
  console.log(`  → SEO Engine will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║         SEO ENGINE — daemon mode          ║");
  console.log("║       watching: inbox/                    ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log(`  inbox:   ${INBOX_DIR}`);
  console.log(`  outbox:  ${OUTBOX_DIR}`);
  console.log(`  pending: ${PENDING_DIR}`);
  console.log(`  context: ${FADEJUNKIE_SEO_FILE}\n`);
  console.log("  waiting for tasks...\n");

  // Drain anything already in inbox
  await processInbox();

  const processing = new Set<string>();

  fs.watch(INBOX_DIR, async (eventType, filename) => {
    if (!filename) return;
    if (!filename.endsWith(".md") && !filename.endsWith(".txt")) return;
    if (processing.has(filename)) return;

    const filePath = path.join(INBOX_DIR, filename);
    await new Promise((r) => setTimeout(r, 300));
    if (!fs.existsSync(filePath)) return;

    processing.add(filename);
    try {
      await processTask(filename);
      console.log("  waiting for tasks...\n");
    } catch (err) {
      console.error(`  [error]`, err instanceof Error ? err.message : err);
    }
    processing.delete(filename);
  });
}

// ── REPL ──────────────────────────────────────────────────────────────────────

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
function prompt(q: string): Promise<string> {
  return new Promise((resolve) => rl.question(q, resolve));
}

async function main() {
  const lastSession = loadLastSession();
  const pending = getPendingTasks();

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║           SEO ENGINE                      ║");
  console.log("║     point of contact: twanii              ║");
  console.log("╚══════════════════════════════════════════╝");
  if (lastSession) console.log(`\n  last session: ${lastSession}`);
  if (pending.length > 0) console.log(`  pending approval: ${pending.join(", ")}`);
  console.log(`\n  Commands: check | approve <name> | resume | exit\n`);

  while (true) {
    const input = await prompt("twanii → ");
    const trimmed = input.trim();
    if (!trimmed) continue;

    if (trimmed.toLowerCase() === "exit") {
      console.log("\nSEO Engine out.\n");
      rl.close();
      break;
    }

    if (trimmed.toLowerCase() === "check") {
      await processInbox();
      continue;
    }

    if (trimmed.toLowerCase().startsWith("approve ")) {
      const taskName = trimmed.slice(8).trim();
      approveTask(taskName);
      continue;
    }

    if (trimmed.toLowerCase() === "approve") {
      const tasks = getPendingTasks();
      if (tasks.length === 0) {
        console.log("  [approve] No pending tasks.\n");
      } else {
        console.log(`  Pending tasks:\n  ${tasks.map((t, i) => `${i + 1}. ${t}`).join("\n  ")}`);
        console.log(`\n  Usage: approve <task-name>\n`);
      }
      continue;
    }

    if (trimmed.toLowerCase() === "resume") {
      const sessionId = loadLastSession();
      if (!sessionId) { console.log("  [session] No saved session.\n"); continue; }
      console.log(`  [session] Resuming ${sessionId}...\n`);
      const nextInput = await prompt("twanii (resuming) → ");
      if (!nextInput.trim()) continue;
      process.stdout.write("\nseo-engine → ");
      try {
        const { result, sessionId: newId } = await runQuery(nextInput.trim(), { resumeSession: sessionId });
        console.log(result);
        if (newId) { saveSession(newId); console.log(`\n  [session] ${newId}`); }
      } catch (err) {
        console.error("\n[error]", err instanceof Error ? err.message : err);
      }
      console.log();
      continue;
    }

    // Free-form query (plan mode by default)
    process.stdout.write("\nseo-engine → ");
    try {
      const { result, sessionId } = await runQuery(trimmed);
      console.log(result);
      if (sessionId) { saveSession(sessionId); console.log(`\n  [session] ${sessionId}`); }
    } catch (err) {
      console.error("\n[error]", err instanceof Error ? err.message : err);
    }
    console.log();
  }
}

// ── Entry point ───────────────────────────────────────────────────────────────

if (process.argv.includes("--watch")) {
  runWatchMode();
} else {
  main();
}
