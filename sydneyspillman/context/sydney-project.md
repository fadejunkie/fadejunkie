# Sydney Spillman & Associates — Master Project Context

> Inject this file into every agent task touching the Sydney Spillman engagement.

## Client Profile

- **Client:** Sydney Spillman & Associates
- **Contact:** Sydney Spillman — sydneyspillmanre@gmail.com — 210-346-8614
- **Role:** Real Estate Agent, San Antonio TX
- **Relationship:** Anthony's wife — pro bono / in-house engagement
- **Domain:** sydneyspillman.com (not yet purchased)

## Brand Direction

- **Palette:** White base + blue accents (`#2563eb` primary, `#3b82f6` light blue, `#1e3a5f` navy) + warm neutrals
- **Fonts:** Playfair Display (serif display/headlines), Inter (body/labels)
- **Tone:** Professional warmth, approachable, community-focused
- **Anti-references:** No corporate coldness, no generic real estate template energy

## Engagement Details

- **Scope:** Full brand identity + real estate website launch
- **Phases:** 3 — Brand (weeks 1-2), Build (weeks 2-3), Launch (week 3)
- **Payment:** None — pro bono
- **Timeline:** ~3 weeks from kickoff

## Convex Backend

- **Project ID:** `sydney-spillman`
- **Convex prod deployment:** `unique-crab-445`
- **Task key format:** `{phaseId}-{MILESTONE TITLE}-{taskIndex}` (e.g., `1-DISCOVERY SESSION-0`)
- **Tables:** `sydneyTasks` (projectId, taskKey, completed), `sydneyAgreements`
- **Functions:** `sydneyTasks:getTasks`, `sydneyTasks:setTask`, `sydneyTasks:getAgreement`, `sydneyTasks:saveAgreement`

### Task Key Reference (62 tasks)

**Phase 1 — BRAND (id: 1)**

| Milestone | Key | Task |
|-----------|-----|------|
| DISCOVERY SESSION | `1-DISCOVERY SESSION-0` | Client intake — brand story, values, target audience profile |
| DISCOVERY SESSION | `1-DISCOVERY SESSION-1` | Define brand positioning in SA real estate market |
| DISCOVERY SESSION | `1-DISCOVERY SESSION-2` | Identify tone: professional warmth? modern luxury? community-focused? |
| DISCOVERY SESSION | `1-DISCOVERY SESSION-3` | Competitor audit — 5 comparable SA real estate agents/teams |
| MOOD + DIRECTION | `1-MOOD + DIRECTION-0` | Build mood board — photography style, color feel, typography direction |
| MOOD + DIRECTION | `1-MOOD + DIRECTION-1` | Present 2 direction options |
| MOOD + DIRECTION | `1-MOOD + DIRECTION-2` | **BLOCKER:** Get client approval on direction |
| LOGO DESIGN | `1-LOGO DESIGN-0` | Generate 3 distinct logo concepts |
| LOGO DESIGN | `1-LOGO DESIGN-1` | Present concepts with mockups |
| LOGO DESIGN | `1-LOGO DESIGN-2` | Revision round 1 |
| LOGO DESIGN | `1-LOGO DESIGN-3` | Revision round 2 — final polish |
| LOGO DESIGN | `1-LOGO DESIGN-4` | Export final files: PNG, SVG, PDF |
| LOGO DESIGN | `1-LOGO DESIGN-5` | Create icon-only and wordmark-only variants |
| BRAND SYSTEM | `1-BRAND SYSTEM-0` | Define primary palette |
| BRAND SYSTEM | `1-BRAND SYSTEM-1` | Define secondary palette + neutrals |
| BRAND SYSTEM | `1-BRAND SYSTEM-2` | Select typography |
| BRAND SYSTEM | `1-BRAND SYSTEM-3` | Build brand guidelines PDF |
| BRAND SYSTEM | `1-BRAND SYSTEM-4` | Include application examples |
| BRAND SYSTEM | `1-BRAND SYSTEM-5` | Deliver complete brand kit |

**Phase 2 — BUILD (id: 2)**

