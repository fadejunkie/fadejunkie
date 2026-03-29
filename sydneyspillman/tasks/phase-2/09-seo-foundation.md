<!-- execute -->
<!-- client: sydneyspillman -->
<!-- max-turns: 40 -->
<!-- dispatched-from: sydney-phase-2 -->
<!-- depends-on: 07-core-pages -->

# SEO Foundation — Sydney Spillman & Associates

**Primary agent:** SEO Engine (strategy + deliverables) → Lobe (implementation)
**Mode:** Fully auto (2-step chain)

## 2-Step Chain

### Step 1: SEO Engine produces the SEO plan
SEO Engine delivers keyword research and on-page optimization specs.

Read `seo-engine/context/clients/sydneyspillman.md` for SEO baseline and keyword targets.

Write to `sydneyspillman/content/09-seo/`:

1. **`keyword-research.md`** — Full keyword research document
   - Primary keywords: san antonio real estate agent, homes for sale san antonio, san antonio realtor
   - Secondary keywords: neighborhood-specific, first-time buyer, military relocation
   - Long-tail opportunities
   - Search volume estimates and difficulty assessment

2. **`meta-tags.md`** — Title tags + meta descriptions for every page
   - Homepage, About, Listings, Contact, Testimonials
   - Character limits respected (title: 60, description: 160)
   - Keywords naturally integrated

3. **`alt-text.md`** — Alt text recommendations for all images
   - Property photos, headshots, decorative images
   - Descriptive, keyword-aware, accessible

4. **`url-structure.md`** — Clean URL slug recommendations
   - `/about`, `/listings`, `/contact`, `/testimonials`
   - Property detail URL pattern: `/listings/{slug}`

5. **`sitemap-spec.md`** — XML sitemap specification
   - All pages with priority and changefreq values

### Step 2: Lobe implements SEO on the site
After SEO Engine delivers, Lobe applies:
- Title tags and meta descriptions to all pages
- Alt text on all images
- URL structure per spec
- Schema markup: LocalBusiness + RealEstateAgent structured data
- XML sitemap generation
- robots.txt configuration

## Convex Task Keys
- `2-SEO FOUNDATION-0` — Keyword research
- `2-SEO FOUNDATION-1` — Title tags + meta descriptions
- `2-SEO FOUNDATION-2` — Alt text
- `2-SEO FOUNDATION-3` — URL structure
- `2-SEO FOUNDATION-4` — Sitemap submitted to GSC (after go-live)

## Completion
Mark keys 0-3 when on-page SEO is implemented. Key 4 (GSC submission) happens after go-live in Phase 3.
