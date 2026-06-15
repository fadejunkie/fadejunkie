// @ts-nocheck
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

/* ═══════════════════════════════════════
   THEME SYSTEM
   ═══════════════════════════════════════ */
const GOLD     = "#C9A84C";
const GOLD_DIM_DARK  = "#5a4010";
const GOLD_DIM_LIGHT = "#f5e9cc";
const GREEN    = "#22c55e";

const DARK_THEME = {
  mode: "dark",
  PAGE:     "#080808",
  HEADER:   "#000000",
  CARD:     "#0f0f0f",
  INPUT:    "#141414",
  BORDER:   "#262626",
  MUTED:    "#4a4a4a",
  SUBTLE:   "#7a7a7a",
  DIM:      "#a0a0a0",
  SECONDARY:"#cccccc",
  TEXT:     "#f5f0e8",
  GOLD,
  GOLD_DIM: GOLD_DIM_DARK,
  GREEN,
  GREEN_BG:     "#0d1a0d",
  GREEN_BORDER: "#1a3d1a",
  CHIP_SEL_BG:  GOLD_DIM_DARK,
  CHIP_SEL_TEXT: GOLD,
  CHIP_DEF_BG:  "#0f0f0f",
  CHIP_DEF_TEXT: "#a0a0a0",
};

const LIGHT_THEME = {
  mode: "light",
  PAGE:     "#F5F5F7",
  HEADER:   "#FBFBFD",
  CARD:     "#FFFFFF",
  INPUT:    "#F5F5F7",
  BORDER:   "#D2D2D7",
  MUTED:    "#AEAEB2",
  SUBTLE:   "#86868B",
  DIM:      "#6E6E73",
  SECONDARY:"#3A3A3C",
  TEXT:     "#1D1D1F",
  GOLD,
  GOLD_DIM: "#f5e9cc",
  GREEN,
  GREEN_BG:     "#f0faf4",
  GREEN_BORDER: "#a3d9b8",
  CHIP_SEL_BG:  "#f5e9cc",
  CHIP_SEL_TEXT: "#7a5c10",
  CHIP_DEF_BG:  "#EFEFEF",
  CHIP_DEF_TEXT: "#6E6E73",
};

const ThemeCtx = createContext(LIGHT_THEME);

const PROJECT_ID  = "sa-finest-logo";
const CLIENT_SLUG = "sa-finest";

/* ═══════════════════════════════════════
   PHASES
   ═══════════════════════════════════════ */
const PHASES = [
  { id: "p0", label: "PHASE 0", name: "Discovery", status: "active", tasks: [
    { key: "p0-0", label: "Discovery brief submitted by client" },
    { key: "p0-1", label: "Brand brief reviewed by designer" },
    { key: "p0-2", label: "Reference logos reviewed" },
    { key: "p0-3", label: "Color palette direction confirmed" },
  ]},
  { id: "p1", label: "PHASE 1", name: "Concepts", status: "pending", tasks: [
    { key: "p1-0", label: "3 logo concept directions developed" },
    { key: "p1-1", label: "Concepts presented to client" },
    { key: "p1-2", label: "Client selects preferred direction" },
  ]},
  { id: "p2", label: "PHASE 2", name: "Revisions", status: "pending", tasks: [
    { key: "p2-0", label: "Round 1 revisions applied" },
    { key: "p2-1", label: "Client reviews Round 1" },
    { key: "p2-2", label: "Round 2 revisions applied (if needed)" },
    { key: "p2-3", label: "Final design approved by client" },
  ]},
  { id: "p3", label: "PHASE 3", name: "Final Delivery", status: "pending", tasks: [
    { key: "p3-0", label: "Master SVG files exported" },
    { key: "p3-1", label: "PNG files at all sizes delivered" },
    { key: "p3-2", label: "Brand color codes + font files delivered" },
    { key: "p3-3", label: "Usage guide delivered" },
    { key: "p3-4", label: "Client confirms receipt" },
  ]},
];

