# FadeJunkie UI Kit — Design Tokens Reference

> **Single source of truth** for all design decisions in the FadeJunkie Next.js app.
> All tokens are defined as CSS custom properties in `app/globals.css` and exposed
> to Tailwind v4 via the `@theme inline { … }` block.
> All components derive styles from these tokens — never hardcode values.

---

## Color Palette

| Token | Value | Tailwind class | Usage |
|-------|-------|---------------|-------|
| `--background` | `oklch(1 0 0)` (white) | `bg-background` | Page background |
| `--foreground` | `oklch(0 0 0)` (jet black) | `text-foreground` | Body text |
| `--primary` | `oklch(0 0 0)` (jet black) | `bg-primary` | Primary CTA buttons, key UI |
| `--primary-foreground` | `oklch(1 0 0)` (white) | `text-primary-foreground` | Text on primary |
| `--secondary` | `oklch(0.97 0 0)` (near-white gray) | `bg-secondary` | Secondary surfaces |
| `--secondary-foreground` | `oklch(0 0 0)` | `text-secondary-foreground` | Text on secondary |
| `--muted` | `oklch(0.97 0 0)` | `bg-muted` | Muted backgrounds, tags |
| `--muted-foreground` | `oklch(0.45 0 0)` | `text-muted-foreground` | Captions, placeholders |
| `--accent` | `oklch(0.95 0 0)` | `bg-accent` | Hover fills, ghost states |
| `--accent-foreground` | `oklch(0 0 0)` | `text-accent-foreground` | Text in accent contexts |
| `--card` | `oklch(1 0 0)` | `bg-card` | Card surfaces |
| `--card-foreground` | `oklch(0 0 0)` | `text-card-foreground` | Card text |
| `--border` | `oklch(0.85 0 0)` | `border-border` | Dividers, input borders |
| `--input` | `oklch(0.85 0 0)` | `border-input` | Input default border |
| `--ring` | `oklch(0 0 0)` | `ring-ring` | Focus rings |
| `--link` | `oklch(0 0 0)` | `text-link` | Link color (underline differentiates) |
| `--destructive` | `oklch(0.577 0.245 27.325)` | `bg-destructive` | Errors, danger actions |

### Dark mode overrides (`class="dark"`)

All values above invert to maintain the same high-contrast black/white identity.
`--primary` becomes white, `--background` becomes black, etc.

---

## Typography

| Role | Font | Variable | Tailwind class |
|------|------|----------|---------------|
| UI / Navigation | Geist | `--font-sans` | `font-sans` |
| Display / Headlines | League Spartan | `--font-display` | `font-display` |
| Body / Editorial | Courier Prime | `--font-body` | `font-body` |
| Code / Labels / Accents | Geist Mono | `--font-geist-mono` | `font-mono` |

**Heading rule:** `h1–h4` are automatically set to `font-display` + `text-transform: lowercase` via globals.css base layer.

---

## Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `--radius-sm` | `0.375rem` | Very subtle rounding (badges inline) |
| `--radius-md` | `0.5rem` | Inputs, cards (subtle) |
| `--radius-lg` | `0.625rem` (base `--radius`) | Default rounding |
| `--radius-xl` | `0.875rem` | Modal containers |
| `--radius-2xl` | `1.125rem` | Large cards |
| `--radius-3xl` | `1.375rem` | Hero cards, bento cards |
| `--radius-4xl` | `1.625rem` | Oversized modal / overlay cards |
| `9999px` | pill | All buttons (`Button` component default) |

---

## Shadow Scale

All shadows are defined in `:root` and referenced by components and utilities:

| Token | Usage |
|-------|-------|
| `--shadow-xs` | Subtle elevation (chips, pill badges) |
| `--shadow-sm` | Cards at rest |
| `--shadow-md` | Dropdowns, popovers |
| `--shadow-lg` | Sticky nav, floating panels |
| `--shadow-xl` | Modals, elevated cards on hover |
| `--shadow-2xl` | Hero cards, deep elevation |
| `--shadow-inset` | Pressed states |

---

## Motion / Easing

All easing values are CSS custom properties so they can be consumed in both CSS transitions and passed to Framer Motion via `ease` props.

