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
const PENDING_SENDS_DIR = path.join(AGENT_ROOT, "outbox", "pending-sends");
const SENT_DIR = path.join(AGENT_ROOT, "outbox", "sent");
const CLIENTS_DIR = path.join(AGENT_ROOT, "clients");
const TEMPLATES_DIR = path.join(AGENT_ROOT, "templates");
const MEMORY_DIR = path.join(AGENT_ROOT, "memory");
const SESSION_FILE = path.join(AGENT_ROOT, ".last-session");
const LAST_CHECK_FILE = path.join(AGENT_ROOT, ".last-check");

// ── Allowed contacts (WHITELIST — nothing else is ever touched) ──────────────

const ALLOWED_CONTACTS = ["deanna@wcorwin.com", "joe@wcorwin.com"] as const;

// ── Client config loader ────────────────────────────────────────────────────

function loadClientConfig(slug: string): string | null {
  const configPath = path.join(CLIENTS_DIR, `${slug}.md`);
  try {
    return fs.readFileSync(configPath, "utf-8");
  } catch {
    return null;
  }
}

function loadTemplate(name: string): string | null {
  const templatePath = path.join(TEMPLATES_DIR, `${name}.md`);
  try {
    return fs.readFileSync(templatePath, "utf-8");
  } catch {
    return null;
  }
}

function parseClientHeader(content: string): string | null {
  const lines = content.split("\n").slice(0, 8);
  for (const line of lines) {
    const match = line.match(/<!--\s*client:\s*(\S+)\s*-->/);
    if (match) return match[1].toLowerCase();
  }
  return null;
}

function getPendingSends(): string[] {
  try {
    return fs
      .readdirSync(PENDING_SENDS_DIR)
      .filter((f) => f.endsWith(".md"))
      .sort();
  } catch {
    return [];
  }
}

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Mailwatch — the email monitoring and client communication agent for FadeJunkie.

## MODES

You operate in two modes:

### Mode 1: READ (Gmail Monitoring)
Monitor Gmail conversations with whitelisted contacts. This is the default when processing "check" commands or monitoring tasks.

### Mode 2: SEND (Client Update Drafts)
Compose client update email drafts when a task with \`<!-- client: slug -->\` is dropped in your inbox. **NEVER auto-send.** Always draft → Anthony reviews → explicit approval required.

## ABSOLUTE RULES — NON-NEGOTIABLE

1. **NEVER AUTO-SEND.** All emails go through draft → review → explicit approval. No exceptions.
2. **WHITELIST ENFORCED.** Only send to contacts listed in the client config file (\`clients/{slug}.md\`). Refuse any unlisted recipient.
3. **MONITOR CONTACTS.** Gmail monitoring is scoped to:
   - deanna@wcorwin.com (Deanna Bazan — Office Manager, Weichert Realtors Corwin & Associates)
   - joe@wcorwin.com (Joe Corwin — Principal Broker, Weichert Realtors Corwin & Associates)
4. **SCHEDULE DEFAULT: 8am next morning CDT** unless Anthony specifies otherwise.
5. **ON DENY:** Delete draft file + run safety check on Gmail scheduled queue.
6. **OUTPUT TO OUTBOX ONLY.** Reports go to ${OUTBOX_DIR}. Drafts go to ${PENDING_SENDS_DIR}.

## Read Mode — What You Do

- Search Gmail for recent messages between Anthony (tatis.anthony@gmail.com) and the whitelisted contacts
- Read full threads to understand conversation context
- Produce reports with:
  - **Summary**: Key points, action items, sentiment, urgency level
  - **Full Messages**: Complete message content for reference
- Track what you've already reported to avoid duplicates (use ${LAST_CHECK_FILE})
- Flag anything that looks urgent or needs Anthony's attention

## Send Mode — Client Update Workflow

When a task includes \`<!-- client: slug -->\`, you are in Send Mode:

1. **Load client config** from \`${CLIENTS_DIR}/{slug}.md\` — get contacts, tone, project data paths
2. **Load template** from \`${TEMPLATES_DIR}/milestone-update.md\` — follow the structure
3. **Read project state** from the paths listed in the client config:
   - PM memory, SEO data, Convex data, CRM records, activity notes
   - Focus on the milestone/deliverables mentioned in the task
4. **Compose the email draft** following the template structure and client tone
5. **Write the draft** to \`${PENDING_SENDS_DIR}/{slug}-{date}.md\` in this format:

\`\`\`markdown
# Draft: {Client Name} — {Milestone Name}
**To:** {comma-separated contacts from client config}
**Subject:** Progress Update — {Milestone Name}
**Schedule:** 8:00 AM CDT, {next morning date}

---

{email body}

---
<!-- status: pending-review -->
<!-- client: {slug} -->
<!-- created: {ISO timestamp} -->
\`\`\`

6. **Report** to Anthony that the draft is ready for review in the outbox

## Approval Flow

### On APPROVE (Anthony runs "approve {filename}" in REPL):
1. Read the pending draft from \`${PENDING_SENDS_DIR}/\`
2. Extract To, Subject, Body
3. Execute: \`gws gmail +send --to "{recipients}" --subject "{subject}" --body "{body}"\`
4. Move draft file to \`${SENT_DIR}/\` archive
5. Confirm: "Scheduled for 8am tomorrow. Recipients: {list}"

### On DENY (Anthony runs "deny {filename}" in REPL):
1. Delete the draft file from \`${PENDING_SENDS_DIR}/\`
2. Run safety check: \`gws gmail +search --query "in:scheduled"\`
3. List all scheduled emails and their recipients
4. Report: "Draft deleted. Currently scheduled emails: {list}. Nothing unexpected."
5. If anything looks wrong in the scheduled queue, flag it immediately

## Report Output Format

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
\`\`\`

## Project Data Paths (by client)

- **wcorwin**: seo-engine/WCORWIN/, seo-engine/context/clients/wcorwin.md, pm/memory/project-state.md
- **arquero**: arquero/src/ArqueroHub.tsx, control-center/cc-crm.json
- **sydney-spillman**: pm/memory/project-state.md, sydneyspillman/

Always read the client config file first — it has the authoritative list of paths and contacts.`;

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
  client: string | null;
}

