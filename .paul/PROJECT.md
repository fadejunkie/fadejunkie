# FadeJunkie

## What This Is

FadeJunkie is a barber culture SaaS platform built from inside the industry. Currently in Phase 1: the Edu Hub — a free + paid education platform for cosmetology and barber students studying for state board exams. The Barber Profiles feature (community + website generator) is next but not yet live. Affiliates and advertising are the long-term vision once both features are complete.

## Core Value

Barbers and students have a cultural home built by someone inside the craft — free education to help people enter the industry, tools to grow once they're in.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application |
| Version | 0.x (pre-v1.0) |
| Status | Beta — Edu Hub only |
| Last Updated | 2026-06-03 |

**Production URL:** fadejunkie.com
**Live Feature:** Edu Hub only
**NOT live:** Barber profile routes (experimental, WIP — must not be accessible from production)

## Requirements

### Core Features

- **Edu Hub** — Free + premium study resources for barber/cosmetology students
- **Barber Profiles** — Community + website generator SaaS for licensed barbers
- **Affiliates** — Brand advertising section for industry companies (Dream — v3)

### Validated (Shipped)

- ✓ Edu Hub — Flashcards, quiz, TDLR practical exam guide (11 sections), group study stub
- ✓ Convex progress tracking + real stats per user
- ✓ Mobile-responsive Practical Exam Guide with "New Feature" badge
- ✓ Status Toggle System backend (schema, mutations, cron) — v0.1, built but deprioritized
- ✓ User path system (7 paths, 30+ toggles) — v0.1, built but deprioritized

### Active (In Progress)

- [ ] Free vs paid tier separation in Edu Hub — access control, content gating
- [ ] Stripe subscription for paid members (bulletproof)
- [ ] Auth hardening (Clerk + Convex sync)
- [ ] DB architecture review — retain and recall user info reliably

### Planned (Next)

- [ ] Barber profile feature — DB schema, profile page, community
- [ ] Partners page — barbers join a greater community
- [ ] Website generator for barbers — tiers TBD, needs dedicated brainstorming + pricing
- [ ] Cross-reference user model: student ↔ barber (same person, one account, separate roles)
- [ ] Stripe integration for barber tiers

### Out of Scope (Now)

- Affiliates/advertising section — v3 Dream, after Edu Hub + Barber feature complete
- Status Toggle UI polish — deprioritized; backend complete but UI is v0.1 scope, not current priority

## Hidden from Production

**Barber profile routes are experimental and WIP.** They must NOT be accessible from live deployment until v2 planning is complete and the feature is ready. Block via Next.js middleware before any production deploy.

## Target Users

**Primary — Students:** Cosmetology and barber students studying for state board exams. On their phones between classes, need fast, culturally-native study tools.

**Next — Barbers:** Licensed barbers looking for a professional home, community, and tools to build their digital presence. May also be former students — user model must support both roles.

## Constraints

### Technical
- Stack locked: Next.js + Convex + Clerk + Stripe + Vercel
- Stripe keys: NEVER hardcode — use `process.env.STRIPE_SECRET_KEY`
- Convex env vars (JWT_PRIVATE_KEY, JWKS, SITE_URL) set in Convex dashboard, not `.env.local`
- User model must support dual roles: student and barber (same person, one account)
- Auth must be Clerk-gated before any paid content is served
- Free resources must remain full-quality — never water down free tier to push paid

### Business
- Edu Hub is the crack into the industry — free value is the hook
- Barber profile is NOT live — hidden from production until v2 is ready
- Design: punk, culture-native, direct — never corporate SaaS aesthetic
- Solo builder (Anthony) — agents amplify capacity, bottleneck is human review

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Edu Hub first, barber profile second | Focus; barber profile is WIP and must stay hidden from production | 2026-06-03 | Active |
| Dual-role user model required | A student may become a barber — one account, two roles | 2026-06-03 | Active |
| Free resources stay high quality | Watered-down free tier kills credibility; free is the hook, paid is the upgrade | 2026-06-03 | Active |
| Barber tiers need brainstorm before build | Pricing strategy unresolved — plan before any barber feature coding begins | 2026-06-03 | Active |
| Stack locked: Next.js + Convex | Real-time, serverless, fast iteration | 2026-03-28 | Active |
| 7 Claude AI agents | Parallel autonomous development across domains | 2026-03-28 | Active |
| Status Toggle System deprioritized | Built backend in v0.1 — UI and ecosystem polish deferred until Barbers milestone | 2026-03-28 | Deferred |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Paid Edu Hub subscribers | TBD | 0 | Pre-launch |
| Free Edu Hub MAU | TBD | — | Live |
| Barber profiles created | TBD | 0 | Not started |

## Tech Stack

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16 (App Router) | Locked |
| Backend | Convex | Real-time, serverless |
| Auth | Clerk (+ @convex-dev/auth) | Locked |
| Payments | Stripe | Not yet integrated |
| AI | 7 Claude agents | dispatch, lobe, funkie, convex-agent, ink, seo-engine, sentinel |
| Styling | Tailwind | |
| Fonts | Spectral (serif), Inter (body), Geist Mono (labels) | Design system locked |
| Hosting | Vercel (frontend), Convex Cloud (backend) | |

---
*PROJECT.md — Updated when requirements or strategy change*
*Last updated: 2026-06-03*
