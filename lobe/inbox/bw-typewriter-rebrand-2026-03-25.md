<!-- execute -->
<!-- max-turns: 60 -->

# Black & White + Typewriter Rebrand

Strip FadeJunkie's visual identity down to **black and white** with a **bold sans-serif header** and **typewriter body font**. Stark. Graphic. High-contrast. Think zine meets brutalist poster.

## Font Changes

### Headers — Bold Sans-Serif
- Replace **Spectral** (serif) with a bold, punchy sans-serif
- Use **Geist** (already loaded) at weight 800–900, or add a heavier option like **Space Grotesk** or **Bricolage Grotesque** if Geist doesn't hit hard enough at display sizes
- Tight letter-spacing on large headers (`-0.03em` to `-0.05em`)
- Keep the oversized editorial sizing — just change the typeface

### Body — Typewriter
- Replace **Inter** as the body font with a monospaced typewriter font
- Use **Courier Prime** (Google Fonts — clean typewriter with good readability) or **JetBrains Mono** or **IBM Plex Mono** as alternatives
- Body text should feel like it was typed on a machine — slightly raw, not polished
- Keep **Geist Mono** for code/label accents (it's already monospaced but too clean for body)

### Update in `layout.tsx`
- Add new Google Font imports as needed
- Update CSS variables (`--font-sans`, `--font-spectral`, `--font-inter`, etc.) or create new ones
- Make sure the font variable names still make sense or rename them

## Color Changes

### Strip to Black & White
In `globals.css`, update the CSS custom properties:

**Light mode:**
- `--background` → pure white `oklch(1 0 0)` (already white, keep)
- `--foreground` → pure black `oklch(0 0 0)` (was 0.145, go full black)
- `--primary` → black `oklch(0 0 0)`
- `--primary-foreground` → white `oklch(1 0 0)`
- `--link` → black (was saturated olive `hsl(34 42% 44%)`) — links differentiated by underline, not color
- `--muted-foreground` → medium gray `oklch(0.45 0 0)` (only gray allowed — for secondary text)
- `--border` → light gray `oklch(0.85 0 0)`
- `--card` → white
- `--accent` → light gray `oklch(0.95 0 0)`

**Dark mode:**
- Invert: white text on black background
- `--muted-foreground` → `oklch(0.6 0 0)`

### Landing Page (`page.tsx`)
- **Hero background:** Change `#fff4ea` (warm cream) → pure white `#ffffff`
- **Dark sections:** Change `rgba(22,16,8,0.97)` → pure black `#000000` or `rgb(0,0,0)`
- **All olive/cream accent colors** → black or white depending on context
- **Stats strip overlay** → light gray `rgba(0,0,0,0.03)` instead of warm tint
- **Button classes** in globals.css:
  - `.fj-btn-primary` → black bg, white text
  - `.fj-btn-cream` → rename to `.fj-btn-light` → white bg, black text, black border
  - `.fj-btn-text` → black text, no bg
  - `.fj-btn-text-on-dark` → white text, no bg

### Kill all warm tones
- No `#fff4ea`, no `hsl(34 ...)`, no `rgba(22,16,8,...)` — only `#000`, `#fff`, and grays
- Hover states: use opacity shifts or subtle gray backgrounds instead of color
- Focus rings: black 2px outline (was olive)

## What to Preserve
- All micro-interactions (hover lifts, shadow transitions, arrow slides)
- The editorial spacing and typography scale (clamp values, padding)
- Component structure — don't restructure, just restyle
- Responsive behavior
- The punk energy — this should feel MORE raw, not less

## Vibe Check
The result should look like a zine or indie publication. Black ink on white paper. Bold sans headers that demand attention. Typewriter body that feels authored, not generated. No decoration — the typography IS the design. Every hover, every shadow should be grayscale. Stark and unapologetic.
