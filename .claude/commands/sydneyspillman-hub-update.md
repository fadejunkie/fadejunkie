Update the Sydney Spillman project hub or sydneyspillman.anthonytatis.com.

Triggers on: update sydneyspillman, update sydney hub, sydney spillman tracker update, mark sydney task, sydney status change, sydney progress update.

## What This Does

Updates the Sydney Spillman & Associates project hub — a standalone Vite + React + Convex app at `sydneyspillman/`.

## Steps

1. **Read the current state** — Check `sydneyspillman/src/SydneyHub.tsx` for current phases, tasks, and content
2. **Apply the requested changes** — Could be:
   - Marking tasks complete via Convex mutation
   - Adding/editing task labels in the phases data
   - Updating scope, agreement text, or website mockup content
   - Adjusting colors, layout, or design elements
3. **Build & verify** — Run `cd sydneyspillman && npm run build` to confirm no errors
4. **Deploy if requested** — `npm run build && npx vercel build --prod && npx vercel deploy --prebuilt --prod`

## Key Files

- `sydneyspillman/src/SydneyHub.tsx` — Monolithic hub (all UI)
- `sydneyspillman/src/App.tsx` — Hostname routing
- `sydneyspillman/convex/sydneyTasks.ts` — Backend functions
- `sydneyspillman/convex/schema.ts` — Database schema
- `sydneyspillman/CLAUDE.md` — Project-specific instructions

## Convex Commands

```bash
# Mark a task via Convex (from sydneyspillman/ dir)
npx convex run sydneyTasks:setTask '{"projectId":"sydney-spillman","key":"1-DISCOVERY SESSION-0","value":true}' --prod

# Clear test signature
npx convex run sydneyTasks:clearAgreement '{"projectId":"sydney-spillman"}' --prod
```

## Design Notes

- **White & blue** color scheme — professional, light default with dark toggle
- **Fonts:** Playfair Display (headers) + Inter (body)
- **No payment/Stripe** — pro bono engagement, simplified agreement
- **Real estate mockup** — Home, About, Listings, Testimonials, Contact
