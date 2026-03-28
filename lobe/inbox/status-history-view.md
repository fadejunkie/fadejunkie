<!-- execute -->
<!-- max-turns: 30 -->

# Status History View

## What
Add a "Status History" section to the /status page (`app/(auth)/status/page.tsx`), rendered below the existing `StatusPanel` component.

## New component
`app/components/StatusHistory.tsx`

## Data source
`api.statuses.getMyArchivedStatuses` query — returns archived statuses enriched with defaultDays/maxDays, sorted by archivedAt desc.

## UI spec

- **Section header:** "history" in the same heading style as StatusPanel path headers (font-heading, text-base, font-semibold)
- **Group archived statuses by `path` field.** Use the same path label humanization pattern from StatusPanel (barber, student, shop, etc.)
- **Within each path group**, render each archived status as a compact row:
  - Toggle label (humanize the toggleKey: replace underscores with spaces)
  - "archived" timestamp showing relative time (e.g., "3 days ago") or date if older than 7 days
  - Duration badge: how long it was active (archivedAt - activatedAt), displayed as "Xd" or "Xh"
- **Styling:** muted/subdued compared to active toggles. Use `text-muted-foreground` for labels, `text-muted-foreground/60` for timestamps. No toggle switches — this is read-only.
- **Empty state:** if no archived statuses, show a single line: "no history yet" in muted text, same pattern as the "no paths selected" empty state in StatusPanel
- **Mono font** for timestamps and duration badges (font-mono, text-[10px])

## Integration
Import and render `<StatusHistory />` in `app/(auth)/status/page.tsx` below the existing `<StatusPanel />`. Wrap in a `<div className="mt-12">` for spacing.

## Design constraints
- Follow existing StatusPanel patterns exactly — same Card usage, same font families, same color tokens
- B&W only — no color. Use foreground/background/muted tokens
- No new dependencies
- Mobile-first: single column, compact rows

## Reference files
- `app/components/StatusPanel.tsx` — match patterns
- `app/components/StatusToggleCard.tsx` — match card styling
- `app/convex/statuses.ts` — `getMyArchivedStatuses` query
- `app/convex/statusConfig.ts` — toggle config for path labels
