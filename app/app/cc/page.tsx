"use client";

import { useState, useEffect, useRef, useCallback, Fragment } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";

// ─── Constants ────────────────────────────────────────────────────────────────

const LOCAL = "http://localhost:4747";

const CRM_STAGES = ["identified", "contacted", "meeting", "proposal", "active"];
const CONTENT_STATUSES = ["idea", "writing", "review", "scheduled", "published"];
const AGENTS_CFG = [
  { name: "DISPATCH",   dir: "dispatch",     role: "Orchestrator",        color: "var(--ag-blue)",   trust: "HIGH",       model: "opus"   },
  { name: "FUNKIE",     dir: "funkie",        role: "Product Operator",    color: "var(--funkie)",    trust: "LOW",        model: "sonnet" },
  { name: "LOBE",       dir: "lobe",          role: "Frontend Engineer",   color: "var(--lobe)",      trust: "HIGH",       model: "sonnet" },
  { name: "CONVEX",     dir: "convex-agent",  role: "Backend Engineer",    color: "var(--ag-green)",  trust: "MEDIUM",     model: "sonnet" },
  { name: "INK",        dir: "ink",           role: "Copywriter & Voice",  color: "var(--ag-rose)",   trust: "HIGH",       model: "opus"   },
  { name: "SEO ENGINE", dir: "seo-engine",    role: "SEO Strategist",      color: "var(--seo)",       trust: "MEDIUM",     model: "opus"   },
  { name: "SENTINEL",   dir: "sentinel",      role: "QA Gate",             color: "var(--ag-orange)", trust: "AUTO",       model: "sonnet" },
  { name: "MAILWATCH",  dir: "email-agent",   role: "Email Monitor",       color: "var(--ag-indigo)", trust: "CONTROLLED", model: "sonnet" },
  { name: "PM",         dir: "pm",            role: "Project Driver",      color: "var(--ag-slate)",  trust: "AUTO",       model: "sonnet" },
];

// ─── Helper Functions ──────────────────────────────────────────────────────────

function priorityColor(p: string) {
  return p === "P0" ? "var(--red)" : p === "P1" ? "#ea580c" : p === "P2" ? "#ca8a04" : "var(--text-3)";
}
function priorityBg(p: string) {
  return p === "P0" ? "var(--red-soft)" : p === "P1" ? "rgba(234,88,12,0.07)" : p === "P2" ? "rgba(202,138,4,0.07)" : "var(--bg-inset)";
}
function stageColor(s: string) {
  return s === "identified" ? "var(--text-3)" : s === "contacted" ? "var(--blue)" : s === "meeting" ? "var(--amber)" : s === "proposal" ? "var(--violet)" : s === "active" || s === "closed" ? "var(--green)" : "var(--text-3)";
}
function stageBg(s: string) {
  return s === "identified" ? "var(--bg-inset)" : s === "contacted" ? "var(--blue-soft)" : s === "meeting" ? "var(--amber-soft)" : s === "proposal" ? "var(--violet-soft)" : s === "active" || s === "closed" ? "var(--green-soft)" : "var(--bg-inset)";
}
function agentColor(n: string) {
  const k = (n || "").toLowerCase();
  if (k.includes("dispatch")) return "var(--ag-blue)";
  if (k.includes("funkie")) return "var(--funkie)";
  if (k.includes("lobe")) return "var(--lobe)";
  if (k.includes("convex")) return "var(--ag-green)";
  if (k.includes("ink")) return "var(--ag-rose)";
  if (k.includes("seo")) return "var(--seo)";
  if (k.includes("sentinel")) return "var(--ag-orange)";
  if (k.includes("mail")) return "var(--ag-indigo)";
  if (k.includes("pm")) return "var(--ag-slate)";
  return "var(--text-3)";
}
function agentBg(n: string) {
  const k = (n || "").toLowerCase();
  if (k.includes("dispatch")) return "var(--blue-soft)";
  if (k.includes("funkie")) return "var(--amber-soft)";
  if (k.includes("lobe")) return "var(--violet-soft)";
  if (k.includes("convex")) return "var(--green-soft)";
  if (k.includes("ink")) return "var(--ag-rose-soft)";
  if (k.includes("seo")) return "var(--cyan-soft)";
  if (k.includes("sentinel")) return "var(--ag-orange-soft)";
  if (k.includes("mail")) return "var(--ag-indigo-soft)";
  if (k.includes("pm")) return "var(--ag-slate-soft)";
  return "var(--bg-inset)";
}
function csColor(s: string) {
  return s === "idea" ? "var(--text-3)" : s === "writing" ? "var(--blue)" : s === "review" ? "var(--amber)" : s === "scheduled" ? "var(--violet)" : s === "published" ? "var(--green)" : "var(--text-3)";
}
function csBg(s: string) {
  return s === "idea" ? "var(--bg-inset)" : s === "writing" ? "var(--blue-soft)" : s === "review" ? "var(--amber-soft)" : s === "scheduled" ? "var(--violet-soft)" : s === "published" ? "var(--green-soft)" : "var(--bg-inset)";
}
function relTime(d: string | number | undefined) {
  if (!d) return "";
  const now = Date.now();
  const ms = now - new Date(d).getTime();
  const s = Math.floor(ms / 1000), m = Math.floor(s / 60), h = Math.floor(m / 60), dy = Math.floor(h / 24);
  if (s < 60) return "just now";
  if (m < 60) return m + "m ago";
  if (h < 24) return h + "h ago";
  return dy + "d ago";
}

function computeProjections(prospects: any[]) {
  const byStage: Record<string, number> = {};
  let pipelineValue = 0, currentMRR = 0;
  for (const p of prospects) {
    const st = p.status || "identified";
    byStage[st] = (byStage[st] || 0) + 1;
    pipelineValue += p.value || 0;
    if (st === "active") currentMRR += p.value || 0;
  }
  const weights: Record<string, number> = { identified: 0.1, contacted: 0.2, meeting: 0.4, proposal: 0.7, active: 1.0 };
  let weightedValue = 0;
  for (const p of prospects) weightedValue += (p.value || 0) * (weights[p.status] || 0);
  return { currentMRR, projectedMRR: currentMRR + Math.round(weightedValue * 0.5), pipelineValue, weightedValue: Math.round(weightedValue), byStage };
}

// ─── Style Objects ─────────────────────────────────────────────────────────────

const card: React.CSSProperties = { background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "var(--radius-lg)", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", padding: "20px" };
const btnPrimary: React.CSSProperties = { background: "var(--text-1)", color: "#fff", border: "none", borderRadius: "var(--radius)", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "opacity 0.15s var(--ease)" };
const btnGhost: React.CSSProperties = { background: "transparent", color: "var(--text-2)", border: "1px solid var(--border)", borderRadius: "var(--radius)", padding: "8px 16px", fontSize: "13px", fontWeight: 500, cursor: "pointer", transition: "all 0.15s var(--ease)" };
const btnDanger: React.CSSProperties = { background: "var(--red-soft)", color: "var(--red)", border: "1px solid rgba(220,38,38,0.15)", borderRadius: "var(--radius)", padding: "8px 16px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.15s var(--ease)" };
const inputStyle: React.CSSProperties = { width: "100%", padding: "8px 12px", border: "1px solid var(--border)", borderRadius: "var(--radius)", fontSize: "14px", fontFamily: "var(--font-sans)", background: "var(--bg-subtle)", outline: "none", transition: "border-color 0.15s var(--ease)" };
const labelStyle: React.CSSProperties = { display: "block", fontSize: "12px", fontWeight: 600, color: "var(--text-2)", marginBottom: "4px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" };

// ─── useLocalServer Hook ───────────────────────────────────────────────────────

function useLocalServer() {
  const [data, setData] = useState<any>(null);
  const [connected, setConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  const fetchStatus = useCallback(() => {
    fetch(`${LOCAL}/api/status`)
      .then((r) => r.json())
      .then((d) => { setData(d); setLastUpdate(Date.now()); setConnected(true); })
      .catch(() => setConnected(false));
  }, []);

  useEffect(() => {
    let es: EventSource | null = null;
    try {
      es = new EventSource(`${LOCAL}/sse`);
      es.onopen = () => setConnected(true);
      es.onmessage = (e) => {
        try { const d = JSON.parse(e.data); if (d) { setData(d); setLastUpdate(Date.now()); } } catch {}
      };
      es.onerror = () => setConnected(false);
    } catch { setConnected(false); }
    return () => es?.close();
  }, []);

  useEffect(() => {
    fetchStatus();
    const i = setInterval(fetchStatus, 30000);
    return () => clearInterval(i);
  }, [fetchStatus]);

  const fetchLocal = useCallback(async (path: string, options?: RequestInit) => {
    const r = await fetch(`${LOCAL}${path}`, options);
    return r.json();
  }, []);

  return { data, connected, lastUpdate, fetchAll: fetchStatus, fetchLocal };
}

// ─── Shared UI ─────────────────────────────────────────────────────────────────

function Sheet({ children, onClose, wide }: { children: React.ReactNode; onClose: () => void; wide?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", handler); };
  }, [onClose]);
  return (
    <div onClick={(e) => { if (e.target === ref.current) onClose(); }} ref={ref} style={{ position: "fixed", inset: 0, zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.3)", backdropFilter: "blur(12px)", WebkitBackdropFilter: "blur(12px)" }}>
      <div style={{ background: "var(--bg-card)", borderRadius: "20px", padding: "28px", width: wide ? "860px" : "520px", maxWidth: "95vw", maxHeight: "85vh", overflowY: "auto", animation: "sheet-in 0.25s var(--spring)" }}>
        {children}
      </div>
    </div>
  );
}

function ToastItem({ toast, onRemove }: { toast: any; onRemove: (id: number) => void }) {
  useEffect(() => { const t = setTimeout(() => onRemove(toast.id), 3200); return () => clearTimeout(t); }, [toast.id, onRemove]);
  const borderColor = toast.type === "success" ? "var(--green)" : toast.type === "error" ? "var(--red)" : "var(--amber)";
  return (
    <div style={{ background: "var(--text-1)", color: "#fff", padding: "12px 20px", borderRadius: "var(--radius)", fontSize: "13px", fontWeight: 500, borderLeft: "3px solid " + borderColor, animation: "fade-in 0.3s var(--spring)", position: "relative", overflow: "hidden", marginBottom: "8px" }}>
      {toast.message}
      <div style={{ position: "absolute", bottom: 0, left: 0, height: "2px", background: borderColor, animation: "toast-progress 3.2s linear" }} />
    </div>
  );
}
function ToastContainer({ toasts, removeToast }: { toasts: any[]; removeToast: (id: number) => void }) {
  if (!toasts.length) return null;
  return (
    <div style={{ position: "fixed", top: "16px", left: "50%", transform: "translateX(-50%)", zIndex: 300, display: "flex", flexDirection: "column", alignItems: "center" }}>
      {toasts.map((t) => <ToastItem key={t.id} toast={t} onRemove={removeToast} />)}
    </div>
  );
}

function SectionTitle({ children, style: sx }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-1)", marginBottom: "16px", letterSpacing: "-0.2px", ...(sx || {}) }}>{children}</h2>;
}

function LocalOnly({ connected, children }: { connected: boolean; children: React.ReactNode }) {
  if (!connected) {
    return (
      <div style={{ ...card, display: "flex", alignItems: "center", justifyContent: "center", minHeight: "120px", opacity: 0.6 }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "13px", color: "var(--text-3)", marginBottom: "4px" }}>Local server offline</div>
          <div style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>Start with: node cc-server.mjs</div>
        </div>
      </div>
    );
  }
  return <>{children}</>;
}

