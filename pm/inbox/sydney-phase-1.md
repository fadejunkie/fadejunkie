<!-- execute -->
<!-- dispatched-from: anthony -->

# Drive Sydney Spillman — Phase 1 (BRAND)

Evaluate Phase 1 progress for the Sydney Spillman project.

## Phase 1 Milestones
1. **01 — Discovery Session** → Ink (primary), SEO Engine + Funkie (support)
2. **02 — Mood + Direction** → Ink
3. **03 — Logo Design** → MANUAL (escalate)
4. **04 — Brand System** → Ink (primary), Lobe (support)

## Dependency Chain
01 → 02 → [BLOCKER: client approval] → 03 (MANUAL) → 04

## Instructions
1. Query Convex task state: `cd sydneyspillman && npx convex run --prod sydneyTasks:getTasks '{"projectId":"sydney-spillman"}'`
2. Read the task templates in `sydneyspillman/tasks/phase-1/`
3. Read the routing map in `dispatch/memory/routing-patterns.md`
4. For each milestone, check if all its task keys are complete
5. Find the first incomplete milestone whose dependencies are satisfied
6. Act:
   - If single-agent: copy template to that agent's inbox with `<!-- dispatched-from: pm -->` header
   - If manual: write escalation to `dispatch/escalations/`
   - If blocked: report what's blocking and what Anthony needs to do
7. Write status report to `pm/outbox/`
8. Update `pm/memory/project-state.md` with current state
