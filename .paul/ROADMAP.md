# Roadmap: FadeJunkie

## Overview

FadeJunkie grows in three acts. First: become the go-to study platform for barber students — free resources + a bulletproof paid membership (Edu Hub, v1.0). Second: give licensed barbers a cultural home and their first SaaS tool — profiles, community, and a website generator (Barbers, v2.0). Third: open the platform to industry advertisers and affiliates once both features have traction (Dream, v3.0).

---

## 🚧 Current Milestone: v1.0 Edu Hub Complete

**Theme:** Free + paid tier separation with bulletproof subscription, auth hardening, DB solidified
**Phases:** 0 of 4 complete

| Phase | Name | Plans | Status | Completed |
|-------|------|-------|--------|-----------|
| 01 | free-paid-separation | TBD | Not started | — |
| 02 | stripe-subscription | TBD | Not started | — |
| 03 | auth-db-hardening | TBD | Not started | — |
| 04 | edu-hub-polish | TBD | Not started | — |

### Phase 01: Free/Paid Separation

**Goal:** Clean, quality-preserving split between free and premium content. Free stays genuinely valuable — not watered down. Paid has real premium offerings that justify the subscription.

**Depends on:** Nothing (first phase)
**Research:** Unlikely (internal patterns)

**Scope:**
- Audit existing content — what's free, what becomes premium
- Access control on premium routes (Clerk gate)
- Premium content defined, stubbed, or created
- Free content integrity maintained

### Phase 02: Stripe Subscription

**Goal:** Bulletproof paid membership — creates, renews, cancels, and fails cleanly with no edge case leaks.

**Depends on:** Phase 01 (access control must exist before payment gates it)
**Research:** Unlikely (Stripe + Convex integration is known territory)

**Scope:**
- Stripe subscription product + price objects
- Webhook handling: created, renewed, cancelled, failed, past_due
- Convex user record updates on all subscription state changes
- Trial → paid conversion flow
- Failed payment handling (graceful downgrade, not hard lock)

### Phase 03: Auth + DB Hardening

**Goal:** User data is retained and recalled reliably across all auth flows. Dual-role schema (student ↔ barber) is ready for v2.

**Depends on:** Phase 02 (subscription state must survive auth edge cases)
**Research:** Likely (dual-role user model needs design before implementation)

**Scope:**
- DB architecture review — what user data is retained and how
- Clerk ↔ Convex user sync bulletproof across all auth events
- Dual-role user model schema ready: student + barber on one account (even if barber isn't live)
- Session persistence edge cases handled

### Phase 04: Edu Hub Polish

**Goal:** Edu Hub is launch-ready — complete, polished, ready to drive paid subscriptions.

**Depends on:** Phase 03
**Research:** Unlikely

**Scope:**
- Content completeness audit
- Mobile polish pass
- Loading transitions between exam sections (deferred from earlier)
- TDLR exam section order verified against official sequence
- Full UX review — feels like a finished product

---

## 📋 Planned Milestone: v2.0 Barbers

**Theme:** Barber profiles, community (Partners page), website generator SaaS
**Prerequisite:** v1.0 complete

**Pre-build requirement:** Tier strategy session — define what each barber plan includes and what it costs before any coding begins.

| Phase | Focus | Research |
|-------|-------|----------|
| 1 | Barber profile DB schema + model | Unlikely |
| 2 | Profile pages + Partners community page | Unlikely |
| 3 | Website generator — tiers, architecture, pricing | Likely |
| 4 | Stripe integration for barber tiers | Unlikely |
| 5 | Cross-reference user model (student ↔ barber) | Likely |

---

## 💭 Dream Milestone: v3.0 Affiliates

**Theme:** Affiliate and advertising section for barber industry brands
**Prerequisite:** v1.0 + v2.0 complete, meaningful user base established

Phases: TBD when v2.0 ships and platform has traction.

---

## ✅ Completed Milestone: v0.1 Status Ecosystem

<details>
<summary>v0.1 Status Ecosystem — Phases 1-4 complete, Phase 5 deferred (2026-03-28)</summary>

Built the Status Toggle System backend and matching UI. Feature is complete in terms of backend and core UI — deprioritized in favor of Edu Hub focus. Will be integrated into v2.0 Barbers community layer.

### Phase 1: Status Schema & Backend — Complete
- Schema + toggle definitions
- Core mutations + queries
- Expiration engine (hourly cron + auto-archive)

### Phase 2: User Path System — Complete
- User path data model + selection mutation
- Path selection UI flow
- Multi-path support + path-specific profile fields

### Phase 3: Status Toggle UI — Complete
- Toggle card component + per-path panel
- Active status badges on profile
- Status history + archive view

### Phase 4: Status Discovery & Matching — Complete
- Status discovery feed + filters
- Complementary matching engine (15 pairs, bidirectional)
- Contact flow + notifications

### Phase 5: Integration & Polish — Deferred
- 05-01: Status integration with profiles, websites, feed ✓
- 05-02: Quality pipeline pass + ship — deferred; barber profile UI deprioritized

</details>

---
*Roadmap created: 2026-03-28*
*Restructured: 2026-06-03 — Pivoted from Status Ecosystem to Edu Hub first*
