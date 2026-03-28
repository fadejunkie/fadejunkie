---
phase: 02-user-path-system
plan: 01
subsystem: database
tags: [convex, user-paths, multi-path, mutations, queries]

requires:
  - phase: 01-01
    provides: statusConfig.ts with UserPath type
provides:
  - userPaths table in Convex schema
  - selectPath, removePath, setPrimaryPath mutations
  - getMyPaths, getUserPaths queries
affects: [02-02-path-ui, 02-03-profile-fields, 03-toggle-ui]

tech-stack:
  added: []
  patterns: [multi-record path tracking with isPrimary flag, auto-promotion on removal]

key-files:
  created: [app/convex/userPaths.ts]
  modified: [app/convex/schema.ts]

key-decisions:
  - "Multi-path support via separate records (not array field) — enables indexing and querying by path"
  - "Auto-promote oldest path to primary when primary is removed"

patterns-established:
  - "User paths stored as separate records, not an array on the user — enables by_path index for discovery"
  - "First selected path is automatically primary"

duration: ~4min
completed: 2026-03-28T01:55:00Z
---

# Phase 2 Plan 01: User Path Data Model Summary

**userPaths table with multi-path support + 3 mutations + 2 queries deployed**

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
| AC-1: userPaths table exists | Pass | 4 fields, 3 indexes |
| AC-2: selectPath works | Pass | Validates path, checks duplicates, auto-primary for first |
| AC-3: setPrimaryPath works | Pass | Switches primary, demotes others |
| AC-4: Queries return correct data | Pass | Primary first, then by createdAt |

## Accomplishments

- userPaths table with by_userId, by_path, by_userId_path indexes
- selectPath: validates against USER_PATHS, first path auto-primary
- removePath: auto-promotes oldest remaining to primary
- setPrimaryPath: atomic switch
- getMyPaths + getUserPaths: primary-first sorting

## Files Created/Modified

| File | Change | Purpose |
|------|--------|---------|
| `app/convex/schema.ts` | Modified | Added userPaths table |
| `app/convex/userPaths.ts` | Created | Path management mutations + queries |

## Deviations from Plan

None.

## Next Phase Readiness

**Ready:**
- Path data layer complete — UI (02-02) can consume getMyPaths and selectPath

**Blockers:**
- None

---
*Phase: 02-user-path-system, Plan: 01*
*Completed: 2026-03-28*
