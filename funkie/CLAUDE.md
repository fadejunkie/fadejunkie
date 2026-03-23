# CLAUDE.md — Funkie

This file provides guidance to Claude Code when working in this directory.

## Purpose

Funkie is the FadeJunkie Manager agent — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that operates the FadeJunkie codebase. twanii is the command center; Funkie is the operator.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project
  funkie/                     ← this directory (Funkie agent)
  context/                    ← shared project memory
```

## Commands

```bash
# From fadejunkie/funkie/

npm install          # install dependencies
npm start            # interactive REPL
npm run dev          # REPL with hot reload
npm run watch        # daemon mode (auto-processes inbox/)
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `funkie.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie/app`
- Default model: `claude-sonnet-4-6` (override with `<!-- model: opus -->` in task file)
- Default maxTurns: 20 (override with `<!-- max-turns: N -->` in task file)
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch

## Communication Protocol

| Path | Purpose |
|------|---------|
| `funkie/inbox/` | Drop `.md` task files here to send tasks to Funkie |
| `funkie/outbox/` | Funkie writes results here |
| `funkie/outbox/pending/` | Funkie writes plans here (plan mode, no code changes) |
| `context/fadejunkie.md` | Persistent project memory — injected into every prompt |
| `funkie/.last-session` | Last saved sessionId for resumption |

## Task Modes

- **Plan mode** (default): Funkie writes a plan to `outbox/pending/`, does NOT touch `app/`
- **Execute mode**: Task file starts with `<!-- execute -->` — Funkie runs it + commits to git

## Task Headers (token control)

```markdown
<!-- execute -->            ← execute mode (default is plan)
<!-- model: sonnet -->     ← use Sonnet (default, cheapest)
<!-- model: opus -->       ← use Opus (complex tasks only)
<!-- model: haiku -->      ← use Haiku (trivial tasks)
<!-- max-turns: 15 -->     ← override turn limit (default: 20)
```

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending plan to inbox as execute task |
| `approve` | List all pending tasks |
| `resume` | Resume last saved session |
| `exit` | Quit |
