# Escalation: Signal Gating Task Unexecuted — 48hrs Stale

**Date:** 2026-03-26
**Source:** staying-alive scheduled task (automated)
**Priority:** HIGH — active financial loss

## Problem

The signal gating dispatch task `dispatch/inbox/rico-signal-gating-2026-03-24.md` was written 2 days ago and has **not been executed**. No agent has processed it. The losing signals remain active.

## Current Signal P&L (as of today)

| Signal | Win Rate | P&L | Status |
|--------|----------|-----|--------|
| crypto oracle | 100% | +$61.61 | ✅ Only working signal |
| near expiry mispricing | 0% | -$40.33 | 🔴 -10x edge realization |
| political base rate | 0% | -$37.51 | 🔴 -2.76x |
| claude research | 0% | -$36.61 | 🔴 -1.08x |
| price momentum | 0% | -$13.92 | 🔴 -2.82x |
| extreme pricing anomaly | 0% | $0.00 | ⚠️ No wins |

Net loss from non-crypto-oracle signals: **-$128.37**
Total P&L only positive because of one open ETH position (+$141.67 unrealized).

## What needs to happen

Anthony or an agent needs to manually run the Dispatch agent to process the inbox task:
```bash
(echo "check" && sleep 300) | env -u CLAUDECODE npx tsx dispatch/dispatch.ts
```

Or Anthony can directly approve execution by prepending `<!-- execute -->` to the task file and running Dispatch.

## Risk if left unresolved

Every new signal scan creates more entries from losing signal types. The ETH position will eventually close, and without signal gating, the portfolio will return to net negative.
