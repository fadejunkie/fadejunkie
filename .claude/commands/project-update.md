# /project-update — Image-Driven Project Update & Deploy

When the user drops an image (screenshot, receipt PDF, etc.), identify which live project it belongs to, apply the relevant updates, sync CRM/metrics, build, and deploy.

## Workflow

### 1. Identify the Project
Read the image. Match it to a live project by recognizing:
- URLs in the browser bar or content
- Logos, branding, client names
- Dashboard layouts, tracker UIs
- Receipt/invoice details (client name, business name)

**Live Projects Registry:**

| Project | Domain | Cloudflare Pages Name | Source Dir | Data File |
|---------|--------|-----------------------|------------|-----------|
| WCORWIN | wcorwin.anthonytatis.com | wcorwin-seo-tracker | seo-engine/WCORWIN | src/data.js |

_(Add new rows as projects are onboarded)_

If the image doesn't match any known project, ask the user which project it relates to.

### 2. Determine the Action
Based on the image content, figure out what needs to happen:
- **Receipt/Invoice PDF** → log payment, update task status, sync CRM
- **Tracker screenshot** → identify stale/incorrect statuses, ask what to update
- **Error screenshot** → diagnose and fix
- **New content/feature** → apply the change to the relevant source files
- **General screenshot** → ask the user what they need done

### 3. Apply Changes

#### a. Update Project Source
For each project, edit the appropriate data/source files:
- **WCORWIN:** Edit `seo-engine/WCORWIN/src/data.js` — PHASES array, task statuses (`"done"`, `"active"`, `"pending"`), names, details

#### b. Sync CRM & Metrics
- **cc-crm.json** — Update the matching prospect/client entry:
  - Status changes (identified → contacted → meeting → proposal → active)
  - Payment logging in `payments[]` array (month, amount, date, invoiceNumber, receiptNumber, method, receipt path)
  - History entries for status changes
  - Notes field updates
- **cc-metrics.json** — Update relevant KPIs:
  - `mrr.count` — monthly recurring revenue total
  - `clients.count` — active paying clients
  - `prospects.count`, `outreach.count` — as relevant

#### c. Store Artifacts
- Save receipt PDFs in the project's directory (e.g., `seo-engine/WCORWIN/`)
- Reference the file path in the CRM `payments[].receipt` field

### 4. Build & Deploy
Build and deploy the matched project:

**WCORWIN:**
```bash
cd C:/Users/twani/fadejunkie/seo-engine/WCORWIN && npm run build
cd C:/Users/twani/fadejunkie/seo-engine/WCORWIN && CLOUDFLARE_API_TOKEN=pKF0oB6OkvZhnkugKD2VT098LDJxWHnQXoLpa7pP npx wrangler pages deploy dist --project-name=wcorwin-seo-tracker --branch=main --commit-dirty=true
```

**IMPORTANT:** Always deploy with `--branch=main` — the custom domain is bound to the Production environment (main branch). Deploying without it goes to Preview only and won't update the live site.

_(Add deploy commands for new projects as they're onboarded)_

### 5. Report
- Summarize all changes (source files, CRM, metrics)
- Always end with footer links to the live site + CC Dashboard

## Project Details

### WCORWIN
- **Client:** Weichert Realtors — Corwin & Associates
- **Contact:** Joe Corwin (Owner), Deanna Bazan (Office Mgr)
- **Email:** Joe@joecorwin.com
- **Location:** New Braunfels, TX
- **Site:** wcorwin.anthonytatis.com
- **Retainer:** $950/mo
- **Login:** joe@joecorwin.com / (see browser-agent/.env)
- **Receipts stored:** seo-engine/WCORWIN/

## Key Files (Global)
| File | Purpose |
|------|---------|
| `cc-crm.json` | CRM — all prospects and clients |
| `cc-metrics.json` | KPI metrics dashboard |
| `cc-server.mjs` | Control Center server |
| `cc-dashboard.html` | Control Center UI |
| `app/.env.local` | API tokens (`cf_token`, `twanii_cloudfare`, `vercel_api`) |

## Deploy Notes
- **Cloudflare token:** Read from `app/.env.local` → `twanii_cloudfare` key (the `cf_token` key is expired)
- **Production branch:** `main` — custom domains are bound to Production, always use `--branch=main`
- **Preview branch:** `master` — preview-only deploys, not visible on custom domains
- **WCORWIN source of truth:** `seo-engine/WCORWIN/src/data.js` (NOT the root `wcorwin-seo-journey.jsx` which is a legacy copy)

$ARGUMENTS
