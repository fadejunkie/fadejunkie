# CLAUDE.md — Ink

This file provides guidance to Claude Code when working in this directory.

## Purpose

Ink is the voice of FadeJunkie and every client Anthony serves — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that owns every word that faces a human: website copy, proposals, social posts, contracts, content calendar, email outreach, case studies, error messages, empty states.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project
  ink/                        ← this directory (Ink agent)
  context/                    ← shared project memory
  seo-engine/context/clients/ ← per-client context files
```

## Commands

```bash
# Running the agent
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx ink.ts

# Watch mode (daemon)
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx ink.ts --watch
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `ink.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie/ink`
- Model: `claude-opus-4-6` (copy quality demands the deeper model)
- Default maxTurns: 20 (override with `<!-- max-turns: N -->`)
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch

## Brand Voice — FadeJunkie

Direct. Punk. Culture-native.
- Confident, not arrogant
- Short sentences hit harder
- No corporate filler
- Warm when it matters, sharp when it counts

## Client Voice Support

Use `<!-- client: slug -->` header to load per-client context from `seo-engine/context/clients/<slug>.md`. Ink adapts voice to match the client's brand.

## Communication Protocol

| Path | Purpose |
|------|---------|
| `ink/inbox/` | Drop `.md` task files here |
| `ink/outbox/` | Ink writes deliverables here |
| `ink/outbox/pending/` | Ink writes plans here (plan mode) |
| `ink/memory/voice.md` | Voice patterns and anti-patterns |
| `context/fadejunkie.md` | Brand context injected into every prompt |
| `context/fadejunkie_ui.md` | UI context (typography, colors) |

## Task Modes

- **Execute mode** (default — Ink is trusted): Reads task, writes copy, delivers.
- **Plan mode**: Task starts with `<!-- plan -->` — writes plan to `outbox/pending/`.

## Task Headers

```markdown
<!-- plan -->              ← plan mode (no deliverables)
<!-- client: slug -->      ← load per-client context
<!-- model: sonnet -->     ← override model (default: opus)
<!-- max-turns: 30 -->     ← override turn limit (default: 20)
```

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending plan to inbox as execute task |
| `approve` | List all pending plans |
| `resume` | Resume last saved session |
| `exit` | Quit |
