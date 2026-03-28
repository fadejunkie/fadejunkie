# FadeJunkie UI — Design System

Living document. Updated by Lobe after each style test.

---

## Brand

**Logo:** Skull with mohawk + bandana — black & white stencil/graphic style. Bold, punk, barber energy.
**Logo file:** `fadejunkie_logo.png`
**Logo usage:** Always on white, cream, or dark backgrounds. Never on busy patterns without a clear field.

---

## Color Palette

### Confirmed

| Role | Value | Notes |
|------|-------|-------|
| Background warm | `#fff4ea` | Primary background — warm cream/peach. Confirmed. |

### Under test
- Halftone dot color: `#1a1208` (dark warm brown-black) — testing against `#fff4ea`

---

## Typography

### Confirmed
- **Spectral** (Google Fonts) — serif, editorial headlines. Weights: 300 (light/display), 400, 600, 700.
- **DM Mono / Geist Mono** — monospace accents, eyebrows, labels.
- **Inter** — body text default.

### Display sizing
- Hero headline: `clamp(3.5rem, 10vw, 9rem)` at weight 300 — magazine-cover feel.

---

## Texture & Background Treatments

### Halftone (Test 1 — in progress)
- Base color: `#fff4ea`
- Dot pattern: `radial-gradient(circle, #1a1208 1.5px, transparent 1.5px)` at 14×14px grid
- Gradient mask: dots dense at edges, fade to transparent toward center — frames the logo, avoids visual competition
- CSS `mask-image: radial-gradient(ellipse 60% 60% at center, transparent 30%, black 80%)`

### Grain (from Lobe test-demo v1)
- SVG noise at 3.5% opacity — subtle texture layer on dark backgrounds
- `opacity: 0.035` threshold confirmed as "just enough without muddying"

---

## Component Patterns

### Cards (from existing app)
- `border-radius: 20px`
- `border: 1px solid hsl(0 0% 87%)`
- Hover: border lightens, subtle shadow lift

### No hardcoded colors — tokens only [CONFIRM]
- **Rule:** Never use `#000000`, `#ffffff`, or `rgba(0,0,0,*)` for foreground/text colors in component inline styles. Always use `var(--foreground)`, `var(--muted-foreground)`, `var(--background)`, etc. This extends to Tailwind arbitrary value classes too — `hover:border-[#c8c8c8]` is a hardcoded color and will break dark mode.
- **Why it matters:** Hardcoded hex values break dark mode — `#000000` stays black even when `--foreground` flips to white. A hardcoded hover border hex like `#c8c8c8` locks to a light-mode gray — in dark mode the base border is nearly invisible, making the hover state incoherent.
- **Correct hover border pattern:** `hover:border-foreground/20` — resolves to ~20% opacity foreground, which inverts correctly in dark mode (near-black in light, near-white in dark).
  ✓ Confirmed: `app/signin/page.tsx:322-328` — tab switcher had `#000000` for active color and border-bottom; replaced with `var(--foreground)` / `var(--muted-foreground)` (cycle 2026-03-28T14:45)
  ✓ Confirmed: `components/ResourceCard.tsx:23` — `hover:border-[#c8c8c8]` on card hover state; replaced with `hover:border-foreground/20` (cycle 2026-03-28T16:15)

### Tailwind color utilities on inverted cards — use `text-background` not `text-white` [ADD]
- **Rule:** On inverted cards (`bg-foreground`), never use Tailwind's `text-white`, `bg-white`, `text-white/50`, `bg-white/10` etc. These are hardcoded-color utilities in disguise — in dark mode, `bg-foreground` flips to white, making `text-white` invisible (white on white).
- **Correct pattern:** `text-background`, `bg-background/20`, `text-background/50`, `bg-background/10` — these tokens resolve correctly in both modes: black-on-white in light, white-on-black in dark.
- **The failure mode is P0:** Inverted cards look fine in light mode with `text-white` (because foreground IS near-black), so the bug is completely invisible until dark mode is enabled.
  + Added: observed in `app/(auth)/tools/flashcards/page.tsx` — flip card back face used `text-white`, `bg-white/20`, `bg-white text-foreground`, `bg-white/10 text-white/60`; replaced with `text-background`, `bg-background/20`, `bg-background text-foreground`, `bg-background/10 text-background/60` (cycle 2026-03-28T15:30)

