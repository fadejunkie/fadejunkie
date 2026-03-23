# FadeJunkie

> The operating layer for the modern barber.

FadeJunkie is a platform for barbers, students, and barbershop businesses — plus an AI services arm that takes real client work from the barber industry. The platform earns credibility. The services earn revenue. They feed each other.

**Stack:** Next.js 15 (App Router) · Convex (DB + auth + real-time) · Tailwind CSS 4 · Radix UI

---

## Architecture

```
fadejunkie/
│
├── app/                     Product — Next.js + Convex
│   ├── (auth)/              Protected routes (home, profile, website, resources, tools)
│   ├── barber/[slug]/       Public barber profiles
│   ├── shop/[userId]/       Public shop profiles
│   ├── directory/           School/barber map (Leaflet)
│   ├── signin/              Auth (email + password)
│   └── convex/              Backend — schema, mutations, queries, auth
│
├── dispatch/                Agent — Orchestrator
├── funkie/                  Agent — Strategy & product operator
├── lobe/                    Agent — Frontend engineer
├── convex-agent/            Agent — Backend engineer
├── ink/                     Agent — Copywriter & voice
├── seo-engine/              Agent — SEO strategist
├── sentinel/                Agent — QA & deploy gate
│
├── control-center/          Dashboard — server, CRM, metrics, content calendar
├── browser-agent/           Playwright — screenshots, visual QA
├── arquero/                 Client project — Arquero Co. storefront
├── context/                 Shared project memory (injected into agent prompts)
└── _archive/                Dead scripts, old concepts, reports (gitignored)
```

---

## Agent System

Seven autonomous agents communicate through a shared inbox/outbox protocol. Each agent is a standalone TypeScript process powered by `@anthropic-ai/claude-agent-sdk`.

| Agent | Role | Default Mode | Model |
|-------|------|:------------:|-------|
| **Dispatch** | Decomposes tasks, routes to specialists, manages dependency chains | execute | opus |
| **Funkie** | Strategy, product decisions, Q1 goals, client relationships | plan | sonnet |
| **Lobe** | Frontend UI/UX, components, design system, visual polish | execute | sonnet |
| **Convex** | Backend — schema, mutations, queries, auth, data modeling | execute | sonnet |
| **Ink** | Copywriting — proposals, social, contracts, brand voice | execute | opus |
| **SEO Engine** | SEO strategy, audits, keywords, client deliverables | plan | opus |
| **Sentinel** | QA — build verification, visual regression, deploy gate | execute | sonnet |

### How agents communicate

```
Drop a .md file in     →  agent/inbox/
Agent writes result to  →  agent/outbox/
Agent writes plan to    →  agent/outbox/pending/
Approve a plan          →  moves pending → inbox with <!-- execute --> prepended
```

### Running an agent

```bash
# Interactive REPL
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx <agent>/<agent>.ts

# Watch mode (daemon — auto-processes inbox)
(echo "--watch" && sleep 600) | env -u CLAUDECODE npx tsx <agent>/<agent>.ts --watch
```

### Task file headers

```markdown
<!-- execute -->              Execute mode
<!-- plan -->                 Plan mode (no code changes)
<!-- model: opus -->          Override model
<!-- max-turns: 60 -->        Override turn limit
<!-- client: slug -->         Load per-client context (SEO Engine + Ink)
<!-- dispatched-from: x -->   Task origin tracking (Dispatch sets this)
<!-- depends-on: a,b -->      Dependency chain (Dispatch sets this)
<!-- chain-next: c -->        Next subtask to trigger (Dispatch sets this)
```

---

## Control Center

Local dashboard at **http://localhost:4747** — approve plans, send tasks, track metrics, manage CRM.

```bash
node control-center/cc-server.mjs
# or
npm run cc
```

---

## Development

```bash
# Start the app (Next.js + Convex dev server)
cd app && npm run dev

# Build
cd app && npm run build

# Lint
cd app && npm run lint

# Google Drive inbox daemon
npm run watch-drive
```

### Environment

- `app/.env.local` — `NEXT_PUBLIC_CONVEX_URL`, `NEXT_PUBLIC_CONVEX_SITE_URL`
- Convex backend vars (`JWT_PRIVATE_KEY`, `JWKS`, `SITE_URL`) — set in Convex deployment, not `.env.local`
- Agent API key — `ANTHROPIC_API_KEY` in environment

---

## Directory Reference

| Path | Purpose |
|------|---------|
| `app/` | Next.js product codebase |
| `app/convex/` | Convex backend (schema, mutations, queries) |
| `dispatch/` | Orchestrator agent |
| `funkie/` | Strategy agent |
| `lobe/` | Frontend agent |
| `convex-agent/` | Backend agent |
| `ink/` | Copywriting agent |
| `seo-engine/` | SEO agent |
| `sentinel/` | QA agent |
| `control-center/` | Dashboard server + data files |
| `browser-agent/` | Playwright visual QA scripts |
| `arquero/` | Client project (Arquero Co.) |
| `context/` | Shared context files injected into agent prompts |
| `_archive/` | Historical files (gitignored) |
| `drive-watcher.mjs` | Google Drive inbox daemon |
| `launch.bat` | Claude Code launcher |

---

## Client Projects

| Client | Domain | Source | Status |
|--------|--------|--------|--------|
| Weichert Realtors — Corwin & Associates | wcorwin.anthonytatis.com | `seo-engine/WCORWIN/` | Active — $950/mo |
| Arquero Co. | arquero.co | `arquero/` | In build |

---

## Last Updated

2026-03-22
