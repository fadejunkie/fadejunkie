# hub-master — Outstanding TODOs

## Phase 3 — Rewire Frontends

Point all 6 client frontends to hub-master (`warmhearted-cormorant-536`).

For each client in `~/fadejunkie/{slug}/`:
- [ ] Update `.env.local` → `VITE_CONVEX_URL=https://warmhearted-cormorant-536.convex.cloud`
- [ ] Update Convex function imports (e.g. `arqueroTasks:getTasks` → `tasks:getTasks`)
- [ ] Add `clientSlug` arg to all `useQuery` / `useMutation` calls
- [ ] Test locally, redeploy to Vercel

Clients: `arquero`, `sydney`, `wizardry`, `wcorwin`, `chuco`, `allison-bond`

## Phase 4 — Delete Old Convex Projects

After Phase 3 verified, delete to get under free plan limit:
- [ ] `wcorwin-hub` / `kindred-scorpion-550` (SEO hub)
- [ ] `sydney-spillman` / `unique-crab-445`
- [ ] `wizardry-ink` / `chatty-chameleon-322`
- [ ] `allison-bond` / `fastidious-bee-903`
- [ ] `chuco` dev deployment
- [ ] Confirm project count drops to ~5-6

Note: `warmhearted-marlin-167` (arquero hub) stays — it holds `arqueroDeliverables` and ecomm-separate data.
