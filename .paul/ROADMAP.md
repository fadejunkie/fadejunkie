# Roadmap: FadeJunkie

## Overview

FadeJunkie evolves from a working prototype with study tools, profiles, and a community feed into a full ecosystem platform. The flagship Status toggle system — 7 user paths, 30+ toggles, expiration-based matchmaking — is the next major build. After that: campaign tooling, workflow automation, and CI/CD maturity.

## Current Milestone

**v0.1 Status Ecosystem** (v0.1.0)
Status: In progress — Lobe executing final UI tasks
Phases: 4 of 5 complete, Phase 5 in progress

## Phases

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 1 | Status Schema & Backend | 3 | Complete | 2026-03-28 |
| 2 | User Path System | 3 | Complete | 2026-03-28 |
| 3 | Status Toggle UI | 3 | Complete | 2026-03-28 |
| 4 | Status Discovery & Matching | 3 | Complete | 2026-03-28 |
| 5 | Integration & Polish | 2 | In progress | - |

## Phase Details

### Phase 1: Status Schema & Backend

**Goal:** Define the Convex data model for statuses and build all backend mutations/queries — no UI yet
**Depends on:** Nothing (first phase)

**Plans:**
- [x] 01-01: Schema + toggle definitions
- [x] 01-02: Core mutations + queries
- [x] 01-03: Expiration engine (scheduled function + auto-archive)

### Phase 2: User Path System

**Goal:** Let users declare their path (barber, student, shop, school, vendor, coordinator, client) — controls which toggles they see
**Depends on:** Phase 1 (statuses table must exist)

**Plans:**
- [x] 02-01: User path data model + selection mutation
- [x] 02-02: Path selection UI flow
- [x] 02-03: Multi-path support + path-specific profile fields

### Phase 3: Status Toggle UI

**Goal:** Build the toggle interface — users can activate/deactivate statuses for their path with expiration countdown
**Depends on:** Phase 1 (backend), Phase 2 (user paths)

**Plans:**
- [x] 03-01: Toggle card component + per-path panel *(completed via Lobe task brief 02-03)*
- [x] 03-02: Active status badges on profile *(completed via Lobe task brief 02-03)*
- [x] 03-03: Status history + archive view

### Phase 4: Status Discovery & Matching

**Goal:** Users find each other through complementary statuses — the ecosystem payoff
**Depends on:** Phase 3 (toggles must be activatable)

**Plans:**
- [x] 04-01: Status discovery feed + filters
- [x] 04-02: Complementary matching engine
- [x] 04-03: Contact flow + notifications

### Phase 5: Integration & Polish

**Goal:** Connect status system to existing features, run full quality pipeline, ship
**Depends on:** Phase 4 (all status features built)

**Plans:**
- [x] 05-01: Status integration with profiles, websites, feed
- [ ] 05-02: Quality pipeline pass + ship (Lobe executing, then Anthony visual review)

---
*Roadmap created: 2026-03-28*
*Last updated: 2026-03-28 — Phases 1-4 complete, Phase 5 in progress*
