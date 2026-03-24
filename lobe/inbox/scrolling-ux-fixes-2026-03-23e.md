<!-- execute -->
<!-- max-turns: 40 -->
<!-- model: sonnet -->

# Pass 5 — Four Surgical UX Fixes

**Audit date:** 2026-03-23
**Author:** Cowork automated audit (does-this-look-apple scheduled task)
**Context:** Fifth pass. Previous 4 passes committed + deployed. Four new issues found via live DOM inspection + screenshot scroll audit.

---

## Fix 1 — CRITICAL BUG: Stats strip "$0" renders as "0+"

**File:** `app/app/page.tsx`

**Problem:** The `AnimatedStatValue` component uses regex `/([\d,.]+)([k+]*)/i` to parse stat values for animation. For `"$0"`, the dollar sign gets stripped — the regex matches `"0"` with empty suffix — and the counter runs from 0→0 then appends `"+"`, resulting in `"0+"` under the label "Monthly fee". This looks like a broken stat. On a site that's supposed to feel like Apple quality, a stat showing "0+ Monthly fee" breaks trust immediately.

**Root cause in `AnimatedStatValue`:**
```tsx
const match = value.match(/([\d,.]+)([k+]*)/i);
if (!match) { setDisplayed(value); return; }
// "$0".match(...) DOES match — captures "0", strips "$"
// then shows Math.round(0) + "+" = "0+"
```

**Fix — two changes:**

**Change A:** In `AnimatedStatValue`, add a prefix detection before the regex:
```tsx
// After: if (value === "Free") { setDisplayed("Free"); return; }
// Add:
const prefix = value.match(/^[^0-9]*/)?.[0] ?? "";
const valueWithoutPrefix = value.slice(prefix.length);
const match = valueWithoutPrefix.match(/([\d,.]+)([k+]*)/i);
if (!match) { setDisplayed(value); return; }
// ... rest of animation logic stays the same ...
// When setting displayed, prepend prefix:
if (isK) {
  setDisplayed(prefix + current.toFixed(...) + "k+");
} else if (raw >= 1000) {
  setDisplayed(prefix + Math.round(current).toLocaleString() + "+");
} else {
  setDisplayed(prefix + Math.round(current) + "+");
}
// Initial displayed state: also prepend prefix
```
And update the initial state: `useState<string>(value === "Free" ? "Free" : prefix + "0")`

**Change B:** The `$0` stat should NOT get a `+` suffix appended (zero dollars + means nothing). After the animation logic, if `target === 0`, just display the original `value` string as-is:
```tsx
if (!isInView) return;
if (value === "Free") { setDisplayed("Free"); return; }
if (value === "$0") { setDisplayed("$0"); return; }  // ← add this guard
```

**Expected result:** Stats strip shows: `2,400+` Barbers / `18k+` Flashcards studied / `340+` Shop sites / `$0` Monthly fee

---

## Fix 2 — CRITICAL: Testimonials section creates a blank viewport during scroll

**File:** `app/components/Testimonials.tsx`

**Problem:** The testimonials section is ~1000px tall. The section head (overline + headline) is at the top, and the 2×2 grid of testimonial cards is below with a `3rem` margin. The grid container uses:
```tsx
<motion.div
  variants={stagger}
  initial="hidden"
  whileInView="visible"
  viewport={{ once: true, margin: "-60px" }}
>
```

The `-60px` margin means the stagger animation only fires when the grid container's top edge is 60px inside the viewport. During scroll, there's a dead zone where:
- The section head has already risen above the viewport top edge
- The grid container top is still below the 60px trigger line

This creates a full-viewport blank cream area that looks like a page crash. Verified live: scrolling through the testimonials section at normal speed produces a completely empty cream viewport for ~300ms worth of scroll.

**Fix — two changes:**

**Change A:** Reduce the viewport margin on the stagger container from `-60px` to `0px`:
```tsx
viewport={{ once: true, margin: "0px" }}
```
This triggers the stagger animation the moment the grid container's top edge enters the viewport — cards start animating immediately as the section scrolls in, eliminating the blank zone.

