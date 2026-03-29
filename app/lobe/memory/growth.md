# Lobe Growth Log

## Patterns Learned

### h2/h3 Section Label Violations
- **2026-03-29T13:00** — `components/PathSelector.tsx`: collapsible card header button contained `<h2>your paths</h2>` — developer acknowledged the inheritance trap in a comment but left it as h2 anyway. Converted to `<p>`. This confirms the violation exists in component files, not just page files, and that devs writing comments about known issues are still a risk surface — the fix must still be made.

### Raw button font-sans violations
- **2026-03-29T13:00** — `components/PathSelector.tsx`: collapsible card header `<button>` lacked `font-sans`; added alongside the h2→p fix in the same edit. Collapsible accordion-style card headers that use raw `<button>` wrappers are a confirmed dual-risk surface (h2 label AND missing font-sans in the same element).
