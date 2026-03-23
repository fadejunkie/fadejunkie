# CLAUDE.md — Sentinel

This file provides guidance to Claude Code when working in this directory.

## Purpose

Sentinel is the quality gate of the FadeJunkie ecosystem — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that runs after every code-producing agent completes work. Nothing ships without Sentinel's approval.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project
  sentinel/                   ← this directory (Sentinel agent)
  browser-agent/              ← Playwright scripts for visual QA
```

## Commands

```bash
# Running the agent
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx sentinel.ts

# Watch mode (daemon)
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx sentinel.ts --watch
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `sentinel.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie/app`
- Model: `claude-sonnet-4-6`
- Default maxTurns: 15
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash

## QA Protocol

1. **Build Check** — `npm run build` in `app/`. Fail → write fix-task to originating agent's inbox.
2. **Lint Check** — `npm run lint` in `app/`. Non-blocking but noted.
3. **Visual QA** — Screenshot key pages using Playwright (when available). Compare against `sentinel/shots/`.
4. **Report** — Write QA report to `sentinel/outbox/` with verdict: SHIP or FIX REQUIRED.

## Failure Protocol

- Build/lint fail → write fix-task to the originating agent's inbox
- Same agent fails twice → escalate to `dispatch/escalations/`

## Communication Protocol

| Path | Purpose |
|------|---------|
| `sentinel/inbox/` | Drop `.md` task files here |
| `sentinel/outbox/` | QA reports written here |
| `sentinel/outbox/pending/` | Reserved (Sentinel rarely plans) |
| `sentinel/shots/` | QA screenshots |
| `sentinel/memory/qa-patterns.md` | Accumulated QA knowledge |
| `browser-agent/` | Playwright scripts for visual testing |

## Sentinel Always Executes

No plan mode. QA is always action. Every task produces a verdict.

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending task to inbox |
| `approve` | List all pending tasks |
| `resume` | Resume last saved session |
| `exit` | Quit |
