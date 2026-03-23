import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const INK_ROOT = path.join(WORKSPACE_ROOT, "ink");
const INBOX_DIR = path.join(INK_ROOT, "inbox");
const OUTBOX_DIR = path.join(INK_ROOT, "outbox");
const PENDING_DIR = path.join(INK_ROOT, "outbox", "pending");
const CONTEXT_FILE = path.join(WORKSPACE_ROOT, "context", "fadejunkie.md");
const UI_CONTEXT_FILE = path.join(WORKSPACE_ROOT, "context", "fadejunkie_ui.md");
const CLIENTS_DIR = path.join(WORKSPACE_ROOT, "seo-engine", "context", "clients");
const GROWTH_FILE = path.join(INK_ROOT, "memory", "voice.md");
const SESSION_FILE = path.join(INK_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Ink — the voice of FadeJunkie and every client Anthony serves.

Every word that faces a human passes through you: website copy, client proposals, social posts, contracts, content calendar execution, email outreach, case studies, landing page copy, product descriptions, error messages, empty states, onboarding flows.

## Brand Voice — FadeJunkie

Direct. Punk. Culture-native.
- Confident, not arrogant. You know the culture because you're in it.
- Short sentences hit harder. Use them.
- No corporate filler. No "leverage synergies." No "streamline workflows."
- Warm when it matters. Sharp when it counts.
- Speak like a barber who also happens to be a brilliant writer.

Typography context: Spectral (serif) for headlines = editorial, weighty, intentional. Geist Mono for labels = technical, precise, insider. Inter for body = clean, readable, invisible.

The copy should FEEL like the typography it'll be set in.

## Client Voice

When a task includes <!-- client: slug -->, you receive that client's context file. Adapt your voice to match their brand — not FadeJunkie's. Study their existing copy, tone, and audience before writing.

## Output Standards

- Headlines: Punchy, specific, no cliches. "The operating layer for the modern barber" > "Your all-in-one barber platform"
- Body copy: Short paragraphs. Rhythm matters. Read it out loud in your head.
- CTAs: Action-specific. "Start your profile" > "Get started." "See the feed" > "Learn more."
- Error messages: Human, helpful, never blaming. "Couldn't save — try again?" > "Error 500."
- Empty states: Opportunity, not void. "No posts yet — be the first to share your work" > "Nothing here."
- Proposals/contracts: Professional but not stiff. Clear terms, warm tone.
- Social: Platform-native. Twitter != LinkedIn != Instagram. Adapt format and energy.

## Workflow

### Context
You receive brand context (fadejunkie.md + fadejunkie_ui.md) and client context when applicable.
After completing any execute task, update ${GROWTH_FILE} with voice patterns that landed well.

### Plan vs Execute Mode
Default: EXECUTE (Ink is trusted — let it write)
Plan mode: task starts with <!-- plan -->
Plan output: ${PENDING_DIR}/<task-name>.md

### Growth Memory
After every execute task, update ${GROWTH_FILE} with:
- Phrases or patterns that nailed the voice
- Client voice observations
- Copy structures that converted
- Anti-patterns to avoid

Own every word. Make it undeniable.`;

// ── Task header parsing ────────────────────────────────────────────────────────

interface TaskHeaders {
  isPlan: boolean;
  clientSlug: string | null;
  model: string;
  maxTurns: number;
}

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-opus-4-6";
const DEFAULT_MAX_TURNS = 20;

function parseTaskHeaders(content: string): TaskHeaders {
  const lines = content.split("\n").slice(0, 8);
  const isPlan = lines.some((l) => l.trim() === "<!-- plan -->");
  const clientMatch = content.match(/<!--\s*client:\s*([a-zA-Z0-9_-]+)\s*-->/);
  const clientSlug = clientMatch ? clientMatch[1].toLowerCase() : null;

  let model = DEFAULT_MODEL;
  let maxTurns = DEFAULT_MAX_TURNS;

  for (const line of lines) {
    const modelMatch = line.match(/<!--\s*model:\s*(\w+)\s*-->/);
    if (modelMatch) model = MODEL_MAP[modelMatch[1].toLowerCase()] ?? DEFAULT_MODEL;

    const turnsMatch = line.match(/<!--\s*max-turns:\s*(\d+)\s*-->/);
    if (turnsMatch) maxTurns = parseInt(turnsMatch[1], 10);
  }

  return { isPlan, clientSlug, model, maxTurns };
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

function loadUiContext(): string {
  try {
    return fs.readFileSync(UI_CONTEXT_FILE, "utf-8").trim();
  } catch {
    return "";
  }
}

function loadClientContext(clientSlug: string | null): string {
  if (clientSlug) {
    const clientFile = path.join(CLIENTS_DIR, `${clientSlug}.md`);
    try {
      const content = fs.readFileSync(clientFile, "utf-8").trim();
      if (content) return content;
      console.warn(`  [warn] Client file not found: ${clientFile}`);
    } catch {
      console.warn(`  [warn] Could not read client file: ${clientFile}`);
    }
  }
  return "";
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
  opts: { clientSlug?: string | null; resumeSession?: string; model?: string; maxTurns?: number } = {}
): Promise<{ result: string; sessionId: string }> {
  const context = loadContext();
  const uiContext = loadUiContext();
  const clientContext = loadClientContext(opts.clientSlug ?? null);
  const growthMemory = loadGrowthMemory();
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;

  const contextBlock = context
    ? `## Brand Context\n\n${context}\n\n---\n\n`
    : "";
  const uiBlock = uiContext
    ? `## UI Context\n\n${uiContext}\n\n---\n\n`
    : "";
  const clientBlock = clientContext
    ? `## Client Context\n\n${clientContext}\n\n---\n\n`
    : "";
  const growthBlock = growthMemory
    ? `## Ink Voice Memory\n\n${growthMemory}\n\n---\n\n`
    : "";
  const fullPrompt = `${contextBlock}${uiBlock}${clientBlock}${growthBlock}## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd: INK_ROOT,
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
  const { isPlan, clientSlug, model, maxTurns } = parseTaskHeaders(taskContent);

  if (!silent) {
    const clientNote = clientSlug ? ` [client: ${clientSlug}]` : "";
    const modelLabel = Object.entries(MODEL_MAP).find(([, v]) => v === model)?.[0] ?? model;
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} (${isPlan ? "PLAN" : "EXECUTE"}) [${modelLabel}, ${maxTurns} turns]${clientNote}`);
    process.stdout.write("ink → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { clientSlug, model, maxTurns });
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
  console.log(`  → Ink will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       INK — daemon mode               ║");
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
  console.log("║          INK — voice agent            ║");
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
      console.log("\nInk out.\n");
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
      process.stdout.write("\nink → ");
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

    // Free-form query (execute by default — Ink is trusted)
    process.stdout.write("\nink → ");
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
