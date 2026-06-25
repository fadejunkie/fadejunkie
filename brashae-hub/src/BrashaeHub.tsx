// @ts-nocheck
import React, { useState, createContext, useContext } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";

/* ═══════════════════════════════════════
   THEME SYSTEM
   ═══════════════════════════════════════ */
const GOLD          = "#D4AF37";
const GOLD_DIM_DARK = "#5a4010";
const GREEN         = "#22c55e";

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
  PAGE:     "#FAF7F2",
  HEADER:   "#FBF8F3",
  CARD:     "#FFFDF9",
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

const PROJECT_ID        = "brashae-website-ecomm";
const CLIENT_SLUG       = "brashae";
const SQUARE_PAYMENT_URL = "https://square.link/u/jAqgcezN";
const ADMIN_DASHBOARD_URL = "https://brashae-admin.anthonytatis.com";

/* ═══════════════════════════════════════
   PHASES
   ═══════════════════════════════════════ */
const PHASES = [
  { id: "p0", label: "PHASE 0", name: "Discovery", status: "active", tasks: [
    { key: "p0-0", label: "Project kickoff confirmed" },
    { key: "p0-1", label: "Brand assets + logo collected" },
    { key: "p0-2", label: "Domain access confirmed (brashaesbeautysupplytx.com)" },
    { key: "p0-3", label: "Agreement signed" },
    { key: "p0-4", label: "Services list + staff info provided" },
  ]},
  { id: "p1", label: "PHASE 1", name: "Design System", status: "pending", tasks: [
    { key: "p1-0", label: "Brand kit finalized (Black + Gold palette, logo, fonts)" },
    { key: "p1-1", label: "Homepage wireframe approved" },
    { key: "p1-2", label: "Design system approved" },
  ]},
  { id: "p2", label: "PHASE 2", name: "Website Rebuild", status: "pending", tasks: [
    { key: "p2-0", label: "Homepage (hero, brands, categories, specials, services)" },
    { key: "p2-1", label: "Salon Services page + booking integration" },
    { key: "p2-2", label: "Meet the Professionals page" },
    { key: "p2-3", label: "Pro Supply / Salon Delivery page" },
    { key: "p2-4", label: "About + Contact + Hours pages" },
    { key: "p2-5", label: "Website approved by client" },
    { key: "p2-6", label: "DNS pointed — brashaesbeautysupplytx.com live" },
  ]},
  { id: "p3", label: "PHASE 3", name: "Online Store", status: "pending", tasks: [
    { key: "p3-0", label: "Product taxonomy built (Hair Care, Barber, Wigs, Styling, Pro)" },
    { key: "p3-1", label: "Monthly Specials system configured" },
    { key: "p3-2", label: "Stripe payments live" },
    { key: "p3-3", label: "Cart + checkout tested end-to-end" },
    { key: "p3-4", label: "Store approved by client" },
    { key: "p3-5", label: "shop.brashaesbeautysupplytx.com live" },
  ]},
  { id: "p4", label: "PHASE 4", name: "Launch", status: "pending", tasks: [
    { key: "p4-0", label: "Final QA pass complete" },
    { key: "p4-1", label: "Client trained on admin (products, orders, specials)" },
    { key: "p4-2", label: "Monthly retainer activated ($125/mo)" },
    { key: "p4-3", label: "Project marked complete" },
  ]},
];

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function SectionHeader({ label }: { label: string }) {
  const t = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18, marginTop: 28 }}>
      <div style={{ width: 3, height: 16, background: GOLD, flexShrink: 0 }} />
      <div style={{ fontSize: 10, fontWeight: 600, color: GOLD, letterSpacing: 4, fontFamily: "'Inter',sans-serif" }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: t.BORDER }} />
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
          <div style={{ fontSize: 11, color: t.SECONDARY, fontFamily: "'IBM Plex Mono',monospace" }}>{done} / {total} TASKS COMPLETE</div>
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
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: 2, padding: "3px 7px", background: isActive ? GOLD : t.BORDER, color: isActive ? (t.mode === "dark" ? "#000" : "#1a1a1a") : t.SECONDARY, fontFamily: "'IBM Plex Mono',monospace", borderRadius: 2 }}>{phase.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: t.TEXT }}>{phase.name}</div>
              <div style={{ fontSize: 10, color: t.SECONDARY, fontFamily: "'IBM Plex Mono',monospace", marginLeft: "auto" }}>{phaseDone}/{phase.tasks.length}</div>
            </div>
            {phase.tasks.map((task: any) => (
              <div key={task.key}
                onClick={() => isOps && setTask({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, taskKey: task.key, completed: !tasks[task.key] })}
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
            { label: "PROJECT", value: "Website + Ecomm", accent: false },
            { label: "INVESTMENT", value: "$2,350", accent: true },
            { label: "RETAINER", value: "$125/mo", accent: false },
            { label: "TIMELINE", value: "3–4 Weeks", accent: false },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 9, color: t.SECONDARY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontSize: 18, fontWeight: 900, color: item.accent ? GOLD : t.TEXT }}>{item.value}</div>
            </div>
          ))}
        </div>
      </div>

      <SectionHeader label="WHAT'S INCLUDED" />
      {[
        { phase: "WEBSITE REBUILD — brashaesbeautysupplytx.com", items: [
          "Full rebuild — mobile-first, fast, clean. Replaces legacy site.",
          "Homepage: hero, featured brands, shop categories, monthly specials, salon services, team, location + hours",
          "Salon Services page — braids, wig fittings, hair replacement, coloring, permanents + booking link",
          "Meet the Professionals — stylists + barbers, specialties, gallery",
          "Pro Supply page — salon delivery program, wholesale accounts, bulk ordering",
          "Specials page — monthly deals, featured products, promotions",
          "About + Contact pages with hours, map, form",
          "SEO foundation — meta tags, sitemap, page speed optimized",
        ]},
        { phase: "ONLINE STORE — shop.brashaesbeautysupplytx.com", items: [
          "Full ecommerce store — browse, cart, buy",
          "Product taxonomy: Hair Care · Barber Supplies · Wigs & Extensions · Styling Tools · Pro Products",
          "Monthly Specials system — promote deals from the admin panel",
          "Stripe-powered checkout — credit/debit cards",
          "Admin panel — add/edit/remove products without a developer",
          "Order management + confirmation emails",
          "Flat-rate shipping + free shipping threshold (configurable)",
        ]},
        { phase: "MONTHLY RETAINER ($125/mo)", items: [
          "Hosting, uptime monitoring, security updates",
          "Product catalog updates (add/remove items on request)",
          "Monthly Specials updates — just send the deal, we post it",
          "Minor content changes (hours, services, staff)",
          "Priority support via WhatsApp",
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
          <strong style={{ color: t.TEXT }}>1. Design</strong> — Brand system, color tokens, homepage layout approved before a line of code.<br />
          <strong style={{ color: t.TEXT }}>2. Website</strong> — Full rebuild of brashaesbeautysupplytx.com. Review + revisions. DNS cutover.<br />
          <strong style={{ color: t.TEXT }}>3. Store</strong> — shop.brashaesbeautysupplytx.com live with product catalog + Stripe.<br />
          <strong style={{ color: t.TEXT }}>4. Launch</strong> — Final QA, client training, retainer begins.
        </div>
      </div>
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

  const [label,  setLabel]  = useState("");
  const [url,    setUrl]    = useState("");
  const [section, setSection] = useState("preview");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!label.trim()) return;
    setAdding(true);
    await addDeliverable({
      clientSlug: CLIENT_SLUG,
      projectId: PROJECT_ID,
      milestoneKey: section,
      label: label.trim(),
      url: url.trim() || undefined,
      type: "file",
    });
    setLabel(""); setUrl(""); setAdding(false);
  };

  const inp = { width: "100%", boxSizing: "border-box" as any, background: t.INPUT, border: `1px solid ${t.BORDER}`, borderRadius: 6, color: t.TEXT, padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none" };

  if (deliverables === undefined) return <div style={{ padding: "60px 16px", textAlign: "center", color: t.DIM, fontSize: 13 }}>Loading...</div>;

  const sections = [
    { key: "preview", label: "DESIGN PREVIEWS" },
    { key: "website", label: "WEBSITE" },
    { key: "store",   label: "ONLINE STORE" },
  ];

  return (
    <div style={{ padding: "20px 16px 48px" }}>
      {sections.map(sec => {
        const items = deliverables.filter(d => d.milestoneKey === sec.key);
        if (!isOps && items.length === 0) return null;
        return (
          <div key={sec.key}>
            <SectionHeader label={sec.label} />
            {items.length === 0 ? (
              <div style={{ fontSize: 13, color: t.DIM, marginBottom: 20 }}>Coming soon.</div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                {items.map((d: any) => (
                  <div key={d._id} style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 16px", background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8 }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, color: t.TEXT, fontWeight: 600 }}>{d.label}</div>
                      {d.url && <a href={d.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 11, color: GOLD, fontFamily: "'IBM Plex Mono',monospace", textDecoration: "none" }}>VIEW →</a>}
                    </div>
                    <div style={{ fontSize: 10, color: t.DIM, fontFamily: "'IBM Plex Mono',monospace", flexShrink: 0 }}>{new Date(d.addedAt).toLocaleDateString()}</div>
                    {isOps && <button onClick={() => removeDeliverable({ id: d._id })} style={{ background: "none", border: "none", color: t.DIM, cursor: "pointer", fontSize: 18, lineHeight: 1, flexShrink: 0 }}>×</button>}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}

      {isOps && (
        <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "16px", marginTop: 32 }}>
          <div style={{ fontSize: 10, color: GOLD, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 14 }}>ADD DELIVERABLE</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
            {sections.map(s => (
              <button key={s.key} onClick={() => setSection(s.key)}
                style={{ flex: 1, padding: "8px 0", background: section === s.key ? GOLD : t.INPUT, color: section === s.key ? "#1a1410" : t.SUBTLE, border: `1px solid ${section === s.key ? GOLD : t.BORDER}`, borderRadius: 6, fontSize: 10, fontWeight: 700, cursor: "pointer", letterSpacing: 1, fontFamily: "'IBM Plex Mono',monospace" }}>
                {s.label.split(" ")[0]}
              </button>
            ))}
          </div>
          <input value={label} onChange={e => setLabel(e.target.value)} placeholder="Label (e.g. Homepage Preview — V1)" style={{ ...inp, marginBottom: 8 }} />
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="URL (image, Figma link, preview URL)" style={{ ...inp, marginBottom: 12 }} />
          <button onClick={handleAdd} disabled={adding || !label.trim()}
            style={{ padding: "10px 20px", background: label.trim() ? GOLD : t.BORDER, color: label.trim() ? "#1a1410" : t.SUBTLE, border: "none", borderRadius: 6, fontSize: 12, fontWeight: 700, cursor: label.trim() ? "pointer" : "default", fontFamily: "'IBM Plex Mono',monospace" }}>
            {adding ? "ADDING..." : "ADD DELIVERABLE"}
          </button>
        </div>
      )}
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
  const isMobile = typeof window !== "undefined" && window.matchMedia("(pointer: coarse)").matches;
  const [drawing, setDrawing] = useState(false);
  const [hasSig,  setHasSig]  = useState(false);
  const [saved,   setSaved]   = useState(false);
  const [saving,  setSaving]  = useState(false);
  const [typedName, setTypedName] = useState("");
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => { if (existing) setSaved(true); }, [existing]);

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
    const sigData = isMobile ? `typed:${typedName}` : canvasRef.current!.toDataURL();
    await saveAgreement({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, sigData, signedDate: today, invoiceNumber: "BRB-2026-001" });
    setSaving(false); setSaved(true);
  };

  if (saved) return (
    <div style={{ padding: "20px 16px 48px" }}>
      <SectionHeader label="AGREEMENT" />

      {/* Step 1 — Signed confirmation */}
      <div style={{ background: t.GREEN_BG, border: `1px solid ${t.GREEN_BORDER}`, borderRadius: 8, padding: "20px", marginBottom: 24, display: "flex", alignItems: "center", gap: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: "50%", background: GREEN, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <span style={{ fontSize: 18, color: "#fff", fontWeight: 900 }}>✓</span>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 3 }}>Agreement Signed</div>
          <div style={{ fontSize: 12, color: t.DIM }}>Signed {existing?.signedDate} · Invoice BRB-2026-001</div>
        </div>
      </div>

      {/* Step 2 — Payment */}
      <div style={{display:"flex",gap:8,marginBottom:20,padding:"10px 14px",background:t.CARD,border:`1px solid ${t.BORDER}`,borderRadius:8,alignItems:"center"}}>
        <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:t.DIM}}>STEP</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{padding:"3px 10px",background:t.GREEN_BG,border:`1px solid ${t.GREEN_BORDER}`,color:GREEN,borderRadius:4,fontSize:10,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>1 ✓ SIGNED</div>
          <div style={{width:20,height:1,background:t.BORDER}}/>
          <div style={{padding:"3px 10px",background:GOLD,color:"#1a1410",borderRadius:4,fontSize:10,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>2 — PAY</div>
        </div>
      </div>
      <SectionHeader label="NEXT STEP — PAYMENT" />
      <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "20px", marginBottom: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px", marginBottom: 20 }}>
          {[
            { label: "AMOUNT DUE", value: "$2,350", accent: true },
            { label: "PAYMENT", value: "One-Time", accent: false },
          ].map(row => (
            <div key={row.label}>
              <div style={{ fontSize: 9, color: t.SECONDARY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 3 }}>{row.label}</div>
              <div style={{ fontSize: 22, fontWeight: 900, color: row.accent ? GOLD : t.TEXT }}>{row.value}</div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: 12, color: t.DIM, marginBottom: 20, lineHeight: 1.6 }}>
          Work begins within 48 hours of payment. You'll have a direct line to Anthony throughout the build. Monthly retainer ($125/mo) starts after launch.
        </div>
        <a
          href={SQUARE_PAYMENT_URL}
          style={{
            display: "block", width: "100%", padding: "18px", background: GOLD, color: "#1a1410",
            border: "none", borderRadius: 8, fontSize: 14, fontWeight: 900, cursor: "pointer",
            fontFamily: "'IBM Plex Mono',monospace", textAlign: "center",
            textDecoration: "none", boxSizing: "border-box",
          }}>
          PAY $2,350 — SECURE CHECKOUT →
        </a>
        <div style={{ fontSize: 11, color: t.MUTED, textAlign: "center", marginTop: 10, fontFamily: "'IBM Plex Mono',monospace" }}>
          Powered by Square · Accepts all major cards
        </div>
      </div>

    </div>
  );

  const clause = (title: string, body: string) => (
    <div style={{ marginBottom: 18 }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: GOLD, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 6 }}>{title}</div>
      <div style={{ fontSize: 13, color: t.SECONDARY, lineHeight: 1.75 }}>{body}</div>
    </div>
  );

  const bullet = (items: string[]) => (
    <div style={{ marginBottom: 18 }}>
      {items.map((item, i) => (
        <div key={i} style={{ display: "flex", gap: 10, marginBottom: 6 }}>
          <div style={{ width: 4, height: 4, background: GOLD, borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
          <div style={{ fontSize: 13, color: t.SECONDARY, lineHeight: 1.6 }}>{item}</div>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ padding: "20px 16px 48px" }}>
      <div style={{display:"flex",gap:8,marginBottom:20,padding:"10px 14px",background:t.CARD,border:`1px solid ${t.BORDER}`,borderRadius:8,alignItems:"center"}}>
        <div style={{fontSize:10,fontFamily:"'IBM Plex Mono',monospace",color:t.DIM}}>STEP</div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          <div style={{padding:"3px 10px",background:GOLD,color:"#1a1410",borderRadius:4,fontSize:10,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>1 — SIGN</div>
          <div style={{width:20,height:1,background:t.BORDER}}/>
          <div style={{padding:"3px 10px",background:t.BORDER,color:t.MUTED,borderRadius:4,fontSize:10,fontWeight:700,fontFamily:"'IBM Plex Mono',monospace"}}>2 — PAY</div>
        </div>
      </div>
      <SectionHeader label="SERVICE AGREEMENT" />

      {/* Parties */}
      <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "16px 18px", marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px 20px" }}>
          {[
            { label: "CLIENT", value: "Brashae's Barber Beauty Supply" },
            { label: "PROVIDER", value: "Anthony Tatis (twanii)" },
            { label: "INVOICE", value: "BRB-2026-001" },
            { label: "DATE", value: new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) },
            { label: "TOTAL", value: "$2,350" },
            { label: "RETAINER", value: "$125 / month" },
          ].map(row => (
            <div key={row.label}>
              <div style={{ fontSize: 9, color: t.SECONDARY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 3 }}>{row.label}</div>
              <div style={{ fontSize: 13, fontWeight: 700, color: t.TEXT }}>{row.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Section 1 — Scope */}
      <SectionHeader label="1. SCOPE OF WORK" />

      <div style={{ fontSize: 10, fontWeight: 700, color: t.SECONDARY, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 8 }}>1A — WEBSITE REBUILD (brashaesbeautysupplytx.com)</div>
      {bullet([
        "Full rebuild of brashaesbeautysupplytx.com — replacing the existing site with a modern, mobile-first Next.js site",
        "Homepage: hero section, featured brands (Andis, Wahl, BaByliss PRO, JRL, Gamma+, etc.), shop category links, monthly specials, salon services preview, meet the team, location + hours",
        "Salon Services page: braids, wig fittings, hair replacement, corrective coloring, permanents, and booking link (Booksy/Fresha)",
        "Meet the Professionals page: stylists + barbers, specialties, portfolio gallery",
        "Pro Supply page: salon delivery program, wholesale accounts, bulk ordering for other salons",
        "Monthly Specials page: featured deals, promotions, rotating offers",
        "About page: brand story, Raimon's Salon de Beauté integration, expertise and community positioning",
        "Contact page: hours (Mon–Tue 10am–6pm, Wed–Fri 8am–7pm, Sat 8am–6pm, Sun Closed), contact form, Google Maps embed",
        "SEO foundation: meta titles/descriptions, Open Graph tags, sitemap.xml, mobile performance optimization",
        "Social links: Facebook, Instagram (@TheClipperConnect713), X (@Brashaes)",
      ])}

      <div style={{ fontSize: 10, fontWeight: 700, color: t.SECONDARY, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 8, marginTop: 4 }}>1B — ONLINE STORE (shop.brashaesbeautysupplytx.com)</div>
      {bullet([
        "Full ecommerce store — separate subdomain, full browse/cart/checkout experience",
        "Product taxonomy: Hair Care · Barber Supplies · Wigs & Extensions · Styling Tools · Professional Products · New Arrivals · Monthly Specials · Clearance",
        "Monthly Specials system — client can flag any product as a special from the admin panel",
        "Stripe-powered checkout — credit and debit cards, order confirmation emails to buyer",
        "Admin panel at /admin — add, edit, remove products; manage orders; update inventory — no developer needed",
        "Shipping: flat-rate and free-shipping threshold (both configurable by client)",
        "Cart is anonymous — no account required to purchase",
        "Order management dashboard — view, filter, and update order status",
      ])}

      {/* Section 2 — Payment */}
      <SectionHeader label="2. PAYMENT TERMS" />
      {bullet([
        "Total project fee: $2,350 — due upon project completion and client approval",
        "Monthly retainer: $125/mo — begins on the first billing date after site launch",
        "Retainer covers: hosting, uptime monitoring, security updates, product catalog changes, monthly specials updates, minor content edits, WhatsApp priority support",
        "Late payment (30+ days past due) may result in a pause of retainer services until balance is cleared",
      ])}

      {/* Section 3 — Revisions */}
      <SectionHeader label="3. REVISIONS + APPROVALS" />
      {bullet([
        "Two rounds of revisions are included for the website design and the ecomm store layout",
        "Each revision round covers reasonable adjustments to copy, layout, colors, and content — not full redesigns",
        "Additional revision rounds beyond the included two will be quoted separately ($75/hr)",
        "Client approval via this hub (the SIGN tab) constitutes written confirmation that each phase is approved",
        "Work will not proceed to the next phase without explicit approval from the client",
      ])}

      {/* Section 4 — Timeline */}
      <SectionHeader label="4. TIMELINE" />
      {bullet([
        "Estimated 3–4 weeks from agreement signing to full launch — contingent on timely client feedback",
        "Phase 1 (Design): 3–5 business days",
        "Phase 2 (Website): 7–10 business days after design approval",
        "Phase 3 (Store): 5–7 business days after website approval",
        "Delays caused by missing client assets (logo files, product photos, copy) extend the timeline accordingly",
      ])}

      {/* Section 5 — Client Responsibilities */}
      <SectionHeader label="5. CLIENT RESPONSIBILITIES" />
      {bullet([
        "Provide DNS access to brashaesbeautysupplytx.com — needed at launch to point the domain to the new site",
        "Share original logo files and any existing brand kit if available (SVG or high-res PNG preferred) — twanii will build the brand system regardless",
      ])}

      {/* Section 6 — Ownership */}
      <SectionHeader label="6. OWNERSHIP + IP" />
      {bullet([
        "Upon final payment, the client owns all custom design work and website content created under this agreement",
        "The underlying codebase (Next.js + Convex templates) is provided under a non-exclusive license — client may not resell or redistribute the code",
        "twanii retains the right to display the completed site in a portfolio",
      ])}

      {/* Section 7 — Termination */}
      <SectionHeader label="7. TERMINATION" />
      {bullet([
        "Either party may terminate this agreement with 14 days written notice",
        "Work completed prior to termination is billable at the agreed rate, prorated to milestones delivered",
        "Monthly retainer may be cancelled by the client at any time with 30 days notice — no cancellation fee",
      ])}

      {/* Signature */}
      <SectionHeader label="SIGNATURES" />
      <div style={{ background: t.CARD, border: `1px solid ${t.BORDER}`, borderRadius: 8, padding: "14px 16px", marginBottom: 20, fontSize: 13, color: t.DIM, lineHeight: 1.7 }}>
        By signing below, both parties agree to the full scope, payment terms, revision policy, and all clauses outlined in this Service Agreement (Invoice BRB-2026-001).
        This agreement is effective as of the date signed.
      </div>

      <div style={{ fontSize: 11, color: GOLD, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>CLIENT SIGNATURE — BRASHAE'S BARBER BEAUTY SUPPLY</div>
      {isMobile ? (
        <div style={{marginBottom:16}}>
          <div style={{fontSize:11,color:t.DIM,marginBottom:8,fontFamily:"'IBM Plex Mono',monospace",letterSpacing:1}}>TYPE YOUR FULL NAME TO SIGN</div>
          <input
            value={typedName}
            onChange={e => { setTypedName(e.target.value); setHasSig(e.target.value.trim().length > 2); }}
            placeholder="Full name"
            style={{width:"100%",boxSizing:"border-box",background:t.INPUT,border:`1px solid ${t.BORDER}`,borderRadius:8,color:t.TEXT,padding:"14px 16px",fontSize:16,fontFamily:"'Inter',sans-serif",outline:"none"}}
          />
          {typedName.trim().length > 2 && (
            <div style={{marginTop:8,fontSize:11,color:t.DIM,fontFamily:"'IBM Plex Mono',monospace"}}>☑ I agree to the terms above</div>
          )}
        </div>
      ) : (
        <>
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
        </>
      )}
      <button onClick={handleSign} disabled={!hasSig || saving}
        style={{ width: "100%", padding: "16px", background: hasSig && !saving ? GOLD : t.BORDER, color: hasSig && !saving ? "#1a1410" : t.SUBTLE, border: "none", borderRadius: 8, fontSize: 14, fontWeight: 700, cursor: hasSig && !saving ? "pointer" : "default", letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace" }}>
        {saving ? "SAVING..." : "SIGN AGREEMENT — BRB-2026-001"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   THEME TOGGLE
   ═══════════════════════════════════════ */
function ThemeToggle({ dark, onToggle }: { dark: boolean; onToggle: () => void }) {
  return (
    <button onClick={onToggle}
      style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 10px", background: "none", border: `1px solid ${dark ? "#262626" : "#E5DDD0"}`, borderRadius: 20, cursor: "pointer" }}>
      <span style={{ fontSize: 14, lineHeight: 1 }}>{dark ? "☀️" : "🌙"}</span>
      <span style={{ fontSize: 10, fontWeight: 600, color: dark ? "#a0a0a0" : "#6B5D50", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>{dark ? "LIGHT" : "DARK"}</span>
    </button>
  );
}

/* ═══════════════════════════════════════
   MAIN HUB SHELL
   ═══════════════════════════════════════ */
export default function BrashaeHub() {
  const isOps = typeof window !== "undefined" && (window.location.hostname.includes("-ops") || window.location.pathname === "/ops");

  const [dark, setDark] = useState(() => {
    try { return localStorage.getItem("brashae-theme") === "dark"; } catch { return false; }
  });
  const toggleTheme = () => {
    setDark(d => {
      const next = !d;
      try { localStorage.setItem("brashae-theme", next ? "dark" : "light"); } catch {}
      return next;
    });
  };

  const theme = dark ? DARK_THEME : LIGHT_THEME;
  const { PAGE, HEADER, BORDER, SUBTLE, DIM, TEXT, SECONDARY } = theme;

  const [page, setPage] = useState<"workflow"|"scope"|"deliverables"|"agreement">("workflow");
  const tasks   = useQuery(api.tasks.getTasks, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID }) ?? {};
  const setTask = useMutation(api.tasks.setTask);
  const NAV = [
    { id: "workflow",     label: "PROGRESS" },
    { id: "scope",        label: "SCOPE" },
    { id: "deliverables", label: "FILES" },
    { id: "agreement",    label: "SIGN" },
    { id: "site-preview",  label: "SITE ↗",  href: "/preview" },
    { id: "store-preview", label: "STORE ↗", href: "/preview/ecomm" },
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
        `}</style>

        {/* Header */}
        <header style={{ padding: "0 16px", borderBottom: `1px solid ${BORDER}`, background: HEADER, position: "sticky", top: 0, zIndex: 100, boxShadow: dark ? "none" : "0 1px 8px rgba(0,0,0,0.06)" }}>
          <div style={{ maxWidth: 860, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0 8px" }}>
              <div>
                {/* SLIP B-03 — RISK: This is the shared header shell, visible on every page.
                    Adding the SVG monogram here will affect brand identity across all four tabs.
                    Confirm monogram dimensions don't break header height on mobile (esp. at 390px)
                    and that the B|B text renders correctly across browsers before applying. */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <div style={{ fontSize: 15, fontWeight: 900, color: TEXT, letterSpacing: 2 }}>BRASHAE'S</div>
                  <div style={{ fontSize: 11, color: GOLD, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", marginTop: 1 }}>BARBER BEAUTY SUPPLY</div>
                </div>
                <div style={{ fontSize: 11, color: SECONDARY, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2, marginTop: 1 }}>PROJECT HUB · WEBSITE + ECOMM</div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <ThemeToggle dark={dark} onToggle={toggleTheme} />
              </div>
            </div>
            <div style={{ display: "flex", borderTop: `1px solid ${BORDER}`, overflowX: "auto", scrollbarWidth: "none" }}>
              {NAV.map(item => (
                item.href ? (
                  <a key={item.id} href={item.href}
                    style={{ flexShrink: 0, padding: "12px 16px", background: "none", border: "none", borderBottom: "2px solid transparent", color: GOLD, fontSize: 12, fontWeight: 700, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer", transition: "all 0.15s", marginBottom: -1, minHeight: 40, textDecoration: "none", display: "inline-flex", alignItems: "center" }}>
                    {item.label}
                  </a>
                ) : (
                  <button key={item.id} onClick={() => setPage(item.id as any)}
                    style={{ flexShrink: 0, padding: "12px 16px", background: "none", border: "none", borderBottom: page === item.id ? `2px solid ${GOLD}` : "2px solid transparent", color: page === item.id ? GOLD : SUBTLE, fontSize: 12, fontWeight: 700, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", cursor: "pointer", transition: "all 0.15s", marginBottom: -1, minHeight: 40 }}>
                    {item.label}
                  </button>
                )
              ))}
            </div>
          </div>
        </header>

        <main style={{ maxWidth: 860, margin: "0 auto" }}>
          {page === "workflow"     && <WorkflowPage tasks={tasks} setTask={setTask} isOps={isOps} />}
          {page === "scope"        && <ScopePage />}
          {page === "deliverables" && <DeliverablesPage isOps={isOps} />}
          {page === "agreement"    && <AgreementPage />}
        </main>

        <footer style={{ borderTop: `1px solid ${BORDER}`, padding: "16px", marginTop: 32 }}>
          <div style={{ maxWidth: 860, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 8 }}>
            <div style={{ fontSize: 10, color: theme.MUTED, fontFamily: "'IBM Plex Mono',monospace" }}>twanii · Brashae's · Website + Ecomm Build</div>
            <div style={{ fontSize: 10, color: theme.MUTED, fontFamily: "'IBM Plex Mono',monospace" }}>Questions? WhatsApp Anthony</div>
          </div>
        </footer>
      </div>
    </ThemeCtx.Provider>
  );
}
