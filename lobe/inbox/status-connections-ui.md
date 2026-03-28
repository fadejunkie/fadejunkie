<!-- execute -->
<!-- max-turns: 60 -->

# Status Connections UI

## What
Add a "Connect" interaction to discovery/match cards and build a connections inbox on the status page. This closes the ecosystem loop — users can now act on what they discover.

## Part 1: Connect Button on Cards

Add a "Connect" button to `DiscoveryCard` and any match card components on the discover page.

- **Placement:** bottom-right of each card, small and secondary-styled (ghost button, not dominant)
- **Label:** "Connect" with `UserPlus` icon from lucide-react, 14px
- **On click:** open a Sheet (bottom sheet on mobile) with:
  - Context line: "Connecting about **{toggle label}**" (humanize toggleKey — replace underscores with spaces)
  - Target user's name and path badge
  - Textarea for optional note (placeholder: "Add a short note...", max 280 chars, show character count)
  - "Send" button (primary) and "Cancel" button (ghost)
- **On send:** call `api.statuses.connectOnStatus` with `{ statusId, note }`
- **Success:** close sheet, brief inline confirmation ("Connection sent")
- **Errors:**
  - "Already sent a connection request for this status" → show inline, disable Send
  - "Status is no longer active" → show inline error

## Part 2: Connections Inbox

Add a connections inbox accessible from the `/status` page.

- **Trigger:** a "Connections" section below StatusHistory on the status page, or a collapsible section with inbox icon in the header
- **Badge:** unseen count (connections where `status === "pending"`) as a small dot or number next to "Connections" label
- **Data source:** `api.statuses.getMyConnectionRequests`
- **Each connection card shows:**
  - Sender avatar (32px circle, initials fallback) + name (linked to `/barber/{slug}` if slug exists)
  - Status context: "interested in your **{toggle label}**" (humanize toggleKey)
  - Note (if provided) — styled as a subtle quote block, font-body, text-sm
  - Timestamp (relative: "2h ago", "3 days ago") in font-mono text-[10px]
  - Pending = subtle left border accent or dot indicator. Seen = muted/no indicator.
- **Mark as seen:** call `api.statuses.markConnectionSeen` with connectionId. Can be automatic on render or via "Mark as seen" button — choose whatever feels natural.
- **Empty state:** "no connections yet — activate statuses and get discovered" with link to status toggles section

## Design constraints
- Follow existing status page and discover page patterns exactly
- Use shadcn Sheet component for the connect modal (bottom sheet on mobile)
- B&W only — foreground/background/muted tokens
- Mobile-first: sheet from bottom preferred
- Mono font for status labels and timestamps
- Connections inbox should feel lightweight — signal system, not messaging app
- No new routes — connect button on discover page, inbox on status page
- No new dependencies

## Technical notes
- `useQuery(api.statuses.getMyConnectionRequests)` for inbox data
- `useMutation(api.statuses.connectOnStatus)` for sending
- `useMutation(api.statuses.markConnectionSeen)` for marking seen
- The `statusId` is available as `_id` on every discovery/match card result
- Unseen count: `connections.filter(c => c.status === "pending").length`

## Reference files
- `app/components/DiscoveryCard.tsx` — add Connect button
- `app/components/DiscoveryFeed.tsx` — feed context
- `app/components/MatchesFeed.tsx` — matches context
- `app/(auth)/status/page.tsx` — add connections inbox
- `app/convex/statuses.ts` — connection mutations/queries
