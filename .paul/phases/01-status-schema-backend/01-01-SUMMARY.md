---
phase: 01-status-schema-backend
plan: 01
subsystem: database
tags: [convex, schema, status-toggles, typescript]

requires:
  - phase: none
    provides: first plan
provides:
  - statuses table in Convex schema
  - typed toggle definitions config (statusConfig.ts)
  - UserPath, ToggleKey, StatusToggleConfig types
affects: [01-02-mutations, 01-03-expiration, 02-user-paths, 03-toggle-ui]

tech-stack:
  added: []
  patterns: [as-const-satisfies for typed configs, shared server/client config files]

key-files:
  created: [app/convex/statusConfig.ts]
  modified: [app/convex/schema.ts]

key-decisions:
  - "No decisions needed — straightforward schema execution"

patterns-established:
  - "Status config lives in convex/statusConfig.ts — importable from both server and client"
  - "Toggle definitions use as const satisfies for literal union types"

duration: ~8min
completed: 2026-03-28T01:45:00Z
---

# Phase 1 Plan 01: Schema + Toggle Definitions Summary

**Convex `statuses` table with 4 indexes + typed toggle config covering 7 user paths and 30 toggles**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~8min |
| Completed | 2026-03-28 |
| Tasks | 2 completed |
| Files modified | 2 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Statuses table exists | Pass | 8 fields, 4 indexes, deployed to dev |
| AC-2: Toggle config encodes all 7 paths | Pass | 30 toggles, all days match spec |
| AC-3: TypeScript types exported | Pass | UserPath, ToggleKey, StatusToggleConfig + bonus ToggleKeyForPath |

## Accomplishments

- `statuses` table added to Convex schema with userId, path, toggleKey, isActive, activatedAt, expiresAt, archivedAt, refreshCount
- Typed toggle config with `as const satisfies` pattern — 7 paths, 30 toggles, all expiration rules from original JSON spec
- Bonus: `ToggleKeyForPath<P>` generic type for path-scoped toggle key unions

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `app/convex/schema.ts` | Modified | Added statuses table before CC tables block |
| `app/convex/statusConfig.ts` | Created | Typed toggle definitions, helpers, types |

## Decisions Made

None — followed plan as specified.

## Deviations from Plan

None — plan executed exactly as written.

## Next Phase Readiness

**Ready:**
- Schema deployed and compilable
- Config importable from mutations (Plan 01-02)
- Types available for downstream use

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 01-status-schema-backend, Plan: 01*
*Completed: 2026-03-28*
