<!-- execute -->
<!-- max-turns: 60 -->

# Status Ecosystem — Final Visual Polish Pass

## What
Final visual polish pass across every page and component in the status ecosystem. Review for design consistency, spacing rhythm, mobile responsiveness, and overall cohesion. This is the last touch before shipping v0.1.

## Pages to Review (visit each, inspect, fix)

1. `/status` — status management page (PathSelector, StatusPanel, StatusToggleCards, StatusHistory)
2. `/discover` — discovery feed (path filter tabs, DiscoveryCard grid, MatchCard section)
3. `/barber/{any-slug}` — public barber profile with status badges (PublicStatusBadges integration)
4. `/shop/{any-userId}` — public shop website with status badges (ShopTemplate integration)
5. `/home` — community feed with PostStatusIndicator on post cards

## Components to Review

- `StatusToggleCard` — toggle switch, expiration countdown, refresh button
- `StatusPanel` — path group headers, toggle grid, empty states
- `ActiveStatusBadges` — inline badge rendering
- `StatusHistory` — archived status rows, timestamps, duration badges
- `PathSelector` — path selection cards, multi-path support
- `DiscoveryFeed` / `DiscoveryCard` — path filter tabs, status cards with user info
- `MatchCard` — complementary match display
- `PublicStatusBadges` — shared badge component (default and compact modes)
- `PostStatusIndicator` — feed post status indicator

## Design Consistency Checklist

- [ ] All heading styles use the same font family and weight hierarchy (font-heading for section headers, font-mono for labels/metadata)
- [ ] All status labels use `font-mono`, `text-[10px]` or `text-[11px]`, lowercase
- [ ] All timestamps use `font-mono`, `text-[10px]`, `text-muted-foreground/60`
- [ ] All badges use consistent border-radius (`rounded-full` for status pills)
- [ ] All Card components use the same border, shadow, and padding patterns
- [ ] Color tokens are consistent — `text-foreground`, `text-muted-foreground`, `bg-foreground/5` for badge backgrounds
- [ ] No hardcoded colors (hex/rgb) — all colors use CSS variables or Tailwind tokens
- [ ] Empty states follow the same pattern: centered, muted text, lowercase, single line

## Spacing & Rhythm Checklist

- [ ] Consistent vertical spacing between sections (`mt-8` or `mt-12` between major sections)
- [ ] Consistent gap in grids and flex layouts (`gap-3` or `gap-4`)
- [ ] Page padding is consistent with other (auth) pages (`px-6 py-8` or the established pattern)
- [ ] No cramped areas — everything breathes (design principle: "Space is a design element")

## Mobile Responsiveness Checklist (test at 320px, 375px, 768px)

- [ ] All pages render correctly at 320px width (smallest mobile)
- [ ] Toggle cards stack vertically on mobile, grid on desktop
- [ ] Discovery cards: single column on mobile, 2-col on md+
- [ ] Path filter tabs scroll horizontally on mobile without overflow issues
- [ ] Status badges wrap naturally on narrow screens
- [ ] No horizontal overflow on any page at any breakpoint
- [ ] Touch targets are at least 44px for interactive elements

## Loading & Empty States

- [ ] Every query-driven component handles the loading state (shows skeleton or nothing, not a flash of "no data")
- [ ] Every list/grid has an empty state message
- [ ] Empty states are helpful, not just blank space

## After Polish

- Take a browser screenshot of each page listed above (desktop and mobile widths)
- If any page has visual issues that cannot be fixed within the turn limit, document them in `lobe/outbox/status-polish-report.md`

## Constraints

- Do NOT introduce new design patterns — harmonize with what exists
- Do NOT add animations or transitions that do not already exist on the page
- Do NOT change the information architecture or layout structure — only polish spacing, fonts, colors, and responsive behavior
- Fix issues, do not redesign
