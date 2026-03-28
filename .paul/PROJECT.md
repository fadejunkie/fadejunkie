# FadeJunkie

## What This Is

A Next.js SaaS platform for the barber community — barbers, students, shop owners, schools, vendors, event coordinators, and clients. It combines exam prep tools, personal website publishing, a resource directory, and a flagship Status toggle system that creates a living ecosystem of professional connections. Built with 7 autonomous Claude AI agents that handle frontend, backend, copy, SEO, QA, and orchestration.

## Core Value

Barbers can build their digital brand and pass their state board exam without needing separate apps for each.

## Current State

| Attribute | Value |
|-----------|-------|
| Type | Application |
| Version | 0.0.0 |
| Status | Prototype |
| Last Updated | 2026-03-28 |

**Production URLs:**
- fadejunkie.com: Main platform (Vercel)
- {slug}.fadejunkie.com: Per-barber websites

## Requirements

### Core Features

- **Status Toggle System (Flagship)** — 7 user paths (barber, student, shop, school, vendor, event coordinator, client) with 30+ toggles. Expiration-based with auto-archive. Complementary statuses create matchmaking between user types.
- **Study Tools** — Exam prep, flashcards, practice tests for state board certification
- **Website Builder** — Edit and publish {slug}.fadejunkie.com personal/shop websites
- **Resource Directory** — Curated tools, products, and resources with audience-based tabs
- **Community Feed** — Paginated social feed for the barber community

### Validated (Shipped)

- [x] Auth system (Password + Google OAuth) — v0.0.0
- [x] Community feed (paginated) — v0.0.0
- [x] Barber profile editor — v0.0.0
- [x] Shop website builder (ShopTemplate) — v0.0.0
- [x] Study tools (exam-guide, flashcards, practice-test) — v0.0.0
- [x] Resource directory (26 items, audience tabs) — v0.0.0
- [x] Public barber profiles ({slug}) — v0.0.0

### Active (In Progress)

- [ ] Status toggle system — backend complete (schema, mutations, queries, cron), UI pending
- [ ] User path differentiation (barber, student, shop, school, vendor, event coordinator, client)

### Planned (Next)

- [ ] Status matchmaking (complementary toggle discovery)
- [ ] Campaign and workflow integration (N8N consideration)
- [ ] CI/CD pipeline (GitHub Actions, Convex deploy automation)

### Out of Scope

- Mobile native app — web-first, responsive
- Payment processing between users — Stripe is for platform subscriptions only

## Target Users

**Primary:** Barbers (pros and apprentices)
- On their phones between clients
- Need tools that feel sharp, fast, and culturally native
- Building their personal brand and digital presence

**Secondary:** Students, shop owners, schools, vendors, event coordinators, clients
- Each path has unique status toggles
- Cross-path connections are the ecosystem's engine

## Constraints

### Technical Constraints

- Stack locked: Next.js 16 + Convex + Claude AI agents
- Convex deploys are manual (`npx convex deploy -y`)
- No CI/CD pipeline — Vercel auto-deploys frontend on push, everything else manual
- Agents can't git push (Windows Credential Manager dependency)
- Auth keys (JWT_PRIVATE_KEY, JWKS, SITE_URL) managed in Convex dashboard, not .env.local

### Business Constraints

- Solo builder (Anthony) — agents amplify capacity but bottleneck is human review
- Existing client work (WCORWIN $950/mo retainer) competes for attention
- Lobe (frontend agent) stays on Sonnet model — no Opus to conserve budget

## Key Decisions

| Decision | Rationale | Date | Status |
|----------|-----------|------|--------|
| Next.js 16 + Convex | Real-time, serverless, fast iteration | Pre-PAUL | Active |
| 7 Claude AI agents | Parallel autonomous development across domains | Pre-PAUL | Active |
| Status toggle as flagship | Unique differentiator — no competitor has this ecosystem model | 2026-03-28 | Active |
| N8N as future option | Only if a workflow use case justifies adding it | 2026-03-28 | Active |
| Stack locked | No framework changes — focus on features | 2026-03-28 | Active |
| Create agents as needed | PAUL can spin up new agents when a phase requires capabilities that don't exist — save to roster permanently | 2026-03-28 | Active |

## Success Metrics

| Metric | Target | Current | Status |
|--------|--------|---------|--------|
| Active barber profiles | 1,000+ | - | Not started |
| State board pass rate lift | Measurable improvement | - | Not started |
| Status-driven connections | Users finding each other via toggles | - | Not started |

## Tech Stack / Tools

| Layer | Technology | Notes |
|-------|------------|-------|
| Framework | Next.js 16 (App Router, Turbopack) | Locked |
| Backend | Convex | Real-time, serverless |
| Auth | @convex-dev/auth (Password + Google) | Google not yet surfaced in UI |
| Payments | Stripe | Live key active |
| AI | Claude (7 agents) + Gemini API | Agents: dispatch, lobe, funkie, convex-agent, ink, seo-engine, sentinel |
| Fonts | Spectral (serif), Inter (body), Geist Mono (labels) | Design system locked |
| Hosting | Vercel (frontend), Convex Cloud (backend) | Auto-deploy on push |
| Future | N8N (if workflow use case warrants) | Not committed |

## Links

| Resource | URL |
|----------|-----|
| Repository | https://github.com/fadejunkie/fadejunkie.git |
| Production | fadejunkie.com |
| Convex Dashboard | https://dashboard.convex.dev |

---
*PROJECT.md — Updated when requirements or context change*
*Last updated: 2026-03-28*
