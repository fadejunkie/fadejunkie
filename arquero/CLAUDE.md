# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Client project hub for **Arquero Co.**, a welding lifestyle brand built around in-person workshops and branded merch. They're early-stage — need a logo, website, trademark filing, and brand launch. We (FadeJunkie's agency arm) are the marketing agency fulfilling this engagement with custom solutions and as many agents as needed.

This repo is a standalone Vite + React + Convex hub that serves as both the **client-facing project tracker** (scope, agreement, workflow progress) and an **ops dashboard** for our team. It also includes a full ecommerce mockup previewing what the Arquero.co storefront will look like.

**Client:** Arquero Co. (welding lifestyle — workshops + merch) | **Value:** $2,500 one-time (4 phases) | **Domain:** `arqueroco.anthonytatis.com`

Fully isolated from the FadeJunkie Next.js app — own Convex deployment, own Vercel project, own package.json.

## Commands

```bash
npm run dev        # Vite dev server
npm run build      # tsc -b && vite build (type-check + production build)
npm run preview    # Preview production build locally
```

**Deploy:**
```bash
npm run build && npx vercel build --prod && npx vercel deploy --prebuilt --prod
```

**Convex (run from parent `app/` dir):**
```bash
npx convex deploy -y                    # Deploy schema/functions
npx convex run arqueroTasks:clearAgreement '{"projectId":"arquero-co"}' --prod  # Reset test signature
```

**Local screenshots:** Vercel preview URLs require login — use `npx serve dist -p 5173` instead.

## Architecture

### Hostname-Based Routing
`App.tsx` detects hostname to choose mode:
- `arqueroco-ops.anthonytatis.com` or `localhost` → **ops mode** (internal view, all controls)
- Any other hostname → **client mode** (client-facing, what the Arquero Co. owner sees)

### Monolithic Single-File Hub
`src/ArqueroHub.tsx` (~1,260 lines, `// @ts-nocheck`) is the entire app. Contains:

| Section | What it renders |
|---------|----------------|
| `WorkflowPage()` | 4-phase task tracker (Foundation → Identity → Build → Launch) with checkboxes, progress bars, blocker flags |
| `ScopePage()` | Pricing breakdown ($400 + $550 + $1,300 + $250 = $2,500), deliverables per phase, terms |
| `AgreementPage()` | HTML5 canvas signature, payment type toggle (upfront $2,250 / per-phase), Stripe invoice polling |
| `WebsitePage()` | Full ecommerce mockup for arquero.co — shop, collections, cart, about, contact, FAQ |
| `SparkCanvas()` | Animated particle background effect |

All styling is **inline** — no CSS files, no Tailwind. Dark/light theme toggle persisted in localStorage.

### Convex Backend
**Deployment:** `warmhearted-marlin-167` (production)

Single table `arqueroTasks` with `(projectId, taskKey, completed)` indexed by `by_project_key`.

Two functions:
- `getTasks(projectId)` — returns `Record<string, boolean>`
- `setTask(projectId, key, value)` — upsert completion state

### Incomplete Backend
ArqueroHub references Convex functions that **don't exist yet**:
- `saveAgreement()` — persist signature + agreement type
- `updateAgreementPayment()` — update payment status
- `checkInvoiceStatus()` — Stripe invoice polling action
- `getAgreement()` — fetch signed agreement data

These need implementation in `convex/arqueroTasks.ts` (plus schema additions) for the agreement flow to work.

## Design System

**Color palette (dark mode):**
- `#e8541a` (O) — primary orange accent
- `#ff6b2b` (O2) — light orange | `#ff4500` (EMBER) — red-orange | `#22c55e` (GREEN) — success
- 8-shade dark scale: DARK → STEEL → PLATE → WELD → RIVET → ASH → SMOKE → LIGHT

**Fonts:** Barlow Condensed (display), IBM Plex Mono (labels/body)

**Conventions:** Inline styles only. `// @ts-nocheck` on ArqueroHub. No external CSS. Light mode variants computed at runtime.

## DEV_MODE
Append `?dev=1` to URL to pre-fill signed+paid state and skip Convex/Stripe writes. Safe to use on production.

## Execution Model

You are **Dispatch** — the orchestrator. When fulfilling requests:

1. **Decompose** — Break tasks into independent units of work.
2. **Delegate** — Spawn sub-agents (Task tool) in parallel for independent work. Use the cheapest capable model (`haiku` for simple reads/searches, `sonnet` for code edits, `opus` only when judgment-heavy).
3. **Skill-route** — If a subtask matches an available skill (`/commit`, `/browser-test`, `/debug-log`, `/project-update`, etc.), have the sub-agent invoke it directly instead of reimplementing the logic.
4. **Minimize tokens** — Never do sequentially what can be done in parallel. Never research in the main context what a sub-agent can fetch and summarize. Never repeat work a sub-agent already completed.
5. **Converge** — Collect sub-agent results, synthesize, and deliver a single cohesive response.

**Anti-patterns to avoid:**
- Reading files yourself that a sub-agent is already reading
- Using opus-tier agents for grep/glob/read tasks
- Sequential agent launches when the tasks have no dependencies
- Asking the user questions you can answer by exploring the codebase

## Key Constraints

- `convex/_generated/` is **committed** (not gitignored) so Vercel can build standalone
- `.env.local` holds `VITE_CONVEX_URL` — not committed
- TypeScript strict mode is **off** (`tsconfig.app.json`: `strict: false`)
- No test framework configured
- No linter configured
