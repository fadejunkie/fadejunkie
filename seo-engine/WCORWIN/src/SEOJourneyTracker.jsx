import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { marked } from "marked";
import {
  ACCENT, ACCENT_SOFT, INK, BODY, MUTED, LIGHT, BG, WHITE, GREEN,
  PROJECT, PHASES, STATUS_CONFIG,
} from "./data";

const IS_ADMIN = import.meta.env.VITE_ADMIN === "true";
const PROJECT_ID = "wcorwin";
const STATUS_CYCLE = ["pending", "active", "done"];

function applyOverrides(phases, overrides) {
  if (!overrides) return phases;
  return phases.map((phase) => ({
    ...phase,
    tasks: phase.tasks.map((task, ti) => {
      const key = `${phase.id}:${ti}`;
      const ov = overrides[key];
      if (!ov) return task;
      return {
        ...task,
        ...(ov.status ? { status: ov.status } : {}),
        ...(ov.name ? { name: ov.name } : {}),
        ...(ov.detail ? { detail: ov.detail } : {}),
        ...(ov.doc ? { doc: ov.doc } : {}),
      };
    }),
  }));
}

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

function InlineEdit({ value, onSave, style }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef(null);

  useEffect(() => { setDraft(value); }, [value]);
  useEffect(() => { if (editing && inputRef.current) inputRef.current.focus(); }, [editing]);

  const save = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onSave(trimmed);
    else setDraft(value);
  };

  if (!editing) {
    return (
      <span
        onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
        style={{ ...style, cursor: "text" }}
        title="Double-click to edit"
      >
        {value}
      </span>
    );
  }

  return (
    <input
      ref={inputRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onKeyDown={(e) => {
        if (e.key === "Enter") save();
        if (e.key === "Escape") { setDraft(value); setEditing(false); }
      }}
      onClick={(e) => e.stopPropagation()}
      style={{
        ...style,
        border: `1px solid ${ACCENT}`,
        borderRadius: 4,
        padding: "2px 6px",
        outline: "none",
        width: "100%",
        fontFamily: "inherit",
        background: WHITE,
      }}
    />
  );
}

function InlineTextarea({ value, onSave, style }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value || "");
  const textareaRef = useRef(null);

  useEffect(() => { setDraft(value || ""); }, [value]);
  useEffect(() => { if (editing && textareaRef.current) textareaRef.current.focus(); }, [editing]);

  const save = () => {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed !== (value || "")) onSave(trimmed);
    else setDraft(value || "");
  };

  if (!editing) {
    return (
      <div
        onDoubleClick={(e) => { e.stopPropagation(); setEditing(true); }}
        style={{ ...style, cursor: "text", whiteSpace: "pre-wrap" }}
        title="Double-click to edit"
      >
        {value || "Click to add documentation..."}
      </div>
    );
  }

  return (
    <textarea
      ref={textareaRef}
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={save}
      onClick={(e) => e.stopPropagation()}
      rows={4}
      style={{
        ...style,
        border: `1px solid ${ACCENT}`,
        borderRadius: 4,
        padding: "6px 8px",
        outline: "none",
        width: "100%",
        fontFamily: "inherit",
        background: WHITE,
        resize: "vertical",
        whiteSpace: "pre-wrap",
      }}
    />
  );
}