// (BRIEF_SECTIONS removed — discovery form is now inline in DiscoveryPage)

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function SectionHeader({ label }: { label: string }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, marginTop: 28 }}>
      <div style={{ width: 3, height: 16, background: GOLD, flexShrink: 0 }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace" }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: t.BORDER }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   REF IMAGE UPLOAD (client-side compress → base64)
   ═══════════════════════════════════════ */
const MAX_REFS = 10;

function compressImage(file: File, maxPx = 480, quality = 0.55): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, maxPx / Math.max(img.width, img.height));
      const w = Math.round(img.width * scale);
      const h = Math.round(img.height * scale);
      const canvas = document.createElement("canvas");
      canvas.width = w; canvas.height = h;
      canvas.getContext("2d")!.drawImage(img, 0, 0, w, h);
      resolve(canvas.toDataURL("image/jpeg", quality));
    };
    img.onerror = reject;
    img.src = url;
  });
}

function RefUpload({ refs, onChange, disabled }: { refs: string[]; onChange: (r: string[]) => void; disabled: boolean }) {
  const t = useContext(ThemeCtx);
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  const handleFiles = async (files: FileList | null) => {
    if (!files || disabled) return;
    const remaining = MAX_REFS - refs.length;
    if (remaining <= 0) return;
    setLoading(true);
    const picked = Array.from(files).slice(0, remaining);
    const results: string[] = [];
    for (const f of picked) {
      try {
        if (f.type.startsWith("image/")) {
          results.push(await compressImage(f));
        } else {
          // non-image: store name as a placeholder marker
          results.push(`file:${f.name}`);
        }
      } catch { /* skip bad file */ }
    }
    onChange([...refs, ...results]);
    setLoading(false);
    if (inputRef.current) inputRef.current.value = "";
  };

  const remove = (i: number) => {
    if (disabled) return;
    onChange(refs.filter((_, idx) => idx !== i));
  };

  return (
    <div>
      {/* Thumbnail grid */}
      {refs.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 12 }}>
          {refs.map((r, i) => (
            <div key={i} style={{ position: "relative", width: 72, height: 72, borderRadius: 6, overflow: "hidden", border: `1px solid ${t.BORDER}`, flexShrink: 0 }}>
              {r.startsWith("file:") ? (
                <div style={{ width: "100%", height: "100%", background: t.INPUT, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                  <span style={{ fontSize: 20 }}>📎</span>
                  <span style={{ fontSize: 8, color: t.DIM, textAlign: "center", padding: "0 4px", wordBreak: "break-all", lineHeight: 1.2 }}>{r.replace("file:", "").slice(0, 12)}</span>
                </div>
              ) : (
                <img src={r} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )}
              {!disabled && (
                <button onClick={() => remove(i)}
                  style={{ position: "absolute", top: 2, right: 2, width: 18, height: 18, borderRadius: "50%", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", cursor: "pointer", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", lineHeight: 1, padding: 0 }}>
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Upload button */}
      {!disabled && refs.length < MAX_REFS && (
        <>
          <input ref={inputRef} type="file" accept="image/*,.pdf" multiple
            style={{ display: "none" }} onChange={e => handleFiles(e.target.files)} />
          <button onClick={() => inputRef.current?.click()} disabled={loading}
            style={{ display: "flex", alignItems: "center", gap: 8, padding: "11px 16px", background: t.INPUT, border: `1px dashed ${t.BORDER}`, borderRadius: 8, color: t.DIM, fontSize: 13, cursor: "pointer", fontFamily: "inherit", width: "100%" }}>
            <span style={{ fontSize: 18 }}>＋</span>
            <span>{loading ? "Processing..." : `Add reference images or files (${refs.length}/${MAX_REFS})`}</span>
          </button>
        </>
      )}
      {refs.length >= MAX_REFS && !disabled && (
        <div style={{ fontSize: 11, color: t.SUBTLE, fontFamily: "'IBM Plex Mono',monospace" }}>Max {MAX_REFS} references attached</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   WORKFLOW PAGE
   ═══════════════════════════════════════ */
function WorkflowPage({ tasks, setTask, isOps }: any) {
  const t = useContext(ThemeCtx);
  const total = PHASES.flatMap(p => p.tasks).length;
  const done  = Object.values(tasks).filter(Boolean).length;
  const pct   = Math.round((done / total) * 100);
  return (
    <div style={{ padding: "20px 16px 48px" }}>
      <SectionHeader label="PROJECT TRACKER" />
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: t.DIM, fontFamily: "'IBM Plex Mono',monospace" }}>{done} / {total} TASKS COMPLETE</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? GREEN : GOLD, fontFamily: "'IBM Plex Mono',monospace" }}>{pct}%</div>
        </div>
        <div style={{ height: 4, background: t.BORDER, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? GREEN : GOLD, borderRadius: 2, transition: "width 0.4s" }} />
        </div>
      </div>
      {PHASES.map(phase => {
        const phaseDone = phase.tasks.filter((t2: any) => tasks[t2.key]).length;
        const isActive  = phase.status === "active";
        return (
          <div key={phase.id} style={{ marginBottom: 24, opacity: phase.status === "pending" && phaseDone === 0 ? 0.45 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: "3px 7px", background: isActive ? GOLD : t.BORDER, color: isActive ? (t.mode === "dark" ? "#000" : "#1a1a1a") : t.SUBTLE, fontFamily: "'IBM Plex Mono',monospace", borderRadius: 2 }}>{phase.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.TEXT }}>{phase.name}</div>
              <div style={{ fontSize: 10, color: t.DIM, fontFamily: "'IBM Plex Mono',monospace", marginLeft: "auto" }}>{phaseDone}/{phase.tasks.length}</div>
            </div>
            {phase.tasks.map((task: any) => (
              <div key={task.key} onClick={() => isOps && setTask({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, taskKey: task.key, completed: !tasks[task.key] })}
                style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px", marginBottom: 6, borderRadius: 8, cursor: isOps ? "pointer" : "default", background: tasks[task.key] ? t.GREEN_BG : t.CARD, border: `1px solid ${tasks[task.key] ? t.GREEN_BORDER : t.BORDER}`, transition: "all 0.15s", minHeight: 44 }}>
                <div style={{ width: 18, height: 18, borderRadius: 4, flexShrink: 0, background: tasks[task.key] ? GREEN : "transparent", border: `2px solid ${tasks[task.key] ? GREEN : t.MUTED}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {tasks[task.key] && <span style={{ fontSize: 11, color: "#fff", fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: tasks[task.key] ? t.SUBTLE : t.SECONDARY, textDecoration: tasks[task.key] ? "line-through" : "none", lineHeight: 1.4 }}>{task.label}</span>
              </div>
            ))}
          </div>
        );
      })}
    </div>
  );
}

/* ═══════════════════════════════════════
   SCOPE PAGE
   ═══════════════════════════════════════ */
function ScopePage() {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ padding: "20px 16px 48px" }}>
      <SectionHeader label="SCOPE OF WORK" />
      <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
          {[
            { label: "PROJECT", value: "Logo Design", accent: false },
            { label: "PACKAGE", value: "Brand Identity", accent: true },
            { label: "TURNAROUND", value: "5–7 Days", accent: false },
            { label: "REVISIONS", value: "2 Rounds", accent: false },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 9, color: t.SUBTLE, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: item.accent ? GOLD : t.TEXT }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>
      <SectionHeader label="WHAT'S INCLUDED" />
      {[
        { phase: "LOGO DESIGN PACKAGE", items: [
          "3 distinct logo concept directions",
          "Up to 2 rounds of revisions on your chosen concept",
          "Final logo: SVG (print-ready) + PNG (web, merch, social)",
          "All color variations: full color, black, white, reversed",
          "Color palette: hex codes + Pantone references",
          "Font files or font name used in the logo",
          "Usage guide — right format for the right place",
        ]},
        { phase: "FILE FORMATS DELIVERED", items: [
          "SVG — master file, scales infinitely with no quality loss",
          "PNG at 1×, 2×, 3× — optimized for screen and print",
          "PNG on transparent background — shirts, overlays, merch",
          "PNG on white background — business cards, stickers",
          "All files in a clean folder, ready for any vendor",
        ]},
      ].map(section => (
        <div key={section.phase} style={{ marginBottom: 20 }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>{section.phase}</div>
          {section.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
              <div style={{ width: 4, height: 4, background: GOLD, borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: t.SECONDARY, lineHeight: 1.5 }}>{item}</div>
            </div>
          ))}
        </div>
      ))}
      <SectionHeader label="PROCESS" />
      <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "16px 18px" }}>
        <div style={{ fontSize: 13, color: t.DIM, lineHeight: 2 }}>
          <strong style={{ color: t.TEXT }}>1. Discovery</strong> — Fill out the brief. We review + follow up if needed.<br />
          <strong style={{ color: t.TEXT }}>2. Concepts</strong> — 5–7 days from brief to 3 logo options.<br />
          <strong style={{ color: t.TEXT }}>3. Revisions</strong> — 2 rounds to dial it in exactly right.<br />
          <strong style={{ color: t.TEXT }}>4. Final Delivery</strong> — All formats organized and delivered.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DISCOVERY PAGE  (name · tagline · refs · avoid)
   ═══════════════════════════════════════ */
function DiscoveryPage({ isOps }: { isOps: boolean }) {
  const t = useContext(ThemeCtx);
  const existing      = useQuery(api.discovery.getDiscovery, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const saveDiscovery = useMutation(api.discovery.saveDiscovery);
  const setTask       = useMutation(api.tasks.setTask);

  const [name,      setName]      = useState("");
  const [tagline,   setTagline]   = useState("");
  const [refs,      setRefs]      = useState<string[]>([]);
  const [avoid,     setAvoid]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [saving,    setSaving]    = useState(false);

  useEffect(() => {
    if (existing?.responses) {
      try {
        const f = JSON.parse(existing.responses);
        setName(f.name || "");
        setTagline(f.tagline || "");
        setRefs(f.refs || []);
        setAvoid(f.avoid || "");
        setSubmitted(true);
      } catch {}
    }
  }, [existing]);

  const handleSubmit = async () => {
    if (!name.trim()) return;
    setSaving(true);
    await saveDiscovery({
      clientSlug: CLIENT_SLUG,
      projectId: PROJECT_ID,
      responses: JSON.stringify({ name: name.trim(), tagline: tagline.trim(), refs, avoid: avoid.trim() }),
    });
    // auto-check "Discovery brief submitted by client" task
    await setTask({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, taskKey: "p0-0", completed: true });
    setSaving(false);
    setSubmitted(true);
  };

  const inp = { width: "100%", boxSizing: "border-box" as any, background: t.INPUT, border: `1px solid ${t.BORDER}`, borderRadius: 6, color: t.TEXT, padding: "11px 14px", fontSize: 14, fontFamily: "inherit", outline: "none" };

  const fieldLabel = (text: string, sub?: string) => (
    <div style={{ marginBottom: 10 }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: t.TEXT, lineHeight: 1.4 }}>{text}</div>
      {sub && <div style={{ fontSize: 11, color: t.DIM, marginTop: 3 }}>{sub}</div>}
    </div>
  );

  // Ops view: read-only display of what client submitted
  if (isOps) {
    const hasData = name || tagline || refs.length > 0 || avoid;
    return (
      <div style={{ padding: "20px 16px 48px" }}>
        <SectionHeader label="DISCOVERY BRIEF" />
        {!hasData ? (
          <div style={{ fontSize: 13, color: t.DIM }}>No brief submitted yet.</div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {name && (
              <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 9, color: t.SUBTLE, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 5 }}>NAME</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: t.TEXT }}>{name}</div>
              </div>
            )}
            {tagline && (
              <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 9, color: t.SUBTLE, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 5 }}>TAGLINE</div>
                <div style={{ fontSize: 14, color: t.TEXT }}>{tagline}</div>
              </div>
            )}
            {refs.length > 0 && (
              <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 9, color: t.SUBTLE, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>STYLE REFERENCES</div>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {refs.map((r, i) => (
                    <div key={i} style={{ width: 80, height: 80, borderRadius: 6, overflow: "hidden", border: `1px solid ${t.BORDER}`, flexShrink: 0 }}>
                      {r.startsWith("file:") ? (
                        <div style={{ width: "100%", height: "100%", background: t.INPUT, display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 2 }}>
                          <span style={{ fontSize: 22 }}>📎</span>
                          <span style={{ fontSize: 9, color: t.DIM, textAlign: "center", padding: "0 4px", wordBreak: "break-all" }}>{r.replace("file:", "").slice(0, 14)}</span>
                        </div>
                      ) : (
                        <img src={r} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
            {avoid && (
              <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "14px 16px" }}>
                <div style={{ fontSize: 9, color: t.SUBTLE, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 5 }}>THINGS TO AVOID</div>
                <div style={{ fontSize: 13, color: t.SECONDARY, lineHeight: 1.6 }}>{avoid}</div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  // Client view: submitted confirmation
  if (submitted) {
    return (
      <div style={{ padding: "20px 16px 48px" }}>
        <SectionHeader label="DISCOVERY BRIEF" />
        <div style={{ background: t.GREEN_BG, border: `1px solid ${t.GREEN_BORDER}`, borderRadius: 8, padding: "40px 24px", textAlign: "center" }}>
          <div style={{ fontSize: 40, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 11, fontWeight: 700, color: GREEN, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>DISCOVERY SUBMITTED</div>
          <div style={{ fontSize: 15, color: t.SECONDARY, lineHeight: 1.7 }}>Please await further instructions.</div>
        </div>
      </div>
    );
  }

  // Client view: editable form
  return (
    <div style={{ padding: "20px 16px 48px" }}>
      <SectionHeader label="DISCOVERY BRIEF" />
      <div style={{ fontSize: 13, color: t.DIM, marginBottom: 28, lineHeight: 1.6 }}>Fill this out and we'll get started on concepts.</div>

      <div style={{ marginBottom: 28 }}>
        {fieldLabel("Name for the logo", "Exactly how it should appear")}
        <input type="text" value={name} onChange={e => setName(e.target.value)}
          placeholder="e.g. SA Finest Barbershop" style={inp} />
      </div>

      <div style={{ marginBottom: 28 }}>
        {fieldLabel("Tagline", "Optional — leave blank if none")}
        <input type="text" value={tagline} onChange={e => setTagline(e.target.value)}
          placeholder="e.g. Where the Finest Get Their Cut" style={inp} />
      </div>

      <div style={{ marginBottom: 28 }}>
        {fieldLabel("Style references", "Upload logos, screenshots, or images of styles you like — up to 10")}
        <RefUpload refs={refs} onChange={setRefs} disabled={false} />
      </div>

      <div style={{ marginBottom: 32 }}>
        {fieldLabel("Things to avoid", "Colors, styles, vibes, anything you don't want")}
        <textarea value={avoid} onChange={e => setAvoid(e.target.value)}
          placeholder="e.g. No orange, no barber pole clichés, nothing too scripty" rows={3}
          style={{ ...inp, resize: "vertical" }} />
      </div>

      <button onClick={handleSubmit} disabled={saving || !name.trim()}
        style={{ width: "100%", padding: "16px", background: name.trim() && !saving ? GOLD : t.BORDER, color: name.trim() && !saving ? "#1a1410" : t.SUBTLE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: name.trim() && !saving ? "pointer" : "default", letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", transition: "background 0.15s" }}>
        {saving ? "SAVING..." : "SUBMIT BRIEF"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE
   ═══════════════════════════════════════ */
function AgreementPage() {
  const t = useContext(ThemeCtx);
  const existing      = useQuery(api.agreements.getAgreement, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const saveAgreement = useMutation(api.agreements.saveAgreement);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig,  setHasSig]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { if (existing) setSaved(true); }, [existing]);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const src  = e.touches ? e.touches[0] : e;
    return { x: src.clientX - rect.left, y: src.clientY - rect.top };
  };
  const startDraw = (e: any) => {
    e.preventDefault();
    const canvas = canvasRef.current!;
    const pos = getPos(e, canvas);
    canvas.getContext("2d")!.beginPath();
    canvas.getContext("2d")!.moveTo(pos.x, pos.y);
    setDrawing(true);
  };
  const draw = (e: any) => {
    if (!drawing) return; e.preventDefault();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const pos = getPos(e, canvas);
    ctx.lineTo(pos.x, pos.y);
    ctx.strokeStyle = t.mode === "dark" ? "#f5f0e8" : "#1a1410";
    ctx.lineWidth = 2.5; ctx.lineCap = "round"; ctx.stroke();
    setHasSig(true);
  };
  const endDraw = () => setDrawing(false);
  const clearSig = () => { canvasRef.current!.getContext("2d")!.clearRect(0, 0, 600, 140); setHasSig(false); };
  const handleSign = async () => {
    if (!hasSig) return;
    setSaving(true);
    const today = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    await saveAgreement({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, sigData: canvasRef.current!.toDataURL(), signedDate: today, invoiceNumber: "SAF-2026-001" });
    setSaving(false); setSaved(true);
  };

  if (saved) {
    return (
      <div style={{ padding: "20px 16px 48px" }}>
        <SectionHeader label="AGREEMENT" />
        <div style={{ background: t.GREEN_BG, border: `1px solid ${t.GREEN_BORDER}`, borderRadius: 8, padding: "32px 20px", textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 17, fontWeight: 700, color: GREEN, marginBottom: 8 }}>Agreement Signed</div>
          <div style={{ fontSize: 13, color: t.DIM }}>Signed {existing?.signedDate}. We're locked in.</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px 16px 48px" }}>
      <SectionHeader label="AGREEMENT" />
      <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "18px 20px", marginBottom: 24, fontSize: 13, color: t.DIM, lineHeight: 1.8 }}>
        By signing below, <strong style={{ color: t.TEXT }}>Jay / SA Finest Barbershop</strong> and <strong style={{ color: t.TEXT }}>Anthony Tatis (twanii)</strong> agree to the logo design scope.
        3 original concepts within 5–7 business days of completed brief. Up to 2 revision rounds. All rights transfer to client on final delivery.
      </div>
      <div style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>SIGN BELOW</div>
      <div style={{ border: `1px solid ${t.BORDER}`, borderRadius: 8, overflow: "hidden", position: "relative", marginBottom: 12 }}>
        <canvas ref={canvasRef} width={600} height={140}
          style={{ width: "100%", height: 140, background: t.INPUT, display: "block", cursor: "crosshair", touchAction: "none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw} />
        {!hasSig && (
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none" }}>
            <div style={{ fontSize: 12, color: t.MUTED, fontFamily: "'IBM Plex Mono',monospace" }}>Draw your signature here</div>
          </div>
        )}
      </div>
      {hasSig && <button onClick={clearSig} style={{ marginBottom: 16, fontSize: 11, color: t.DIM, background: "none", border: "none", cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace", display: "block" }}>CLEAR</button>}
      <button onClick={handleSign} disabled={!hasSig || saving}
        style={{ width: "100%", padding: "16px", background: hasSig && !saving ? GOLD : t.BORDER, color: hasSig && !saving ? "#1a1410" : t.SUBTLE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: hasSig && !saving ? "pointer" : "default", letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace" }}>
        {saving ? "SAVING..." : "SIGN AGREEMENT"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   DELIVERABLES PAGE
   ═══════════════════════════════════════ */
function DeliverablesPage({ isOps }: { isOps: boolean }) {
  const t = useContext(ThemeCtx);
  const deliverables      = useQuery(api.deliverables.getDeliverables, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const addDeliverable    = useMutation(api.deliverables.addDeliverable);
  const removeDeliverable = useMutation(api.deliverables.removeDeliverable);
  const [label, setLabel] = useState("");
  const [url,   setUrl]   = useState("");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!label.trim()) return;
    setAdding(true);
    await addDeliverable({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, milestoneKey: "logo-design", label: label.trim(), url: url.trim() || undefined, type: "file", addedAt: Date.now() });
    setLabel(""); setUrl(""); setAdding(false);
  };

  const inp = { width: "100%", boxSizing: "border-box" as any, background: t.INPUT, border: `1px solid ${t.BORDER}`, borderRadius: 6, color: t.TEXT, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" };

  return (
    <div style={{ padding: "20px 16px 48px" }}>
      <SectionHeader label="DELIVERABLES" />
      <div style={{ fontSize: 13, color: t.DIM, marginBottom: 20, lineHeight: 1.6 }}>
        {isOps ? "Manage files and links delivered to Jay." : "Concepts, revisions, and final files will appear here as work progresses."}
      </div>
      {isOps && (
        <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "16px", marginBottom: 20 }}>
          <div style={{ fontSize: 10, color: GOLD, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 12 }}>ADD DELIVERABLE</div>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Logo Concepts — Round 1)" style={{ ...inp, marginBottom: 8 }} />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL — Google Drive, Figma, etc. (optional)" style={{ ...inp, marginBottom: 12 }} />
          <button onClick={handleAdd} disabled={adding || !label.trim()}
            style={{ padding: "10px 20px", background: label.trim() ? GOLD : t.BORDER, color: label.trim() ? "#1a1410" : t.SUBTLE, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: label.trim() ? "pointer" : "default", fontFamily: "'IBM Plex Mono',monospace" }}>
            {adding ? "ADDING..." : "ADD"}
          </button>
        </div>
      )}
      {!deliverables || deliverables.length === 0 ? (
        <div style={{ textAlign: "center", padding: "48px 0", color: t.DIM, fontSize: 13 }}>No files yet — they'll appear here as work progresses.</div>
      ) : (
        deliverables.map((d: any) => (
          <div key={d._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, marginBottom: 8 }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, color: t.TEXT, fontWeight: 600 }}>{d.label}</div>
              {d.url && <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: GOLD, fontFamily: "'IBM Plex Mono',monospace", textDecoration: "none" }}>VIEW FILE →</a>}
            </div>
            <div style={{ fontSize: 10, color: t.DIM, fontFamily: "'IBM Plex Mono',monospace", flexShrink: 0 }}>{new Date(d.addedAt).toLocaleDateString()}</div>
            {isOps && <button onClick={() => removeDeliverable({ id: d._id })} style={{ background: "none", border: "none", color: t.DIM, cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0 }}>×</button>}
          </div>
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   THEME TOGGLE BUTTON
   — Glowing dot until user interacts once —
   ═══════════════════════════════════════ */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  const [showDot, setShowDot] = useState(() => {
    try { return !localStorage.getItem("saf-theme-used"); } catch { return true; }
  });

  const handleClick = () => {
    if (showDot) {
      setShowDot(false);
      try { localStorage.setItem("saf-theme-used", "1"); } catch {}
    }
    onToggle();
  };

  return (
    <button onClick={handleClick}
      style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "none", border: `1px solid ${dark ? "#262626" : "#E5DDD0"}`, borderRadius: 20, cursor: "pointer", transition: "all 0.2s" }}>

      {/* Sun / Moon icon */}
      <span style={{ fontSize: 14, lineHeight: 1 }}>{dark ? "☀️" : "🌙"}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: dark ? "#a0a0a0" : "#6B5D50", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
        {dark ? "LIGHT" : "DARK"}
      </span>

      {/* Glowing new-feature dot */}
      {showDot && (
        <span style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8 }}>
          <span style={{
            position: "absolute", inset: 0, borderRadius: "50%", background: GOLD,
            animation: "saf-glow-pulse 1.6s ease-in-out infinite"
          }} />
          <span style={{
            position: "absolute", inset: 0, borderRadius: "50%",
            border: `1px solid ${GOLD}`,
            animation: "saf-glow-ring 1.6s ease-out infinite"
          }} />
        </span>
      )}
    </button>
  );
}

/* ═══════════════════════════════════════
   MAIN HUB SHELL
   ═══════════════════════════════════════ */
export default function SAFinestHub() {
  const isOps = typeof window !== "undefined" && (window.location.hostname.includes("-ops") || window.location.pathname === "/ops");

  // Default: light. Persist preference.
  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("saf-theme") === "dark"; } catch { return false; }
  });
  const toggleTheme = () => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("saf-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  const theme = dark ? DARK_THEME : LIGHT_THEME;
  const { PAGE, HEADER, BORDER, SUBTLE, DIM, TEXT, GOLD: G } = theme;

  const [page, setPage] = useState<"workflow"|"scope"|"discovery"|"deliverables"|"agreement">("workflow");
  const tasks   = useQuery(api.tasks.getTasks, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID }) ?? {};
  const setTask = useMutation(api.tasks.setTask);
  const total = PHASES.flatMap(p => p.tasks).length;
  const done  = Object.values(tasks).filter(Boolean).length;
  const pct   = Math.round((done / total) * 100);

  const NAV = [
    { id: "workflow",     label: "PROGRESS" },
    { id: "scope",        label: "SCOPE" },
    { id: "discovery",    label: "BRIEF" },
    { id: "deliverables", label: "FILES" },
    { id: "agreement",    label: "SIGN" },
  ];

  return (
    <ThemeCtx.Provider value={theme}>
      <div style={{ minHeight: "100vh", background: PAGE, color: TEXT, fontFamily: "'Inter','SF Pro Display',system-ui,sans-serif", transition: "background 0.25s, color 0.25s" }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${PAGE}; -webkit-text-size-adjust: 100%; }
          input, textarea, button { -webkit-tap-highlight-color: transparent; }
          input::placeholder, textarea::placeholder { color: ${theme.MUTED}; }
          textarea { font-family: inherit; }
          @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;700&family=Inter:wght@400;500;600;700;900&display=swap');
          @keyframes saf-glow-pulse {
            0%, 100% { opacity: 1; box-shadow: 0 0 5px 1px ${GOLD}aa, 0 0 10px 3px ${GOLD}44; }
            50%       { opacity: 0.7; box-shadow: 0 0 3px 1px ${GOLD}66; }
          }
          @keyframes saf-glow-ring {
            0%   { transform: scale(1);   opacity: 0.8; }
            100% { transform: scale(2.4); opacity: 0; }
          }
        `}</style>

        {/* Header */}
        <header style={{ padding: "0 16px", borderBottom: `1px solid ${BORDER}`, background: HEADER, position: "sticky", top: 0, zIndex: 100, boxShadow: dark ? "none" : "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 16, color: GOLD }}>✂</div>
                  <div style={{ fontSize: 15, fontWeight: 900, color: TEXT, letterSpacing: 2 }}>SA FINEST</div>
                  <div style={{ fontSize: 8, color: GOLD, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace" }}>BARBERSHOP</div>
                </div>
                <div style={{ fontSize: 9, color: SUBTLE, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2, marginTop: 1 }}>LOGO DESIGN HUB</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {/* Progress */}
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: 11, color: GOLD, fontFamily: "'IBM Plex Mono',monospace", fontWeight: 700 }}>{pct}%</div>
                  <div style={{ fontSize: 9, color: DIM, fontFamily: "'IBM Plex Mono',monospace" }}>{done}/{total} done</div>
                </div>
                {/* Theme toggle */}
                <ThemeToggle dark={dark} onToggle={toggleTheme} />
              </div>
            </div>
            {/* Nav */}
            <div style={{ display: "flex", borderTop: `1px solid ${BORDER}`, overflowX: "auto", scrollbarWidth: "none" }}>
              {NAV.map(item => (
                <button key={item.id} onClick={() => setPage(item.id as any)}
                  style={{ flexShrink: 0, padding: "10px 14px", background: "none", border: "none", borderBottom: page === item.id ? `2px solid ${GOLD}` : "2px solid transparent", color: page === item.id ? GOLD : SUBTLE, fontSize: 10, fontWeight: 700, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer", transition: "all 0.15s", marginBottom: -1, minHeight: 40 }}>
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 860, margin: "0 auto" }}>
          {page === "workflow"     && <WorkflowPage tasks={tasks} setTask={setTask} isOps={isOps} />}
          {page === "scope"        && <ScopePage />}
          {page === "discovery"    && <DiscoveryPage isOps={isOps} />}
          {page === "deliverables" && <DeliverablesPage isOps={isOps} />}
          {page === "agreement"    && <AgreementPage />}
        </main>

        <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "16px", marginTop: 32 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 10, color: theme.MUTED, fontFamily: "'IBM Plex Mono',monospace" }}>twanii · SA Finest · Logo Design</div>
            <div style={{ fontSize: 10, color: theme.MUTED, fontFamily: "'IBM Plex Mono',monospace" }}>Questions? WhatsApp Anthony</div>
          </div>
        </footer>
      </div>
    </ThemeCtx.Provider>
  );
}
