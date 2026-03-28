# FadeJunkie Design System — Lobe's Annotated Reference

> Canonical design rules with codebase evidence. Rules marked [HARDENED] have 3+ cross-file confirmations and are ground truth.

---

## Typography

| Role | Font | Variable | Weights | Notes |
|------|------|----------|---------|-------|
| Headlines | League Spartan | --font-display | 400, 600, 700, 800, 900 | All headings forced lowercase via CSS |
| Body | Courier Prime | --font-body | 400, 700 + italic | Typewriter feel — raw, authored |
| UI / Nav | Geist | --font-sans | system default | Buttons, labels, navigation chrome |
| Code / Tags | Geist Mono | --font-geist-mono | system default | Data labels, eyebrow text, accents |

### Heading Rules

- h1–h4: League Spartan, `text-transform: lowercase`, antialiased, kern+liga enabled
- Tight letter-spacing on display sizes (`-0.03em` to `-0.05em`)
- h1: `-0.05em`, h2: `-0.04em`, h3: `-0.03em`, h4: `-0.02em` (set globally in `globals.css:199-202`)
- Mixed-font trick: Courier Prime italic `<span>` inside League Spartan headlines for zine energy

**Font — h1–h4 base:** League Spartan + lowercase + tight letter-spacing set globally
  ✓ Confirmed: `app/globals.css:190-202` applies `font-family: var(--font-display)`, `text-transform: lowercase`, `letter-spacing: -0.05em` to h1 via CSS baseline. Do NOT add `tracking-tight` (Tailwind `-0.025em`) to h1 headings — it will override the design system spacing with a weaker value. (cycle 2026-03-28T13:45)

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
