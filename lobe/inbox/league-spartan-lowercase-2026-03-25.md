<!-- execute -->
<!-- max-turns: 20 -->

# Switch display font to League Spartan, all lowercase

Simple font swap + text transform. Three changes:

## 1. `layout.tsx` — swap import

Replace:
```ts
import { ..., Bricolage_Grotesque } from "next/font/google";

const bricolage = Bricolage_Grotesque({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});
```

With:
```ts
import { ..., League_Spartan } from "next/font/google";

const leagueSpartan = League_Spartan({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});
```

Update the `className` in the `<body>` tag to use `leagueSpartan.variable` instead of `bricolage.variable`.

## 2. `globals.css` — update fallback + add lowercase

In the heading rule (h1–h4):
- Change fallback from `"Bricolage Grotesque"` to `"League Spartan"`
- Add `text-transform: lowercase;` to the heading rule
- Update the CSS comment

## 3. Landing page + all components — lowercase text

Since `text-transform: lowercase` is on the heading rule globally, all headings across the site will be lowercase automatically. But also check for any hardcoded uppercase text in headings in `page.tsx`, `hero.tsx`, `cta-13.tsx`, `manifesto.tsx`, `footer2.tsx`, `signin/page.tsx` — the actual text content should stay as-is (the CSS handles the casing).

## Do NOT change
- Body font (Courier Prime) — keep it
- Geist / Geist Mono — keep them
- Colors — keep the B&W system
- Any spacing, animations, or layout
