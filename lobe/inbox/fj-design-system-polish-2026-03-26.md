<!-- execute -->
<!-- max-turns: 60 -->

# FadeJunkie UI Kit — Design System Polish Pass

Automated audit completed 2026-03-26. The design token system in `globals.css` and `FJ_TOKENS.md` is solid. This brief fixes **specific deviations** found in component and page code that break system coherence. Execute all items below.

---

## 1. Navbar1 — Fix Logo Font (3 occurrences)

**File:** `components/shadcnblocks-com-navbar1.tsx`

**Problem:** All three logo instances use `font-serif` class which maps to a generic serif fallback — not League Spartan. This is the most visible brand element and it's wrong.

**Fix:** Replace every instance of the logo `<span>` className. There are exactly 3 occurrences:

- Line 86 (desktop nav)
- Line 109 (mobile nav header)
- Line 122 (sheet sidebar header)

Change:
```tsx
<span className="font-serif text-xl tracking-[-0.02em]" style={{ fontWeight: 400 }}>
```
To:
```tsx
<span className="font-display text-xl lowercase" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
```

And the two `text-lg` instances:
```tsx
<span className="font-serif text-lg tracking-[-0.02em]" style={{ fontWeight: 400 }}>
```
To:
```tsx
<span className="font-display text-lg lowercase" style={{ fontWeight: 700, letterSpacing: "-0.04em" }}>
```

**Why:** `font-display` maps to `--font-display` (League Spartan). The wordmark "fadejunkie" must render in League Spartan 700 with tight tracking, lowercase. This is the primary brand expression.

---

## 2. Navbar1 — Fix Nav Link Colors to Pure Grayscale

**File:** `components/shadcnblocks-com-navbar1.tsx`

**Problem:** The `renderMenuItem` function uses hardcoded `hsl(34, 22%, 44%)` — a warm olive tone — for nav link text and hover state. This is a leftover from the warm cream palette and directly violates the "No color — pure B&W" design system rule.

**Fix:** Replace the inline JS color handlers on the nav link `<a>` element (lines ~203–206):

Change:
```tsx
style={{ color: "hsl(34, 22%, 44%)" }}
onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "hsl(0, 0%, 8%)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "hsl(34, 22%, 44%)"; (e.currentTarget as HTMLAnchorElement).style.backgroundColor = "transparent"; }}
```
To:
```tsx
style={{ color: "var(--muted-foreground)" }}
onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--foreground)"; }}
onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.color = "var(--muted-foreground)"; }}
```

**Why:** Per design spec: "No color. Links differentiated by underline, not hue. Only grays allowed for secondary text." `--muted-foreground` is `oklch(0.45 0 0)` (mid gray) — correct. `--foreground` is pure black on hover — correct.

---

## 3. Button — Unify Focus Ring with Design Spec

**File:** `components/ui/button.tsx`

**Problem:** Button uses Tailwind's `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` which creates a box-shadow based ring. `globals.css` defines the canonical focus style as `2px solid var(--foreground)` outline with `3px offset`. These conflict and produce inconsistent focus indicators across the product — buttons get a ring shadow, everything else gets a solid outline.

**Fix:** In the `buttonVariants` cva base string, replace:
```
"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
```
With:
```
"focus-visible:outline-none focus-visible:ring-0",
```

Then add the following to `globals.css` under the existing `[data-slot="button"]` rule:
```css
[data-slot="button"]:focus-visible {
  outline: 2px solid var(--foreground);
  outline-offset: 3px;
  border-radius: 3px;
}
```

**Why:** The `globals.css` `:focus-visible` base rule is correct per spec. But the Button's `focus-visible:outline-none` suppresses it, and the ring utilities create a different visual. By also disabling the ring on buttons and adding the explicit `data-slot="button":focus-visible` CSS rule, focus style is consistent and spec-correct everywhere.

---

## 4. Card — Replace Inline borderRadius with Token

**File:** `components/ui/Card.tsx`

**Problem:** The `Card` component uses `style={{ borderRadius: "20px" }}` hardcoded. Per design system rules: "All components must derive styles from tokens—no hardcoded values."

**Fix:** Change the `Card` component:

Replace:
```tsx
style={{ borderRadius: "20px", ...style }}
```
With:
```tsx
style={{ borderRadius: "var(--radius-3xl)", ...style }}
```

Also add `data-slot="card"` to the outer `<div>` so it can be targeted by CSS if needed in the future:
```tsx
<div
  ref={ref}
  data-slot="card"
  className={cn("border bg-card text-card-foreground", className)}
  style={{ borderRadius: "var(--radius-3xl)", ...style }}
  {...props}
/>
```

**Why:** `--radius-3xl` is `calc(var(--radius) * 2.2)` = `1.375rem` ≈ `22px` which is close to 20px and token-driven. No hardcoded values in components.

