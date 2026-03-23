# /projecthub — Scaffold a Client Project Hub

Build a full ops/client-facing project hub from scratch — a beautiful single-page Vite + React + Convex app with workflow tracker, scope of work, signable agreement, and optional website mockup.

**Live reference:** `arqueroco.anthonytatis.com` | Source: `fadejunkie/arquero/`

## What Gets Built

A standalone Vite + React + Convex app (one TSX file, inline styles) deployed to `<slug>.anthonytatis.com` with:

| Tab | Contents |
|-----|----------|
| WORKFLOW | Phase/milestone/task tracker — ops view (editable checkboxes) + client view (progress narrative) |
| SCOPE OF WORK | Full project scope, deliverables, pricing table, timeline |
| AGREEMENT | Signable service agreement — one-time vs monthly payment toggle |
| WEBSITE / MOCKUP | (Optional) Internal-routing website mockup with shop, about, contact, cart, etc. |

---

## Step 1 — Gather Requirements

Read `$ARGUMENTS`. If the user passed details inline, extract them. Otherwise ask for:

**Required:**
- `client_name` — e.g. "Arquero Co."
- `slug` — URL-safe lowercase identifier, e.g. `arquero`
- `project_title` — hub header text, e.g. "BRAND BUILD + LAUNCH"
- `phases[]` — list of phases with names, fees, deliverables, and tasks
- `total_value` — total contract value
- `payment_structure` — one-time, monthly, or milestone-based
- `provider_name` — e.g. "Anthony Tatis (Anthony's Brand Builder)"

**Optional (but makes it shine):**
- `accent_color` — brand hex, default `#e8541a`
- `domain_hint` — client's target domain, e.g. `arquero.co`
- `website_mockup: true/false` — add website tab? (default: true for web/ecom clients)
- `product_images[]` — paths to product images for mockup
- `hero_video` — path to hero video for website mockup
- `tagline` — e.g. "WELDING LIFESTYLE BRAND"

If anything critical is missing, ask before proceeding.

---

## Step 2 — Scaffold the Project

### 2a. Create directory + copy base structure

```bash
# Copy the arquero project as base template
cp -r C:/Users/twani/fadejunkie/arquero C:/Users/twani/fadejunkie/<slug>
```

Then clean the copy:
- Delete `arquero/` specific content from the TSX file
- Delete `dist/`, `arquero-invoice-links.json`, any client-specific JSON
- Reset `public/` to only keep generic assets (or replace with client assets)

### 2b. Create the hub TSX file

Create `<slug>/src/<ClientName>Hub.tsx` based on the Arquero template with these customizations:

**Color accent:** Replace `O="#e8541a"` with client brand color (or keep default).

**Header:**
```tsx
// Provider label + client name
<div style={{fontSize:11,color:O}}>ANTHONY'S BRAND BUILDER</div>
<div className="hdr-title">{CLIENT_NAME}<span style={{color:O}}>.</span></div>
<div style={{fontSize:13,color:SMOKE}}>{TAGLINE} — PROJECT HUB</div>
```

**Phases data:** Build the `phases[]` array from the provided scope. Each phase needs:
- `id`, `name`, `subtitle`, `week`, `fee`, `short` (2-3 word label for card), `icon`
- `milestones[]` each with `title`, `clientDesc`, `tasks[]` (with `label` + optional `blocker:true`)

**Scope page:** Build a scope table from the phases — name, deliverables, week, fee. Include total.

**Agreement page:** Wire up:
- Client name, provider name, today's date
- Payment structure toggle (one-time / monthly)
- Payment schedule section (milestones or monthly terms)
- Standard clauses: scope, revisions, IP, confidentiality, termination, limitation of liability
- Signature block (client + provider)

**Website mockup (if requested):** Adapt the `WebsitePage` component:
- Update `SiteNav` links to client's actual nav structure
- Update `products[]` with client product images from `public/`
- Update hero to use client's video or image
- Update brand copy (name, tagline, about text)

