# Special Flows

Skills integrated into the PAUL build workflow for FadeJunkie.

## Build Pipeline Skills

### impeccable:polish
**When:** After Lobe builds a feature
**Purpose:** Catch micro-inconsistencies — spacing drift, padding mismatches, border weight errors, alignment issues
**Owner:** Lobe (self-review pass)

### impeccable:clarify
**When:** After Lobe builds UI + Ink writes copy
**Purpose:** Audit UX microcopy — button labels, placeholder text, error messages, empty state CTAs, form hints. Flag brand voice misalignment (FJ is punk/direct, not corporate).
**Owner:** Lobe + Ink handoff

### impeccable:audit
**When:** Pre-ship gate (before Sentinel clears for deploy)
**Purpose:** Comprehensive UI audit — accessibility (WCAG AA), responsive design, color contrast, performance, theming, interactive states
**Owner:** Sentinel triggers, Lobe fixes

### impeccable:normalize
**When:** Quarterly or before major feature lock
**Purpose:** Design system debt cleanup — ensure all components use system tokens, consolidate drifted patterns
**Owner:** Lobe (maintenance)

### impeccable:harden
**When:** Per new feature build
**Purpose:** Verify all UI states exist — loading, success, error, empty, disabled. Error boundaries, fallback text, skeleton loaders.
**Owner:** Lobe (per-feature check)

## Project Commands

### browser-test
**When:** After any frontend change ships
**Purpose:** Playwright visual QA — login, screenshot, visual verification
**Owner:** Sentinel or manual

### debug-log
**When:** After any non-obvious debugging win
**Purpose:** Extract fix pattern → append to persistent memory (`lobe-debugging.md`)
**Owner:** Any agent or Anthony

### Chrome (claude-in-chrome)
**When:** Live browser verification, form testing, real-user-flow walkthroughs, probing external services (Google Search Console, Analytics, GBP)
**Purpose:** Direct browser automation — navigate, click, fill forms, read page content, screenshot, record GIFs. Real Chrome instance, not headless.
**Owner:** Anthony or any agent needing live browser interaction

## Pipeline Flow

```
Lobe builds feature
  → impeccable:polish (micro-consistency)
  → impeccable:harden (all states exist)
  → Ink reviews copy
  → impeccable:clarify (UX copy audit)
  → impeccable:audit (full QA pass)
  → Sentinel build gate
  → browser-test (visual verify)
  → chrome (live browser walkthrough if needed)
  → Ship or fix loop
```

## Agent Creation Policy

**PAUL can create new agents on demand.** When a phase requires capabilities that no existing agent covers, build the agent following the standard pattern:

- Directory: `<agent-name>/` with `inbox/`, `outbox/`, `outbox/pending/`, `memory/`
- Agent script: `<agent-name>.ts` following existing agent patterns
- CLAUDE.md: Agent-specific instructions
- Register in dispatch trust levels
- Add to CLAUDE.md agent roster

New agents are permanent — once created, they join the arsenal for future use.

---
*Created: 2026-03-28*
