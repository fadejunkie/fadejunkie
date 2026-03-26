<!-- execute -->
<!-- max-turns: 60 -->

# FadeJunkie UI Kit — Iteration 03 Design System Pass

Automated audit completed 2026-03-26 (third pass). The Iteration 02 brief
(`fj-design-system-iteration-02-2026-03-26.md`) is still pending in your inbox
— please execute that first, then this one.

This brief covers **5 gaps** found during the Iteration 03 audit of previously
unread files: `manifesto.tsx`, `PostCard.tsx`, `profile/page.tsx`,
`tools/page.tsx`, and `directory/page.tsx`.

---

## Priority Matrix

| # | File | Issue | Severity |
|---|------|-------|----------|
| 1 | `components/manifesto.tsx` | Dark mode color drift — rgba black values | 🟡 Medium |
| 2 | `components/PostCard.tsx` | `borderRadius: "20px"` hardcoded | 🟢 Low |
| 3 | `app/(auth)/profile/page.tsx` | `text-blue-600` color violation + raw inputs | 🔴 Critical |
| 4 | `app/(auth)/tools/page.tsx` | `hsl(0 0% 97%)` + `hover:border-[#c8c8c8]` hardcoded | 🟢 Low |
| 5 | `app/(auth)/tools/page.tsx` | testimonials-grid media query in inline `<style>` | 🟢 Low |

---

## 1. Manifesto — Dark Mode Color Drift

### Problem

`components/manifesto.tsx` uses `rgba(0,0,0,*)` opacity values throughout for
secondary text and decorative elements. These are hardcoded to black — in dark
mode (black background), they become invisible.

Specific instances:
- Opening quote mark: `color: "rgba(0,0,0,0.1)"` — near-invisible in light, fully invisible in dark
- Attribution divider line: `backgroundColor: "rgba(0,0,0,0.2)"` — invisible in dark
- Attribution label "Shop Talk": `color: "rgba(0,0,0,0.4)"` — same as eyebrow pattern elsewhere
- Pillar label text: `color: "rgba(0,0,0,0.4)"` — should be `--muted-foreground`
- Pillar body text: `color: "rgba(0,0,0,0.65)"` — should be `--foreground` at reduced opacity

### Fix

**Opening quote mark** (the `&ldquo;` display element):
```tsx
// Before
color: "rgba(0,0,0,0.1)",

// After
color: "var(--border)",
```
`--border` is `oklch(0.85 0 0)` in light (very light gray) and `oklch(1 0 0 / 12%)` in
dark — semantically the right choice for a near-invisible decorative element.

**Attribution divider line** (the 36px horizontal line):
```tsx
// Before
backgroundColor: "rgba(0,0,0,0.2)",

// After
backgroundColor: "var(--border)",
```

**Attribution eyebrow "Shop Talk"**:
```tsx
// Before
color: "rgba(0,0,0,0.4)",

// After
color: "var(--muted-foreground)",
```

**Pillar label text** (the `{pillar.label}` eyebrow above each pillar):
```tsx
// Before
color: "rgba(0,0,0,0.4)",

// After
color: "var(--muted-foreground)",
```

**Pillar body text** (the `{pillar.text}` paragraph):
```tsx
// Before
color: "rgba(0,0,0,0.65)",

// After
color: "var(--foreground)",
opacity: 0.7,
```
Or use the CSS variable directly:
```tsx
color: "color-mix(in oklch, var(--foreground) 70%, transparent)",
```
Actually, the cleanest approach is just `color: "var(--muted-foreground)"` since that
token is specifically designed for secondary body text. Use `--muted-foreground` here.

**Why:** Every instance of `rgba(0,0,0,*)` on text will fail in dark mode. The token
system already has the right semantic values — `--muted-foreground` for secondary text,
`--border` for decorative lines/dividers.

---

## 2. PostCard — Hardcoded Border Radius

### Problem

`components/PostCard.tsx` line 52:
```tsx
<div className="bg-card border border-border p-5" style={{ borderRadius: "20px" }}>
```

`20px` is not a token value. The token scale has `--radius-3xl: 1.375rem` (22px) which
is the intended large card radius.

### Fix

```tsx
// Before
style={{ borderRadius: "20px" }}

// After
style={{ borderRadius: "var(--radius-3xl)" }}
```

**Why:** All card surfaces should use the radius token scale. `20px` is close but not
in the system, creating a subtle inconsistency if the scale ever changes.

---

## 3. Profile Page — Color Violation + Raw Inputs (Critical)

### Problem A — `text-blue-600` Color Violation

`app/(auth)/profile/page.tsx` line 133:
```tsx
<button
  type="button"
  onClick={() => avatarRef.current?.click()}
  className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"
>
  Upload photo
</button>
```

`text-blue-600` and `hover:text-blue-700` are explicit color violations. The spec
states: "No color. Links differentiated by underline, not hue."

### Fix A

```tsx
// Before
className="text-sm text-blue-600 hover:text-blue-700 underline underline-offset-2"

// After
className="text-sm text-foreground/70 hover:text-foreground underline underline-offset-2 transition-colors"
```

### Problem B — `text-green-600` Slug Status

Line 153:
```tsx
"text-green-600": slugStatus === "ok",
```

Green is another color violation. For "available" state, use foreground:

```tsx
// Before
"text-green-600": slugStatus === "ok",

// After
"text-foreground": slugStatus === "ok",
```

The "taken" state uses `text-destructive` which is correct (system red token), so keep that.

### Problem C — Raw `<input>` Elements Instead of `<Input />` Component