### B&W semantic feedback — no hue exceptions [ADD]
- **Rule:** Even semantically meaningful states (correct/wrong, pass/fail, flagged) use NO hue in the FJ design system. Color is never a standalone signal — shape, weight, inversion, and strikethrough carry the meaning instead.
- **Correct answer pattern:** `bg-foreground text-background` — the inverted (black) row IS the correct answer signal. Unmistakable without color.
- **Wrong answer pattern:** `bg-muted text-muted-foreground line-through` — muted + strikethrough = "you picked this, it's wrong." No red needed.
- **Pass/fail scores:** Pass → `text-foreground` (full black, confident). Fail → `text-muted-foreground` (dimmed, not alarming). The supporting copy text ("Passing score" vs "Keep studying") carries the explicit message.
- **Progress bars:** Always `bg-foreground` regardless of score. Width communicates proportion; black fill communicates substance.
- **Flagged state:** `border-foreground border-2` on the card + `text-foreground font-medium` on the button. Thicker border = visual weight = "this one is marked."
  + Added: observed in `app/(auth)/tools/practice-test/page.tsx` — 9 color leaks (amber-400, green-50/600/500/800, red-50/400/500/700) stripped and replaced with B&W tokens (cycle 2026-03-28T14:30)

### Raw `<button>` elements must declare `font-sans` — body font doesn't cascade to UI controls [ADD]
- **Rule:** `globals.css` sets `body { font-family: var(--font-body), "Courier Prime" }`. Every raw `<button>` without an explicit font class inherits Courier Prime — the typewriter *content* font. UI navigation controls (filter tabs, toggle pills, icon buttons) must use Geist (the UI font) via the `font-sans` Tailwind class.
- **Safe pattern:** The `Button` component (button.tsx) already has `font-sans font-semibold` in its CVA base — it is always correct. Any raw `<button>` used for UI chrome (not authored content) needs `font-sans` added to its `className`.
- **Detection:** Grep for `<button` in page/component files. Every result that doesn't have `font-sans` in its className AND isn't a content-composition button (e.g. a like button inside a post body is borderline fine) is a P1.
  + Added: observed in `app/(auth)/resources/page.tsx` — 5 filter pill buttons inherited Courier Prime; fixed with `font-sans` class (cycle 2026-03-28T16:00)

### Heading `text-transform` rule — user data exception [ADD]
- **Rule:** Global CSS (`globals.css:196`) forces `text-transform: lowercase` on ALL `h1`–`h4`.
- **Exception:** When an `h1`–`h4` renders **user-generated proper names** (barber names, shop names, business names), it MUST override with `style={{ textTransform: "none" }}` to prevent forced lowercasing of proper nouns.
- **Pattern:** Brand/editorial headings → lowercase is intentional. Data headings (names, titles from the DB) → always `textTransform: "none"`.
- **Affected element types:** Any heading that renders a DB field — barber name, shop name, business name, resource business name, school name, etc.
  + Added: observed in `app/barber/[slug]/page.tsx:41` — barber name forced lowercase without override; fixed (cycle 2026-03-28T14:15)
  ✓ Confirmed: `components/ResourceCard.tsx:30` — `<h3>` rendering `businessName` (user data) lacked `textTransform: "none"`; fixed to `style={{ textTransform: "none" }}` (cycle 2026-03-28T15:45)
  ✓ Confirmed [HARDENED]: `app/directory/page.tsx:118` — `<h1>` displaying dynamic location type ("Texas Barber Schools/Shops") used Tailwind `.capitalize` as attempted override; `.capitalize` silently lost to ungrouped globals.css rule (ungrouped CSS > @layer utilities in Tailwind v4). Fixed with `style={{ textTransform: "none" }}`. **Key insight:** Tailwind utility classes (`.capitalize`, `.uppercase`, `.normal-case`) CANNOT override ungrouped CSS element selectors in globals.css when using Tailwind v4 `@import "tailwindcss"`. `style={{}}` is the only reliable escape hatch. (cycle 2026-03-28T16:45)

---

## Tests Log

| # | Test | File | Status | Notes |
|---|------|------|--------|-------|
| 1 | Halftone + logo | `test-demo/index.html` | In progress | `#fff4ea` base, radial dot mask |
