<!-- execute -->
<!-- max-turns: 15 -->

# Replace Bricolage Grotesque with League Spartan everywhere

The previous task added League Spartan as `--font-heading` alongside Bricolage Grotesque. That's wrong — League Spartan should **fully replace** Bricolage Grotesque as the only display/heading font. All headings lowercase.

## Exact changes needed

### `layout.tsx`
- **Remove** the `Bricolage_Grotesque` import and `bricolage` const entirely
- **Rename** `leagueSpartan` variable from `--font-heading` to `--font-display`
- **Remove** `bricolage.variable` from the className array

### `globals.css`
- Update the heading rule (h1–h4):
  - Change `var(--font-display), "Bricolage Grotesque"` → `var(--font-display), "League Spartan"`
  - Add `text-transform: lowercase;` to this rule
  - Update the comment from "Bricolage Grotesque" to "League Spartan"
- Remove any remaining references to "Bricolage Grotesque" in the file

### Components (`hero.tsx`, `page.tsx`, `cta-13.tsx`, etc.)
- Replace any inline `fontFamily` that references `--font-heading` or `--font-display` or `Bricolage Grotesque` with `var(--font-display), "League Spartan", sans-serif`
- The global `text-transform: lowercase` on h1–h4 handles casing, so no inline style changes needed for that

### Verify
- `grep -r "Bricolage" app/` should return **zero results** when done
- `grep -r "font-heading" app/` should return **zero results** when done (we consolidated to `--font-display`)
- Every heading on the site should render in League Spartan, all lowercase

## Do NOT change
- Courier Prime (body), Geist (nav/UI), Geist Mono (labels)
- Colors, spacing, animations, layout
