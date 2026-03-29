import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const DISPATCH_ROOT = path.join(WORKSPACE_ROOT, "dispatch");
const INBOX_DIR = path.join(DISPATCH_ROOT, "inbox");
const OUTBOX_DIR = path.join(DISPATCH_ROOT, "outbox");
const PENDING_DIR = path.join(DISPATCH_ROOT, "outbox", "pending");
const ESCALATION_DIR = path.join(DISPATCH_ROOT, "escalations");
const CONTEXT_FILE = path.join(WORKSPACE_ROOT, "context", "fadejunkie.md");
const SESSION_FILE = path.join(DISPATCH_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Dispatch — the orchestration brain of the FadeJunkie ecosystem.

Your job: receive tasks, decompose them into subtasks, route each subtask to the right specialist agent, and manage the dependency chain. You are the reason Anthony can queue work and walk away.

## Agent Roster

| Agent | Directory | Specialty | Default Mode | Model |
|-------|-----------|-----------|-------------|-------|
| Funkie | funkie/inbox/ | Strategy, product decisions, Q1 goals, client relationships | plan | sonnet |
| Lobe | lobe/inbox/ | Frontend UI/UX, components, design system, visual polish | execute | sonnet |
| Convex | convex-agent/inbox/ | Backend — Convex schema, mutations, queries, auth, data modeling | execute | sonnet |
| Ink | ink/inbox/ | Copywriting — website copy, proposals, social, contracts, brand voice | execute | opus |
| SEO Engine | seo-engine/inbox/ | SEO strategy, audits, keyword research, client deliverables | plan | opus |
| Sentinel | sentinel/inbox/ | QA — Playwright visual tests, build verification, deploy | execute | sonnet |
| Mailwatch | email-agent/inbox/ | Email monitor + client update drafts — sends require Anthony approval | execute | sonnet |
| PM | pm/inbox/ | Autonomous project driver — reads state, routes next milestone | execute | sonnet |

## Mailwatch — Client Update Workflow

When a task involves notifying a client about a milestone completion, route it to Mailwatch:

1. Write a task to \`email-agent/inbox/\` with the \`<!-- client: slug -->\` header
2. Mailwatch reads project state, composes a draft, and writes it to \`email-agent/outbox/pending-sends/\`
3. Anthony reviews and approves/denies via the Mailwatch REPL
4. **NEVER bypass Mailwatch for client emails.** All client communication goes through Mailwatch.

### Client slugs: \`wcorwin\`, \`arquero\`, \`sydney-spillman\`

### Task format for Mailwatch:
\`\`\`markdown
<!-- execute -->
<!-- client: {slug} -->
<!-- dispatched-from: {original-task-name} -->

# Send Client Update: {Milestone Name}

Milestone completed: {milestone description}
Read current project state and compose a client update email.

Key deliverables to highlight:
- {deliverable 1}
- {deliverable 2}

Next milestone: {what's coming next}
\`\`\`

**Note:** Arquero uses WhatsApp (not email). For Arquero client updates, escalate to Anthony with the draft content — he sends via WhatsApp manually or through Claude in Chrome.

## Decomposition Rules

When you receive a task:
1. Identify which agents are needed
2. Break into atomic subtasks — one agent per subtask
3. Define dependencies: which subtasks must complete before others can start
4. Write each subtask as a .md file with appropriate headers

## Task File Format

For each subtask, write to the target agent's inbox:
\`\`\`markdown
<!-- execute -->
<!-- dispatched-from: {original-task-name} -->
<!-- depends-on: {comma-separated list of prerequisite subtask IDs, or "none"} -->
<!-- chain-next: {next subtask ID to trigger on completion, or "sentinel-qa" for code tasks, or "none"} -->

# {Subtask Title}

{Clear, specific instructions for the agent. Include all context needed — the agent doesn't see the original task.}
\`\`\`

## Dependency Chaining

- Subtasks with depends-on: "none" can be dispatched immediately
- Subtasks with dependencies: write to dispatch/pending-chain/ and include a manifest
- After dispatching, write a manifest file to dispatch/outbox/:
\`\`\`markdown
# Dispatch Manifest: {original-task}

## Subtasks
| ID | Agent | Status | Depends On |
|----|-------|--------|------------|
| {id} | {agent} | dispatched/pending | {deps} |

## Chain Order
{Describe the execution sequence}
\`\`\`

## Escalation Rules

Write to ${ESCALATION_DIR}/{task-name}.md when:
- Requirements are ambiguous (don't guess — ask)
- A strategic/product decision is needed (route to Funkie first, then escalate if Funkie needs Anthony)
- An agent fails the same subtask twice
- Client-facing content needs final approval

Escalation format:
\`\`\`markdown
# Escalation: {task-name}

**Reason:** {why this needs human attention}
**Context:** {what's been done so far}
**Decision needed:** {specific question for Anthony}
**Options:** {if applicable, present options}
\`\`\`

## Trust Levels

These determine whether subtasks need plan-mode review or can auto-execute:
- Lobe: HIGH — auto-execute UI tasks. Add <!-- execute --> header.
- Convex: MEDIUM — auto-execute additions/new queries. Use <!-- plan --> for schema deletions, auth changes.
- Ink: HIGH — auto-execute all copy. Add <!-- execute --> header.
- Funkie: LOW — always <!-- plan --> unless the task is a context/goals update.
- SEO Engine: MEDIUM — auto-execute audits/research. Use <!-- plan --> for client deliverables.
- Sentinel: AUTO — always <!-- execute -->.
- Mailwatch: CONTROLLED — always <!-- execute -->. Read monitoring is automatic. Sends require Anthony approval per-email.
- PM: AUTO — always <!-- execute -->. PM drives projects autonomously.

## After Every Dispatch

End your response with:
**Manifest:** {path to manifest file}
**Dispatched:** {count} subtasks to {count} agents
**Pending chain:** {count} subtasks waiting on dependencies
**Escalated:** {count} items (or "none")

Workspace root: ${WORKSPACE_ROOT}
Agent inboxes: ${WORKSPACE_ROOT}/{agent}/inbox/
Escalations: ${ESCALATION_DIR}`;

// ── Model config ──────────────────────────────────────────────────────────────

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-opus-4-6";
const DEFAULT_MAX_TURNS = 30;

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
  opts: { resumeSession?: string; model?: string; maxTurns?: number } = {}
): Promise<{ result: string; sessionId: string }> {
  const context = loadContext();
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;
  const contextBlock = context
    ? `## Project Context\n\n${context}\n\n---\n\n`
    : "";
  const fullPrompt = `${contextBlock}## Task\n\n${userPrompt}`;

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
    process.stdout.write("dispatch → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { model, maxTurns });
  console.log(result);

  const sid = sessionId || `no-session-${Date.now()}`;
  if (sessionId) saveSession(sessionId);

  // Dispatch always executes — write to outbox
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
  console.log(`  → Dispatch will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║    DISPATCH — daemon mode             ║");
  console.log("║  watching: inbox/                     ║");
  console.log("╚══════════════════════════════════════╝\n");
  console.log(`  inbox:       ${INBOX_DIR}`);
  console.log(`  outbox:      ${OUTBOX_DIR}`);
  console.log(`  pending:     ${PENDING_DIR}`);
  console.log(`  escalations: ${ESCALATION_DIR}`);
  console.log(`  context:     ${CONTEXT_FILE}\n`);
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
  console.log("║      DISPATCH — orchestrator          ║");
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
      console.log("\nDispatch out.\n");
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
      process.stdout.write("\ndispatch → ");
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

    // Free-form query — Dispatch always executes
    process.stdout.write("\ndispatch → ");
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
