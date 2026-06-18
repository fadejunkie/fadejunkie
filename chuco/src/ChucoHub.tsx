// @ts-nocheck
import React, { useState, useRef, useEffect, createContext, useContext } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import ChucoLoader from "./ChucoLoader";

/* ═══════════════════════════════════════
   BRAND PALETTE — CHUCO APPAREL
   Black / White / Blood Red metal streetwear
   ═══════════════════════════════════════ */
const BLACK   = "#000000";
const OFF_BLK = "#0a0a0a";
const COAL    = "#111111";
const IRON    = "#1a1a1a";
const STEEL   = "#222222";
const ZINC    = "#333333";
const GREY    = "#555555";
const SILVER  = "#888888";
const ASH     = "#aaaaaa";
const SMOKE   = "#cccccc";
const WHITE   = "#ffffff";
const RED     = "#cc0000";
const RED2    = "#ff1a1a";
const RED_DIM = "#660000";
const GREEN   = "#22c55e";

/* ═══════════════════════════════════════
   THEME SYSTEM — DARK / LIGHT
   ═══════════════════════════════════════ */
const DARK_THEME = {
  BLACK, OFF_BLK, COAL, IRON, STEEL, ZINC, GREY, SILVER, ASH, SMOKE, WHITE, RED, RED2, RED_DIM, GREEN,
  GREEN_BG: "#0d1a0d", GREEN_BORDER: "#1a3d1a",
};
const LIGHT_THEME = {
  BLACK:   "#e4e4e4",  // header/nav strips — slightly darker than page bg
  OFF_BLK: "#ededed",  // page background
  COAL:    "#f7f7f7",  // card surfaces — barely off-white, subtle lift not harsh pop
  IRON:    "#f1f1f1",  // sig pad / recessed surfaces
  STEEL:   "#e8e8e8",
  ZINC:    "#d6d6d6",  // borders — softer so blocks don't look outlined
  GREY:    "#868686",  // muted labels — darker than #999 so they don't drown
  SILVER:  "#636363",  // mid text
  ASH:     "#505050",  // secondary text
  SMOKE:   "#2d2d2d",  // body text
  WHITE:   "#141414",  // primary / heading text
  RED, RED2, RED_DIM, GREEN,
  GREEN_BG: "#edf8ed", GREEN_BORDER: "#aed6ae",
};
const ThemeCtx = createContext(DARK_THEME);

const PROJECT_ID = "chuco-apparel";

/* ═══════════════════════════════════════
   PHASE / MILESTONE DATA
   ═══════════════════════════════════════ */
const PHASES = [
  {
    id: "p0",
    label: "PHASE 0",
    name: "Discovery",
    status: "active",
    tasks: [
      { key: "p0-0", label: "Discovery form submitted by client" },
      { key: "p0-1", label: "Shopify account confirmed" },
      { key: "p0-2", label: "Domain name confirmed" },
      { key: "p0-3", label: "Product collections reviewed" },
    ],
  },
  {
    id: "p1",
    label: "PHASE 1",
    name: "Design",
    status: "pending",
    tasks: [
      { key: "p1-0", label: "Site mockup delivered" },
      { key: "p1-1", label: "Client approved design direction" },
      { key: "p1-2", label: "Brand system documented" },
    ],
  },
  {
    id: "p2",
    label: "PHASE 2",
    name: "Build",
    status: "pending",
    tasks: [
      { key: "p2-0", label: "Shopify theme wrapper integrated" },
      { key: "p2-1", label: "Product collections wired" },
      { key: "p2-2", label: "About + brand copy live" },
      { key: "p2-3", label: "Mobile responsive verified" },
    ],
  },
  {
    id: "p3",
    label: "PHASE 3",
    name: "Launch",
    status: "pending",
    tasks: [
      { key: "p3-0", label: "DNS configured" },
      { key: "p3-1", label: "QA testing complete" },
      { key: "p3-2", label: "Client walkthrough + handoff" },
    ],
  },
];

/* ═══════════════════════════════════════
   DISCOVERY QUESTIONS
   ═══════════════════════════════════════ */
const DISCOVERY_QUESTIONS = [
  {
    id: "shopify_url",
    section: "YOUR STORE",
    label: "Do you have a Shopify account? If yes, what's your store URL?",
    type: "text",
    placeholder: "e.g. chuco-apparel.myshopify.com — or leave blank if you need one",
    hint: "No Shopify yet? No problem — we recommend Shopify Basic at $39/mo. We'll walk you through setup.",
  },
  {
    id: "domain",
    section: "YOUR STORE",
    label: "What domain do you want for the site? (e.g. chucoapparel.com)",
    type: "text",
    placeholder: "e.g. chucoapparel.com — or leave blank if you need help picking one",
    hint: "Don't have a domain? We recommend Namecheap — about $12/year. We'll guide you.",
  },
  {
    id: "collections",
    section: "YOUR PRODUCTS",
    label: "What are your main product categories / collections?",
    type: "textarea",
    placeholder: "e.g. Hoodies, T-Shirts, Hats, Accessories — list them out",
  },
  {
    id: "hero_product",
    section: "YOUR PRODUCTS",
    label: "What's your hero product right now — the one you want front and center?",
    type: "text",
    placeholder: "e.g. Castle Sweater, OG Dragon Tee...",
  },
  {
    id: "tagline",
    section: "BRAND VOICE",
    label: "Do you have a tagline or slogan? Something that captures what Chuco is about?",
    type: "text",
    placeholder: "Leave blank if you want us to develop one based on your vibe",
  },
  {
    id: "about",
    section: "BRAND VOICE",
    label: "Tell us the story — what is Chuco Apparel, who is it for, and what makes it raw?",
    type: "textarea",
    placeholder: "Write it like you'd tell a friend. No need to be corporate.",
  },
  {
    id: "references",
    section: "DESIGN DIRECTION",
    label: "Any sites, brands, or artists whose visual style you vibe with?",
    type: "textarea",
    placeholder: "URLs, brand names, Instagram handles — anything that inspires the aesthetic",
  },
  {
    id: "launch_date",
    section: "TIMELINE",
    label: "Any hard launch date or event you're building toward?",
    type: "text",
    placeholder: "e.g. Drop on May 15, summer launch, no deadline...",
  },
];