| Token | Bezier | Usage |
|-------|--------|-------|
| `--ease-standard` | `cubic-bezier(0.25, 0.1, 0.25, 1)` | Standard UI transitions (hover, state change) |
| `--ease-expressive` | `cubic-bezier(0.22, 1, 0.36, 1)` | Entrance animations, overshooting physical feel |
| `--ease-enter` | `cubic-bezier(0.0, 0.0, 0.2, 1)` | Elements entering (deceleration) |
| `--ease-exit` | `cubic-bezier(0.4, 0.0, 1, 1)` | Elements exiting (acceleration) |

| Duration token | Value | Usage |
|----------------|-------|-------|
| `--duration-fast` | `120ms` | Icon swaps, color transitions |
| `--duration-base` | `200ms` | Button hover, border focus |
| `--duration-moderate` | `320ms` | Card hover, panel slides |
| `--duration-slow` | `600ms` | Bento/hero entrances |
| `--duration-reveal` | `900ms` | Page-level reveals |

**JS usage (Framer Motion):**
```ts
const ease = [0.25, 0.1, 0.25, 1] as const   // standard
const easeExpressive = [0.22, 1, 0.36, 1] as const  // expressive
```

---

## Section Spacing

| Token | Value | Usage |
|-------|-------|-------|
| `--section-gap-sm` | `clamp(3rem, 5vw, 4rem)` | Tight section padding |
| `--section-gap` | `clamp(4rem, 7vw, 7rem)` | Standard section vertical padding |
| `--section-gap-lg` | `clamp(6rem, 10vw, 10rem)` | Hero / feature sections |
| `--container-px` | `clamp(1.5rem, 5vw, 6rem)` | Horizontal container padding |

---

## Component Inventory

| Component | File | Key design decisions |
|-----------|------|----------------------|
| `Button` | `ui/button.tsx` | Pill (`rounded-full`), `data-slot="button"`, 6 variants |
| `Card` | `ui/Card.tsx` | `borderRadius: 20px` inline, token-based bg/text |
| `Badge` | `ui/Badge.tsx` | `default`/`muted` = label style (no capsule), `secondary`/`outline` = pill |
| `Input` | `ui/Input.tsx` | Border-color transition on focus (no ring-offset halo) |
| `Textarea` | `ui/Input.tsx` | Same as Input, `resize-y` |
| `Tabs` | `ui/Tabs.tsx` | Pill triggers, active = `border-foreground` |
| `Accordion` | `ui/accordion.tsx` | Opacity-shift hover (no underline), `ChevronDown` rotates on open |
| `Checkbox` | `ui/checkbox.tsx` | `rounded-[3px]`, hover border, smooth check-in transition |
| `Avatar` | `ui/Avatar.tsx` | `rounded-full`, `border-border`, initials fallback |
| `Separator` | `ui/Separator.tsx` | `bg-border` |
| `Label` | `ui/Label.tsx` | `text-sm font-medium`, standard shadcn |
| `HeroBadge` | `ui/hero-badge.tsx` | Framer Motion entrance, `rounded-full` pill |
| `BentoGrid/BentoCard` | `ui/bento-grid.tsx` | `data-slot="bento-card"` for CSS hover lift, light/dark variants |
| `NavigationMenu` | `ui/navigation-menu.tsx` | Standard Radix; hover underline driven by globals.css `[data-slot="navigation-menu-link"]` |

---

## `data-slot` Convention

globals.css uses `data-slot` attributes to target components for CSS-driven interactions,
keeping animation logic out of component class strings:

| `data-slot` | Component | Effect |
|-------------|-----------|--------|
| `button` | `Button` | Hover lift (`translateY(-1px)`), active depress |
| `bento-card` | `BentoCard` | Hover lift + shadow |
| `navigation-menu-link` | Nav links | Slide-up underline on hover |
| `input` | `Input` | (target available for future CSS rules) |
| `textarea` | `Textarea` | (target available for future CSS rules) |

---

## Brand Identity Quick Reference

- **Logo:** Skull with mohawk + bandana — black & white stencil, punk energy
- **Voice:** Direct. Punk. Culture-native. Barber-aware. Not corporate.
- **Texture:** SVG grain at ~3.5–4% opacity (`mixBlendMode: "multiply"` on white, `"screen"` on black)
- **Halftone:** Decorative dot cluster accent — `opacity: 0.07–0.10`
- **Anti-patterns:** No red/white stripes, no vintage pole aesthetics, no generic SaaS energy
