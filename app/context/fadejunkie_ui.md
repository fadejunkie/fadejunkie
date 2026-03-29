# FadeJunkie Design System — Lobe's Annotated Reference

> Canonical design rules with codebase evidence. Rules marked [HARDENED] have 3+ cross-file confirmations and are ground truth.

---

## Typography

| Role | Font | Variable | Weights | Notes |
|------|------|----------|---------|-------|
| Headlines | League Spartan | --font-display | 400, 600, 700, 800, 900 | All headings forced lowercase via CSS |
| Body | Courier Prime | --font-body | 400, 700 + italic | Typewriter feel — raw, authored |
| UI / Nav | Geist | --font-sans | system default | Buttons, labels, navigation chrome |
| Code / Tags | Geist Mono | --font-mono | system default | Data labels, eyebrow text, accents |

### Heading Rules

- h1–h4: League Spartan, `text-transform: lowercase`, antialiased, kern+liga enabled
- Tight letter-spacing on display sizes (`-0.03em` to `-0.05em`)
- h1: `-0.05em`, h2: `-0.04em`, h3: `-0.03em`, h4: `-0.02em` (set globally in `globals.css:199-202`)
- Mixed-font trick: Courier Prime italic `<span>` inside League Spartan headlines for zine energy

**Font — h1–h4 base:** League Spartan + lowercase + tight letter-spacing set globally
  ✓ Confirmed: `app/globals.css:190-202` applies `font-family: var(--font-display)`, `text-transform: lowercase`, `letter-spacing: -0.05em` to h1 via CSS baseline. Do NOT add `tracking-tight` (Tailwind `-0.025em`) to h1 headings — it will override the design system spacing with a weaker value. (cycle 2026-03-28T13:45)
  ✓ Confirmed: `app/(auth)/tools/practice-test/page.tsx` h1 headings ("Practice Test", "Results") now carry `font-display` class — consistent with flashcards/page.tsx pattern. CSS baseline applies globally, but explicit `font-display` class is defensive and self-documenting on feature page h1s. (cycle 2026-03-28T17:45)
  ✓ Confirmed [HARDENED x6]: `app/(auth)/tools/exam-guide/page.tsx` h1 ("TDLR Practical Exam Guide") was missing `font-display`; added. Rule now confirmed across 6 auth-interior page h1s: flashcards, practice-test, resources, website, tools, exam-guide. Pattern is fully established — every auth route h1 must have `font-display` in its Tailwind className. (cycle 2026-03-28T23:15)

**Rule — `var(--font-mono)` is the ONLY correct monospace token [HARDENED]:** `var(--font-geist-mono)` is a ghost token — it references a Next.js internal font variable name that is NOT registered in FJ's `globals.css @theme inline` block. It silently falls through to `ui-monospace` (system font) on environments where Next.js doesn't expose the variable. The canonical token is `var(--font-mono)` which is explicitly registered. Detection: grep `font-geist-mono` across all TSX — every hit is a P1.
  ↻ Revised: typography table corrected from `--font-geist-mono` to `--font-mono` — the doc itself was propagating the ghost token (cycle 2026-03-29T07:45)
  ⚠ Challenged and fixed: `app/signin/page.tsx` had 5× `var(--font-geist-mono)` — brand panel eyebrow, social proof labels, Email/Password form labels; replaced with `var(--font-mono)` (cycle 2026-03-29T07:45)
  ✓ Confirmed: `app/(auth)/website/page.tsx` had 3× `var(--font-geist-mono)` — all three eyebrow section-label `<p>` tags ("Shop Identity", "About", "Contact & Hours") in the website builder form. Replaced with `var(--font-mono)`. Pattern: eyebrow labels built in isolation during form construction are the highest-risk surface for ghost-token reintroduction — they're added one card at a time and rarely cross-referenced against the token table. (cycle 2026-03-29T08:00)
  ✓ Confirmed [HARDENED x4]: `app/components/hero.tsx` had 6× `var(--font-geist-mono)` — eyebrow labels, stat strip labels, testimonial attribution, and feature card metadata across the landing-page hero component. Replaced with `var(--font-mono)` via `replace_all`. Risk surface extended: shared hero components built as standalone visual showcases are equally high-risk for ghost-token introduction — they're authored in isolation (often without reference to other component files) and rarely code-reviewed against the token table. Rule now confirmed across signin, website builder, hero, and website page — spanning auth pages, public pages, and shared components. Any remaining `var(--font-geist-mono)` in the codebase is confirmed P1. (cycle 2026-03-29T08:15)
  ✓ Confirmed [HARDENED x5]: `app/components/Testimonials.tsx` had 4× `var(--font-geist-mono)` — specialty label, dot separator, location label (all in `TestimonialCard`), and section eyebrow "From the community" in the parent `Testimonials` component. Replaced with `var(--font-mono)`. Risk surface extended again: any landing-page section component built in isolation (Testimonials, hero, CTA blocks) is high-risk. Note that ALL four instances were in inline style `fontFamily` strings — not Tailwind classes — making them invisible to Tailwind-focused audits. Grep targeting `font-geist-mono` in string literals remains the only reliable detection. (cycle 2026-03-29T09:00)

