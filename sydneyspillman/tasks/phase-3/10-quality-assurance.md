<!-- execute -->
<!-- client: sydneyspillman -->
<!-- max-turns: 30 -->
<!-- dispatched-from: sydney-phase-3 -->
<!-- depends-on: 07-core-pages,08-property-features,09-seo-foundation -->

# Quality Assurance — Sydney Spillman & Associates

**Primary agent:** Sentinel
**Mode:** Fully auto

## Context

All build work is complete (core pages, property features, SEO foundation). Now Sentinel runs the full QA gauntlet.

Read `sydneyspillman/context/sydney-project.md` for full project context.

## QA Checklist

### 1. Cross-Browser Testing
- Chrome (latest), Safari (latest), Firefox (latest), Edge (latest)
- Verify layout, fonts, colors, interactions in each browser
- Screenshot each browser for comparison

### 2. Mobile Responsive QA
- iOS Safari (iPhone 14/15 viewport)
- Android Chrome (Pixel 7 viewport)
- Tablet (iPad viewport)
- Test hamburger menu, touch targets, scroll behavior
- Verify no horizontal overflow on any page

### 3. Functional Testing
- Test all navigation links (header, footer, internal)
- Test contact form submission (validation, success state)
- Test property listing cards (click through to detail)
- Test search/filter functionality
- Test all interactive elements (buttons, dropdowns, modals)

### 4. Performance Audit
- Run Lighthouse audit (target: 90+ performance, 90+ accessibility)
- Optimize images if any exceed 500KB
- Check for render-blocking resources
- Verify lazy loading on below-fold images

Write QA results to `sydneyspillman/content/10-qa-report.md`.

## Convex Task Keys
- `3-QUALITY ASSURANCE-0` — Cross-browser testing
- `3-QUALITY ASSURANCE-1` — Mobile responsive QA
- `3-QUALITY ASSURANCE-2` — Functional testing
- `3-QUALITY ASSURANCE-3` — Page speed audit

## Completion
Mark all 4 task keys complete when QA passes. If blockers found, write issues to `sydneyspillman/content/10-qa-issues.md` and escalate.
