<!-- plan -->
<!-- client: sydneyspillman -->
<!-- dispatched-from: sydney-phase-2 -->
<!-- depends-on: 04-brand-system -->
<!-- chain-next: 06-site-foundation -->

# Domain Setup — Sydney Spillman & Associates

**Primary agent:** MANUAL (escalation)
**Reason:** Domain purchase, DNS configuration, and credential sharing require human action.

## Escalation

Dispatch should write to `dispatch/escalations/sydney-domain-setup.md`:

```
## Domain Setup — Manual Checkpoint

Phase 1 (BRAND) is complete. Ready to begin Phase 2 (BUILD).

### What Anthony Needs to Do
1. Purchase sydneyspillman.com (Namecheap, Google Domains, or Cloudflare Registrar)
2. Configure DNS — nameservers, SSL, WHOIS privacy
3. Set up hosting environment and deployment pipeline
   - If Vercel: add domain in Vercel dashboard, configure CNAME/A records
   - If Cloudflare Pages: create Pages project, configure DNS
4. Send domain confirmation + credentials to Sydney

### DNS Pattern (if Vercel)
- A record: @ → 76.76.21.21
- CNAME: www → cname.vercel-dns.com
- Verify SSL provisioned in Vercel dashboard

### DNS Pattern (if Cloudflare Pages)
- CNAME: @ → sydneyspillman.pages.dev (proxy ON)
- CNAME: www → sydneyspillman.pages.dev (proxy ON)

### Task Keys to Mark Complete
- 2-DOMAIN SETUP-0 — DNS configured
- 2-DOMAIN SETUP-1 — Hosting environment set up
- 2-DOMAIN SETUP-2 — Credentials sent to client
```

## Convex Task Keys (all manual)
- `2-DOMAIN SETUP-0` — DNS configuration
- `2-DOMAIN SETUP-1` — Hosting + deployment pipeline
- `2-DOMAIN SETUP-2` — Credentials to client