function DocViewer({ item, onClose }) {
  const [slide, setSlide] = useState(0);
  const isDoc = item.type === "doc" || item.type === "slides";
  const isImg = item.type === "image";
  const content = item.markdownContent || "";
  const slides = content.split(/\n---\n/);
  const html = isDoc ? marked.parse(slides[slide] || "") : "";

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, background: "rgba(0,0,0,0.65)",
        zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "#fff", borderRadius: 12, width: "100%", maxWidth: 760,
          maxHeight: "88vh", display: "flex", flexDirection: "column",
          overflow: "hidden", boxShadow: "0 24px 80px rgba(0,0,0,0.3)",
        }}
      >
        {/* Header */}
        <div style={{
          padding: "16px 20px", borderBottom: "1px solid #e5e7eb",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <span style={{
            fontSize: 10, padding: "2px 7px", borderRadius: 4, fontWeight: 700,
            fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
            background: item.type === "doc" ? "rgba(232,84,26,0.1)" : item.type === "slides" ? "rgba(232,84,26,0.15)" : item.type === "image" ? "#ecfdf5" : "#f3f4f6",
            color: item.type === "doc" || item.type === "slides" ? ACCENT : item.type === "image" ? "#16a34a" : "#6b7280",
          }}>
            {item.type.toUpperCase()}
          </span>
          <span style={{ flex: 1, fontSize: 14, fontWeight: 600, color: "#111" }}>{item.label}</span>
          {item.url && (
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
              fontSize: 11, color: ACCENT, textDecoration: "none", fontFamily: "'DM Mono', monospace",
            }}>↗ open</a>
          )}
          <button onClick={onClose} style={{
            background: "none", border: "none", cursor: "pointer",
            fontSize: 18, color: "#9ca3af", padding: "0 4px",
          }}>×</button>
        </div>

        {/* Body */}
        <div style={{ flex: 1, overflow: "auto", padding: 24 }}>
          {isImg && item.url && (
            <img src={item.url} alt={item.label} style={{ maxWidth: "100%", borderRadius: 8 }} />
          )}
          {isDoc && content && (
            <div
              dangerouslySetInnerHTML={{ __html: html }}
              style={{
                fontSize: 14, lineHeight: 1.7, color: "#374151",
                fontFamily: "'DM Sans', sans-serif",
              }}
            />
          )}
          {!isImg && !content && item.url && (
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <a href={item.url} target="_blank" rel="noopener noreferrer" style={{
                color: ACCENT, fontSize: 14, fontFamily: "'DM Mono', monospace",
              }}>
                Open {item.label} ↗
              </a>
            </div>
          )}
        </div>

        {/* Slide nav */}
        {item.type === "slides" && slides.length > 1 && (
          <div style={{
            padding: "12px 20px", borderTop: "1px solid #e5e7eb",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0} style={{
              background: "none", border: `1px solid #e5e7eb`, borderRadius: 6,
              padding: "4px 10px", cursor: slide === 0 ? "default" : "pointer",
              color: slide === 0 ? "#d1d5db" : "#374151", fontSize: 12,
            }}>←</button>
            {slides.map((_, i) => (
              <button key={i} onClick={() => setSlide(i)} style={{
                width: 8, height: 8, borderRadius: "50%", border: "none", cursor: "pointer",
                background: i === slide ? ACCENT : "#d1d5db", padding: 0,
              }} />
            ))}
            <button onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} disabled={slide === slides.length - 1} style={{
              background: "none", border: `1px solid #e5e7eb`, borderRadius: 6,
              padding: "4px 10px", cursor: slide === slides.length - 1 ? "default" : "pointer",
              color: slide === slides.length - 1 ? "#d1d5db" : "#374151", fontSize: 12,
            }}>→</button>
          </div>
        )}
      </div>
    </div>
  );
}

