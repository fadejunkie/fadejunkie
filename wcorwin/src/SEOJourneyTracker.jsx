import { useState, useEffect, useCallback, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { marked } from "marked";
import {
  ACCENT, ACCENT_SOFT, ACCENT_MED, INK, BODY, MUTED, LIGHT, BG, WHITE, GREEN, GREEN_SOFT, YELLOW, YELLOW_SOFT,
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
  const slides = item.markdownContent ? item.markdownContent.split(/\n---\n/).filter(s => s.trim()) : null;
  const isSlides = slides && slides.length > 1;
  const [slide, setSlide] = useState(0);
  const [viewMode, setViewMode] = useState(isSlides ? "slides" : "doc");

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "ArrowRight") setSlide(s => Math.min((slides?.length ?? 1) - 1, s + 1));
      if (e.key === "ArrowLeft") setSlide(s => Math.max(0, s - 1));
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [slides, onClose]);

  const renderHtml = (md) => { marked.setOptions({ breaks: true, gfm: true }); return marked.parse(md || ""); };

  const downloadMd = () => {
    const blob = new Blob([item.markdownContent], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = item.label.replace(/[^a-z0-9]+/gi, "-").toLowerCase() + ".md";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const isPdf = (u) => u && u.toLowerCase().endsWith(".pdf");
  const isImg = (u) => u && (/\.(png|jpg|jpeg|gif|webp|svg)$/i.test(u) || u.includes("screenshot") || u.includes("imgur") || u.includes("cloudinary"));
  const isContent = !!(item.markdownContent && item.markdownContent.length > 0);

  const proseStyles = `
    .doc-prose{font-family:'DM Sans',sans-serif;font-size:14px;line-height:1.8;color:${BODY};}
    .doc-prose h1{font-family:'DM Sans',sans-serif;font-size:24px;font-weight:800;color:${INK};margin:0 0 16px;letter-spacing:-0.3px;border-bottom:2px solid ${ACCENT}22;padding-bottom:10px;}
    .doc-prose h2{font-family:'DM Sans',sans-serif;font-size:18px;font-weight:700;color:${INK};margin:28px 0 10px;}
    .doc-prose h3{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:1.5px;margin:20px 0 8px;}
    .doc-prose p{margin:0 0 14px;}
    .doc-prose strong{font-weight:700;color:${INK};}
    .doc-prose em{font-style:italic;color:${MUTED};}
    .doc-prose ul,.doc-prose ol{margin:0 0 14px;padding-left:22px;}
    .doc-prose li{margin-bottom:5px;}
    .doc-prose a{color:${ACCENT};text-decoration:underline;}
    .doc-prose blockquote{border-left:3px solid ${ACCENT};margin:0 0 14px;padding:10px 16px;background:${ACCENT_SOFT};color:${MUTED};font-style:italic;border-radius:0 6px 6px 0;}
    .doc-prose code{font-family:'DM Mono',monospace;font-size:12px;background:#f5f5f4;padding:2px 6px;border-radius:3px;color:${INK};}
    .doc-prose pre{background:#f5f5f4;border:1px solid ${LIGHT};border-radius:6px;padding:14px 16px;overflow-x:auto;margin:0 0 14px;}
    .doc-prose pre code{background:none;padding:0;}
    .doc-prose table{width:100%;border-collapse:collapse;margin:0 0 18px;font-size:13px;}
    .doc-prose th{background:${ACCENT_SOFT};color:${INK};font-weight:700;text-align:left;padding:8px 12px;border-bottom:2px solid ${ACCENT}33;font-size:11px;letter-spacing:0.5px;text-transform:uppercase;font-family:'DM Mono',monospace;}
    .doc-prose td{padding:8px 12px;border-bottom:1px solid ${LIGHT};vertical-align:top;}
    .doc-prose tr:last-child td{border-bottom:none;}
    .doc-prose img{max-width:100%;border-radius:8px;margin:8px 0;}
    .doc-prose hr{border:none;border-top:1px solid ${LIGHT};margin:24px 0;}
    .slide-prose{display:flex;flex-direction:column;justify-content:center;min-height:340px;padding:32px 40px;}
    .slide-prose h1{font-family:'DM Sans',sans-serif;font-size:30px;font-weight:800;color:${INK};margin:0 0 20px;text-align:center;}
    .slide-prose h2{font-family:'DM Sans',sans-serif;font-size:21px;font-weight:700;color:${INK};margin:0 0 14px;}
    .slide-prose h3{font-family:'DM Mono',monospace;font-size:11px;font-weight:700;color:${ACCENT};text-transform:uppercase;letter-spacing:2px;margin:0 0 8px;}
    .slide-prose p{font-size:15px;line-height:1.7;margin:0 0 12px;color:${BODY};}
    .slide-prose ul,.slide-prose ol{padding-left:20px;margin:0 0 12px;}
    .slide-prose li{font-size:14px;line-height:1.6;margin-bottom:6px;}
    .slide-prose strong{font-weight:700;}
    .slide-prose table{width:100%;border-collapse:collapse;font-size:13px;margin:0 0 12px;}
    .slide-prose th{background:${ACCENT_SOFT};color:${INK};font-weight:700;padding:7px 10px;border-bottom:2px solid ${ACCENT}33;font-size:11px;text-transform:uppercase;letter-spacing:0.5px;font-family:'DM Mono',monospace;}
    .slide-prose td{padding:7px 10px;border-bottom:1px solid ${LIGHT};}
    .slide-prose blockquote{border-left:3px solid ${ACCENT};padding:10px 16px;background:${ACCENT_SOFT};color:${MUTED};font-style:italic;border-radius:0 6px 6px 0;margin:0 0 12px;}
  `;

  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.72)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <style>{proseStyles}</style>
      <div onClick={(e) => e.stopPropagation()} style={{ background: WHITE, borderRadius: 14, width: "100%", maxWidth: 820, maxHeight: "90vh", display: "flex", flexDirection: "column", overflow: "hidden", border: `1px solid ${LIGHT}`, boxShadow: "0 32px 80px rgba(0,0,0,0.4)" }}>

        {/* Header */}
        <div style={{ padding: "14px 20px", borderBottom: `1px solid ${LIGHT}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0, background: BG }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontWeight: 800, fontSize: 15, fontFamily: "'DM Sans', sans-serif", color: INK, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.label}</div>
            <div style={{ fontSize: 9, color: MUTED, fontFamily: "'DM Mono', monospace", marginTop: 1, letterSpacing: 1 }}>
              {isContent ? "DOCUMENT" : isPdf(item.url) ? "PDF" : isImg(item.url) ? "IMAGE" : "LINK"}{item.addedAt ? " · " + new Date(item.addedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : ""}
            </div>
          </div>
          {isContent && isSlides && (
            <div style={{ display: "flex", background: LIGHT, borderRadius: 4, overflow: "hidden", border: `1px solid ${LIGHT}`, flexShrink: 0 }}>
              {[["doc", "Document"], ["slides", "Slides"]].map(([v, l]) => (
                <button key={v} onClick={() => { setViewMode(v); setSlide(0); }} style={{ padding: "4px 12px", fontSize: 9, fontWeight: 700, letterSpacing: 1, fontFamily: "'DM Mono', monospace", background: viewMode === v ? ACCENT : "transparent", color: viewMode === v ? "#fff" : MUTED, border: "none", cursor: "pointer" }}>{l.toUpperCase()}</button>
              ))}
            </div>
          )}
          {isContent && (
            <button onClick={downloadMd} style={{ fontSize: 10, fontWeight: 700, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace", padding: "5px 12px", background: ACCENT_SOFT, color: ACCENT, border: `1px solid ${ACCENT}33`, borderRadius: 4, cursor: "pointer", flexShrink: 0 }}>↓ .md</button>
          )}
          <button onClick={onClose} style={{ fontSize: 18, color: MUTED, background: "none", border: "none", cursor: "pointer", lineHeight: 1, padding: "0 4px", flexShrink: 0 }}>×</button>
        </div>

        {/* Doc mode */}
        {isContent && viewMode === "doc" && (
          <div style={{ overflowY: "auto", flex: 1, padding: "28px 36px" }}>
            <div className="doc-prose" dangerouslySetInnerHTML={{ __html: renderHtml(item.markdownContent) }} />
          </div>
        )}

        {/* Slides mode */}
        {isContent && viewMode === "slides" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
            <div style={{ flex: 1, overflowY: "auto", background: WHITE }}>
              <div className="doc-prose slide-prose" dangerouslySetInnerHTML={{ __html: renderHtml(slides[slide]) }} />
            </div>
            <div style={{ borderTop: `1px solid ${LIGHT}`, padding: "10px 20px", display: "flex", alignItems: "center", justifyContent: "space-between", background: BG, flexShrink: 0 }}>
              <button onClick={() => setSlide(s => Math.max(0, s - 1))} disabled={slide === 0} style={{ fontSize: 18, background: "none", border: `1px solid ${LIGHT}`, borderRadius: 6, color: slide === 0 ? LIGHT : MUTED, cursor: slide === 0 ? "default" : "pointer", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>‹</button>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                {slides.map((_, i) => (
                  <button key={i} onClick={() => setSlide(i)} style={{ width: i === slide ? 20 : 7, height: 7, borderRadius: 4, background: i === slide ? ACCENT : LIGHT, border: "none", cursor: "pointer", transition: "all 0.2s", padding: 0 }} />
                ))}
              </div>
              <button onClick={() => setSlide(s => Math.min(slides.length - 1, s + 1))} disabled={slide === slides.length - 1} style={{ fontSize: 18, background: "none", border: `1px solid ${LIGHT}`, borderRadius: 6, color: slide === slides.length - 1 ? LIGHT : MUTED, cursor: slide === slides.length - 1 ? "default" : "pointer", width: 34, height: 34, display: "flex", alignItems: "center", justifyContent: "center" }}>›</button>
            </div>
          </div>
        )}

        {/* Image viewer */}
        {!isContent && isImg(item.url) && (
          <div style={{ flex: 1, overflow: "auto", display: "flex", flexDirection: "column", alignItems: "center", padding: 24, gap: 16, background: BG }}>
            <img src={item.url} alt={item.label} style={{ maxWidth: "100%", maxHeight: "60vh", borderRadius: 8, boxShadow: "0 8px 32px rgba(0,0,0,0.15)", objectFit: "contain" }} />
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 10, fontWeight: 700, letterSpacing: 1, fontFamily: "'DM Mono', monospace", padding: "6px 18px", background: ACCENT, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", textDecoration: "none" }}>↗ OPEN FULL SIZE</a>
          </div>
        )}

        {/* PDF / link fallback */}
        {!isContent && !isImg(item.url) && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 40 }}>
            <div style={{ fontSize: 40 }}>{isPdf(item.url) ? "📄" : "🔗"}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: INK, fontFamily: "'DM Sans', sans-serif", textAlign: "center" }}>{item.label}</div>
            <a href={item.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, fontWeight: 700, letterSpacing: 1, fontFamily: "'DM Mono', monospace", padding: "8px 24px", background: ACCENT, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", textDecoration: "none" }}>↗ OPEN {isPdf(item.url) ? "PDF" : "LINK"}</a>
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
  const signoff = useQuery(api.wcorwinTasks.getSignoff, { projectId: PROJECT_ID });
  const submitSignoffNotesMut = useMutation(api.wcorwinTasks.submitSignoffNotes);
  const submitSignoffSignatureMut = useMutation(api.wcorwinTasks.submitSignoffSignature);

  const phases = applyOverrides(PHASES, overrides);
  const [activePhase, setActivePhase] = useState(() => getCurrentPhase(phases));

  const [hoveredTask, setHoveredTask] = useState(null);
  const [expandedDoc, setExpandedDoc] = useState(null);
  const [notesDraft, setNotesDraft] = useState("");
  const [signatureDraft, setSignatureDraft] = useState("");
  const [showSendBothConfirm, setShowSendBothConfirm] = useState(false);
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

  function handleNotesSubmit() {
    submitSignoffNotesMut({ projectId: PROJECT_ID, notes: notesDraft });
    setNotesDraft("");
  }

  function handleSignatureSubmit() {
    if (notesDraft.trim() && !signoff?.notes) {
      setShowSendBothConfirm(true);
    } else {
      submitSignoffSignatureMut({ projectId: PROJECT_ID, signature: signatureDraft });
    }
  }

  function handleSendBoth() {
    submitSignoffSignatureMut({ projectId: PROJECT_ID, signature: signatureDraft, notes: notesDraft });
    setNotesDraft("");
    setShowSendBothConfirm(false);
  }

  function handleSignatureOnly() {
    submitSignoffSignatureMut({ projectId: PROJECT_ID, signature: signatureDraft });
    setShowSendBothConfirm(false);
  }

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
          {phases.filter((p) => ["kickoff", "month1", "month2", "month3"].includes(p.id)).map((p) => {
            const i = phases.indexOf(p);
            const prog = getPhaseProgress(p.tasks);
            const isActive = i === activePhase;
            const isCurrent = i === getCurrentPhase(phases);
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

                  {/* Sign-off panel — Month 1 task 6 only */}
                  {taskKey === "month1:6" && signoff !== undefined && (
                    signoff?.signature ? (
                      /* Completion banner */
                      <div style={{ margin: "0 24px 20px", borderRadius: 10, padding: "18px 20px", background: GREEN_SOFT, border: `1px solid ${GREEN}`, display: "flex", alignItems: "center", gap: 16 }}>
                        <div style={{ width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                          <span style={{ color: WHITE, fontSize: 18, fontWeight: 700 }}>✓</span>
                        </div>
                        <div>
                          <div style={{ fontSize: 14, fontWeight: 700, color: GREEN }}>Month 1 Foundation Complete</div>
                          <div style={{ fontSize: 12, color: BODY, marginTop: 2 }}>
                            Signed by <em>{signoff.signature}</em>
                            {signoff.notes && " · Notes on file"}
                          </div>
                        </div>
                      </div>
                    ) : (
                      /* Sign-off form */
                      <div style={{ margin: "0 24px 16px", borderRadius: 10, border: `1px solid ${ACCENT_MED}`, background: ACCENT_SOFT, overflow: "hidden" }}>
                        {/* Notes section */}
                        <div style={{ padding: "16px 20px", borderBottom: `1px solid ${ACCENT_MED}` }}>
                          <div style={{ fontSize: 11, fontWeight: 700, color: ACCENT, letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 8, fontFamily: "'DM Mono', monospace" }}>
                            Notes
                          </div>
                          {signoff?.notes ? (
                            <div style={{ fontSize: 13, color: BODY, background: WHITE, padding: "10px 12px", borderRadius: 6, border: `1px solid ${LIGHT}` }}>
                              <div style={{ whiteSpace: "pre-wrap" }}>{signoff.notes}</div>
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
                    )
                  )}
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

// Named exports for reuse in sibling components
export { Ring, AnimNum };
