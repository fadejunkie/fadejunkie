# CLAUDE.md — SEO Engine

This file provides guidance to Claude Code when working in this directory.

## Purpose

SEO Engine is Anthony's dedicated SEO strategist agent — a standalone Claude agent (`@anthropic-ai/claude-agent-sdk`) that produces SEO deliverables for FadeJunkie and inbound client engagements. Anthony (twanii) is the operator; SEO Engine is the strategist.

## Workspace Layout

```
C:/Users/twani/fadejunkie/   ← workspace root (git repo)
  app/                        ← Next.js + Convex project
  funkie/                     ← Funkie manager agent
  seo-engine/                 ← this directory (SEO Engine agent)
  context/                    ← shared project memory
```

## Commands

```bash
# From fadejunkie/seo-engine/

npm install          # install dependencies
npm start            # interactive REPL
npm run dev          # REPL with hot reload
npm run watch        # daemon mode (auto-processes inbox/)
```

Requires `ANTHROPIC_API_KEY` in the environment.

## Architecture

- `seo-engine.ts` — main entry point
- `cwd` for all queries: `C:/Users/twani/fadejunkie/seo-engine`
- Model: `claude-opus-4-6`
- maxTurns: 40
- Allowed tools: Read, Write, Edit, Glob, Grep, Bash, WebSearch, WebFetch

## Communication Protocol

| Path | Purpose |
|------|---------|
| `seo-engine/inbox/` | Drop `.md` task files here to send tasks to SEO Engine |
| `seo-engine/outbox/` | SEO Engine writes deliverables here |
| `seo-engine/outbox/pending/` | SEO Engine writes plans here (plan mode) |
| `seo-engine/memory/seo-knowledge.md` | Accumulated SEO learnings — injected into every prompt |
| `seo-engine/context/fadejunkie-seo.md` | FadeJunkie SEO context (default) |
| `seo-engine/context/clients/<slug>.md` | Per-client context files |
| `seo-engine/.last-session` | Last saved sessionId for resumption |

## Task Headers

- `<!-- execute -->` — Execute mode: produce full deliverables, write to outbox/
- `<!-- client: slug -->` — Load `context/clients/<slug>.md` instead of fadejunkie-seo.md

## Task Modes

- **Plan mode** (default): SEO Engine writes a plan to `outbox/pending/`, no file changes
- **Execute mode**: Task file starts with `<!-- execute -->` — produces full deliverables

## REPL Commands

| Command | Action |
|---------|--------|
| `check` | Process all inbox tasks |
| `approve <name>` | Move pending plan to inbox as execute task |
| `approve` | List all pending tasks |
| `resume` | Resume last saved session |
| `exit` | Quit |

## Important: No Direct App Edits

SEO Engine does NOT edit the Next.js codebase in `app/`. When SEO changes need to land in the app (meta tags, sitemaps, structured data), SEO Engine produces a task brief and Anthony drops it in `funkie/inbox/` for Funkie to execute.
