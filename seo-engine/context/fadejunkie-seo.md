# FadeJunkie SEO Context

Last updated: 2026-03-12

---

## Domain & Platform

- **Domain:** fadejunkie.com
- **Stack:** Next.js 15 (App Router) + Convex + Tailwind CSS
- **Hosting:** Vercel + Cloudflare (proxy OFF, CNAME to Vercel)
- **Subdomains:** `*.fadejunkie.com` — shop subdomain per barber (e.g., `joes-barbershop.fadejunkie.com`)

---

## Target Audiences

| Audience | Description | SEO Intent |
|----------|-------------|------------|
| Barbers | Licensed barbers seeking community, tools, and business resources | Commercial / navigational |
| Students | Cosmetology / barber school students prepping for state board exams | Informational / transactional |
| Shop Owners | Shop owners managing bookings and staff | Commercial / navigational |
| Schools | Barber schools looking for student recruitment tools | Commercial |

**Primary geo focus:** Texas (TDLR jurisdiction) — expandable to other states later.

---

## Current Pages / URLs

| URL | Description | SEO Status |
|-----|-------------|------------|
| `/` | Public landing page | Needs meta optimization |
| `/signin` | Sign in / sign up | Not indexable (auth page) |
| `/(auth)/home` | Community feed | Not indexable (auth-protected) |
| `/(auth)/tools` | State board prep tools | Not indexable — should have public landing |
| `/(auth)/tools/exam-guide` | TDLR Practical Exam Guide | Not indexable — high SEO value if public |
| `/(auth)/tools/flashcards` | Flip-card study mode | Not indexable — high SEO value if public |
| `/(auth)/tools/practice-test` | Timed practice test | Not indexable — high SEO value if public |
| `/(auth)/resources` | Affiliate resource directory | Not indexable — partial public version could rank |
| `/barber/[slug]` | Public barber profile | Indexable — local SEO opportunity per barber |
| `/shop/[userId]` | Public shop website | Indexable — local SEO opportunity per shop |

---

## Priority Keywords

### State Board / Exam Prep (Students)
- `texas barber state board exam` — High intent, informational
- `TDLR barber practical exam` — High intent, Texas-specific
- `barber state board practice test` — Transactional (tool)
- `TDLR barber exam guide` — Informational
- `barber school flashcards` — Informational / transactional
- `how to pass barber state board exam texas` — Long-tail, high intent

### Barber Tools & Supplies (Barbers + Students)
- `best clippers for barbers` — Commercial intent, affiliate
- `barber starter kit` — Commercial, student-focused
- `barber school supply list texas` — Long-tail, student
- `barber tools for beginners` — Informational → commercial

### Local / Shop (Barbers + Shop Owners)
- `barber shop [city] texas` — Local SEO (per public shop page)
- `[city] barber` — Local (per public barber profile)
- `barber booking software` — Commercial, shop owners
- `barber website builder` — Navigational / commercial

### Community / Platform (Barbers)
- `barber community app` — Navigational / commercial
- `barber network texas` — Local community
- `fadejunkie` — Brand (navigational, should dominate)

---

## Known Content Gaps

1. **No public SEO-optimized pages for state board tools** — exam guide, flashcards, and practice test are auth-gated. A public landing page for each tool would capture high-intent student search traffic.
2. **No blog / content hub** — zero informational content ranking for long-tail study and barber technique queries.
3. **No structured data** — public barber/shop pages lack `LocalBusiness` / `BarberShop` schema.
4. **No sitemap.xml** — Vercel/Next.js default may not auto-generate one; needs verification.
5. **No meta descriptions on most pages** — title tags and descriptions need audit.
6. **No Google Business Profile strategy** — shop owners on FadeJunkie should be guided to claim/optimize GBP.

---

## Quick Wins (Estimated High Impact / Low Effort)

1. Add `LocalBusiness` / `BarberShop` schema to `/barber/[slug]` and `/shop/[userId]`
2. Create public `/tools` landing page with SEO copy (currently auth-gated)
3. Generate and submit `sitemap.xml`
4. Add title + meta description to landing page `/`
5. Create a `/blog` or `/guides` section with one pillar post: "How to Pass the Texas Barber State Board Exam"

---

## Competitors to Monitor

- **StateboardPrep.com** — generic state board prep tools
- **Milady** (milady.cengage.com) — textbook publisher with online practice tests
- **Booksy / StyleSeat / GlossGenius** — booking platforms with barber-facing content
- **Vagaro** — booking + website builder for barbers/shops

---

## Technical SEO Notes

- Next.js App Router supports `generateMetadata()` per route — use this for dynamic meta
- `robots.ts` or `robots.txt` should explicitly allow public routes and block auth routes
- Vercel auto-generates `/_next/` paths — ensure Cloudflare doesn't cache auth-protected pages
- Subdomain shops (`*.fadejunkie.com`) need canonical tags pointing to the primary domain equivalent if pages are duplicated
