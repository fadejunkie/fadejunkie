<!-- execute -->
<!-- max-turns: 60 -->
<!-- model: opus -->

# Above-the-Fold Fix + Interaction Polish

## Context

The apple-tier polish commit (01d4aa9) has already been applied — bento cards, hero profile card, ambient glow, footer, etc. That's done. This task is for the remaining critical issues identified by the automated QA cron.

---

## CRITICAL — Fix 1: Hero CTA Below the Fold

**The #1 issue.** The "Join free" primary CTA button sits at y≈734px in a 730px viewport. Users cannot see the call-to-action without scrolling. Apple ships NOTHING like this.

**File:** `app/components/hero.tsx`

The hero section currently uses `minHeight: "88vh"` and headline `fontSize: clamp(3.75rem, 10vw, 8.5rem)`. At 1536px that renders at `8.5rem` per line × 3 lines ≈ full viewport consumed by headline alone.

**Fix:**

1. In the `<section>` element, change `minHeight: "88vh"` → remove minHeight entirely (or set to `auto`). Add `paddingTop: "5rem"` and `paddingBottom: "4rem"` instead.

2. In the `<h1>` element, change:
   ```
   fontSize: "clamp(3.75rem, 10vw, 8.5rem)"
   ```
   to:
   ```
   fontSize: "clamp(3rem, 6.5vw, 6.25rem)"
   ```
   This keeps the headline dominant but brings the CTAs above the fold.

3. In the headline container div, change `marginBottom: "2.25rem"` → `marginBottom: "1.75rem"`.

4. In the description `<p>`, change `marginBottom: "3.5rem"` → `marginBottom: "2.5rem"`.

**Target:** After this fix, the "Join free →" button should be visible at the initial viewport load (y < 730px) on a 1536×730 desktop.

---

## Fix 2: Nav "Join free" Button — Overflow Clipping

**File:** `app/components/shadcnblocks-com-navbar1.tsx`

The "Join free" button ends at x≈1520 in a 1536px viewport. With the system scrollbar (≈15px), the effective viewport is ≈1521px — the button gets clipped.

The nav buttons are inside:
```jsx
<div className="flex gap-2">
  <Button variant="outline" size="sm" asChild>...Log in</Button>
  <Button size="sm" asChild>...Join free</Button>
</div>
```

**Fix:** Add `paddingRight: "1rem"` to the outer `<nav className="hidden justify-between lg:flex">` div, OR wrap the auth buttons div with `style={{ paddingRight: "1rem" }}`. This ensures the button never touches the viewport edge.

---

## Fix 3: Path Cards — Hover Lift Animation

**File:** `app/app/page.tsx`

The three path cards have `transition: "transform 0.18s ease, box-shadow 0.18s ease"` set inline but NO hover state is applied anywhere. The cards feel dead on hover.

Add a `<style>` block (or add to the existing inline `<style>` if one exists in the component) with:

```css
.path-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 16px 48px rgba(22,16,8,0.14), 0 4px 16px rgba(22,16,8,0.08) !important;
}
.path-card {
  cursor: pointer;
}
```

For the dark card (Barber), the hover should use a slightly lighter shadow:
```css
.path-card.dark-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 20px 60px rgba(22,16,8,0.35), 0 4px 16px rgba(22,16,8,0.20) !important;
}
```

Add `className="path-card"` to each card's motion.div and `className="path-card dark-card"` to the Barber card specifically.

---

## Fix 4: Hero Scroll Indicator

**File:** `app/components/hero.tsx`

Apple (and every award-winning landing page) has a subtle scroll cue. Add one at the bottom of the hero section — a small animated chevron or line that pulses downward.

Add this INSIDE the `<section>` element, after the main content grid div:

```jsx
{/* Scroll cue */}
<motion.div
  className="scroll-cue"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ delay: 1.5, duration: 0.6 }}
  aria-hidden="true"
>
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M5 7.5L10 12.5L15 7.5" stroke="hsl(34, 22%, 44%)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
</motion.div>
```

And add to the `<style>` block:
```css
.scroll-cue {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
}
@keyframes fj-bounce {
  0%, 100% { transform: translateX(-50%) translateY(0px); }
  50%       { transform: translateX(-50%) translateY(5px); }
}
.scroll-cue {
  animation: fj-bounce 2s ease-in-out infinite;
  animation-delay: 2s;
}
```

---

## Fix 5: Bento Section — "Built for the Grind" Heading

**File:** `app/app/page.tsx`

The dark section heading "Built for / *the grind.*" currently renders the italic line in the exact same opacity as the upright line. Make it intentional:

Find the heading where `"the grind."` is in italic and change its color to `hsl(34, 42%, 55%)` — a slightly warmer, more saturated olive that pops against the dark background. The regular "Built for" stays `#fff4ea`.

If the dark section heading has this structure:
```jsx
<h2>Built for<br/><span style={{fontStyle:"italic"}}>the grind.</span></h2>
```
Add `color: "hsl(34, 42%, 55%)"` to the italic span.

---

## Fix 6: Footer — Left Column Wordmark Size

**File:** `app/components/ui/shadcnblocks-com-footer2.tsx`

The footer wordmark "fadejunkie" uses an oversized font that overwhelms the footer grid. The word "fadejunkie" and "The barber community." in the footer left column should be:
- "fadejunkie": `font-size: 1rem`, `font-weight: 500`, `letter-spacing: -0.01em`
- "The barber community.": `font-size: 0.75rem`, muted color `rgba(255,244,234,0.45)`

Find the footer component's left column wordmark and reduce it to these values if it's currently larger.

---

## Quality Gate

- Build must pass (`npm run build` in `app/`)
- Zero TypeScript errors
- The "Join free" CTA must be visible without scrolling on a 1536×730 viewport
- Path cards must lift on hover
- Scroll cue must pulse at the bottom of the hero section

Commit with message: `fix: above-fold CTA, nav overflow, hover states, scroll cue, footer wordmark`
