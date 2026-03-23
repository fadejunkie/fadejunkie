# SEO Engine — Accumulated Knowledge

This file is injected into every SEO Engine prompt. Update it after each completed task with new patterns, insights, and lessons learned.

---

## Core Methodology

### Research Order
1. **Keyword Research** — identify primary + LSI terms, map intent (informational / navigational / commercial / transactional)
2. **Content Gap Analysis** — compare target domain against top 3–5 ranking competitors; find topics they rank for that the target doesn't
3. **Technical SEO Audit** — crawlability, indexation, Core Web Vitals, canonical issues, schema markup, meta completeness
4. **Link Strategy** — identify linkable assets, prospect outreach targets, competitor backlink gaps

### SERP Analysis Checklist
- Note the SERP features present (featured snippets, People Also Ask, local pack, image carousel)
- Identify content format of top results (listicle, how-to, comparison, landing page)
- Check title tag patterns — does length/keyword placement matter here?
- Assess difficulty by domain authority of top 3 results + estimated traffic

### Keyword Research Standards
- Always map intent before recommending: informational, navigational, commercial, transactional
- Bucket keywords by funnel stage: awareness / consideration / conversion
- Include LSI (latent semantic index) variations and question-form variants
- Estimate difficulty on a 1–100 scale (low <30, medium 30–60, high 60+)
- Note monthly search volume range (exact data unavailable without paid tool — estimate from SERP competition density and relative interest)

---

## Deliverable Standards

### All Deliverables
- Written in clean, professional markdown
- Include executive summary for client-facing docs
- Cite all sources (WebSearch results, competitor URLs reviewed)
- Quantify recommendations: search volume estimates, difficulty, timeline, effort/impact matrix

### Content Brief Template
```
## Content Brief: [Title]
- Target keyword (primary):
- Secondary keywords (3–5):
- Search intent:
- Recommended title tag:
- Recommended meta description:
- Recommended URL slug:
- Word count target:
- Content format (how-to / listicle / pillar / comparison):
- Schema type:
- Internal link targets (3–5):
- External authority links to cite:
- Outline:
  1. H1
  2. H2 sections
  3. CTA
- Estimated difficulty: X/100
- Priority: High / Medium / Low
```

### Keyword Research Report Template
```
## Keyword Research: [Topic / Domain]
### Executive Summary
### Primary Keywords (high priority)
| Keyword | Est. Volume | Difficulty | Intent | Notes |
### Secondary Keywords (medium priority)
### Long-tail / Question Keywords
### Competitor Keywords (gaps)
### Recommended Content Clusters
```

### Technical SEO Audit Template
```
## Technical SEO Audit: [Domain]
### Executive Summary
### Indexation & Crawlability
### Meta Tags (title, description, canonical)
### Structured Data / Schema
### Core Web Vitals (LCP, INP, CLS)
### Mobile Usability
### Internal Linking
### Priority Action Items (ranked by impact)
```

---

## Tool & Source Usage

### WebSearch Best Practices
- Search `site:competitor.com` to understand their content structure
- Search the target keyword and note SERP features before recommending
- Use `intitle:` and `inurl:` operators to find specific page types
- Check Google's "People Also Ask" section — excellent for content brief subheadings

### WebFetch Best Practices
- Fetch competitor pages to inspect title tags, H1, word count, schema
- Check `<head>` for canonical, robots meta, OG tags
- Look for schema.org JSON-LD in `<script type="application/ld+json">`

### Schema Types by Use Case
- Local business: `LocalBusiness` (or `BarberShop`)
- How-to content: `HowTo`
- FAQ sections: `FAQPage`
- Articles/blog: `Article`
- Courses/study tools: `Course` or `LearningResource`
- Product/affiliate pages: `Product`

---

## Niche Knowledge: Barber / Beauty Industry SEO

### High-Value Content Angles
- "How to pass the [state] barber state board exam" — high informational intent, low competition
- "Best barber tools for beginners" — commercial intent, affiliate opportunity
- "[City] barber school" — local SEO, high commercial intent
- "TDLR barber license requirements" — Texas-specific, navigational intent

### Local SEO Signals
- Google Business Profile: NAP consistency (Name, Address, Phone) across all citations
- Key citation sources for barbers: Yelp, StyleSeat, Booksy, Vagaro, GlossGenius, The Knot
- Review velocity matters more than total count for local ranking
- Service area pages outperform single location pages for multi-city reach

### Texas / TDLR Angle
- TDLR (Texas Department of Licensing and Regulation) is the governing body for barbers in TX
- Content around "TDLR barber exam", "Texas barber license", "TDLR practical exam" captures high-intent students
- Barber schools in TX cluster around DFW, Houston, San Antonio, Austin — local SEO opportunity per city

### Affiliate / Monetization Keywords
- "best clippers for barbers" — very high commercial intent
- "barber chair reviews" — high purchase intent
- "barber school supplies list" — student audience, early funnel
- "booking software for barbers" — B2B / shop owner intent