// ─── CommandStrip ──────────────────────────────────────────────────────────────

function CommandStrip({ localData, connected, lastUpdate, onRefresh, activeTab, setActiveTab, projections, convexContent }: any) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => { const i = setInterval(() => setNow(Date.now()), 1000); return () => clearInterval(i); }, []);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  const clock = new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true });
  const secsAgo = Math.max(0, Math.floor((now - lastUpdate) / 1000));

  const goals = localData?.goals || { done: 0, total: 0 };
  const published = (convexContent || []).filter((i: any) => i.status === "published").length;
  const pipeVal = projections?.pipelineValue || 0;
  const mrr = projections?.currentMRR || 0;

  const kpis = [
    { label: "MRR", value: "$" + mrr },
    { label: "Pipeline", value: "$" + pipeVal },
    { label: "Published", value: published },
    { label: "Goals", value: goals.done + "/" + goals.total },
  ];

  const tabs = ["overview", "pipeline", "content", "agents", "system"];
  const chipStyle: React.CSSProperties = { display: "inline-flex", alignItems: "center", gap: "6px", padding: "4px 12px", background: "var(--bg-inset)", borderRadius: "20px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-2)", fontWeight: 500 };

  return (
    <div style={{ position: "sticky", top: 0, zIndex: 100, background: "var(--bg-card)", borderBottom: "1px solid var(--border)", padding: "0 28px" }}>
      <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", height: "52px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ fontWeight: 700, fontSize: "15px", letterSpacing: "-0.5px" }}>FADEJUNKIE</span>
          <span style={{ color: "var(--text-3)", fontSize: "13px" }}>Good {greeting}, Anthony</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          {kpis.map((k) => (
            <div key={k.label} style={chipStyle}>
              <span style={{ color: "var(--text-3)" }}>{k.label}</span>
              <span style={{ color: "var(--text-1)", fontWeight: 600 }}>{k.value}</span>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: connected ? "var(--green)" : "var(--red)", animation: connected ? "glow 2s infinite" : "pulse 1.5s infinite" }} />
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{connected ? "Live" : "Polling"} · {secsAgo}s</span>
          </div>
          <span style={{ fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{clock}</span>
          <button onClick={onRefresh} style={{ ...btnGhost, padding: "4px 10px", fontSize: "12px" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Refresh</button>
        </div>
      </div>
      <div style={{ maxWidth: "1320px", margin: "0 auto", display: "flex", gap: "4px" }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ background: "none", border: "none", padding: "8px 16px", fontSize: "13px", fontWeight: activeTab === t ? 600 : 400, color: activeTab === t ? "var(--text-1)" : "var(--text-3)", cursor: "pointer", borderBottom: activeTab === t ? "2px solid var(--text-1)" : "2px solid transparent", transition: "all 0.15s var(--ease)", textTransform: "capitalize" }} onMouseOver={(e) => { if (activeTab !== t) e.currentTarget.style.color = "var(--text-2)"; }} onMouseOut={(e) => { if (activeTab !== t) e.currentTarget.style.color = "var(--text-3)"; }}>{t}</button>
        ))}
      </div>
    </div>
  );
}

// ─── Overview Components ───────────────────────────────────────────────────────

function AlertRail({ data }: { data: any }) {
  const alerts: { text: string; level: string }[] = [];
  const agents = data?.agents || [];
  agents.forEach((a: any) => {
    if ((a.inbox || []).length) alerts.push({ text: (a.name || a.dir) + " has " + a.inbox.length + " inbox item(s)", level: "amber" });
    if ((a.pending || []).length) alerts.push({ text: (a.name || a.dir) + " has " + a.pending.length + " pending plan(s)", level: "amber" });
  });
  const p0 = (data?.audit?.items || []).filter((i: any) => i.priority === "P0");
  if (p0.length) alerts.push({ text: p0.length + " critical (P0) audit item(s)", level: "red" });
  if (!alerts.length) return null;
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "20px", animation: "fade-in 0.3s var(--ease)" }}>
      {alerts.map((a, i) => (
        <span key={i} style={{ display: "inline-flex", alignItems: "center", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: 500, background: a.level === "red" ? "var(--red-soft)" : "var(--amber-soft)", color: a.level === "red" ? "var(--red)" : "var(--amber)", fontFamily: "var(--font-mono)" }}>{a.text}</span>
      ))}
    </div>
  );
}

