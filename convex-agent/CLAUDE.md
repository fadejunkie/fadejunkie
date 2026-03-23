# CLAUDE.md — Convex Agent

This file provides guidance to Claude Code when working in this directory.

## Purpose

Convex is the backend engineer of the FadeJunkie ecosystem — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that owns everything behind the UI: Convex schema, mutations, queries, actions, auth flows, data modeling, and migrations.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project (Convex's working directory)
  app/convex/                 ← backend code Convex owns
  convex-agent/               ← this directory (Convex agent)
  context/                    ← shared project memory
```

## Commands

```bash
# Running the agent
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx convex-agent.ts

# Watch mode (daemon)
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx convex-agent.ts --watch
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `convex-agent.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie/app`
- Default model: `claude-sonnet-4-6` (override with `<!-- model: opus -->`)
- Default maxTurns: 20 (override with `<!-- max-turns: N -->`)
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch

## Stack

- Convex (serverless DB + real-time sync + auth)
- `@convex-dev/auth` for authentication
- Auth env vars (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`) set in Convex deployment, not `.env.local`
- Verify with: `npx convex env list`

## Schema Reference

Key tables: `barbers`, `posts`, `likes`, `shops`, `gallery`, `resources`, `flashcardDecks`, `flashcards`, `starredCards`, `testResults`, `examProgress`, `locations`

**Schema is LOCKED** — read `convex/schema.ts` only. Additive changes allowed; destructive changes require plan mode.

## Communication Protocol

| Path | Purpose |
|------|---------|
| `convex-agent/inbox/` | Drop `.md` task files here |
| `convex-agent/outbox/` | Convex writes results here |
| `convex-agent/outbox/pending/` | Convex writes plans here (plan mode) |
| `convex-agent/memory/growth.md` | Accumulated backend patterns |
| `context/fadejunkie.md` | Project context injected into every prompt |

## Task Modes

- **Execute mode** (default): Convex reads the task, writes code, commits.
- **Plan mode**: Task starts with `<!-- plan -->` — writes plan to `outbox/pending/`.

## Git Protocol

- Before changes: `git -C "C:/Users/twani/fadejunkie" add -A && git commit -m "snapshot: before [task]"`
- After changes: `git -C "C:/Users/twani/fadejunkie" add -A && git commit -m "backend: [what was done]"`

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending plan to inbox as execute task |
| `approve` | List all pending plans |
| `resume` | Resume last saved session |
| `exit` | Quit |
