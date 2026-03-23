<!-- execute -->
<!-- max-turns: 20 -->
<!-- model: sonnet -->

# Hero Polish — Two Surgical Fixes (Pass 4)

**Audit date:** 2026-03-23
**Author:** Cowork automated audit (does-this-look-apple scheduled task)
**Context:** Fourth pass. Previous 3 passes are committed + deployed. Two new issues identified via live screenshot audit that were not caught in prior passes.

---

## Fix 1 — CRITICAL: Hero "Board exam" pill covers Jordan Morales header

**File:** `app/components/hero.tsx`

**Problem:** The secondary floating card ("Board exam / Just passed. First client tomorrow 🔥") uses `position: absolute` with `top: 32, left: -56` on the HeroCard wrapper. The Jordan Morales profile card has `padding: "1.875rem"` — meaning the header (JM avatar + name + Brooklyn, NY label) starts at ~30px from the card top. The pill at `top: 32` sits directly over the avatar and name, making the hero card look visually broken. This was caught by screenshotting the live site and zooming into the hero card.

**Fix already applied (direct edit):** Changed `top: 32` → `top: 195`.

This positions the pill at the stats row (847 Clients / 2.1k Posts / 4.9 Rating) height — mid-card rather than top — so it peeks from the left as a "floating proof point" alongside the social data, without obscuring the identity header.

Also tightened the entry animation: changed `initial={{ opacity: 0, x: -24, y: -8 }}` → `initial={{ opacity: 0, x: -20, y: 8 }}` to match the new position's natural reveal direction (coming slightly up from below-left instead of sliding in from left).

**Before:** Pill covered Jordan Morales' avatar and name
**After:** Pill floats at mid-card height, visible alongside stats row — identity header fully clear

---

## Fix 2 — HIGH: Hero headline blank for 3+ seconds on cold load

**File:** `app/components/hero.tsx`

**Problem:** The h1 "Addicted / to the / craft." headline uses `initial={{ y: "105%", opacity: 0 }}` with a parent div that has `overflow: "hidden"`. This is a classic "curtain reveal" — the text starts below the container's bottom edge and slides up into view. It looks great in Storybook / instant-hydration scenarios.

BUT on cold production load (measured at 3–4 seconds to React hydration), this creates a completely blank hero area. The overflow clip hides the text until the animation fires. Users see the nav, eyebrow label "THE BARBER COMMUNITY", then 300px+ of empty cream, then body copy and CTAs — for 3+ seconds before the headline appears. This is a first-impression failure.

The `loading.tsx` skeleton handles the pre-hydration state, but there's still a gap between skeleton teardown and animation start.

**Fix already applied (direct edit):**
1. Removed `overflow: "hidden"` from the wrapper div (no longer needed)
2. Changed `initial={{ y: "105%", opacity: 0 }}` → `initial={{ opacity: 0, y: 28 }}`
3. Adjusted `transition` delay: `delay: 0.08` → `delay: 0.05` (tighter start)
4. Duration unchanged: 0.75 → 0.7 (imperceptibly tighter)

The headline now uses a clean fade-up from `y: 28` (28px below final position). This:
- Starts rendering text immediately when React hydrates (no clip hiding it)
- Still produces a premium, intentional motion reveal
- Works gracefully even during slow hydration — a partially faded headline is far better than an invisible one

**Before:** Blank hero for 3+ seconds while `overflow: hidden` clips the headline
**After:** Headline fades in from y:28 — visible immediately, elegant motion, zero blank-space window

---

## Quality Gate

1. Verify `app/components/hero.tsx` has no TypeScript errors: `cd app && npx tsc --noEmit`
2. Build check: `cd app && npm run build`
3. Commit: `git add app/components/hero.tsx && git commit -m "fix: hero pill position + h1 fade-up animation — pill no longer covers Jordan Morales header"`
4. Deploy (if possible from this environment)
5. Write result to `lobe/outbox/hero-pill-animation-fix-2026-03-23d-result.md`

**What success looks like:**
- Hero profile card shows Jordan Morales' name and avatar clearly with no pill overlap
- "Board exam / Just passed." pill appears mid-card at the stats row height, floating left
- On cold load, headline appears immediately as a fade-up rather than snapping visible after a blank-space delay
- All existing hero animations (card float, active dot pulse, scroll cue) unchanged