The profile form uses a raw `inputCls` className string across 9+ input fields:
```tsx
const inputCls =
  "w-full border border-input rounded-md px-3 py-2.5 text-sm bg-background text-foreground placeholder:text-muted-foreground/60 focus:border-ring focus:outline-none transition-colors";
```

This is a maintenance liability identical to Issue 3 from Iteration 02 (signin page).
Changes to the `<Input />` component won't propagate to profile.

Add the import:
```tsx
import { Input } from "@/components/ui/Input";
```

Then replace every `<input className={inputCls}` with `<Input` and every
`<textarea className={cn(inputCls, "resize-none")}` with `<textarea className="w-full ...">`.
Keep `<textarea>` as raw since there's no Textarea component — just remove `inputCls`
from it and apply equivalent Tailwind classes directly.

For the 8 input fields (`slug`, `name`, `bio` handled as textarea, `services`, `bookingUrl`,
`phone`, `instagram`, `shopName`, `location`), replace pattern:

```tsx
// Before
<input
  className={inputCls}
  placeholder="..."
  value={form.slug}
  onChange={...}
  required
/>

// After
<Input
  placeholder="..."
  value={form.slug}
  onChange={...}
  required
/>
```

Drop the `className={inputCls}` prop since `<Input />` already applies the correct styles.
Keep any extra props (`type="url"`, `type="tel"`, `onKeyDown`, `required`, `ref`, etc.).

Also delete the `const inputCls = ...` constant since it will be unused.

**Why:** Single source of truth. Any Input component updates propagate to profile.
The `text-blue-600` is a clear brand violation — the FJ design system is strictly
grayscale, and blue links break the zine/brutalist aesthetic.

---

## 4. Tools Page — Hardcoded Values

### Problem

`app/(auth)/tools/page.tsx`:

**Issue A** — Line 61: `style={{ background: "hsl(0 0% 97%)" }}`

This is the "Have a tool idea?" card. `hsl(0 0% 97%)` is 97% lightness gray — this is
exactly `--secondary` (defined as `oklch(0.97 0 0)` ≈ 97% lightness).

```tsx
// Before
<Card className="p-5" style={{ background: "hsl(0 0% 97%)" }}>

// After
<Card className="p-5 bg-secondary">
```

Remove the `style` prop entirely; `bg-secondary` handles it via token.

**Issue B** — Line 32: `hover:border-[#c8c8c8]`

`#c8c8c8` is a medium gray — approximately `oklch(0.8 0 0)`. The nearest token is
`--border` at `oklch(0.85 0 0)`. Use `hover:border-foreground/20` for a token-safe hover.

```tsx
// Before
className="... hover:border-[#c8c8c8] hover:shadow-[0_2px_8px_rgba(0,0,0,0.06)] ..."

// After
className="... hover:border-foreground/20 hover:shadow-sm ..."
```

`hover:shadow-sm` maps to `--shadow-sm` token (defined in Tailwind via `@theme inline`).

**Why:** `hsl(0 0% 97%)` and `#c8c8c8` are close approximations of existing tokens
but not the tokens themselves. Replace with the canonical values so changes propagate.

---

## 5. Testimonials — Move Grid Media Query to globals.css

### Problem

`components/Testimonials.tsx` lines 274–288 contain an inline `<style>` block:

```tsx
<style>{`
  @media (min-width: 768px) {
    .testimonials-grid {
      grid-template-columns: repeat(2, 1fr) !important;
    }
  }
  .fj-testimonial-card {
    transition: transform 0.2s ease, box-shadow 0.2s ease;
    cursor: default;
  }
  .fj-testimonial-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.09) !important;
  }
`}</style>
```

This is the same issue noted in the Iteration 02 brief for `fj-testimonial-card` hover.
The Iteration 02 brief also asks to move the `.fj-testimonial-card` hover to `globals.css`.

**Note:** The Iteration 02 brief already covers the `.fj-testimonial-card` hover CSS move.
This item only adds the `.testimonials-grid` media query to that work. Once the Iteration
02 Testimonials fix lands, also add to `globals.css`:

```css
/* ─── Testimonials grid — 2-col on md+ ──────────────────── */
@media (min-width: 768px) {
  .testimonials-grid {
    grid-template-columns: repeat(2, 1fr) !important;
  }
}
```

And remove the entire `<style>` block from `Testimonials.tsx`.

**Why:** Inline `<style>` tags in React components create style duplication on each
render, are harder to grep/audit, and fight the "all styles live in globals.css" rule.

---

## Summary

| Fix | File | Impact |
|-----|------|--------|
| Manifesto dark mode tokens | `manifesto.tsx` | Dark mode renders correctly |
| PostCard radius token | `PostCard.tsx` | Radius scale consistent |
| Profile `text-blue-600` | `profile/page.tsx` | Brand color rule enforced |
| Profile slug `text-green-600` | `profile/page.tsx` | Brand color rule enforced |
| Profile raw inputs → `<Input />` | `profile/page.tsx` | Token propagation |
| Tools `hsl(0 0% 97%)` → `bg-secondary` | `tools/page.tsx` | Token propagation |
| Tools `hover:border-[#c8c8c8]` | `tools/page.tsx` | Token propagation |
| Testimonials grid style tag → globals.css | `globals.css` + `Testimonials.tsx` | Clean components |

After these land, the inner app pages will be fully token-compliant and dark-mode safe.
The only remaining audit targets are the authenticated home feed, barber public profile
pages (`app/barber/[slug]`), and the study tools subpages (flashcards, practice-test).