**Rule — Tailwind tracking utility conflict:** `tracking-tight` on h1 overrides the `-0.05em` global to `-0.025em`. Never use Tailwind tracking utilities on h1–h4; rely on global CSS.
  ⚠ Challenged and fixed: `app/(auth)/tools/page.tsx` and `app/(auth)/resources/page.tsx` had `tracking-tight` on their h1 tags; removed in cron cycle 2026-03-28T13:45.

---

## Color System — Pure B&W

| Token | Light | Dark |
|-------|-------|------|
| --background | `oklch(1 0 0)` white | `oklch(0 0 0)` black |
| --foreground | `oklch(0 0 0)` black | `oklch(1 0 0)` white |
| --primary | black | white |
| --muted-foreground | `oklch(0.45 0 0)` | `oklch(0.6 0 0)` |
| --border | `oklch(0.85 0 0)` | `oklch(1 0 0 / 12%)` |
| --accent | `oklch(0.95 0 0)` | `oklch(0.15 0 0)` |
| --link | black | white |
| --ring | black | white |
| --destructive | `oklch(0.577 0.245 27.325)` | `oklch(0.704 0.191 22.216)` |

**Rule:** No color. Links differentiated by underline, not hue. Only grays allowed for secondary text. `::selection` is black bg / white text.

---

## Buttons

| Class | Style |
|-------|-------|
| `.fj-btn-primary` | Black bg, white text, pill radius (5rem), Y-1px hover lift |
| `.fj-btn-light` | White bg, black text, 1px black border, hover to #f5f5f5 |
| `.fj-btn-text` | Black text, no bg, opacity fade on hover |
| `.fj-btn-text-on-dark` | White 50% opacity, full white on hover |

All buttons: Geist font, 600 weight, 0.875rem, -0.01em tracking.

---

## Motion

| Token | Value |
|-------|-------|
| --ease-standard | `cubic-bezier(0.25, 0.1, 0.25, 1)` |
| --ease-expressive | `cubic-bezier(0.22, 1, 0.36, 1)` |
| --duration-fast | 120ms |
| --duration-base | 200ms |
| --duration-moderate | 320ms |

### Interactions
- Nav links: slide-up underline (`scaleX 0→1`, 0.22s)
- Buttons: Y-1px lift + scale 1.01 on hover
- Bento cards: Y-3px lift + 48px shadow
- Path cards: Y-6px lift + layered shadows
- Focus: 2px solid black outline, 3px offset

---

## Shadows (grayscale only)

```css
--shadow-xs:  0 1px 3px rgba(0,0,0,0.07);
--shadow-sm:  0 2px 8px rgba(0,0,0,0.07);
--shadow-md:  0 4px 16px rgba(0,0,0,0.08);
--shadow-lg:  0 8px 32px rgba(0,0,0,0.10);
--shadow-xl:  0 16px 48px rgba(0,0,0,0.14);
--shadow-2xl: 0 24px 64px rgba(0,0,0,0.18);
```

---

## Spacing

```css
--section-gap-sm: clamp(3rem, 5vw, 4rem);
--section-gap:    clamp(4rem, 7vw, 7rem);
--section-gap-lg: clamp(6rem, 10vw, 10rem);
--container-px:   clamp(1.5rem, 5vw, 6rem);
```

---

## Vibe

Black ink on white paper. Zine meets brutalist poster. Typography IS the design — League Spartan lowercase headlines demand attention without decoration. Courier Prime body feels typed, not generated. Grayscale everything. Stark and unapologetic.

---

## Cron Notes

- App-interior page headings (tools, resources, etc.) inherit h1 styles from `globals.css` — do not override letter-spacing with Tailwind tracking utilities.
- Editorial quotes in hero contexts (e.g., `signin/page.tsx` BrandPanel h1) may intentionally not have `lowercase` because they are blockquotes wrapped in `"…"` — mark as `[DISPUTED]` until confirmed with Anthony.

