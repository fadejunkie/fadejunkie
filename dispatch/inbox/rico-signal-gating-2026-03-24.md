<!-- execute -->
<!-- model: opus -->
<!-- max-turns: 40 -->
<!-- dispatched-from: staying-alive scheduled task -->

# Task: Gate Underperforming Signals in Rico Trading Bot

## Context

Rico's signal performance as of 2026-03-24 shows a clear split:

| Signal | Win Rate | P&L | Edge Realization | Action |
|--------|----------|-----|-----------------|--------|
| crypto oracle | 100% | +$61.61 | 2.04x | ✅ Keep, expand |
| extreme pricing anomaly | 0% | $0.00 | 0.00x | ❌ Gate |
| price momentum | 0% | -$13.92 | -2.82x | ❌ Gate |
| claude research | 0% | -$36.61 | -1.08x | ❌ Gate |
| political base rate | 0% | -$37.51 | -2.76x | ❌ Gate |
| near expiry mispricing | 0% | -$40.33 | -10.07x | ❌ Disable entirely |

Additional patterns:
- Short-term BTC up/down micro-trades (< 30min resolution windows): 5 consecutive losses. Halt this trade type.
- ETH reach $2,400 NO @ 21¢ = +$146.43 unrealized. Best active position was sized at only $50. Size conviction needs calibration upward for high-edge, high-confidence positions.

## What to do

1. **Find the signal gating mechanism** — locate where signal types are enabled/disabled in the Rico codebase (likely in Convex schema, a config object, or a constants file). Check `app/convex/`, `app/app/`, and any `rico/`, `trading/`, or `signals/` directories.

2. **Gate these signals** (require ≥1 historical win before re-enabling):
   - `extreme pricing anomaly`
   - `price momentum`
   - `claude research`
   - `political base rate`

3. **Disable this signal entirely** (not just gated — fully off until manually reviewed):
   - `near expiry mispricing` — -99.7% return on a single trade. This is catastrophic downside risk.

4. **Add resolution window filter** — trades with resolution windows < 30 minutes should be blocked by default. The BTC up/down micro-trades (5-min windows) show 5 consecutive losses and no edge pattern.

5. **Increase position sizing floor for high-conviction signals** — if a signal has edge > 30% AND confidence = "high", allow position size up to $100 (currently appears capped too low at ~$50 for even top-tier positions).

6. **Verify changes compile and deploy correctly** — run a build check before deploying.

## Success criteria

- Only `crypto oracle` signals produce live trades until other signal types accumulate ≥1 win
- `near expiry mispricing` signal is completely disabled
- Micro-trades with < 30-minute resolution windows are blocked
- High-confidence, high-edge signals can size up to $100

## Out of scope

Do not touch correlation caps, bankroll logic, or research desk configuration.
