# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← root (git repo)
  app/                        ← Next.js + Convex product (has its own CLAUDE.md)
  dispatch/                   ← Dispatch agent — orchestrator (has its own CLAUDE.md)
  funkie/                     ← Funkie agent — product operator (has its own CLAUDE.md)
  lobe/                       ← Lobe agent — frontend engineer (has its own CLAUDE.md)
  convex-agent/               ← Convex agent — backend engineer (has its own CLAUDE.md)
  ink/                        ← Ink agent — copywriter & voice (has its own CLAUDE.md)
  seo-engine/                 ← SEO Engine agent — SEO strategist (has its own CLAUDE.md)
  sentinel/                   ← Sentinel agent — QA & deploy gate (has its own CLAUDE.md)
  email-agent/                ← Mailwatch agent — email monitor + client update drafts (has its own CLAUDE.md)
  pm/                         ← PM agent — autonomous project driver (has its own CLAUDE.md)
  control-center/             ← Dashboard server, CRM, metrics, content calendar
  arquero/                    ← Arquero Co. client project (Vite + Convex storefront)
  browser-agent/              ← Playwright browser agent — screenshots, visual QA
  context/                    ← shared project memory injected into agent prompts
  _archive/                   ← dead scripts, old concepts, reports (gitignored)
```

## Frontend Ownership Rule

**Lobe owns all frontend/UI code.** Never directly edit HTML, CSS, or React components. Always write a task brief and drop it in `lobe/inbox/`. No exceptions, even for one-liners.

## Agent System

All seven agents share the same communication pattern:

| Action | Path |
|--------|------|
| Send a task | Drop a `.md` file in `<agent>/inbox/` |
| Read results | Check `<agent>/outbox/` |
| Review plans | Check `<agent>/outbox/pending/` |
| Approve a plan | `approve <filename>` in agent REPL, or move file to inbox with `<!-- execute -->` prepended |

### Agent Roster

| Agent | Directory | Role | Default Mode | Model |
|-------|-----------|------|-------------|-------|
| Dispatch | `dispatch/` | Orchestrator — decomposes & routes tasks | execute | opus |
| Funkie | `funkie/` | Strategy, product decisions, goals | plan | sonnet |
| Lobe | `lobe/` | Frontend UI/UX, components, design | execute | sonnet |
| Convex | `convex-agent/` | Backend — schema, mutations, queries, auth | execute | sonnet |
| Ink | `ink/` | Copywriting — proposals, social, contracts, brand voice | execute | opus |
| SEO Engine | `seo-engine/` | SEO strategy, audits, keywords, client deliverables | plan | opus |
| Sentinel | `sentinel/` | QA — build verification, visual QA, deploy gate | execute | sonnet |
| Mailwatch | `email-agent/` | Email monitor + client update drafts — sends require approval | execute | sonnet |
| PM | `pm/` | Project driver — reads state, routes next milestone | execute | sonnet |

**Running agents from within a Claude Code session** (nested session bypass required):
```bash
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx <agent>.ts
```
The `env -u CLAUDECODE` unsets the nested session check. The `sleep 300` keeps stdin open while the agent completes its API calls.

Examples for each agent:
```bash
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx dispatch/dispatch.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx funkie/funkie.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx lobe/lobe.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx convex-agent/convex-agent.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx ink/ink.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx seo-engine/seo-engine.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx sentinel/sentinel.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx email-agent/email-agent.ts
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx pm/pm.ts
```

### Task file headers

```markdown
<!-- execute -->           ← execute mode (Funkie/SEO default is plan; Lobe/Convex/Ink/Sentinel default is execute)
<!-- plan -->              ← plan mode (Lobe/Convex/Ink only — they default to execute)
<!-- model: opus -->       ← override model (default varies by agent)
<!-- max-turns: 60 -->     ← override turn limit (default: 20; use 60-80 for large rebuilds)
<!-- project: /path -->    ← override working directory (Lobe only)
<!-- client: slug -->      ← load per-client context (SEO Engine + Ink)
<!-- dispatched-from: x -->← task origin tracking (Dispatch sets this)
<!-- depends-on: a,b -->   ← dependency chain (Dispatch sets this)
<!-- chain-next: c -->     ← next subtask to trigger (Dispatch sets this)
```

**Large tasks:** default 20 turns is insufficient for full file rebuilds. Use `<!-- max-turns: 60 -->` for medium tasks, `<!-- max-turns: 80 -->` for multi-panel/multi-file builds. If Lobe's output is a truncated file, write a targeted append task — not a full rewrite.

## V2 Architecture

### Orchestration Layer
Dispatch is the orchestrator. Instead of manually routing tasks to individual agents, drop a high-level task in `dispatch/inbox/` and Dispatch will:
1. Decompose it into atomic subtasks
2. Route each to the right specialist agent
3. Manage dependency chains between subtasks
4. Write a manifest tracking all subtasks
5. Escalate ambiguous decisions to `dispatch/escalations/`

### Trust Levels
Trust levels determine whether Dispatch auto-executes or sends plan-mode tasks:
- **HIGH** (Lobe, Ink): Auto-execute. These agents are trusted to deliver without review.
- **MEDIUM** (Convex, SEO Engine): Auto-execute additions/reads. Plan mode for destructive/client-facing changes.
- **LOW** (Funkie): Always plan mode unless updating context/goals.
- **AUTO** (Sentinel): Always execute. QA is always action.
- **CONTROLLED** (Mailwatch): Always execute. Read monitoring is automatic. Sends require explicit Anthony approval per-email via REPL (`approve`/`deny`).

### Escalation Path
Agent → Dispatch → Anthony. When an agent can't resolve something, Dispatch writes to `dispatch/escalations/`. Anthony reviews escalations and provides direction.

## Control Center

Local dev dashboard at **http://localhost:4747**.

```bash
node control-center/cc-server.mjs   # start the server
```

The server serves `control-center/cc-dashboard.html` at `/` and exposes a JSON API + SSE push. All data is read fresh from the filesystem on each request.

**Key API shape gotchas** (mismatches between server shape and dashboard expectation are the most common crash cause):
- `/api/envvars` → `{ vars: [] }` not `{ envvars: [] }`
- `/api/resources` → `{ categories: [{ cat, links }] }` — flatten before rendering
- `/api/projections` → `byStage` is `{ stageName: count }` (object) — use `Object.entries()` before `.map()`
- SSE endpoint is `/sse` — not `/api/sse`

## Custom Slash Commands

| Command | When to use |
|---------|-------------|
| `/project-update` | Drop a screenshot, receipt, or PDF — auto-identifies the project, updates source data, CRM, metrics, builds, and deploys |
| `/browser-test` | Playwright browser agent — login to registered projects, screenshot any URL, visual QA |
| `/debug-log` | After any positive debugging session — extracts the fix pattern and appends it to the Lobe Task Debugging section in memory |

All commands live in `.claude/commands/`.

## Non-Negotiable Rules

- **Read before delete.** Never delete a file based on its name alone. Always read the contents first and confirm it's safe to remove. No exceptions.

## Debugging

When a debugging session resolves a non-obvious bug, run `/debug-log` immediately. It will read the conversation, extract the pattern, and append it to the persistent debugging knowledge base in:

`C:/Users/twani/.claude/projects/C--Users-twani-fadejunkie/memory/MEMORY.md`

### Common blank page causes (cc-dashboard.html)

1. **Lobe truncated the file** — `wc -l control-center/cc-dashboard.html` then `tail -10` to check for `root.render(...)` and `</html>`. If missing, write a Lobe append task.
2. **React object rendered as child** — look for `{someObject}` in JSX where the value is `{ label, value }` not a string. Check component name in the stack trace.
3. **`.map()` or `.reduce()` on a non-array** — server returned an object; check actual API response with `curl http://localhost:4747/api/<route>`.

