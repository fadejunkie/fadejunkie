<!-- execute -->
<!-- max-turns: 60 -->
<!-- model: opus -->

# Sign-In Page Brand Overhaul — Critical Conversion Fix

## Context

Automated QA audit on 2026-03-24 found the sign-in/signup page (`app/app/signin/page.tsx`) is critically off-brand. The landing page is award-caliber — warm cream, Spectral editorial type, grain texture, dark accents. The sign-in page is a pure white ShadCN boilerplate. When any user clicks "Join free" or "Log in" they land on a page that looks like a completely different product.

**This is the highest-traffic conversion moment in the entire funnel. It must feel like the same product.**

---

## What the current signin page looks like (BAD)

- `bg-background` = white (#ffffff) — wrong, should be warm cream `#fff4ea`
- `FadeJunkie` (capital F, capital J) — wrong capitalization, should be `fadejunkie`
- Plain ShadCN `<Card>` component with white background that floats on more white
- Generic `text-2xl font-bold` heading with no Spectral font
- Zero connection to the brand's visual identity
- The announcement bar still shows at the top, making the mismatch even more jarring

---

## What needs to be built

Redesign `app/app/signin/page.tsx` to feel like it belongs to the same product as `app/app/page.tsx` and `app/components/hero.tsx`.

### Layout

**Desktop (≥768px):** Two-column layout:
- **Left column (~45%):** Brand panel — warm cream bg with the grain overlay, the wordmark, a short tagline, and one of the editorial quotes from the brand
- **Right column (~55%):** Form panel — slightly warmer/darker cream (`rgba(22,16,8,0.03)`) with the auth form centered vertically

**Mobile:** Single column, stacked. Show just the form with the wordmark above it, no brand panel.

### Brand panel (left, desktop only)

```
[wordmark: fadejunkie — same style as nav logo]

[eyebrow: GEIST MONO UPPERCASE 0.625rem, color: hsl(34,42%,44%)]
THE BARBER COMMUNITY

[large Spectral headline, fontWeight 300, ~3.5rem]
"Every barber
remembers their
first clean fade."

[body Inter, 0.875rem, color: hsl(34,20%,38%)]
This is for that feeling.

[bottom of panel: stacked avatars + "2,400+ barbers already in" — copy from hero mobile proof strip]
```

Add the GrainOverlay SVG (copy from `components/hero.tsx`) to the brand panel.
Add the HalftoneAccent SVG (also from hero.tsx) in the bottom-right of the brand panel.

### Form panel (right)

The form itself should be clean and minimal. Remove the ShadCN `<Card>` wrapper. Instead, a bare form centered in the column.

Header:
```
[wordmark "fadejunkie" — lowercase, same font as nav, link back to "/"]
[subtitle: "The barber community" — Geist Mono, uppercase, 0.5rem]
```

Form tabs (Sign in / Sign up) — keep the existing tab logic but restyle:
- Use the brand's near-black for active tab indicator, not generic ShadCN blue
- Tab text: Inter, 0.875rem

Inputs:
- Warm cream bg `#fff4ea` or pure white — both work
- Border: `1px solid rgba(22,16,8,0.15)`
- Focus ring: `rgba(22,16,8,0.3)` — no blue focus ring
- Labels: Geist Mono, 0.5625rem, uppercase, tracking-wide, color: `hsl(34,22%,44%)`
- Font: Inter

Submit button:
- Same as `.fj-btn-primary` from the landing page: `backgroundColor: "hsl(0, 0%, 8%)"`, white text, no rounded pill — slightly rounded `0.625rem`

Below the form:
- `New to fadejunkie? Create account` / `Already have an account? Sign in` — Inter, 0.8125rem, olive link color `hsl(34,42%,44%)`

### Overall page styles

```
min-h-screen
backgroundColor: "#fff4ea"  ← not white
```

No more floating white-on-white Card. The form should feel like it lives in the warm space.

---

## Files to modify

1. **`app/app/signin/page.tsx`** — Full redesign as described above
2. Do NOT change any auth logic — only change the visual layer. Keep all `useAuthActions`, `signIn`, `router.push("/home")` etc exactly as-is.

---

## Verification

After making changes, do a visual check:
1. Navigate to `/signin` — should see the two-column brand layout on desktop
2. Navigate to `/signin?mode=signup` — should start on "Sign up" tab
3. Check that the background is cream `#fff4ea` not white
4. Check that "fadejunkie" wordmark is lowercase and links back to "/"
5. The form should submit normally (don't break auth)

Commit with message: `redesign signin page to match brand system`

---

## Priority

CRITICAL. This is the first page every new user sees after clicking "Join free". It must be on-brand.
