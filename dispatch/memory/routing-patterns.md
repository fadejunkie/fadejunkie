# Dispatch — Routing Patterns

## Task Type → Agent Mapping
- Schema/database/query/mutation → Convex
- UI/component/page/layout/design → Lobe
- Copy/text/proposal/contract/social/content → Ink
- SEO/audit/keywords/ranking/backlinks → SEO Engine
- Strategy/goals/prioritization/product decisions → Funkie
- Build/test/QA/deploy/screenshot → Sentinel

## Client Project Routing
- **Sydney Spillman tasks** → use `<!-- client: sydneyspillman -->` header. Source: `sydneyspillman/`. SEO Engine context at `seo-engine/context/clients/sydneyspillman.md`. Slash command: `/sydneyspillman-hub-update`.
- **Arquero Co. tasks** → Source: `arquero/`. Slash command: `/arquero-hub-update`.
- **WCORWIN tasks** → use `<!-- client: wcorwin -->` header. Source: `seo-engine/WCORWIN/`. SEO Engine context at `seo-engine/context/clients/wcorwin.md`. Slash command: `/wcorwin-hub-update`.
- **Wizardry Ink tasks** → No hub yet. CRM entry exists.

## Sydney Spillman — Phase Routing

### Dependency Chain

```
Phase 1 (BRAND):
  01-discovery → 02-mood → [BLOCKER: client approval] → 03-logo (MANUAL) → 04-brand-system

Phase 2 (BUILD):
  04-brand-system + 05-domain (MANUAL) → 06-site-foundation → 07-core-pages
  07-core-pages → 08-property-features [BLOCKER: client assets]
  07-core-pages → 09-seo-foundation

Phase 3 (LAUNCH):
  07 + 08 + 09 → 10-qa → 11-go-live (MANUAL) → 12-analytics (MANUAL) + 13-handoff
```

### Milestone → Agent Map

| # | Milestone | Primary | Support | Template |
|---|-----------|---------|---------|----------|
| 01 | Discovery Session | Ink | SEO Engine, Funkie | `sydneyspillman/tasks/phase-1/01-discovery-session.md` |
| 02 | Mood + Direction | Ink | — | `sydneyspillman/tasks/phase-1/02-mood-direction.md` |
| 03 | Logo Design | **MANUAL** | Ink | `sydneyspillman/tasks/phase-1/03-logo-design.md` |
| 04 | Brand System | Ink | Lobe | `sydneyspillman/tasks/phase-1/04-brand-system.md` |
| 05 | Domain Setup | **MANUAL** | — | `sydneyspillman/tasks/phase-2/05-domain-setup.md` |
| 06 | Site Foundation | Lobe | — | `sydneyspillman/tasks/phase-2/06-site-foundation.md` |
| 07 | Core Pages | Ink → Lobe | — | `sydneyspillman/tasks/phase-2/07-core-pages.md` |
| 08 | Property Features | Lobe | Convex | `sydneyspillman/tasks/phase-2/08-property-features.md` |
| 09 | SEO Foundation | SEO Engine → Lobe | — | `sydneyspillman/tasks/phase-2/09-seo-foundation.md` |
| 10 | Quality Assurance | Sentinel | — | `sydneyspillman/tasks/phase-3/10-quality-assurance.md` |
| 11 | Go Live | **MANUAL** | Sentinel | `sydneyspillman/tasks/phase-3/11-go-live.md` |
| 12 | Analytics + Tracking | **MANUAL** | SEO Engine | `sydneyspillman/tasks/phase-3/12-analytics-tracking.md` |
| 13 | Client Handoff | Ink | — | `sydneyspillman/tasks/phase-3/13-client-handoff.md` |

### Manual Checkpoints (→ dispatch/escalations/)
- **03 Logo Design** — requires iterative visual creation
- **05 Domain Setup** — requires domain purchase + DNS config
- **11 Go Live** — requires DNS cutover + SSL verification
- **12 Analytics** — requires Google account access (GA4, GSC)

### Multi-Agent Chains (2-step)
- **07 Core Pages** — Ink writes copy first → Lobe builds pages from copy
- **09 SEO Foundation** — SEO Engine produces specs → Lobe implements on site

### Convex Task Key Format
`{phaseId}-{MILESTONE TITLE}-{taskIndex}` — e.g., `1-DISCOVERY SESSION-0`
Project ID: `sydney-spillman` | Prod deployment: `unique-crab-445`

## Learned Patterns
- **Project hub scaffolds** → Do NOT route to Lobe. These are standalone Vite+React+Convex apps, not part of the FadeJunkie Next.js app. Build directly or via `/projecthub` command. See `memory/projecthub-pattern.md`.
- **Hub updates** → Use the client-specific slash command (`/sydneyspillman-hub-update`, `/arquero-hub-update`, `/wcorwin-hub-update`). These contain the full task key map and deploy workflow.
