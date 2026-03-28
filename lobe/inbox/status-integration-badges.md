<!-- execute -->
<!-- max-turns: 60 -->

# Status Integration Badges

## What
Integrate active status badges across three public-facing surfaces: barber profile, shop website, and community feed. This makes the status system visible everywhere people already look.

## Shared Component: `PublicStatusBadges`

Create `app/components/PublicStatusBadges.tsx` — a reusable component that renders active status badges.

**Data shape** (from `api.statuses.getPublicStatusSummary`):
```ts
{
  path: string;
  pathLabel: string;
  statuses: Array<{ toggleKey: string; label: string; expiresAt: number }>;
}[]
```

**Two modes:**
- **Default mode:** Full display — path group headers + toggle label pills. Used on profile and shop pages.
- **Compact mode:** Single row of small pills (no path headers). Used in feed posts.

**Badge styling:**
- Each status = a small pill/badge: `text-[10px] font-mono` + subtle border
- B&W only — `border-foreground/20 text-foreground` for active, nothing fancy
- Labels are already humanized by the query (underscores replaced with spaces)
- Returns `null` if no statuses (component is invisible when empty)

## Integration 1: Barber Profile (`app/barber/[slug]/page.tsx`)

- This is a server component using `fetchQuery`
- After fetching barber data (which includes `userId`), also fetch `api.statuses.getPublicStatusSummary` with that userId
- Pass the status summary to a client `PublicStatusBadges` component
- **Placement:** below the barber name/bio in the hero section, above services
- Use default mode (full display with path headers)

## Integration 2: Shop Website (`app/shop/[userId]/page.tsx`)

- This is a server component using `fetchQuery`, `userId` comes from route params
- Fetch `api.statuses.getPublicStatusSummary` alongside existing shop data
- Pass status data through to `ShopTemplate` as a new prop (e.g., `statusSummary`)
- Inside ShopTemplate, render `PublicStatusBadges` in default mode
- **Placement:** in the shop header area, below shop name/tagline

## Integration 3: Feed Posts (`app/(auth)/home/page.tsx`)

- Feed posts come from `listFeedPosts` which includes `authorId` per post
- Add a small `PostStatusIndicator` client component that takes an `authorId` and calls `useQuery(api.statuses.getPublicStatusSummary, { userId: authorId })`
- Convex deduplicates queries for the same userId, so repeated authors don't cause extra calls
- Render `PublicStatusBadges` in compact mode — single row of small pills below the author name
- If no active statuses, render nothing (invisible)

## Design constraints
- Follow each page's existing patterns — don't break layouts
- B&W only — foreground/background/muted tokens
- Badges should feel informational, not promotional — small, subtle, mono font
- Mobile-first: badges should wrap naturally on small screens
- No new dependencies
- Do not restructure any existing page layouts — just add the status badges

## Reference files
- `app/barber/[slug]/page.tsx` — barber profile page
- `app/shop/[userId]/page.tsx` — shop website page
- `app/components/ShopTemplate.tsx` — shop template component
- `app/(auth)/home/page.tsx` — feed page
- `app/convex/statuses.ts` — `getPublicStatusSummary` query
