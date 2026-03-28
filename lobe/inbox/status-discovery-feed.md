<!-- execute -->
<!-- max-turns: 40 -->

# Status Discovery Feed

## What
Build a status discovery feed at `app/(auth)/discover/page.tsx` — a new route where users browse active statuses from other users in the ecosystem.

## New files
- `app/(auth)/discover/page.tsx` — the page (server component with metadata)
- `app/components/DiscoveryFeed.tsx` — the feed component (client)
- `app/components/DiscoveryCard.tsx` — individual status card

## Data sources
- `api.statuses.getDiscoveryPaths` — returns `{ path, label, count }[]` for the filter tabs. Sorted by count desc. Paths with 0 active statuses excluded.
- `api.statuses.discoverStatuses` — returns active statuses from other users, enriched with barber info and toggle config. Args: `{ path: string, toggleKey?: string }`. Each result has: `toggleKey`, `path`, `activatedAt`, `expiresAt`, `barberName`, `barberSlug`, `barberAvatarUrl`, `defaultDays`, `maxDays`.

## Page layout
- Page title: "discover" in the same heading style as other auth pages (font-heading, lowercase, editorial weight)
- Subtitle: "see who's active in the ecosystem" in Courier Prime / muted text
- Below title: horizontal scrollable path filter tabs built from `getDiscoveryPaths` data. Each tab shows path label + count badge. First tab selected by default (highest count). Clicking a tab calls `discoverStatuses` with that path.
- Below tabs: a grid of DiscoveryCard components

## DiscoveryCard spec
- Card component with subtle border, consistent with existing Card patterns
- Top row: barber avatar (32x32 circle, fallback to initials if no avatar) + barber name (or "Anonymous" if no barber profile) + barber slug as subtle link to `/barber/{slug}` (if slug exists)
- Middle: toggle label (humanize toggleKey — replace underscores with spaces, lowercase). Use font-mono, text-xs styling.
- Bottom row: "X days left" countdown (compute from expiresAt - Date.now(), show "< 1 day" if under 24h) + the path label as a subtle pill/badge
- Hover: subtle elevation or border change, nothing dramatic

## Empty states
- If getDiscoveryPaths returns empty: "no active statuses in the ecosystem yet" centered message
- If a selected path has no results: "no active {path label} statuses right now" centered message

## Nav integration
Add "Discover" to both `AppSidebar` and `MobileNav` navItems arrays. Place after "Home" in the nav order. Use the `Compass` icon from lucide-react.

## Design constraints
- Follow existing (auth) page patterns exactly — same layout wrapper, same heading styles, same Card from shadcn/ui
- B&W only — no color. Use foreground/background/muted tokens
- Mobile-first: single column on mobile, 2-col grid on md+
- Mono font for countdown and toggle labels (font-mono)
- Muted color scheme — discovery is browsing, not action. Reserve strong styling for the active filter tab only.
- No new dependencies

## Technical notes
- Use `useQuery` from "convex/react" for both queries
- The path filter state is local (useState) — default to the first path returned by getDiscoveryPaths
- When path changes, the discoverStatuses query reactively updates (Convex handles this)
- No need for manual pagination yet — result sets are scoped per path

## Reference files
- `app/components/StatusPanel.tsx` — match patterns for card usage and styling
- `app/components/StatusToggleCard.tsx` — match card patterns
- `app/(auth)/status/page.tsx` — match page layout patterns
- `app/convex/statuses.ts` — query signatures
