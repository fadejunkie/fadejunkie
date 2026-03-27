<!-- execute -->
<!-- max-turns: 60 -->

# Screenshot Audit — Designer Eye Pass

> Anthony took 8 screenshots of the live app. Below is a senior designer's analysis of every issue visible. Fix ALL of them. This is the highest-priority task.

## Screenshots analyzed (in `lobe/inbox/screenshot-*.png` for reference)

---

## CRITICAL: Color Violations (B&W rule = ZERO hue)

The design kit is pure B&W. **No blue, no green, no color anywhere.** These are violations:

1. **Profile page — "Upload photo" link is BLUE** (`text-blue-600` or similar)
   - File: `app/(auth)/profile/page.tsx`
   - Fix: Remove blue. Use `text-foreground underline underline-offset-4` — links are differentiated by underline, never color.

2. **Profile page — "@kaydenrocks is available" is GREEN** (`text-green-600`)
   - File: `app/(auth)/profile/page.tsx`
   - Fix: Use `text-muted-foreground` with a checkmark character (✓) prefix. No green.

3. **Website builder — green dot on "Your shop page is live"**
   - File: `app/(auth)/website/page.tsx`
   - Fix: Replace green dot with a solid black dot (`bg-foreground`) or a ● character in `text-foreground`.

---

## CRITICAL: Buttons Getting Lost

4. **Navbar "Sign in" button** — just text inside a faint outlined circle. Nearly invisible.
   - File: `components/shadcnblocks-com-navbar1.tsx`
   - Fix: This should be the outline variant — `border border-foreground` (solid black border, not faint gray). Text should be `text-foreground font-semibold`.

5. **Navbar "Log in" outlined button** — too faint, disappears next to the black pill.
   - Same file. The outline button needs `border-foreground` not `border-foreground/20`.

6. **Profile page "Add" button** (next to Services input) — looks like plain text, not a button at all.
   - File: `app/(auth)/profile/page.tsx`
   - Fix: Make it a proper `<Button variant="outline" size="sm">Add</Button>` with visible border.

7. **Website builder "Copy link" button** — faint outline, doesn't read as clickable.
   - File: `app/(auth)/website/page.tsx`
   - Fix: `<Button variant="outline">Copy link</Button>` with solid `border-foreground`.

8. **Website builder Edit/Preview toggle** — "Edit" is a black circle but "Preview" is unstyled text. Inconsistent.
   - File: `app/(auth)/website/page.tsx`
   - Fix: Both should be pill toggles. Active = `bg-foreground text-background`. Inactive = `bg-transparent text-foreground border border-foreground`.

---

## HIGH: Directory Page Is Unstyled

9. **Directory listing looks like raw HTML** — no cards, no spacing, no visual hierarchy.
   - File: `app/directory/page.tsx`
   - Issues:
     - School names are bold but listings have no card wrapper, no padding, no borders
     - "Directions · Website · Call" action links are tiny text with no button treatment
     - No vertical spacing between listings — everything bleeds together
     - Page heading "texas barber schools" + "151 schools across Texas" has no breathing room
   - Fix:
     - Wrap each listing in a `<Card className="p-6">` with `space-y-4` between cards
     - School name: `text-base font-semibold text-foreground`
     - Address: `text-sm text-muted-foreground` with pin icon
     - Actions (Directions, Website, Call): `<Button variant="outline" size="sm">` with proper icons — not just text links
     - Section heading: use `--section-gap-sm` above, subtitle in `text-muted-foreground font-body`
     - Add the search/filter bar spacing — currently cramped against the tab row

10. **Directory tabs (Schools/Shops/Supply)** — the active "Shops" tab has a jarring black fill that's fine but the inactive tabs need visible borders.
    - Fix: Active = `bg-foreground text-background`. Inactive = `bg-background text-foreground border border-foreground`.

---

## MEDIUM: Nav & Header Issues

11. **Nav links "Community · Tools · Directory"** — text is too light/muted. Lock icons are microscopic.
    - File: `components/AppHeader.tsx` or wherever the auth nav renders
    - Fix: Nav text should be `text-foreground` not muted. If items are locked (requires auth), show lock icon at `w-4 h-4` next to the label, in `text-muted-foreground`.

12. **Username display "@kaydenrocks"** — clean but cramped against the FJ logo.
    - File: `components/AppHeader.tsx` or `components/AppSidebar.tsx`
    - Fix: Add `gap-3` or `ml-4` spacing between logo and username.

---

## MEDIUM: Form Spacing

13. **Profile page form** — labels are cramped against inputs. No breathing room between field groups.
    - File: `app/(auth)/profile/page.tsx`
    - Fix: `space-y-5` between form groups (not `space-y-2`). Labels need `mb-1.5` below them. Group related fields (identity, contact, social) with subtle dividers or Card wrappers.

14. **Website builder form** — section headings ("shop identity", "about", "contact & hours") need more visual separation.
    - File: `app/(auth)/website/page.tsx`
    - Fix: These are already in Cards (good) but section headings inside cards should have `mb-4` below them, and card spacing should be `space-y-6` between cards.

---

## Design Kit Tokens (apply everywhere)

### Typography
- Headlines: League Spartan (`font-display`), lowercase, tight tracking
- Body: Courier Prime (`font-body`)
- UI/Nav: Geist (`font-sans`), weight 600 for buttons
- Tags/Labels: Geist Mono (`font-mono`)

### Buttons (THE SPEC — no exceptions)
- **Primary:** `bg-foreground text-background` + pill radius + Y-1px hover lift
- **Outline:** `bg-background text-foreground border border-foreground` + hover bg `accent`
- **Ghost:** `text-foreground opacity-70 hover:opacity-100`
- All: `font-sans font-semibold text-sm tracking-tight`

### Colors
- ZERO hue. Black and white only. Grayscale for muted.
- Links = underline, never blue/color.
- Status indicators = black/gray, never green/red (except destructive actions).

### Spacing
- Section gaps: `clamp(4rem, 7vw, 7rem)`
- Card padding: `p-6` minimum
- Form fields: `space-y-4` within groups, `space-y-6` between groups

---

## Execution Order

1. Color violations (items 1-3) — these break the design language
2. Button contrast (items 4-8) — users can't find CTAs
3. Directory page (items 9-10) — most visually broken page
4. Nav/header (items 11-12)
5. Form spacing (items 13-14)

Run `npm run build` in `app/` before committing. Zero errors allowed.
