# Roadmap: FadeJunkie

## Overview

FadeJunkie evolves from a working prototype with study tools, profiles, and a community feed into a full ecosystem platform. The flagship Status toggle system — 7 user paths, 30+ toggles, expiration-based matchmaking — is the next major build. After that: campaign tooling, workflow automation, and CI/CD maturity.

## Current Milestone

**v0.1 Status Ecosystem** (v0.1.0)
Status: In progress
Phases: 1 of 5 complete

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Status Schema & Backend | 3 | Complete | 2026-03-28 |
| 2 | User Path System | 3 | In progress | - |
| 3 | Status Toggle UI | 3 | Not started | - |
| 4 | Status Discovery & Matching | 3 | Not started | - |
| 5 | Integration & Polish | 2 | Not started | - |

## Phase Details

### Phase 1: Status Schema & Backend

**Goal:** Define the Convex data model for statuses and build all backend mutations/queries — no UI yet
**Depends on:** Nothing (first phase)
**Research:** Unlikely (Convex patterns established)

**Scope:**
- `statuses` table in Convex schema
- Toggle definitions config (all 7 paths, 30+ toggles, expiration rules)
- Core mutations: activate, deactivate, refresh status
- Core queries: getMyStatuses, getActiveByPath
- Scheduled function for expiration + auto-archive

**Plans:**
- [x] 01-01: Schema + toggle definitions
- [x] 01-02: Core mutations + queries
- [x] 01-03: Expiration engine (scheduled function + auto-archive)

### Phase 2: User Path System

**Goal:** Let users declare their path (barber, student, shop, school, vendor, coordinator, client) — controls which toggles they see
**Depends on:** Phase 1 (statuses table must exist)
**Research:** Unlikely (profile patterns established)

**Scope:**
- `userPath` field on user profiles
- Path selection flow (new users + existing users)
- Path-specific profile fields
- Multi-path support (a barber who also owns a shop)

**Plans:**
- [x] 02-01: User path data model + selection mutation
- [ ] 02-02: Path selection UI flow
- [ ] 02-03: Multi-path support + path-specific profile fields

### Phase 3: Status Toggle UI

**Goal:** Build the toggle interface — users can activate/deactivate statuses for their path with expiration countdown
**Depends on:** Phase 1 (backend), Phase 2 (user paths)
**Research:** Unlikely (component patterns established)

**Scope:**
- Toggle card component (on/off, expiration timer, refresh button)
- Per-path toggle panel (shows only your path's toggles)
- Active status badges on profile
- Status history/archive view

**Plans:**
- [ ] 03-01: Toggle card component + per-path panel
- [ ] 03-02: Active status badges on profile + public profile
- [ ] 03-03: Status history + archive view

### Phase 4: Status Discovery & Matching

**Goal:** Users find each other through complementary statuses — the ecosystem payoff
**Depends on:** Phase 3 (toggles must be activatable)
**Research:** Likely (matching algorithm design, query performance)
**Research topics:** Complementary status pairs, feed ranking, notification triggers

**Scope:**
- Status discovery feed (browse active statuses by type)
- Filter by path, toggle type, location
- Complementary matching (student seeking apprenticeship ↔ shop seeking apprentice)
- Contact/connect flow from status cards

**Plans:**
- [ ] 04-01: Status discovery feed + filters
- [ ] 04-02: Complementary matching engine
- [ ] 04-03: Contact flow + notifications

### Phase 5: Integration & Polish

**Goal:** Connect status system to existing features, run full quality pipeline, ship
**Depends on:** Phase 4 (all status features built)
**Research:** Unlikely (integration patterns)

**Scope:**
- Status badges on shop websites ({slug}.fadejunkie.com)
- Status in community feed posts
- Full impeccable skills pass (polish, audit, harden, clarify)
- Browser QA + responsive verification

**Plans:**
- [ ] 05-01: Status integration with profiles, websites, feed
- [ ] 05-02: Quality pipeline pass + ship

---
*Roadmap created: 2026-03-28*
*Last updated: 2026-03-28*
