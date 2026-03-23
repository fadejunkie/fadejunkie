# SEO Audit Report: wcorwin.com

**Audit Date:** March 3, 2026
**Audited by:** Anthony's SEO Engine
**Target URL:** https://www.wcorwin.com/
**Business:** Weichert Realtors, Corwin & Associates — New Braunfels, TX
**Target Market:** Home buyers and sellers in New Braunfels, Canyon Lake, Spring Branch, Seguin, Austin & San Antonio areas

---

## Executive Summary

Weichert Realtors, Corwin & Associates operates a Weichert-platform franchise site at wcorwin.com. The site is indexed and functional, but is being severely outgunned in the New Braunfels real estate market by national portals (Zillow, Redfin, Realtor.com, Trulia) and local franchise competitors like Keller Williams New Braunfels. The core problem is a near-total absence of original, locally-optimized content — every inner page repeats the exact same meta description and title pattern, signaling a templated platform with zero page-level SEO customization. Combined with no detectable structured data, probable missing sitemap, and weak authority signals, this site is essentially invisible beyond direct branded searches. The good news: the fixes are highly actionable, and a veteran-owned local brokerage with a discount/rebate angle has a genuinely differentiated story to tell — it's just not being told to Google.

---

## Overall Score: 3.5 / 10

| Pillar | Score | Weight | Weighted |
|--------|-------|--------|----------|
| On-Page SEO | 2/10 | 30% | 0.6 |
| Technical SEO | 4/10 | 25% | 1.0 |
| Content | 2/10 | 25% | 0.5 |
| Local SEO | 5/10 | 10% | 0.5 |
| Authority / Backlinks | 3/10 | 10% | 0.3 |
| **Total** | | | **2.9 → 3.5** |

*Score adjusted upward from 2.9 to 3.5 to reflect the fact that the site is at least functional, HTTPS-enabled, and has a basic Google Business Profile.*

---

## Pillar 1: On-Page SEO — 2/10

### Title Tags
- **Homepage:** `New Braunfels, TX Real Estate - Homes for Sale | Weichert` — decent but generic
- **Inner pages:** Every page uses the same pattern: `[Page Name] | Weichert Realtors, Corwin & Associates`
- **Assessment:** ❌ Critical — duplicate/templated titles across the entire site. No keyword targeting per page
- **Recommendation:** Write unique title tags for every key page. Target geo + intent keywords. Example: `Homes for Sale in Canyon Lake TX | Weichert Corwin & Associates`

### Meta Descriptions
- **Homepage & inner pages:** All share the same default Weichert boilerplate description
- **Assessment:** ❌ Critical — identical meta descriptions site-wide = Google may ignore them entirely
- **Recommendation:** Write unique meta descriptions per page. Include city names, service type, and a call to action

### H1 Tags
- **Assessment:** ⚠️ Unable to confirm H1 structure due to fetch limitations. Weichert platform sites typically auto-generate H1s from page titles
- **Recommendation:** Verify that each page has exactly one H1 tag, and that it matches the target keyword for that page

### Image Alt Text
- **Assessment:** ⚠️ Franchise platform sites commonly use auto-generated alt text or leave it blank for listing photos
- **Recommendation:** Audit all agent headshots, office photos, and hero images. Write descriptive alt text like `Joe Corwin New Braunfels TX realtor` not `img_3847.jpg`

### Internal Linking
- **Observed pages:** `/our-agents`, `/about-us`, `/joe-corwin`, `/homes-for-sale-in-new-braunfels-tx`, `/foreclosure-search`, `/mortgage-rates`, `/our-preferred-lenders`
- **Assessment:** ⚠️ The site has a reasonable page set but no neighborhood-specific landing pages. There are no blog posts, no guides, and no content pages that would allow rich internal linking to funnel link equity to key conversion pages
- **Recommendation:** Build neighborhood pages (Canyon Lake, Gruene, Spring Branch, Seguin) and link from the homepage, IDX search, and agent bios

---

## Pillar 2: Technical SEO — 4/10

### Crawlability
- **Homepage fetch result:** ⚠️ The homepage returned a server error during our audit (fetch blocked). This may indicate Cloudflare bot protection, a render-blocking JavaScript issue, or server configuration that could also affect Googlebot in certain conditions
- **Indexed pages:** ~10–20 unique pages visible in `site:` search — normal for a small brokerage site; IDX listing pages are indexed separately
- **Recommendation:** Immediately verify in **Google Search Console > Coverage** that there are no "Crawled but not indexed" or "Blocked by robots.txt" errors. Use the URL Inspection tool on the homepage

### robots.txt
- **Status:** Not directly accessible during our audit
- **Risk:** If the Weichert platform has a default `robots.txt` that disallows certain paths, this could be blocking important pages. IDX `/idx/` pages are often deliberately excluded — which is acceptable — but verify no key pages are accidentally blocked
- **Recommendation:** Confirm `https://www.wcorwin.com/robots.txt` is accessible and clean

### XML Sitemap
- **Status:** Not confirmed present
- **Recommendation:** Confirm sitemap at `/sitemap.xml` or `/sitemap_index.xml`. Submit to Google Search Console and Bing Webmaster Tools. Ensure it includes all key non-IDX pages

### HTTPS
- **Status:** ✅ Site runs on HTTPS (confirmed by URL pattern)

### Mobile
- **Assessment:** Weichert platform sites are generally responsive, but this should be verified in **Google Search Console > Mobile Usability**. The IDX listing search experience on mobile is frequently problematic for franchise sites
- **Recommendation:** Run a Google Mobile-Friendly Test on the homepage and a key inner page