| Milestone | Key | Task |
|-----------|-----|------|
| DOMAIN SETUP | `2-DOMAIN SETUP-0` | Configure sydneyspillman.com DNS |
| DOMAIN SETUP | `2-DOMAIN SETUP-1` | Set up hosting environment and deployment pipeline |
| DOMAIN SETUP | `2-DOMAIN SETUP-2` | Send domain confirmation + credentials to client |
| SITE FOUNDATION | `2-SITE FOUNDATION-0` | Set up site platform and dev environment |
| SITE FOUNDATION | `2-SITE FOUNDATION-1` | Install and configure theme matching brand direction |
| SITE FOUNDATION | `2-SITE FOUNDATION-2` | Apply brand colors, typography, logo per guidelines |
| SITE FOUNDATION | `2-SITE FOUNDATION-3` | Configure site settings — contact, social, metadata |
| CORE PAGES | `2-CORE PAGES-0` | Homepage — hero, featured listings, testimonials, about snippet |
| CORE PAGES | `2-CORE PAGES-1` | About page — bio, experience, mission, credentials |
| CORE PAGES | `2-CORE PAGES-2` | Listings page — property grid with placeholder listings |
| CORE PAGES | `2-CORE PAGES-3` | Contact page — form, office info, phone, email |
| CORE PAGES | `2-CORE PAGES-4` | Testimonials page — 4-5 placeholder testimonials |
| PROPERTY FEATURES | `2-PROPERTY FEATURES-0` | **BLOCKER:** Receive property images and listing details |
| PROPERTY FEATURES | `2-PROPERTY FEATURES-1` | Create property listing cards |
| PROPERTY FEATURES | `2-PROPERTY FEATURES-2` | Build listing detail page template |
| PROPERTY FEATURES | `2-PROPERTY FEATURES-3` | Set up listing categories |
| PROPERTY FEATURES | `2-PROPERTY FEATURES-4` | Configure listing search/filter |
| SEO FOUNDATION | `2-SEO FOUNDATION-0` | Keyword research |
| SEO FOUNDATION | `2-SEO FOUNDATION-1` | Write title tags + meta descriptions |
| SEO FOUNDATION | `2-SEO FOUNDATION-2` | Add alt text to all images |
| SEO FOUNDATION | `2-SEO FOUNDATION-3` | Configure URL structure |
| SEO FOUNDATION | `2-SEO FOUNDATION-4` | Submit XML sitemap to GSC |

**Phase 3 — LAUNCH (id: 3)**

| Milestone | Key | Task |
|-----------|-----|------|
| QUALITY ASSURANCE | `3-QUALITY ASSURANCE-0` | Cross-browser testing |
| QUALITY ASSURANCE | `3-QUALITY ASSURANCE-1` | Mobile responsive QA |
| QUALITY ASSURANCE | `3-QUALITY ASSURANCE-2` | Test all links, nav, forms, interactive elements |
| QUALITY ASSURANCE | `3-QUALITY ASSURANCE-3` | Page speed audit |
| GO LIVE | `3-GO LIVE-0` | Final DNS cutover |
| GO LIVE | `3-GO LIVE-1` | Verify SSL certificate |
| GO LIVE | `3-GO LIVE-2` | Confirm all canonical URLs resolve |
| GO LIVE | `3-GO LIVE-3` | Verify live site loads correctly |
| ANALYTICS + TRACKING | `3-ANALYTICS + TRACKING-0` | Create and configure GA4 property |
| ANALYTICS + TRACKING | `3-ANALYTICS + TRACKING-1` | Install GA4 tracking |
| ANALYTICS + TRACKING | `3-ANALYTICS + TRACKING-2` | Set up GSC — verify domain |
| ANALYTICS + TRACKING | `3-ANALYTICS + TRACKING-3` | Verify lead form tracking |
| CLIENT HANDOFF | `3-CLIENT HANDOFF-0` | Live training session |
| CLIENT HANDOFF | `3-CLIENT HANDOFF-1` | Deliver all brand assets |
| CLIENT HANDOFF | `3-CLIENT HANDOFF-2` | Deliver credentials doc |
| CLIENT HANDOFF | `3-CLIENT HANDOFF-3` | Provide quick-reference guide |
| CLIENT HANDOFF | `3-CLIENT HANDOFF-4` | 48-hour post-launch check-in |

## File Paths

| File | Purpose |
|------|---------|
| `sydneyspillman/src/SydneyHub.tsx` | Monolithic hub UI — design prototype reference |
| `sydneyspillman/convex/schema.ts` | Database schema |
| `sydneyspillman/convex/sydneyTasks.ts` | Task CRUD functions |
| `sydneyspillman/CLAUDE.md` | Project instructions |
| `sydneyspillman/context/sydney-project.md` | This file |
| `sydneyspillman/content/` | Agent deliverables (Ink writes copy here, Lobe reads from here) |
| `sydneyspillman/tasks/` | Task templates for Dispatch routing |
| `seo-engine/context/clients/sydneyspillman.md` | SEO Engine + Ink client context |

## Current Status

- Agreement: Not yet signed
- Domain: Not purchased
- Brand assets: None yet
- Site: Not started (SydneyHub.tsx has a website mockup for design reference)
- All 62 Convex tasks: pending (not completed)

## Access Status

| Resource | Status |
|----------|--------|
| Project hub (client) | Live — sydneyspillman.anthonytatis.com |
| Project hub (ops) | Live — sydneyspillman-ops.anthonytatis.com |
| Convex backend | Deployed (prod: unique-crab-445) |
| sydneyspillman.com | Not purchased |
| Google Business Profile | Not created |
| Google Search Console | Not configured |
| GA4 | Not configured |
