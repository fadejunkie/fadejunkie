<!-- execute -->
<!-- max-turns: 20 -->

# Use League Spartan (lowercase) for all headers

## What to do

1. **Add League Spartan** from Google Fonts to the project. Add it in `app/layout.tsx` via `next/font/google` or add a `<link>` in `app/globals.css`. Use weights 400, 600, 700, 800, 900.

2. **Replace all header fonts** on the homepage (`app/page.tsx`) and its components (`hero.tsx`, `manifesto.tsx`, `cta-13.tsx`) — every `<h1>`, `<h2>`, `<h3>` should use League Spartan instead of Helvetica Neue.

3. **All header text must be lowercase.** Use CSS `text-transform: lowercase` on all heading elements. The actual text in JSX can stay as-is — just force lowercase via CSS.

4. **Keep everything else the same** — body text stays Helvetica Neue / system sans-serif. Colors, spacing, layout, buttons — don't touch any of that.

## Files to edit
- `app/layout.tsx` — add League Spartan font import
- `app/page.tsx` — update heading styles
- `app/components/hero.tsx` — update h1
- `app/components/manifesto.tsx` — update headings
- `app/components/cta-13.tsx` — update h2

## Files to NOT edit
- Anything in `convex/`
- Navbar and footer components

## After you're done
Run `npm run build` and fix any errors.
