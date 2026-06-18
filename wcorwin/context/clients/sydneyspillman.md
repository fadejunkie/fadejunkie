# Sydney Spillman & Associates — Client Context

## Client Info
- **Client:** Sydney Spillman & Associates
- **Contact:** Sydney Spillman
- **Email:** sydneyspillmanre@gmail.com
- **Phone:** 210-346-8614
- **Role:** Real Estate Agent
- **Market:** San Antonio, TX
- **Relationship:** Anthony's wife — in-house / pro bono

## Engagement
- **Type:** Pro bono / in-house (no invoicing)
- **Scope:** Full brand identity + real estate website launch
- **Timeline:** 3 weeks (Brand → Build → Launch)
- **Retainer:** None — one-time deliverable

## Brand Direction
- **Colors:** White & blue, professional but light
  - Primary: `#2563eb` (blue), `#3b82f6` (light blue), `#1e3a5f` (navy)
  - Light mode default, dark toggle available
- **Fonts:** Playfair Display (serif headlines), Inter (body/labels)
- **Tone:** Professional warmth, approachable, community-focused
- **Anti-references:** No corporate coldness, no generic real estate template energy

## Deliverables
### Phase 1: BRAND (Weeks 1–2)
- Discovery session (intake, positioning, competitor audit)
- Mood + direction (2 options, client approval gate)
- Logo design (3 concepts, 2 revision rounds, exports)
- Brand system (palette, typography, guidelines PDF)

### Phase 2: BUILD (Weeks 2–3)
- Domain setup (sydneyspillman.com DNS, SSL, hosting)
- Site foundation (platform setup, theme, branding)
- Core pages (Home, About, Listings, Contact, Testimonials)
- Property features (listing cards, search/filter, categories)
- SEO foundation (keywords, meta tags, sitemap)

### Phase 3: LAUNCH (Week 3)
- QA (cross-browser, mobile, speed)
- Go live (DNS cutover, SSL verification)
- Analytics (GA4, GSC)
- Client handoff (training, assets, credentials)

## SEO Baseline
- **Domain:** sydneyspillman.com (not yet live — brand new domain, zero history)
- **GSC:** Not yet configured
- **GBP:** Not yet created
- **Backlinks:** None — clean slate
- **Domain Authority:** 0 (new domain)

## Target Keywords

| Priority | Keyword | Intent | Difficulty |
|----------|---------|--------|------------|
| Primary | san antonio real estate agent | Commercial | High |
| Primary | homes for sale san antonio | Transactional | High |
| Primary | san antonio realtor | Commercial | High |
| Secondary | san antonio tx homes | Transactional | Medium |
| Secondary | real estate agent near me san antonio | Local | Medium |
| Long-tail | first time home buyer san antonio | Informational | Low |
| Long-tail | san antonio neighborhoods to live in | Informational | Low |
| Long-tail | selling a home in san antonio | Informational | Medium |
| Branded | sydney spillman realtor | Navigational | Low |
| Branded | sydney spillman san antonio | Navigational | Low |

## Competitive Landscape

### Direct Competitors (SA Agents)
- Top-producing agents with established web presence and GBP profiles
- Most have Zillow Premier Agent, Realtor.com, and Homes.com profiles
- Few have strong independent SEO — most rely on brokerage domain authority

### Aggregator Competition
- Zillow, Realtor.com, Redfin, Homes.com dominate SERP positions 1-5 for transactional queries
- Strategy: target long-tail neighborhood/lifestyle queries where aggregators are weak
- Focus on local intent queries and branded presence

### Opportunity Gaps
- Neighborhood-specific content (Alamo Heights, Stone Oak, Boerne, New Braunfels)
- First-time buyer educational content
- San Antonio relocation guides
- Military/JBSA-related real estate content (Fort Sam Houston, Lackland, Randolph)

## SEO Strategy Notes
- **Comparable engagement:** WCORWIN (Weichert Realtors — Corwin & Associates) — similar real estate SEO playbook
- **Phase 1 priority:** On-page SEO foundation (meta tags, structured data, sitemap) before any off-page
- **Content strategy:** Blog/resource pages targeting long-tail keywords post-launch
- **Local SEO:** GBP creation is a Phase 3 / post-launch priority
- **Schema markup:** LocalBusiness + RealEstateAgent structured data on every page

## Project Hub
- **Client view:** https://sydneyspillman.anthonytatis.com
- **Ops view:** https://sydneyspillman-ops.anthonytatis.com
- **Convex project:** `sydney-spillman`
- **Convex prod:** `unique-crab-445`
- **Vercel project:** `sydneyspillman`
- **Source:** `fadejunkie/sydneyspillman/`

## Key Files
- `sydneyspillman/src/SydneyHub.tsx` — monolithic hub UI
- `sydneyspillman/convex/schema.ts` — sydneyTasks + sydneyAgreements
- `sydneyspillman/convex/sydneyTasks.ts` — CRUD functions
- `sydneyspillman/CLAUDE.md` — project-specific instructions

## Progress Log
- **2026-03-29:** Project hub scaffolded and deployed. All 4 tabs live (Workflow, Scope, Agreement, Website Preview). DNS configured. Convex backend deployed (dev + prod).