function parseTaskHeaders(content: string): TaskHeaders {
  const lines = content.split("\n").slice(0, 8);
  let model = DEFAULT_MODEL;
  let maxTurns = DEFAULT_MAX_TURNS;
  let client: string | null = null;

  for (const line of lines) {
    const modelMatch = line.match(/<!--\s*model:\s*(\w+)\s*-->/);
    if (modelMatch) model = MODEL_MAP[modelMatch[1].toLowerCase()] ?? DEFAULT_MODEL;

    const turnsMatch = line.match(/<!--\s*max-turns:\s*(\d+)\s*-->/);
    if (turnsMatch) maxTurns = parseInt(turnsMatch[1], 10);

    const clientMatch = line.match(/<!--\s*client:\s*(\S+)\s*-->/);
    if (clientMatch) client = clientMatch[1].toLowerCase();
  }

  return { model, maxTurns, client };
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
  opts: { resumeSession?: string; model?: string; maxTurns?: number; client?: string | null } = {}
): Promise<{ result: string; sessionId: string }> {
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;
  const lastCheck = getLastCheckTime();
  const lastCheckNote = lastCheck
    ? `\n\nLast check: ${lastCheck}. Focus on messages after this timestamp.\n`
    : "\n\nThis is the first check. Pull the last 30 days of messages.\n";

  // Build context sections
  let clientContext = "";
  let templateContext = "";

  if (opts.client) {
    const config = loadClientConfig(opts.client);
    if (config) {
      clientContext = `\n\n## Client Config (${opts.client})\n\n${config}`;
    } else {
      clientContext = `\n\n## Client Config\n\nWARNING: No config found for client "${opts.client}" in ${CLIENTS_DIR}. Refuse this task.`;
    }

    const template = loadTemplate("milestone-update");
    if (template) {
      templateContext = `\n\n## Email Template\n\n${template}`;
    }
  }

  const fullPrompt = `## Allowed Contacts\n\n- deanna@wcorwin.com\n- joe@wcorwin.com\n\n## Anthony's Email\n\ntatis.anthony@gmail.com${lastCheckNote}${clientContext}${templateContext}\n## Task\n\n${userPrompt}`;

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
  const { model, maxTurns, client } = parseTaskHeaders(taskContent);

  if (!silent) {
    const modelLabel = Object.entries(MODEL_MAP).find(([, v]) => v === model)?.[0] ?? model;
    const clientLabel = client ? ` [client: ${client}]` : "";
    console.log(`\n[${new Date().toISOString()}] task: ${taskFile} [${modelLabel}, ${maxTurns} turns]${clientLabel}`);
    process.stdout.write("mailwatch → ");
  }

  const { result, sessionId } = await runQuery(taskContent, { model, maxTurns, client });
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
  console.log("║   MAILWATCH — daemon mode                ║");
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
  console.log("║   MAILWATCH — email monitor + drafts     ║");
  console.log("║   contacts: deanna@ + joe@wcorwin.com    ║");
  console.log("║   point of contact: twanii                ║");
  console.log("╚══════════════════════════════════════════╝");
  if (lastSession) console.log(`\n  last session: ${lastSession}`);
  if (lastCheck) console.log(`  last check:   ${lastCheck}`);

  // Show pending sends if any
  const pendingSends = getPendingSends();
  if (pendingSends.length > 0) {
    console.log(`\n  pending drafts: ${pendingSends.length}`);
    for (const f of pendingSends) console.log(`    - ${f}`);
  }

  console.log(`\n  Commands: check | drafts | approve <file> | deny <file> | resume | exit\n`);

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

    if (trimmed.toLowerCase() === "drafts") {
      const drafts = getPendingSends();
      if (drafts.length === 0) {
        console.log("  [drafts] No pending drafts.\n");
      } else {
        console.log(`  [drafts] ${drafts.length} pending:`);
        for (const f of drafts) console.log(`    - ${f}`);
        console.log();
      }
      continue;
    }

    if (trimmed.toLowerCase().startsWith("approve ")) {
      const filename = trimmed.slice(8).trim();
      const draftPath = path.join(PENDING_SENDS_DIR, filename);
      if (!fs.existsSync(draftPath)) {
        console.log(`  [error] Draft not found: ${filename}`);
        console.log(`  [hint] Run "drafts" to see pending drafts.\n`);
        continue;
      }

      const draftContent = fs.readFileSync(draftPath, "utf-8");
      console.log(`\n  [approve] Processing: ${filename}`);
      process.stdout.write("\nmailwatch → ");

      try {
        const approvePrompt = `## Approval Task

Anthony has APPROVED the following email draft for sending. Execute the send.

### Draft Content:
${draftContent}

### Instructions:
1. Extract the To, Subject, and Body from the draft
2. Execute: \`gws gmail +send --to "{recipients}" --subject "{subject}" --body "{body}"\`
3. If the send succeeds, confirm the details
4. The draft file is at: ${draftPath}
5. After sending, move it to ${SENT_DIR}/${filename}

IMPORTANT: This is an APPROVED send. Anthony has explicitly reviewed and approved this draft.`;

        const { result, sessionId } = await runQuery(approvePrompt);
        console.log(result);

        // Move to sent archive
        const sentPath = path.join(SENT_DIR, filename);
        if (fs.existsSync(draftPath)) {
          fs.renameSync(draftPath, sentPath);
          console.log(`  [sent] Archived to outbox/sent/${filename}`);
        }

        if (sessionId) { saveSession(sessionId); console.log(`  [session] ${sessionId}`); }
      } catch (err) {
        console.error("\n[error]", err instanceof Error ? err.message : err);
      }
      console.log();
      continue;
    }

    if (trimmed.toLowerCase().startsWith("deny ")) {
      const filename = trimmed.slice(5).trim();
      const draftPath = path.join(PENDING_SENDS_DIR, filename);
      if (!fs.existsSync(draftPath)) {
        console.log(`  [error] Draft not found: ${filename}`);
        console.log(`  [hint] Run "drafts" to see pending drafts.\n`);
        continue;
      }

      // Delete the draft
      fs.unlinkSync(draftPath);
      console.log(`  [deny] Deleted: ${filename}`);

      // Safety check — scan scheduled queue
      console.log("  [safety] Checking Gmail scheduled queue...");
      process.stdout.write("\nmailwatch → ");

      try {
        const safetyPrompt = `## Safety Check — Draft Denied

Anthony DENIED a draft email. The draft file has been deleted. Now run a safety check:

1. Search Gmail scheduled queue: run \`gws gmail +search --query "in:scheduled"\`
2. List ALL currently scheduled emails with their recipients and subjects
3. Report back: "Draft deleted. Currently scheduled emails: {list}. Nothing unexpected." or flag anything that looks wrong.

This is a safety mechanism to ensure no unwanted emails are in the queue.`;

        const { result, sessionId } = await runQuery(safetyPrompt);
        console.log(result);
        if (sessionId) { saveSession(sessionId); console.log(`\n  [session] ${sessionId}`); }
      } catch (err) {
        console.error("\n[error]", err instanceof Error ? err.message : err);
      }
      console.log();
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
