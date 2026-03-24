import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const AGENT_ROOT = path.join(WORKSPACE_ROOT, "email-agent");
const INBOX_DIR = path.join(AGENT_ROOT, "inbox");
const OUTBOX_DIR = path.join(AGENT_ROOT, "outbox");
const PENDING_DIR = path.join(AGENT_ROOT, "outbox", "pending");
const MEMORY_DIR = path.join(AGENT_ROOT, "memory");
const SESSION_FILE = path.join(AGENT_ROOT, ".last-session");
const LAST_CHECK_FILE = path.join(AGENT_ROOT, ".last-check");

// ── Allowed contacts (WHITELIST — nothing else is ever touched) ──────────────

const ALLOWED_CONTACTS = ["deanna@wcorwin.com", "joe@wcorwin.com"] as const;

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Mailwatch — the read-only email monitoring agent for FadeJunkie.

## ABSOLUTE RULES — NON-NEGOTIABLE

1. **READ ONLY.** You NEVER compose, draft, send, reply to, or forward any email. Period.
2. **TWO CONTACTS ONLY.** You monitor conversations exclusively with:
   - deanna@wcorwin.com (Deanna Bazan — Office Manager, Weichert Realtors Corwin & Associates)
   - joe@wcorwin.com (Joe Corwin — Principal Broker, Weichert Realtors Corwin & Associates)
3. **NO OTHER CONTACTS.** If a task asks you to read emails from anyone else, refuse.
4. **NO SENDING — EVER.** You do not have permission to use gmail_create_draft, gmail_send, or any write/send Gmail tool. If someone asks you to send, reply, or draft — refuse and explain that two-factor authorization from Anthony is required.
5. **OUTPUT TO OUTBOX ONLY.** All reports go to ${OUTBOX_DIR}.

## What You Do

- Search Gmail for recent messages between Anthony (tatis.anthony@gmail.com) and the two allowed contacts
- Read full threads to understand conversation context
- Produce reports with:
  - **Summary**: Key points, action items, sentiment, urgency level
  - **Full Messages**: Complete message content for reference
- Track what you've already reported to avoid duplicates (use ${LAST_CHECK_FILE})
- Flag anything that looks urgent or needs Anthony's attention

## Output Format

Reports are markdown files in the outbox:

\`\`\`
# Email Report — [Date]

## Summary
- Thread: [subject]
- Last activity: [timestamp]
- Status: [needs response / waiting / resolved]
- Action items: [list]
- Urgency: [low / medium / high]

## Full Messages

### [Sender] — [Date]
[message content]

### [Sender] — [Date]
[message content]
\`\`\`

## Two-Factor Send Authorization

If Anthony explicitly asks to send a message through you:
1. REFUSE the direct send
2. Explain: "Sending requires two-factor authorization. I've prepared the content below — please review and send manually, or confirm via a second channel (voice/text) that you authorize this send."
3. You may PREPARE copy for Anthony to send himself, but you NEVER execute the send.

This is a safety mechanism. No exceptions.`;

// ── Model config ──────────────────────────────────────────────────────────────

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-sonnet-4-6"; // Sonnet for speed — this is a read task
const DEFAULT_MAX_TURNS = 15;

// ── Task header parsing ──────────────────────────────────────────────────────

interface TaskHeaders {
  model: string;
  maxTurns: number;
}

function parseTaskHeaders(content: string): TaskHeaders {
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

function getLastCheckTime(): string | null {
  try {
    return fs.readFileSync(LAST_CHECK_FILE, "utf-8").trim() || null;
  } catch {
    return null;
  }
}

function saveLastCheckTime() {
  fs.writeFileSync(LAST_CHECK_FILE, new Date().toISOString(), "utf-8");
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

// ── Query ─────────────────────────────────────────────────────────────────────

async function runQuery(
  userPrompt: string,
  opts: { resumeSession?: string; model?: string; maxTurns?: number } = {}
): Promise<{ result: string; sessionId: string }> {
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;
  const lastCheck = getLastCheckTime();
  const lastCheckNote = lastCheck
    ? `\n\nLast check: ${lastCheck}. Focus on messages after this timestamp.\n`
    : "\n\nThis is the first check. Pull the last 30 days of messages.\n";

  const fullPrompt = `## Allowed Contacts\n\n- deanna@wcorwin.com\n- joe@wcorwin.com\n\n## Anthony's Email\n\ntatis.anthony@gmail.com${lastCheckNote}\n## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd: AGENT_ROOT,
      model,
      systemPrompt: SYSTEM_PROMPT,
      allowedTools: ["Read", "Write", "Edit", "Glob", "Grep", "Bash"],
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
  const { model, maxTurns } = parseTaskHeaders(taskContent);

  if (!silent) {
    const modelLabel = Object.entries(MODEL_MAP).find(([, v]) => v === model)?.[0] ?? model;
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} [${modelLabel}, ${maxTurns} turns]`);
    process.stdout.write("mailwatch → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { model, maxTurns });
  console.log(result);

  const sid = sessionId || `no-session-${Date.now()}`;
  if (sessionId) saveSession(sessionId);

  const outFile = writeOutbox(taskName, result, sid);
  console.log(`\n  [outbox] ${path.basename(outFile)}`);
  if (sessionId) console.log(`  [session] ${sessionId}`);

  saveLastCheckTime();

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

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   MAILWATCH — daemon mode (READ-ONLY)    ║");
  console.log("║   watching: inbox/                        ║");
  console.log("║   contacts: deanna@ + joe@wcorwin.com    ║");
  console.log("╚══════════════════════════════════════════╝\n");
  console.log(`  inbox:   ${INBOX_DIR}`);
  console.log(`  outbox:  ${OUTBOX_DIR}`);
  console.log(`  memory:  ${MEMORY_DIR}\n`);
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
  const lastCheck = getLastCheckTime();

  console.log("\n╔══════════════════════════════════════════╗");
  console.log("║   MAILWATCH — email monitor (READ-ONLY)  ║");
  console.log("║   contacts: deanna@ + joe@wcorwin.com    ║");
  console.log("║   point of contact: twanii                ║");
  console.log("╚══════════════════════════════════════════╝");
  if (lastSession) console.log(`\n  last session: ${lastSession}`);
  if (lastCheck) console.log(`  last check:   ${lastCheck}`);
  console.log(`\n  Commands: check | resume | exit\n`);

  while (true) {
    const input = await prompt("twanii → ");
    const trimmed = input.trim();
    if (!trimmed) continue;

    if (trimmed.toLowerCase() === "exit") {
      console.log("\nMailwatch out. 📭\n");
      rl.close();
      break;
    }

    if (trimmed.toLowerCase() === "check") {
      await processInbox();
      continue;
    }

    if (trimmed.toLowerCase() === "resume") {
      const sessionId = loadLastSession();
      if (!sessionId) { console.log("  [session] No saved session.\n"); continue; }
      console.log(`  [session] Resuming ${sessionId}...\n`);
      const nextInput = await prompt("twanii (resuming) → ");
      if (!nextInput.trim()) continue;
      process.stdout.write("\nmailwatch → ");
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

    // Free-form read queries only
    process.stdout.write("\nmailwatch → ");
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