**Rule — Empty state copy uses font-body (Courier Prime), not UI font:**
All empty state, zero-state, and placeholder text that reads as authored copy belongs in `--font-body` (Courier Prime, 0.875rem, line-height 1.6, color `var(--muted-foreground)`). Using only Tailwind's `text-sm text-muted-foreground` leaves font-family unset, falling back to Geist (UI font). Always set `fontFamily: "var(--font-body), 'Courier Prime', monospace"` on editorial micro-copy.
  + Added: fixed `app/(auth)/home/page.tsx` empty state (cycle 2026-03-28T14:00)

**Rule — Section-label elements must NOT use heading tags (h1–h4):**
Decorative section dividers and eyebrow labels inside cards (e.g., "Shop Identity", "About", "Contact & Hours") must use `<p>` or `<span>`, never `<h2>`/`<h3>`. Using heading tags causes the global `h1–h4 { text-transform: lowercase; letter-spacing: -0.04em }` rules to fight intentional label styling (uppercase, `tracking-wider` → `+0.05em`). Correct pattern: `<p style={{ fontFamily: "var(--font-geist-mono)…", fontSize: "0.625rem", letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--muted-foreground)" }}>`.
  ⚠ Challenged and fixed: `app/(auth)/website/page.tsx` had 3× `<h2 className="…uppercase tracking-wider">` section labels; converted to `<p>` with explicit Geist Mono eyebrow tokens (cycle 2026-03-28T15:00)
  ✓ Confirmed: `app/barber/[slug]/page.tsx` had 2× `<h2 className="…uppercase tracking-widest">` section labels ("Services", "Gallery"); same fix applied — converted to `<p>` eyebrow tokens (cycle 2026-03-28T15:15)
  ✓ Confirmed [HARDENED]: `components/ShopTemplate.tsx` had 2× `<h2 className="…uppercase tracking-widest">` section labels ("About", "Contact & Hours") in the public shop website template — same fix applied. Rule now has 3+ cross-file confirmations across page and component files; marked [HARDENED]. (cycle 2026-03-28T18:15)
  ✓ Confirmed [HARDENED]: `app/(auth)/tools/practice-test/page.tsx` had 3× `<h2 className="text-base font-semibold text-foreground">` interior card section labels ("Configure Test", "Recent Scores", "By Topic") — these are NOT decorative eyebrows but still fight the global h2 CSS (lowercase, -0.04em). Rule applies to ALL h2/h3 section labels, including plain card section headers. Converted to `<p>` with identical className. (cycle 2026-03-28T18:30)
  ✓ Confirmed [HARDENED]: `app/(auth)/tools/page.tsx` had 3× `<h3 className="text-[15px] font-bold text-foreground">` card content titles ("Website Builder", "Sanitation Checklist", "Client Intake Forms") plus 1× `<h3 className="text-[13.5px] font-semibold text-foreground">` ("Have a tool idea?") — global h3 CSS forces lowercase + `-0.03em`, corrupting these proper-noun and sentence-case labels. Converted all 3 to `<p>` with identical className. (cycle 2026-03-28T18:45)
  ✓ Confirmed [HARDENED]: `components/PathSelector.tsx` had `<h2 className="text-base font-semibold text-foreground">your paths</h2>` as the label inside a collapsible card header button — developer even left a comment acknowledging the inheritance, but left it as h2. Converted to `<p>` with identical className. Rule now spans component files as well as page files; collapsible card headers are a new confirmed risk surface. (cycle 2026-03-29T13:00)

**Rule — Standalone `rgba(0,0,0,*)` in inline styles breaks dark mode — use tokens:**
Any `color`, `backgroundColor`, or `border` inline style using bare `rgba(0,0,0,*)` or `rgba(255,255,255,*)` with no ternary/dark-mode guard is a design-system violation. Correct replacements: `rgba(0,0,0,0.4–0.55)` → `var(--muted-foreground)`; `rgba(0,0,0,0.02)` strip bg → `var(--accent)`; `rgba(0,0,0,0.06–0.07)` borders → `var(--border)`. Exception: rgba values inside ternary expressions (e.g., `isDark ? "rgba(255,255,255,0.7)" : "var(--foreground)"`) are already theme-aware and correct. Exception: `rgba(255,255,255,*)` inside a known `backgroundColor: "var(--foreground)"` section (inverted/dark-bg context) is intentional layering and should NOT be changed.
  ✓ Confirmed: `app/page.tsx` inline subtitle color fixed from `rgba(0,0,0,0.45)` → `var(--muted-foreground)` (cycle 2026-03-29T07:30)
  ✓ Confirmed: `app/page.tsx` social proof strip bg `rgba(0,0,0,0.02)` → `var(--accent)`, borders `rgba(0,0,0,0.07)` → `var(--border)`, stat dividers `rgba(0,0,0,0.06)` → `var(--border)`, stat label text `rgba(0,0,0,0.4)` → `var(--muted-foreground)`, "Find your lane" eyebrow `rgba(0,0,0,0.4)` → `var(--muted-foreground)` (same cycle)
  ✓ Confirmed [HARDENED]: `components/hero.tsx` had 3× `rgba(0,0,0,*)` in the light-mode hero text column — eyebrow label (`rgba(0,0,0,0.4)` → `var(--muted-foreground)`), the "to the" italic span inside the h1 (`rgba(0,0,0,0.5)` → `color-mix(in oklch, var(--foreground) 50%, transparent)`), and the description paragraph (`rgba(0,0,0,0.6)` → `var(--muted-foreground)`). These are outside the inverted dark-card context (which correctly uses `rgba(255,255,255,*)`) — they live on the white page background and would render black-on-black in dark mode. Rule is now confirmed across 3 distinct files (page.tsx, hero.tsx + app/page.tsx) spanning both page files and shared components. [HARDENED] (cycle 2026-03-29T08:45)
  Pattern: Landing page inline styles are equal-risk to component files for rgba() violations. Hero components are especially high-risk: text elements outside the dark-card bubble are frequently missed during initial authoring because the dark-card context is visually dominant.