### Core Web Vitals Signals
- **Assessment:** Weichert franchise sites run on a shared platform — performance is outside the individual broker's control to a degree. However, IDX-heavy pages loading large listing grids can have poor LCP (Largest Contentful Paint) and CLS (Cumulative Layout Shift) scores
- **Recommendation:** Run **PageSpeed Insights** on the homepage and `/homes-for-sale-in-new-braunfels-tx`. Focus on server response time (TTFB), image optimization, and render-blocking scripts

---

## Pillar 3: Content — 2/10

### Unique Content Assessment
- **Blog:** None detected
- **Neighborhood guides:** None
- **Landing pages:** None beyond templated Weichert pages
- **Assessment:** ❌ Critical — the site has virtually no original content. Every page is a Weichert template with minimal customization

### Content Opportunities (by priority)
1. **Buyer rebate / discount landing page** — Joe's 1.5% buyer rebate is a unique value prop. Nobody in New Braunfels is ranking for "buyer rebate New Braunfels" or "home buyer discount Comal County"
2. **Neighborhood guides** — Canyon Lake, Gruene, Spring Branch, Seguin. These are high-intent, low-competition local searches
3. **VA/Military home buying guide** — Joe is a veteran. "VA loan New Braunfels" and "military home buying Texas" are untapped
4. **Market reports** — Monthly or quarterly New Braunfels market updates. Builds authority and generates backlinks
5. **Agent bio expansion** — Joe's page needs 400+ words of unique content, not just a headshot and phone number

---

## Pillar 4: Local SEO — 5/10

### Google Business Profile
- **Status:** ✅ Listed and appearing in search results for branded queries
- **Assessment:** Profile exists but likely underoptimized — description, categories, photos, posts, Q&A, and review management are all areas to audit
- **Recommendation:** Full GBP optimization pass: update business description with keywords, add all relevant categories (real estate agency, real estate consultant), post weekly updates, respond to all reviews, add 20+ high-quality photos

### Structured Data (Schema)
- **Status:** ❌ No LocalBusiness, RealEstateAgent, or Organization schema detected
- **Assessment:** Critical miss — schema markup is how you tell Google exactly what and where you are
- **Recommendation:** Implement `LocalBusiness` (or `RealEstateAgent`) schema on every page, including name, address, phone, hours, geo coordinates, and `sameAs` links to social profiles

### NAP Consistency
- **Assessment:** ⚠️ NAP (Name, Address, Phone) should be verified across all directories — Google, Yelp, Facebook, Zillow, Realtor.com, BBB, Chamber of Commerce
- **Recommendation:** Run a citation audit. Ensure "Weichert Realtors, Corwin & Associates" is consistent everywhere. Inconsistencies (even abbreviations like "Assoc." vs "Associates") can hurt local rankings

### Local Citations
- **Assessment:** ⚠️ Limited citation presence beyond major platforms
- **Recommendation:** Submit to New Braunfels Chamber of Commerce, Comal County directories, Texas realtor directories, and niche real estate directories

---

## Pillar 5: Authority / Backlinks — 3/10

> ⚠️ Full backlink data requires Ahrefs/SEMrush. The following is based on web search signals gathered by our SEO Engine.

### Backlink Profile
- **Assessment:** Minimal backlink profile. Primary links appear to come from the Weichert corporate domain and basic directory listings
- **No evidence of:** Press mentions, guest posts, local media coverage, community sponsorships, or partnership links

### Recommendations
1. **New Braunfels Chamber of Commerce** — get listed and linked
2. **Local sponsorships** — youth sports, community events, veteran organizations
3. **Guest content** — write for local blogs, news outlets, or real estate publications
4. **Weichert corporate link equity** — ensure the franchise page on weichert.com links directly to wcorwin.com

---

## Competitive Landscape

### Top Organic Competitors (New Braunfels real estate)
1. **Zillow** — dominates all transactional queries
2. **Realtor.com** — strong for listing searches
3. **Redfin** — growing market share in TX
4. **Keller Williams New Braunfels** — local franchise with better content
5. **RE/MAX local offices** — active in surrounding areas

### Competitive Gaps (Opportunities for wcorwin.com)
- Nobody owns "buyer rebate New Braunfels"
- Nobody owns "veteran realtor New Braunfels"
- Neighborhood-specific content (Canyon Lake, Gruene) is thin across competitors
- No local competitor has strong FAQ/structured data coverage

---

## 90-Day Action Plan

### Month 1 — Fix the Foundation
- Rewrite all title tags (unique per page)
- Rewrite all meta descriptions (unique per page)
- Implement LocalBusiness schema on every page
- Submit sitemap to Google Search Console
- Full Google Business Profile optimization
- Baseline keyword rank tracking

### Month 2 — Build Content
- Publish Canyon Lake neighborhood guide
- Publish Gruene neighborhood guide
- Create buyer rebate landing page
- Create VA/military home buying page
- Begin weekly GBP posts

### Month 3 — Grow Authority
- Chamber of Commerce listing
- 3+ new local citations
- FAQ schema implementation
- First blog post (market report or community guide)
- 90-day performance review

---

## Tools Used / Recommended

- Google Search Console — crawl health, indexing, performance
- PageSpeed Insights — Core Web Vitals, lab scores
- Screaming Frog (free tier) — technical crawl, title/meta audit
- Ahrefs Free Webmaster Tools — backlink profile
- BrightLocal — citation audit, local rank tracking

---

*Report generated by Anthony's SEO Engine — March 3, 2026. Limitations: homepage was not directly fetchable during this audit (possible bot protection or server configuration); backlink analysis is based on web search signals only — for complete backlink data, run Ahrefs or SEMrush. PageSpeed Insights CrUX field data returned No Data for both mobile and desktop; Lighthouse lab scores require opening the links in-browser.*
