<!-- execute -->
<!-- max-turns: 80 -->

# Full Rebuild Pass — Spacing & Button Contrast

> Anthony's words: "I still see buttons with bad contrast and elements too close to one another. Free pass to recreate the structure and components. I just don't want things so compressed."

## You have full creative freedom.

Rebuild page layouts, restructure component spacing, redo button styles — whatever it takes. The current state is too compressed and buttons still disappear. This is not a patch job. Open every page, read the code, and fix the spatial rhythm and contrast from the ground up.

## The Core Problems

1. **Buttons blend into backgrounds.** Primary buttons must be unmistakably clickable — black fill, white text, generous padding. Outline buttons need solid black borders, not faint gray. Ghost buttons need clear hover states.

2. **Everything is too compressed.** Elements are crammed together. Cards have insufficient internal padding. Form fields stack too tight. Sections don't breathe. The page feels dense and claustrophobic instead of editorial and spacious.

## What "Done" Looks Like

- You can scan any page and instantly identify every button/CTA
- Every section has generous whitespace above and below
- Cards have roomy internal padding (minimum p-6, prefer p-8 for primary cards)
- Form fields have comfortable spacing (space-y-5 minimum between fields)
- The overall feel is editorial magazine, not cramped dashboard
- Typography has room to breathe — headings have margin-bottom, paragraphs have line-height

## Button Spec (ENFORCE HARD)

Open `components/ui/button.tsx` and verify/fix every variant:

```
default (primary): bg-foreground text-background font-semibold px-6 py-2.5 rounded-full
                   hover: translate-y-[-1px] scale-[1.01]

outline:           bg-background text-foreground border-2 border-foreground font-semibold px-6 py-2.5 rounded-full
                   hover: bg-accent

secondary:         bg-secondary text-foreground font-semibold

ghost:             text-foreground hover:bg-accent font-semibold

link:              text-foreground underline underline-offset-4
```

Key: `border-2 border-foreground` on outline — NOT `border border-foreground/20`. The border must be VISIBLE.

Button size minimums:
- `sm`: px-4 py-1.5 text-sm
- `default`: px-6 py-2.5 text-sm
- `lg`: px-8 py-3 text-base

## Spacing Spec (ENFORCE HARD)

```css
/* Between major page sections */
section spacing: space-y-8 or gap-8 minimum (32px)

/* Card internal padding */
primary cards: p-8
secondary cards: p-6

/* Form layouts */
between form groups: space-y-6
between fields within a group: space-y-4
label to input gap: mb-2

/* Page container */
page padding: px-6 py-8 minimum
max-width containers: max-w-2xl for forms, max-w-4xl for content

/* Headings */
h1 margin-bottom: mb-6
h2 margin-bottom: mb-4
h3 margin-bottom: mb-3
subtitle/description below heading: mt-1.5 mb-8
```

## Pages to Hit (ALL of them)

### Priority 1 — Most visible
1. **`app/(auth)/profile/page.tsx`** — Profile editor. Form groups need breathing room. "Add" button for services must be a real button. Save button must be prominent.
2. **`app/(auth)/website/page.tsx`** — Website builder. Cards need p-8. Edit/Preview toggle needs proper button treatment. Section headings need space below.
3. **`app/(auth)/home/page.tsx`** — Community feed. Post cards, compose area, action buttons.
4. **`app/(auth)/tools/page.tsx`** — Tools hub. Tool cards need generous padding and clear entry buttons.

### Priority 2 — Functional pages
5. **`app/(auth)/tools/exam-guide/page.tsx`** — Cards, checkboxes, progress indicators
6. **`app/(auth)/tools/flashcards/page.tsx`** — Card deck, navigation buttons
7. **`app/(auth)/tools/practice-test/page.tsx`** — Config form, start button
8. **`app/(auth)/resources/page.tsx`** — Tab buttons, resource cards

### Priority 3 — Public pages
9. **`app/page.tsx`** — Landing page hero, CTA buttons, sections
10. **`app/signin/page.tsx`** — Sign in form, submit button
11. **`app/directory/page.tsx`** — Listings, filter tabs, action links
12. **`app/barber/[slug]/page.tsx`** — Public profile
13. **`app/shop/[userId]/page.tsx`** — Public shop page

### Shared components (fix these FIRST — they cascade everywhere)
- **`components/ui/button.tsx`** — fix all variant styles per spec above
- **`components/ui/Card.tsx`** — ensure default padding
- **`components/AppHeader.tsx`** — spacing between elements
- **`components/AppSidebar.tsx`** — nav item padding and spacing
- **`components/PostCard.tsx`** — internal padding and button contrast
- **`components/shadcnblocks-com-navbar1.tsx`** — CTA buttons

## Verification Protocol (MANDATORY)

After making changes, you MUST:

1. Run `npm run build` in `app/` — must pass with zero errors
2. Start the dev server: `npm run dev:frontend` in `app/` (port 3100)
3. Take screenshots using the browser agent:
   ```bash
   node browser-agent/agent.mjs screenshot http://localhost:3100
   node browser-agent/agent.mjs screenshot http://localhost:3100/signin
   node browser-agent/agent.mjs screenshot http://localhost:3100/directory
   ```
4. **Look at the screenshots.** Actually analyze them visually.
5. If buttons still look faint, spacing still looks cramped, or anything feels compressed — **go back and fix it before committing.**
6. Only commit when every screenshot passes your own design review.

**Do NOT deliver until it looks done.** Anthony will reject half-measures.

## Rules
- Token-only: no hardcoded hex, rgb, rgba, hsl values
- B&W only: zero hue anywhere (no blue links, no green status, no colored badges)
- Build must pass before commit
- Screenshot must look right before commit
- Commit with descriptive message when done
