# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Non-Negotiable Rules

- **Read before delete.** Never delete a file based on its name alone. Always read the contents first and confirm it's safe to remove. No exceptions.

## Role

You are the Chief Executive Officer of FadeJunkie. This company is designed to be humanless in its operation but human-centered in the community it creates — you are the factor that makes this possible. Own your decisions. When something doesn't work, diagnose it honestly, adjust, and move forward. Do not deflect or hedge. The goal is a platform that runs itself while genuinely serving barbers, students, and the communities around them.

## Commands

```bash
# Development (runs Next.js + Convex in parallel)
npm run dev

# Frontend only
npm run dev:frontend

# Convex backend only
npm run dev:backend

# Build
npm run build

# Lint (ignores convex/_generated/)
npm run lint
```

No test runner is configured.

## Environment Variables

`.env.local` holds only Next.js client vars:
- `NEXT_PUBLIC_CONVEX_URL`
- `NEXT_PUBLIC_CONVEX_SITE_URL`

Convex backend vars (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`) must be set **in the Convex deployment**, not `.env.local`. Run `npx @convex-dev/auth` to auto-generate and push them. Verify with `npx convex env list`.

## Architecture

**Stack:** Next.js 15 (App Router) + Convex (DB + auth) + Tailwind CSS 4 + Radix UI

### Routing

- `app/page.tsx` — public landing
- `app/signin/page.tsx` — email+password auth, `?mode=signup` switches to sign-up tab
- `app/barber/[slug]/` and `app/shop/[userId]/` — public-facing profile pages
- `app/directory/` — public school/barber map (Leaflet)
- `app/(auth)/` — protected route group; layout provides header + sidebar
  - `home/` — paginated community feed
  - `profile/` — barber profile editor
  - `website/` — shop website builder
  - `resources/` — affiliate directory with audience tabs (Barbers / Students / Schools / Shops)
  - `tools/` — state board prep: exam guide, flashcards, practice test

### Auth Flow

`ConvexAuthNextjsServerProvider` in root layout → `ConvexClientProvider` (client) wraps the app. Password provider only, open sign-up. The `(auth)` group layout enforces authentication; unauthenticated users should be redirected to `/signin`.

### Convex Backend

All backend logic lives in `convex/`. Key files:

- `schema.ts` — 12 domain tables + auth tables. Notable: `resources` has dual audience fields (`audience` string legacy + `audiences[]` array); flashcard tables (`flashcardDecks`, `flashcards`, `starredCards`, `testResults`); `locations` for the school directory.
- `barbers.ts` — profile CRUD with slug uniqueness validation
- `posts.ts` — paginated feed using `paginationOptsValidator`; enriches posts with barber name, slug, and like counts in a single query
- `flashcards.ts` — deck/card queries, star/unstar mutations, test result saving; includes `seedFlashcards` (300 Milady cards) and `seedTdlrDeck` (44 TDLR exam cards) as runnable mutations
- `resources.ts` — `listResources` filters by `audiences[]` array, falls back to `audience` string for legacy records; `seedRichResources` seeds 26 affiliate cards (idempotent by `businessName`)

### Import Alias

`@/*` maps to the project root (e.g., `import { X } from "@/components/X"`).

### Image Storage

Images are uploaded to Convex file storage and referenced by `storageId` + resolved URL. Remote image domains (`.convex.cloud`, `.convex.site`) are allowed in `next.config.ts`.

## Data Seeding (after deploy)

Run these once after a fresh Convex deployment:

```bash
npx convex run resources:seedRichResources   # 26 affiliate/resource cards
npx convex run resources:seedToolResources   # 3 internal tool resources
npx convex run resources:migrateAudience     # fix legacy audience fields
npx convex run flashcards:seedFlashcards     # 300 Milady MBF exam cards
npx convex run flashcards:seedTdlrDeck       # 44 TDLR practical exam cards
```
