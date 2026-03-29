# Lobe Growth Log

## Patterns Learned

### h2/h3 Section Label Violations
- **2026-03-29T13:00** — `components/PathSelector.tsx`: collapsible card header button contained `<h2>your paths</h2>` — developer acknowledged the inheritance trap in a comment but left it as h2 anyway. Converted to `<p>`. This confirms the violation exists in component files, not just page files, and that devs writing comments about known issues are still a risk surface — the fix must still be made.

### rgba(0,0,0,*) inline color violations
- **2026-03-29T07:30** — `app/page.tsx`: 6 standalone `rgba(0,0,0,*)` violations found in the light-mode social proof strip and "Three Paths" section header — none were in ternary dark-mode guards. Fixed: strip bg → `var(--accent)`, borders → `var(--border)`, stat label/eyebrow/subtitle colors → `var(--muted-foreground)`. Landing page inline styles are equal-risk to component files. Remaining `rgba(0,0,0,*)` hits in the same file are all in ternary expressions (already theme-aware) or shadow values — those are not violations.

### Raw button font-sans violations
- **2026-03-29T13:00** — `components/PathSelector.tsx`: collapsible card header `<button>` lacked `font-sans`; added alongside the h2→p fix in the same edit. Collapsible accordion-style card headers that use raw `<button>` wrappers are a confirmed dual-risk surface (h2 label AND missing font-sans in the same element).

### var(--font-geist-mono) ghost token violations
- **2026-03-29T09:15** — `components/manifesto.tsx`: 2× ghost token instances found — the attribution eyebrow "Shop Talk" and the PILLARS map label `<p>`, which renders 3× at runtime (1 attribution + 3 pillar labels = 4 exposures from 2 source lines). Pattern: components that use static data arrays (PILLARS, TESTIMONIALS, STATS) authored in one sitting are especially likely to propagate the ghost token to every array-rendered element simultaneously. A single `replace_all` fixes all instances. Landing-page editorial section components (Manifesto, Testimonials, hero) remain the highest-density surface for ghost token introduction.
