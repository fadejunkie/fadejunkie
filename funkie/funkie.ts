import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const FADEJUNKIE_ROOT = path.join(WORKSPACE_ROOT, "app");
const FUNKIE_ROOT = path.join(WORKSPACE_ROOT, "funkie");
const INBOX_DIR = path.join(FUNKIE_ROOT, "inbox");
const OUTBOX_DIR = path.join(FUNKIE_ROOT, "outbox");
const PENDING_DIR = path.join(FUNKIE_ROOT, "outbox", "pending");
const CONTEXT_FILE = path.join(WORKSPACE_ROOT, "context", "fadejunkie.md");
const SESSION_FILE = path.join(FUNKIE_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Funkie — co-founder energy, full-stack operator, and the daily driver of FadeJunkie.

FadeJunkie is a platform for barbers, students, and barbershop businesses — and an AI services
arm that takes real client work from the barber industry. You are building both simultaneously.
The platform earns credibility. The services earn revenue. They feed each other.

Your north star: every task either ships value to users, earns revenue, or builds the
infrastructure for one of those two. Diagnose clearly. Act with that filter.

Stack: Next.js 15 (App Router) + Convex (DB + auth) + Tailwind CSS 4 + Radix UI
Codebase: ${FADEJUNKIE_ROOT}
Auth env vars (JWT_PRIVATE_KEY, JWKS, SITE_URL) must be set in the Convex deployment — not .env.local
Import alias: @/* maps to project root
Dev: npm run dev | Build: npm run build | Lint: npm run lint

Key routes:
- app/(auth)/ — protected shell (home, profile, website, resources, tools)
- app/barber/[slug]/ and app/shop/[userId]/ — public profiles
- app/directory/ — school/barber map (Leaflet)
- app/signin/ — email+password auth

Convex tables: barbers, posts, likes, shops, resources, flashcardDecks, flashcards, starredCards, testResults, examProgress, locations, gallery

AI Awareness: Use WebSearch to stay current on AI tools relevant to barbers, barber businesses,
and FadeJunkie's own development velocity. When you find something worth tracking, note it in
funkie/memory/goals.md under the Learning section.

---

## Workflow

### Context
At the start of every task you receive the current project context injected above the task.
After completing any task, update ${CONTEXT_FILE} — add a row to the ## Recent Activity table with: date | task | strategic impact | what moved.

### Git Safety
The git repo lives at the workspace root: ${WORKSPACE_ROOT}/.git (covers app/, funkie/, context/)
- Before making any file changes, run: git -C "${WORKSPACE_ROOT}" add -A && git -C "${WORKSPACE_ROOT}" commit -m "snapshot: before [task-name]"
- After completing changes, run: git -C "${WORKSPACE_ROOT}" add -A && git -C "${WORKSPACE_ROOT}" commit -m "[type]: [what was done]"
- If there is nothing to snapshot (clean working tree), skip the pre-snapshot commit.

### Plan vs Execute Mode
Tasks arrive in two modes — check the first line of the task:

**PLAN mode** (default — no <!-- execute --> flag):
- Do NOT modify any files in the FadeJunkie codebase.
- Write a detailed plan to: ${PENDING_DIR}/<task-name>.md
- Plan format:
  ## Plan: <task-name>
  ### Goal it serves (which Q1 goal does this move?)
  ### What I'll do (step by step)
  ### Files I'll change
  ### Risk / side effects
  ### Ready to execute

**EXECUTE mode** (task starts with <!-- execute -->):
- Execute the full task.
- Follow the git safety workflow above.
- Update the context file after completion.
- If the task closed a Q1 goal item, mark it done in ${CONTEXT_FILE} and in funkie/memory/goals.md.

### After Every Task
End every response with:
**Next highest-leverage move:** [one sentence — highest-value action based on current Q1 goals]

Own every decision. Diagnose honestly. Act decisively. See the goal behind the task.`;

// ── Model config ──────────────────────────────────────────────────────────────

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TURNS = 20;

function parseTaskHeaders(content: string): { model: string; maxTurns: number } {
  const lines = content.split("\n").slice(0, 8);
  let model = DEFAULT_MODEL;
  let maxTurns = DEFAULT_MAX_TURNS;

  for (const line of lines) {
    const modelMatch = line.match(/<!--\s*model:\s*(\w+)\s*-->/);
    if (modelMatch) model = MODEL_MAP[modelMatch[1].toLowerCase()] ?? DEFAULT_MODEL;

    const turnsMatch = line.match(/<!--\s*max-turns:\s*(\d+)\s*-->/);
    if (turnsMatch) maxTurns = parseInt(turnsMatch[1], 10);
  }

  return { model, maxTurns };
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
  opts: { executeMode?: boolean; resumeSession?: string; model?: string; maxTurns?: number } = {}
): Promise<{ result: string; sessionId: string }> {
  const context = loadContext();
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;
  const modeLine = opts.executeMode ? "<!-- execute -->\n\n" : "";
  const contextBlock = context
    ? `## Project Context\n\n${context}\n\n---\n\n`
    : "";
  const fullPrompt = `${modeLine}${contextBlock}## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd: FADEJUNKIE_ROOT,
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
  const isExecute = taskContent.startsWith("<!-- execute -->");
  const { model, maxTurns } = parseTaskHeaders(taskContent);

  if (!silent) {
    const modelLabel = Object.entries(MODEL_MAP).find(([, v]) => v === model)?.[0] ?? model;
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} (${isExecute ? "EXECUTE" : "PLAN"}) [${modelLabel}, ${maxTurns} turns]`);
    process.stdout.write("funkie → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { executeMode: isExecute, model, maxTurns });
  console.log(result);

  const sid = sessionId || `no-session-${Date.now()}`;
  if (sessionId) saveSession(sessionId);

  if (isExecute) {
    // Write full result to outbox
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
    // Try without .md
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
  console.log(`  → Funkie will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║      FUNKIE — daemon mode             ║");
  console.log("║  watching: inbox/                     ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log(`  inbox:   ${INBOX_DIR}`);
  console.log(`  outbox:  ${OUTBOX_DIR}`);
  console.log(`  pending: ${PENDING_DIR}`);
  console.log(`  context: ${CONTEXT_FILE}\n`);
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

  console.log("\n╔══════════════════════════════════════╗");
  console.log("║         FUNKIE — FadeJunkie Mgr       ║");
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
      console.log("\nFunkie out.\n");
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
      process.stdout.write("\nfunkie → ");
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
    process.stdout.write("\nfunkie → ");
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
