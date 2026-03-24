<!-- execute -->
<!-- max-turns: 40 -->
<!-- model: opus -->

# Homepage Apple-Polish Pass — 2026-03-24

## Context

Automated visual QA pass on 2026-03-24. The landing page at `fadejunkie.vercel.app` is close to award-level. This task fixes the remaining gaps that prevent it from reaching that bar.

---

## Fix 1 — Hero headline font weight: CRITICAL

**File:** `app/components/hero.tsx`

**Problem:** The hero h1 uses `fontWeight: 300`. On non-retina displays and during FOUT (Flash of Unstyled Text), Spectral 300 is nearly invisible against `#fff4ea`. Screenshots show "Addicted / to the / craft." as ghost text.

**Fix:** Change the hero h1 `fontWeight` from `300` to `400`. Keep `fontStyle: "italic"` on the "to the" span, keep all other styles. Only change the `fontWeight` value.

Also increase the "to the" secondary line contrast:
- Current: `color: "hsl(34, 22%, 44%)"` — too faint against cream
- Fix: `color: "hsl(34, 32%, 36%)"` — same warm olive, 8 points darker lightness

**Expected result:** Hero headline is immediately legible on all displays.

---

## Fix 2 — Footer social links: remove dead "#" URLs

**File:** `app/app/page.tsx` — the Footer2 component at the bottom

**Problem:** Instagram and Twitter links are `url: "#"`. Clicking them goes nowhere, which looks unfinished and embarrassing.

**Fix:** Change both to external placeholder links that at least open in a real direction, OR remove them entirely. Since real social profiles may not be set up yet, change them to:
```tsx
{ text: "Instagram", url: "https://instagram.com/fadejunkie" },
{ text: "Twitter", url: "https://twitter.com/fadejunkie" },
```
Add `target="_blank"` and `rel="noopener noreferrer"` if the Footer2 component supports it — check the component signature. If it doesn't, just update the URLs.

---

## Fix 3 — Privacy Policy and Terms of Service pages

**Problem:** Footer links `Privacy Policy` and `Terms of Service` go to `#`. Clicking them goes nowhere. This is a trust signal failure — Apple-level products always have real legal pages.

**Fix:** Create two minimal stub pages:

**`app/app/privacy/page.tsx`** — A simple page with:
- Same branded layout (cream bg, StickyNav, Footer)
- Heading: "Privacy Policy"
- Subheading in Geist Mono: "LAST UPDATED MARCH 2026"
- Body: Brief placeholder — "FadeJunkie collects only the information necessary to operate the service. We do not sell your data. Full policy coming soon — contact hello@fadejunkie.com with any questions."
- Keep the brand styling: cream bg, Spectral heading, Inter body

**`app/app/terms/page.tsx`** — Same structure:
- Heading: "Terms of Service"
- Body: "By using FadeJunkie, you agree to use the service responsibly. Full terms coming soon — contact hello@fadejunkie.com with any questions."

Then update `app/app/page.tsx` Footer2's bottomLinks to point to these:
```tsx
bottomLinks={[
  { text: "Privacy Policy", url: "/privacy" },
  { text: "Terms of Service", url: "/terms" },
]}
```

---

## Fix 4 — Nav auth-gate visual cues

**File:** `app/components/shadcnblocks-com-navbar1.tsx`

**Problem:** "Community" and "Tools" nav links take the user to `/signin?mode=signup` with no warning. Users click them expecting to see pages and get a form instead. This creates friction and confusion.

**Fix:** In the nav menu, for items whose URL contains `signin`, add a subtle lock icon indicator. After the menu item text, add a small lock icon (from lucide-react: `Lock`, size 10, opacity 0.45) that signals "login required." This is an Apple pattern — they never silently redirect without a signal.

Example in the rendered nav:
```
Community 🔒   (tiny lock at 10px, muted)
Tools 🔒
Directory        (no lock — public)
```

Implementation: In the Navbar1 component, check if `item.url.includes('signin')` and if so, render `<Lock size={10} style={{ opacity: 0.45, marginLeft: '0.25rem', display: 'inline', verticalAlign: 'middle' }} />` after the item title.

---

## Fix 5 — Announcement bar: replace bullet with brand dot

**File:** Find where the announcement bar is rendered (likely in the layout or a banner component).

**Problem:** The bar shows "• SHOP WEBSITES JUST LAUNCHED — BUILD YOURS FREE →" — the bullet `•` looks like an HTML list artifact or emoji.

**Fix:** Replace the `•` bullet with a proper pulsing dot element using the same `fj-pulse` animation from `hero.tsx`:
```html
<span class="announce-dot"></span>
```
```css
.announce-dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: hsl(34, 42%, 55%);
  animation: fj-pulse 2.2s ease-in-out infinite;
  flex-shrink: 0;
}
```

This makes the announcement bar feel alive and intentional, not like a markdown list.

Find the announcement bar component — check `app/app/layout.tsx` or search for "SHOP WEBSITES" in the codebase.

---

## Verification

After all fixes:
1. Check hero headline is visibly dark on cream background
2. Check footer Instagram/Twitter links open (don't 404)
3. Navigate to `/privacy` — should render a branded page
4. Navigate to `/terms` — should render a branded page
5. Check nav links show tiny lock on "Community" and "Tools"
6. Check announcement bar has a styled dot, not a plain `•`

Commit with message: `apple polish pass — hero contrast, footer links, legal pages, nav ux`