### 2c. Wire Convex

Create `<slug>/convex/schema.ts`:
```ts
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
export default defineSchema({
  projectTasks: defineTable({
    projectId: v.string(),
    key: v.string(),
    value: v.boolean(),
  }).index("by_project_key", ["projectId", "key"]),
});
```

Create `<slug>/convex/<slug>Tasks.ts` with `getTasks` query and `setTask` mutation using `projectId: "<slug>-<client>"`.

### 2d. Update `index.html`

Set `<title>` to `{ClientName} — Project Hub`.

---

## Step 3 — Deploy

```bash
# 1. Initialize Convex (first time only — will prompt for project name)
cd C:/Users/twani/fadejunkie/<slug>
npx convex dev --once

# 2. Deploy to Vercel
npx vercel --prod

# 3. Add custom domain to Vercel (if not already present)
npx vercel domains add <slug>.anthonytatis.com
```

**Cloudflare DNS** (via PowerShell — curl fails on Windows):
```powershell
$zone = '7533f1fff19002bf2ba6a4678630e64c'
$email = 'Tatis.anthony@gmail.com'
$key = '<cf_global_api from app/.env.local>'
$headers = @{ 'X-Auth-Email' = $email; 'X-Auth-Key' = $key; 'Content-Type' = 'application/json' }
$body = '{"type":"CNAME","name":"<slug>","content":"cname.vercel-dns.com","ttl":1,"proxied":false}'
Invoke-RestMethod -Method POST -Uri "https://api.cloudflare.com/client/v4/zones/$zone/dns_records" -Headers $headers -Body $body
```

Write this to a `.ps1` file and run via `powershell -File`. Do NOT inline into bash.

**Verify:**
```powershell
Invoke-WebRequest -Uri 'https://<slug>.anthonytatis.com' -UseBasicParsing -TimeoutSec 15
```
Expect `StatusCode: 200`.

---

## Step 4 — Screenshot & Deliver

Take a Playwright screenshot of the live URL:
```js
const { chromium } = require('./browser-agent/node_modules/playwright/index.js');
// from C:/Users/twani/fadejunkie/browser-agent/
```

Deliver to the user:
1. Live URL: `https://<slug>.anthonytatis.com`
2. Screenshot of the WORKFLOW tab
3. Screenshot of the AGREEMENT tab
4. Screenshot of WEBSITE MOCKUP tab (if built)

---

## Key Rules

- **Single TSX file.** Keep everything in `<ClientName>Hub.tsx` — no separate component files unless the file exceeds 2,000 lines.
- **`// @ts-nocheck` at top.** Always. Inline styles throughout — no Tailwind, no CSS modules.
- **Inline `<style>` tag** for responsive classes (`.hdr-pad`, `.nav-btn`, `.nav-label`, breakpoints at 768px + 480px).
- **Convex for task state only.** All other data is hardcoded in the TSX file — no CMS, no DB reads for content.
- **Dark theme default** with light toggle persisted in `localStorage("${slug}-theme")`.
- **Product images** go in `public/` and are referenced as `/filename.png` (no `./` or imports).
- **PowerShell for all Cloudflare API calls** — write to `.ps1` file, run with `powershell -File`. Never use curl for HTTPS on Windows.
- **Vercel token** is at `C:/Users/twani/AppData/Roaming/com.vercel.cli/Data/auth.json` if needed for API calls.
- **cf_global_api** is in `C:/Users/twani/fadejunkie/app/.env.local` — read it, don't hardcode.

---

## Reference: Arquero Hub

The definitive working example. Study before building:
- Source: `C:/Users/twani/fadejunkie/arquero/src/ArqueroHub.tsx`
- Schema: `C:/Users/twani/fadejunkie/arquero/convex/schema.ts`
- Tasks: `C:/Users/twani/fadejunkie/arquero/convex/arqueroTasks.ts`
- Pattern notes: `memory/projecthub-pattern.md`

$ARGUMENTS
