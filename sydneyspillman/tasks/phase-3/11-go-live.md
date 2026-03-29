<!-- plan -->
<!-- client: sydneyspillman -->
<!-- dispatched-from: sydney-phase-3 -->
<!-- depends-on: 10-quality-assurance -->
<!-- chain-next: 12-analytics-tracking,13-client-handoff -->

# Go Live — Sydney Spillman & Associates

**Primary agent:** MANUAL (escalation)
**Support:** Sentinel (verification after cutover)

## Why Manual

DNS cutover and SSL verification require human action — pointing sydneyspillman.com to the production hosting environment. This is a **manual checkpoint** with Sentinel running post-cutover verification.

## Escalation

Dispatch should write to `dispatch/escalations/sydney-go-live.md`:

```
## Go Live — Manual Checkpoint

QA is complete and passed. Site is ready for production launch.
See QA report: `sydneyspillman/content/10-qa-report.md`

### What Anthony Needs to Do
1. Final DNS cutover — point sydneyspillman.com to production hosting
2. Verify SSL certificate is active and forcing HTTPS
3. Confirm all canonical URLs resolve correctly (no www vs non-www issues)
4. Run `(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx sentinel/sentinel.ts` with a go-live verification task

### Post-Cutover: Sentinel Verification Task
After DNS propagates, drop this in sentinel/inbox/:
---
<!-- execute -->
Verify sydneyspillman.com is live:
- [ ] Homepage loads on sydneyspillman.com
- [ ] HTTPS redirect works (http → https)
- [ ] All pages accessible (about, listings, contact, testimonials)
- [ ] No mixed content warnings
- [ ] Canonical URLs correct
---

### Task Keys to Mark Complete
- 3-GO LIVE-0 — DNS cutover
- 3-GO LIVE-1 — SSL verified
- 3-GO LIVE-2 — Canonical URLs confirmed
- 3-GO LIVE-3 — Live site verified
```

## Convex Task Keys (all manual + Sentinel verification)
- `3-GO LIVE-0` — DNS cutover (manual)
- `3-GO LIVE-1` — SSL verification (Sentinel)
- `3-GO LIVE-2` — Canonical URLs (Sentinel)
- `3-GO LIVE-3` — Live site verification (Sentinel)
