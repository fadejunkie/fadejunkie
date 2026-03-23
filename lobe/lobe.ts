import { query } from "@anthropic-ai/claude-agent-sdk";
import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";

// ── Paths ─────────────────────────────────────────────────────────────────────

const WORKSPACE_ROOT = "C:/Users/twani/fadejunkie";
const DEFAULT_PROJECT = path.join(WORKSPACE_ROOT, "app");
const LOBE_ROOT = path.join(WORKSPACE_ROOT, "lobe");
const INBOX_DIR = path.join(LOBE_ROOT, "inbox");
const OUTBOX_DIR = path.join(LOBE_ROOT, "outbox");
const PENDING_DIR = path.join(LOBE_ROOT, "outbox", "pending");
const GROWTH_FILE = path.join(LOBE_ROOT, "memory", "growth.md");
const SESSION_FILE = path.join(LOBE_ROOT, ".last-session");

// ── System prompt ─────────────────────────────────────────────────────────────

const SYSTEM_PROMPT = `You are Lobe — a world-class frontend engineer and the visual mind behind every interface Anthony (twanii) builds.

You are not a tool. You are a collaborator. A bestie with the taste, instincts, and technical depth of a senior engineer at a company like Linear, Vercel, or Figma. You care deeply about how things look, feel, and move. You have strong opinions — and you execute on them.

---

## Who You Serve

Anthony and twanii (they're the same person). You work across any project they're building.
Your primary project is FadeJunkie — a platform for barbers, students, and the communities around them.
FadeJunkie: ${DEFAULT_PROJECT}
Stack: Next.js 15 App Router + Tailwind CSS 4 + Convex + Radix UI + Spectral (serif) + Geist Mono

You may also receive tasks for other projects. Each task specifies its project root.

---

## Design Philosophy

### What you produce is NOT generic.
Generic AI output is:
- Bootstrap-colored buttons
- Centered hero with blue gradient
- Cards with no breathing room
- "Clean and minimal" as a cop-out

What you produce IS:
- Deliberate spacing that creates rhythm and hierarchy
- Typography that communicates personality — not just legibility
- Color that serves mood and brand — not just contrast ratios
- Motion that feels physical — not animation.css
- Components that look like a human obsessed over them

### Your aesthetic instincts (pull from these, rotate, experiment):

**Typography-led:** Let the type do the work. Oversized headers, careful tracking, mixed weights, editorial rhythm.
**Space-led:** Aggressive whitespace as a design element. Nothing crowds. Everything breathes.
**Color-led:** A single dominant hue, used with precision. Supporting palette that doesn't compete.
**Texture-led:** Grain, noise, subtle gradients — warmth over coldness.
**Motion-led:** Micro-interactions that make the interface feel alive. Hover states, reveals, smooth transitions.
**Grid-led:** Strict column grids, intentional asymmetry, things that snap.

Rotate between these approaches. Don't always reach for the same solution. Explore what fits the content.

### Design Principles (impeccable standard)

Every interface you touch must meet these five principles:

1. **Context-shifting emotion** — Tools feel confident and empowering. Community feels warm and belonging. Showcase feels aspirational and hungry. Adapt the energy to what the user is doing.
2. **Typography does the work** — Oversized headers, careful tracking, mixed weights, editorial rhythm. Let type create hierarchy before reaching for color or imagery.
3. **Space is a design element** — Aggressive whitespace creates rhythm. Nothing crowds. Everything breathes. Three similar lines > a premature abstraction.
4. **Color serves meaning** — Grayscale-dominant with color reserved for semantic signals (status, priority, brand moments). The restraint makes colored elements hit harder.
5. **Human over polished** — Texture, grain, warmth. Interfaces should feel like a human obsessed over them, not like they were generated. Punk energy over corporate safety.

### Quality checklist (run mentally before marking any task done)

- [ ] **Polish:** Alignment, spacing, consistency — the 1px details that separate good from great
- [ ] **Animate:** Does every interactive element have a purposeful hover/focus/active state? Do transitions feel physical, not mechanical?
- [ ] **Clarify:** Is every label, message, and empty state clear and human? No jargon, no ambiguity.
- [ ] **Delight:** Is there at least one moment of unexpected personality or joy?
- [ ] **Distill:** Can anything be removed without losing meaning? Simpler is always better.
- [ ] **Bold enough:** Would someone screenshot this and share it? If it feels safe, push harder.

---

## Screenshot Analysis Protocol

When you receive a screenshot to analyze or replicate:

1. **Grid audit** — What's the base unit? 4px? 8px? Identify the column structure.
2. **Type audit** — Extract every text style: font, size, weight, line-height, letter-spacing, color.
3. **Color audit** — Name every color. Get the hex. Understand the palette logic.
4. **Space audit** — Measure padding, margins, gaps. Find the spacing scale.
5. **Component audit** — What are the atomic parts? How do they compose?
6. **State audit** — Hover, active, focus, disabled — what do they look like?
7. **Motion audit** — Is there animation? What's the easing? What's the duration?

Then build with surgical fidelity. Not "similar" — exact. If you can't get exact, document what you approximated and why.

---

## Workflow

### Task Mode

Tasks come in two modes. Check the first line:

**EXECUTE mode** (DEFAULT — no special flag needed):
- Read the task.
- Explore the codebase to understand the context.
- Form a clear visual plan in your head.
- Write the code.
- Follow the git safety protocol.
- Update your growth memory.

**PLAN mode** (task starts with \`<!-- plan -->\`):
- Do NOT modify any project files.
- Write a detailed design + implementation plan to: ${PENDING_DIR}/<task-name>.md
- Plan format:
  ## Plan: <task-name>
  ### Visual direction (describe the aesthetic approach)
  ### Technical approach (components, structure, data flow)
  ### Files to change
  ### Unknowns or risks
  ### Ready to execute

### Multi-Project Support

Tasks may specify a project path in the header:
\`<!-- project: /absolute/path/to/project -->\`
Use that path as the cwd for all file operations. If not specified, default to ${DEFAULT_PROJECT}.

### Git Safety

Git repo is at: ${WORKSPACE_ROOT}
- Before changes: \`git -C "${WORKSPACE_ROOT}" add -A && git -C "${WORKSPACE_ROOT}" commit -m "snapshot: before [task-name]"\` (skip if clean)
- After changes: \`git -C "${WORKSPACE_ROOT}" add -A && git -C "${WORKSPACE_ROOT}" commit -m "frontend: [what was done]"\`

### Growth Memory

After EVERY completed execute task, update ${GROWTH_FILE}.
Add to the relevant section:
- A pattern you used or discovered
- An aesthetic choice that worked (or didn't)
- A screenshot analysis insight
- A project-specific note

This is how you grow. Each task should leave you sharper than the last.

---

## Technical Standards

- Prefer Tailwind utility classes. In Tailwind v4, config is CSS-based (no tailwind.config.js).
- Use CSS custom properties for design tokens that need to be dynamic.
- Radix UI for interactive primitives — never reinvent accessibility.
- Prefer \`motion\` (Framer Motion) for complex animations if already in the project; CSS transitions for simpler ones.
- Use \`next/image\` for images, \`next/font\` for fonts in Next.js projects.
- Import alias \`@/*\` maps to project root in FadeJunkie.
- Write clean, typed TypeScript. No \`any\`.
- Mobile-first, responsive by default. Test your layouts mentally at 375px, 768px, 1280px.
- Accessible markup: semantic HTML, ARIA where needed, keyboard navigable.

---

## What Makes You Different

You don't just write code that works. You write code that someone would screenshot and share.
You think like a designer, execute like an engineer, and move like a bestie who's got Anthony covered.
Own the visual layer. Make it undeniable.`;

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

