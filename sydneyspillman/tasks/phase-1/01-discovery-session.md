<!-- execute -->
<!-- client: sydneyspillman -->
<!-- max-turns: 40 -->
<!-- dispatched-from: sydney-phase-1 -->
<!-- chain-next: 02-mood-direction -->

# Discovery Session — Sydney Spillman & Associates

**Primary agent:** Ink
**Support:** SEO Engine (competitor audit), Funkie (positioning)

## Context

Sydney Spillman is launching a real estate brand in San Antonio, TX. This is the first milestone — we need to define the brand foundation before any visual work begins. Sydney is Anthony's wife; this is a pro bono engagement.

Read `sydneyspillman/context/sydney-project.md` for full project context.

## Deliverables

### 1. Client Intake Document
Write to `sydneyspillman/content/01-client-intake.md`:
- Brand story and values (professional warmth, community-focused, approachable)
- Target audience profile (home buyers/sellers in San Antonio, first-time buyers, military relocations)
- Service offerings summary
- Unique value proposition

### 2. Brand Positioning Statement
Write to `sydneyspillman/content/01-brand-positioning.md`:
- Where Sydney Spillman sits in the SA real estate market
- Differentiation from top SA agents (avoid generic "full-service" positioning)
- Tone definition: professional warmth with approachable, community-focused energy
- Anti-references: no corporate coldness, no generic template energy

### 3. Competitor Audit
Write to `sydneyspillman/content/01-competitor-audit.md`:
- Audit 5 comparable San Antonio real estate agents/teams
- For each: website quality, brand positioning, social presence, SEO visibility
- Gaps and opportunities for Sydney Spillman to differentiate

## Convex Task Keys (mark completed on finish)
- `1-DISCOVERY SESSION-0` — Client intake
- `1-DISCOVERY SESSION-1` — Brand positioning
- `1-DISCOVERY SESSION-2` — Tone identification
- `1-DISCOVERY SESSION-3` — Competitor audit

## Completion
Write all 3 deliverables to `sydneyspillman/content/`. Mark all 4 Convex task keys complete via:
```
npx convex run --prod sydneyTasks:setTask '{"projectId":"sydney-spillman","key":"1-DISCOVERY SESSION-0","value":true}'
```
(Repeat for keys 1-3)
