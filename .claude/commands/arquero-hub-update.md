---
description: "Update the Arquero Co. project hub or arqueroco.anthonytatis.com. Triggers on: update arquero, update arquero hub, arquero tracker update, mark arquero task, arquero status change, arquero progress update."
---

# /arquero-hub-update — Arquero Co. Project Hub Update

Update the Arquero Co. project hub: toggle task completion, check agreement status, query progress — all against **production Convex**.

## Context

- **Client tracker:** arqueroco.anthonytatis.com (Vercel, real-time Convex)
- **Convex project:** `warmhearted-marlin-167` (production)
- **Source:** `arquero/`
- **Hub file:** `arquero/src/ArqueroHub.tsx` (monolithic single-file, `// @ts-nocheck`)
- **Convex functions:** `arquero/convex/arqueroTasks.ts`

## Critical: Always use `--prod` flag with Convex commands

```bash
cd arquero && CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:<function> '<args>'
```

**WARNING:** Without `--prod`, `npx convex run` hits the DEV deployment which has DIFFERENT data than production. The website connects to the PROD URL. Always include both `CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167` and `--prod` flag.

## Available Convex Functions

### Task Management

```bash
# Query all task states
CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:getTasks '{"projectId":"arquero-co"}'

# Toggle a task (true = done, false = not done)
CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:setTask '{"projectId":"arquero-co","key":"<taskKey>","value":true}'
```

### Agreement Management

```bash
# Check agreement state (signature, payment status)
CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:getAgreement '{"projectId":"arquero-co"}'

# Reset agreement (testing only — destroys signature)
CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:clearAgreement '{"projectId":"arquero-co"}'
```

## Task Key Format

Keys follow: `<phaseId>-<MILESTONE TITLE>-<taskIndex>`

- Phase IDs: `1` (Brand), `2` (Build), `3` (Launch)
- Milestone titles are **UPPERCASE EXACT** as shown below
- Task index is **0-based**

Example: `1-DISCOVERY SESSION-0` = first task in Discovery Session

## Task Map

### Phase 1: BRAND (Weeks 1–2, $550)

**DISCOVERY SESSION** (0-3)
0. Client intake call — brand story, values, target customer profile
1. Define brand positioning: where does Arquero sit in the welding lifestyle space?
2. Identify tone: rugged craftsmanship? modern industrial? streetwear-meets-trade?
3. Competitor audit — 5 comparable welding/trade lifestyle brands

**MOOD + DIRECTION** (0-2)
0. Build mood board — textures, typography, color feel, photography style
1. Present 2 direction options (e.g. raw industrial vs. refined craft)
2. Get client approval on direction before moving to logo design [BLOCKER]

**LOGO DESIGN** (0-5)
0. Generate 3 distinct logo concepts (AI-assisted + manual vector refinement)
1. Present concepts with mockups — apparel tags, embroidery, social, packaging
2. Revision round 1 on selected direction
3. Revision round 2 — final polish and lockup variations
4. Export final files: PNG (transparent), SVG (vector), PDF (print-ready)
5. Create icon-only and wordmark-only variants

**BRAND SYSTEM** (0-5)
0. Define primary palette — dark/steel tones + signature accent (welding orange/amber)
1. Define secondary palette + neutrals with hex codes
2. Select typography — display font (heavy/industrial) + body font (clean/readable)
3. Build brand guidelines PDF: logo usage, minimum sizes, clear space, do's/don'ts
4. Include application examples — tags, labels, packaging mockups, social templates
5. Deliver complete brand kit to client

### Phase 2: BUILD (Weeks 2–3, $1,350)

**DOMAIN ACQUISITION** (0-2)
0. Research arqueroco.com and arquero.co — availability, pricing, and registrar options
1. Purchase selected domain — configure DNS, domain lock, WHOIS privacy
2. Send registration confirmation + credentials to client

**STORE FOUNDATION** (0-4)
0. Create Shopify account — Basic plan ($39/mo, client-paid)
1. Evaluate and select theme that fits industrial/lifestyle aesthetic
2. Customize theme — colors, typography, logo placement per brand guidelines
3. Configure store settings — currency, units, tax, checkout branding
4. Connect arquero.co domain to Shopify

**CORE PAGES** (0-5)
0. Homepage — hero section, brand story, featured collections, lifestyle imagery
1. About page — Arquero origin story, mission, the welding lifestyle ethos
2. Contact page — form, email, social links
3. FAQ page — shipping, returns, sizing, materials, care instructions
4. Shipping & Returns policy page
5. Privacy Policy + Terms of Service pages

**PRODUCTS + COLLECTIONS** (0-5)
0. Receive product images, descriptions, sizing, and pricing from client [BLOCKER]
1. Create product listings — up to 20 SKUs with images, descriptions, variants
2. Write compelling product copy — speak to the welder/craftsman customer
3. Build collection pages — by category (tees, hoodies, hats, accessories, etc.)
4. Configure size charts specific to workwear/lifestyle fit
5. Set up inventory tracking per variant

