# FadeJunkie — Strategic Brief

> This file is Funkie's persistent memory. Read it at the start of every task.
> Update **Recent Activity** after completing any task.
> Evaluate every task against **Strategic Goals — Q1 2026**.

---

## Vision

FadeJunkie is being built to become the operating layer for the modern barber.

**12-month target — dual model:**

**Platform (fadejunkie.com):** go-to digital home for barbers, students, and shops.
Revenue: subscriptions (pro tier) + affiliate commissions + sponsored placements.

**AI Services Arm:** FadeJunkie takes inbound marketing, content, and digital work from
barbershops and brands. Platform builds credibility → shops hire FadeJunkie.
Client work funds the platform build AND informs what features to build next.

**What winning looks like:**
- Platform: meaningful MRR, active user base
- Services: recurring client roster, revenue funding platform development
- The two arms are synergistic — not separate businesses

---

## Business Model

| Revenue Stream | Arm | How It Works |
|---------------|-----|--------------|
| Pro subscriptions | Platform | Gate premium features (TBD) behind monthly fee |
| Affiliate commissions | Platform | Clicks/conversions on resources directory |
| Sponsored placements | Platform | Featured slots for brands/schools in directory + resources |
| AI services retainers | Services | Monthly content, marketing, digital work for shops/brands |
| Project work | Services | One-off deliverables: websites, campaigns, audits |

**The flywheel:** platform credibility earns services clients → services revenue funds features → features attract more barbers → more valuable services offering.

---

## Brand

**Who FadeJunkie is for:**
- Barbers (pros and apprentices) — tools, community, digital presence
- Students — state board prep, school finder, career resources
- Shops — website builder, booking, marketing
- Brands — affiliate placement, sponsored content, reach

**What makes it different:**
- Built by someone who knows the culture — not an outsider building "barber software"
- Tools that actually matter (state board prep, real business tools)
- Community-first, not SaaS-first
- AI-native from day one

**Voice:** direct, confident, barber culture-aware, punk undertone
**Aesthetic:** skull logo, warm cream palette, halftone texture, Spectral serif + Geist Mono

---

## Strategic Goals — Q1 2026

> Full detail in: `C:/Users/twani/fadejunkie/funkie/memory/goals.md`
> Funkie evaluates every task against these.

### Platform Arm
- [ ] User growth: 10 real barbers, external traffic to state board tools, demo-ready profiles
- [ ] Revenue infrastructure: pro tier defined → launched, affiliate clicks trackable
- [ ] Platform build: all P0 + P1 audit items, identify + ship next barber tool

### Services Arm
- [ ] Define the offer: one-page services doc, pricing model
- [ ] Land first client: 3 prospects, first outreach, first paid engagement
- [ ] Build proof: one AI services case study / content piece

---

## Project State

**Status:** Active development
**Stack:** Next.js 15 (App Router) + Convex + @convex-dev/auth + Tailwind CSS 4 + Radix UI
**Live domain:** fadejunkie.com

## Key Architecture Decisions

- Auth: Password provider only (open sign-up). No OAuth.
- Convex backend vars (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`) live in the Convex deployment — not `.env.local`
- Import alias: `@/*` maps to project root
- Subdomain routing handled in `middleware.ts` (replaced `proxy.ts`)
- Images: Convex file storage, referenced by storageId + resolved URL

## Active Features

| Feature | Status | Key File |
|---------|--------|----------|
| Community feed | Live | `app/(auth)/home/page.tsx` |
| Barber profile editor | Live | `app/(auth)/profile/page.tsx` |
| Shop website builder | Live | `app/(auth)/website/page.tsx` |
| Public barber profile | Live | `app/barber/[slug]/page.tsx` |
| Public shop page | Live | `app/shop/[userId]/page.tsx` |
| School/barber directory | Live | `app/directory/page.tsx` |
| Resources / affiliate dir | Live | `app/(auth)/resources/page.tsx` |
| Flashcards (Milady + TDLR) | Live | `app/(auth)/tools/flashcards/page.tsx` |
| Practice test | Live | `app/(auth)/tools/practice-test/page.tsx` |
| TDLR Exam guide | Live | `app/(auth)/tools/exam-guide/page.tsx` |

## Convex Tables

`barbers`, `gallery`, `posts`, `likes`, `shops`, `resources`, `flashcardDecks`, `flashcards`, `starredCards`, `testResults`, `examProgress`, `locations`

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project (run npm commands from here)
  funkie/                     ← Funkie agent
  pm/                         ← PM agent — autonomous project driver
  context/                    ← this file
```

## Funkie ↔ Claude Code Communication

- Inbox: `C:/Users/twani/fadejunkie/funkie/inbox/` — tasks dropped here
- Outbox: `C:/Users/twani/fadejunkie/funkie/outbox/` — results written here
- Pending: `C:/Users/twani/fadejunkie/funkie/outbox/pending/` — plans awaiting approval
- Session: `C:/Users/twani/fadejunkie/funkie/.last-session`
- Goals: `C:/Users/twani/fadejunkie/funkie/memory/goals.md`

## Git Safety

Repository at workspace root: `C:/Users/twani/fadejunkie/.git` (covers app/, funkie/, context/)
Before any file changes: `git -C "C:/Users/twani/fadejunkie" add -A && git -C "C:/Users/twani/fadejunkie" commit -m "snapshot: before [task]"`
After completing changes: `git -C "C:/Users/twani/fadejunkie" add -A && git -C "C:/Users/twani/fadejunkie" commit -m "[type]: [description]"`

---

## Recent Activity

| Date | Task | Strategic Impact | What Moved |
|------|------|-----------------|------------|
| 2026-03-10 | Initial setup | Foundation | Git initialized, context file, inbox/outbox/pending layer live |
| 2026-03-10 | Workspace reorg | Foundation | Next.js → app/, Funkie → funkie/, context → context/ |
| 2026-03-10 | Codebase audit | P0/P1 Platform build | 22 items identified across P0–P3; plan in funkie/outbox/pending/codebase-audit.md |
| 2026-03-12 | Soul upgrade | Both arms | Vision, Business Model, Brand, Q1 Goals live in context; Funkie SYSTEM_PROMPT upgraded; goals.md created |
| 2026-03-14 | Pro tier strategy | Revenue Infrastructure | Pro tier defined: $9/mo, 5 features, 7-day build plan, affiliate model. Plan in funkie/outbox/pending/pro-tier-strategy.md |
| 2026-03-15 | Pro tier strategy v2 | Revenue Infrastructure | Refreshed plan with deep codebase research: confirmed zero payment infra exists, gallery/test gates are trivial, schema changes spec'd. Updated dates (ship March 22, 9 days for acquisition). Pending approval. |
| 2026-03-29 | Sydney Spillman hub | Services arm | Project hub scaffolded for Sydney Spillman & Associates (pro bono, Anthony's wife). Standalone Vite+React+Convex app at sydneyspillman/. Live at sydneyspillman.anthonytatis.com. 4 active clients total. |
