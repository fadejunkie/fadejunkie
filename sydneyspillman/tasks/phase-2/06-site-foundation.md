<!-- execute -->
<!-- client: sydneyspillman -->
<!-- max-turns: 60 -->
<!-- dispatched-from: sydney-phase-2 -->
<!-- depends-on: 05-domain-setup -->
<!-- chain-next: 07-core-pages -->

# Site Foundation — Sydney Spillman & Associates

**Primary agent:** Lobe
**Mode:** Fully auto

## Context

Brand system is complete (Phase 1 done). Domain is purchased and configured. Now we build the site foundation.

Read `sydneyspillman/context/sydney-project.md` for full project context.
Read `sydneyspillman/content/04-brand-guidelines.md` for brand system.
Read `sydneyspillman/content/04-color-palette.md` for colors.
Read `sydneyspillman/content/04-typography.md` for fonts.

Reference `sydneyspillman/src/SydneyHub.tsx` → `WebsitePage()` section for the design mockup that shows what the final site should feel like.

## Deliverables

### Site Setup
The Sydney Spillman website will be built as part of the FadeJunkie Next.js app or as a standalone project (TBD based on Anthony's decision). Either way, Lobe should:

1. **Set up development environment** — project scaffold, dependencies, dev server
2. **Install and configure theme** matching the approved brand direction
   - Playfair Display for display/headers
   - Inter for body/labels
   - Blue/white palette with warm neutrals
3. **Apply brand identity** — colors, typography, logo placement per guidelines
4. **Configure site settings** — contact info, social links, metadata
   - Contact: sydneyspillmanre@gmail.com, 210-346-8614
   - Social links: TBD (escalate if not provided)

## Design Reference

The `WebsitePage()` function in `sydneyspillman/src/SydneyHub.tsx` contains a full mockup with:
- Hero section with tagline
- About section
- Featured listings grid
- Testimonials
- Contact section

Use this as the design prototype — match the layout, spacing, and feel.

## Convex Task Keys
- `2-SITE FOUNDATION-0` — Platform + dev environment
- `2-SITE FOUNDATION-1` — Theme configured
- `2-SITE FOUNDATION-2` — Brand applied
- `2-SITE FOUNDATION-3` — Site settings configured

## Completion
Mark all 4 task keys complete when the foundation is solid and the dev server shows a branded shell.
