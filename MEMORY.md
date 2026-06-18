# FadeJunkie — Memory

## What It Is
Barber culture SaaS platform. **Live feature: Edu Hub only** — free + paid study resources for cosmetology/barber students. Barber profile feature is experimental WIP — must NOT be accessible from production. Brand: direct, punk, culture-native. Stack: Next.js + Convex, deployed on Vercel.
App lives at `~/fadejunkie/app/` — has its own CLAUDE.md, read it before touching app code.

## Strategy (as of 2026-06-03)
- **Focus 1 (current):** Finish the Edu Hub — free/paid separation, bulletproof Stripe subscription, auth + DB hardening
- **Focus 2 (next):** Finish Barber Profile feature — profiles, Partners community, website generator SaaS (tiers TBD)
- **Dream:** Affiliates section for industry brands — after both focuses complete
- See `.paul/ROADMAP.md` for full milestone breakdown

## Active Clients
| Slug | Folder | Status | Value |
|------|--------|--------|-------|
| sydney-spillman | `fadejunkie/sydneyspillman/` | Phase 1 pending | pro bono |
| arquero | `fadejunkie/arquero/` | Phase 1 ready, no tasks yet | $1,900 paid |
| wizadry | `fadejunkie/wizardryink/` | Phase 1 pending | barter $3,800 |
| wcorwin | `Desktop/_CLIENTS/wcorwin/` | SEO retainer active | $950/mo |

## Key Rules
- **Lobe owns all frontend/UI** — never edit components directly, task via `~/agents/lobe/inbox/`
- **Dispatch is orchestrator** — drop high-level tasks in `~/agents/dispatch/inbox/`, not individual agents
- `control-center/` is deprecated — use Twanii (`~/twanii`)
- `_archive/` is gitignored — dead scripts go here

## Agent Task Headers (always check these)
- Default 20 turns is too low — use `<!-- max-turns: 60 -->` for medium, `<!-- max-turns: 80 -->` for large
- `<!-- client: slug -->` — loads per-client context for `seo-engine` + `ink`
- Lobe truncation: if file looks cut off, write a targeted **append** task, not a full rewrite

## Design System (FadeJunkie brand)
- Palette: cream `#fff4ea`, jet black `hsl(0 0% 8%)`, warm olive `hsl(34 22% 44%)`
- Type: Spectral (headlines), Inter (body), Geist Mono (labels)
- Texture: halftone dots, SVG grain 3.5% opacity
- Anti-refs: no corporate SaaS, no generic barbershop (no red/white stripes)

## Debugging
- Run `/debug-log` after any non-obvious bug fix — appends pattern to fadejunkie memory
- Fadejunkie-specific memory: `~/.claude/projects/C--Users-twani-fadejunkie/memory/MEMORY.md`
