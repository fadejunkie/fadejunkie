Audit complete. Here's the honest picture:

## 3 things that are broken right now (P0):

1. **No auth guard** — `(auth)/layout.tsx` has zero auth checks and no `middleware.ts` exists. Anyone can hit `/home`, `/profile`, `/tools/*` directly and see broken pages.

2. **Live tools are hidden** — The `/tools` hub page only shows two "Coming Soon" placeholders. The three tools that actually work (Exam Guide, Flashcards, Practice Test) have no links from the tools page. Users can only find them buried in the Resources tab.

3. **Subdomain routing is broken** — The website builder tells users their shop is live at `{slug}.fadejunkie.com`, but no middleware exists to route subdomain requests. The shop pages exist at `/shop/[userId]` but nothing connects them to subdomains.

## Beyond that: 5 incomplete features (P1), 6 UX gaps (P2), 8 tech debt items (P3)

Key P1s: no password reset, no delete for profiles/shops, shop builder missing logo upload and barber management.

Full prioritized list with files and rationale is at:
**`funkie/outbox/pending/codebase-audit.md`**

This is a plan-mode output — no code was changed. Ready to execute on any of these when you give the word.