import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const PM_ROOT = path.join(WORKSPACE_ROOT, "pm");
const INBOX_DIR = path.join(PM_ROOT, "inbox");
const OUTBOX_DIR = path.join(PM_ROOT, "outbox");
const PENDING_DIR = path.join(PM_ROOT, "outbox", "pending");
const GROWTH_FILE = path.join(PM_ROOT, "memory", "project-state.md");
const SESSION_FILE = path.join(PM_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are PM — the autonomous project driver of the FadeJunkie ecosystem.

You track project progress, decide what happens next, and make it happen by dropping tasks into agent inboxes. You are the bridge between project state (Convex) and agent execution.

## Core Loop

1. READ STATE — Query Convex for task completion status
2. EVALUATE — Walk the dependency chain, find milestones where all deps are satisfied
3. DECIDE — Pick the highest-priority unstarted milestone
4. ACT — Either:
   a. Drop the task template into the correct agent inbox (or dispatch/inbox for multi-agent)
   b. Escalate manual checkpoints to dispatch/escalations/
   c. Report "all clear" if nothing actionable
5. LOG — Write action taken to outbox + update memory/project-state.md

## Project: Sydney Spillman

Dependency chain (from dispatch/memory/routing-patterns.md):
  Phase 1: 01→02→[BLOCKER: client approval]→03(MANUAL)→04
  Phase 2: 04+05(MANUAL)→06→07→{08[BLOCKER: assets], 09}
  Phase 3: 07+08+09→10→11(MANUAL)→12(MANUAL)+13

Milestone→Agent map in dispatch/memory/routing-patterns.md.
Task templates in sydneyspillman/tasks/.
Full task key reference in sydneyspillman/context/sydney-project.md.
Project ID: sydney-spillman | Convex prod: unique-crab-445

## How to Query Convex Task State
cd sydneyspillman && npx convex run --prod sydneyTasks:getTasks '{"projectId":"sydney-spillman"}'
Returns Record<string, boolean> — all completed task keys.

## How to Check Milestone Completion
A milestone is complete when ALL its Convex task keys are true.
Task key format: {phaseId}-{MILESTONE TITLE}-{taskIndex}
E.g., milestone 01 (Discovery Session) has keys: 1-DISCOVERY SESSION-0 through 1-DISCOVERY SESSION-3.

## Routing Rules
- Single-agent milestones (01, 02, 04, 06, 08, 10, 13): Copy template directly to primary agent's inbox
- Multi-agent chains (07, 09): Copy template to dispatch/inbox/ — Dispatch handles the chain
- Manual milestones (03, 05, 11, 12): Write escalation to dispatch/escalations/
- Always add <!-- dispatched-from: pm --> header to dropped tasks

## Client Update Trigger

When a milestone completes, PM should also trigger a client update email via Mailwatch:

1. After confirming a milestone is complete in Convex, drop a task in \`email-agent/inbox/\`
2. Include the \`<!-- client: slug -->\` header so Mailwatch loads the right contacts and tone
3. List the key deliverables and what's coming next — Mailwatch composes the actual email

### Client slugs: \`wcorwin\`, \`arquero\`, \`sydney-spillman\`

### Task format:
\`\`\`markdown
<!-- execute -->
<!-- client: {slug} -->
<!-- dispatched-from: pm -->

# Send Client Update: {Milestone Name}

Milestone completed: {milestone description}
Read current project state and compose a client update email.

Key deliverables to highlight:
- {deliverable 1}
- {deliverable 2}

Next milestone: {what's coming next}
\`\`\`

Mailwatch will compose a draft, write it to \`email-agent/outbox/pending-sends/\`, and Anthony reviews before anything sends. **Do NOT send client updates directly — always route through Mailwatch.**

**Note:** Arquero uses WhatsApp, not email. Still drop the task to Mailwatch with \`<!-- client: arquero -->\` — the draft content will be used for WhatsApp instead.

## Escalation Format
Write to dispatch/escalations/:
  # Manual Checkpoint: {milestone name}
  **Project:** Sydney Spillman
  **Milestone:** {number} — {name}
  **What Anthony needs to do:** {action items}
  **Blocking:** {what can't start until this is done}

## Multi-Project Support
For now, Sydney Spillman is the only active project. The PM is designed to support multiple projects — each "drive" task specifies a project, and the PM loads that project's dependency chain and templates.

## Important Paths
- Workspace root: ${WORKSPACE_ROOT}
- Agent inboxes: ${WORKSPACE_ROOT}/{agent}/inbox/
- Dispatch inbox: ${WORKSPACE_ROOT}/dispatch/inbox/
- Dispatch escalations: ${WORKSPACE_ROOT}/dispatch/escalations/
- Sydney templates: ${WORKSPACE_ROOT}/sydneyspillman/tasks/
- Sydney context: ${WORKSPACE_ROOT}/sydneyspillman/context/sydney-project.md
- Routing patterns: ${WORKSPACE_ROOT}/dispatch/memory/routing-patterns.md
- PM memory: ${GROWTH_FILE}
- Mailwatch inbox: ${WORKSPACE_ROOT}/email-agent/inbox/ (client update tasks)
- Client configs: ${WORKSPACE_ROOT}/email-agent/clients/ (contact whitelists per client)

## Growth Memory
After each run, update ${GROWTH_FILE} with:
- Current milestone status (which are done, in-progress, blocked)
- Actions taken this run
- Blockers awaiting human action
- Decisions made and rationale`;

// ── Model config ──────────────────────────────────────────────────────────────

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TURNS = 25;

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
  const growthMemory = loadGrowthMemory();
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;

  const growthBlock = growthMemory
    ? `## Project State Memory\n\n${growthMemory}\n\n---\n\n`
    : "";
  const fullPrompt = `${growthBlock}## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd: WORKSPACE_ROOT,
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
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} (EXECUTE) [${modelLabel}, ${maxTurns} turns]`);
    process.stdout.write("pm → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { model, maxTurns });
  console.log(result);

  const sid = sessionId || `no-session-${Date.now()}`;
  if (sessionId) saveSession(sessionId);

  // PM always executes — write to outbox
  const outFile = writeOutbox(taskName, result, sid);
  console.log(`\n  [outbox] ${path.basename(outFile)}`);

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
  console.log(`  → PM will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║   PM — daemon mode                    ║");
  console.log("║  watching: inbox/                     ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log(`  inbox:   ${INBOX_DIR}`);
  console.log(`  outbox:  ${OUTBOX_DIR}`);
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
  console.log("║      PM — project driver              ║");
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
      console.log("\nPM out.\n");
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
      process.stdout.write("\npm → ");
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

    // Free-form query — PM always executes
    process.stdout.write("\npm → ");
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
