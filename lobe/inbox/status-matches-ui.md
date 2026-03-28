<!-- execute -->
<!-- max-turns: 40 -->

# Status Matches UI

## What
Add a "Matches" tab to the existing discover page (`app/(auth)/discover/page.tsx`) that shows complementary status matches for the current user. This is the ecosystem payoff — directed discovery based on the user's own active statuses.

## Data source
`api.statuses.getComplementaryMatches` — no args, reads from authenticated user's context. Returns:
```ts
{
  myStatus: { path: string; toggleKey: string; _id: Id<"statuses"> };
  matches: Array<{
    _id: Id<"statuses">;
    userId: Id<"users">;
    path: string;
    toggleKey: string;
    activatedAt: number;
    expiresAt: number;
    barberName: string | null;
    barberSlug: string | null;
    barberAvatarUrl: string | null;
  }>;
}[]
```

## Page changes
- Add a tab bar at the top of the discover page with two tabs: "Browse" (existing DiscoveryFeed) and "Matches" (new). Default to "Browse". Local useState for tab switching.
- When "Matches" tab is active, render matches UI. When "Browse" is active, render the existing DiscoveryFeed.
- Tab bar: two text buttons, minimal. Active tab = primary text + bottom border. Inactive = muted text. Use font-mono, text-sm.

## Matches layout
For each match group, render a section:
- **Section header:** the user's own status as context — e.g. "because you're **seeking apprenticeship**" (humanize toggleKey: replace underscores with spaces, lowercase). Use font-mono, text-xs, muted.
- **Below header:** grid of match cards (reuse DiscoveryCard component if it exists, or build MatchCard with same visual language)

Match card contents:
- Avatar (32x32 circle, initials fallback) + barber name (or "Anonymous") + slug link to `/barber/{slug}` if available
- Toggle label (humanized toggleKey, font-mono, text-xs)
- "X days left" countdown + path badge
- Subtle complementary cue: small `Link2` icon from lucide-react, 14px, muted

## Empty states
- No active statuses: "activate some statuses to see matches" centered, with link to `/status`
- Active statuses but no matches: "no matches right now — check back as more people activate statuses" centered
- Loading: skeleton state consistent with existing patterns

## Design constraints
- Follow existing discover page patterns — same layout, heading styles, Card component
- B&W only — foreground/background/muted tokens
- Mobile-first: single column on mobile, 2-col grid on md+
- Mono font for status labels and countdown
- No new dependencies
- Do NOT create a new route — this is a tab on the existing discover page

## Reference files
- `app/(auth)/discover/page.tsx` — the page to modify
- `app/components/DiscoveryFeed.tsx` — existing feed component to wrap in tab
- `app/components/DiscoveryCard.tsx` — card pattern to reuse
- `app/convex/statuses.ts` — `getComplementaryMatches` query
