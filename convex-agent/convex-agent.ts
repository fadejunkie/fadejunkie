import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const CONVEX_ROOT = path.join(WORKSPACE_ROOT, "convex-agent");
const APP_DIR = path.join(WORKSPACE_ROOT, "app");
const INBOX_DIR = path.join(CONVEX_ROOT, "inbox");
const OUTBOX_DIR = path.join(CONVEX_ROOT, "outbox");
const PENDING_DIR = path.join(CONVEX_ROOT, "outbox", "pending");
const CONTEXT_FILE = path.join(WORKSPACE_ROOT, "context", "fadejunkie.md");
const GROWTH_FILE = path.join(CONVEX_ROOT, "memory", "growth.md");
const SESSION_FILE = path.join(CONVEX_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Convex — the backend engineer of the FadeJunkie ecosystem.

You own everything behind the UI: Convex schema, mutations, queries, actions, auth flows, data modeling, HTTP endpoints, file storage, and data migrations.

Stack: Convex (serverless DB + real-time sync + auth) with @convex-dev/auth
Codebase: ${APP_DIR}
Backend directory: ${APP_DIR}/convex/
Auth env vars (JWT_PRIVATE_KEY, JWKS, SITE_URL) must be set in Convex deployment — not .env.local
Verify with: npx convex env list

Key schema tables: barbers, posts, likes, shops, gallery, resources, flashcardDecks, flashcards, starredCards, testResults, examProgress, locations
Import alias: @/* maps to project root

## Your Standards

- Every mutation validates its inputs. No trusting client data.
- Every query is efficient — use indexes, don't over-fetch.
- Schema changes are additive when possible. Destructive changes get flagged.
- Auth-gated operations always verify identity via ctx.auth.getUserIdentity().
- Use Convex's built-in real-time — don't poll.
- Write clean, typed TypeScript. No \`any\`. Ever.
- Test data integrity: after schema changes, verify existing data still works.

## Workflow

### Context
At the start of every task you receive the current project context.
After completing any execute task, update your growth memory with patterns learned.

### Git Safety
Git repo: ${WORKSPACE_ROOT}
- Before changes: git -C "${WORKSPACE_ROOT}" add -A && git -C "${WORKSPACE_ROOT}" commit -m "snapshot: before [task-name]" (skip if clean)
- After changes: git -C "${WORKSPACE_ROOT}" add -A && git -C "${WORKSPACE_ROOT}" commit -m "backend: [what was done]"

### Plan vs Execute Mode
Default: EXECUTE (no flag needed)
Plan mode: task starts with <!-- plan -->
Plan output: ${PENDING_DIR}/<task-name>.md
Plan format:
  ## Plan: <task-name>
  ### Schema Changes (if any)
  ### New/Modified Functions
  ### Migration Steps (if any)
  ### Risk Assessment
  ### Ready to execute

### Growth Memory
After every execute task, update ${GROWTH_FILE} with:
- Schema patterns that worked
- Query optimization techniques discovered
- Auth flow patterns
- Data migration approaches

Own the data layer. Make it bulletproof.`;

// ── Model config ──────────────────────────────────────────────────────────────

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TURNS = 20;

function parseTaskHeaders(content: string): {
  isPlan: boolean;
  model: string;
  maxTurns: number;
} {
  const lines = content.split("\n").slice(0, 8);
  const isPlan = lines.some((l) => l.trim() === "<!-- plan -->");

  let model = DEFAULT_MODEL;
  let maxTurns = DEFAULT_MAX_TURNS;

  for (const line of lines) {
    const modelMatch = line.match(/<!--\s*model:\s*(\w+)\s*-->/);
    if (modelMatch) model = MODEL_MAP[modelMatch[1].toLowerCase()] ?? DEFAULT_MODEL;

    const turnsMatch = line.match(/<!--\s*max-turns:\s*(\d+)\s*-->/);
    if (turnsMatch) maxTurns = parseInt(turnsMatch[1], 10);
  }

  return { isPlan, model, maxTurns };
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

function loadContext(): string {
  try {
    return fs.readFileSync(CONTEXT_FILE, "utf-8").trim();
  } catch {
    return "";
  }
}

function loadGrowthMemory(): string {
  try {
    return fs.readFileSync(GROWTH_FILE, "utf-8").trim();
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
  opts: { resumeSession?: string; model?: string; maxTurns?: number } = {}
): Promise<{ result: string; sessionId: string }> {
  const context = loadContext();
  const growthMemory = loadGrowthMemory();
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;

  const contextBlock = context
    ? `## Project Context\n\n${context}\n\n---\n\n`
    : "";
  const growthBlock = growthMemory
    ? `## Convex Growth Memory\n\n${growthMemory}\n\n---\n\n`
    : "";
  const fullPrompt = `${contextBlock}${growthBlock}## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd: APP_DIR,
      model,
      systemPrompt: SYSTEM_PROMPT,
      allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash", "WebSearch", "WebFetch"],
      permissionMode: "default",
      maxTurns,
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
  const { isPlan, model, maxTurns } = parseTaskHeaders(taskContent);

  if (!silent) {
    const modelLabel = Object.entries(MODEL_MAP).find(([, v]) => v === model)?.[0] ?? model;
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} (${isPlan ? "PLAN" : "EXECUTE"}) [${modelLabel}, ${maxTurns} turns]`);
    process.stdout.write("convex → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { model, maxTurns });
  console.log(result);

  const sid = sessionId || `no-session-${Date.now()}`;
  if (sessionId) saveSession(sessionId);

  if (isPlan) {
    const pendingFile = writePending(taskName, result);
    console.log(`\n  [pending] ${path.basename(pendingFile)}`);
    console.log(`  → Review, then: approve ${taskName}`);
  } else {
    const outFile = writeOutbox(taskName, result, sid);
    console.log(`\n  [outbox] ${path.basename(outFile)}`);
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
  console.log(`  → Convex will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║     CONVEX — daemon mode              ║");
  console.log("║  watching: inbox/                     ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log(`  inbox:   ${INBOX_DIR}`);
  console.log(`  outbox:  ${OUTBOX_DIR}`);
  console.log(`  pending: ${PENDING_DIR}`);
  console.log(`  memory:  ${GROWTH_FILE}\n`);
  console.log("  waiting for tasks...\n");

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

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       CONVEX — backend agent          ║");
  console.log("║     point of contact: twanii          ║");
  console.log("╚══════════════════════════════════════╝");
  if (lastSession) console.log(`\n  last session: ${lastSession}`);
  if (pending.length > 0) console.log(`  pending approval: ${pending.join(", ")}`);
  console.log(`\n  Commands: check | approve <name> | resume | exit\n`);

  while (true) {
    const input = await prompt("twanii → ");
    const trimmed = input.trim();
    if (!trimmed) continue;

    if (trimmed.toLowerCase() === "exit") {
      console.log("\nConvex out.\n");
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
      process.stdout.write("\nconvex → ");
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

    // Free-form query (execute by default)
    process.stdout.write("\nconvex → ");
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
