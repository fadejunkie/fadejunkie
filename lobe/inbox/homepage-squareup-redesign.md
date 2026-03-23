<!-- execute -->
<!-- max-turns: 80 -->

# Homepage Redesign — Clone squareup.com's Design Language

## Directive

**Scrub every hardcoded FadeJunkie style from the homepage.** No warm cream backgrounds, no halftone dots, no grain overlays, no olive colors, no `rgba(22,16,8,*)` translucency, no `#fff4ea`. All of that is gone.

The new design language is **squareup.com** — clean, minimal, modern. Study the design system below and apply it exactly. Every font, color, spacing value, button style, and layout pattern should feel like it came from Square's design team.

## squareup.com Design System (follow exactly)

### Typography
- **Font family:** System stack — `"Helvetica Neue", Helvetica, Arial, sans-serif` (Square uses "Cash Sans" which we can't access — use the fallback stack)
- **Display headings:** 4.5rem–7.2rem, **bold/semibold**, negative letter-spacing (`-0.03em` to `-0.05em`). Tight, dense, confident.
- **Body text:** 1.6rem (16px base), regular weight, standard line-height (~1.5)
- **Small/labels:** 1.2rem, medium weight
- **NO SERIF FONTS on the homepage.** No Spectral. Everything is sans-serif. Clean and modern.

### Color Palette
- **Backgrounds:** `#ffffff` (white) and `#000000` (black) — alternating sections
- **Text on white:** `#000000` or `#1f1f1f`
- **Text on black:** `#ffffff`
- **Muted text:** `#707070` (on white), `#888888` (on black)
- **Accent/CTA:** `#006aff` (Square blue) — use this for primary buttons and key interactive elements
- **Accent hover:** `#4a95ff`
- **Light gray sections:** `#f7f6f5` for subtle background variation
- **Borders:** `#e5e5e5` (light), `#333333` (dark)
- **NO warm tones.** No cream, no olive, no amber. Cool and neutral only.

### Spacing
- **Section padding:** `6rem` (96px) top/bottom on desktop, `4rem` on mobile
- **Container max-width:** `1200px` centered, with `1.5rem` padding on mobile, `4rem` on tablet, `6rem` on large screens
- **Element gaps:** `1rem` (16px), `2rem` (32px), `3rem` (48px) — consistent increments
- **Generous whitespace** — let everything breathe. Square's pages feel spacious, not cramped.

### Buttons
- **Primary:** `#006aff` background, white text, fully rounded (`border-radius: 5rem`), padding `1rem 2rem`, min-width `192px`
- **Hover:** scale `1.05`, background shifts to `#4a95ff`
- **Active:** `translateY(5%)` press effect
- **Secondary:** White background, `#006aff` border and text, same rounded shape
- **Transition:** `0.15s` ease

### Cards & Containers
- **Border radius:** `1rem` (increases to `2.4rem` on large screens)
- **Card padding:** `3rem` responsive
- **Shadow:** `0 2px 10px rgba(0, 0, 0, 0.16)` — subtle depth
- **Card hover:** slight background shift, not dramatic

### Motion
- **Quick:** `0.15s` — hover states, button feedback
- **Default:** `0.3s` — element transitions
- **Slow:** `0.4s` — section reveals
- **Easing:** `cubic-bezier(0.4, 0, 0.2, 1)` standard, `cubic-bezier(0, 0, 0.2, 1)` decelerate
- **Keep framer-motion** for scroll-triggered reveals, but make animations subtle — fade + slight translateY, not dramatic swooping.

### Layout
- **12-column grid** mentality — content aligns to clean columns
- **Hero:** Full-width, minimum `80vh` height, centered content
- **Alternating sections:** white bg → black bg → white bg → etc.
- **Left/right content blocks** — text on one side, visual on the other

## What to build

Rebuild `app/page.tsx` and all its components from scratch with this design language. Here's the section structure:

### 1. Navbar
Keep the existing `shadcnblocks-com-navbar1` component but it sits on a white background now — no cream, no warm tones.

### 2. Hero (full viewport)
- White or black background
- Big sans-serif headline (4.5rem+ on desktop), bold, tight letter-spacing
- Subtext in muted gray, 1-2 lines max
- One blue primary CTA button + one text link secondary
- Clean and spacious — no halftone dots, no grain, no texture SVGs
- Copy direction: "Addicted to the craft" energy — confident, direct, not corporate

### 3. Social Proof / Stats
- Simple horizontal strip — 3-4 numbers with labels
- Light gray background (`#f7f6f5`)
- Clean sans-serif, muted colors

### 4. Three Paths (Student / Barber / Client)
- Cards or content blocks — clean white cards on white bg with subtle shadow, OR alternating left-right layout
- Each has an icon, title, short description, and a link
- Differentiated visually but consistent in structure

### 5. Features (What's Inside)
- Black background section
- White text, muted gray descriptions
- Feature blocks — could be a grid of cards or left-right alternating
- Community Feed, Barber Profiles, Shop Websites, Study Tools, Resource Directory

### 6. Editorial / Identity section
- Why FadeJunkie exists — a short manifesto or identity statement
- Big type, generous spacing
- White background

### 7. CTA
- Black background
- White headline, blue button
- Simple, punchy, one line + one button

### 8. Footer
Keep the existing `shadcnblocks-com-footer2` component.

## Files you can edit/create

- `app/page.tsx` — rebuild entirely
- `app/components/hero.tsx` — rebuild entirely
- `app/components/cta-13.tsx` — rebuild entirely
- `app/components/ui/bento-grid.tsx` — rebuild or replace
- `app/components/manifesto.tsx` — rebuild or replace
- Create new component files in `app/components/` as needed
- `app/globals.css` — update/add utility classes

## Files to NOT edit

- `app/layout.tsx`
- `app/components/shadcnblocks-com-navbar1.tsx`
- `app/components/ui/shadcnblocks-com-footer2.tsx`
- Anything in `convex/`

## Critical rules

1. **NO hardcoded FadeJunkie colors** — no `#fff4ea`, no `rgba(22,16,8,*)`, no olive, no amber, no warm tones
2. **NO Spectral font** — all sans-serif
3. **NO grain overlay SVG** — remove it entirely from page.tsx
4. **NO halftone dot SVGs** — remove them entirely
5. **NO `font-serif` classes** — everything is sans-serif
6. All auth links → `/signin?mode=signup`, directory links → `/directory`
7. Mobile-first responsive

## After you're done

Run `npm run build` from the project root and fix ALL TypeScript and build errors. The build must pass clean before you finish.
