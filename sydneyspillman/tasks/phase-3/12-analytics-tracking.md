<!-- plan -->
<!-- client: sydneyspillman -->
<!-- dispatched-from: sydney-phase-3 -->
<!-- depends-on: 11-go-live -->

# Analytics + Tracking — Sydney Spillman & Associates

**Primary agent:** MANUAL (escalation)
**Support:** SEO Engine (verification)

## Why Manual

GA4 property creation, GSC domain verification, and tracking installation require Google account access and manual configuration. This is a **manual checkpoint** with SEO Engine verifying the setup.

## Escalation

Dispatch should write to `dispatch/escalations/sydney-analytics.md`:

```
## Analytics + Tracking — Manual Checkpoint

Site is live on sydneyspillman.com.

### What Anthony Needs to Do
1. Create Google Analytics 4 property for sydneyspillman.com
2. Install GA4 tracking snippet on site (gtag.js or GTM)
3. Set up Google Search Console — verify domain ownership via DNS TXT record
4. Configure lead form tracking — set up conversion events for form submissions
5. Submit XML sitemap to GSC (this completes task 2-SEO FOUNDATION-4 too)

### GA4 Setup Checklist
- Property name: Sydney Spillman & Associates
- Website URL: https://sydneyspillman.com
- Industry: Real Estate
- Enhanced measurement: ON (page views, scrolls, outbound clicks, site search, form interactions)

### GSC Verification
- Method: DNS TXT record (recommended)
- Add TXT record: google-site-verification=<token>
- Submit sitemap: https://sydneyspillman.com/sitemap.xml

### After Setup: SEO Engine Verification
Drop a task in seo-engine/inbox/ to verify:
- GA4 tracking fires on all pages
- GSC shows verified property
- Sitemap accepted with no errors
- Real-time report shows active sessions

### Task Keys to Mark Complete
- 3-ANALYTICS + TRACKING-0 — GA4 property created
- 3-ANALYTICS + TRACKING-1 — GA4 tracking installed
- 3-ANALYTICS + TRACKING-2 — GSC verified
- 3-ANALYTICS + TRACKING-3 — Lead form tracking configured
- 2-SEO FOUNDATION-4 — Sitemap submitted to GSC (carried over from Phase 2)
```

## Convex Task Keys (all manual + SEO Engine verification)
- `3-ANALYTICS + TRACKING-0` — GA4 property (manual)
- `3-ANALYTICS + TRACKING-1` — GA4 tracking (manual)
- `3-ANALYTICS + TRACKING-2` — GSC verification (manual)
- `3-ANALYTICS + TRACKING-3` — Lead form tracking (manual)