**Rule — Light-mode card backgrounds must use `var(--card)`, not `rgba(255,255,255,*)` [HARDENED]:**
Cards and panel containers that sit on top of `var(--background)` must use the `var(--card)` token (and `var(--border)` for their outline), not hardcoded `rgba(255,255,255,0.8)` / `rgba(0,0,0,0.08)`. Using raw white/black rgba values bypasses the theme entirely and will render incorrectly in dark mode. Correct pattern for light-surface cards: `backgroundColor: "var(--card)", border: "1px solid var(--border)"`. Inverted / dark cards (bg-foreground context) may continue to use `rgba(255,255,255,0.*)` and `rgba(0,0,0,*)` as intentional layering accents *within* that known dark background — those values are correct because the container color is known at authoring time.
  ⚠ Challenged and fixed: `app/page.tsx` path cards (Student + Client) had `backgroundColor: "rgba(255,255,255,0.8)"` and `border: "1px solid rgba(0,0,0,0.08)"` — replaced with `var(--card)` + `var(--border)`. (cycle 2026-03-29T06:30)

**Rule — Raw `<button>` UI chrome always needs `font-sans` [HARDENED]:**
Any raw `<button>` element used for UI navigation or interactive controls (pill selectors, toggle filters, expand/collapse) inherits `var(--font-body)` (Courier Prime) from the `body` rule in `globals.css`. The `Button` component (button.tsx) is safe because its CVA base includes `font-sans`. All raw `<button>` elements serving as UI chrome — not authored content — must include `font-sans` in their className. Detection: grep `<button` in page files and check each hit for `font-sans`. The fix is always one token: add `font-sans` to the existing className string.
  ✓ Confirmed [HARDENED]: `app/(auth)/tools/practice-test/page.tsx` had 2× raw `<button>` without `font-sans` — the question-count picker buttons (setup phase) and the "Review Missed Questions" toggle button (results phase). Added `font-sans` to both. Rule confirmed across DiscoveryFeed filter tabs, flashcards filter bar, and now practice-test UI chrome. (cycle 2026-03-29T05:00)
  ✓ Confirmed [HARDENED]: `app/directory/page.tsx` had 3× raw `<button>` without `font-sans` — the TYPE_TABS filter bar buttons (Shops/Supply toggle), the search icon trigger button, and the "Clear filters" inline text button. All three rendering in Courier Prime rather than Geist. Added `font-sans` to all three. Rule now confirmed across 5+ files; every public-facing filter/search bar raw button is a risk surface for this violation. (cycle 2026-03-29T00:00)
  ✓ Confirmed [HARDENED]: `components/PostCard.tsx` like button (`<button onClick={handleLike}>`) was missing `font-sans` — rendered count number in Courier Prime instead of Geist. Added `font-sans` as first class. Risk surface confirmed: shared action/interaction buttons in card components (likes, reactions, toggles) are as vulnerable as page-level filter bars. Every raw `<button>` in component files must be audited, not just page files. (cycle 2026-03-29T06:45)
  ✓ Confirmed [HARDENED]: `components/MobileNav.tsx` "Sign out" button was missing `font-sans` — the only raw `<button>` in the drawer, rendering in Courier Prime while all surrounding `<Link>` nav items use Geist. Risk surface extended: drawer/panel bottom-action buttons (sign out, close, clear) are easy to overlook because they're visually isolated from filter bars and card actions, but the rule applies identically. (cycle 2026-03-29T07:15)
