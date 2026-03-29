<!-- execute -->
<!-- client: sydneyspillman -->
<!-- max-turns: 80 -->
<!-- dispatched-from: sydney-phase-2 -->
<!-- depends-on: 06-site-foundation -->
<!-- chain-next: 08-property-features,09-seo-foundation -->

# Core Pages — Sydney Spillman & Associates

**Primary agent:** Ink (copy first) → Lobe (build)
**Mode:** Fully auto (2-step chain)

## 2-Step Chain

This milestone executes in two steps:

### Step 1: Ink writes page copy
Ink produces copy for all 5 core pages, written to `sydneyspillman/content/07-pages/`:
- `homepage.md` — Hero tagline, featured listings intro, testimonials preview, about snippet
- `about.md` — Sydney's bio, experience, mission statement, credentials
- `listings.md` — Listings page intro, category descriptions, placeholder listing text
- `contact.md` — Contact page intro, form field labels, office info block
- `testimonials.md` — 4-5 placeholder testimonials with realistic names and feedback

Read `sydneyspillman/content/01-brand-positioning.md` for voice/tone.
Read `sydneyspillman/content/04-brand-guidelines.md` for brand rules.

### Step 2: Lobe builds the pages
After Ink delivers copy, Lobe builds all 5 pages using:
- Copy from `sydneyspillman/content/07-pages/`
- Brand system from `sydneyspillman/content/04-*`
- Design reference from `SydneyHub.tsx` → `WebsitePage()`

Pages to build:
1. **Homepage** — hero with tagline, featured listings grid, testimonials preview, about snippet
2. **About** — Sydney's bio, experience, mission statement, credentials
3. **Listings** — property grid with placeholder listings (beds/baths/sqft/price)
4. **Contact** — form (name, email, phone, message), office info, phone, email
5. **Testimonials** — client reviews (4-5 placeholder testimonials)

## Convex Task Keys
- `2-CORE PAGES-0` — Homepage
- `2-CORE PAGES-1` — About page
- `2-CORE PAGES-2` — Listings page
- `2-CORE PAGES-3` — Contact page
- `2-CORE PAGES-4` — Testimonials page

## Completion
Mark all 5 task keys complete when all pages are built, populated with copy, and rendering correctly.
