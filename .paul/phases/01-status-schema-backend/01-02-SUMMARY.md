---
phase: 01-status-schema-backend
plan: 02
subsystem: api
tags: [convex, mutations, queries, status-toggles, auth]

requires:
  - phase: 01-01
    provides: statuses table schema, statusConfig.ts types
provides:
  - activateStatus, deactivateStatus, refreshStatus mutations
  - getMyStatuses, getActiveByPath, getActiveStatusesForUser queries
affects: [01-03-expiration, 03-toggle-ui, 04-discovery]

tech-stack:
  added: []
  patterns: [ConvexError for user-facing errors, config enrichment in queries]

key-files:
  created: [app/convex/statuses.ts]
  modified: []

key-decisions:
  - "getMyStatuses enriches results with toggle config (defaultDays, maxDays) for UI convenience"
  - "getActiveByPath filters expired statuses at query time rather than mutating — cron handles actual archival"

patterns-established:
  - "Status mutations validate path + toggleKey against statusConfig before operating"
  - "Public queries (getActiveByPath, getActiveStatusesForUser) filter expired but don't mutate"

duration: ~5min
completed: 2026-03-28T01:50:00Z
---

# Phase 1 Plan 02: Core Mutations + Queries Summary

**3 authenticated mutations (activate/deactivate/refresh) + 3 queries (my statuses, by path, by user) with config enrichment**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~5min |
| Completed | 2026-03-28 |
| Tasks | 2 completed |
| Files modified | 1 (created) |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Activate status | Pass | Validates path/toggleKey, checks duplicates, calculates expiresAt |
| AC-2: Deactivate status | Pass | Sets isActive=false, archivedAt=now, ownership check |
| AC-3: Refresh status | Pass | Recalculates expiresAt, respects max_days, increments refreshCount |
| AC-4: Queries return correct data | Pass | getMyStatuses enriched, getActiveByPath filters expired |

## Accomplishments

- 3 mutations: activateStatus, deactivateStatus, refreshStatus — all with auth + ownership validation
- 3 queries: getMyStatuses (enriched with config), getActiveByPath (public, filters expired), getActiveStatusesForUser (public profile view)
- ConvexError pattern for user-facing error messages
- Zero schema changes — builds entirely on 01-01 foundation

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `app/convex/statuses.ts` | Created | All status mutations and queries |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Enrich getMyStatuses with config | UI needs defaultDays/maxDays for display without separate config fetch | Slightly larger query response, simpler client code |
| Filter expired in queries, don't mutate | Cron (01-03) handles actual archival; queries just hide expired | Clean separation of read vs write |

## Deviations from Plan

None — plan executed exactly as written.

## Next Phase Readiness

**Ready:**
- All CRUD operations for statuses are live
- Queries power both authenticated (my statuses) and public (discovery) views

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 01-status-schema-backend, Plan: 02*
*Completed: 2026-03-28*
