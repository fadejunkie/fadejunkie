import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { Ring, AnimNum } from "./SEOJourneyTracker";
import { ACCENT, INK, BODY, MUTED, LIGHT, BG, WHITE, GREEN } from "./data";

// ─── Constants ────────────────────────────────────────────────────────────────

const font = "'DM Sans', 'Satoshi', -apple-system, sans-serif";
const mono = "'DM Mono', monospace";
const RED = "#ef4444";
const AMBER = "#f59e0b";

const PILLARS = [
  { key: "overallScore", label: "Overall" },
  { key: "onPage",       label: "On-Page" },
  { key: "technical",    label: "Technical" },
  { key: "content",      label: "Content" },
  { key: "local",        label: "Local" },
  { key: "authority",    label: "Authority" },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function scoreColor(score) {
  if (score < 4) return RED;
  if (score <= 6) return AMBER;
  return GREEN;
}

function urgencyColor(index) {
  if (index === 0) return RED;
  if (index <= 2) return AMBER;
  return GREEN;
}

function hoursAgo(ts) {
  const h = Math.floor((Date.now() - ts) / (1000 * 60 * 60));
  if (h < 1) return "less than an hour";
  if (h === 1) return "1 hour";
  return `${h} hours`;
}

function hoursUntil(ts) {
  const nextRun = ts + 24 * 60 * 60 * 1000;
  const ms = nextRun - Date.now();
  if (ms <= 0) return "any moment";
  const h = Math.floor(ms / (1000 * 60 * 60));
  if (h < 1) return "less than an hour";
  if (h === 1) return "1 hour";
  return `${h} hours`;
}

function formatDate(ts) {
  return new Date(ts).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Sparkline ────────────────────────────────────────────────────────────────

function Sparkline({ audits }) {
  // listAudits returns desc; reverse for chronological left→right
  const data = [...audits].reverse();

  if (data.length < 2) {
    return (
      <div style={{
        background: WHITE, borderRadius: 12, border: `1px solid ${LIGHT}`,
        padding: "20px 24px", textAlign: "center",
        color: MUTED, fontSize: 13, fontFamily: mono,
      }}>
        Building history — check back tomorrow
      </div>
    );
  }

  const VW = 600;
  const VH = 72;
  const PAD = 10;
  const MIN = 0;
  const MAX = 10;

  const pts = data.map((d, i) => ({
    x: PAD + (i / (data.length - 1)) * (VW - PAD * 2),
    y: VH - PAD - ((d.overallScore - MIN) / (MAX - MIN)) * (VH - PAD * 2),
    score: d.overallScore,
    date: formatDate(d.runAt),
  }));

  const lineD = pts.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");
  const areaD = `${lineD} L ${pts[pts.length - 1].x.toFixed(1)} ${VH} L ${pts[0].x.toFixed(1)} ${VH} Z`;

  return (
    <div style={{
      background: WHITE, borderRadius: 12, border: `1px solid ${LIGHT}`,
      padding: "20px 24px",
    }}>
      <div style={{
        display: "flex", justifyContent: "space-between", alignItems: "center",
        marginBottom: 12,
      }}>
        <div style={{
          fontSize: 11, color: MUTED, fontFamily: mono,
          textTransform: "uppercase", letterSpacing: "0.06em",
        }}>
          Overall score — last {data.length} audits
        </div>
        <div style={{
          fontSize: 11, color: MUTED, fontFamily: mono,
          display: "flex", gap: 16,
        }}>
          <span>{formatDate(data[0].runAt)}</span>
          <span>{formatDate(data[data.length - 1].runAt)}</span>
        </div>
      </div>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: "100%", height: 72, display: "block" }}
        preserveAspectRatio="none"
      >
        {/* Area fill */}
        <path d={areaD} fill={`${ACCENT}18`} />
        {/* Line */}
        <path
          d={lineD}
          fill="none"
          stroke={ACCENT}
          strokeWidth={2}
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        {/* Dots + score labels */}
        {pts.map((p, i) => (
          <g key={i}>
            <circle cx={p.x} cy={p.y} r={3.5} fill={ACCENT} />
            <circle cx={p.x} cy={p.y} r={6} fill="transparent" />
          </g>
        ))}
      </svg>
      {/* Score labels below */}
      <div style={{
        display: "flex", justifyContent: "space-between",
        marginTop: 8,
      }}>
        {pts.map((p, i) => (
          <div key={i} style={{ textAlign: "center", minWidth: 0 }}>
            <div style={{
              fontSize: 11, fontFamily: mono, fontWeight: 700,
              color: scoreColor(p.score),
            }}>
              {p.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Score Card ───────────────────────────────────────────────────────────────

function ScoreCard({ label, score }) {
  const color = scoreColor(score);
  const pct = (score / 10) * 100;

  return (
    <div style={{
      background: WHITE, border: `1px solid ${LIGHT}`,
      borderRadius: 12, padding: "20px 12px",
      display: "flex", flexDirection: "column",
      alignItems: "center", gap: 10,
    }}>
      {/* Ring with score centered inside */}
      <div style={{
        position: "relative",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: 56,
        height: 56,
      }}>
        <Ring pct={pct} color={color} size={56} stroke={5} />
        <div style={{
          position: "absolute",
          fontSize: 13, fontWeight: 700,
          color, fontFamily: mono, lineHeight: 1,
          userSelect: "none",
        }}>
          <AnimNum value={score} suffix="" />
        </div>
      </div>
      {/* Label */}
      <div style={{
        fontSize: 12, fontWeight: 600, color: INK,
        textAlign: "center", letterSpacing: "-0.01em",
      }}>
        {label}
      </div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function SEOHealthTab() {
  const latest  = useQuery(api.seoAudits.getLatestAudit, { projectId: "wcorwin" });
  const history = useQuery(api.seoAudits.listAudits,     { projectId: "wcorwin", limit: 7 });

  const [reportOpen, setReportOpen] = useState(false);

  // ── Loading ──
  if (latest === undefined || history === undefined) {
    return (
      <div style={{ fontFamily: font, background: BG, minHeight: "100vh", color: INK }}>
        <div style={{
          padding: "60px 24px", display: "flex",
          alignItems: "center", justifyContent: "center", gap: 10,
          color: MUTED, fontSize: 14, fontFamily: mono,
        }}>
          <span style={{ fontSize: 18, opacity: 0.6 }}>⏳</span>
          Loading audit data…
        </div>
      </div>
    );
  }

  // ── No data yet ──
  if (!latest) {
    return (
      <div style={{ fontFamily: font, background: BG, minHeight: "100vh", color: INK }}>
        <div style={{
          maxWidth: 440, margin: "64px auto", padding: "0 24px",
          textAlign: "center",
        }}>
          <div style={{
            background: WHITE, border: `1px solid ${LIGHT}`,
            borderRadius: 16, padding: "40px 32px",
          }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🕐</div>
            <div style={{
              fontSize: 16, fontWeight: 700, color: INK,
              marginBottom: 8, letterSpacing: "-0.02em",
            }}>
              First audit pending
            </div>
            <div style={{
              fontSize: 14, color: MUTED, lineHeight: 1.65,
            }}>
              Check back in 24 hours. The SEO engine runs daily and will
              populate this dashboard once it has results.
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Has data ──
  return (
    <div style={{ fontFamily: font, background: BG, minHeight: "100vh", color: INK }}>
      {/* Page header */}
      <div style={{
        background: WHITE, borderBottom: `1px solid ${LIGHT}`,
        padding: "20px 24px",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{
            fontSize: 11, color: MUTED, fontFamily: mono,
            textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4,
          }}>
            SEO Health Dashboard
          </div>
          <div style={{
            display: "flex", alignItems: "baseline", justifyContent: "space-between",
            flexWrap: "wrap", gap: 8,
          }}>
            <div style={{
              fontSize: 20, fontWeight: 700, color: INK,
              letterSpacing: "-0.03em",
            }}>
              wcorwin.com
            </div>
            <div style={{
              fontSize: 12, color: MUTED, fontFamily: mono,
            }}>
              Last audit: {hoursAgo(latest.runAt)} ago · Next: in {hoursUntil(latest.runAt)}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 80px" }}>

        {/* A. Score cards */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(128px, 1fr))",
          gap: 12,
          marginBottom: 20,
        }}>
          {PILLARS.map(({ key, label }) => (
            <ScoreCard key={key} label={label} score={latest[key] ?? 0} />
          ))}
        </div>

        {/* B. Trend sparkline */}
        <div style={{ marginBottom: 20 }}>
          <Sparkline audits={history ?? []} />
        </div>

        {/* D. Recommendations */}
        {latest.recommendations?.length > 0 && (
          <div style={{
            background: WHITE, borderRadius: 12, border: `1px solid ${LIGHT}`,
            padding: "20px 24px", marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, color: MUTED, fontFamily: mono,
              textTransform: "uppercase", letterSpacing: "0.06em",
              marginBottom: 16,
            }}>
              Top Recommendations
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {latest.recommendations.map((rec, i) => (
                <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  {/* Urgency dot */}
                  <div style={{
                    width: 8, height: 8, borderRadius: "50%",
                    background: urgencyColor(i),
                    flexShrink: 0, marginTop: 6,
                  }} />
                  {/* Number + text */}
                  <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{
                      fontSize: 11, fontFamily: mono, fontWeight: 600,
                      color: MUTED, minWidth: 22, flexShrink: 0, marginTop: 2,
                    }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span style={{
                      fontSize: 14, color: BODY, lineHeight: 1.6,
                    }}>
                      {rec}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* C. Summary */}
        {latest.summary && (
          <div style={{
            background: WHITE, borderRadius: 12, border: `1px solid ${LIGHT}`,
            padding: "20px 24px", marginBottom: 20,
          }}>
            <div style={{
              fontSize: 11, color: MUTED, fontFamily: mono,
              textTransform: "uppercase", letterSpacing: "0.06em",
              marginBottom: 10,
            }}>
              Audit Summary
            </div>
            <p style={{
              margin: 0, fontSize: 14, color: BODY, lineHeight: 1.7,
            }}>
              {latest.summary}
            </p>
          </div>
        )}

        {/* E. Full report toggle */}
        {latest.rawReport && (
          <div style={{
            background: WHITE, borderRadius: 12, border: `1px solid ${LIGHT}`,
            overflow: "hidden",
          }}>
            <button
              onClick={() => setReportOpen((o) => !o)}
              style={{
                width: "100%", padding: "14px 24px",
                display: "flex", alignItems: "center", justifyContent: "space-between",
                background: "none", border: "none",
                borderBottom: reportOpen ? `1px solid ${LIGHT}` : "none",
                cursor: "pointer", fontFamily: mono, fontSize: 13, color: INK,
                textAlign: "left", outline: "none",
              }}
            >
              <span>View full report</span>
              <span style={{
                display: "inline-block",
                transform: reportOpen ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.2s ease",
                fontSize: 14, lineHeight: 1,
              }}>
                ↓
              </span>
            </button>
            {reportOpen && (
              <pre style={{
                margin: 0, padding: "20px 24px",
                fontSize: 12, fontFamily: mono,
                color: BODY, lineHeight: 1.7,
                overflowX: "auto", maxHeight: 480, overflowY: "auto",
                whiteSpace: "pre-wrap", wordBreak: "break-word",
                background: BG,
              }}>
                {latest.rawReport}
              </pre>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
