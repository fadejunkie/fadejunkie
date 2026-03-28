<!-- execute -->
<!-- max-turns: 60 -->

# Status Ecosystem — Visual Polish Pass

## What
Review and harmonize all status ecosystem pages and components for design consistency, spacing, mobile responsiveness, and loading/empty states. This is a polish pass, not a redesign — the goal is cohesion.

## Pages to review (all at localhost:3100)
1. `/status` — status toggles, history, connections inbox
2. `/discover` — browse tab, matches tab, discovery cards
3. `/profile` — path selector, active status badges
4. `/barber/[slug]` — public profile with status badges
5. `/shop/[userId]` — public shop with status badges

## Components to review
- `PathSelector.tsx` — path cards, collapsible, star primary
- `StatusToggleCard.tsx` — toggle switch, expiration, refresh
- `StatusPanel.tsx` — grouped toggle panel, path headers
- `StatusHistory.tsx` — archived statuses, compact rows
- `ActiveStatusBadges.tsx` — profile badge row
- `DiscoveryFeed.tsx` — feed with filter tabs
- `DiscoveryCard.tsx` — user avatar, toggle label, countdown
- `DiscoverTabs.tsx` — browse/matches tab bar
- `MatchesFeed.tsx` — match groups with context headers
- `PublicStatusBadges.tsx` — status badges on public pages (if it exists)

## Checklists

### Design consistency
- [ ] All headings use font-heading (League Spartan), lowercase, tight tracking
- [ ] All body text uses font-body (Courier Prime)
- [ ] All labels/tags/counts use font-mono (Geist Mono)
- [ ] Color palette is strictly B&W — no stray colors. Only foreground/background/muted/border tokens
- [ ] Card components use consistent border, padding, and hover patterns
- [ ] Buttons follow the same size/weight/style across all status pages

### Spacing and rhythm
- [ ] Consistent vertical spacing between sections (mt-8 or mt-12 between major sections)
- [ ] Card grids use consistent gap values
- [ ] No cramped or overly loose areas
- [ ] Section headers have consistent margin-bottom

### Mobile responsiveness (test at 320px, 375px, 768px)
- [ ] All grids collapse to single column on mobile
- [ ] No horizontal overflow or scroll on any page
- [ ] Touch targets are at least 44px
- [ ] Text is readable without zooming
- [ ] Filter tabs scroll horizontally on mobile without breaking layout
- [ ] Sheets/modals render correctly on small screens

### Loading and empty states
- [ ] Every query-dependent component shows a loading state (skeleton or spinner text)
- [ ] Every list/feed has an empty state message
- [ ] Loading states match the final content layout (no layout shift)

## What to fix
- Any inconsistency found in the checklists above
- Harmonize any component that looks like it was built in a different session
- Fix any spacing that feels off
- Ensure empty states are helpful, not just blank

## Constraints
- B&W Typewriter design system — do not introduce color
- Harmonize, do not redesign — keep existing layouts, just polish
- No new dependencies
- No changes to backend/Convex files
- Mobile-first approach for all fixes
