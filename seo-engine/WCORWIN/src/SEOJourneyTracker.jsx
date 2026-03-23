import { useState, useEffect } from "react";
import {
  ACCENT, ACCENT_SOFT, INK, BODY, MUTED, LIGHT, BG, WHITE, GREEN,
  PROJECT, PHASES, STATUS_CONFIG,
} from "./data";

function getPhaseProgress(tasks) {
  const done = tasks.filter((t) => t.status === "done").length;
  const active = tasks.filter((t) => t.status === "active").length;
  return { done, active, total: tasks.length, pct: Math.round(((done + active * 0.5) / tasks.length) * 100) };
}

function getCurrentPhase(phases) {
  for (let i = phases.length - 1; i >= 0; i--) {
    const p = getPhaseProgress(phases[i].tasks);
    if (p.done > 0 || p.active > 0) return i;
  }
  return 0;
}

function AnimNum({ value, suffix = "%" }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(value / 30));
    const id = setInterval(() => {
      start += step;
      if (start >= value) { start = value; clearInterval(id); }
      setDisplay(start);
    }, 25);
    return () => clearInterval(id);
  }, [value]);
  return <span>{display}{suffix}</span>;
}

function Ring({ pct, color, size = 48, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={LIGHT} strokeWidth={stroke} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

export default function SEOJourneyTracker({ onLogout }) {
  const [activePhase, setActivePhase] = useState(getCurrentPhase(PHASES));
  const [hoveredTask, setHoveredTask] = useState(null);
  const phase = PHASES[activePhase];
  const progress = getPhaseProgress(phase.tasks);

  const totalTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);
  const totalDone = PHASES.reduce((a, p) => a + p.tasks.filter(t => t.status === "done").length, 0);
  const totalActive = PHASES.reduce((a, p) => a + p.tasks.filter(t => t.status === "active").length, 0);
  const overallPct = Math.round(((totalDone + totalActive * 0.5) / totalTasks) * 100);

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Satoshi', -apple-system, sans-serif",
      background: BG, minHeight: "100vh", color: INK,
    }}>
      {/* Top Bar */}
      <div style={{
        background: INK, padding: "14px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between", gap: 16,
        borderBottom: `3px solid ${ACCENT}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: ACCENT, boxShadow: `0 0 8px ${ACCENT}`,
          }} />
          <span style={{
            color: WHITE, fontFamily: "'DM Mono', monospace",
            fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            {PROJECT.name}
          </span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            color: "rgba(255,255,255,0.4)", fontSize: 11,
            fontFamily: "'DM Mono', monospace",
          }}>
            Anthony's SEO Engine
          </span>
          {onLogout && (
            <button onClick={onLogout} style={{
              background: "transparent", border: "1px solid rgba(255,255,255,0.2)",
              color: "rgba(255,255,255,0.5)", fontSize: 11, padding: "4px 10px",
              borderRadius: 6, cursor: "pointer", fontFamily: "'DM Mono', monospace",
              letterSpacing: "0.04em",
            }}>
              sign out
            </button>
          )}
        </div>
      </div>

      {/* Client Info Bar */}
      <div style={{
        background: WHITE, borderBottom: `1px solid ${LIGHT}`,
        padding: "16px 24px", display: "flex", flexWrap: "wrap",
        gap: "12px 32px", alignItems: "center",
      }}>
        {[
          ["Client", PROJECT.client],
          ["Market", PROJECT.location],
          ["Contacts", PROJECT.contact],
          ["Platform", PROJECT.platform],
          ["Retainer", PROJECT.retainer],
          ["Started", PROJECT.startDate],
        ].map(([label, val]) => (
          <div key={label} style={{ display: "flex", gap: 6, alignItems: "baseline" }}>
            <span style={{ fontSize: 10, color: MUTED, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
            <span style={{ fontSize: 13, color: BODY, fontWeight: 500 }}>{val}</span>
          </div>
        ))}
      </div>

      {/* Overall Progress */}
      <div style={{ padding: "24px 24px 0" }}>
        <div style={{
          background: WHITE, borderRadius: 12, padding: "20px 24px",
          border: `1px solid ${LIGHT}`, display: "flex",
          alignItems: "center", gap: 24, flexWrap: "wrap",
        }}>
          <div style={{ position: "relative", width: 64, height: 64, flexShrink: 0 }}>
            <Ring pct={overallPct} color={ACCENT} size={64} stroke={5} />
            <div style={{
              position: "absolute", inset: 0, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: 15, fontWeight: 700, color: ACCENT,
              fontFamily: "'DM Mono', monospace",
            }}>
              <AnimNum value={overallPct} />
            </div>
          </div>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>Overall Project Progress</div>
            <div style={{ fontSize: 12, color: MUTED }}>
              {totalDone} complete · {totalActive} in progress · {totalTasks - totalDone - totalActive} upcoming
            </div>
            <div style={{
              marginTop: 10, height: 6, borderRadius: 3,
              background: "#eee", overflow: "hidden", display: "flex",
            }}>
              <div style={{ width: `${(totalDone / totalTasks) * 100}%`, background: GREEN, transition: "width 0.6s" }} />
              <div style={{ width: `${(totalActive / totalTasks) * 100}%`, background: ACCENT, transition: "width 0.6s" }} />
            </div>
          </div>

          {/* Status legend pills */}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
              <span key={key} style={{
                fontSize: 11, padding: "3px 10px", borderRadius: 20,
                background: cfg.bg, color: cfg.color, fontWeight: 600,
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <span style={{ fontSize: 10 }}>{cfg.icon}</span> {cfg.label}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Phase Navigation */}
      <div style={{ padding: "16px 24px 0", overflowX: "auto" }}>
        <div style={{ display: "flex", gap: 6, minWidth: "max-content" }}>
          {PHASES.map((p, i) => {
            const prog = getPhaseProgress(p.tasks);
            const isActive = i === activePhase;
            const isCurrent = i === getCurrentPhase(PHASES);
            return (
              <button key={p.id} onClick={() => setActivePhase(i)} style={{
                border: isActive ? `2px solid ${p.color}` : `1px solid ${LIGHT}`,
                background: isActive ? p.softColor : WHITE,
                borderRadius: 10, padding: "12px 16px", cursor: "pointer",
                minWidth: 130, textAlign: "left", position: "relative",
                transition: "all 0.2s",
              }}>
                {isCurrent && (
                  <div style={{
                    position: "absolute", top: -4, right: -4,
                    width: 10, height: 10, borderRadius: "50%",
                    background: ACCENT, border: `2px solid ${WHITE}`,
                  }} />
                )}
                <div style={{ fontSize: 18, marginBottom: 4 }}>{p.icon}</div>
                <div style={{
                  fontSize: 12, fontWeight: 700, color: isActive ? p.color : INK,
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em",
                }}>{p.label}</div>
                <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>{p.subtitle}</div>
                <div style={{
                  marginTop: 8, height: 3, borderRadius: 2,
                  background: "#eee", overflow: "hidden",
                }}>
                  <div style={{
                    width: `${prog.pct}%`, height: "100%",
                    background: p.color, borderRadius: 2,
                    transition: "width 0.4s",
                  }} />
                </div>
                <div style={{
                  fontSize: 10, color: MUTED, marginTop: 4,
                  fontFamily: "'DM Mono', monospace",
                }}>
                  {prog.done}/{prog.total}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Phase Detail */}
      <div style={{ padding: "16px 24px 32px" }}>
        <div style={{
          background: WHITE, borderRadius: 12,
          border: `1px solid ${LIGHT}`, overflow: "hidden",
        }}>
          {/* Phase header */}
          <div style={{
            padding: "20px 24px 16px", borderBottom: `1px solid ${LIGHT}`,
            display: "flex", alignItems: "center", justifyContent: "space-between",
            flexWrap: "wrap", gap: 12,
          }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 24 }}>{phase.icon}</span>
                <div>
                  <div style={{
                    fontFamily: "'DM Mono', monospace", fontSize: 11,
                    color: phase.color, fontWeight: 600, letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}>
                    {phase.label} — {phase.fee}
                  </div>
                  <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>{phase.subtitle}</div>
                </div>
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{
                fontSize: 28, fontWeight: 700, color: phase.color,
                fontFamily: "'DM Mono', monospace",
              }}>
                <AnimNum value={progress.pct} />
              </div>
              <div style={{ fontSize: 11, color: MUTED }}>phase progress</div>
            </div>
          </div>

          {/* Task list */}
          <div style={{ padding: "8px 0" }}>
            {phase.tasks.map((task, i) => {
              const cfg = STATUS_CONFIG[task.status];
              const isHovered = hoveredTask === `${activePhase}-${i}`;
              return (
                <div key={i}
                  onMouseEnter={() => setHoveredTask(`${activePhase}-${i}`)}
                  onMouseLeave={() => setHoveredTask(null)}
                  style={{
                    padding: "14px 24px", display: "flex",
                    alignItems: "flex-start", gap: 14,
                    borderBottom: i < phase.tasks.length - 1 ? `1px solid #f0f0f0` : "none",
                    background: isHovered ? "#fafafa" : "transparent",
                    transition: "background 0.15s", cursor: "default",
                  }}
                >
                  <div style={{
                    width: 26, height: 26, borderRadius: "50%",
                    background: cfg.bg, display: "flex",
                    alignItems: "center", justifyContent: "center",
                    flexShrink: 0, marginTop: 1,
                    border: task.status === "active" ? `2px solid ${cfg.color}` : "none",
                  }}>
                    <span style={{
                      fontSize: task.status === "done" ? 14 : 12,
                      color: cfg.color, fontWeight: 700,
                    }}>
                      {cfg.icon}
                    </span>
                  </div>

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{
                      fontSize: 14, fontWeight: 500,
                      color: task.status === "done" ? GREEN : INK,
                      textDecoration: task.status === "done" ? "line-through" : "none",
                      opacity: task.status === "pending" ? 0.7 : 1,
                    }}>
                      {task.name}
                    </div>
                    <div style={{
                      fontSize: 12, color: MUTED, marginTop: 3,
                      lineHeight: 1.4,
                    }}>
                      {task.detail}
                    </div>
                  </div>

                  <span style={{
                    fontSize: 10, padding: "3px 8px", borderRadius: 20,
                    background: cfg.bg, color: cfg.color,
                    fontWeight: 600, whiteSpace: "nowrap", marginTop: 3,
                    fontFamily: "'DM Mono', monospace",
                  }}>
                    {cfg.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: "12px 24px 24px", textAlign: "center",
        color: MUTED, fontSize: 11,
        fontFamily: "'DM Mono', monospace",
      }}>
        Anthony's SEO Engine · wcorwin.com · {new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" })}
      </div>
    </div>
  );
}
