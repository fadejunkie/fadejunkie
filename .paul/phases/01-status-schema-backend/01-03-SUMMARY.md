---
phase: 01-status-schema-backend
plan: 03
subsystem: infra
tags: [convex, cron, expiration, internal-mutation]

requires:
  - phase: 01-02
    provides: statuses.ts with mutations/queries, by_expiresAt index
provides:
  - expireStatuses internal mutation
  - Hourly cron job for automatic status archival
affects: [all-phases — statuses auto-expire without manual intervention]

tech-stack:
  added: [convex cron jobs]
  patterns: [internal mutations for system operations, cron-based data hygiene]

key-files:
  created: [app/convex/crons.ts]
  modified: [app/convex/statuses.ts]

key-decisions:
  - "Hourly cron interval — balances freshness vs resource usage for 1-90 day lifespans"

patterns-established:
  - "Cron jobs live in convex/crons.ts"
  - "System operations use internalMutation (not exposed to clients)"

duration: ~4min
completed: 2026-03-28T01:52:00Z
---

# Phase 1 Plan 03: Expiration Engine Summary

**Hourly cron job + internalMutation that auto-archives expired statuses**

## Performance

| Metric | Value |
|--------|-------|
| Duration | ~4min |
| Completed | 2026-03-28 |
| Tasks | 2 completed |
| Files modified | 2 |

## Acceptance Criteria Results

| Criterion | Status | Notes |
|-----------|--------|-------|
| AC-1: Expired statuses auto-archived | Pass | internalMutation finds expired + active, patches to archived |
| AC-2: Cron runs hourly | Pass | Registered via cronJobs().interval with { hours: 1 } |
| AC-3: Batch processing | Pass | .collect() processes all expired statuses in single run |

## Accomplishments

- expireStatuses internalMutation — queries by_expiresAt, filters active + expired, batch archives
- crons.ts created with hourly schedule
- Internal mutation NOT exposed to client API (verified)

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `app/convex/statuses.ts` | Modified | Added expireStatuses internalMutation |
| `app/convex/crons.ts` | Created | Hourly cron schedule |

## Decisions Made

| Decision | Rationale | Impact |
|----------|-----------|--------|
| Hourly interval | 1-day min lifespan means hourly is sufficient; 5-min would be wasteful | Statuses expire within 1 hour of their expiresAt |

## Deviations from Plan

None.

## Next Phase Readiness

**Ready:**
- Phase 1 COMPLETE — all backend infrastructure for status system is live
- Schema, config, mutations, queries, and expiration engine all deployed

**Concerns:**
- None

**Blockers:**
- None

---
*Phase: 01-status-schema-backend, Plan: 03*
*Completed: 2026-03-28*