/* ═══════════════════════════════════════
   HELPER: SECTION HEADER
   ═══════════════════════════════════════ */
function SectionHeader({ label }: { label: string }) {
  const { RED, ZINC } = useContext(ThemeCtx);
  return (
    <div className="section-header" style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 32 }}>
      <div style={{ width: 3, height: 18, background: RED, flexShrink: 0 }} />
      <div style={{ fontSize: 10, fontWeight: 700, color: RED, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace" }}>
        {label}
      </div>
      <div style={{ flex: 1, height: 1, background: ZINC }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   WORKFLOW PAGE
   ═══════════════════════════════════════ */
function WorkflowPage({ tasks, setTask, isOps }: any) {
  const { BLACK, COAL, ZINC, GREY, SILVER, ASH, SMOKE, WHITE, RED, GREEN, GREEN_BG, GREEN_BORDER } = useContext(ThemeCtx);
  const total = PHASES.flatMap(p => p.tasks).length;
  const done = Object.values(tasks).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  return (
    <div className="hub-page-content" style={{ padding: "24px 32px 48px" }}>
      <SectionHeader label="PROJECT TRACKER" />

      {/* Progress bar */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <div style={{ fontSize: 11, color: ASH, fontFamily: "'IBM Plex Mono',monospace" }}>
            {done} / {total} TASKS COMPLETE
          </div>
          <div style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? GREEN : RED, fontFamily: "'IBM Plex Mono',monospace" }}>
            {pct}%
          </div>
        </div>
        <div style={{ height: 4, background: ZINC, borderRadius: 2 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? GREEN : RED, borderRadius: 2, transition: "width 0.4s" }} />
        </div>
      </div>

      {/* Phases */}
      {PHASES.map(phase => {
        const phaseDone = phase.tasks.filter(t => tasks[t.key]).length;
        const phaseTotal = phase.tasks.length;
        const isActive = phase.status === "active";
        return (
          <div key={phase.id} style={{ marginBottom: 28, opacity: phase.status === "pending" && phaseDone === 0 ? 0.55 : 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
              <div style={{
                fontSize: 9, fontWeight: 700, letterSpacing: 3, padding: "3px 8px",
                background: isActive ? RED : ZINC, color: isActive ? WHITE : GREY,
                fontFamily: "'IBM Plex Mono',monospace", borderRadius: 2
              }}>{phase.label}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, letterSpacing: 1 }}>{phase.name}</div>
              <div style={{ fontSize: 10, color: ASH, fontFamily: "'IBM Plex Mono',monospace", marginLeft: "auto" }}>
                {phaseDone}/{phaseTotal}
              </div>
            </div>
            {phase.tasks.map(task => (
              <div
                key={task.key}
                onClick={() => isOps && setTask({ clientSlug: "chuco", projectId: PROJECT_ID, taskKey: task.key, completed: !tasks[task.key] })}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  marginBottom: 6, borderRadius: 4, cursor: isOps ? "pointer" : "default",
                  background: tasks[task.key] ? GREEN_BG : COAL,
                  border: `1px solid ${tasks[task.key] ? GREEN_BORDER : ZINC}`,
                  transition: "all 0.15s"
                }}
              >
                <div style={{
                  width: 16, height: 16, borderRadius: 3, flexShrink: 0,
                  background: tasks[task.key] ? GREEN : "transparent",
                  border: `2px solid ${tasks[task.key] ? GREEN : GREY}`,
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  {tasks[task.key] && <span style={{ fontSize: 10, color: BLACK, fontWeight: 900 }}>✓</span>}
                </div>
                <span style={{ fontSize: 13, color: tasks[task.key] ? SILVER : SMOKE, textDecoration: tasks[task.key] ? "line-through" : "none" }}>
                  {task.label}
                </span>
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
  const { COAL, ZINC, GREY, SILVER, ASH, SMOKE, WHITE, RED } = useContext(ThemeCtx);
  return (
    <div className="hub-page-content" style={{ padding: "24px 32px 48px" }}>
      <SectionHeader label="SCOPE OF WORK" />

      {/* Deal summary */}
      <div style={{
        background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6,
        padding: "20px 24px", marginBottom: 24
      }}>
        <div className="scope-deal-grid" style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {[
            { label: "TOTAL", value: "$750", accent: false },
            { label: "PAYMENTS", value: "3 × $250", accent: true },
            { label: "MONTHLY", value: "$45/mo", accent: false },
            { label: "TURNAROUND", value: "72 Hours", accent: false },
          ].map(item => (
            <div key={item.label}>
              <div style={{ fontSize: 9, color: SILVER, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 4 }}>
                {item.label}
              </div>
              <div style={{ fontSize: 22, fontWeight: 900, color: item.accent ? RED : WHITE, letterSpacing: -0.5 }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* What's included */}
      <SectionHeader label="WHAT'S INCLUDED" />
      {[
        {
          phase: "BUILD — 3 × $250",
          items: [
            "Payment 1 ($250) — due to kick off. Build starts immediately.",
            "Payment 2 ($250) — due at design approval.",
            "Payment 3 ($250) — due at launch.",
            "Custom branded Shopify site wrapper (homepage, collection pages, product pages, about, contact)",
            "Brand system applied — colors, typography, mascot/logo integration",
            "Mobile-first responsive design",
            "Domain + Shopify setup guidance (if needed)",
            "72-hour turnaround from design approval",
          ]
        },
        {
          phase: "MONTHLY — $45/mo",
          items: [
            "Basic maintenance — uptime monitoring, minor copy/image swaps",
            "Monthly check-in on site health",
            "Priority response for any issues",
          ]
        }
      ].map(section => (
        <div key={section.phase} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: RED, letterSpacing: 2, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 12 }}>
            {section.phase}
          </div>
          {section.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 8 }}>
              <div style={{ width: 4, height: 4, background: RED, borderRadius: "50%", marginTop: 6, flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: SMOKE, lineHeight: 1.5 }}>{item}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Shopify + Domain guidance */}
      <SectionHeader label="IF YOU NEED SETUP" />
      <div className="scope-recs-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
        {[
          {
            title: "Shopify Account",
            rec: "Shopify Basic",
            price: "$39/mo",
            desc: "Full ecommerce — product manager, inventory, checkout, payments. Everything you need to sell.",
            url: "shopify.com"
          },
          {
            title: "Domain Name",
            rec: "Namecheap",
            price: "~$12/year",
            desc: "Register your domain. We'll handle pointing it to your Shopify store. Simple.",
            url: "namecheap.com"
          }
        ].map(rec => (
          <div key={rec.title} style={{ background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6, padding: "16px 18px" }}>
            <div style={{ fontSize: 9, color: SILVER, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 6 }}>
              {rec.title}
            </div>
            <div style={{ fontSize: 16, fontWeight: 700, color: WHITE, marginBottom: 2 }}>{rec.rec}</div>
            <div style={{ fontSize: 13, color: RED, fontWeight: 700, marginBottom: 8 }}>{rec.price}</div>
            <div style={{ fontSize: 12, color: ASH, lineHeight: 1.5, marginBottom: 10 }}>{rec.desc}</div>
            <div style={{ fontSize: 10, color: GREY, fontFamily: "'IBM Plex Mono',monospace" }}>{rec.url}</div>
          </div>
        ))}
      </div>

      {/* Terms */}
      <SectionHeader label="PAYMENT TERMS" />
      <div style={{ background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6, padding: "16px 20px" }}>
        <div style={{ fontSize: 13, color: ASH, lineHeight: 1.8 }}>
          Total build cost is <strong style={{ color: WHITE }}>$750 split into 3 payments of $250</strong>.
          Payment 1 is due on signing to kick off the project. Payment 2 is due at design approval. Payment 3 is due at launch.
          Maintenance billing at <strong style={{ color: WHITE }}>$45/mo</strong> starts the month after launch. Cancel anytime with 30 days notice.
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DISCOVERY PAGE
   ═══════════════════════════════════════ */
function DiscoveryPage({ isOps }: { isOps: boolean }) {
  const { COAL, ZINC, SILVER, ASH, SMOKE, WHITE, RED, RED_DIM, GREEN, GREEN_BG, GREEN_BORDER } = useContext(ThemeCtx);
  const existing = useQuery(api.discovery.getDiscovery, { clientSlug: "chuco", projectId: PROJECT_ID });
  const saveDiscovery = useMutation(api.discovery.saveDiscovery);
  const [form, setForm] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing?.responses) {
      try {
        const parsed = JSON.parse(existing.responses);
        setForm(parsed);
        setSubmitted(true);
      } catch {}
    }
  }, [existing]);

  const handleSubmit = async () => {
    setSaving(true);
    await saveDiscovery({ clientSlug: "chuco", projectId: PROJECT_ID, responses: JSON.stringify(form) });
    setSaving(false);
    setSubmitted(true);
  };

  let lastSection = "";

  if (submitted && !isOps) {
    return (
      <div className="hub-page-content" style={{ padding: "24px 32px 48px" }}>
        <SectionHeader label="DISCOVERY" />
        <div style={{ background: GREEN_BG, border: `1px solid ${GREEN_BORDER}`, borderRadius: 6, padding: "24px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 28, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 16, fontWeight: 700, color: GREEN, marginBottom: 8 }}>Discovery Submitted</div>
          <div style={{ fontSize: 13, color: ASH }}>We've got everything we need. Anthony will be in touch to confirm next steps.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="hub-page-content" style={{ padding: "24px 32px 48px" }}>
      <SectionHeader label="DISCOVERY" />
      <div style={{ fontSize: 13, color: ASH, marginBottom: 28, lineHeight: 1.6 }}>
        {isOps
          ? "Discovery responses from client."
          : "Fill this out so we can build exactly what Chuco needs. Be as real as you want — no corporate speak required."}
      </div>

      {DISCOVERY_QUESTIONS.map(q => {
        const showHeader = q.section !== lastSection;
        if (showHeader) lastSection = q.section;
        return (
          <div key={q.id}>
            {showHeader && <SectionHeader label={q.section} />}
            <div style={{ marginBottom: 20 }}>
              <label style={{ display: "block", fontSize: 13, color: SMOKE, marginBottom: 6, fontWeight: 500 }}>
                {q.label}
              </label>
              {q.hint && (
                <div style={{ fontSize: 11, color: SILVER, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 8, paddingLeft: 10, borderLeft: `2px solid ${RED_DIM}` }}>
                  {q.hint}
                </div>
              )}
              {q.type === "textarea" ? (
                <textarea
                  readOnly={isOps}
                  value={form[q.id] || ""}
                  onChange={e => setForm({ ...form, [q.id]: e.target.value })}
                  placeholder={q.placeholder}
                  rows={3}
                  style={{
                    width: "100%", boxSizing: "border-box", background: COAL,
                    border: `1px solid ${ZINC}`, borderRadius: 4, color: WHITE,
                    padding: "10px 12px", fontSize: 13, resize: "vertical",
                    fontFamily: "inherit", outline: "none"
                  }}
                />
              ) : (
                <input
                  readOnly={isOps}
                  type="text"
                  value={form[q.id] || ""}
                  onChange={e => setForm({ ...form, [q.id]: e.target.value })}
                  placeholder={q.placeholder}
                  style={{
                    width: "100%", boxSizing: "border-box", background: COAL,
                    border: `1px solid ${ZINC}`, borderRadius: 4, color: WHITE,
                    padding: "10px 12px", fontSize: 13, fontFamily: "inherit", outline: "none"
                  }}
                />
              )}
            </div>
          </div>
        );
      })}

      {!isOps && (
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            marginTop: 16, padding: "14px 32px", background: saving ? ZINC : RED,
            color: WHITE, border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700,
            cursor: saving ? "default" : "pointer", letterSpacing: 2,
            fontFamily: "'IBM Plex Mono',monospace", transition: "background 0.15s"
          }}
        >
          {saving ? "SAVING..." : "SUBMIT DISCOVERY"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   SITE PREVIEW PAGE
   — Wireframe mockup with "In Session" indicator
   ═══════════════════════════════════════ */

/* Wireframe color tokens */
const WF_BG    = "#0d0d0d";
const WF_SURF  = "#141414";
const WF_BOX   = "#1c1c1c";
const WF_LINE  = "#242424";
const WF_EDGE  = "#2a2a2a";
const WF_DIM   = "#333333";

/* Reusable wireframe primitives */
const WfBox = ({ w, h, style = {} }: any) => (
  <div style={{ width: w, height: h, background: WF_BOX, border: `1px solid ${WF_EDGE}`, borderRadius: 2, flexShrink: 0, ...style }} />
);
const WfLine = ({ w = "100%", h = 8, style = {} }: any) => (
  <div style={{ width: w, height: h, background: WF_LINE, borderRadius: 2, flexShrink: 0, ...style }} />
);
const WfBtn = ({ w = 72, h = 24, style = {} }: any) => (
  <div style={{ width: w, height: h, border: `1px solid ${WF_DIM}`, borderRadius: 2, flexShrink: 0, ...style }} />
);

function SitePreviewPage() {
  const { COAL, ZINC, GREY, ASH, SMOKE, WHITE, RED, RED_DIM } = useContext(ThemeCtx);
  return (
    <div className="hub-page-content" style={{ padding: "24px 24px 48px" }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px #cc0000aa, 0 0 12px 4px #cc000044; }
          50%       { opacity: 0.6; box-shadow: 0 0 3px 1px #cc000066, 0 0 6px 2px #cc000022; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @media (max-width: 600px) {
          .wf-iframe { height: 480px !important; }
          .wf-blurb { padding: 16px !important; }
        }
      `}</style>

      {/* ── Status indicator ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: RED, animation: "pulse-glow 1.8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${RED}`, animation: "pulse-ring 1.8s ease-out infinite" }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", color: RED, textShadow: `0 0 8px ${RED}88, 0 0 20px ${RED}44` }}>
          IN SESSION
        </div>
        <div style={{ height: 1, width: 32, background: `linear-gradient(90deg, ${RED_DIM}, transparent)` }} />
        <div style={{ fontSize: 9, color: GREY, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2 }}>
          WIREFRAME · SITE UNDER CONSTRUCTION
        </div>
        <div style={{ height: 1, width: 32, background: `linear-gradient(270deg, ${RED_DIM}, transparent)` }} />
      </div>

      {/* ── How it works blurb ── */}
      <div className="wf-blurb" style={{
        background: COAL,
        border: `1px solid ${ZINC}`,
        borderLeft: `3px solid ${RED}`,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 3, color: RED, textTransform: "uppercase", marginBottom: 8 }}>
              How This Works
            </div>
            <div style={{ fontSize: 13, color: SMOKE, lineHeight: 1.7, maxWidth: 520 }}>
              This is the site structure before it goes to build — every page, every layout, every section mapped out
              so you can see the bones before we put the walls up. Click through the pages at the top, check the flow,
              and flag anything that needs to change before we move forward.
            </div>
          </div>
          <a
            href="/chuco-wireframe.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: `1px solid ${ZINC}`, color: ASH,
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: 2,
              textTransform: "uppercase", textDecoration: "none",
              padding: "9px 16px", flexShrink: 0, whiteSpace: "nowrap",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = WHITE; (e.currentTarget as HTMLElement).style.color = WHITE; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ZINC; (e.currentTarget as HTMLElement).style.color = ASH; }}
          >
            ↗ Open full page
          </a>
        </div>
      </div>

      {/* ── Wireframe iframe ── */}
      <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid #2a2a2a`, boxShadow: `0 20px 50px #000000cc` }}>
        <iframe
          className="wf-iframe"
          src="/chuco-wireframe.html"
          title="Chuco Apparel — Site Wireframe"
          style={{ width: "100%", height: 680, border: "none", display: "block", background: "#000" }}
        />
      </div>

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: RED_DIM }} />
        <div style={{ fontSize: 9, color: GREY, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2 }}>
          FINAL BUILD DELIVERED AFTER APPROVAL · MATCHES YOUR BRAND EXACTLY
        </div>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: RED_DIM }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   DESIGN PREVIEW PAGE
   ═══════════════════════════════════════ */
function DesignPreviewPage({ tasks, setTask }: { tasks: any; setTask: any }) {
  const { COAL, ZINC, GREY, ASH, SMOKE, WHITE, RED, RED_DIM, GREEN, GREEN_BG, GREEN_BORDER } = useContext(ThemeCtx);
  const [approving, setApproving] = useState(false);
  const [approved, setApproved] = useState(false);

  const mockupDelivered = !!tasks["p1-0"];
  const designApproved  = !!tasks["p1-1"];
  const awaitingApproval = mockupDelivered && !designApproved;

  const handleApprove = async () => {
    setApproving(true);
    try {
      await setTask({ clientSlug: "chuco", projectId: "chuco-apparel", taskKey: "p1-1", completed: true });
      setApproved(true);
    } finally {
      setApproving(false);
    }
  };

  return (
    <div className="hub-page-content" style={{ padding: "24px 24px 48px" }}>
      <style>{`
        @keyframes pulse-glow {
          0%, 100% { opacity: 1; box-shadow: 0 0 6px 2px #cc0000aa, 0 0 12px 4px #cc000044; }
          50%       { opacity: 0.6; box-shadow: 0 0 3px 1px #cc000066, 0 0 6px 2px #cc000022; }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1);   opacity: 0.7; }
          100% { transform: scale(2.2); opacity: 0; }
        }
        @media (max-width: 600px) {
          .dp-iframe { height: 480px !important; }
          .dp-blurb { padding: 16px !important; }
        }
      `}</style>

      {/* ── Status indicator ── */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 10, marginBottom: 20 }}>
        <div style={{ position: "relative", width: 10, height: 10, flexShrink: 0 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", background: RED, animation: "pulse-glow 1.8s ease-in-out infinite" }} />
          <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: `1px solid ${RED}`, animation: "pulse-ring 1.8s ease-out infinite" }} />
        </div>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", color: RED, textShadow: `0 0 8px ${RED}88, 0 0 20px ${RED}44` }}>
          {designApproved ? "APPROVED" : "IN SESSION"}
        </div>
        <div style={{ height: 1, width: 32, background: `linear-gradient(90deg, ${RED_DIM}, transparent)` }} />
        <div style={{ fontSize: 9, color: GREY, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2 }}>
          DESIGN SYSTEM · COLORS · TYPOGRAPHY · COMPONENTS
        </div>
        <div style={{ height: 1, width: 32, background: `linear-gradient(270deg, ${RED_DIM}, transparent)` }} />
      </div>

      {/* ── How it works blurb ── */}
      <div className="dp-blurb" style={{
        background: COAL,
        border: `1px solid ${ZINC}`,
        borderLeft: `3px solid ${RED}`,
        padding: "20px 24px",
        marginBottom: 20,
        display: "flex",
        flexDirection: "column",
        gap: 14,
      }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: 200 }}>
            <div style={{ fontSize: 9, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 3, color: RED, textTransform: "uppercase", marginBottom: 8 }}>
              How This Works
            </div>
            <div style={{ fontSize: 13, color: SMOKE, lineHeight: 1.7, maxWidth: 520 }}>
              This is your live design system — colors, fonts, shapes, and logo system, all locked in before a single line of code gets written.
              Each section is a decision. Scroll through, flag anything with the feedback button at the bottom of each section,
              and when everything looks right, sign off below.
            </div>
          </div>
          <a
            href="/chuco-design-preview.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              border: `1px solid ${ZINC}`, color: ASH,
              fontFamily: "'IBM Plex Mono',monospace", fontSize: 9, letterSpacing: 2,
              textTransform: "uppercase", textDecoration: "none",
              padding: "9px 16px", flexShrink: 0, whiteSpace: "nowrap",
              transition: "border-color 0.15s, color 0.15s",
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = WHITE; (e.currentTarget as HTMLElement).style.color = WHITE; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = ZINC; (e.currentTarget as HTMLElement).style.color = ASH; }}
          >
            ↗ Open full page
          </a>
        </div>

        {/* Approval sign-off */}
        <div style={{ borderTop: `1px solid ${ZINC}`, paddingTop: 14, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ fontSize: 11, color: designApproved ? GREEN : (awaitingApproval ? SMOKE : GREY), fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
            {designApproved
              ? "✓ Design direction approved"
              : awaitingApproval
              ? "Ready for your sign-off. Does this look like Chuco?"
              : "Design is still in development — approval available once mockup is delivered."}
          </div>
          {designApproved ? (
            <div style={{
              background: GREEN_BG, border: `1px solid ${GREEN_BORDER}`,
              color: GREEN, fontFamily: "'IBM Plex Mono',monospace",
              fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
              padding: "9px 20px",
            }}>
              ✓ Approved
            </div>
          ) : (
            <button
              onClick={awaitingApproval ? handleApprove : undefined}
              disabled={!awaitingApproval || approving}
              style={{
                background: awaitingApproval ? RED : "transparent",
                border: `1px solid ${awaitingApproval ? RED : ZINC}`,
                color: awaitingApproval ? WHITE : GREY,
                fontFamily: "'IBM Plex Mono',monospace",
                fontSize: 9, letterSpacing: 2, textTransform: "uppercase",
                padding: "9px 20px", cursor: awaitingApproval ? "pointer" : "default",
                opacity: approving ? 0.6 : 1,
                transition: "background 0.15s, border-color 0.15s",
              }}
            >
              {approving ? "Saving…" : "Approve Design Direction →"}
            </button>
          )}
        </div>
      </div>

      {/* ── iframe ── */}
      <div style={{ borderRadius: 8, overflow: "hidden", border: `1px solid #2a2a2a`, boxShadow: `0 20px 50px #000000cc` }}>
        <iframe
          className="dp-iframe"
          src="/chuco-design-preview.html"
          title="Chuco Apparel — Design System Preview"
          style={{ width: "100%", height: 680, border: "none", display: "block", background: "#000" }}
        />
      </div>

      <div style={{ marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: RED_DIM }} />
        <div style={{ fontSize: 9, color: GREY, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2 }}>
          COLORS · FONTS · SHAPES · LOGO SYSTEM · COMPONENTS
        </div>
        <div style={{ width: 4, height: 4, borderRadius: "50%", background: RED_DIM }} />
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE
   ═══════════════════════════════════════ */
const CHUCO_INVOICE = {
  number: "CH-2026-003",
  amount: "$250.00",
  due: "June 4, 2026",
  label: "Payment 1 of 3",
  url: "https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VZTA5M0pJMzRIbm94OWNjUEJ4eGMyU0NiVXVhODFwLDE3MTE0Njc1Ng0200iKSJ7zP9?s=ap",
  pdf: "https://pay.stripe.com/invoice/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VZTA5M0pJMzRIbm94OWNjUEJ4eGMyU0NiVXVhODFwLDE3MTE0Njc1Ng0200iKSJ7zP9/pdf?s=ap",
};

function AgreementPage() {
  const { COAL, IRON, ZINC, GREY, ASH, SMOKE, WHITE, RED, GREEN, GREEN_BG, GREEN_BORDER } = useContext(ThemeCtx);
  const existing = useQuery(api.agreements.getAgreement, { clientSlug: "chuco", projectId: PROJECT_ID });
  const saveAgreement = useMutation(api.agreements.saveAgreement);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [hasSig, setHasSig] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (existing) setSaved(true);
  }, [existing]);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (clientX - rect.left) * scaleX, y: (clientY - rect.top) * scaleY };
  };

  const startDraw = (e: any) => {
    if (e.touches) e.preventDefault();
    setDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const draw = (e: any) => {
    if (!drawing) return;
    if (e.touches) e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    const { x, y } = getPos(e, canvas);
    ctx.lineWidth = 2;
    ctx.strokeStyle = WHITE;
    ctx.lineTo(x, y);
    ctx.stroke();
    setHasSig(true);
  };

  const stopDraw = () => setDrawing(false);

  const clearSig = () => {
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx) return;
    ctx.clearRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    setHasSig(false);
  };

  const handleSign = async () => {
    if (!hasSig || saving) return;
    setSaving(true);
    const sigData = canvasRef.current!.toDataURL();
    const now = new Date();
    await saveAgreement({
      clientSlug: "chuco",
      projectId: PROJECT_ID,
      sigData,
      signedDate: now.toLocaleDateString(),
      invoiceNumber: CHUCO_INVOICE.number,
    });
    setSaving(false);
    setSaved(true);
  };

  /* ── Post-signature view: agreement confirmed + invoice panel ── */
  if (saved) {
    return (
      <div className="hub-page-content" style={{ padding: "24px 32px 48px" }}>
        <SectionHeader label="AGREEMENT" />

        {/* Signed confirmation */}
        <div style={{ background: GREEN_BG, border: `1px solid ${GREEN_BORDER}`, borderRadius: 6, padding: "20px 24px", marginBottom: 24, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ fontSize: 22, flexShrink: 0 }}>✓</div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: GREEN, marginBottom: 4 }}>Agreement Signed</div>
            <div style={{ fontSize: 12, color: ASH }}>Signed {existing?.signedDate} — Invoice #{existing?.invoiceNumber}</div>
          </div>
        </div>

        {/* Invoice panel */}
        <SectionHeader label="PAYMENT PLAN" />

        {/* Payment 1 — PAID */}
        <div style={{ background: GREEN_BG, border: `1px solid ${GREEN_BORDER}`, borderRadius: 6, padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ fontSize: 16, color: GREEN }}>✓</div>
            <div>
              <div style={{ fontSize: 9, color: GREEN, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 2 }}>PAYMENT 1 OF 3 — PAID</div>
              <div style={{ fontSize: 16, fontWeight: 900, color: GREEN }}>$250.00</div>
            </div>
          </div>
          <div style={{ fontSize: 10, color: GREEN, fontFamily: "'IBM Plex Mono',monospace", opacity: 0.75 }}>Received June 4, 2026</div>
        </div>

        {/* Payment 2 — pending */}
        <div style={{ background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6, padding: "16px 20px", marginBottom: 10, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, opacity: 0.6 }}>
          <div>
            <div style={{ fontSize: 9, color: GREY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 2 }}>PAYMENT 2 OF 3 — DUE AT DESIGN APPROVAL</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: WHITE }}>$250.00</div>
          </div>
          <div style={{ fontSize: 10, color: GREY, fontFamily: "'IBM Plex Mono',monospace" }}>PENDING</div>
        </div>

        {/* Payment 3 — pending */}
        <div style={{ background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6, padding: "16px 20px", marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, opacity: 0.6 }}>
          <div>
            <div style={{ fontSize: 9, color: GREY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 2 }}>PAYMENT 3 OF 3 — DUE AT LAUNCH</div>
            <div style={{ fontSize: 16, fontWeight: 900, color: WHITE }}>$250.00</div>
          </div>
          <div style={{ fontSize: 10, color: GREY, fontFamily: "'IBM Plex Mono',monospace" }}>PENDING</div>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <a
            href={CHUCO_INVOICE.pdf}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block", padding: "10px 20px",
              background: "transparent", color: GREY,
              border: `1px solid ${ZINC}`, textDecoration: "none",
              fontSize: 11, fontWeight: 700, letterSpacing: 2,
              fontFamily: "'IBM Plex Mono',monospace", borderRadius: 4
            }}
          >
            ↓ RECEIPT (PAYMENT 1)
          </a>
        </div>
      </div>
    );
  }

  /* ── Pre-signature view ── */
  return (
    <div className="hub-page-content" style={{ padding: "24px 32px 48px" }}>
      <SectionHeader label="AGREEMENT" />

      {/* Terms summary */}
      <div style={{ background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6, padding: "20px 24px", marginBottom: 24, fontSize: 13, color: ASH, lineHeight: 1.8 }}>
        By signing below, you agree to the following engagement terms with <strong style={{ color: WHITE }}>Twanii (Anthony Tatis)</strong>:
        <ul style={{ marginTop: 12, paddingLeft: 20 }}>
          <li>Branded Shopify ecom wrapper — homepage, product pages, about, contact</li>
          <li>72-hour turnaround from design approval</li>
          <li><strong style={{ color: WHITE }}>$750 total — paid in 3 installments of $250</strong></li>
          <li>Payment 1: $250 to kick off · Payment 2: $250 at design approval · Payment 3: $250 at launch</li>
          <li><strong style={{ color: WHITE }}>$45/month</strong> maintenance retainer — begins month after launch</li>
          <li>Cancellation: 30 days written notice required for maintenance</li>
        </ul>
      </div>

      {/* Invoice preview — shown before signing so client knows what's coming */}
      <div style={{ background: COAL, border: `1px solid ${ZINC}`, borderRadius: 6, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 3, height: 32, background: RED, borderRadius: 2, flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: 9, color: GREY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace" }}>INVOICE UPON SIGNING — {CHUCO_INVOICE.label}</div>
            <div style={{ fontSize: 18, fontWeight: 900, color: WHITE, marginTop: 2 }}>{CHUCO_INVOICE.amount} <span style={{ fontSize: 11, color: GREY, fontWeight: 400 }}>due {CHUCO_INVOICE.due}</span></div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: ASH, fontFamily: "'IBM Plex Mono',monospace" }}>Invoice #{CHUCO_INVOICE.number}</div>
      </div>

      {/* Signature pad */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: ASH, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 8 }}>SIGN BELOW</div>
        <canvas
          ref={canvasRef}
          width={560}
          height={120}
          onMouseDown={startDraw}
          onMouseMove={draw}
          onMouseUp={stopDraw}
          onMouseLeave={stopDraw}
          onTouchStart={startDraw}
          onTouchMove={draw}
          onTouchEnd={stopDraw}
          style={{ background: IRON, borderRadius: 4, border: `1px solid ${ZINC}`, cursor: "crosshair", display: "block", width: "100%", maxWidth: 560 }}
        />
        <button onClick={clearSig} style={{ marginTop: 8, background: "transparent", border: `1px solid ${ZINC}`, color: GREY, padding: "6px 14px", fontSize: 11, cursor: "pointer", borderRadius: 3, fontFamily: "'IBM Plex Mono',monospace" }}>
          CLEAR
        </button>
      </div>

      <button
        onClick={handleSign}
        disabled={!hasSig || saving}
        style={{
          padding: "14px 32px", background: hasSig && !saving ? RED : ZINC,
          color: WHITE, border: "none", borderRadius: 4, fontSize: 13, fontWeight: 700,
          cursor: hasSig && !saving ? "pointer" : "default", letterSpacing: 2,
          fontFamily: "'IBM Plex Mono',monospace", transition: "background 0.15s"
        }}
      >
        {saving ? "SAVING..." : "SIGN & CONFIRM"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT HUB
   ═══════════════════════════════════════ */
export default function ChucoHub() {
  const host = typeof window !== "undefined" ? window.location.hostname : "";
  const isOps = host.includes("ops") || host === "localhost" || host.includes("127.0.0.1");

  const [loaderDone, setLoaderDone] = useState(false);
  const [page, setPage] = useState("workflow");
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window === "undefined") return true;
    return localStorage.getItem("chuco-theme") !== "light";
  });
  const theme = darkMode ? DARK_THEME : LIGHT_THEME;

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    localStorage.setItem("chuco-theme", next ? "dark" : "light");
  };

  const tasks = useQuery(api.tasks.getTasks, { clientSlug: "chuco", projectId: PROJECT_ID }) ?? {};
  const setTask = useMutation(api.tasks.setTask);

  // Lifted for badge detection
  const discoveryData = useQuery(api.discovery.getDiscovery, { clientSlug: "chuco", projectId: PROJECT_ID });
  const agreementData = useQuery(api.agreements.getAgreement, { clientSlug: "chuco", projectId: PROJECT_ID });
  const discoveryBadge = discoveryData !== undefined && !discoveryData;
  const agreementBadge = agreementData !== undefined && !agreementData;

  const total = PHASES.flatMap(p => p.tasks).length;
  const done = Object.values(tasks).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);

  const { BLACK, OFF_BLK, COAL, ZINC, GREY, SILVER: _SIL, ASH: _ASH, SMOKE, WHITE, RED, GREEN } = theme;

  const NAV = isOps
    ? [
        { id: "workflow",  label: "TRACKER",        badge: false },
        { id: "discovery", label: "DISCOVERY",      badge: discoveryBadge },
        { id: "design",    label: "DESIGN PREVIEW", badge: false },
        { id: "website",   label: "WIREFRAME",      badge: false },
        { id: "scope",     label: "SCOPE",          badge: false },
        { id: "agreement", label: "AGREEMENT",      badge: agreementBadge },
      ]
    : [
        { id: "workflow",  label: "PROGRESS",       badge: false },
        { id: "discovery", label: "DISCOVERY",      badge: discoveryBadge },
        { id: "design",    label: "DESIGN PREVIEW", badge: false },
        { id: "website",   label: "WIREFRAME",      badge: false },
        { id: "scope",     label: "SCOPE",          badge: false },
        { id: "agreement", label: "AGREEMENT",      badge: agreementBadge },
      ];

  return (
    <ThemeCtx.Provider value={theme}>
      {!loaderDone && <ChucoLoader onComplete={() => setLoaderDone(true)} />}
      <div style={{ minHeight: "100vh", background: OFF_BLK, color: WHITE, fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
        <style>{`
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: ${OFF_BLK}; }
          textarea:focus, input:focus { border-color: ${RED} !important; }
          ::-webkit-scrollbar { width: 6px; height: 6px; }
          ::-webkit-scrollbar-track { background: ${COAL}; }
          ::-webkit-scrollbar-thumb { background: ${ZINC}; border-radius: 3px; }
          ::-webkit-scrollbar-thumb:hover { background: ${GREY}; }
          /* ── Mobile responsive ── */
          @media (max-width: 600px) {
            .hub-header { padding: 0 16px !important; gap: 10px !important; }
            .hub-header-label { display: none !important; }
            .hub-header-divider { display: none !important; }
            .hub-header-progress-bar { display: none !important; }
            .hub-header-pct { font-size: 8px !important; }
            .hub-infostrip { padding: 8px 16px !important; gap: 14px !important; overflow-x: auto; -webkit-overflow-scrolling: touch; flex-wrap: nowrap !important; }
            .hub-nav { padding: 0 0 0 4px !important; overflow-x: auto; -webkit-overflow-scrolling: touch; scrollbar-width: none; }
            .hub-nav::-webkit-scrollbar { display: none; }
            .hub-nav button { padding: 12px 12px !important; font-size: 9px !important; white-space: nowrap; }
            .hub-page-content { padding: 16px 16px 40px !important; }
            .scope-recs-grid { grid-template-columns: 1fr !important; }
            .scope-deal-grid { gap: 16px !important; }
            .wf-product-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .section-header { margin-top: 20px !important; }
          }
        `}</style>

        {/* Header */}
        <div className="hub-header" style={{ background: BLACK, borderBottom: `1px solid ${ZINC}`, padding: "0 32px", display: "flex", alignItems: "center", gap: 20, height: 58 }}>
          <img src="/chuco-logo.svg" alt="CHUCO" style={{ height: 24, filter: darkMode ? "invert(1)" : "none", flexShrink: 0 }} />
          <div className="hub-header-divider" style={{ width: 1, height: 20, background: ZINC }} />
          <div className="hub-header-label" style={{ fontSize: 9, color: GREY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace" }}>
            {isOps ? "OPS DASHBOARD" : "PROJECT HUB"}
          </div>
          <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 16 }}>
            <div className="hub-header-pct" style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ fontSize: 9, color: pct === 100 ? GREEN : RED, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2 }}>
                {pct}%
              </div>
              <div className="hub-header-progress-bar" style={{ width: 80, height: 3, background: ZINC, borderRadius: 2 }}>
                <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? GREEN : RED, borderRadius: 2 }} />
              </div>
            </div>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              title={darkMode ? "Switch to light mode" : "Switch to dark mode"}
              style={{
                background: "transparent", border: `1px solid ${ZINC}`, borderRadius: 4,
                color: GREY, padding: "5px 9px", fontSize: 13, cursor: "pointer",
                lineHeight: 1, display: "flex", alignItems: "center"
              }}
            >
              {darkMode ? "☀" : "🌙"}
            </button>
          </div>
        </div>

        {/* Client + deal info strip */}
        <div className="hub-infostrip" style={{ background: COAL, borderBottom: `1px solid ${ZINC}`, padding: "10px 32px", display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
          <div style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: GREY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace" }}>CLIENT</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: WHITE }}>Chuco Apparel</div>
          </div>
          {[
            { label: "TOTAL", value: "$750" },
            { label: "PAYMENTS", value: "3 × $250" },
            { label: "MONTHLY", value: "$45/mo" },
            { label: "TURNAROUND", value: "72 hrs" },
          ].map(item => (
            <div key={item.label} style={{ flexShrink: 0 }}>
              <div style={{ fontSize: 9, color: GREY, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace" }}>{item.label}</div>
              <div style={{ fontSize: 12, color: SMOKE }}>{item.value}</div>
            </div>
          ))}
        </div>

        {/* Nav */}
        <div className="hub-nav" style={{ background: BLACK, borderBottom: `1px solid ${ZINC}`, padding: "0 32px", display: "flex", gap: 0 }}>
          {NAV.map(n => (
            <button
              key={n.id}
              onClick={() => setPage(n.id)}
              style={{
                background: "transparent", border: "none", borderBottom: page === n.id ? `2px solid ${RED}` : "2px solid transparent",
                color: page === n.id ? WHITE : GREY, padding: "14px 18px", fontSize: 10, fontWeight: 700,
                letterSpacing: 2, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace",
                transition: "all 0.15s", position: "relative", flexShrink: 0
              }}
            >
              {n.label}
              {n.badge && (
                <span style={{
                  position: "absolute", top: 8, right: 6,
                  width: 7, height: 7, borderRadius: "50%",
                  background: RED, boxShadow: `0 0 4px ${RED}88`,
                  display: "block"
                }} />
              )}
            </button>
          ))}
        </div>

        {/* Page content */}
        <div style={{ maxWidth: 860, margin: "0 auto" }}>
          {page === "workflow" && <WorkflowPage tasks={tasks} setTask={setTask} isOps={isOps} />}
          {page === "discovery" && <DiscoveryPage isOps={isOps} />}
          {page === "design" && <DesignPreviewPage tasks={tasks} setTask={setTask} />}
          {page === "website" && <SitePreviewPage />}
          {page === "scope" && <ScopePage />}
          {page === "agreement" && <AgreementPage />}
        </div>
      </div>
    </ThemeCtx.Provider>
  );
}