**CHECKOUT + SHIPPING** (0-4)
0. Set up Shopify Payments (or client's preferred gateway)
1. Configure shipping zones — domestic US, evaluate international
2. Set shipping rates — flat rate vs. calculated vs. free threshold
3. Configure order confirmation + shipping notification emails with branding
4. End-to-end checkout test with live payment method

**SEO FOUNDATION** (0-4)
0. Keyword research — welding apparel, welder lifestyle, trade clothing terms
1. Write title tags + meta descriptions for all pages and collections
2. Add descriptive alt text to all product and lifestyle images
3. Configure URL structure — clean, keyword-aware slugs
4. Submit XML sitemap to Google Search Console

### Phase 3: LAUNCH (Week 3, $250)

**QUALITY ASSURANCE** (0-4)
0. Cross-browser testing — Chrome, Safari, Firefox, Edge
1. Mobile responsive QA — iOS Safari, Android Chrome, tablet
2. Test all links, navigation, forms, and interactive elements
3. Full checkout flow test — add to cart → payment → confirmation
4. Page speed audit — optimize images and assets if needed

**GO LIVE** (0-4)
0. Final DNS cutover — point arquero.co to Shopify
1. Verify SSL certificate is active and forcing HTTPS
2. Confirm all canonical URLs resolve correctly
3. Remove storefront password lock
4. Verify live site loads correctly on arquero.co

**ANALYTICS + TRACKING** (0-3)
0. Create and configure Google Analytics 4 property
1. Install GA4 tracking on Shopify
2. Set up Google Search Console — verify domain ownership
3. Verify ecommerce event tracking — purchases, add-to-cart, checkout

**CLIENT HANDOFF** (0-4)
0. Live training session — managing products, fulfilling orders, editing pages
1. Deliver all brand assets: logo files, guidelines PDF, font files
2. Deliver credentials doc — Shopify admin, domain registrar, GA4, GSC
3. Provide quick-reference cheat sheet for common Shopify tasks
4. 48-hour post-launch check-in — fix any issues, answer questions

## Workflow

### 1. Parse the Update
Read the user's input (`$ARGUMENTS`). Determine which tasks to toggle and what changes to make. If the user references a task by description rather than key, look it up in the task map above. If unclear, ask.

### 2. Query Current State
```bash
cd arquero && CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:getTasks '{"projectId":"arquero-co"}'
```
Show the user the current task states relevant to their update.

### 3. Apply Mutations
Run all needed `setTask` calls from `arquero/`.

```bash
cd arquero && CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:setTask '{"projectId":"arquero-co","key":"1-DISCOVERY SESSION-0","value":true}'
```

### 4. Verify State
```bash
cd arquero && CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex run --prod arqueroTasks:getTasks '{"projectId":"arquero-co"}'
```
Confirm the mutations landed. Compare before/after.

### 5. Screenshot & Verify
The tracker is real-time (Convex subscriptions) — no rebuild needed for data changes. Take a screenshot to confirm:

```bash
node browser-agent/agent.mjs screenshot https://arqueroco.anthonytatis.com
```

Read the screenshot and visually verify:
- Overall progress bar updated
- Phase progress counts correct
- Correct tasks showing checkmarks

### 6. Rebuild & Deploy (only if code changed)
Only needed when `ArqueroHub.tsx` or Convex functions were edited — NOT for task toggles.

**Convex functions changed:**
```bash
cd arquero && CONVEX_DEPLOYMENT=prod:warmhearted-marlin-167 npx convex deploy -y
```

**Frontend code changed:**
```bash
cd arquero && npm run build && cp -r dist/* .vercel/output/static/ && npx vercel deploy --prebuilt --prod
```

**IMPORTANT:** Do NOT use `npx vercel build --prod` — it runs locally and does NOT inject Vercel env vars. Instead, use `npm run build` (reads `.env.local` for `VITE_CONVEX_URL`) and copy to `.vercel/output/static/`.

### 7. Report
Summarize: what changed, current phase progress (X/Y per phase), overall %, link to live tracker.

## Examples

**Mark a task done:**
> /arquero-hub-update mark "Client intake call" as done

Resolves to: `setTask` with key `1-DISCOVERY SESSION-0`, value `true`

**Mark multiple tasks:**
> /arquero-hub-update discovery session tasks 0-3 all done

**Undo a task:**
> /arquero-hub-update uncheck 1-LOGO DESIGN-2

Resolves to: `setTask` with key `1-LOGO DESIGN-2`, value `false`

**Check agreement status:**
> /arquero-hub-update check agreement status

Runs `getAgreement` and reports: signed/unsigned, payment type, payment status.

**Phase progress check:**
> /arquero-hub-update how far along is phase 1?

Queries all tasks, calculates phase 1 done/total.

$ARGUMENTS
