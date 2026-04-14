import { useState, useEffect, useRef } from "react";

const ACCENT = "#e8541a";
const ACCENT_SOFT = "rgba(232, 84, 26, 0.08)";
const ACCENT_MED = "rgba(232, 84, 26, 0.15)";
const INK = "#111111";
const BODY = "#444444";
const MUTED = "#999999";
const LIGHT = "#e5e5e5";
const BG = "#fafaf9";
const WHITE = "#ffffff";
const GREEN = "#16a34a";
const GREEN_SOFT = "rgba(22, 163, 74, 0.08)";
const YELLOW = "#ca8a04";
const YELLOW_SOFT = "rgba(202, 138, 4, 0.08)";
const BLUE = "#2563eb";
const BLUE_SOFT = "rgba(37, 99, 235, 0.08)";

// Project data
const PROJECT = {
  name: "wcorwin.com SEO ENGINE",
  client: "Weichert Realtors — Corwin & Associates",
  location: "New Braunfels, TX",
  contact: "Joe Corwin (Owner) · Deanna Bazan (Office Mgr)",
  advisor: "Edward (Advisor)",
  retainer: "$950/mo",
  startDate: "March 2026",
  platform: "iHouseWeb (iHouseElite)",
};

const PHASES = [
  {
    id: "kickoff",
    label: "Kickoff",
    subtitle: "Foundation Setup",
    color: ACCENT,
    softColor: ACCENT_SOFT,
    icon: "⚡",
    fee: "One-Time",
    tasks: [
      { name: "SEO audit delivered", status: "done", detail: "Full 5-pillar audit completed" },
      { name: "Contract signed & returned", status: "done", detail: "Month-to-month at $950/mo" },
      { name: "Month 1 payment received", status: "done", detail: "$950 paid 2026-03-09 (Visa -1802)" },
      { name: "GSC access requested", status: "active", detail: "Email sent to Deanna with setup steps" },
      { name: "GBP access requested", status: "active", detail: "Manager role invite for tatis.anthony@gmail.com" },
      { name: "iHouseWeb admin access", status: "done", detail: "Admin access granted 2026-03-14" },
      { name: "Kickoff strategy call", status: "pending", detail: "Align on Month 1 priorities" },
    ],
  },
  {
    id: "month1",
    label: "Month 1",
    subtitle: "Fix the Foundation",
    color: ACCENT,
    softColor: ACCENT_SOFT,
    icon: "🔧",
    fee: "$950",
    tasks: [
      { name: "Rewrite all title tags", status: "pending", detail: "Unique title for every key non-IDX page" },
      { name: "Write unique meta descriptions", status: "pending", detail: "Eliminate site-wide duplication" },
      { name: "Implement LocalBusiness schema", status: "pending", detail: "JSON-LD: RealEstateAgent + Person for Joe" },
      { name: "Verify & submit XML sitemap", status: "pending", detail: "Confirm at /sitemap.xml → GSC + Bing" },
      { name: "Optimize Google Business Profile", status: "pending", detail: "Photos, messaging, categories, hours" },
      { name: "Baseline keyword tracking setup", status: "pending", detail: "Top 20 target keywords documented" },
      { name: "Client sign-off on foundation", status: "pending", detail: "Required before Month 2 begins" },
    ],
  },
  {
    id: "month2",
    label: "Month 2",
    subtitle: "Content Goes Live",
    color: YELLOW,
    softColor: YELLOW_SOFT,
    icon: "📝",
    fee: "$950",
    tasks: [
      { name: "Canyon Lake neighborhood guide", status: "pending", detail: "500+ words + internal links" },
      { name: "Gruene, TX neighborhood guide", status: "pending", detail: "500+ words + internal links" },
      { name: "Buyer Rebate Program page", status: "pending", detail: "Dedicated landing page — own this keyword" },
      { name: "VA / Military Homebuyer page", status: "pending", detail: "Perfect brand fit: veteran-owned office" },
      { name: "Homepage content expansion", status: "pending", detail: "Add 400-600 words above IDX feed" },
      { name: "First keyword movement report", status: "pending", detail: "Rankings vs. baseline comparison" },
    ],
  },
  {
    id: "month3",
    label: "Month 3",
    subtitle: "Build Authority",
    color: GREEN,
    softColor: GREEN_SOFT,
    icon: "🏗️",
    fee: "$950",
    tasks: [
      { name: "Chamber of Commerce listing", status: "pending", detail: "NB Chamber — citation + backlink" },
      { name: "Military directory submissions", status: "pending", detail: "VetBiz + 4 military relocation sites" },
      { name: "FAQ schema implementation", status: "pending", detail: "Buyer/seller FAQ → featured snippet potential" },
      { name: "Market Report 2026 published", status: "pending", detail: "NB TX real estate market data" },
      { name: "First-Time Homebuyer Guide", status: "pending", detail: "Long-form content play" },
      { name: "90-day performance review", status: "pending", detail: "Impressions, clicks, rankings vs. baseline" },
    ],
  },
  {
    id: "ongoing",
    label: "Ongoing",
    subtitle: "Month-to-Month Retainer",
    color: BLUE,
    softColor: BLUE_SOFT,
    icon: "🔄",
    fee: "$950/mo",
    tasks: [
      { name: "2 content pieces per month", status: "pending", detail: "Guides, blog posts, market reports" },
      { name: "Monthly rank tracking report", status: "pending", detail: "Top 20 keywords + movement" },
      { name: "GBP management", status: "pending", detail: "Posts, Q&A, review responses" },
      { name: "1 technical SEO task/month", status: "pending", detail: "Schema, internal linking, speed fixes" },
      { name: "Monthly performance summary", status: "pending", detail: "Plain-English report to client" },
    ],
  },
];

