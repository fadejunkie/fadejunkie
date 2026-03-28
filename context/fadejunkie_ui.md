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
- **Correct hover shadow pattern:** `hover:shadow-sm` (or `hover:shadow-md` etc.) — uses `var(--shadow-sm)` token registered in `@theme inline`. Never `hover:shadow-[0_2px_8px_rgba(0,0,0,*)]` — that hardcodes a specific rgba that bypasses the token system and can't be updated globally.
  ✓ Confirmed: `app/signin/page.tsx:322-328` — tab switcher had `#000000` for active color and border-bottom; replaced with `var(--foreground)` / `var(--muted-foreground)` (cycle 2026-03-28T14:45)
  ✓ Confirmed: `components/ResourceCard.tsx:23` — `hover:border-[#c8c8c8]` on card hover state; replaced with `hover:border-foreground/20` (cycle 2026-03-28T16:15)
  ✓ Confirmed: `components/ResourceCard.tsx:23` — `hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)]` arbitrary shadow replaced with `hover:shadow-sm` token (cycle 2026-03-28T17:00)
  ✓ Confirmed: `components/hero.tsx:76,127,215,345,385,415,585,619,705` — hero profile card used `backgroundColor: "#000000"` instead of `var(--foreground)`; corresponding text used `color: "#ffffff"` instead of `var(--background)`; floating pill backgrounds used `"#ffffff"` instead of `var(--background)`; avatar borders used `"#ffffff"` instead of `var(--background)`; inline CSS animation used `background-color: #000000` instead of `var(--foreground)`. All 8 instances replaced with CSS tokens. (cycle 2026-03-28T18:00)
  ✓ Confirmed: `components/ui/bento-grid.tsx:80,107` — BentoCard used `color: isDark ? "#ffffff" : "#000000"` for h3 card title and CTA span. `isDark` is a prop variant, not system dark mode — light-variant cards in system dark mode rendered `#000000` (black) text on dark backgrounds = invisible P0. Fixed to `isDark ? "var(--background)" : "var(--foreground)"`. (cycle 2026-03-28T19:45)
  **[HARDENED]** — Rule now has 6+ cross-file confirmations. `#000000`/`#ffffff` are the canonical high-risk hardcoded values. The inverted card pattern is always `backgroundColor: "var(--foreground)"` (not `"#000000"`) with text `color: "var(--background)"` (not `"#ffffff"`). CSS `<style>` blocks inside components are also in scope — `background-color: #000000` in a keyframe animation is the same violation as in a JSX inline style prop. **Extra risk surface:** Prop-variant dark cards (`isDark = variant === "dark"`) that use hardcoded hex for text colors are doubly dangerous — they bypass the token system AND conflate prop-variant dark with system dark mode, causing invisible text whenever the two states diverge.
  **Alpha-transparency pattern:** `rgba(0,0,0,0.88)` and `rgba(255,255,255,0.7)` are hardcoded-color violations in the same class as `#000000`/`#ffffff`. The correct replacement for rgba alpha values is `color-mix(in oklch, var(--foreground) 88%, transparent)` or `color-mix(in oklch, var(--background) 70%, transparent)` — this preserves the intended opacity while binding to the token that inverts correctly in dark mode. Never use `rgba()` when a token + `color-mix` can express the same intent.
  ✓ Confirmed: `components/ui/bento-grid.tsx:58-59` — BentoCard container `backgroundColor` used `rgba(0,0,0,0.88)`/`rgba(255,255,255,0.7)` and `border` used `rgba(255,255,255,0.08)`/`rgba(0,0,0,0.08)`; replaced with `color-mix(in oklch, var(--foreground/background) N%, transparent)` pattern (cycle 2026-03-28T20:45)
  ✓ Confirmed: `components/ui/bento-grid.tsx:53,70,90` — BentoCard hover state used `hover:bg-black` (hardcoded Tailwind color class), Icon used `rgba(255,255,255,0.4)`/`rgba(0,0,0,0.35)`, description `<p>` used `rgba(255,255,255,0.5)`/`rgba(0,0,0,0.55)`; replaced `hover:bg-black` with removal (hover handled by overlay div), rgba values with `color-mix(in oklch, var(--background/foreground) N%, transparent)` (cycle 2026-03-28T21:00).
  **[HARDENED — extension]** Tailwind hardcoded-color utility classes (`hover:bg-black`, `bg-white`, `text-black`) on interactive states are the same violation class as inline `rgba()`/hex values. Detection must cover not just inline `style={{}}` props but also Tailwind className strings — grep `bg-black`, `bg-white`, `text-black`, `text-white` in className props (unless inside a `text-background`/`text-foreground` context).
  ✓ Confirmed: `components/ui/bento-grid.tsx:118` — BentoCard hover-overlay div used `group-hover:bg-white/[.03]` (dark variant) and `group-hover:bg-black/[.01]` (light variant); replaced with `group-hover:bg-background/[.03]` and `group-hover:bg-foreground/[.01]`. This is the fractional-opacity variant of the same pattern — `bg-white/[.03]` is still a hardcoded-color class even at near-zero opacity. (cycle 2026-03-28T21:15)

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
  ✓ Confirmed: `app/(auth)/tools/exam-guide/page.tsx:414,465,485,541,548` — ServiceCard had 5 raw `<button>` controls (accordion toggle, checklist items, "Reset checklist", "Reset", "Mark as Practiced") all inheriting Courier Prime; fixed with `font-sans` (cycle 2026-03-28T17:30). The styled "Mark as Practiced" CTA (`bg-foreground text-background rounded-lg`) in Courier Prime is the canonical example of how visually jarring this failure mode is — a UI action button should never use the typewriter body font.
  ✓ Confirmed: `app/(auth)/tools/flashcards/page.tsx:157,169` — "Starred only" toggle and "Shuffle" pill buttons inherited Courier Prime; fixed with `font-sans` (cycle 2026-03-28T17:45). Rule now has 3+ confirmations across 3 files — **[HARDENED]**. Detection method: grep `<button` in any page file; any hit lacking `font-sans` in className is a P1.
  ✓ Confirmed: `app/(auth)/profile/page.tsx:143,218` — "Upload photo" inline trigger button and service-tag × remove button both lacked `font-sans`; rendering in Courier Prime instead of Geist. Fixed with `font-sans` prefix on both classNames (cycle 2026-03-28T19:15). Profile page joins resources, exam-guide, and flashcards as confirmed instances — rule spans all auth interior pages.

