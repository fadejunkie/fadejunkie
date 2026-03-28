<!-- execute -->
<!-- max-turns: 60 -->

# Build: Status Toggle UI

## Context
The full status backend is deployed:
- `convex/statuses.ts` — activateStatus, deactivateStatus, refreshStatus mutations + getMyStatuses, getActiveByPath queries
- `convex/statusConfig.ts` — STATUS_TOGGLES with all 7 paths and 30 toggles
- `convex/userPaths.ts` — getMyPaths to know which toggles to show
- Cron job auto-archives expired statuses hourly

## What to Build

### 1. Status Toggle Card Component (`components/StatusToggleCard.tsx`)
Individual toggle card for each status option. Shows:
- Toggle name (human-readable: "Seeking Employment" not "seeking_employment")
- On/off toggle switch
- When active: expiration countdown (e.g., "Expires in 12 days")
- When active: refresh button to reset the timer
- Status indicator dot (green=active, gray=inactive)

**Behavior:**
- Toggle ON → calls `activateStatus({ path, toggleKey })`
- Toggle OFF → calls `deactivateStatus({ statusId })`
- Refresh → calls `refreshStatus({ statusId })`
- Display expiration as relative time ("12 days left", "3 hours left", "Expires today")

### 2. Status Panel (`components/StatusPanel.tsx`)
Panel showing all toggles for the user's selected paths:
- Groups toggles by path (if user has multiple paths)
- Path header with path name
- Grid of StatusToggleCards for that path's toggles
- Active toggles sorted first

**Data flow:**
- `useQuery(api.userPaths.getMyPaths)` → get user's paths
- For each path: get toggles from `STATUS_TOGGLES[path]`
- `useQuery(api.statuses.getMyStatuses)` → get active/archived statuses
- Merge: show all toggles with active state overlaid

### 3. Status Page (`app/(auth)/status/page.tsx`)
New authenticated page for the status system:
- Add to sidebar navigation
- Shows StatusPanel as main content
- Empty state if no paths selected → link to path selector

### 4. Active Status Badges on Profile
On the barber profile (`app/(auth)/profile/page.tsx`), show active statuses as small badges/tags below the user's info.

## Design System
Follow the B&W Typewriter design system:
- League Spartan for section headers
- Courier Prime for toggle labels and descriptions
- Geist Mono for countdown timers and status labels
- `border-2 border-foreground` for card borders
- Toggle switch: B&W, no color (active = filled black, inactive = outline)
- Active indicator: solid black dot, not green (B&W system)

## Human-Readable Toggle Labels
Map snake_case keys to display labels:
- seeking_employment → "Seeking Employment"
- now_accepting_clients → "Now Accepting Clients"
- need_a_cut_today → "Need a Cut Today"
- etc. (capitalize each word, replace underscores with spaces)

## Files to Reference
- `app/convex/statuses.ts` — mutations and queries
- `app/convex/statusConfig.ts` — STATUS_TOGGLES, getTogglesForPath
- `app/convex/userPaths.ts` — getMyPaths
- `app/(auth)/layout.tsx` — sidebar for nav item
- `app/(auth)/profile/page.tsx` — for status badges

## Acceptance Criteria
- [ ] Toggle cards show on/off state with expiration countdown
- [ ] User can activate/deactivate toggles
- [ ] User can refresh active toggles
- [ ] Toggles grouped by path for multi-path users
- [ ] Status page accessible from sidebar navigation
- [ ] Active statuses shown as badges on profile
- [ ] Empty state when no paths selected
- [ ] Follows B&W Typewriter design system
- [ ] Responsive for mobile
