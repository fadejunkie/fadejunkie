# CLAUDE.md — PM

This file provides guidance to Claude Code when working in this directory.

## Purpose

PM is the autonomous project driver of the FadeJunkie ecosystem — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that reads Convex task completion state, walks dependency graphs, decides what milestone to kick off next, drops the right task template into the right agent inbox, and escalates blockers.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project
  pm/                         ← this directory (PM agent)
  dispatch/                   ← Dispatch agent (orchestrator)
  lobe/                       ← Lobe agent (frontend)
  ink/                        ← Ink agent (copy)
  convex-agent/               ← Convex agent (backend)
  seo-engine/                 ← SEO Engine agent (SEO)
  sentinel/                   ← Sentinel agent (QA)
  sydneyspillman/             ← Sydney Spillman project hub + task templates
```

## Commands

```bash
# Running the agent
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx pm.ts

# Watch mode (daemon)
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx pm.ts --watch
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `pm.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie` (workspace root)
- Model: `claude-sonnet-4-6`
- Default maxTurns: 25
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash

## Core Loop

1. **READ STATE** — Query Convex for task completion status
2. **EVALUATE** — Walk the dependency chain, find milestones where all deps are satisfied
3. **DECIDE** — Pick the highest-priority unstarted milestone
4. **ACT** — Drop task template into agent inbox, escalate manual checkpoints, or report all clear
5. **LOG** — Write action to outbox + update memory/project-state.md

## Routing Rules

- Single-agent milestones → copy template to primary agent's inbox
- Multi-agent chains → copy template to dispatch/inbox/
- Manual milestones → write escalation to dispatch/escalations/
- Always add `<!-- dispatched-from: pm -->` header

## Communication Protocol

| Path | Purpose |
|------|---------|
| `pm/inbox/` | Drop `.md` task files here |
| `pm/outbox/` | Status reports and action logs |
| `pm/outbox/pending/` | Reserved |
| `pm/memory/project-state.md` | Accumulated project knowledge |
| `dispatch/escalations/` | Manual checkpoints needing Anthony |
| `email-agent/inbox/` | Client update tasks for Mailwatch |
| `email-agent/clients/` | Per-client contact configs and tone |

## Client Update Trigger

When a milestone completes, PM triggers a client update email via Mailwatch:

1. Drop a task in `email-agent/inbox/` with `<!-- client: {slug} -->` header
2. Mailwatch composes a draft and writes it to `email-agent/outbox/pending-sends/`
3. Anthony reviews and approves/denies via Mailwatch REPL
4. **Never send client updates directly — always route through Mailwatch**

Client slugs: `wcorwin`, `arquero`, `sydney-spillman`

**Arquero exception:** Uses WhatsApp, not email. Still drop the task to Mailwatch — the draft content will be used for WhatsApp.

## PM Always Executes

No plan mode. PM is always action — read state, decide, act.

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending task to inbox |
| `approve` | List all pending tasks |
| `resume` | Resume last saved session |
| `exit` | Quit |

## Active Projects

| Project | Source | Convex Prod | Template Dir |
|---------|--------|-------------|--------------|
| Sydney Spillman | `sydneyspillman/` | `unique-crab-445` | `sydneyspillman/tasks/` |
