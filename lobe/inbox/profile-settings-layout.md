<!-- execute -->
<!-- max-turns: 60 -->

# Profile Page — Settings Layout Rebuild

## What
Rebuild the `/profile` page layout to follow a settings-style pattern: left sidebar nav + right content area with sectioned cards. Reference screenshot attached mentally — here's the exact spec:

## Layout Structure

**Overall:** Two-column layout with a vertical divider.

- **Left column** (~200px, fixed): vertical nav links stacked with generous spacing (~16px between items). Active item gets a subtle pill highlight (`bg-muted rounded-full px-4 py-2`). Items are text links in `font-body text-sm`. Bottom of the left column: a "Log out" link with a logout icon, pinned near the bottom.
- **Divider:** a subtle `border-r border-border` between left and right columns.
- **Right column** (flex-1): scrollable content area with `px-8 py-6` padding. Section heading at the top matching the active nav item.

**Mobile (< 768px):** Left nav collapses to a horizontal scrollable tab bar at the top. Content fills full width below.

## Left Nav Items
Map to sections in the right content area. When you click a nav item, it scrolls to that section (anchor links) or switches content:

1. **My Profile** — barber profile form (name, slug, bio, phone, instagram, booking URL, shop name, location, services, avatar)
2. **Paths** — the PathSelector component (already built)
3. **Status** — link to `/status` (not inline, just a nav link out)
4. **Discover** — link to `/discover` (nav link out)

## Right Content Area — Card Sections

Each section is a rounded card (`border border-border rounded-xl p-6 mb-6`) with:

- **Card header row:** section title (font-heading, text-lg, font-semibold, lowercase) on the left + "Edit" pill button on the right (`border border-border rounded-full px-4 py-1.5 text-xs font-mono` with a Pencil icon from lucide-react, 14px). The Edit button toggles the section between **view mode** and **edit mode**.
- **View mode (default):** fields displayed as a 2-column grid (`grid grid-cols-2 gap-x-12 gap-y-6`). Each field has:
  - Label: `text-xs font-mono text-muted-foreground uppercase tracking-wide`
  - Value: `text-sm font-body text-foreground mt-1` — bold for names, regular for other fields
  - Empty values show "—" in muted text
- **Edit mode:** same grid but fields become input fields (the existing form inputs). Save/Cancel buttons at the bottom of the card.

### "My Profile" card fields in view mode:

Row 1: `Name` | `Slug`
Row 2: `Phone` | `Instagram`
Row 3: `Booking URL` | `Shop Name`
Row 4: `Location` | `Bio` (bio spans full width if long)
Row 5: `Services` (full width, comma-separated pills)
Row 6: `Avatar` (small preview thumbnail, 48px circle)

### "Paths" section:
Render the existing `<PathSelector />` component as-is inside the card wrapper. No view/edit toggle needed — PathSelector already handles its own interaction.

### Active Status Badges
The `<ActiveStatusBadges />` component renders below the "My Profile" card header, above the field grid — same as current placement but inside the new card layout.

## Spacing
This is the key thing the user likes about the reference:
- **Between cards:** `mb-8` (32px)
- **Inside cards:** `p-6` (24px) with `gap-y-6` (24px) between field rows
- **Between label and value:** `mt-1` (4px)
- **Between nav items:** `space-y-2` (8px)
- **Page top padding:** `pt-8`
- **Section heading to first card:** `mb-6`

## Design constraints
- B&W only — foreground/background/muted/border tokens. No color.
- Font system: headings = font-heading (League Spartan, lowercase), labels = font-mono (Geist Mono), body = font-body (Courier Prime)
- Reuse existing form inputs/components — just restructure the layout
- Keep all existing Convex query/mutation logic — this is a layout change, not a data change
- The profile form already works — we're wrapping it in a better layout with view/edit toggle
- PathSelector and ActiveStatusBadges are imported as-is

## Reference files
- `app/(auth)/profile/page.tsx` — current profile page (rebuild this)
- `app/components/PathSelector.tsx` — render inside "Paths" card
- `app/components/ActiveStatusBadges.tsx` — render inside "My Profile" card
- `app/components/AppSidebar.tsx` — the existing app sidebar (this page has its OWN internal sidebar nav, separate from the app sidebar)