### Page h1 headings require `font-display` — globals.css font cascade does NOT set h1 font [ADD]
- **Rule:** `globals.css` sets `body { font-family: var(--font-body) }` (Courier Prime). There is NO explicit `h1 { font-family: var(--font-display) }` override — the heading CSS only sets `text-transform: lowercase`. This means an `<h1>` that doesn't declare `font-display` in its Tailwind className will silently render in Courier Prime (typewriter body font) instead of League Spartan (display/brand font).
- **Safe pattern:** Always add `font-display` explicitly to every `h1`–`h4` element: `<h1 className="font-display text-2xl font-bold ...">`.
- **Failure signature:** Page-level hero headings that look "typed" instead of bold/structural — League Spartan at the same size is dramatically heavier and more impactful than Courier Prime. Missing `font-display` is immediately visible at heading sizes.
- **Detection:** Grep for `<h[1-4]` in page/component files. Any result without `font-display` in its className (and not a sub-heading that's deliberately in Courier Prime for editorial mixing) is a P1.
  + Added: observed in `app/(auth)/tools/flashcards/page.tsx:125` — `<h1>` lacked `font-display`, rendering page title in Courier Prime; fixed with `font-display` (cycle 2026-03-28T17:45)

### Section-label elements must NOT use heading tags — `<p>` only [HARDENED]
- **Rule:** Section labels, card titles, and interior headings must use `<p>` (not `<h2>`, `<h3>`, or `<h4>`). The global CSS (`globals.css:190-202`) applies `font-family: League Spartan`, `text-transform: lowercase`, `line-height: 1.05`, and tight letter-spacing to ALL h1–h4 elements. This corrupts card labels, section headings, and any interior text that uses heading tags — forcing them into display-font, lowercase, tightly-tracked League Spartan.
- **Detection:** Grep for `<h[234]` in all `.tsx` files. Any heading that is NOT the page's primary semantic heading (the main topic of the entire page) is almost certainly a label and should be `<p>`. Applies to: card body headings, section titles within cards, expandable accordion headers, info card titles.
- **Fix:** Change `<h3 className="...">` to `<p className="...">` — identical className, different tag. Zero visual change; all CSS classes still apply.
- **Scope:** Applies to ALL file types — page files (`app/**`), shared components (`components/`), and UI primitives.
  ✓ Confirmed: `app/(auth)/tools/page.tsx` — 2 `<h3>` card titles ("Website Builder", "Have a tool idea?") forced to League Spartan lowercase; fixed to `<p>` (cycle 2026-03-28T18:45)
  ✓ Confirmed: `app/(auth)/tools/practice-test/page.tsx` — `<h2>` section label forced to League Spartan lowercase; fixed to `<p>` (cycle 2026-03-28T18:30)
  ✓ Confirmed: `components/ShopTemplate.tsx` — `<h2>` and `<h3>` section labels ("About", "Contact & Hours") forced to League Spartan lowercase; fixed to `<p>` (cycle 2026-03-28T18:15)
  ✓ Confirmed: `app/(auth)/tools/exam-guide/page.tsx:437,638,645` — 3 `<h3>` card labels (service label, "End of Exam Disinfection", "Study with Flashcards") forced to League Spartan lowercase with -0.03em tracking; fixed to `<p>` (cycle 2026-03-28T19:00)
  ✓ Confirmed: `app/(auth)/profile/page.tsx:115,298` — `<h2>` card section labels ("Your Profile" inside profile card, "Gallery" above gallery grid) forced to League Spartan lowercase with -0.04em tracking; fixed to `<p>` with identical classNames (cycle 2026-03-28T20:15)
  **[HARDENED]** — 5+ cross-file confirmations across page files AND shared components. Every `<h2>`/`<h3>` inside a Card component must be treated as a section-label suspect until proven otherwise. Profile page confirms the rule extends to user-facing profile/settings cards, not just tool-page interiors.

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