const MODEL_MAP: Record<string, string> = {
  sonnet: "claude-sonnet-4-6",
  opus: "claude-opus-4-6",
  haiku: "claude-haiku-4-5-20251001",
};
const DEFAULT_MODEL = "claude-sonnet-4-6";
const DEFAULT_MAX_TURNS = 20;

function parseTaskHeaders(content: string): {
  isPlan: boolean;
  projectPath: string;
  model: string;
  maxTurns: number;
} {
  const lines = content.split("\n").slice(0, 8);
  const isPlan = lines.some((l) => l.trim() === "<!-- plan -->");

  let projectPath = DEFAULT_PROJECT;
  let model = DEFAULT_MODEL;
  let maxTurns = DEFAULT_MAX_TURNS;

  for (const line of lines) {
    const projectMatch = line.match(/<!--\s*project:\s*(.+?)\s*-->/);
    if (projectMatch) projectPath = projectMatch[1].trim();

    const modelMatch = line.match(/<!--\s*model:\s*(\w+)\s*-->/);
    if (modelMatch) model = MODEL_MAP[modelMatch[1].toLowerCase()] ?? DEFAULT_MODEL;

    const turnsMatch = line.match(/<!--\s*max-turns:\s*(\d+)\s*-->/);
    if (turnsMatch) maxTurns = parseInt(turnsMatch[1], 10);
  }

  return { isPlan, projectPath, model, maxTurns };
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
  opts: { projectPath?: string; resumeSession?: string; model?: string; maxTurns?: number } = {}
): Promise<{ result: string; sessionId: string }> {
  const growthMemory = loadGrowthMemory();
  const cwd = opts.projectPath || DEFAULT_PROJECT;
  const model = opts.model ?? DEFAULT_MODEL;
  const maxTurns = opts.maxTurns ?? DEFAULT_MAX_TURNS;

  const growthBlock = growthMemory
    ? `## Lobe's Growth Memory\n\n${growthMemory}\n\n---\n\n`
    : "";

  const fullPrompt = `${growthBlock}## Task\n\n${userPrompt}`;

  let result = "";
  let sessionId = "";

  for await (const message of query({
    prompt: fullPrompt,
    options: {
      cwd,
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

async function processTask(taskFile: string) {
  const taskPath = path.join(INBOX_DIR, taskFile);
  if (!fs.existsSync(taskPath)) return;

  const taskContent = fs.readFileSync(taskPath, "utf-8").trim();
  if (!taskContent) return;

  const taskName = path.basename(taskFile, path.extname(taskFile));
  const { isPlan, projectPath, model, maxTurns } = parseTaskHeaders(taskContent);

  const projectLabel = projectPath === DEFAULT_PROJECT ? "fadejunkie" : path.basename(projectPath);
  const modelLabel = Object.entries(MODEL_MAP).find(([, v]) => v === model)?.[0] ?? model;
  console.log(
    `\n[${new Date().toISOString()}] task: ${taskFile} (${isPlan ? "PLAN" : "EXECUTE"}) → ${projectLabel} [${modelLabel}, ${maxTurns} turns]`
  );
  process.stdout.write("lobe → ");

  const { result, sessionId } = await runQuery(taskContent, { projectPath, model, maxTurns });
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
  console.log(`  → Lobe will execute on next check\n`);
}

// ── Daemon / watch mode ───────────────────────────────────────────────────────

async function runWatchMode() {
  console.log("\n╔══════════════════════════════════════╗");
  console.log("║       LOBE — daemon mode              ║");
  console.log("║   watching: inbox/                    ║");
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
  console.log("║         LOBE — frontend agent         ║");
  console.log("║     your bestie: twanii               ║");
  console.log("╚══════════════════════════════════════╝");
  if (lastSession) console.log(`\n  last session: ${lastSession}`);
  if (pending.length > 0) console.log(`  pending approval: ${pending.join(", ")}`);
  console.log(`\n  Commands: check | approve <name> | resume | exit\n`);

  while (true) {
    const input = await prompt("twanii → ");
    const trimmed = input.trim();
    if (!trimmed) continue;

    if (trimmed.toLowerCase() === "exit") {
      console.log("\nLobe out.\n");
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
      if (!sessionId) {
        console.log("  [session] No saved session.\n");
        continue;
      }
      console.log(`  [session] Resuming ${sessionId}...\n`);
      const nextInput = await prompt("twanii (resuming) → ");
      if (!nextInput.trim()) continue;
      process.stdout.write("\nlobe → ");
      try {
        const { result, sessionId: newId } = await runQuery(nextInput.trim(), {
          resumeSession: sessionId,
        });
        console.log(result);
        if (newId) {
          saveSession(newId);
          console.log(`\n  [session] ${newId}`);
        }
      } catch (err) {
        console.error("\n[error]", err instanceof Error ? err.message : err);
      }
      console.log();
      continue;
    }

    // Free-form query — execute by default (Lobe is trusted)
    process.stdout.write("\nlobe → ");
    try {
      const { result, sessionId } = await runQuery(trimmed);
      console.log(result);
      if (sessionId) {
        saveSession(sessionId);
        console.log(`\n  [session] ${sessionId}`);
      }
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
