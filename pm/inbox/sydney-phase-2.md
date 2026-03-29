<!-- execute -->
<!-- dispatched-from: anthony -->

# Drive Sydney Spillman — Phase 2 (BUILD)

Evaluate Phase 2 progress for the Sydney Spillman project.

## Phase 2 Milestones
5. **05 — Domain Setup** → MANUAL (escalate)
6. **06 — Site Foundation** → Lobe
7. **07 — Core Pages** → Ink → Lobe (multi-agent chain → dispatch/inbox/)
8. **08 — Property Features** → Lobe (primary), Convex (support) [BLOCKER: client assets]
9. **09 — SEO Foundation** → SEO Engine → Lobe (multi-agent chain → dispatch/inbox/)

## Dependency Chain
04 (Phase 1) + 05 (MANUAL) → 06 → 07 → {08 [BLOCKER: assets], 09}

## Prerequisites
Phase 1 must be complete (milestones 01–04 all done). If not, report and stop.

## Instructions
1. Query Convex task state: `cd sydneyspillman && npx convex run --prod sydneyTasks:getTasks '{"projectId":"sydney-spillman"}'`
2. Verify Phase 1 completion first — if incomplete, report what's missing and stop
3. Read the task templates in `sydneyspillman/tasks/phase-2/`
4. Read the routing map in `dispatch/memory/routing-patterns.md`
5. For each milestone, check if all its task keys are complete
6. Find the first incomplete milestone whose dependencies are satisfied
7. Act:
   - If single-agent: copy template to that agent's inbox with `<!-- dispatched-from: pm -->` header
   - If multi-agent (07, 09): copy template to `dispatch/inbox/` with `<!-- dispatched-from: pm -->` header
   - If manual (05): write escalation to `dispatch/escalations/`
   - If blocked on assets (08): escalate with specific asset requirements
8. Write status report to `pm/outbox/`
9. Update `pm/memory/project-state.md` with current state
