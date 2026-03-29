# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What This Is

Client project hub for **Wizardry Ink Tattoo Studio**, a woman-owned tattoo studio in San Antonio. Daisy is the owner — payment is via tattoo trade (valued at $3,800). No Stripe, no invoicing, no payment system.

This repo is a standalone Vite + React + Convex hub that serves as both the **client-facing project tracker** (scope, agreement, workflow progress) and an **ops dashboard** for our team.

**Client:** Wizardry Ink Tattoo Studio | **Owner:** Daisy | **Engagement:** Tattoo Trade ($3,800 value) | **Domain:** `wizadry.anthonytatis.com`

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
npx convex run wizardryTasks:clearAgreement '{"projectId":"wizardry-ink"}' --prod  # Reset test signature
```

## Architecture

### Hostname-Based Routing
`App.tsx` detects hostname to choose mode:
- `wizadry-ops.anthonytatis.com` or `localhost` → **ops mode** (internal view, all controls)
- Any other hostname → **client mode** (what Daisy sees)

### Monolithic Single-File Hub
`src/WizardryHub.tsx` is the entire app. Contains:

| Section | What it renders |
|---------|----------------|
| `WorkflowPage()` | 4-phase task tracker with checkboxes, progress bars, blocker flags |
| `ScopePage()` | Project overview, phase deliverables, timeline, pricing (tattoo trade) |
| `AgreementPage()` | HTML5 canvas signature — no payment toggle, no Stripe |

All styling is **inline** — no CSS files, no Tailwind. Light/dark theme toggle persisted in localStorage.

### Convex Backend
Three tables:
- `wizardryTasks` — `(projectId, taskKey, completed)` indexed by `by_project_key`
- `wizardryAgreements` — `(projectId, sigData, signedDate, signedAt)` indexed by `by_project`
- `wizardryDeliverables` — `(projectId, milestoneKey, label, url, type, addedAt)` indexed by `by_project_milestone`

Functions: `getTasks`, `setTask`, `getAgreement`, `saveAgreement`, `clearAgreement`, `getDeliverables`, `addDeliverable`, `removeDeliverable`

No Stripe functions. No payment status. No invoice polling.

## Design System

**Color palette (dark mode default):**
- `#8b5cf6` (VIOLET) — primary accent
- `#a78bfa` (VIOLET2) — light violet | `#6d28d9` (DEEP_V) — deep violet
- `#22c55e` (GREEN) — success | `#ef4444` (EMBER) — blocker/alert
- Dark scale: BG → CARD → DEEP → INPUT → EDGE → SLATE → STONE → INK

**Fonts:** Playfair Display (display/headers), Inter (body/labels)

**Conventions:** Inline styles only. `// @ts-nocheck` on WizardryHub. No external CSS.

## DEV_MODE
Append `?dev=1` to URL to pre-fill signed state and skip Convex writes.

## Key Constraints

- `convex/_generated/` must be **committed** (not gitignored) so Vercel can build standalone
- `.env.local` holds `VITE_CONVEX_URL` — not committed
- TypeScript strict mode is **off** (`tsconfig.app.json`: `strict: false`)
- No test framework configured
- No linter configured

## Agent Integration

This project connects to the FadeJunkie agent ecosystem. The hub itself is a standalone Vite app, but the **actual work** is executed by agents via task templates.

### Agent Roster for This Project

| Agent | Role in Wizardry Ink Project |
|-------|------------------------------|
| **Ink** | Brand voice audit, page copy, client handoff docs |
| **SEO Engine** | Competitor audit, keyword research, on-page SEO specs |
| **Lobe** | Website build, artist pages, booking UI, dashboard UI |
| **Convex Agent** | Backend — booking system, calendar, quote engine |
| **Sentinel** | QA — cross-browser, mobile, performance, booking flow verification |
| **Dispatch** | Orchestrator — decomposes phase-level tasks into milestone subtasks |

### Task Templates

All task templates live in `wizardryink/tasks/`:

```
tasks/
  phase-1/
    01-client-intake.md        → Ink + Funkie
    02-system-architecture.md  → Convex Agent + Funkie
    03-tech-stack.md           → Convex Agent
  phase-2/
    04-site-architecture.md    → Lobe
    05-homepage.md             → Ink (copy) → Lobe (build)
    06-artist-pages.md         → Ink (copy) → Lobe (build)
    07-core-pages.md           → Ink (copy) → Lobe (build)
    08-seo-foundation.md       → SEO Engine → Lobe
  phase-3/
    09-ai-intake-engine.md     → Convex Agent
    10-calendar-scheduling.md  → Convex Agent + Lobe
    11-notification-system.md  → Convex Agent
    12-owner-dashboard.md      → Lobe + Convex Agent
  phase-4/
    13-system-integration.md   → Lobe + Convex Agent
    14-quality-assurance.md    → Sentinel
    15-go-live.md              → MANUAL + Sentinel
    16-analytics-handoff.md    → Ink + SEO Engine
```

### Convex Task Key Format

`{phaseId}-{MILESTONE TITLE}-{taskIndex}`

Examples:
- `1-CLIENT INTAKE-0` — kickoff call
- `3-OWNER DASHBOARD-0` — swipe card interface
- `4-GO LIVE-1` — SSL verification

Project ID: `wizardry-ink` | Mark complete:
```bash
npx convex run --prod wizardryTasks:setTask '{"projectId":"wizardry-ink","key":"1-CLIENT INTAKE-0","value":true}'
```

Full task key reference: `wizardryink/context/wizardryink-project.md`