---

## 5. AppHeader — Fix Brand Wordmark

**File:** `components/AppHeader.tsx`

**Problem:** The authenticated app header shows "FadeJunkie" (Title Case) with `text-sm font-semibold` — using system font stack, not `font-display`. This is the wordmark inside the app and should match the brand identity.

**Fix:** Change the logo link:

From:
```tsx
<Link href="/home" className="text-sm font-semibold text-foreground tracking-tight mr-auto">
  FadeJunkie
</Link>
```
To:
```tsx
<Link
  href="/home"
  className="font-display text-base lowercase mr-auto"
  style={{ fontWeight: 700, letterSpacing: "-0.04em", color: "var(--foreground)" }}
>
  fadejunkie
</Link>
```

**Why:** Brand voice is "lowercase" (per design spec: "All headings forced lowercase via CSS"). `font-display` = League Spartan. The wordmark should be identical in feel to the landing page nav.

---

## 6. Barber Profile Page — Fix Logo Font

**File:** `app/barber/[slug]/page.tsx`

**Problem:** The public barber profile page header uses `font-serif` for the fadejunkie wordmark.

**Fix:** Change the header `<Link>`:

From:
```tsx
<Link href="/" className="font-serif text-lg font-semibold text-foreground">fadejunkie</Link>
```
To:
```tsx
<Link
  href="/"
  className="font-display lowercase text-lg"
  style={{ fontWeight: 700, letterSpacing: "-0.04em" }}
>
  fadejunkie
</Link>
```

---

## 7. AppSidebar — Fix Active State Layout Shift

**File:** `components/AppSidebar.tsx`

**Problem:** The active nav item uses `font-bold` vs `font-normal` to indicate active state. This causes a subtle layout shift (bold text is wider, items shift on navigation). Additionally, the active/inactive weight difference is too subtle on small labels.

**Fix:** Add a left-border indicator for active state and use consistent weight:

Change each nav link's className:
```tsx
className={cn(
  "text-[13.5px] py-1.5 px-2 rounded-md transition-colors",
  isActive
    ? "font-bold text-foreground"
    : "font-normal text-muted-foreground hover:text-foreground hover:bg-accent/50"
)}
```
To:
```tsx
className={cn(
  "text-[13.5px] py-1.5 px-2 rounded-md transition-colors font-normal",
  isActive
    ? "text-foreground bg-accent/60"
    : "text-muted-foreground hover:text-foreground hover:bg-accent/40"
)}
```

**Why:** Using background highlight (like macOS Finder) is cleaner than weight change. Consistent `font-normal` across all states prevents layout shift. The `bg-accent/60` tint provides a clear but subtle active indicator.

---

## 8. globals.css — Add Button Focus Rule + Section-Level Fixes

**File:** `app/globals.css`

Add this after the existing `[data-slot="button"]` rule:

```css
/* ─── Button focus — override Tailwind ring with spec-correct outline ── */
[data-slot="button"]:focus-visible {
  outline: 2px solid var(--foreground);
  outline-offset: 3px;
  border-radius: 3px;
}
```

Also verify/add this rule for AppSidebar nav links (it may be absent since the sidebar uses server-side rendering patterns):

```css
/* ─── Sidebar nav active bg ─────────────────────────────────────────── */
nav a.bg-accent\/60 {
  background-color: var(--accent);
}
```

---

## Summary of Changes

| File | Change | Impact |
|------|--------|--------|
| `components/shadcnblocks-com-navbar1.tsx` | Logo: `font-serif` → `font-display` lowercase (3 occurrences) | 🔴 Critical — brand identity |
| `components/shadcnblocks-com-navbar1.tsx` | Nav links: olive color → `--muted-foreground` gray | 🔴 Critical — violates B&W spec |
| `components/ui/button.tsx` | Focus: ring utilities → none (CSS handles via `data-slot`) | 🟡 Medium — accessibility/consistency |
| `components/ui/Card.tsx` | `borderRadius: "20px"` → `var(--radius-3xl)` + `data-slot="card"` | 🟡 Medium — token compliance |
| `components/AppHeader.tsx` | Wordmark: `font-semibold` → `font-display lowercase` | 🟡 Medium — app identity |
| `app/barber/[slug]/page.tsx` | Header link: `font-serif` → `font-display lowercase` | 🟡 Medium — brand consistency |
| `components/AppSidebar.tsx` | Active: `font-bold` → `bg-accent/60` tint | 🟢 Low — UX polish |
| `app/globals.css` | Add `[data-slot="button"]:focus-visible` rule | 🟡 Medium — spec compliance |

All changes are surgical. No layout rebuilds, no page rewrites. Every item has a specific before/after diff.
