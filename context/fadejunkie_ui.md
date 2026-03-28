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

### Heading `text-transform` rule — user data exception [ADD]
- **Rule:** Global CSS (`globals.css:196`) forces `text-transform: lowercase` on ALL `h1`–`h4`.
- **Exception:** When an `h1`–`h4` renders **user-generated proper names** (barber names, shop names, real names), it MUST override with `style={{ textTransform: "none" }}` to prevent forced lowercasing of proper nouns.
- **Pattern:** Brand/editorial headings → lowercase is intentional. Data headings (names, titles from the DB) → always `textTransform: "none"`.
  + Added: observed in `app/barber/[slug]/page.tsx:41` — barber name forced lowercase without override; fixed (cycle 2026-03-28T14:15)

---

## Tests Log

| # | Test | File | Status | Notes |
|---|------|------|--------|-------|
| 1 | Halftone + logo | `test-demo/index.html` | In progress | `#fff4ea` base, radial dot mask |
