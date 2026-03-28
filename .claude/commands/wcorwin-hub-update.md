---
description: "Update the WCORWIN tracker, project hub, or wcorwin.anthonytatis.com. Triggers on: update wcorwin, update wcorwin hub, update wcorwin project hub, update wcorwin.anthonytatis.com, wcorwin tracker update, mark wcorwin task, wcorwin status change."
---

# /wcorwin-hub-update — WCORWIN Tracker Hub Update

Update the WCORWIN SEO tracker: change task statuses, store docs, sync, and verify — all against **production Convex**.

## Context

- **Client tracker:** wcorwin.anthonytatis.com (Cloudflare Pages, real-time Convex)
- **Convex project:** `wcorwin-seo` | Prod: `kindred-scorpion-550` | Dev: `necessary-horse-18`
- **Source:** `seo-engine/WCORWIN/`
- **Client context:** `seo-engine/context/clients/wcorwin.md`

## Critical: Always use `--prod`

```bash
npx convex run --prod wcorwinTasks:<function> '<args>'
```

**NEVER** use `CONVEX_DEPLOYMENT` env var — it silently falls back to dev. Always pass `--prod` flag.

## Available Convex Mutations

All mutations run from `seo-engine/WCORWIN/`:

```bash
# Change task status (done | active | pending)
npx convex run --prod wcorwinTasks:setStatus '{"projectId":"wcorwin","taskKey":"<phase>:<index>","status":"<status>"}'

# Update task name or detail text
npx convex run --prod wcorwinTasks:setText '{"projectId":"wcorwin","taskKey":"<phase>:<index>","name":"...","detail":"..."}'

# Store a doc panel (markdown string — shows as expandable detail on tracker)
npx convex run --prod wcorwinTasks:setDoc '{"projectId":"wcorwin","taskKey":"<phase>:<index>","doc":"..."}'

# Query current state
npx convex run --prod wcorwinTasks:getOverrides '{"projectId":"wcorwin"}'
```

**Task key format:** `<phaseId>:<0-indexed-task-number>`
- Phases: `kickoff`, `month1`, `month2`, `month3`, `ongoing`
- Example: `month1:3` = 4th task in Month 1

## Task Map (current)

### Kickoff (0-6)
0. SEO audit delivered
1. Contract signed & returned
2. Invoice paid — $950 received
3. GSC ownership verified
4. GBP account access granted
5. iHouseWeb admin access
6. Kickoff strategy call

### Month 1 (0-6)
0. Rewrite all title tags
1. Write unique meta descriptions
2. Implement LocalBusiness schema
3. Verify & submit XML sitemap
4. Optimize Google Business Profile
5. Baseline keyword tracking setup
6. Client sign-off on foundation

### Month 2 (0-5)
0. Canyon Lake neighborhood guide
1. Gruene, TX neighborhood guide
2. Buyer Rebate Program page
3. VA / Military Homebuyer page
4. Homepage content expansion
5. First keyword movement report

### Month 3 (0-5)
0. Chamber of Commerce listing
1. Military directory submissions
2. FAQ schema implementation
3. Market Report 2026 published
4. First-Time Homebuyer Guide
5. 90-day performance review

### Ongoing (0-4)
0. 2 content pieces per month
1. Monthly rank tracking report
2. GBP management
3. 1 technical SEO task/month
4. Monthly performance summary

## Workflow

### 1. Parse the Update
Read the user's input (`$ARGUMENTS`). Determine which tasks to update and what changes to make (status change, doc storage, text edit). If unclear, ask.

### 2. Query Current State
```bash
cd seo-engine/WCORWIN && npx convex run --prod wcorwinTasks:getOverrides '{"projectId":"wcorwin"}'
```
Show the user the current overrides before making changes.

### 3. Apply Mutations (PROD)
Run all needed mutations against prod. Always run from `seo-engine/WCORWIN/`.

**Also mirror to dev** for local development parity:
```bash
npx convex run wcorwinTasks:<same-mutation> '<same-args>'
```

### 4. Verify Prod State
```bash
cd seo-engine/WCORWIN && npx convex run --prod wcorwinTasks:getOverrides '{"projectId":"wcorwin"}'
```
Confirm the mutations landed correctly.

### 5. Update Client Context (if relevant)
If the update involves new baseline data, access changes, or milestone completions, update `seo-engine/context/clients/wcorwin.md` with the new information.

### 6. Sync Local State
```bash
cd seo-engine/WCORWIN && npm run sync
```
Updates `.sync-state.json` for offline reference.

### 7. Screenshot & Verify
The tracker is real-time (Convex subscriptions) — no rebuild needed for data changes. Take a screenshot to confirm:

```bash
node browser-agent/agent.mjs screenshot https://wcorwin.anthonytatis.com
```

Read the screenshot and visually verify:
- Overall progress numbers updated
- Phase tab counts correct
- Task statuses match expected state
- Doc panels expandable (if docs were added)

**If the screenshot shows stale data**, hard-check the Convex URL in the deployed bundle matches prod (`kindred-scorpion-550`). If mismatched, rebuild and redeploy:
```bash
cd seo-engine/WCORWIN && VITE_CONVEX_URL=https://kindred-scorpion-550.convex.cloud npm run build && \
CLOUDFLARE_API_KEY=<cf_global_api from app/.env.local> CLOUDFLARE_EMAIL=Tatis.anthony@gmail.com \
CLOUDFLARE_ACCOUNT_ID=06aa597b27f95eb93c1172407b75dcda \
npx wrangler pages deploy dist/ --project-name wcorwin-seo-tracker --branch main --commit-dirty=true
```

### 8. Report
Summarize: what changed, current phase progress, link to live tracker.

## Examples

**Mark a task done:**
> /wcorwin-hub-update mark month1:2 (LocalBusiness schema) as done

**Store a doc panel:**
> /wcorwin-hub-update store doc on month1:5 with GSC baseline: 246 clicks, 25.6K impressions, 1% CTR

**Batch update:**
> /wcorwin-hub-update month2:0 done, month2:1 active, store doc on month2:0 with "Published 3/28, 850 words, 4 internal links"

$ARGUMENTS