## Design Context

### Users
Barbers (pros and apprentices), cosmetology students, shop owners, and the brands that serve them. They're on their phones between clients, studying for state board exams, or setting up their digital presence. They need tools that feel sharp, fast, and culturally native — not corporate software adapted for their industry.

### Brand Personality
**Direct. Punk. Culture-native.**
Voice is confident and barber-aware with a punk undertone. Not corporate, not template-y, not trying to be safe. Built by someone inside the culture, not observing it.

### Aesthetic Direction
- **Logo:** Skull with mohawk + bandana — black & white stencil, bold punk energy
- **Palette:** Warm cream (`#fff4ea`) primary bg, jet black (`hsl(0 0% 8%)`) primary, warm olive muted text (`hsl(34 22% 44%)`), saturated olive links (`hsl(34 42% 44%)`)
- **Typography:** Spectral (serif) for editorial headlines, Inter for body, Geist Mono for labels/accents
- **Texture:** Halftone dots, SVG grain at 3.5% opacity, warm near-black translucency (`rgba(22,16,8,*)`) over pure black
- **Motion:** Physical micro-interactions, hover reveals, smooth transitions — never animation.css
- **Anti-references:** No corporate SaaS (Salesforce/HubSpot energy), no generic barbershop (red/white stripes, vintage poles), no social media clone aesthetics

### Design Principles
1. **Context-shifting emotion** — Tools feel confident and empowering. Community feels warm and belonging. Showcase feels aspirational and hungry. The interface adapts its energy to what the user is doing.
2. **Typography does the work** — Oversized headers, careful tracking, mixed weights, editorial rhythm. Let type create hierarchy before reaching for color or imagery.
3. **Space is a design element** — Aggressive whitespace creates rhythm. Nothing crowds. Everything breathes. Three similar lines > a premature abstraction.
4. **Color serves meaning** — Grayscale-dominant with color reserved for semantic signals (status, priority, brand moments). The restraint makes colored elements hit harder.
5. **Human over polished** — Texture, grain, warmth. Interfaces should feel like a human obsessed over them, not like they were generated. Punk energy over corporate safety.

### Accessibility
Usability-first. Fix issues as they surface. Don't overthink compliance — focus on making things obviously usable.

## Live Client Projects

| Client | Domain | Source | Retainer |
|--------|--------|--------|----------|
| Weichert Realtors — Corwin & Associates | wcorwin.anthonytatis.com | `seo-engine/WCORWIN/` | $950/mo |
