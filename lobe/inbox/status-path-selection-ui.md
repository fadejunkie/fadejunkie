<!-- execute -->
<!-- max-turns: 60 -->

# Build: Path Selection UI

## Context
The status toggle system backend is complete. Users need a UI to select their path(s) before they can activate status toggles.

**Backend ready (already deployed to Convex dev):**
- `convex/userPaths.ts` — selectPath, removePath, setPrimaryPath mutations + getMyPaths, getUserPaths queries
- `convex/statusConfig.ts` — USER_PATHS array with 7 paths: barber, student, shop, school, vendor, event_coordinator, client

## What to Build

### 1. Path Selection Component (`components/PathSelector.tsx`)
A card-based selector showing all 7 user paths. Each path card has:
- Path name (human-readable: "Barber", "Student", "Shop Owner", "School", "Vendor", "Event Coordinator", "Client")
- Brief description of what that path is for
- Toggle/checkbox to select it
- Primary indicator (star or badge) if it's the user's primary path

**Behavior:**
- On first visit (no paths): show all 7 as unselected. Selecting the first one auto-sets it as primary.
- With paths: show selected paths highlighted, unselected paths available
- Click to add/remove paths
- Click star/primary indicator to change primary path
- Uses `useMutation(api.userPaths.selectPath)`, `useMutation(api.userPaths.removePath)`, `useMutation(api.userPaths.setPrimaryPath)`
- Uses `useQuery(api.userPaths.getMyPaths)` for current state

### 2. Path Selection Page or Modal
This can be:
- A dedicated page at `app/(auth)/path-setup/page.tsx` for first-time users
- Or a section within the existing profile page at `app/(auth)/profile/page.tsx`

**Recommended:** Add it as a section at the top of the profile page, collapsible after initial setup. New users should see it prominently. Existing users can expand it to change paths.

### 3. Path Gate
If a user has no paths selected, show the path selector prominently on the home page or as an interstitial before they can access status features (Phase 3).

## Design System
Follow the B&W Typewriter design system:
- League Spartan for path name headers
- Courier Prime for descriptions
- `border-2 border-foreground` for card borders
- Pure B&W oklch, no color hue
- Warm cream bg (`#fff4ea`)

## Files to Reference
- `app/convex/userPaths.ts` — the mutations/queries you'll call
- `app/convex/statusConfig.ts` — USER_PATHS array and UserPath type
- `app/(auth)/profile/page.tsx` — where path selector might live
- `components/` — existing component patterns

## Acceptance Criteria
- [ ] User can see all 7 paths with clear labels and descriptions
- [ ] User can select/deselect paths
- [ ] First selected path is automatically primary (indicated visually)
- [ ] User can change primary path
- [ ] Component follows B&W Typewriter design system
- [ ] Responsive (works on mobile — barbers use phones between clients)