function MilestoneDeliverables({ phaseId, deliverables, isAdmin, onAdd, onRemove, compact = false }) {
  const items = deliverables.filter(d => d.milestoneKey === phaseId);
  const [open, setOpen] = useState(false);
  const [viewing, setViewing] = useState(null);
  const [mode, setMode] = useState("url");
  const [form, setForm] = useState({ label: "", url: "", type: "doc", content: "" });

  const TYPE_BADGE = {
    doc: { bg: "rgba(232,84,26,0.1)", color: ACCENT },
    slides: { bg: "rgba(232,84,26,0.15)", color: ACCENT },
    image: { bg: "#ecfdf5", color: "#16a34a" },
    link: { bg: "#f3f4f6", color: "#6b7280" },
  };

  const submit = () => {
    if (!form.label.trim()) return;
    const hasContent = mode === "paste" && form.content.trim();
    const hasUrl = mode === "url" && form.url.trim();
    if (!hasContent && !hasUrl) return;
    onAdd({
      milestoneKey: phaseId,
      label: form.label.trim(),
      url: hasUrl ? form.url.trim() : undefined,
      type: form.type,
      addedAt: Date.now(),
      markdownContent: hasContent ? form.content.trim() : undefined,
    });
    setForm({ label: "", url: "", type: "doc", content: "" });
    setOpen(false);
  };

  if (items.length === 0 && !isAdmin) return null;

  // Compact mode: inline chips for per-task display, no header row
  if (compact) {
    return (
      <div style={{ padding: "4px 24px 10px 64px" }}>
        {viewing && <DocViewer item={viewing} onClose={() => setViewing(null)} />}

        {items.length > 0 ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: open ? 10 : 0 }}>
            {items.map(d => {
              const badge = TYPE_BADGE[d.type] || TYPE_BADGE.link;
              const clickable = d.markdownContent || d.url;
              return (
                <div key={d._id} style={{
                  display: "flex", alignItems: "center", gap: 5,
                  background: "#fafafa", border: "1px solid #e5e7eb",
                  borderRadius: 6, padding: "3px 8px 3px 6px",
                }}>
                  <span style={{
                    fontSize: 8, padding: "1px 4px", borderRadius: 3, fontWeight: 700,
                    fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                    background: badge.bg, color: badge.color,
                  }}>{d.type.toUpperCase()}</span>
                  <span
                    onClick={() => clickable && setViewing(d)}
                    style={{
                      fontSize: 11, color: clickable ? ACCENT : "#374151",
                      cursor: clickable ? "pointer" : "default",
                      textDecoration: clickable ? "underline" : "none",
                    }}
                  >{d.label}</span>
                  {isAdmin && (
                    <button onClick={() => onRemove(d._id)} style={{
                      background: "none", border: "none", cursor: "pointer",
                      color: "#d1d5db", fontSize: 12, padding: "0 2px", lineHeight: 1,
                    }}>×</button>
                  )}
                </div>
              );
            })}
            {isAdmin && (
              <button onClick={() => setOpen(o => !o)} style={{
                background: "none", border: "none", cursor: "pointer",
                fontSize: 9, color: open ? ACCENT : MUTED, padding: "0 4px",
                fontFamily: "'DM Mono', monospace", fontWeight: 600,
                textDecoration: "underline", lineHeight: 1.4,
              }}>
                {open ? "cancel" : "+ attach"}
              </button>
            )}
          </div>
        ) : (
          isAdmin && (
            <button onClick={() => setOpen(o => !o)} style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 9, color: open ? ACCENT : MUTED, padding: 0,
              fontFamily: "'DM Mono', monospace", fontWeight: 600,
              textDecoration: "underline", lineHeight: 1.4,
            }}>
              {open ? "cancel" : "+ attach"}
            </button>
          )
        )}

        {isAdmin && open && (
          <div style={{
            marginTop: 8, background: "#fafafa", border: "1px solid #e5e7eb",
            borderRadius: 8, padding: 12,
          }}>
            <div style={{ display: "flex", gap: 6, marginBottom: 8 }}>
              {["url", "paste"].map(m => (
                <button key={m} onClick={() => setMode(m)} style={{
                  fontSize: 9, padding: "2px 8px", borderRadius: 20, cursor: "pointer", fontWeight: 600,
                  fontFamily: "'DM Mono', monospace",
                  background: mode === m ? ACCENT : "transparent",
                  color: mode === m ? "#fff" : MUTED,
                  border: `1px solid ${mode === m ? ACCENT : "#e5e7eb"}`,
                }}>
                  {m === "url" ? "URL" : "PASTE"}
                </button>
              ))}
            </div>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              <input
                placeholder="Label"
                value={form.label}
                onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
                style={{
                  flex: 2, minWidth: 100, padding: "5px 8px", border: "1px solid #e5e7eb",
                  borderRadius: 6, fontSize: 11, fontFamily: "'DM Sans', sans-serif", outline: "none",
                }}
              />
              <select
                value={form.type}
                onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
                style={{
                  padding: "5px 8px", border: "1px solid #e5e7eb", borderRadius: 6,
                  fontSize: 11, fontFamily: "'DM Mono', sans-serif", background: "#fff",
                }}
              >
                <option value="doc">DOC</option>
                <option value="slides">SLIDES</option>
                <option value="image">IMAGE</option>
                <option value="link">LINK</option>
              </select>
            </div>
            {mode === "url" ? (
              <input
                placeholder="https://..."
                value={form.url}
                onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
                style={{
                  width: "100%", marginTop: 6, padding: "5px 8px", border: "1px solid #e5e7eb",
                  borderRadius: 6, fontSize: 11, fontFamily: "'DM Mono', monospace",
                  boxSizing: "border-box", outline: "none",
                }}
              />
            ) : (
              <textarea
                placeholder="Paste markdown content..."
                value={form.content}
                onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
                rows={4}
                style={{
                  width: "100%", marginTop: 6, padding: "5px 8px", border: "1px solid #e5e7eb",
                  borderRadius: 6, fontSize: 11, fontFamily: "'DM Mono', monospace",
                  boxSizing: "border-box", resize: "vertical", outline: "none",
                }}
              />
            )}
            <button onClick={submit} style={{
              marginTop: 8, padding: "5px 14px", background: ACCENT, color: "#fff",
              border: "none", borderRadius: 6, cursor: "pointer", fontSize: 11,
              fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            }}>
              Add
            </button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ padding: "0 24px 16px", borderTop: `1px solid #f0f0f0`, marginTop: 8, paddingTop: 16 }}>
      {viewing && <DocViewer item={viewing} onClose={() => setViewing(null)} />}

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <span style={{
          fontSize: 10, fontWeight: 700, color: MUTED,
          fontFamily: "'DM Mono', monospace", letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          Deliverables {items.length > 0 ? `(${items.length})` : ""}
        </span>
        {isAdmin && (
          <button onClick={() => setOpen(o => !o)} style={{
            fontSize: 10, padding: "3px 10px", borderRadius: 20,
            border: `1px solid ${ACCENT}`, background: open ? ACCENT : "transparent",
            color: open ? "#fff" : ACCENT, cursor: "pointer", fontWeight: 600,
            fontFamily: "'DM Mono', monospace",
          }}>
            {open ? "Cancel" : "+ ADD"}
          </button>
        )}
      </div>

      {/* Deliverables list */}
      {items.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: open ? 12 : 0 }}>
          {items.map(d => {
            const badge = TYPE_BADGE[d.type] || TYPE_BADGE.link;
            const clickable = d.markdownContent || d.url;
            return (
              <div key={d._id} style={{
                display: "flex", alignItems: "center", gap: 6,
                background: "#fafafa", border: "1px solid #e5e7eb",
                borderRadius: 6, padding: "4px 10px 4px 8px",
              }}>
                <span style={{
                  fontSize: 9, padding: "1px 5px", borderRadius: 3, fontWeight: 700,
                  fontFamily: "'DM Mono', monospace", letterSpacing: "0.06em",
                  background: badge.bg, color: badge.color,
                }}>{d.type.toUpperCase()}</span>
                <span
                  onClick={() => clickable && setViewing(d)}
                  style={{
                    fontSize: 12, color: clickable ? ACCENT : "#374151",
                    cursor: clickable ? "pointer" : "default",
                    textDecoration: clickable ? "underline" : "none",
                  }}
                >{d.label}</span>
                {isAdmin && (
                  <button onClick={() => onRemove(d._id)} style={{
                    background: "none", border: "none", cursor: "pointer",
                    color: "#d1d5db", fontSize: 13, padding: "0 2px", lineHeight: 1,
                  }}>×</button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Add form */}
      {isAdmin && open && (
        <div style={{
          background: "#fafafa", border: "1px solid #e5e7eb", borderRadius: 8, padding: 14,
        }}>
          <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
            {["url", "paste"].map(m => (
              <button key={m} onClick={() => setMode(m)} style={{
                fontSize: 10, padding: "3px 10px", borderRadius: 20, cursor: "pointer", fontWeight: 600,
                fontFamily: "'DM Mono', monospace",
                background: mode === m ? ACCENT : "transparent",
                color: mode === m ? "#fff" : MUTED,
                border: `1px solid ${mode === m ? ACCENT : "#e5e7eb"}`,
              }}>
                {m === "url" ? "URL" : "PASTE CONTENT"}
              </button>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <input
              placeholder="Label"
              value={form.label}
              onChange={e => setForm(f => ({ ...f, label: e.target.value }))}
              style={{
                flex: 2, minWidth: 120, padding: "6px 10px", border: "1px solid #e5e7eb",
                borderRadius: 6, fontSize: 12, fontFamily: "'DM Sans', sans-serif", outline: "none",
              }}
            />
            <select
              value={form.type}
              onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              style={{
                padding: "6px 10px", border: "1px solid #e5e7eb", borderRadius: 6,
                fontSize: 12, fontFamily: "'DM Mono', sans-serif", background: "#fff",
              }}
            >
              <option value="doc">DOC</option>
              <option value="slides">SLIDES</option>
              <option value="image">IMAGE</option>
              <option value="link">LINK</option>
            </select>
          </div>
          {mode === "url" ? (
            <input
              placeholder="https://..."
              value={form.url}
              onChange={e => setForm(f => ({ ...f, url: e.target.value }))}
              style={{
                width: "100%", marginTop: 8, padding: "6px 10px", border: "1px solid #e5e7eb",
                borderRadius: 6, fontSize: 12, fontFamily: "'DM Mono', monospace",
                boxSizing: "border-box", outline: "none",
              }}
            />
          ) : (
            <textarea
              placeholder="Paste markdown content..."
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={5}
              style={{
                width: "100%", marginTop: 8, padding: "6px 10px", border: "1px solid #e5e7eb",
                borderRadius: 6, fontSize: 12, fontFamily: "'DM Mono', monospace",
                boxSizing: "border-box", resize: "vertical", outline: "none",
              }}
            />
          )}
          <button onClick={submit} style={{
            marginTop: 10, padding: "6px 18px", background: ACCENT, color: "#fff",
            border: "none", borderRadius: 6, cursor: "pointer", fontSize: 12,
            fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
          }}>
            Add Deliverable
          </button>
        </div>
      )}
    </div>
  );
}

export default function SEOJourneyTracker() {
  const overrides = useQuery(api.wcorwinTasks.getOverrides, { projectId: PROJECT_ID });
  const setStatus = useMutation(api.wcorwinTasks.setStatus);
  const setText = useMutation(api.wcorwinTasks.setText);
  const setDocMut = useMutation(api.wcorwinTasks.setDoc);
  const deliverables = useQuery(api.wcorwinTasks.getDeliverables, { projectId: PROJECT_ID }) ?? [];
  const addDeliverableMut = useMutation(api.wcorwinTasks.addDeliverable);
  const removeDeliverableMut = useMutation(api.wcorwinTasks.removeDeliverable);

  const phases = applyOverrides(PHASES, overrides);
  const [activePhase, setActivePhase] = useState(() => getCurrentPhase(phases));
  const [showExtras, setShowExtras] = useState(false);
  const [hoveredTask, setHoveredTask] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const phase = phases[activePhase];
  const progress = getPhaseProgress(phase.tasks);

  const cycleStatus = useCallback((phaseId, taskIdx) => {
    if (!IS_ADMIN) return;
    const key = `${phaseId}:${taskIdx}`;
    const currentPhase = applyOverrides(PHASES, overrides).find(p => p.id === phaseId);
    const currentStatus = currentPhase.tasks[taskIdx].status;
    const nextIdx = (STATUS_CYCLE.indexOf(currentStatus) + 1) % STATUS_CYCLE.length;
    setStatus({ projectId: PROJECT_ID, taskKey: key, status: STATUS_CYCLE[nextIdx] });
  }, [overrides, setStatus]);

  const totalTasks = phases.reduce((a, p) => a + p.tasks.length, 0);
  const totalDone = phases.reduce((a, p) => a + p.tasks.filter(t => t.status === "done").length, 0);
  const totalActive = phases.reduce((a, p) => a + p.tasks.filter(t => t.status === "active").length, 0);
  const overallPct = Math.round(((totalDone + totalActive * 0.5) / totalTasks) * 100);

  // Loading state while Convex connects
  if (overrides === undefined) {
    return (
      <div style={{
        fontFamily: "'DM Sans', 'Satoshi', -apple-system, sans-serif",
        background: BG, minHeight: "100vh", color: INK,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: ACCENT, margin: "0 auto 12px",
            animation: "pulse 1.5s infinite",
          }} />
          <div style={{ fontSize: 13, color: MUTED, fontFamily: "'DM Mono', monospace" }}>
            Loading...
          </div>
          <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:0.3 } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', 'Satoshi', -apple-system, sans-serif",
      background: BG, minHeight: "100vh", color: INK,
    }}>
      <style>{`@keyframes livePulse { 0%,100% { opacity:1 } 50% { opacity:0.5 } }`}</style>
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
          {IS_ADMIN && (
            <span style={{
              color: ACCENT, fontSize: 10, fontWeight: 700,
              fontFamily: "'DM Mono', monospace",
              background: "rgba(232,84,26,0.15)", padding: "3px 8px",
              borderRadius: 4, letterSpacing: "0.08em",
            }}>
              OPS
            </span>
          )}
          <span style={{
            color: "rgba(255,255,255,0.4)", fontSize: 11,
            fontFamily: "'DM Mono', monospace",
          }}>
            Anthony's SEO Engine
          </span>
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
          {phases.filter((p) => ["kickoff", "month1"].includes(p.id)).map((p) => {
            const i = phases.indexOf(p);
            const prog = getPhaseProgress(p.tasks);
            const isActive = !showExtras && i === activePhase;
            const isCurrent = i === getCurrentPhase(phases);
            return (
              <button key={p.id} onClick={() => { setShowExtras(false); setActivePhase(i); }} style={{
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

          {/* Extras tab */}
          <button onClick={() => setShowExtras(true)} style={{
            border: showExtras ? `2px solid ${ACCENT}` : `1px solid ${LIGHT}`,
            background: showExtras ? ACCENT_SOFT : WHITE,
            borderRadius: 10, padding: "12px 16px", cursor: "pointer",
            minWidth: 130, textAlign: "left",
            transition: "all 0.2s",
          }}>
            <div style={{ fontSize: 18, marginBottom: 4 }}>📎</div>
            <div style={{
              fontSize: 12, fontWeight: 700, color: showExtras ? ACCENT : INK,
              fontFamily: "'DM Mono', monospace", letterSpacing: "0.02em",
            }}>Extras</div>
            <div style={{ fontSize: 10, color: MUTED, marginTop: 1 }}>Resources &amp; Pages</div>
            <div style={{ marginTop: 8, height: 3, borderRadius: 2, background: "#eee" }} />
            <div style={{
              fontSize: 10, color: MUTED, marginTop: 4,
              fontFamily: "'DM Mono', monospace",
            }}>2 items</div>
          </button>
        </div>
      </div>

      {/* Extras Panel */}
      {showExtras && (
        <div style={{ padding: "16px 24px 32px" }}>
          <div style={{
            background: WHITE, borderRadius: 12,
            border: `1px solid ${LIGHT}`, overflow: "hidden",
          }}>
            <div style={{
              padding: "20px 24px 16px", borderBottom: `1px solid ${LIGHT}`,
              display: "flex", alignItems: "center", gap: 10,
            }}>
              <span style={{ fontSize: 24 }}>📎</span>
              <div>
                <div style={{
                  fontFamily: "'DM Mono', monospace", fontSize: 11,
                  color: ACCENT, fontWeight: 600, letterSpacing: "0.05em",
                  textTransform: "uppercase",
                }}>
                  Extras — Resources &amp; Pages
                </div>
                <div style={{ fontSize: 18, fontWeight: 700, marginTop: 2 }}>
                  Links &amp; Deliverables
                </div>
              </div>
            </div>

            <div style={{ padding: "12px 0" }}>
              {/* SEO Health Tracker */}
              <a
                href="/"
                onClick={(e) => {
                  e.preventDefault();
                  // Switch top-level tab to health — bubble up via custom event
                  window.dispatchEvent(new CustomEvent("switch-tab", { detail: "health" }));
                }}
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "14px 24px", textDecoration: "none",
                  borderBottom: `1px solid #f0f0f0`,
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: ACCENT_SOFT, display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: 18,
                }}>📊</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>
                    SEO Health Tracker
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>
                    Live keyword rankings, audit scores, and monthly SEO performance — updated automatically.
                  </div>
                </div>
                <div style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 20,
                  background: ACCENT_SOFT, color: ACCENT, fontWeight: 600,
                  fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", alignSelf: "center",
                }}>
                  View →
                </div>
              </a>

              {/* Why Choose Us page */}
              <a
                href="/Why-choose-us"
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: "flex", alignItems: "flex-start", gap: 14,
                  padding: "14px 24px", textDecoration: "none",
                  transition: "background 0.15s",
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "#fafafa"}
                onMouseLeave={(e) => e.currentTarget.style.background = "transparent"}
              >
                <div style={{
                  width: 36, height: 36, borderRadius: 8,
                  background: "rgba(22,163,74,0.08)", display: "flex",
                  alignItems: "center", justifyContent: "center",
                  flexShrink: 0, fontSize: 18,
                }}>🏡</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: INK }}>
                    Why Choose Our Brokerage
                  </div>
                  <div style={{ fontSize: 12, color: MUTED, marginTop: 3, lineHeight: 1.4 }}>
                    Flyer converted to a live webpage — showcasing the 8 reasons agents join Corwin &amp; Associates.
                  </div>
                </div>
                <div style={{
                  fontSize: 10, padding: "3px 8px", borderRadius: 20,
                  background: "rgba(22,163,74,0.08)", color: GREEN, fontWeight: 600,
                  fontFamily: "'DM Mono', monospace", whiteSpace: "nowrap", alignSelf: "center",
                }}>
                  Live ↗
                </div>
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Active Phase Detail */}
      {!showExtras && <div style={{ padding: "16px 24px 32px" }}>
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
          <div style={{ padding: "8px 0 0" }}>
            {phase.tasks.map((task, i) => {
              const cfg = STATUS_CONFIG[task.status];
              const isHovered = hoveredTask === `${activePhase}-${i}`;
              const taskKey = `${phase.id}:${i}`;
              const hasDoc = task.status === "done" && (task.doc || IS_ADMIN);
              const isExpanded = expandedDoc === taskKey;
              return (
                <div key={i} style={{
                  borderBottom: i < phase.tasks.length - 1 ? `1px solid #f0f0f0` : "none",
                }}>
                  <div
                    onMouseEnter={() => setHoveredTask(`${activePhase}-${i}`)}
                    onMouseLeave={() => setHoveredTask(null)}
                    onClick={() => IS_ADMIN && cycleStatus(phase.id, i)}
                    style={{
                      padding: "14px 24px", display: "flex",
                      alignItems: "flex-start", gap: 14,
                      background: isHovered ? "#fafafa" : "transparent",
                      transition: "background 0.15s",
                      cursor: IS_ADMIN ? "pointer" : "default",
                      userSelect: IS_ADMIN ? "none" : "auto",
                    }}
                  >
                    <div style={{
                      width: 26, height: 26, borderRadius: "50%",
                      background: cfg.bg, display: "flex",
                      alignItems: "center", justifyContent: "center",
                      flexShrink: 0, marginTop: 1,
                      border: task.status === "active" ? `2px solid ${cfg.color}` : "none",
                      ...(task.status === "active" ? { animation: "livePulse 2s ease-in-out infinite" } : {}),
                    }}>
                      <span style={{
                        fontSize: task.status === "done" ? 14 : 12,
                        color: cfg.color, fontWeight: 700,
                      }}>
                        {cfg.icon}
                      </span>
                    </div>

                    <div style={{ flex: 1, minWidth: 0 }}>
                      {IS_ADMIN ? (
                        <InlineEdit
                          value={task.name}
                          onSave={(val) => setText({ projectId: PROJECT_ID, taskKey, name: val })}
                          style={{
                            fontSize: 14, fontWeight: 500,
                            color: task.status === "done" ? GREEN : INK,
                            textDecoration: task.status === "done" ? "line-through" : "none",
                            opacity: task.status === "pending" ? 0.7 : 1,
                            display: "block",
                          }}
                        />
                      ) : (
                        <div style={{
                          fontSize: 14, fontWeight: 500,
                          color: task.status === "done" ? GREEN : INK,
                          textDecoration: task.status === "done" ? "line-through" : "none",
                          opacity: task.status === "pending" ? 0.7 : 1,
                        }}>
                          {task.name}
                        </div>
                      )}
                      {IS_ADMIN ? (
                        <InlineEdit
                          value={task.detail}
                          onSave={(val) => setText({ projectId: PROJECT_ID, taskKey, detail: val })}
                          style={{
                            fontSize: 12, color: MUTED, marginTop: 3,
                            lineHeight: 1.4, display: "block",
                          }}
                        />
                      ) : (
                        <div style={{
                          fontSize: 12, color: MUTED, marginTop: 3,
                          lineHeight: 1.4,
                        }}>
                          {task.detail}
                        </div>
                      )}
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 3 }}>
                      {hasDoc && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setExpandedDoc(isExpanded ? null : taskKey);
                          }}
                          style={{
                            background: "none", border: "none", cursor: "pointer",
                            padding: "2px 6px", fontSize: 12, color: MUTED,
                            transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.2s",
                            display: "flex", alignItems: "center",
                          }}
                          title={isExpanded ? "Collapse" : "View details"}
                        >
                          &#9660;
                        </button>
                      )}
                      <span style={{
                        fontSize: 10, padding: "3px 8px", borderRadius: 20,
                        background: cfg.bg, color: cfg.color,
                        fontWeight: 600, whiteSpace: "nowrap",
                        fontFamily: "'DM Mono', monospace",
                        ...(task.status === "active" ? { animation: "livePulse 2s ease-in-out infinite" } : {}),
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>

                  {/* Expandable Task Doc panel */}
                  {hasDoc && (
                    <div style={{
                      maxHeight: isExpanded ? 400 : 0,
                      overflow: "hidden",
                      transition: "max-height 0.3s ease",
                    }}>
                      <div style={{
                        margin: "0 24px 14px 64px",
                        padding: "12px 16px",
                        background: BG,
                        borderRadius: 8,
                        border: `1px solid ${LIGHT}`,
                      }}>
                        {IS_ADMIN ? (
                          <InlineTextarea
                            value={task.doc}
                            onSave={(val) => setDocMut({ projectId: PROJECT_ID, taskKey, doc: val })}
                            style={{
                              fontSize: 12, color: BODY, lineHeight: 1.6,
                            }}
                          />
                        ) : (
                          <div style={{
                            fontSize: 12, color: BODY, lineHeight: 1.6,
                            whiteSpace: "pre-wrap",
                          }}>
                            {task.doc}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Per-task deliverable chips */}
                  <MilestoneDeliverables
                    phaseId={taskKey}
                    deliverables={deliverables}
                    isAdmin={IS_ADMIN}
                    onAdd={(args) => addDeliverableMut({ projectId: PROJECT_ID, ...args })}
                    onRemove={(id) => removeDeliverableMut({ id })}
                    compact={true}
                  />
                </div>
              );
            })}
          </div>
          <MilestoneDeliverables
            phaseId={phase.id}
            deliverables={deliverables}
            isAdmin={IS_ADMIN}
            onAdd={(args) => addDeliverableMut({ projectId: PROJECT_ID, ...args })}
            onRemove={(id) => removeDeliverableMut({ id })}
          />
        </div>
      </div>}

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

// Named exports for reuse in sibling components
export { Ring, AnimNum };
