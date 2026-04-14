# Rico Improvement Log

A running record of lessons learned from each health check cycle. Each entry is one concrete finding — not a wall of analysis. The most recent entry surfaces in every health report as a fast reminder.

---

## 2026-04-13

**Lesson:** V3 is fully dependent on BTC 5-minute markets on Polymarket. When those markets go offline, the entire bot goes dormant. Rico has been idle for 14 days. Single-market dependency is an existential risk to trading continuity.

**Findings:**
- Agent last ran: March 30, 2026 (14 days ago as of today)
- BTC 5-minute "Up or Down" markets unavailable on Polymarket for 14+ days
- V3 bankroll: $300.00 — fully preserved, $0 deployed
- P&L: $0.00 — not a loss, but 14 days of zero signal generation
- Previous lesson (2026-03-24) noted BTC 5-min micro-trades had 5 consecutive losses → moratorium was recommended. V3 strategy then pivoted to these same markets. Conflict unresolved.
- `crypto oracle` was the only profitable signal at last check — now producing 0 signals because its primary market type is offline
- Kalshi integration exists in stack but appears underutilized as a failover market source

**Actions to consider:**
1. **Market diversification** — Rico should scan Kalshi and other Polymarket categories (sports, politics, macro) when BTC 5-min is unavailable. Zero-trade days are worse than imperfect trades.
2. **Dormancy alert** — If agent hasn't executed a cycle in > 6 hours, Rico should surface a warning in the UI and log to Convex (not just show "scanning every 5 min")
3. **Crypto oracle on longer-duration markets** — The oracle signal works on BTC directional conviction. Apply it to 1h, 4h, or daily BTC markets when 5-min is down
4. **Revisit the BTC micro-trade moratorium** — V3 was designed around 5-min markets. Either fully deprecate this trade type (consistent with 2026-03-24 finding) or build a circuit-breaker that pauses and seeks alternatives

---

## 2026-03-24

**Lesson:** `crypto oracle` is the only profitable signal (4W/0L, 2.04x edge realization). All 5 other signals are net-negative with 0% win rates. Disable or gate non-core signals until they accumulate at least 1 win.

**Findings:**
- Signal P&L breakdown: crypto oracle +$61.61 | extreme pricing anomaly $0 | price momentum -$13.92 | claude research -$36.61 | political base rate -$37.51 | near expiry mispricing -$40.33
- `near expiry mispricing` produced -99.7% return on a single trade — highest-priority disable candidate
- Bot is consistently pricing geopolitical tail events (Iran, oil) at 12-18% vs market 55-69%. Pattern is systematic. No trades executed on these — either the threshold is protecting capital (good) or the contrarian view is untested alpha (unknown)
- 5 active Bitcoin/ETH NO signals queued but $634 sitting idle — deployment trigger may be too conservative
- Short-term BTC up/down micro-trades (5-min windows): 5 consecutive losses — halt this trade type
- Best position: ETH reach $2,400 in March — NO @ 21¢, now 18¢, +$146.43 unrealized (+292.9% in 7 days). Size was only $50. Size conviction needs calibration.

**Actions to consider:**
1. Gate trade execution to `crypto oracle` only until alternatives reach ≥1 win
2. Disable `near expiry mispricing` signal entirely (or require manual approval per trade)
3. Moratorium on BTC micro-trades with resolution windows < 30 min
4. Review geopolitical contrarian pipeline — verify whether threshold is blocking live trades on these high-edge signals

---
