# Rico Improvement Log

A running record of lessons learned from each health check cycle. Each entry is one concrete finding — not a wall of analysis. The most recent entry surfaces in every health report as a fast reminder.

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
