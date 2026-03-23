# CLAUDE.md — Dispatch

This file provides guidance to Claude Code when working in this directory.

## Purpose

Dispatch is the orchestration brain of the FadeJunkie ecosystem — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that receives tasks, decomposes them into subtasks, routes each to the right specialist agent, and manages dependency chains. Anthony queues work; Dispatch makes it happen.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project
  dispatch/                   ← this directory (Dispatch agent)
  funkie/                     ← Funkie agent (strategy)
  lobe/                       ← Lobe agent (frontend)
  convex-agent/               ← Convex agent (backend)
  ink/                        ← Ink agent (copy)
  seo-engine/                 ← SEO Engine agent (SEO)
  sentinel/                   ← Sentinel agent (QA)
  context/                    ← shared project memory
```

## Commands

```bash
# Running the agent
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx dispatch.ts

# Watch mode (daemon)
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx dispatch.ts --watch
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `dispatch.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie` (workspace root)
- Model: `claude-opus-4-6` (needs deep reasoning for decomposition)
- Default maxTurns: 30
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash

## Agent Roster

| Agent | Inbox | Specialty | Trust | Default Mode |
|-------|-------|-----------|-------|-------------|
| Funkie | `funkie/inbox/` | Strategy, product, goals | LOW | plan |
| Lobe | `lobe/inbox/` | Frontend, UI/UX, design | HIGH | execute |
| Convex | `convex-agent/inbox/` | Backend, schema, queries | MEDIUM | execute |
| Ink | `ink/inbox/` | Copy, proposals, contracts | HIGH | execute |
| SEO Engine | `seo-engine/inbox/` | SEO, audits, keywords | MEDIUM | plan |
| Sentinel | `sentinel/inbox/` | QA, build, deploy | AUTO | execute |

## Communication Protocol

| Path | Purpose |
|------|---------|
| `dispatch/inbox/` | Drop `.md` task files here |
| `dispatch/outbox/` | Dispatch writes manifests and results here |
| `dispatch/outbox/pending/` | Reserved for future plan-mode support |
| `dispatch/escalations/` | Items needing human attention |
| `dispatch/memory/routing-patterns.md` | Learned routing knowledge |
| `context/fadejunkie.md` | Project context injected into every prompt |

## Dispatch Always Executes

Dispatch has no plan mode. When it receives a task, it decomposes and routes immediately. The plan lives in the manifest file written to outbox.

## Escalation Protocol

Dispatch writes to `dispatch/escalations/` when:
- Requirements are ambiguous
- A strategic decision is needed
- An agent fails the same subtask twice
- Client-facing content needs final approval

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending task to inbox |
| `approve` | List all pending tasks |
| `resume` | Resume last saved session |
| `exit` | Quit |
