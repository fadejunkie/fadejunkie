# FadeJunkie — Project State

## Project Reference

See: .paul/PROJECT.md (updated 2026-06-03)

**Core value:** Cultural home for barbers — free education to enter the craft, tools to grow once in
**Current focus:** v1.0 Edu Hub Complete — free/paid separation, bulletproof Stripe, auth hardening

## Current Position

Milestone: v1.0 Edu Hub Complete
Phase: Not started — 0 of 4
Plan: None yet
Status: Ready to plan Phase 01 (free-paid-separation)
Last activity: 2026-06-03 — Strategy reset. Edu Hub first. Barber profile hidden from prod.

Progress:
- v1.0 Milestone: [░░░░░░░░░░] 0%
- Phase 01: [░░░░░░░░░░] 0%

## Loop Position

```
PLAN ──▶ APPLY ──▶ UNIFY
  ○        ○        ○     [Ready for first PLAN]
```

## Accumulated Context

### Decisions

| Decision | Rationale | Date |
|----------|-----------|------|
| Edu Hub is the only live feature | Barber profile is WIP — hidden from production until v2 planning is done | 2026-06-03 |
| Dual-role user model required | Student may become a barber — one account, two roles; DB must be designed for this now | 2026-06-03 |
| Free resources stay high quality | Free is the hook. Never water it down to push paid — credibility is the product | 2026-06-03 |
| Barber tiers need brainstorm before build | Pricing unresolved — no coding until tier strategy is defined | 2026-06-03 |
| Status Toggle System deprioritized | Backend complete (v0.1), UI deferred — will integrate into v2.0 Barbers community | 2026-03-28 |
| Multi-path via separate records (not array) | Enables by_path index on Convex | 2026-03-28 |

### Deferred Issues

| Issue | Origin | Effort | Revisit |
|-------|--------|--------|---------|
| Status Toggle UI polish (05-02) | v0.1 Phase 5 | M | v2.0 Barbers community layer |
| Loading transitions between exam sections | Edu Hub earlier work | S | Phase 04 polish |
| TDLR exam section order verification | Content accuracy | S | Phase 04 polish |
| CI/CD pipeline missing | Infrastructure | M | After core features ship |
| Google OAuth not surfaced in UI | Auth UX | S | Phase 03 auth hardening |

### Blockers

| Blocker | Impact | Resolution Path |
|---------|--------|-----------------|
| Barber profile routes reachable from production | Unfinished feature visible to real users | Block routes in Next.js middleware before next production deploy |

## Session Continuity

Last session: 2026-06-03
Stopped at: Strategy reset — PAUL files updated to reflect Edu Hub focus
Next action: `/paul:plan` for Phase 01 (free-paid-separation)
Resume file: `.paul/ROADMAP.md`

---
*STATE.md — Updated after every significant action*
