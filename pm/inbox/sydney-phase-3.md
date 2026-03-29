<!-- execute -->
<!-- dispatched-from: anthony -->

# Drive Sydney Spillman — Phase 3 (LAUNCH)

Evaluate Phase 3 progress for the Sydney Spillman project.

## Phase 3 Milestones
10. **10 — Quality Assurance** → Sentinel
11. **11 — Go Live** → MANUAL (escalate)
12. **12 — Analytics + Tracking** → MANUAL (escalate)
13. **13 — Client Handoff** → Ink

## Dependency Chain
07 + 08 + 09 (Phase 2) → 10 → 11 (MANUAL) → 12 (MANUAL) + 13

## Prerequisites
Phase 2 must be complete (milestones 05–09 all done). If not, report and stop.

## Instructions
1. Query Convex task state: `cd sydneyspillman && npx convex run --prod sydneyTasks:getTasks '{"projectId":"sydney-spillman"}'`
2. Verify Phase 2 completion first — if incomplete, report what's missing and stop
3. Read the task templates in `sydneyspillman/tasks/phase-3/`
4. Read the routing map in `dispatch/memory/routing-patterns.md`
5. For each milestone, check if all its task keys are complete
6. Find the first incomplete milestone whose dependencies are satisfied
7. Act:
   - If single-agent (10, 13): copy template to that agent's inbox with `<!-- dispatched-from: pm -->` header
   - If manual (11, 12): write escalation to `dispatch/escalations/`
8. Write status report to `pm/outbox/`
9. Update `pm/memory/project-state.md` with current state
