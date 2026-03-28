<!-- execute -->

# Add Development Banner

Add a slim sticky banner to the top of the landing page (`app/page.tsx`) that signals the site is being built in public.

## Copy (approved)

> We're building this live. Pull up a chair.

## Design

- Sticky top banner, sits above everything
- Background: warm near-black (`rgba(22,16,8,0.95)`) or jet black (`hsl(0 0% 8%)`)
- Text: cream (`#fff4ea`), Geist Mono, small/uppercase tracking
- Dismissible with an X button (persist dismiss in sessionStorage so it stays gone per visit)
- Should not wrap on mobile — single line
- No animation, no "under construction" energy — confident and inviting