**Change B:** Reduce section top padding from `5rem` to `3.5rem`:
```tsx
// Before:
padding: "5rem clamp(1.5rem, 5vw, 6rem)"
// After:
padding: "3.5rem clamp(1.5rem, 5vw, 6rem)"
```
This tightens the gap between the section head and what the user sees on scroll, reducing the empty-section feeling.

**Expected result:** Scrolling through the testimonials section shows a smooth, continuous transition from section head → cards. No blank cream zone.

---

## Fix 3 — Footer has no left/right padding (content starts at x=0)

**File:** `app/components/ui/shadcnblocks-com-footer2.tsx`

**Problem:** The footer's inner `div.container` has no horizontal padding override. Measured via DOM: the container's bounding rect starts at x=0 and ends at x=1521. The "fadejunkie" logo text starts at exactly x=0 (left viewport edge). This looks unprofessional — text flush against the viewport edge with no breathing room. Every other content section on the page has `clamp(1.5rem, 5vw, 6rem)` horizontal padding. The footer skipped this.

For reference, the Navbar1 component correctly overrides container padding:
```tsx
<div className="container" style={{
  paddingLeft: "max(1.5rem, env(safe-area-inset-left))",
  paddingRight: "max(1.5rem, env(safe-area-inset-right))",
}}>
```

**Fix:** Add the same padding override to the footer container:
```tsx
// In shadcnblocks-com-footer2.tsx, find:
<div className="container">
// Change to:
<div
  className="container"
  style={{
    paddingLeft: "max(1.5rem, env(safe-area-inset-left))",
    paddingRight: "max(1.5rem, env(safe-area-inset-right))",
  }}
>
```

**Expected result:** "fadejunkie" logo and footer columns have 1.5rem left breathing room, consistent with every other content section on the page.

---

## Fix 4 — Add `scrollbar-gutter: stable` to prevent layout shift

**File:** `app/app/globals.css`

**Problem:** `scrollbar-gutter` is not set on the `html` element. Measured via DOM: `scrollbarGutter: "auto"`, scrollbar width: 15px. This means:
1. On pages with scrollable content (like the landing page), a 15px scrollbar appears on the right side of the viewport
2. On pages WITHOUT a scrollbar (e.g., sign-in page), no scrollbar appears
3. When navigating between these pages, content shifts 15px left/right as the scrollbar appears/disappears

`scrollbar-gutter: stable` reserves scrollbar space even when no scrollbar is present. Content width stays consistent across all pages — no layout shift, no button repositioning on navigation.

**Fix:** In `globals.css`, find the `html` selector and add the property:
```css
html {
  scroll-behavior: smooth;
  scrollbar-gutter: stable;  /* ← add this */
}
```

**Expected result:** Layout is stable across page transitions. No 15px shift when navigating between scrollable and non-scrollable pages.

---

## Quality Gate

1. TypeScript check: `cd app && npx tsc --noEmit` — must exit 0
2. Build: `cd app && npm run build` — must complete without errors
3. Verify stat "$0" renders correctly (not "0+")
4. Scroll through testimonials section — no blank cream zone
5. Check footer left edge has padding
6. Commit: `git add app/app/page.tsx app/components/Testimonials.tsx app/components/ui/shadcnblocks-com-footer2.tsx app/app/globals.css`
7. Commit message: `fix: $0 stat display, testimonials blank zone, footer padding, scrollbar-gutter`
8. Push via Desktop Commander Windows shell: `cd C:\Users\twani\fadejunkie && git push origin main`
9. Deploy: `npx vercel --prod --yes`
10. Write result to `lobe/outbox/scrolling-ux-fixes-2026-03-23e-result.md`

**What success looks like:**
- Stats strip: `$0` (not `0+`) under Monthly fee label
- Scrolling through the testimonials section: content animates in immediately, no blank zone
- Footer: "fadejunkie" and columns start with 1.5rem left margin (not at x=0)
- Layout is stable on page transitions (scrollbar-gutter fix)