const STATUS_CONFIG = {
  done: { label: "Complete", color: GREEN, bg: GREEN_SOFT, icon: "✓" },
  active: { label: "In Progress", color: ACCENT, bg: ACCENT_SOFT, icon: "◉" },
  pending: { label: "Upcoming", color: MUTED, bg: "#f5f5f5", icon: "○" },
};

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

// Animated counter
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

// Mini progress ring
function Ring({ pct, color, size = 48, stroke = 4 }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={LIGHT} strokeWidth={stroke} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.8s ease" }} />
    </svg>
  );
}

export default function SEOJourneyTracker() {
  const [activePhase, setActivePhase] = useState(getCurrentPhase(PHASES));
  const [hoveredTask, setHoveredTask] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [notesSubmitted, setNotesSubmitted] = useState(null);
  const [signatureDraft, setSignatureDraft] = useState("");
  const [signatureSubmitted, setSignatureSubmitted] = useState(null);
  const [showSendBothConfirm, setShowSendBothConfirm] = useState(false);
  const [signoffDone, setSignoffDone] = useState(false);
  const phase = PHASES[activePhase];
  const effectivePhaseTasks = phase.tasks.map((t, i) =>
    (activePhase === 1 && i === 6 && signoffDone) ? { ...t, status: "done" } : t
  );
  const progress = getPhaseProgress(effectivePhaseTasks);

  const totalTasks = PHASES.reduce((a, p) => a + p.tasks.length, 0);
  const totalDone = PHASES.reduce((a, p) => a + p.tasks.filter(t => t.status === "done").length, 0);
  const totalActive = PHASES.reduce((a, p) => a + p.tasks.filter(t => t.status === "active").length, 0);
  const overallPct = Math.round(((totalDone + totalActive * 0.5) / totalTasks) * 100);

  function handleNotesSubmit() {
    setNotesSubmitted(notesDraft);
  }

  function handleSignatureSubmit() {
    if (notesDraft.trim() && !notesSubmitted) {
      setShowSendBothConfirm(true);
    } else {
      setSignatureSubmitted(signatureDraft);
      setSignoffDone(true);
    }
  }

  function handleSendBoth() {
    setNotesSubmitted(notesDraft);
    setSignatureSubmitted(signatureDraft);
    setSignoffDone(true);
    setShowSendBothConfirm(false);
  }

  function handleSignatureOnly() {
    setSignatureSubmitted(signatureDraft);
    setSignoffDone(true);
    setShowSendBothConfirm(false);
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Satoshi', -apple-system, sans-serif",
      background: BG, minHeight: "100vh", color: INK,
    }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&display=swap" rel="stylesheet" />

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
        <span style={{
          color: "rgba(255,255,255,0.4)", fontSize: 11,
          fontFamily: "'DM Mono', monospace",
        }}>
          Anthony's SEO Engine
        </span>
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

          {/* Phase legend pills */}
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
            {effectivePhaseTasks.map((task, i) => {
              const cfg = STATUS_CONFIG[task.status];
              const isHovered = hoveredTask === `${activePhase}-${i}`;
              const isSignoffTask = activePhase === 1 && i === 6;
              return (
                <div key={i}>
                  <div
                    onMouseEnter={() => setHoveredTask(`${activePhase}-${i}`)}
                    onMouseLeave={() => setHoveredTask(null)}
                    style={{
                      padding: "14px 24px", display: "flex",
                      alignItems: "flex-start", gap: 14,
                      borderBottom: !isSignoffTask && i < effectivePhaseTasks.length - 1 ? `1px solid #f0f0f0` : "none",
                      background: isHovered ? "#fafafa" : "transparent",
                      transition: "background 0.15s", cursor: "default",
                    }}
                  >
                    {/* Status indicator */}
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

                    {/* Status badge */}
                    <span style={{
                      fontSize: 10, padding: "3px 8px", borderRadius: 20,
                      background: cfg.bg, color: cfg.color,
                      fontWeight: 600, whiteSpace: "nowrap", marginTop: 3,
                      fontFamily: "'DM Mono', monospace",
                    }}>
                      {cfg.label}
                    </span>
                  </div>

                  {/* Sign-off panel */}
                  {isSignoffTask && !signoffDone && (
                    <div style={{ margin: "0 24px 16px", borderRadius: 10, border: `1px solid ${ACCENT_MED}`, background: ACCENT_SOFT, overflow: "hidden" }}>
                      {/* Notes section */}
                      <div style={{ padding: "16px 20px", borderBottom: `1px solid ${ACCENT_MED}` }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                          Notes
                        </div>
                        {notesSubmitted ? (
                          <div style={{ fontSize: 13, color: BODY, background: WHITE, padding: "10px 12px", borderRadius: 6, border: `1px solid ${LIGHT}` }}>
                            <div style={{ whiteSpace: "pre-wrap" }}>{notesSubmitted}</div>
                            <div style={{ fontSize: 10, color: GREEN, marginTop: 6, fontFamily: "'DM Mono', monospace", fontWeight: 600 }}>✓ Notes submitted</div>
                          </div>
                        ) : (
                          <>
                            <textarea
                              value={notesDraft}
                              onChange={e => setNotesDraft(e.target.value)}
                              placeholder="Any final notes before sign-off..."
                              rows={3}
                              style={{ width: "100%", resize: "vertical", padding: "10px 12px", borderRadius: 6, border: `1px solid ${LIGHT}`, fontSize: 13, fontFamily: "'DM Sans', -apple-system, sans-serif", color: INK, background: WHITE, outline: "none", boxSizing: "border-box", display: "block" }}
                            />
                            <button
                              disabled={!notesDraft.trim()}
                              onClick={handleNotesSubmit}
                              style={{ marginTop: 8, fontSize: 11, padding: "5px 14px", borderRadius: 6, border: "none", background: notesDraft.trim() ? ACCENT : "#e8e8e8", color: notesDraft.trim() ? WHITE : MUTED, fontWeight: 600, cursor: notesDraft.trim() ? "pointer" : "default", fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em" }}
                            >
                              Submit Notes
                            </button>
                          </>
                        )}
                      </div>

                      {/* Signature section */}
                      <div style={{ padding: "16px 20px" }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                          Signature
                        </div>
                        <input
                          value={signatureDraft}
                          onChange={e => setSignatureDraft(e.target.value)}
                          placeholder="Type full name to sign"
                          style={{ width: "100%", padding: "10px 12px", borderRadius: 6, border: `1px solid ${LIGHT}`, fontSize: 15, fontFamily: "Georgia, 'Times New Roman', serif", color: INK, background: WHITE, outline: "none", boxSizing: "border-box", display: "block", fontStyle: "italic", letterSpacing: "0.02em" }}
                        />
                        {showSendBothConfirm ? (
                          <div style={{ marginTop: 12, padding: "12px 16px", borderRadius: 8, background: YELLOW_SOFT, border: `1px solid ${YELLOW}`, display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <span style={{ fontSize: 12, color: YELLOW, fontWeight: 500, flex: 1, minWidth: 160 }}>You have unsaved notes — send both?</span>
                            <div style={{ display: "flex", gap: 8 }}>
                              <button onClick={handleSendBoth} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, border: "none", background: YELLOW, color: WHITE, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>Send Both</button>
                              <button onClick={handleSignatureOnly} style={{ fontSize: 11, padding: "6px 14px", borderRadius: 6, border: `1px solid ${YELLOW}`, background: "transparent", color: YELLOW, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Mono', monospace" }}>Signature Only</button>
                            </div>
                          </div>
                        ) : (
                          <button
                            disabled={!signatureDraft.trim()}
                            onClick={handleSignatureSubmit}
                            style={{ marginTop: 10, fontSize: 11, padding: "6px 16px", borderRadius: 6, border: "none", background: signatureDraft.trim() ? GREEN : "#e8e8e8", color: signatureDraft.trim() ? WHITE : MUTED, fontWeight: 700, cursor: signatureDraft.trim() ? "pointer" : "default", fontFamily: "'DM Mono', monospace", letterSpacing: "0.03em" }}
                          >
                            Sign & Complete Month 1
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completion banner */}
                  {isSignoffTask && signoffDone && (
                    <div style={{ margin: "0 24px 20px", borderRadius: 10, padding: "18px 20px", background: GREEN_SOFT, border: `1px solid ${GREEN}`, display: "flex", alignItems: "center", gap: 16 }}>
                      <div style={{ width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <span style={{ color: WHITE, fontSize: 18, fontWeight: 700 }}>✓</span>
                      </div>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Month 1 Foundation Complete</div>
                        <div style={{ fontSize: 12, color: BODY, marginTop: 2 }}>
                          Signed by <em>{signatureSubmitted}</em>
                          {notesSubmitted && " · Notes on file"}
                        </div>
                      </div>
                    </div>
                  )}
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