function GitCard({ data, health, openSheet }: any) {
  const git = data?.git || {};
  const commits = (git.recentCommits || []).slice(0, 6);
  const checks = health || [];
  return (
    <div style={{ ...card }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
        <span style={{ fontWeight: 700, fontSize: "14px" }}>Git Status</span>
        {git.branch && <span style={{ padding: "2px 10px", borderRadius: "20px", background: "var(--violet-soft)", color: "var(--violet)", fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>{git.branch}</span>}
        {git.dirty > 0 && <span style={{ fontSize: "12px", color: "var(--amber)", fontFamily: "var(--font-mono)" }}>{git.dirty} dirty</span>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "6px", marginBottom: "16px" }}>
        {commits.length === 0 && <span style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No recent commits</span>}
        {commits.map((c: any, i: number) => (
          <div key={i} style={{ display: "flex", alignItems: "baseline", gap: "8px", fontSize: "13px" }}>
            <span onClick={() => openSheet({ type: "diff", hash: c.hash })} style={{ fontFamily: "var(--font-mono)", color: "var(--violet)", cursor: "pointer", borderBottom: "1px dashed var(--violet)", fontSize: "12px" }}>{(c.hash || "").slice(0, 7)}</span>
            <span style={{ color: "var(--text-2)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", cursor: "pointer" }} title={"Click to copy: git show " + (c.hash || "")} onClick={() => { navigator.clipboard.writeText("git show " + c.hash); }}>{c.message}</span>
          </div>
        ))}
      </div>
      {checks.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
          {checks.map((ch: any, i: number) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px", color: "var(--text-2)" }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: ch.ok || ch.status === "ok" ? "var(--green)" : ch.status === "warn" ? "var(--amber)" : "var(--red)" }} />
              <span>{ch.name || ch.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function GoalsSummaryCard({ data }: { data: any }) {
  const goals = data?.goals || { done: 0, total: 16, arms: [] };
  const pct = goals.total > 0 ? Math.round((goals.done / goals.total) * 100) : 0;
  const arms = goals.arms || goals.categories || [];
  return (
    <div style={{ ...card }}>
      <div style={{ fontWeight: 700, fontSize: "14px", marginBottom: "16px" }}>Q1 Goals</div>
      <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginBottom: "12px" }}>
        <span style={{ fontSize: "36px", fontWeight: 700, fontFamily: "var(--font-mono)", letterSpacing: "-2px" }}>{goals.done}</span>
        <span style={{ fontSize: "14px", color: "var(--text-3)" }}>/ {goals.total}</span>
      </div>
      <div style={{ height: "6px", background: "var(--bg-inset)", borderRadius: "3px", marginBottom: "16px", overflow: "hidden" }}>
        <div style={{ height: "100%", width: pct + "%", background: "var(--green)", borderRadius: "3px", transition: "width 0.4s var(--ease)" }} />
      </div>
      {pct === 0 && <p style={{ fontSize: "13px", color: "var(--text-3)", fontStyle: "italic", marginBottom: "12px" }}>All goals open — pick one and move.</p>}
      {arms.map((arm: any, i: number) => {
        const aPct = arm.total > 0 ? Math.round((arm.done / arm.total) * 100) : 0;
        return (
          <div key={i} style={{ marginBottom: "8px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "3px" }}>
              <span style={{ color: "var(--text-2)", fontWeight: 500 }}>{arm.name || arm.label}</span>
              <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{arm.done}/{arm.total}</span>
            </div>
            <div style={{ height: "4px", background: "var(--bg-inset)", borderRadius: "2px", overflow: "hidden" }}>
              <div style={{ height: "100%", width: aPct + "%", background: "var(--text-2)", borderRadius: "2px", transition: "width 0.4s var(--ease)" }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// MetricsCard — Convex-backed
function MetricsCard({ metrics, updateMetric, addToast }: { metrics: any[] | undefined; updateMetric: any; addToast: (m: string, t: string) => void }) {
  const [editing, setEditing] = useState<string | null>(null);
  const [editVal, setEditVal] = useState("");

  const items = metrics || [];

  function startEdit(key: string, currentVal: number) {
    setEditing(key);
    setEditVal(String(currentVal));
  }

  async function saveMetric() {
    if (!editing) return;
    try {
      await updateMetric({ key: editing, count: Number(editVal) });
      addToast("Metric updated", "success");
      setEditing(null);
    } catch {
      addToast("Failed to save", "error");
    }
  }

  if (!items.length) return <div style={card}><span style={{ fontStyle: "italic", color: "var(--text-3)" }}>No metrics — seed them in Convex dashboard</span></div>;

  return (
    <div style={{ ...card }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(180px,1fr))", gap: "12px" }}>
        {items.map((m) => {
          const val = m.count ?? 0;
          const isEd = editing === m.key;
          return (
            <div key={m.key} onClick={() => { if (!isEd) startEdit(m.key, val); }} style={{ padding: "14px", borderRadius: "var(--radius)", border: "1px solid var(--border)", cursor: "pointer", transition: "all 0.15s var(--ease)", background: isEd ? "var(--bg-subtle)" : "transparent" }} onMouseOver={(e) => { if (!isEd) e.currentTarget.style.background = "var(--bg-hover)"; }} onMouseOut={(e) => { if (!isEd) e.currentTarget.style.background = "transparent"; }}>
              <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)", textTransform: "uppercase", marginBottom: "6px", letterSpacing: "0.5px" }}>{m.label || m.key}</div>
              {isEd ? (
                <div onClick={(e) => e.stopPropagation()}>
                  <input type="number" value={editVal} onChange={(e) => setEditVal(e.target.value)} style={{ ...inputStyle, marginBottom: "8px", padding: "6px 10px", fontSize: "18px", fontWeight: 700, fontFamily: "var(--font-mono)", width: "100%" }} autoFocus />
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button onClick={saveMetric} style={{ ...btnPrimary, padding: "4px 12px", fontSize: "12px" }}>Save</button>
                    <button onClick={() => setEditing(null)} style={{ ...btnGhost, padding: "4px 12px", fontSize: "12px" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div>
                  <span style={{ fontSize: "22px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{val}</span>
                  {m.target != null && <span style={{ fontSize: "12px", color: "var(--text-3)", marginLeft: "4px" }}>/ {m.target}</span>}
                  {m.updated && <div style={{ fontSize: "11px", color: "var(--text-3)", marginTop: "4px", fontFamily: "var(--font-mono)" }}>{relTime(m.updated)}</div>}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InsightsPanel({ data }: { data: any }) {
  const insights = data?.insights || {};
  const score = insights.score ?? 0;
  const items = insights.items || [];
  const highlights = insights.highlights || [];
  const r = 26, circ = 2 * Math.PI * r;
  const offset = circ - (circ * Math.min(score, 100) / 100);
  const scoreMsg = score >= 80 ? "Strong position" : score >= 50 ? "Making progress" : "Needs attention";
  const now = new Date(), q1End = new Date(now.getFullYear(), 2, 31);
  const daysLeft = Math.max(0, Math.ceil((q1End.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)));
  const typeColor = (t: string) => t === "critical" ? "var(--red)" : t === "action" ? "var(--amber)" : t === "warning" ? "#ca8a04" : "var(--blue)";
  return (
    <div style={{ ...card }}>
      <div style={{ display: "flex", alignItems: "center", gap: "20px", marginBottom: "20px" }}>
        <div style={{ position: "relative", width: "68px", height: "68px" }}>
          <svg width="68" height="68" viewBox="0 0 68 68">
            <circle cx="34" cy="34" r={r} fill="none" stroke="var(--bg-inset)" strokeWidth="5" />
            <circle cx="34" cy="34" r={r} fill="none" stroke={score >= 60 ? "var(--green)" : score >= 30 ? "var(--amber)" : "var(--red)"} strokeWidth="5" strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round" transform="rotate(-90 34 34)" style={{ transition: "stroke-dashoffset 0.6s var(--ease)" }} />
          </svg>
          <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{score}</div>
        </div>
        <div>
          <div style={{ fontSize: "15px", fontWeight: 600 }}>{scoreMsg}</div>
          <div style={{ fontSize: "12px", color: "var(--text-3)", marginTop: "2px" }}>Business Health Score</div>
        </div>
        <div style={{ marginLeft: "auto", padding: "4px 12px", borderRadius: "20px", background: "var(--bg-inset)", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>{daysLeft}d left in Q1</div>
      </div>
      {highlights.length > 0 && (
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "16px" }}>
          {highlights.map((h: any, i: number) => (
            <span key={i} style={{ fontSize: "12px", color: "var(--text-2)" }}>
              {typeof h === "string" ? h : <span><strong>{h.label}:</strong> {h.value}{h.sub ? " — " + h.sub : ""}</span>}
            </span>
          ))}
        </div>
      )}
      {items.length > 0 && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
          {items.map((it: any, i: number) => (
            <div key={i} style={{ padding: "12px 14px", borderRadius: "var(--radius)", background: "var(--bg-subtle)", borderLeft: "3px solid " + typeColor(it.type) }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                <span style={{ fontSize: "14px" }}>{it.icon || "\u2022"}</span>
                <span style={{ fontSize: "13px", fontWeight: 600 }}>{it.title}</span>
              </div>
              <p style={{ fontSize: "12px", color: "var(--text-2)", lineHeight: 1.4 }}>{it.body || it.description || it.text}</p>
            </div>
          ))}
        </div>
      )}
      {items.length === 0 && <p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No insights available — start the local server</p>}
    </div>
  );
}

function ActivityPanel({ data }: { data: any }) {
  const activity = data?.recentActivity || [];
  if (!activity.length) return <div style={card}><p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No recent activity</p></div>;
  return (
    <div style={{ ...card, padding: "0", overflow: "hidden" }}>
      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "13px" }}>
        <thead>
          <tr style={{ background: "var(--bg-subtle)" }}>
            {["Date", "Task", "Impact", "Details"].map((h) => <th key={h} style={{ textAlign: "left", padding: "10px 16px", fontWeight: 600, fontSize: "12px", color: "var(--text-2)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}>{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {activity.map((a: any, i: number) => (
            <tr key={i} style={{ borderTop: "1px solid var(--border)" }}>
              <td style={{ padding: "10px 16px", fontFamily: "var(--font-mono)", color: "var(--text-3)", fontSize: "12px", whiteSpace: "nowrap" }}>{a.date || relTime(a.timestamp)}</td>
              <td style={{ padding: "10px 16px", fontWeight: 500 }}>{a.task || a.title}</td>
              <td style={{ padding: "10px 16px", color: "var(--text-2)" }}>{a.impact || "—"}</td>
              <td style={{ padding: "10px 16px", color: "var(--text-2)", maxWidth: "300px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.details || a.description || "—"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ─── Pipeline Components ───────────────────────────────────────────────────────

function ProjectionsBar({ projections }: { projections: any }) {
  const p = projections || {};
  const stages = Object.entries(p.byStage || {}).map(([stage, count]) => ({ stage, count: count as number }));
  const total = stages.reduce((s, x) => s + x.count, 0) || 1;
  const stats = [
    { label: "Current MRR", value: "$" + (p.currentMRR || 0) },
    { label: "Projected MRR", value: "$" + (p.projectedMRR || 0) },
    { label: "Pipeline Value", value: "$" + (p.pipelineValue || 0) },
    { label: "Weighted Value", value: "$" + (p.weightedValue || 0) },
  ];
  return (
    <div style={{ ...card, marginBottom: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "0", marginBottom: "20px" }}>
        {stats.map((s, i) => (
          <div key={i} style={{ flex: 1, textAlign: "center", padding: "0 12px", borderRight: i < stats.length - 1 ? "1px solid var(--border)" : "none" }}>
            <div style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)", textTransform: "uppercase", marginBottom: "4px", letterSpacing: "0.5px" }}>{s.label}</div>
            <div style={{ fontSize: "20px", fontWeight: 700, fontFamily: "var(--font-mono)" }}>{s.value}</div>
          </div>
        ))}
      </div>
      {stages.length > 0 ? (
        <div>
          <div style={{ display: "flex", height: "10px", borderRadius: "5px", overflow: "hidden", marginBottom: "10px" }}>
            {stages.map((s, i) => <div key={i} style={{ width: (s.count / total * 100) + "%", background: stageColor(s.stage), transition: "width 0.4s var(--ease)" }} />)}
          </div>
          <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
            {stages.map((s, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "5px", fontSize: "12px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: stageColor(s.stage) }} />
                <span style={{ color: "var(--text-2)", textTransform: "capitalize" }}>{s.stage}</span>
                <span style={{ fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{s.count}</span>
              </div>
            ))}
          </div>
        </div>
      ) : <p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No pipeline data</p>}
    </div>
  );
}

// CRMPanel — Convex-backed (prospects array with _id)
function CRMPanel({ prospects, openSheet }: { prospects: any[]; openSheet: (cfg: any) => void }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "12px", marginBottom: "24px" }}>
      {CRM_STAGES.map((stage) => {
        const items = prospects.filter((p) => p.status === stage);
        const totalVal = items.reduce((s, p) => s + (p.value || 0), 0);
        return (
          <div key={stage} style={{ minHeight: "200px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "2px", background: stageColor(stage) }} />
                <span style={{ fontSize: "12px", fontWeight: 600, textTransform: "capitalize" }}>{stage}</span>
              </div>
              {totalVal > 0 && <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{"$" + totalVal}</span>}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {items.map((p) => (
                <div key={p._id} onClick={() => openSheet({ type: "prospect", prospect: p })} style={{ ...card, padding: "12px", cursor: "pointer", transition: "all 0.15s var(--ease)" }} onMouseOver={(e) => { e.currentTarget.style.transform = "translateY(-2px)"; e.currentTarget.style.boxShadow = "0 4px 12px rgba(0,0,0,0.08)"; }} onMouseOut={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.04)"; }}>
                  <div style={{ fontWeight: 600, fontSize: "13px", marginBottom: "4px" }}>{p.name}</div>
                  {p.type && <span style={{ display: "inline-block", padding: "1px 8px", borderRadius: "10px", background: "var(--bg-inset)", fontSize: "11px", color: "var(--text-3)", marginBottom: "4px" }}>{p.type}</span>}
                  {p.location && <div style={{ fontSize: "11px", color: "var(--text-3)" }}>{p.location}</div>}
                  {p.value > 0 && <div style={{ fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-mono)", marginTop: "4px" }}>{"$" + p.value}</div>}
                </div>
              ))}
              {items.length === 0 && <span style={{ fontSize: "12px", fontStyle: "italic", color: "var(--text-3)", textAlign: "center", padding: "16px 0" }}>Empty</span>}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// ProspectSheet — Convex-backed
function ProspectSheet({ prospect, onClose, updateProspect, removeProspect, addToast }: any) {
  const [form, setForm] = useState({
    name: prospect.name || "", type: prospect.type || "", contact: prospect.contact || "",
    location: prospect.location || "", email: prospect.email || "", phone: prospect.phone || "",
    status: prospect.status || "identified", value: prospect.value || 0, notes: prospect.notes || "",
  });
  const upd = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  async function save() {
    try {
      await updateProspect({ id: prospect._id, ...form, value: Number(form.value) });
      addToast("Prospect saved", "success");
      onClose();
    } catch { addToast("Save failed", "error"); }
  }
  async function del() {
    try {
      await removeProspect({ id: prospect._id });
      addToast("Prospect deleted", "success");
      onClose();
    } catch { addToast("Delete failed", "error"); }
  }

  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Edit Prospect</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={(e) => upd("name", e.target.value)} /></div>
        <div><label style={labelStyle}>Type</label><input style={inputStyle} value={form.type} onChange={(e) => upd("type", e.target.value)} /></div>
        <div><label style={labelStyle}>Contact</label><input style={inputStyle} value={form.contact} onChange={(e) => upd("contact", e.target.value)} /></div>
        <div><label style={labelStyle}>Location</label><input style={inputStyle} value={form.location} onChange={(e) => upd("location", e.target.value)} /></div>
        <div><label style={labelStyle}>Email</label><input style={inputStyle} value={form.email} onChange={(e) => upd("email", e.target.value)} /></div>
        <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => upd("status", e.target.value)}>
            {CRM_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Value ($)</label><input type="number" style={inputStyle} value={form.value} onChange={(e) => upd("value", e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Notes</label>
        <textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.notes} onChange={(e) => upd("notes", e.target.value)} />
      </div>
      {prospect.history && prospect.history.length > 0 && (
        <div style={{ marginBottom: "16px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
          <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-2)", marginBottom: "8px" }}>History</div>
          {prospect.history.map((h: any, i: number) => <div key={i} style={{ fontSize: "12px", color: "var(--text-3)", marginBottom: "4px" }}>{h.date || relTime(h.timestamp)} — {h.action || h.note}</div>)}
        </div>
      )}
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={del} style={btnDanger} onMouseOver={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.12)")} onMouseOut={(e) => (e.currentTarget.style.background = "var(--red-soft)")}>Delete</button>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={save} style={btnPrimary} onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}>Save</button>
      </div>
    </Sheet>
  );
}

// AddProspectSheet — Convex-backed
function AddProspectSheet({ onClose, addProspect, addToast }: any) {
  const [form, setForm] = useState({ name: "", type: "", location: "", email: "", phone: "", status: "identified", value: 0, notes: "" });
  const upd = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  async function save() {
    try {
      await addProspect({ ...form, value: Number(form.value) });
      addToast("Prospect added", "success");
      onClose();
    } catch { addToast("Failed to add", "error"); }
  }

  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Add Prospect</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
        <div><label style={labelStyle}>Name</label><input style={inputStyle} value={form.name} onChange={(e) => upd("name", e.target.value)} autoFocus /></div>
        <div><label style={labelStyle}>Type</label><input style={inputStyle} value={form.type} onChange={(e) => upd("type", e.target.value)} /></div>
        <div><label style={labelStyle}>Location</label><input style={inputStyle} value={form.location} onChange={(e) => upd("location", e.target.value)} /></div>
        <div><label style={labelStyle}>Email</label><input style={inputStyle} value={form.email} onChange={(e) => upd("email", e.target.value)} /></div>
        <div><label style={labelStyle}>Phone</label><input style={inputStyle} value={form.phone} onChange={(e) => upd("phone", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => upd("status", e.target.value)}>
            {CRM_STAGES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Value ($)</label><input type="number" style={inputStyle} value={form.value} onChange={(e) => upd("value", e.target.value)} /></div>
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Notes</label>
        <textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={form.notes} onChange={(e) => upd("notes", e.target.value)} />
      </div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={save} disabled={!form.name} style={{ ...btnPrimary, opacity: form.name ? 1 : 0.5 }}>Add Prospect</button>
      </div>
    </Sheet>
  );
}

// ─── Content Components — Convex-backed ────────────────────────────────────────

function ContentCalendarPanel({ content, openSheet }: { content: any[]; openSheet: (cfg: any) => void }) {
  const [filter, setFilter] = useState("All");
  const audiences = ["All", "Barbers", "Students", "Schools", "Shops"];
  const filtered = filter === "All" ? content : content.filter((it) => it.audience === filter || (it.audiences || []).includes(filter));

  return (
    <div style={card}>
      <div style={{ display: "flex", gap: "6px", marginBottom: "16px", flexWrap: "wrap" }}>
        {audiences.map((a) => (
          <button key={a} onClick={() => setFilter(a)} style={{ ...btnGhost, padding: "4px 14px", fontSize: "12px", background: filter === a ? "var(--text-1)" : "transparent", color: filter === a ? "#fff" : "var(--text-2)", borderColor: filter === a ? "var(--text-1)" : "var(--border)" }} onMouseOver={(e) => { if (filter !== a) e.currentTarget.style.background = "var(--bg-hover)"; }} onMouseOut={(e) => { if (filter !== a) e.currentTarget.style.background = "transparent"; }}>{a}</button>
        ))}
      </div>
      {CONTENT_STATUSES.map((status) => {
        const group = filtered.filter((it) => it.status === status);
        return (
          <div key={status} style={{ marginBottom: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: csColor(status) }} />
                <span style={{ fontSize: "13px", fontWeight: 600, textTransform: "capitalize" }}>{status}</span>
                <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{group.length}</span>
              </div>
              <button onClick={() => openSheet({ type: "addContent", defaultStatus: status })} style={{ ...btnGhost, padding: "2px 10px", fontSize: "11px" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>+ Add</button>
            </div>
            {group.map((it) => (
              <div key={it._id} onClick={() => openSheet({ type: "editContent", item: it })} style={{ padding: "10px 14px", borderRadius: "var(--radius)", border: "1px solid var(--border)", marginBottom: "6px", cursor: "pointer", transition: "all 0.15s var(--ease)" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: 500, fontSize: "13px", flex: 1 }}>{it.title}</span>
                  {it.type && <span style={{ padding: "1px 8px", borderRadius: "10px", background: csBg(status), color: csColor(status), fontSize: "11px" }}>{it.type}</span>}
                  {it.audience && <span style={{ padding: "1px 8px", borderRadius: "10px", background: "var(--bg-inset)", fontSize: "11px", color: "var(--text-3)" }}>{it.audience}</span>}
                </div>
                {it.targetDate && <div style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)", marginTop: "4px" }}>{it.targetDate}</div>}
              </div>
            ))}
            {group.length === 0 && <p style={{ fontSize: "12px", fontStyle: "italic", color: "var(--text-3)", padding: "6px 0" }}>No items</p>}
          </div>
        );
      })}
    </div>
  );
}

function ContentSheet({ item, onClose, updateContent, removeContent, addToast }: any) {
  const [form, setForm] = useState({
    title: item.title || "", type: item.type || "", audience: item.audience || "",
    status: item.status || "idea", targetDate: item.targetDate || "", priority: item.priority || "medium", notes: item.notes || "",
  });
  const upd = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  async function save() {
    try {
      await updateContent({ id: item._id, ...form });
      addToast("Content updated", "success");
      onClose();
    } catch { addToast("Save failed", "error"); }
  }
  async function del() {
    try {
      await removeContent({ id: item._id });
      addToast("Content deleted", "success");
      onClose();
    } catch { addToast("Delete failed", "error"); }
  }

  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Edit Content</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
        <div style={{ gridColumn: "span 2" }}><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title} onChange={(e) => upd("title", e.target.value)} /></div>
        <div><label style={labelStyle}>Type</label><input style={inputStyle} value={form.type} onChange={(e) => upd("type", e.target.value)} /></div>
        <div><label style={labelStyle}>Audience</label><input style={inputStyle} value={form.audience} onChange={(e) => upd("audience", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => upd("status", e.target.value)}>
            {CONTENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Target Date</label><input type="date" style={inputStyle} value={form.targetDate} onChange={(e) => upd("targetDate", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Priority</label>
          <select style={inputStyle} value={form.priority} onChange={(e) => upd("priority", e.target.value)}>
            {["low", "medium", "high"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Notes</label><textarea style={{ ...inputStyle, minHeight: "80px", resize: "vertical" }} value={form.notes} onChange={(e) => upd("notes", e.target.value)} /></div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={del} style={btnDanger} onMouseOver={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.12)")} onMouseOut={(e) => (e.currentTarget.style.background = "var(--red-soft)")}>Delete</button>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={save} style={btnPrimary} onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}>Save</button>
      </div>
    </Sheet>
  );
}

function AddContentSheet({ defaultStatus, onClose, addContent, addToast }: any) {
  const [form, setForm] = useState({ title: "", type: "", audience: "", status: defaultStatus || "idea", targetDate: "", priority: "medium", notes: "" });
  const upd = (k: string, v: any) => setForm((prev) => ({ ...prev, [k]: v }));

  async function save() {
    try {
      await addContent({ ...form });
      addToast("Content added", "success");
      onClose();
    } catch { addToast("Failed to add", "error"); }
  }

  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Add Content</h3>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px", marginBottom: "16px" }}>
        <div style={{ gridColumn: "span 2" }}><label style={labelStyle}>Title</label><input style={inputStyle} value={form.title} onChange={(e) => upd("title", e.target.value)} autoFocus /></div>
        <div><label style={labelStyle}>Type</label><input style={inputStyle} value={form.type} onChange={(e) => upd("type", e.target.value)} /></div>
        <div><label style={labelStyle}>Audience</label><input style={inputStyle} value={form.audience} onChange={(e) => upd("audience", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Status</label>
          <select style={inputStyle} value={form.status} onChange={(e) => upd("status", e.target.value)}>
            {CONTENT_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div><label style={labelStyle}>Target Date</label><input type="date" style={inputStyle} value={form.targetDate} onChange={(e) => upd("targetDate", e.target.value)} /></div>
        <div>
          <label style={labelStyle}>Priority</label>
          <select style={inputStyle} value={form.priority} onChange={(e) => upd("priority", e.target.value)}>
            {["low", "medium", "high"].map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>
      <div style={{ marginBottom: "16px" }}><label style={labelStyle}>Notes</label><textarea style={{ ...inputStyle, minHeight: "60px", resize: "vertical" }} value={form.notes} onChange={(e) => upd("notes", e.target.value)} /></div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={save} disabled={!form.title} style={{ ...btnPrimary, opacity: form.title ? 1 : 0.5 }}>Add</button>
      </div>
    </Sheet>
  );
}

// NotesPanel — Convex-backed
function NotesPanel({ notes, addNoteM, removeNoteM, addToast }: any) {
  const [text, setText] = useState("");

  async function addNote() {
    if (!text.trim()) return;
    try {
      await addNoteM({ text: text.trim() });
      setText("");
      addToast("Note saved", "success");
    } catch { addToast("Failed to save note", "error"); }
  }
  async function deleteNote(id: Id<"ccNotes">) {
    try {
      await removeNoteM({ id });
      addToast("Note deleted", "success");
    } catch { addToast("Delete failed", "error"); }
  }
  function handleKey(e: React.KeyboardEvent) {
    if ((e.metaKey || e.ctrlKey) && e.key === "Enter") addNote();
  }

  return (
    <div style={card}>
      <div style={{ marginBottom: "12px" }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} onKeyDown={handleKey} placeholder="Quick note... (Cmd+Enter to save)" style={{ ...inputStyle, minHeight: "70px", resize: "vertical" }} />
        <button onClick={addNote} disabled={!text.trim()} style={{ ...btnPrimary, marginTop: "8px", opacity: text.trim() ? 1 : 0.5, width: "100%" }}>Save Note</button>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {(notes || []).map((n: any) => (
          <div key={n._id} style={{ padding: "10px 12px", borderRadius: "var(--radius)", border: "1px solid var(--border)", fontSize: "13px", display: "flex", alignItems: "flex-start", gap: "8px" }}>
            <span style={{ flex: 1, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{n.text}</span>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
              <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)", whiteSpace: "nowrap" }}>{relTime(n.createdAt)}</span>
              <button onClick={() => deleteNote(n._id)} style={{ background: "none", border: "none", color: "var(--text-3)", cursor: "pointer", fontSize: "14px", padding: "2px", transition: "color 0.15s var(--ease)" }} onMouseOver={(e) => (e.currentTarget.style.color = "var(--red)")} onMouseOut={(e) => (e.currentTarget.style.color = "var(--text-3)")} title="Delete">&times;</button>
            </div>
          </div>
        ))}
        {!(notes || []).length && <p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "12px", textAlign: "center", padding: "12px" }}>No notes yet</p>}
      </div>
    </div>
  );
}

// ─── Agent Components — LOCAL ONLY ────────────────────────────────────────────

function TrustBadge({ level }: { level: string }) {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    HIGH:       { bg: "var(--green-soft)", color: "var(--green)", label: "HIGH" },
    MEDIUM:     { bg: "var(--amber-soft)", color: "var(--amber)", label: "MED" },
    LOW:        { bg: "var(--red-soft)", color: "var(--red)", label: "LOW" },
    AUTO:       { bg: "var(--blue-soft)", color: "var(--blue)", label: "AUTO" },
    CONTROLLED: { bg: "var(--ag-indigo-soft)", color: "var(--ag-indigo)", label: "CTRL" },
  };
  const cfg = map[level] || map.MEDIUM;
  return <span className="trust-badge" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>;
}

function ModelChip({ model }: { model: string }) {
  const colors: Record<string, string> = { opus: "var(--ag-rose)", sonnet: "var(--lobe)", haiku: "var(--seo)" };
  return (
    <span style={{ fontSize: "10px", fontFamily: "var(--font-mono)", padding: "2px 6px", borderRadius: "4px", background: "var(--bg-inset)", color: colors[model] || "var(--text-3)", fontWeight: 600 }}>
      {model}
    </span>
  );
}

function AgentCard({ agent, openSheet, onQuickTask, fetchLocal, addToast }: any) {
  const pending = agent.pending || [];
  const inbox = agent.inbox || [];
  const doneCount = agent.doneCount || 0;
  const recentDone = agent.recentDone || [];
  const currentTask = agent.currentTask || null;
  const trust = agent.trust || "MEDIUM";
  const model = agent.model || "sonnet";
  const inboxAge = agent.inboxAge || null;
  const isActive = inbox.length > 0 || (agent.status && agent.status !== "idle");
  const isEscalated = inboxAge !== null && inboxAge > 2 * 60 * 60 * 1000; // 2 hours

  const [cmdValue, setCmdValue] = useState("");
  const [sending, setSending] = useState(false);

  async function handleQuickTask(e: React.KeyboardEvent) {
    if (e.key !== "Enter" || !cmdValue.trim() || sending) return;
    setSending(true);
    try {
      await fetchLocal("/api/task", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agent: agent.dir, title: cmdValue.trim(), content: "" }),
      });
      addToast(`Task sent to ${agent.name}`, "success");
      setCmdValue("");
    } catch {
      addToast("Failed to send task", "error");
    }
    setSending(false);
  }

  return (
    <div
      className={`agent-card${isEscalated ? " escalated" : ""}`}
      style={{
        ...card,
        borderTop: `3px solid ${agent.color}`,
        position: "relative",
        display: "flex",
        flexDirection: "column",
        ...(isActive && !isEscalated ? {
          animation: "pulse-ring 2.5s ease-in-out infinite",
          "--pulse-color": agent.color.replace("var(", "").replace(")", ""),
        } as React.CSSProperties : {}),
      }}
    >
      {/* ── Header: Name + Role + Badges ── */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: "10px" }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <div style={{
              width: "8px", height: "8px", borderRadius: "50%", flexShrink: 0,
              background: isEscalated ? "var(--red)" : isActive ? "var(--green)" : "var(--text-3)",
              ...(isActive && !isEscalated ? { animation: "glow 2s ease-in-out infinite" } : {}),
            }} />
            <span style={{ fontWeight: 700, fontSize: "14px", letterSpacing: "-0.2px" }}>{agent.name}</span>
          </div>
          <div style={{ fontSize: "11px", color: "var(--text-3)", marginLeft: "16px" }}>{agent.role}</div>
        </div>
        <div style={{ display: "flex", gap: "4px", alignItems: "center", flexShrink: 0 }}>
          <TrustBadge level={trust} />
          <ModelChip model={model} />
        </div>
      </div>

      {/* ── Agent Monologue ── */}
      {currentTask && (
        <div style={{
          padding: "6px 10px", borderRadius: "var(--radius)", background: "var(--bg-subtle)",
          marginBottom: "10px", fontSize: "11px", fontStyle: "italic", color: "var(--text-2)",
          whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          borderLeft: `2px solid ${agent.color}`,
          animation: "slide-up 0.3s var(--ease)",
        }}>
          {currentTask}
        </div>
      )}

      {/* ── Escalation Warning ── */}
      {isEscalated && (
        <div style={{
          padding: "6px 10px", borderRadius: "var(--radius)", background: "var(--red-soft)",
          marginBottom: "10px", fontSize: "11px", fontWeight: 600, color: "var(--red)",
          fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px",
          display: "flex", alignItems: "center", gap: "6px",
        }}>
          <span style={{ display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", background: "var(--red)", animation: "pulse 1s ease-in-out infinite" }} />
          NEEDS ATTENTION · {Math.floor((inboxAge || 0) / 3600000)}h stale
        </div>
      )}

      {/* ── Pending Plans ── */}
      {pending.length > 0 && (
        <div style={{ marginBottom: "10px" }}>
          <div style={{ fontSize: "10px", fontWeight: 600, color: "var(--amber)", marginBottom: "5px", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            {pending.length} Pending Plan{pending.length > 1 ? "s" : ""}
          </div>
          {pending.map((p: any, i: number) => {
            const name = typeof p === "string" ? p : p.title || p.name || p.file;
            const file = typeof p === "string" ? p : p.file;
            return (
              <div key={i} style={{ padding: "6px 8px", background: "var(--amber-soft)", borderRadius: "6px", marginBottom: "3px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "6px" }}>
                <span style={{ fontSize: "11px", fontWeight: 500, flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{name}</span>
                <div style={{ display: "flex", gap: "3px", flexShrink: 0 }}>
                  <button onClick={() => openSheet({ type: "plan", agent: agent.dir, file })} style={{ ...btnGhost, padding: "1px 6px", fontSize: "10px", borderRadius: "4px" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>View</button>
                  <button onClick={() => openSheet({ type: "approve", agent: agent.dir, file })} style={{ ...btnGhost, padding: "1px 6px", fontSize: "10px", borderRadius: "4px", color: "var(--green)", borderColor: "var(--green)" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--green-soft)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>&#10003;</button>
                  <button onClick={() => openSheet({ type: "reject", agent: agent.dir, file })} style={{ ...btnGhost, padding: "1px 6px", fontSize: "10px", borderRadius: "4px", color: "var(--red)", borderColor: "var(--red)" }} onMouseOver={(e) => (e.currentTarget.style.background = "var(--red-soft)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>&#10005;</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Stats Row: Inbox + Done ── */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "10px", flexWrap: "wrap" }}>
        {inbox.length > 0 && (
          <span style={{ display: "inline-flex", alignItems: "center", gap: "3px", padding: "2px 8px", borderRadius: "8px", background: "var(--blue-soft)", color: "var(--blue)", fontSize: "10px", fontFamily: "var(--font-mono)", fontWeight: 600 }}>
            {inbox.length} queued
          </span>
        )}
        <span style={{ fontSize: "11px", color: "var(--text-3)", fontFamily: "var(--font-mono)" }}>
          {doneCount} done
        </span>
        {agent.lastDoneTime && (
          <span style={{ fontSize: "10px", color: "var(--text-3)" }}>
            · last {relTime(agent.lastDoneTime)}
          </span>
        )}
      </div>

      {/* ── Outbox Filmstrip ── */}
      {recentDone.length > 0 && (
        <div style={{ display: "flex", gap: "4px", marginBottom: "10px", overflowX: "auto", paddingBottom: "2px" }}>
          {recentDone.map((d: any, i: number) => (
            <div key={i} className="filmstrip-item" title={d.label} style={{
              padding: "3px 8px", borderRadius: "6px", background: "var(--bg-inset)",
              fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--text-3)",
              whiteSpace: "nowrap", maxWidth: "90px", overflow: "hidden", textOverflow: "ellipsis",
              flexShrink: 0, cursor: "default",
              transition: "background 0.15s var(--ease), color 0.15s var(--ease)",
            }}
            onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.color = "var(--text-2)"; }}
            onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-inset)"; e.currentTarget.style.color = "var(--text-3)"; }}
            >
              {d.label}
            </div>
          ))}
        </div>
      )}

      {/* ── Spacer ── */}
      <div style={{ flex: 1 }} />

      {/* ── Command Slot ── */}
      <div style={{ position: "relative" }}>
        <input
          className="cmd-slot"
          value={cmdValue}
          onChange={(e) => setCmdValue(e.target.value)}
          onKeyDown={handleQuickTask}
          placeholder={`> task ${agent.name.toLowerCase()}...`}
          disabled={sending}
          style={{
            width: "100%", padding: "7px 10px", paddingRight: "32px",
            border: "1px solid var(--border)", borderRadius: "8px",
            fontSize: "11px", fontFamily: "var(--font-mono)",
            background: "var(--bg-subtle)", color: "var(--text-1)",
            outline: "none",
            opacity: sending ? 0.5 : 1,
          }}
        />
        <span style={{
          position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)",
          fontSize: "9px", fontFamily: "var(--font-mono)", color: "var(--text-3)",
          pointerEvents: "none",
        }}>
          {sending ? "..." : "&#9166;"}
        </span>
      </div>
    </div>
  );
}

function TaskHistoryPanel({ historyData }: { historyData: any }) {
  const history = historyData?.history || [];
  if (!history.length) return <div style={card}><p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No task history available</p></div>;
  return (
    <div style={{ ...card, padding: 0, overflow: "hidden" }}>
      {history.map((h: any, i: number) => {
        const agName = h.agent || h.dir || "";
        return (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 16px", borderBottom: i < history.length - 1 ? "1px solid var(--border)" : "none" }}>
            <span style={{ display: "inline-block", padding: "2px 10px", borderRadius: "10px", background: agentBg(agName), color: agentColor(agName), fontSize: "11px", fontFamily: "var(--font-mono)", fontWeight: 600, minWidth: "70px", textAlign: "center" }}>{agName}</span>
            <span style={{ flex: 1, fontSize: "13px", fontWeight: 500 }}>{h.name || h.task || h.file}</span>
            <span style={{ fontSize: "11px", fontFamily: "var(--font-mono)", color: "var(--text-3)" }}>{h.date || relTime(h.timestamp)}</span>
          </div>
        );
      })}
    </div>
  );
}

function TaskComposerSheet({ agent, onClose, addToast, fetchLocal }: any) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);

  async function send() {
    if (!title.trim()) return;
    setSending(true);
    try {
      await fetchLocal("/api/task", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agent, title: title.trim(), content }) });
      addToast("Task sent to " + agent, "success");
      onClose();
    } catch { addToast("Failed to send task", "error"); setSending(false); }
  }

  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "20px" }}>Send Task to {agent}</h3>
      <div style={{ marginBottom: "14px" }}>
        <label style={labelStyle}>Title</label>
        <input style={inputStyle} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Task title" autoFocus />
      </div>
      <div style={{ marginBottom: "16px" }}>
        <label style={labelStyle}>Content (Markdown)</label>
        <textarea style={{ ...inputStyle, minHeight: "160px", resize: "vertical", fontFamily: "var(--font-mono)", fontSize: "13px" }} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Task description..." />
      </div>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={send} disabled={!title.trim() || sending} style={{ ...btnPrimary, opacity: title.trim() && !sending ? 1 : 0.5 }}>{sending ? "Sending..." : "Send Task"}</button>
      </div>
    </Sheet>
  );
}

function PlanViewerSheet({ agent, file, onClose, fetchLocal }: any) {
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${LOCAL}/api/plan?agent=${encodeURIComponent(agent)}&file=${encodeURIComponent(file)}`)
      .then((r) => r.text()).then((t) => { setContent(t); setLoading(false); })
      .catch(() => { setContent("Failed to load plan"); setLoading(false); });
  }, [agent, file]);
  return (
    <Sheet onClose={onClose} wide>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>{file}</h3>
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
          <div style={{ width: "20px", height: "20px", border: "2px solid var(--border)", borderTopColor: "var(--text-1)", borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto 8px" }} />
          Loading...
        </div>
      ) : (
        <pre style={{ fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-word", padding: "16px", background: "var(--bg-inset)", borderRadius: "var(--radius)", maxHeight: "60vh", overflowY: "auto" }}>{content}</pre>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Close</button>
      </div>
    </Sheet>
  );
}

function ApproveModal({ agent, file, onClose, addToast, onDone, fetchLocal }: any) {
  async function approve() {
    try {
      await fetchLocal("/api/approve", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agent, file }) });
      addToast("Plan approved", "success");
      onDone();
      onClose();
    } catch { addToast("Approval failed", "error"); }
  }
  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px" }}>Approve Plan</h3>
      <p style={{ color: "var(--text-2)", marginBottom: "20px", fontSize: "14px" }}>Approve <strong>{file}</strong> for <strong>{agent}</strong>? This will move it out of pending and trigger execution.</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={approve} style={{ ...btnPrimary, background: "var(--green)" }} onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}>Approve</button>
      </div>
    </Sheet>
  );
}

function RejectModal({ agent, file, onClose, addToast, onDone, fetchLocal }: any) {
  async function reject() {
    try {
      await fetchLocal("/api/pending", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ agent, file }) });
      addToast("Plan rejected", "success");
      onDone();
      onClose();
    } catch { addToast("Rejection failed", "error"); }
  }
  return (
    <Sheet onClose={onClose}>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "12px", color: "var(--red)" }}>Reject Plan</h3>
      <p style={{ color: "var(--text-2)", marginBottom: "8px", fontSize: "14px" }}>Reject and delete <strong>{file}</strong> from <strong>{agent}</strong>&apos;s pending?</p>
      <p style={{ color: "var(--red)", fontSize: "12px", marginBottom: "20px" }}>This action cannot be undone.</p>
      <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Cancel</button>
        <button onClick={reject} style={btnDanger} onMouseOver={(e) => (e.currentTarget.style.background = "rgba(220,38,38,0.12)")} onMouseOut={(e) => (e.currentTarget.style.background = "var(--red-soft)")}>Reject</button>
      </div>
    </Sheet>
  );
}

// ─── System Components ─────────────────────────────────────────────────────────

function AuditPanel({ data }: { data: any }) {
  const audit = data?.audit?.items || [];
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});
  const toggle = (i: string) => setExpanded((prev) => ({ ...prev, [i]: !prev[i] }));
  const priorities = ["P0", "P1", "P2", "P3"];
  const counts: Record<string, number> = {};
  priorities.forEach((p) => { counts[p] = audit.filter((a: any) => a.priority === p).length; });
  return (
    <div style={{ ...card, marginBottom: "24px" }}>
      <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
        {priorities.map((p) => (
          <span key={p} style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 12px", borderRadius: "20px", background: priorityBg(p), color: priorityColor(p), fontSize: "12px", fontWeight: 600, fontFamily: "var(--font-mono)" }}>{p} <span style={{ opacity: 0.7 }}>{counts[p]}</span></span>
        ))}
      </div>
      {priorities.map((p) => {
        const items = audit.filter((a: any) => a.priority === p);
        if (!items.length) return null;
        return (
          <div key={p} style={{ marginBottom: "12px" }}>
            {items.map((item: any, i: number) => {
              const idx = p + "-" + i;
              const isOpen = expanded[idx];
              return (
                <div key={idx} onClick={() => toggle(idx)} style={{ borderLeft: "3px solid " + priorityColor(p), padding: "10px 14px", marginBottom: "6px", borderRadius: "0 var(--radius) var(--radius) 0", cursor: "pointer", transition: "background 0.15s var(--ease)", background: isOpen ? "var(--bg-subtle)" : "transparent" }} onMouseOver={(e) => { if (!isOpen) e.currentTarget.style.background = "var(--bg-hover)"; }} onMouseOut={(e) => { if (!isOpen) e.currentTarget.style.background = "transparent"; }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    {item.area && <span style={{ padding: "1px 8px", borderRadius: "10px", background: "var(--bg-inset)", fontSize: "11px", color: "var(--text-3)" }}>{item.area}</span>}
                    <span style={{ flex: 1, fontSize: "13px", fontWeight: 500 }}>{item.title}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-3)", transform: isOpen ? "rotate(90deg)" : "rotate(0)", transition: "transform 0.15s var(--ease)" }}>&#9654;</span>
                  </div>
                  {isOpen && (
                    <div style={{ marginTop: "10px", paddingTop: "10px", borderTop: "1px solid var(--border)", animation: "fade-in 0.2s var(--ease)" }}>
                      {item.detail && <p style={{ fontSize: "12px", color: "var(--text-2)", marginBottom: "6px" }}>{item.detail}</p>}
                      {item.fix && <p style={{ fontSize: "12px", color: "var(--green)", marginBottom: "4px" }}><strong>Fix:</strong> {item.fix}</p>}
                      {item.status && <span style={{ fontSize: "11px", padding: "2px 8px", borderRadius: "10px", background: "var(--bg-inset)", color: "var(--text-3)" }}>{item.status}</span>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        );
      })}
      {audit.length === 0 && <p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No audit items</p>}
    </div>
  );
}

function ResourcesHub({ resources }: { resources: any[] }) {
  const cats = resources || [];
  if (!cats.length) return <div style={card}><p style={{ fontStyle: "italic", color: "var(--text-3)", fontSize: "13px" }}>No resources available</p></div>;
  return (
    <div style={card}>
      {cats.map((c, i) => (
        <div key={i} style={{ marginBottom: "14px" }}>
          <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "6px" }}>{c.cat || c.category || c.name}</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {(c.links || []).map((l: any, j: number) => (
              <a key={j} href={l.url} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "4px", padding: "4px 12px", borderRadius: "20px", background: "var(--bg-inset)", color: "var(--text-2)", fontSize: "12px", textDecoration: "none", transition: "all 0.15s var(--ease)", border: "1px solid transparent" }} onMouseOver={(e) => { e.currentTarget.style.background = "var(--bg-hover)"; e.currentTarget.style.borderColor = "var(--border)"; }} onMouseOut={(e) => { e.currentTarget.style.background = "var(--bg-inset)"; e.currentTarget.style.borderColor = "transparent"; }}>{l.icon && <span>{l.icon}</span>}{l.label || l.name}</a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffSheet({ hash, onClose }: { hash: string; onClose: () => void }) {
  const [diff, setDiff] = useState("");
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch(`${LOCAL}/api/git-diff?hash=${encodeURIComponent(hash)}`)
      .then((r) => r.text()).then((t) => { setDiff(t); setLoading(false); })
      .catch(() => { setDiff("Failed to load diff"); setLoading(false); });
  }, [hash]);

  function renderDiff(text: string) {
    return text.split("\n").map((line, i) => {
      let bg = "transparent", color = "var(--text-1)";
      if (line.startsWith("+") && !line.startsWith("+++")) { bg = "var(--green-soft)"; color = "var(--green)"; }
      else if (line.startsWith("-") && !line.startsWith("---")) { bg = "var(--red-soft)"; color = "var(--red)"; }
      else if (line.startsWith("@@")) { bg = "var(--amber-soft)"; color = "var(--amber)"; }
      return <div key={i} style={{ background: bg, color, padding: "1px 8px", fontFamily: "var(--font-mono)", fontSize: "12px", lineHeight: 1.6, whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{line}</div>;
    });
  }

  return (
    <Sheet onClose={onClose} wide>
      <h3 style={{ fontSize: "18px", fontWeight: 700, marginBottom: "16px" }}>Diff: <span style={{ fontFamily: "var(--font-mono)", color: "var(--violet)" }}>{(hash || "").slice(0, 7)}</span></h3>
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "var(--text-3)" }}>
          <div style={{ width: "20px", height: "20px", border: "2px solid var(--border)", borderTopColor: "var(--text-1)", borderRadius: "50%", animation: "spin 0.6s linear infinite", margin: "0 auto 8px" }} />
          Loading...
        </div>
      ) : (
        <div style={{ borderRadius: "var(--radius)", overflow: "hidden", border: "1px solid var(--border)", maxHeight: "60vh", overflowY: "auto" }}>{renderDiff(diff)}</div>
      )}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "16px" }}>
        <button onClick={onClose} style={btnGhost} onMouseOver={(e) => (e.currentTarget.style.background = "var(--bg-hover)")} onMouseOut={(e) => (e.currentTarget.style.background = "transparent")}>Close</button>
      </div>
    </Sheet>
  );
}

// ─── Tab Containers ────────────────────────────────────────────────────────────

function OverviewTab({ localData, health, connected, metrics, updateMetric, openSheet, addToast }: any) {
  return (
    <div>
      <SectionTitle>System Health</SectionTitle>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "20px", marginBottom: "32px" }}>
        <LocalOnly connected={connected}><GitCard data={localData} health={health} openSheet={openSheet} /></LocalOnly>
        <LocalOnly connected={connected}><GoalsSummaryCard data={localData} /></LocalOnly>
      </div>
      <SectionTitle>Business Metrics</SectionTitle>
      <MetricsCard metrics={metrics} updateMetric={updateMetric} addToast={addToast} />
      <div style={{ marginTop: "32px" }}>
        <SectionTitle>Business Intelligence</SectionTitle>
        <LocalOnly connected={connected}><InsightsPanel data={localData} /></LocalOnly>
      </div>
      <div style={{ marginTop: "32px" }}>
        <SectionTitle>Recent Activity</SectionTitle>
        <LocalOnly connected={connected}><ActivityPanel data={localData} /></LocalOnly>
      </div>
    </div>
  );
}

function PipelineTab({ projections, prospects, openSheet, addProspect, addToast }: any) {
  return (
    <div>
      <SectionTitle>Revenue Projections</SectionTitle>
      <ProjectionsBar projections={projections} />
      <SectionTitle style={{ marginTop: 32 }}>Prospects</SectionTitle>
      <CRMPanel prospects={prospects} openSheet={openSheet} />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button onClick={() => openSheet({ type: "addProspect" })} style={btnPrimary} onMouseOver={(e) => (e.currentTarget.style.opacity = "0.85")} onMouseOut={(e) => (e.currentTarget.style.opacity = "1")}>+ Add Prospect</button>
      </div>
    </div>
  );
}

function ContentTab({ content, notes, openSheet, addNoteM, removeNoteM, addToast }: any) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "24px" }}>
      <div>
        <SectionTitle>Content Calendar</SectionTitle>
        <ContentCalendarPanel content={content} openSheet={openSheet} />
      </div>
      <div>
        <SectionTitle>Scratch Pad</SectionTitle>
        <NotesPanel notes={notes} addNoteM={addNoteM} removeNoteM={removeNoteM} addToast={addToast} />
      </div>
    </div>
  );
}

function FleetStatusBar({ agents }: { agents: any[] }) {
  const active = agents.filter((a: any) => (a.inbox || []).length > 0).length;
  const pendingTotal = agents.reduce((s: number, a: any) => s + (a.pending || []).length, 0);
  const escalated = agents.filter((a: any) => (a.inboxAge || 0) > 2 * 60 * 60 * 1000).length;
  const totalDone = agents.reduce((s: number, a: any) => s + (a.doneCount || 0), 0);
  return (
    <div style={{ ...card, padding: "14px 20px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "24px", flexWrap: "wrap" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: escalated > 0 ? "var(--red)" : active > 0 ? "var(--green)" : "var(--text-3)", ...(active > 0 && !escalated ? { animation: "glow 2s ease-in-out infinite" } : {}) }} />
        <span style={{ fontSize: "13px", fontWeight: 600 }}>Fleet</span>
      </div>
      <div style={{ display: "flex", gap: "16px", fontSize: "12px", fontFamily: "var(--font-mono)", color: "var(--text-2)" }}>
        <span><strong style={{ color: "var(--green)" }}>{active}</strong> active</span>
        <span><strong style={{ color: "var(--text-1)" }}>{agents.length - active}</strong> idle</span>
        {pendingTotal > 0 && <span><strong style={{ color: "var(--amber)" }}>{pendingTotal}</strong> plans pending</span>}
        {escalated > 0 && <span style={{ color: "var(--red)", fontWeight: 600 }}>{escalated} escalated</span>}
        <span>{totalDone} total done</span>
      </div>
    </div>
  );
}

function AgentsTab({ agents, openSheet, historyData, connected, fetchLocal, addToast }: any) {
  return (
    <div>
      <LocalOnly connected={connected}>
        <FleetStatusBar agents={agents} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
          {agents.map((ag: any) => (
            <AgentCard key={ag.name} agent={ag} openSheet={openSheet} fetchLocal={fetchLocal} addToast={addToast} />
          ))}
        </div>
      </LocalOnly>
      <SectionTitle>Task History</SectionTitle>
      <LocalOnly connected={connected}><TaskHistoryPanel historyData={historyData} /></LocalOnly>
    </div>
  );
}

function SystemTab({ localData, resources, connected }: any) {
  return (
    <div>
      <SectionTitle>Platform Audit</SectionTitle>
      <LocalOnly connected={connected}><AuditPanel data={localData} /></LocalOnly>
      <div style={{ marginTop: "32px" }}>
        <SectionTitle>Resources Hub</SectionTitle>
        <LocalOnly connected={connected}><ResourcesHub resources={resources} /></LocalOnly>
      </div>
    </div>
  );
}

// ─── CSS Variables injection ───────────────────────────────────────────────────

const CSS_VARS = `
:root {
  --bg:#f5f5f3;--bg-card:#ffffff;--bg-hover:#ededeb;--bg-subtle:#fafaf9;
  --bg-inset:#f0f0ee;--border:#e2e2e0;--border-2:#d0d0ce;
  --text-1:#0f0f0e;--text-2:#555553;--text-3:#8a8a87;
  --red:#dc2626;--red-soft:rgba(220,38,38,0.07);
  --amber:#d97706;--amber-soft:rgba(217,119,6,0.07);
  --green:#16a34a;--green-soft:rgba(22,163,74,0.07);
  --blue:#2563eb;--blue-soft:rgba(37,99,235,0.07);
  --violet:#7c3aed;--violet-soft:rgba(124,58,237,0.07);
  --cyan:#0891b2;--cyan-soft:rgba(8,145,178,0.07);
  --funkie:#d97706;--lobe:#7c3aed;--seo:#0891b2;
  --ag-blue:#2563eb;--ag-green:#16a34a;--ag-rose:#e11d48;--ag-orange:#ea580c;
  --ag-indigo:#4f46e5;--ag-slate:#64748b;
  --ag-rose-soft:rgba(225,29,72,0.07);--ag-orange-soft:rgba(234,88,12,0.07);
  --ag-indigo-soft:rgba(79,70,229,0.07);--ag-slate-soft:rgba(100,116,139,0.07);
  --font-sans:-apple-system,'SF Pro Display','Inter','Segoe UI',sans-serif;
  --font-mono:'Geist Mono','SF Mono','Fira Code',monospace;
  --ease:cubic-bezier(0.4,0,0.2,1);
  --spring:cubic-bezier(0.34,1.56,0.64,1);
  --radius:10px;--radius-lg:14px;
}
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
body{font-family:var(--font-sans);font-size:14px;color:var(--text-1);background:var(--bg);line-height:1.5;-webkit-font-smoothing:antialiased;}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
@keyframes sheet-in{from{opacity:0;transform:scale(.96) translateY(8px)}to{opacity:1;transform:scale(1) translateY(0)}}
@keyframes fade-in{from{opacity:0;transform:translateY(6px)}to{opacity:1;transform:translateY(0)}}
@keyframes spin{to{transform:rotate(360deg)}}
@keyframes toast-progress{from{width:100%}to{width:0%}}
@keyframes glow{0%,100%{box-shadow:0 0 4px rgba(22,163,74,.4)}50%{box-shadow:0 0 10px rgba(22,163,74,.7)}}
@keyframes pulse-ring{0%,100%{box-shadow:0 0 0 0 var(--pulse-color,rgba(22,163,74,0.4))}50%{box-shadow:0 0 0 4px var(--pulse-color,rgba(22,163,74,0.15))}}
@keyframes escalation-flare{0%,100%{border-color:var(--amber)}50%{border-color:var(--red)}}
@keyframes slide-up{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}
@keyframes filmstrip-in{from{opacity:0;transform:scale(0.95)}to{opacity:1;transform:scale(1)}}
.agent-card{transition:transform 0.2s var(--ease),box-shadow 0.2s var(--ease);}
.agent-card:hover{transform:translateY(-2px);box-shadow:0 8px 24px rgba(0,0,0,0.08);}
.agent-card.escalated{animation:escalation-flare 2s ease-in-out infinite;border-color:var(--amber);}
.cmd-slot{transition:border-color 0.15s var(--ease),box-shadow 0.15s var(--ease);}
.cmd-slot:focus{border-color:var(--text-2);box-shadow:0 0 0 3px rgba(0,0,0,0.04);}
.filmstrip-item{animation:filmstrip-in 0.2s var(--ease) both;}
.filmstrip-item:nth-child(2){animation-delay:0.04s}
.filmstrip-item:nth-child(3){animation-delay:0.08s}
.filmstrip-item:nth-child(4){animation-delay:0.12s}
.filmstrip-item:nth-child(5){animation-delay:0.16s}
.trust-badge{font-size:9px;font-weight:700;letter-spacing:0.5px;padding:2px 6px;border-radius:4px;font-family:var(--font-mono);text-transform:uppercase;}
`;

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function CCPage() {
  // Convex real-time data
  const metrics = useQuery(api.ccMetrics.list);
  const prospects = useQuery(api.ccCrm.list);
  const content = useQuery(api.ccContent.list);
  const notes = useQuery(api.ccNotes.list);

  // Convex mutations
  const updateMetric = useMutation(api.ccMetrics.update);
  const addProspect = useMutation(api.ccCrm.add);
  const updateProspect = useMutation(api.ccCrm.update);
  const removeProspect = useMutation(api.ccCrm.remove);
  const addContent = useMutation(api.ccContent.add);
  const updateContent = useMutation(api.ccContent.update);
  const removeContent = useMutation(api.ccContent.remove);
  const addNoteM = useMutation(api.ccNotes.add);
  const removeNoteM = useMutation(api.ccNotes.remove);

  // Local server
  const { data: localData, connected, lastUpdate, fetchAll, fetchLocal } = useLocalServer();

  // Local-fetched data
  const [health, setHealth] = useState<any[]>([]);
  const [historyData, setHistoryData] = useState<any>({ history: [] });
  const [resources, setResources] = useState<any[]>([]);

  useEffect(() => {
    if (!connected) return;
    fetch(`${LOCAL}/api/health`).then((r) => r.json()).then((d) => setHealth(d.services || [])).catch(() => {});
    fetch(`${LOCAL}/api/task-history`).then((r) => r.json()).then(setHistoryData).catch(() => {});
    fetch(`${LOCAL}/api/resources`).then((r) => r.json()).then((d) => setResources(d.categories || [])).catch(() => {});
  }, [connected]);

  // UI state
  const [toasts, setToasts] = useState<any[]>([]);
  const [sheet, setSheet] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const addToast = useCallback((message: string, type: string) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type: type || "success" }]);
  }, []);
  const removeToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const openSheet = (cfg: any) => setSheet(cfg);
  const closeSheet = () => setSheet(null);

  // Compute projections from Convex CRM data
  const projections = computeProjections(prospects || []);

  // Build agent list merging config with live data
  const agents = AGENTS_CFG.map((cfg) => {
    const live = (localData?.agents || []).find((a: any) =>
      (a.name || "").toLowerCase().includes(cfg.dir) || (a.dir || "") === cfg.dir
    );
    return { ...cfg, ...(live || {}), name: cfg.name, role: cfg.role, color: cfg.color, trust: cfg.trust, model: cfg.model };
  });

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: CSS_VARS }} />
      <CommandStrip
        localData={localData}
        connected={connected}
        lastUpdate={lastUpdate}
        onRefresh={fetchAll}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        projections={projections}
        convexContent={content || []}
      />
      <div style={{ maxWidth: "1320px", margin: "0 auto", padding: "24px 28px 80px" }}>
        <AlertRail data={localData} />
        {activeTab === "overview" && (
          <OverviewTab
            localData={localData}
            health={health}
            connected={connected}
            metrics={metrics}
            updateMetric={updateMetric}
            openSheet={openSheet}
            addToast={addToast}
          />
        )}
        {activeTab === "pipeline" && (
          <PipelineTab
            projections={projections}
            prospects={prospects || []}
            openSheet={openSheet}
            addProspect={addProspect}
            addToast={addToast}
          />
        )}
        {activeTab === "content" && (
          <ContentTab
            content={content || []}
            notes={notes || []}
            openSheet={openSheet}
            addNoteM={addNoteM}
            removeNoteM={removeNoteM}
            addToast={addToast}
          />
        )}
        {activeTab === "agents" && (
          <AgentsTab
            agents={agents}
            openSheet={openSheet}
            historyData={historyData}
            connected={connected}
            fetchLocal={fetchLocal}
            addToast={addToast}
          />
        )}
        {activeTab === "system" && (
          <SystemTab localData={localData} resources={resources} connected={connected} />
        )}
      </div>

      {/* Sheets */}
      {sheet?.type === "task" && <TaskComposerSheet agent={sheet.agent} onClose={closeSheet} addToast={addToast} fetchLocal={fetchLocal} />}
      {sheet?.type === "plan" && <PlanViewerSheet agent={sheet.agent} file={sheet.file} onClose={closeSheet} fetchLocal={fetchLocal} />}
      {sheet?.type === "approve" && <ApproveModal agent={sheet.agent} file={sheet.file} onClose={closeSheet} addToast={addToast} onDone={fetchAll} fetchLocal={fetchLocal} />}
      {sheet?.type === "reject" && <RejectModal agent={sheet.agent} file={sheet.file} onClose={closeSheet} addToast={addToast} onDone={fetchAll} fetchLocal={fetchLocal} />}
      {sheet?.type === "diff" && <DiffSheet hash={sheet.hash} onClose={closeSheet} />}
      {sheet?.type === "prospect" && <ProspectSheet prospect={sheet.prospect} onClose={closeSheet} updateProspect={updateProspect} removeProspect={removeProspect} addToast={addToast} />}
      {sheet?.type === "addProspect" && <AddProspectSheet onClose={closeSheet} addProspect={addProspect} addToast={addToast} />}
      {sheet?.type === "editContent" && <ContentSheet item={sheet.item} onClose={closeSheet} updateContent={updateContent} removeContent={removeContent} addToast={addToast} />}
      {sheet?.type === "addContent" && <AddContentSheet defaultStatus={sheet.defaultStatus} onClose={closeSheet} addContent={addContent} addToast={addToast} />}

      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </>
  );
}
