# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Client project hub for **Sydney Spillman & Associates**, a real estate brand launching in San Antonio. Sydney is Anthony's wife — this is a pro bono / in-house engagement. No Stripe, no invoicing, no payment system.

This repo is a standalone Vite + React + Convex hub that serves as both the **client-facing project tracker** (scope, agreement, workflow progress) and an **ops dashboard** for our team. It also includes a full real estate website mockup previewing what sydneyspillman.com will look like.

**Client:** Sydney Spillman & Associates (Real Estate) | **Engagement:** Pro bono / in-house | **Domain:** `sydneyspillman.anthonytatis.com`

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

**Convex:**
```bash
npx convex deploy -y                    # Deploy schema/functions
npx convex run sydneyTasks:clearAgreement '{"projectId":"sydney-spillman"}' --prod  # Reset test signature
```

## Architecture

### Hostname-Based Routing
`App.tsx` detects hostname to choose mode:
- `sydneyspillman-ops.anthonytatis.com` or `localhost` → **ops mode** (internal view, all controls)
- Any other hostname → **client mode** (what Sydney sees)

### Monolithic Single-File Hub
`src/SydneyHub.tsx` is the entire app. Contains:

| Section | What it renders |
|---------|----------------|
| `WorkflowPage()` | 3-phase task tracker (Brand → Build → Launch) with checkboxes, progress bars, blocker flags |
| `ScopePage()` | Project overview, phase deliverables, timeline, terms (no pricing — pro bono) |
| `AgreementPage()` | HTML5 canvas signature — simplified, no payment toggle, no Stripe |
| `WebsitePage()` | Full real estate website mockup — Home, About, Listings, Testimonials, Contact |

All styling is **inline** — no CSS files, no Tailwind. Light/dark theme toggle persisted in localStorage.

### Convex Backend
Two tables:
- `sydneyTasks` — `(projectId, taskKey, completed)` indexed by `by_project_key`
- `sydneyAgreements` — `(projectId, sigData, signedDate, signedAt)` indexed by `by_project`

Functions: `getTasks`, `setTask`, `getAgreement`, `saveAgreement`, `clearAgreement`

No Stripe functions. No payment status. No invoice polling.

## Design System

**Color palette (light mode default):**
- `#2563eb` (BLUE) — primary accent
- `#3b82f6` (BLUE2) — light blue | `#1e3a5f` (NAVY) — deep blue
- `#22c55e` (GREEN) — success | `#ef4444` (EMBER) — blocker/alert
- Light scale: BG → CARD → DEEP → INPUT → EDGE → SLATE → STONE → INK

**Fonts:** Playfair Display (display/headers), Inter (body/labels)

**Conventions:** Inline styles only. `// @ts-nocheck` on SydneyHub. No external CSS.

## DEV_MODE
Append `?dev=1` to URL to pre-fill signed state and skip Convex writes.

## Key Constraints

- `convex/_generated/` must be **committed** (not gitignored) so Vercel can build standalone
- `.env.local` holds `VITE_CONVEX_URL` — not committed
- TypeScript strict mode is **off** (`tsconfig.app.json`: `strict: false`)
- No test framework configured
- No linter configured

## Agent Integration

This project connects to the FadeJunkie agent ecosystem. The hub itself is a standalone Vite app, but the **actual work** (brand, build, launch) is executed by agents via task templates.

### Agent Roster for This Project

| Agent | Role in Sydney Project |
|-------|----------------------|
| **Ink** | Brand voice, page copy, guidelines, client handoff docs |
| **SEO Engine** | Competitor audit, keyword research, on-page SEO specs |
| **Lobe** | Site foundation, core pages, property features, SEO implementation |
| **Convex Agent** | Backend support for dynamic listing features |
| **Sentinel** | QA — cross-browser, mobile, performance, go-live verification |
| **Funkie** | Brand positioning strategy (Phase 1 support) |
| **Dispatch** | Orchestrator — decomposes phase-level tasks into milestone subtasks |

### How to Kick Off Work

Drop a phase-level task in `dispatch/inbox/`:

```markdown
<!-- execute -->

# Sydney Spillman — Phase 1 (Brand)

Execute Phase 1 milestones for Sydney Spillman project.
Routing table and dependency chain in dispatch/memory/routing-patterns.md.
Task templates in sydneyspillman/tasks/phase-1/.
Project context: sydneyspillman/context/sydney-project.md.
```

Dispatch will decompose this into milestone subtasks, route each to the correct agent, and manage the dependency chain.

### Task Templates

All task templates live in `sydneyspillman/tasks/`:

```
tasks/
  phase-1/
    01-discovery-session.md   → Ink + SEO Engine
    02-mood-direction.md      → Ink (blocker: client approval)
    03-logo-design.md         → MANUAL (escalation)
    04-brand-system.md        → Ink + Lobe
  phase-2/
    05-domain-setup.md        → MANUAL (escalation)
    06-site-foundation.md     → Lobe
    07-core-pages.md          → Ink (copy) → Lobe (build)
    08-property-features.md   → Lobe + Convex (blocker: client assets)
    09-seo-foundation.md      → SEO Engine → Lobe
  phase-3/
    10-quality-assurance.md   → Sentinel
    11-go-live.md             → MANUAL + Sentinel verification
    12-analytics-tracking.md  → MANUAL + SEO Engine verification
    13-client-handoff.md      → Ink
```

Templates contain: agent headers, dependency metadata, self-contained instructions, deliverable paths, and Convex task keys. Dispatch reads these to route correctly.

### Content Directory

`sydneyspillman/content/` is the shared deliverable space:
- **Ink writes** copy, brand docs, handoff materials here
- **SEO Engine writes** keyword research, meta tag specs here
- **Lobe reads** from here when building pages
- Organized by milestone number (e.g., `01-client-intake.md`, `07-pages/homepage.md`)

### Convex Task Key Format

`{phaseId}-{MILESTONE TITLE}-{taskIndex}`

Examples:
- `1-DISCOVERY SESSION-0` — first task in Discovery Session
- `2-CORE PAGES-3` — Contact page (4th task in Core Pages)
- `3-CLIENT HANDOFF-4` — 48-hour post-launch check-in

Project ID: `sydney-spillman` | Mark complete:
```bash
npx convex run --prod sydneyTasks:setTask '{"projectId":"sydney-spillman","key":"1-DISCOVERY SESSION-0","value":true}'
```

Full task key reference: `sydneyspillman/context/sydney-project.md`

### Manual Checkpoints

Milestones 03, 05, 11, 12 are **manual** — they require human action (logo design, domain purchase, DNS cutover, analytics setup). When Dispatch hits these, it writes an escalation to `dispatch/escalations/` describing what Anthony needs to do.
