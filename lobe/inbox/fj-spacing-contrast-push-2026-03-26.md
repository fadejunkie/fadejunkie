<!-- execute -->
<!-- max-turns: 60 -->

# Design System Iteration — Spacing & Button Contrast

> Priority: buttons are getting lost. Fix fill/text color contrast across every page, then tighten component spacing to match the UI kit.

## Problem

Buttons blend into their surroundings — insufficient contrast between fill and text, inconsistent padding, and unclear visual hierarchy. Components have loose or inconsistent spacing that doesn't match the design kit's rhythm.

## Design Kit Reference (B&W Typewriter Edition)

### Button Spec — ENFORCE THESE EXACTLY
| Variant | Style |
|---------|-------|
| Primary | **Black bg, white text**, pill radius (5rem), Y-1px hover lift, scale 1.01 |
| Light / Outline | **White bg, black text**, 1px solid black border, hover bg #f5f5f5 |
| Text | Black text, no bg, opacity 0.7 → 1.0 on hover |
| Text on dark | White 50% opacity → full white on hover |

**All buttons:** Geist font (`font-sans`), weight 600, size 0.875rem, letter-spacing -0.01em.

**Focus:** 2px solid black outline, 3px offset — already in globals.css, verify it applies.

### Color Tokens — Pure B&W
- `--background`: white (light) / black (dark)
- `--foreground`: black (light) / white (dark)
- `--primary`: black / white
- `--primary-foreground`: white / black ← THIS IS THE KEY TOKEN FOR BUTTON TEXT
- `--muted-foreground`: `oklch(0.45 0 0)` / `oklch(0.6 0 0)`
- `--border`: `oklch(0.85 0 0)` / `oklch(1 0 0 / 12%)`
- `--accent`: `oklch(0.95 0 0)` / `oklch(0.15 0 0)`

**Rule:** No color anywhere. Zero hue. Only grayscale. Links = underline, never color.

### Spacing Tokens
```css
--section-gap-sm: clamp(3rem, 5vw, 4rem);
--section-gap:    clamp(4rem, 7vw, 7rem);
--section-gap-lg: clamp(6rem, 10vw, 10rem);
--container-px:   clamp(1.5rem, 5vw, 6rem);
```

### Shadows (grayscale only)
```css
--shadow-xs:  0 1px 3px rgba(0,0,0,0.07);
--shadow-sm:  0 2px 8px rgba(0,0,0,0.07);
--shadow-md:  0 4px 16px rgba(0,0,0,0.08);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.10);
```

## Audit Checklist — Hit Every Page

For EACH page below, check and fix:

### Buttons
- [ ] Primary buttons: black fill + white text (not gray-on-gray, not transparent)
- [ ] Outline/secondary buttons: white fill + black text + 1px black border (not faint gray border)
- [ ] Ghost/text buttons: clearly readable, opacity states working
- [ ] Button padding: consistent `px-6 py-2.5` minimum (not cramped)
- [ ] Button font: `font-sans font-semibold text-sm tracking-tight`
- [ ] Hover states: visible lift + scale, not just color shift
- [ ] Disabled state: `opacity-50 cursor-not-allowed`

### Spacing
- [ ] Section gaps use `--section-gap` tokens (not arbitrary values)
- [ ] Card internal padding: minimum `p-6` (24px)
- [ ] Form field spacing: consistent `space-y-4` or `gap-4`
- [ ] Container horizontal padding uses `--container-px`
- [ ] No cramped clusters — everything breathes

### Contrast
- [ ] All text on colored backgrounds passes 4.5:1 ratio minimum
- [ ] Muted text uses `--muted-foreground` (not arbitrary opacity)
- [ ] No text-on-text-color collisions (e.g., gray text on gray bg)
- [ ] Icons/labels: use `--foreground` or `--muted-foreground`, never raw grays

## Target Pages (priority order)

1. `app/page.tsx` — Landing page (hero buttons, CTA sections)
2. `app/signin/page.tsx` — Sign in/up (submit button, toggle link)
3. `app/(auth)/home/page.tsx` — Community feed (post actions, nav)
4. `app/(auth)/tools/page.tsx` — Tools hub (tool cards, entry buttons)
5. `app/(auth)/profile/page.tsx` — Profile editor (save button, form spacing)
6. `app/(auth)/website/page.tsx` — Website builder (action buttons)
7. `app/(auth)/resources/page.tsx` — Resources (tab buttons, card spacing)
8. `app/(auth)/tools/exam-guide/page.tsx` — Exam guide
9. `app/(auth)/tools/flashcards/page.tsx` — Flashcards
10. `app/(auth)/tools/practice-test/page.tsx` — Practice test
11. `app/directory/page.tsx` — Public directory
12. `app/privacy/page.tsx` + `app/terms/page.tsx` — Legal pages (spacing only)
13. `app/barber/[slug]/page.tsx` — Public barber profile
14. `app/shop/[userId]/page.tsx` — Public shop website

Also audit these shared components:
- `components/ui/button.tsx` — verify variant styles match spec exactly
- `components/ui/Card.tsx` — internal padding
- `components/AppHeader.tsx` — nav button contrast
- `components/AppSidebar.tsx` — nav items spacing + active state contrast
- `components/shadcnblocks-com-navbar1.tsx` — CTA button in navbar

## Rules
- Token-only. No hardcoded hex, rgb, rgba, or hsl values.
- If a button variant doesn't exist in button.tsx, add it following the spec above.
- Run `npm run build` in `app/` before committing — zero errors.
- Commit changes with descriptive message.
