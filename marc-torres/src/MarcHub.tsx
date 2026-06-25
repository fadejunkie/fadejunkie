// @ts-nocheck
import React, { useState, useRef, useEffect, useContext, createContext } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { jsPDF } from "jspdf";

/* ═══════════════════════════════════════
   LINEAR DESIGN SYSTEM — DARK + LIGHT
   Lavender accent · Inter
   ═══════════════════════════════════════ */
const DARK = {
  canvas:          "#010102",
  surface1:        "#111113",
  surface2:        "#1c1c1f",
  surface3:        "#242428",
  surface4:        "#2c2c31",
  hairline:        "#23252a",
  hairlineStrong:  "#2e3036",
  primary:         "#5e6ad2",
  primaryHover:    "#828fff",
  primaryFocus:    "#5e69d1",
  ink:             "#f7f8f8",
  inkMuted:        "#d0d6e0",
  inkSubtle:       "#8a8f98",
  inkTertiary:     "#62666d",
  success:         "#27a644",
};

const LIGHT = {
  canvas:          "#f9f9fb",
  surface1:        "#ffffff",
  surface2:        "#f2f2f5",
  surface3:        "#e8e9ed",
  surface4:        "#dcdee5",
  hairline:        "#e1e3e8",
  hairlineStrong:  "#d0d3db",
  primary:         "#5e6ad2",
  primaryHover:    "#4a55b8",
  primaryFocus:    "#5e69d1",
  ink:             "#0f0f10",
  inkMuted:        "#3c3f47",
  inkSubtle:       "#6b6f78",
  inkTertiary:     "#9499a3",
  success:         "#1f9637",
};

// Will be set dynamically — export a mutable ref
let C = DARK;

const ThemeCtx = createContext<{ C: typeof DARK; light: boolean }>({ C: DARK, light: false });

const FONT = `'Inter', 'SF Pro Display', -apple-system, system-ui, sans-serif`;
const MONO = `'JetBrains Mono', 'SF Mono', ui-monospace, monospace`;

const CLIENT_SLUG = "marc-torres";
const PROJECT_ID  = "gracie-jj-sa";

/* ═══════════════════════════════════════
   PHASE DATA — 3-MONTH SEO SPRINT
   ═══════════════════════════════════════ */
const PHASES = [
  {
    id: "m1", label: "MONTH 1", name: "Technical Foundation", price: "$250",
    tasks: [
      { key: "m1-0", label: "Correct address confirmed with Marc (NAP baseline)" },
      { key: "m1-1", label: "Google Business Profile audit complete" },
      { key: "m1-2", label: "NAP inconsistency fixed across all directories" },
      { key: "m1-3", label: "Meta descriptions written + published (all pages)" },
      { key: "m1-4", label: "H1 structure fixed — one H1 per page, typo corrected" },
      { key: "m1-5", label: "LocalBusiness + FAQPage schema installed" },
      { key: "m1-6", label: "Broken countdown timer removed" },
      { key: "m1-7", label: "Dead internal links repaired" },
      { key: "m1-8", label: "GBP photos + categories optimized" },
      { key: "m1-9", label: "Month 1 SEO health report delivered" },
    ],
  },
  {
    id: "m2", label: "MONTH 2", name: "Authority Building", price: "$250",
    tasks: [
      { key: "m2-0", label: "Review generation templates created (email + text)" },
      { key: "m2-1", label: "First batch of review requests sent" },
      { key: "m2-2", label: "15 new Google reviews — goal tracking started" },
      { key: "m2-3", label: "Apple Maps listing submitted + verified" },
      { key: "m2-4", label: "Bing Places listing submitted" },
      { key: "m2-5", label: "BJJMetrics profile registered" },
      { key: "m2-6", label: "Foursquare + Alignable citations submitted" },
      { key: "m2-7", label: "Bullyproof, Combatives, Adult BJJ pages optimized" },
      { key: "m2-8", label: "Local blog post #1 published" },
      { key: "m2-9", label: "Keyword rankings baseline report delivered" },
    ],
  },
  {
    id: "m3", label: "MONTH 3", name: "Measure + Handoff", price: "$250",
    tasks: [
      { key: "m3-0", label: "Keyword ranking report — start vs. now" },
      { key: "m3-1", label: "GBP performance report (views, calls, directions)" },
      { key: "m3-2", label: "Second review request batch if needed" },
      { key: "m3-3", label: "Local blog post #2 published" },
      { key: "m3-4", label: "SEO maintenance checklist delivered to Marc" },
      { key: "m3-5", label: "Final handoff call completed" },
    ],
  },
];

/* ═══════════════════════════════════════
   DISCOVERY — MULTIPLE CHOICE QUESTIONS
   ═══════════════════════════════════════ */
const QUESTIONS = [
  {
    id: "address",
    section: "YOUR BUSINESS",
    label: "Which is the correct address for the gym?",
    type: "single",
    options: [
      "11220 Perrin Beitel Rd. Ste. 106, San Antonio TX 78217",
      "4141 Naco Perrin Blvd, San Antonio TX 78217",
      "Different from both — I'll clarify in the notes",
    ],
  },
  {
    id: "gbp_access",
    section: "YOUR BUSINESS",
    label: "What's your Google Business Profile access level?",
    hint: "This is the account that controls your Google Maps listing.",
    type: "single",
    options: [
      "Yes — I log in and manage it regularly",
      "I have credentials but rarely use it",
      "Not sure who manages it",
      "I don't have access to it",
    ],
  },
  {
    id: "website_platform",
    section: "YOUR WEBSITE",
    label: "What platform is your website built on?",
    type: "single",
    options: [
      "Not sure",
      "WordPress",
      "Wix",
      "Squarespace",
      "Custom / something else",
    ],
  },
  {
    id: "website_access",
    section: "YOUR WEBSITE",
    label: "Can you make changes to your website yourself?",
    type: "single",
    options: [
      "Yes — I can edit it anytime",
      "I have access but it's complicated",
      "No — I'd have to contact someone else",
      "I'm not sure",
    ],
  },
  {
    id: "priority_program",
    section: "YOUR PROGRAMS",
    label: "Which program do you most want to get leads from?",
    type: "single",
    options: [
      "Kids Bullyproof (ages 5–13)",
      "Gracie Combatives (adult beginners)",
      "Women's Self Defense",
      "Advanced / Master Cycle",
      "All programs equally",
    ],
  },
  {
    id: "ideal_student",
    section: "YOUR PROGRAMS",
    label: "Who is your ideal new student right now?",
    type: "single",
    options: [
      "Parents looking for kids martial arts",
      "Adults who want self-defense skills",
      "Women specifically",
      "Fitness-focused adults",
      "Mix of all the above",
    ],
  },
  {
    id: "current_leads",
    section: "CURRENT SITUATION",
    label: "How are most new students finding you today?",
    type: "single",
    options: [
      "Word of mouth / referrals mostly",
      "Some Google — but not enough",
      "Instagram or Facebook",
      "Walk-ins / drive-by",
      "Honestly not sure",
    ],
  },
  {
    id: "review_history",
    section: "CURRENT SITUATION",
    label: "Have you ever asked students to leave Google reviews?",
    type: "single",
    options: [
      "Never thought to ask",
      "Asked a few times informally",
      "Tried a process but it fell off",
      "We ask regularly — it just doesn't stick",
    ],
  },
  {
    id: "competitors",
    section: "CURRENT SITUATION",
    label: "Which competitors feel most visible to you in San Antonio?",
    hint: "Select all that apply.",
    type: "multi",
    options: [
      "Gracie Barra (franchise)",
      "Carlson Gracie SA",
      "Renzo Gracie SA",
      "Gracie NW San Antonio",
      "Others not listed here",
    ],
  },
  {
    id: "success",
    section: "GOALS",
    label: "What does success look like after 3 months?",
    type: "single",
    options: [
      "Showing up in Google's top 3 local results",
      "Noticeably more calls / trial signups from Google",
      "More reviews than the competitors",
      "All of the above",
      "Something more specific — I'll add a note",
    ],
  },
];

/* ═══════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════ */
function SectionDivider({ label }: { label: string }) {
  const { C } = useContext(ThemeCtx);
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 20, marginTop: 36 }}>
      <div style={{ fontSize: 10, fontWeight: 500, color: C.inkSubtle, letterSpacing: "0.6px", fontFamily: MONO, textTransform: "uppercase", flexShrink: 0 }}>{label}</div>
      <div style={{ flex: 1, height: 1, background: C.hairline }} />
    </div>
  );
}

/* ═══════════════════════════════════════
   TRACKER PAGE
   ═══════════════════════════════════════ */
function TrackerPage({ tasks, setTask }: any) {
  const { C } = useContext(ThemeCtx);
  const total = PHASES.flatMap(p => p.tasks).length;
  const done  = Object.values(tasks).filter(Boolean).length;
  const pct   = Math.round((done / total) * 100);

  return (
    <div className="page-content">
      <SectionDivider label="SEO Sprint Tracker" />

      {/* Progress bar */}
      <div style={{ marginBottom: 36 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
          <span style={{ fontSize: 12, color: C.inkSubtle, fontFamily: MONO }}>{done} / {total} tasks complete</span>
          <span style={{ fontSize: 12, fontWeight: 600, color: pct === 100 ? C.success : C.primary, fontFamily: MONO }}>{pct}%</span>
        </div>
        <div style={{ height: 3, background: C.surface3, borderRadius: 9999 }}>
          <div style={{ height: "100%", width: `${pct}%`, background: pct === 100 ? C.success : C.primary, borderRadius: 9999, transition: "width 0.4s ease" }} />
        </div>
      </div>

      {PHASES.map((phase, pi) => {
        const phaseDone  = phase.tasks.filter(t => tasks[t.key]).length;
        const isActive   = pi === 0;
        const isPending  = pi > 0 && phaseDone === 0;
        return (
          <div key={phase.id} style={{ marginBottom: 32, opacity: isPending ? 0.45 : 1 }}>
            {/* Phase header */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: "0.5px",
                padding: "2px 8px", borderRadius: 9999,
                background: isActive ? C.primary : C.surface3,
                color: isActive ? "#fff" : C.inkSubtle,
                fontFamily: MONO,
              }}>{phase.label}</span>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.ink, letterSpacing: "-0.3px" }}>{phase.name}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: C.primary, fontWeight: 500, fontFamily: MONO }}>{phase.price}</span>
              <span style={{ fontSize: 11, color: C.inkTertiary, fontFamily: MONO }}>{phaseDone}/{phase.tasks.length}</span>
            </div>

            {/* Tasks */}
            {phase.tasks.map(task => (
              <div
                key={task.key}
                onClick={() => setTask({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, taskKey: task.key, completed: !tasks[task.key] })}
                style={{
                  display: "flex", alignItems: "center", gap: 12, padding: "10px 14px",
                  marginBottom: 4, borderRadius: 8, cursor: "pointer",
                  background: tasks[task.key] ? "rgba(39,166,68,0.06)" : C.surface1,
                  border: `1px solid ${tasks[task.key] ? "rgba(39,166,68,0.2)" : C.hairline}`,
                  transition: "all 0.12s ease",
                }}
              >
                <div style={{
                  width: 15, height: 15, borderRadius: 4, flexShrink: 0,
                  background: tasks[task.key] ? C.success : "transparent",
                  border: `1.5px solid ${tasks[task.key] ? C.success : C.hairlineStrong}`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {tasks[task.key] && <span style={{ fontSize: 9, color: "#fff", fontWeight: 700, lineHeight: 1 }}>✓</span>}
                </div>
                <span style={{
                  fontSize: 13, color: tasks[task.key] ? C.inkSubtle : C.inkMuted,
                  textDecoration: tasks[task.key] ? "line-through" : "none",
                  letterSpacing: "-0.05px",
                }}>{task.label}</span>
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
  const { C } = useContext(ThemeCtx);
  const [plan, setPlan] = useState<"flat" | "monthly3" | "monthly4">("flat");

  const PLAN_OPTS: { id: "flat" | "monthly3" | "monthly4"; label: string }[] = [
    { id: "flat",     label: "$500 Flat"     },
    { id: "monthly3", label: "$200/mo × 3"   },
    { id: "monthly4", label: "$150/mo × 4"   },
  ];

  return (
    <div className="page-content">
      <SectionDivider label="Scope of Work" />

      {/* Plan toggle */}
      <div style={{ display: "inline-flex", background: C.surface2, border: `1px solid ${C.hairline}`, borderRadius: 9999, padding: 3, marginBottom: 28 }}>
        {PLAN_OPTS.map(opt => (
          <button
            key={opt.id}
            onClick={() => setPlan(opt.id)}
            style={{
              padding: "5px 16px", borderRadius: 9999, border: "none", cursor: "pointer",
              background: plan === opt.id ? C.surface3 : "transparent",
              color: plan === opt.id ? C.ink : C.inkSubtle,
              fontSize: 13, fontWeight: 500, fontFamily: FONT,
              transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Deal card */}
      <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: 24, marginBottom: 24 }}>
        <div style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
          {plan === "flat" && (
            <>
              <Stat label="UPFRONT" value="$500" accent />
              <Stat label="PAYMENTS" value="1" />
              <Stat label="TOTAL" value="$500" />
              <Stat label="BILLING" value="Paid upfront" />
            </>
          )}
          {plan === "monthly3" && (
            <>
              <Stat label="MONTH 1" value="$200" accent />
              <Stat label="MONTH 2" value="$200" />
              <Stat label="MONTH 3" value="$200" />
              <Stat label="TOTAL" value="$600" />
            </>
          )}
          {plan === "monthly4" && (
            <>
              <Stat label="MONTH 1" value="$150" accent />
              <Stat label="MONTH 2" value="$150" />
              <Stat label="MONTH 3" value="$150" />
              <Stat label="MONTH 4" value="$150" />
              <Stat label="TOTAL" value="$600" />
            </>
          )}
        </div>
        <div style={{ marginTop: 16, paddingTop: 16, borderTop: `1px solid ${C.hairline}`, fontSize: 12, color: C.inkSubtle, letterSpacing: "-0.05px" }}>
          {plan === "flat"
            ? <>One payment of <strong style={{ color: C.inkMuted }}>$500</strong> upfront — covers all three months. No invoices, no installments.</>
            : plan === "monthly3"
            ? <>$200 / month, billed at the start of each month. No lock-in after Month 3. Total: <strong style={{ color: C.inkMuted }}>$600</strong>.</>
            : <>$150 / month over 4 months. First invoice on signing, then monthly. Total: <strong style={{ color: C.inkMuted }}>$600</strong>.</>
          }
        </div>
      </div>

      {/* Month breakdowns */}
      {[
        {
          label: "Month 1 — Technical Foundation",
          items: [
            "Confirm correct address → fix NAP inconsistency across all directories",
            "Google Business Profile audit + full optimization (categories, photos, hours, description)",
            "Write + publish meta descriptions for every page on the site",
            "Fix heading structure — one H1 per page, homepage typo corrected",
            "Install LocalBusiness + FAQPage schema markup",
            "Remove dead countdown timer and broken internal links",
            "Deliverable: SEO health report with before/after screenshots",
          ],
        },
        {
          label: "Month 2 — Authority Building",
          items: [
            "Review generation campaign — email + text templates for Marc to send",
            "Target: 15 new Google reviews (tracked weekly)",
            "Submit to 6 directories: Apple Maps, Bing Places, BJJMetrics, Foursquare, Alignable, Hotfrog",
            "Optimize 3 program pages for search (Bullyproof, Combatives, Adult BJJ)",
            "Publish 1 local blog post targeting a high-intent search term",
            "Deliverable: directory submission report + keyword rankings baseline",
          ],
        },
        {
          label: "Month 3 — Measure + Handoff",
          items: [
            "Keyword ranking report — where you stood vs. where you rank now",
            "GBP insights report: views, calls, direction clicks before/after",
            "Second round of review requests if needed",
            "Publish 1 more local blog post",
            "SEO maintenance checklist for Marc or staff to maintain momentum",
            "Final handoff call — walk through everything",
          ],
        },
      ].map(section => (
        <div key={section.label} style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 500, color: C.inkSubtle, letterSpacing: "0.4px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 12 }}>{section.label}</div>
          {section.items.map((item, i) => (
            <div key={i} style={{ display: "flex", gap: 10, marginBottom: 7 }}>
              <div style={{ width: 4, height: 4, borderRadius: "50%", background: C.primary, marginTop: 7, flexShrink: 0 }} />
              <div style={{ fontSize: 13, color: C.inkMuted, lineHeight: 1.6, letterSpacing: "-0.05px" }}>{item}</div>
            </div>
          ))}
        </div>
      ))}

      {/* Audit findings table */}
      <SectionDivider label="What We Found — What We Fix" />
      <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, overflow: "hidden", marginBottom: 8 }}>
        {/* Table header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr 80px",
          padding: "9px 16px",
          background: C.surface2,
          borderBottom: `1px solid ${C.hairline}`,
        }}>
          {["Current weakness", "What we do", "Month"].map(h => (
            <div key={h} style={{ fontSize: 9, fontWeight: 500, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase" }}>{h}</div>
          ))}
        </div>
        {[
          {
            issue: "No meta descriptions on any page — Google auto-generates low-quality snippets",
            fix: "Write unique 150-char descriptions for every page targeting local keywords",
            month: 1, severity: "critical",
          },
          {
            issue: "10+ H1 tags on inner pages + homepage typo: \"San ANtonio's\"",
            fix: "Fix to one H1 per page, correct the typo",
            month: 1, severity: "critical",
          },
          {
            issue: "Zero schema markup — no rich results, no local business card in Google",
            fix: "Install LocalBusiness + FAQPage JSON-LD on homepage and program pages",
            month: 1, severity: "critical",
          },
          {
            issue: "NAP inconsistency — two different addresses across website vs. directories",
            fix: "Confirm correct address, standardize across every listing",
            month: 1, severity: "critical",
          },
          {
            issue: 'Broken countdown timer + dead "Learn More" link on homepage',
            fix: "Remove timer, wire or remove the broken link",
            month: 1, severity: "medium",
          },
          {
            issue: "Only 30 Google reviews vs. competitors with 88–189",
            fix: "Launch email + text review campaign — target 15 new reviews",
            month: 2, severity: "critical",
          },
          {
            issue: "Not listed on Apple Maps, Bing Places, BJJMetrics, Foursquare, Alignable",
            fix: "Submit to all 6 directories with correct NAP",
            month: 2, severity: "medium",
          },
          {
            issue: "Program pages (Bullyproof, Combatives, Adult BJJ) not optimized for search",
            fix: "Rewrite with local intent keywords, proper heading structure",
            month: 2, severity: "medium",
          },
          {
            issue: "No blog or educational content — zero traffic from informational searches",
            fix: "Publish 2 local posts targeting high-intent terms (e.g. \"bjj for kids san antonio\")",
            month: 2, severity: "medium",
          },
          {
            issue: "No keyword baseline — can't prove ROI without a starting point",
            fix: "Pull rankings report before and after — documented proof of movement",
            month: 3, severity: "medium",
          },
        ].map((row, i) => (
          <div
            key={i}
            style={{
              display: "grid", gridTemplateColumns: "1fr 1fr 80px",
              padding: "11px 16px",
              borderBottom: i < 9 ? `1px solid ${C.hairline}` : "none",
              alignItems: "start",
            }}
          >
            {/* Issue */}
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start", paddingRight: 12 }}>
              <div style={{
                marginTop: 3, width: 6, height: 6, borderRadius: "50%", flexShrink: 0,
                background: row.severity === "critical" ? "#e5484d" : "#f76b15",
              }} />
              <span style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.55, letterSpacing: "-0.05px" }}>{row.issue}</span>
            </div>
            {/* Fix */}
            <div style={{ fontSize: 12, color: C.inkSubtle, lineHeight: 1.55, letterSpacing: "-0.05px", paddingRight: 12 }}>{row.fix}</div>
            {/* Month badge */}
            <div>
              <span style={{
                fontSize: 10, fontWeight: 500, letterSpacing: "0.3px",
                padding: "2px 8px", borderRadius: 9999, fontFamily: MONO,
                background: row.month === 1 ? `rgba(94,106,210,0.12)` : row.month === 2 ? `rgba(247,107,21,0.1)` : `rgba(39,166,68,0.1)`,
                color: row.month === 1 ? C.primary : row.month === 2 ? "#f76b15" : C.success,
              }}>M{row.month}</span>
            </div>
          </div>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: "flex", gap: 16, marginBottom: 32, paddingLeft: 4 }}>
        {[["#e5484d", "Critical"], ["#f76b15", "Moderate"]].map(([color, label]) => (
          <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: color }} />
            <span style={{ fontSize: 10, color: C.inkTertiary, fontFamily: MONO }}>{label}</span>
          </div>
        ))}
      </div>

      <SectionDivider label="Terms" />
      <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: 20, fontSize: 13, color: C.inkSubtle, lineHeight: 1.7, letterSpacing: "-0.05px" }}>
        {plan === "flat"
          ? <><strong style={{ color: C.ink }}>$500 paid upfront</strong> at signing — no invoices, no installments. No automatic renewal.</>
          : plan === "monthly3"
          ? <>Three monthly invoices of <strong style={{ color: C.ink }}>$200</strong>. First invoice on signing, Month 2 and 3 billed at the start of each month. No lock-in after Month 3.</>
          : <>Four monthly invoices of <strong style={{ color: C.ink }}>$150</strong>. First invoice on signing, Months 2–4 billed at the start of each month. No lock-in after Month 4.</>
        }
        {" "}<br /><br />
        All work performed by <strong style={{ color: C.ink }}>Anthony Tatis</strong> directly. No outsourced labor.
      </div>
    </div>
  );
}

function Stat({ label, value, accent }: { label: string; value: string; accent?: boolean }) {
  const { C } = useContext(ThemeCtx);
  return (
    <div>
      <div style={{ fontSize: 9, fontWeight: 500, color: C.inkSubtle, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 4 }}>{label}</div>
      <div style={{ fontSize: 22, fontWeight: 600, color: accent ? C.primary : C.ink, letterSpacing: "-0.5px" }}>{value}</div>
    </div>
  );
}

/* ═══════════════════════════════════════
   CREDENTIAL FIELD DEFINITIONS
   ═══════════════════════════════════════ */
const CRED_SECTIONS = [
  {
    id: "gbp",
    title: "GOOGLE BUSINESS PROFILE",
    note: "Add tatis.anthony@gmail.com as a Manager on your GBP — no passwords needed.",
    link: { label: "Open GBP Users Settings ↗", url: "https://business.google.com/u/0/manage/#/settings/users" },
    instructions: [
      "1. Click the link above to open your GBP Users settings",
      '2. Click "Add users"',
      "3. Enter tatis.anthony@gmail.com",
      "4. Set role to Manager",
      "5. Click Invite — then check the box below",
    ],
    fields: [
      { id: "gbp_invited", label: "I've added tatis.anthony@gmail.com as a GBP Manager", type: "confirm", placeholder: "" },
    ],
  },
  {
    id: "gymdesk",
    title: "WEBSITE — GYMDESK",
    note: "Preferred: GymDesk Settings → Staff → invite tatis.anthony@gmail.com as Admin.",
    fields: [
      { id: "gymdesk_email",    label: "GymDesk login email",    type: "text",     placeholder: "login@email.com" },
      { id: "gymdesk_password", label: "GymDesk login password", type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "domain",
    title: "DOMAIN REGISTRAR",
    note: "Who manages graciejiujitsusanantonio.com? Login gives us DNS access if needed.",
    fields: [
      { id: "domain_registrar", label: "Registrar (GoDaddy, Namecheap, etc.)", type: "text", placeholder: "e.g. GoDaddy" },
      { id: "domain_email",     label: "Registrar login email",                type: "text",     placeholder: "login@email.com" },
      { id: "domain_password",  label: "Registrar password",                   type: "password", placeholder: "••••••••" },
    ],
  },
  {
    id: "other",
    title: "OTHER NOTES",
    note: "Anything else we should know — additional accounts, 2FA info, etc.",
    fields: [
      { id: "access_notes", label: "Notes", type: "textarea", placeholder: "e.g. GBP has 2FA, text code to (210) 879-2318" },
    ],
  },
];

/* ═══════════════════════════════════════
   DISCOVERY PAGE — MULTIPLE CHOICE
   ═══════════════════════════════════════ */
function DiscoveryPage({ isOps, onGoToAgreement }: { isOps: boolean; onGoToAgreement: () => void }) {
  const { C } = useContext(ThemeCtx);
  const existing      = useQuery(api.discovery.getDiscovery, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const saveDiscovery = useMutation(api.discovery.saveDiscovery);
  const credExisting  = useQuery(api.credentials.getCredentials, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const saveCredMut   = useMutation(api.credentials.saveCredentials);

  const [answers, setAnswers]     = useState<Record<string, string | string[]>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving]       = useState(false);
  const [credData, setCredData]   = useState<Record<string, string>>({});
  const [credSaving, setCredSaving] = useState(false);
  const [credSaved, setCredSaved]   = useState(false);
  const [showPass, setShowPass]     = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (existing?.responses) {
      try { setAnswers(JSON.parse(existing.responses)); setSubmitted(true); } catch {}
    }
  }, [existing]);

  useEffect(() => {
    if (credExisting?.data) {
      try { setCredData(JSON.parse(credExisting.data)); setCredSaved(true); } catch {}
    }
  }, [credExisting]);

  const select = (id: string, option: string, type: "single" | "multi") => {
    if (isOps) return;
    if (type === "single") {
      setAnswers(prev => ({ ...prev, [id]: option }));
    } else {
      setAnswers(prev => {
        const cur = (prev[id] as string[]) || [];
        return { ...prev, [id]: cur.includes(option) ? cur.filter(o => o !== option) : [...cur, option] };
      });
    }
  };

  const isSelected = (id: string, option: string) => {
    const val = answers[id];
    if (Array.isArray(val)) return val.includes(option);
    return val === option;
  };

  const handleSubmit = async () => {
    setSaving(true);
    await saveDiscovery({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, responses: JSON.stringify(answers) });
    setSaving(false);
    setSubmitted(true);
  };

  const handleSaveCreds = async () => {
    setCredSaving(true);
    await saveCredMut({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, data: JSON.stringify(credData) });
    setCredSaving(false);
    setCredSaved(true);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${C.hairline}`, background: C.surface2,
    color: C.ink, fontSize: 13, fontFamily: FONT,
    outline: "none", boxSizing: "border-box",
  };

  /* ── Submitted view: PDF summary + credential form ── */
  if (submitted) {
    return (
      <div className="page-content">
        {/* PDF SUMMARY — pinned at top */}
        <div style={{
          background: C.surface1, border: `1px solid ${C.hairline}`,
          borderRadius: 12, overflow: "hidden", marginBottom: 32,
        }} className="no-print-border">
          {/* Header row */}
          <div style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "14px 20px", borderBottom: `1px solid ${C.hairline}`,
            background: C.surface2,
          }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 3 }}>Onboarding Summary</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, letterSpacing: "-0.2px" }}>Marc Torres — Discovery Responses</div>
            </div>
            <button
              onClick={() => window.print()}
              style={{
                padding: "6px 14px", background: C.surface3, color: C.inkMuted,
                border: `1px solid ${C.hairline}`, borderRadius: 7, fontSize: 12,
                cursor: "pointer", fontFamily: FONT, letterSpacing: "-0.1px",
              }}
            >
              Save as PDF ↓
            </button>
          </div>
          {/* Q&A pairs */}
          <div style={{ padding: "16px 20px 8px" }} className="print-section">
            {QUESTIONS.map((q, i) => {
              const val = answers[q.id];
              const display = Array.isArray(val) ? val.join(", ") : (val || "—");
              return (
                <div key={q.id} style={{
                  display: "flex", gap: 16, padding: "10px 0",
                  borderBottom: i < QUESTIONS.length - 1 ? `1px solid ${C.hairline}` : "none",
                  alignItems: "flex-start",
                }}>
                  <div style={{ fontSize: 11, color: C.inkTertiary, fontFamily: MONO, flexShrink: 0, width: 22, paddingTop: 1 }}>
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, color: C.inkSubtle, marginBottom: 3, letterSpacing: "-0.05px" }}>{q.label}</div>
                    <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, letterSpacing: "-0.1px" }}>{display}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ACCOUNT ACCESS SECTION */}
        <SectionDivider label="Account Access" />
        <p style={{ fontSize: 13, color: C.inkSubtle, marginBottom: 24, lineHeight: 1.6, letterSpacing: "-0.05px" }}>
          {isOps
            ? "Account credentials for Marc Torres."
            : "To get started, we need access to your accounts so we can make changes directly on your behalf. All credentials are stored securely in your private hub."}
        </p>

        {CRED_SECTIONS.map(section => (
          <div key={section.id} style={{ marginBottom: 28 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.inkSubtle, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 4 }}>{section.title}</div>
            {section.note && (
              <div style={{ fontSize: 12, color: C.inkTertiary, marginBottom: 10, letterSpacing: "-0.05px" }}>{section.note}</div>
            )}
            {section.link && (
              <a href={section.link.url} target="_blank" rel="noopener noreferrer"
                style={{ display: "inline-block", fontSize: 12, color: C.primary, marginBottom: 10, letterSpacing: "-0.05px", textDecoration: "none" }}>
                {section.link.label}
              </a>
            )}
            {"instructions" in section && section.instructions && !isOps && (
              <div style={{ background: C.surface2, border: `1px solid ${C.hairline}`, borderRadius: 8, padding: "12px 14px", marginBottom: 12 }}>
                {(section.instructions as string[]).map((step, i) => (
                  <div key={i} style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.7, letterSpacing: "-0.05px" }}>{step}</div>
                ))}
              </div>
            )}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {section.fields.map(field => (
                <div key={field.id}>
                  {field.type === "confirm" ? (
                    <div
                      onClick={() => !isOps && setCredData(p => ({ ...p, [field.id]: p[field.id] === "true" ? "" : "true" }))}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderRadius: 8, cursor: isOps ? "default" : "pointer",
                        background: credData[field.id] === "true" ? "rgba(39,166,68,0.06)" : C.surface1,
                        border: `1px solid ${credData[field.id] === "true" ? "rgba(39,166,68,0.3)" : C.hairline}`,
                        transition: "all 0.12s",
                      }}
                    >
                      <div style={{
                        width: 16, height: 16, borderRadius: 4, flexShrink: 0,
                        background: credData[field.id] === "true" ? C.success : "transparent",
                        border: `1.5px solid ${credData[field.id] === "true" ? C.success : C.hairlineStrong}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        {credData[field.id] === "true" && <span style={{ fontSize: 9, color: "#fff", fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13, color: credData[field.id] === "true" ? C.ink : C.inkMuted, letterSpacing: "-0.05px" }}>{field.label}</span>
                    </div>
                  ) : field.type === "textarea" ? (
                    <>
                      <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 5, letterSpacing: "-0.05px" }}>{field.label}</div>
                      <textarea
                        value={credData[field.id] || ""}
                        onChange={e => !isOps && setCredData(p => ({ ...p, [field.id]: e.target.value }))}
                        placeholder={isOps ? "" : field.placeholder}
                        readOnly={isOps}
                        rows={3}
                        style={{ ...inputStyle, resize: "vertical" as const }}
                      />
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 5, letterSpacing: "-0.05px" }}>{field.label}</div>
                      <div style={{ position: "relative" }}>
                        <input
                          type={field.type === "password" && !showPass[field.id] ? "password" : "text"}
                          value={isOps && field.type === "password" && credData[field.id]
                            ? (showPass[field.id] ? credData[field.id] : "••••••••")
                            : (credData[field.id] || "")}
                          onChange={e => !isOps && setCredData(p => ({ ...p, [field.id]: e.target.value }))}
                          placeholder={isOps ? "—" : field.placeholder}
                          readOnly={isOps && !showPass[field.id]}
                          style={{ ...inputStyle, paddingRight: field.type === "password" ? 44 : 12 }}
                        />
                        {field.type === "password" && credData[field.id] && (
                          <button
                            onClick={() => setShowPass(p => ({ ...p, [field.id]: !p[field.id] }))}
                            style={{
                              position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                              background: "none", border: "none", cursor: "pointer",
                              color: C.inkTertiary, fontSize: 11, fontFamily: MONO, padding: 0,
                            }}
                          >
                            {showPass[field.id] ? "hide" : "show"}
                          </button>
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}

        {!isOps && (
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 8 }}>
            <button
              onClick={handleSaveCreds}
              disabled={credSaving}
              style={{
                padding: "9px 20px", background: credSaving ? C.surface2 : C.primary,
                color: credSaving ? C.inkSubtle : "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: credSaving ? "default" : "pointer", fontFamily: FONT,
                letterSpacing: "-0.1px", transition: "background 0.15s",
              }}
            >
              {credSaving ? "Saving…" : credSaved ? "Update credentials" : "Save credentials"}
            </button>
            {credSaved && <span style={{ fontSize: 12, color: C.success }}>✓ Saved</span>}
          </div>
        )}

        {!isOps && (
          <div style={{ marginTop: 28, paddingTop: 20, borderTop: `1px solid ${C.hairline}` }}>
            <button
              onClick={() => onGoToAgreement()}
              style={{
                padding: "9px 20px", background: C.primary, color: "#fff",
                border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
                cursor: "pointer", fontFamily: FONT, letterSpacing: "-0.1px",
              }}
            >
              Go to Agreement →
            </button>
          </div>
        )}
      </div>
    );
  }

  let lastSection = "";
  return (
    <div className="page-content">
      <SectionDivider label="Onboarding" />
      <p style={{ fontSize: 13, color: C.inkSubtle, marginBottom: 32, lineHeight: 1.6, letterSpacing: "-0.05px" }}>
        {isOps ? "Onboarding responses from Marc Torres." : "Quick answers to get Month 1 started — tap to select. Takes about 3 minutes."}
      </p>

      {QUESTIONS.map((q, qi) => {
        const showSection = q.section !== lastSection;
        if (showSection) lastSection = q.section;
        return (
          <div key={q.id}>
            {showSection && <SectionDivider label={q.section} />}
            <div style={{ marginBottom: 28 }}>
              {/* Question */}
              <div style={{ fontSize: 14, fontWeight: 500, color: C.ink, letterSpacing: "-0.2px", marginBottom: q.hint ? 4 : 12 }}>
                <span style={{ fontSize: 11, color: C.inkTertiary, fontFamily: MONO, marginRight: 8 }}>{String(qi + 1).padStart(2, "0")}</span>
                {q.label}
              </div>
              {q.hint && (
                <div style={{ fontSize: 12, color: C.inkTertiary, marginBottom: 12, letterSpacing: "-0.05px" }}>{q.hint}</div>
              )}
              {/* Options */}
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {q.options.map(opt => {
                  const sel = isSelected(q.id, opt);
                  return (
                    <div
                      key={opt}
                      onClick={() => select(q.id, opt, q.type as "single" | "multi")}
                      style={{
                        display: "flex", alignItems: "center", gap: 12,
                        padding: "10px 14px", borderRadius: 8,
                        background: sel ? "rgba(94,106,210,0.08)" : C.surface1,
                        border: `1px solid ${sel ? C.primary : C.hairline}`,
                        cursor: isOps ? "default" : "pointer",
                        transition: "all 0.12s ease",
                      }}
                    >
                      {/* Indicator */}
                      <div style={{
                        width: 15, height: 15, flexShrink: 0,
                        borderRadius: q.type === "multi" ? 4 : "50%",
                        border: `1.5px solid ${sel ? C.primary : C.hairlineStrong}`,
                        background: sel ? C.primary : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        transition: "all 0.12s",
                      }}>
                        {sel && <span style={{ fontSize: 8, color: "#fff", fontWeight: 800, lineHeight: 1 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 13, color: sel ? C.ink : C.inkMuted, letterSpacing: "-0.05px" }}>{opt}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })}

      {!isOps && (
        <button
          onClick={handleSubmit}
          disabled={saving}
          style={{
            marginTop: 8, padding: "9px 20px",
            background: saving ? C.surface2 : C.primary,
            color: saving ? C.inkSubtle : "#fff",
            border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
            cursor: saving ? "default" : "pointer", fontFamily: FONT,
            letterSpacing: "-0.1px", transition: "background 0.15s",
          }}
        >
          {saving ? "Saving…" : "Submit answers"}
        </button>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE
   ═══════════════════════════════════════ */
function AgreementPage() {
  const { C } = useContext(ThemeCtx);
  const existing     = useQuery(api.agreements.getAgreement, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const saveAgreement = useMutation(api.agreements.saveAgreement);
  const discoveryData = useQuery(api.discovery.getDiscovery, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing]   = useState(false);
  const [hasSig, setHasSig]     = useState(false);
  const [saved, setSaved]       = useState(false);
  const [saving, setSaving]     = useState(false);

  const planPref = "monthly3" as "flat" | "monthly3" | "monthly4";
  const invoice = { amount: "$200.00", desc: "Month 1 — Technical Foundation", number: "MT-2026-001", terms: "Due on receipt" };

  useEffect(() => { if (existing) setSaved(true); }, [existing]);

  // Attach non-passive touch listeners so preventDefault() actually blocks scroll
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const onTouchStart = (e: TouchEvent) => { e.preventDefault(); setDrawing(true); const ctx = canvas.getContext("2d"); if (!ctx) return; const rect = canvas.getBoundingClientRect(); const x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width); const y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height); ctx.beginPath(); ctx.moveTo(x, y); };
    const onTouchMove = (e: TouchEvent) => { e.preventDefault(); setDrawing(prev => { if (!prev) return prev; const ctx = canvas.getContext("2d"); if (!ctx) return prev; const rect = canvas.getBoundingClientRect(); const x = (e.touches[0].clientX - rect.left) * (canvas.width / rect.width); const y = (e.touches[0].clientY - rect.top) * (canvas.height / rect.height); ctx.lineWidth = 1.5; ctx.strokeStyle = "#f7f8f8"; ctx.lineTo(x, y); ctx.stroke(); setHasSig(true); return prev; }); };
    const onTouchEnd = (e: TouchEvent) => { e.preventDefault(); setDrawing(false); };
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove",  onTouchMove,  { passive: false });
    canvas.addEventListener("touchend",   onTouchEnd,   { passive: false });
    return () => { canvas.removeEventListener("touchstart", onTouchStart); canvas.removeEventListener("touchmove", onTouchMove); canvas.removeEventListener("touchend", onTouchEnd); };
  }, []);

  const getPos = (e: any, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return { x: (cx - rect.left) * (canvas.width / rect.width), y: (cy - rect.top) * (canvas.height / rect.height) };
  };
  const startDraw = (e: any) => {
    if (e.touches) e.preventDefault();
    setDrawing(true);
    const c = canvasRef.current; const ctx = c?.getContext("2d");
    if (!ctx || !c) return;
    const { x, y } = getPos(e, c); ctx.beginPath(); ctx.moveTo(x, y);
  };
  const draw = (e: any) => {
    if (!drawing) return;
    if (e.touches) e.preventDefault();
    const c = canvasRef.current; const ctx = c?.getContext("2d");
    if (!ctx || !c) return;
    const { x, y } = getPos(e, c);
    ctx.lineWidth = 1.5; ctx.strokeStyle = C.ink; ctx.lineTo(x, y); ctx.stroke(); // C.ink from closure — AgreementPage reads from context above
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
    await saveAgreement({ clientSlug: CLIENT_SLUG, projectId: PROJECT_ID, sigData: canvasRef.current!.toDataURL(), signedDate: new Date().toLocaleDateString(), invoiceNumber: invoice.number });
    setSaving(false); setSaved(true);
  };

  if (saved) {
    return (
      <div className="page-content">
        {/* Signed banner */}
        <SectionDivider label="Agreement" />
        <div style={{ background: C.surface1, border: "1px solid rgba(39,166,68,0.2)", borderRadius: 12, padding: 20, marginBottom: 28, display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "rgba(39,166,68,0.1)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: C.success, fontSize: 16, fontWeight: 700 }}>✓</span>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 2 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: C.ink, letterSpacing: "-0.2px" }}>Agreement Signed</div>
              {existing?.paymentStatus === "paid" && (
                <div style={{
                  display: "inline-flex", alignItems: "center", gap: 5,
                  padding: "2px 9px", borderRadius: 9999,
                  background: "rgba(39,166,68,0.12)", border: "1px solid rgba(39,166,68,0.25)",
                }}>
                  <span style={{ fontSize: 9, color: C.success, fontWeight: 800 }}>✓</span>
                  <span style={{ fontSize: 10, fontWeight: 600, color: C.success, fontFamily: MONO, letterSpacing: "0.4px", textTransform: "uppercase" }}>Paid</span>
                </div>
              )}
            </div>
            <div style={{ fontSize: 12, color: C.inkSubtle }}>Signed {existing?.signedDate} · Invoice #{existing?.invoiceNumber}</div>
          </div>
        </div>

        {/* Invoice document */}
        <SectionDivider label="Invoice" />
        <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, overflow: "hidden" }}>
          {/* Invoice header */}
          <div style={{ padding: "24px 24px 20px", borderBottom: `1px solid ${C.hairline}`, display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ fontSize: 11, fontWeight: 500, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 6 }}>Invoice</div>
              <div style={{ fontSize: 22, fontWeight: 700, color: C.ink, letterSpacing: "-0.5px" }}>{invoice.number}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: C.ink }}>Twanii / Anthony Tatis</div>
              <div style={{ fontSize: 12, color: C.inkSubtle, marginTop: 2 }}>anthony@twanii.com</div>
              <div style={{ fontSize: 12, color: C.inkSubtle }}>San Antonio, TX</div>
            </div>
          </div>

          {/* Bill to + dates */}
          <div style={{ padding: "20px 24px", borderBottom: `1px solid ${C.hairline}`, display: "flex", gap: 40, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 9, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 6 }}>Bill To</div>
              <div style={{ fontSize: 13, fontWeight: 500, color: C.ink }}>Marc Torres</div>
              <div style={{ fontSize: 12, color: C.inkSubtle }}>Gracie Jiu-Jitsu San Antonio</div>
              <div style={{ fontSize: 12, color: C.inkSubtle }}>210jiujitsu@gmail.com</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 6 }}>Date</div>
              <div style={{ fontSize: 13, color: C.ink }}>{existing?.signedDate}</div>
            </div>
            <div>
              <div style={{ fontSize: 9, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 6 }}>Terms</div>
              <div style={{ fontSize: 13, color: C.ink }}>{invoice.terms}</div>
            </div>
          </div>

          {/* Line items */}
          <div style={{ borderBottom: `1px solid ${C.hairline}` }}>
            <div style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "10px 24px", background: C.surface2 }}>
              <div style={{ fontSize: 9, fontWeight: 500, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase" }}>Description</div>
              <div style={{ fontSize: 9, fontWeight: 500, color: C.inkTertiary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase" }}>Amount</div>
            </div>
            {[
              { desc: "Month 1 — Technical Foundation", sub: "NAP fix, GBP optimization, meta descriptions, schema markup, broken links", amount: "$200.00" },
              { desc: "Month 2 — Authority Building", sub: "Review campaign, 6 directory submissions, program page optimization, blog post", amount: "Billed month 2" },
              { desc: "Month 3 — Measure + Handoff", sub: "Ranking report, GBP insights, 2nd review batch, blog post #2, handoff call", amount: "Billed month 3" },
            ].map((row, i) => (
              <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr auto", padding: "14px 24px", borderTop: i > 0 ? `1px solid ${C.hairline}` : "none", alignItems: "start" }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 3 }}>{row.desc}</div>
                  <div style={{ fontSize: 11, color: C.inkSubtle }}>{row.sub}</div>
                </div>
                <div style={{ fontSize: 13, fontWeight: i === 0 ? 600 : 400, color: i === 0 ? C.ink : C.inkTertiary, fontFamily: MONO, whiteSpace: "nowrap", paddingLeft: 24 }}>{row.amount}</div>
              </div>
            ))}
          </div>

          {/* Total */}
          <div style={{ padding: "16px 24px", display: "flex", justifyContent: "flex-end", alignItems: "center", gap: 20 }}>
            {existing?.paymentStatus === "paid" && (
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                padding: "4px 12px", borderRadius: 9999,
                background: "rgba(39,166,68,0.1)", border: "1px solid rgba(39,166,68,0.25)",
              }}>
                <span style={{ fontSize: 11, color: C.success, fontWeight: 700 }}>✓</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: C.success, fontFamily: MONO, letterSpacing: "0.3px", textTransform: "uppercase" }}>Paid</span>
              </div>
            )}
            <div style={{ display: "flex", gap: 40, alignItems: "baseline" }}>
              <div style={{ fontSize: 11, color: C.inkSubtle, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                {existing?.paymentStatus === "paid" ? "Amount" : "Due now"}
              </div>
              <div style={{ fontSize: 26, fontWeight: 700, color: existing?.paymentStatus === "paid" ? C.success : C.primary, letterSpacing: "-0.5px" }}>$200.00</div>
            </div>
          </div>
        </div>

        {/* Pay now CTA or Paid confirmation */}
        <div style={{ marginTop: 20, display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
          {existing?.paymentStatus === "paid" ? (
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 10,
              padding: "10px 20px",
              background: "rgba(39,166,68,0.08)", border: "1px solid rgba(39,166,68,0.2)",
              borderRadius: 8,
            }}>
              <span style={{ fontSize: 15, color: C.success }}>✓</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.success, letterSpacing: "-0.1px" }}>Payment received</div>
                <div style={{ fontSize: 11, color: C.inkSubtle, marginTop: 1 }}>
                  {existing?.paidAt ? new Date(existing.paidAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }) : "Paid"} · $200.00
                </div>
              </div>
            </div>
          ) : (
            <a
              href="https://invoice.stripe.com/i/acct_1T4NzfPhBvpkIVx0/live_YWNjdF8xVDROemZQaEJ2cGtJVngwLF9VZTFYSElhRk0yRll6ZlN3SXUyYjk4TGJjcDhHTWpCLDE3MTE1MjA1MQ0200CRQampFT?s=ap"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "10px 20px", background: C.primary, color: "#fff",
                borderRadius: 8, fontSize: 13, fontWeight: 600,
                textDecoration: "none", letterSpacing: "-0.1px",
                fontFamily: FONT,
              }}
            >
              Pay $200.00 →
            </a>
          )}
          {existing?.paymentStatus !== "paid" && (
            <div style={{ fontSize: 12, color: C.inkSubtle }}>
              Invoice also sent to <strong style={{ color: C.inkMuted }}>210jiujitsu@gmail.com</strong>
            </div>
          )}
        </div>
        <div style={{ marginTop: 10, fontSize: 11, color: C.inkTertiary, paddingLeft: 4 }}>
          Months 2 and 3 invoiced at the start of each month.
        </div>
      </div>
    );
  }

  return (
    <div className="page-content">
      <SectionDivider label="Agreement" />

      {/* Terms */}
      <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: 20, marginBottom: 20, fontSize: 13, color: C.inkSubtle, lineHeight: 1.8, letterSpacing: "-0.05px" }}>
        By signing below, <strong style={{ color: C.ink }}>Marc Torres</strong> agrees to engage{" "}
        <strong style={{ color: C.ink }}>Twanii (Anthony Tatis)</strong> for a 3-month SEO sprint on{" "}
        <strong style={{ color: C.ink }}>graciejiujitsusanantonio.com</strong>:
        <ul style={{ marginTop: 10, paddingLeft: 18 }}>
          {planPref === "flat" ? (
            <li><strong style={{ color: C.primary }}>$500 upfront</strong> — paid at signing, covers all three months. No installments.</li>
          ) : planPref === "monthly3" ? (
            <>
              <li>Month 1: <strong style={{ color: C.ink }}>$200</strong> — due on signing</li>
              <li>Month 2: <strong style={{ color: C.ink }}>$200</strong> — invoiced at month start</li>
              <li>Month 3: <strong style={{ color: C.ink }}>$200</strong> — invoiced at month start</li>
            </>
          ) : (
            <>
              <li>Month 1: <strong style={{ color: C.ink }}>$150</strong> — due on signing</li>
              <li>Month 2: <strong style={{ color: C.ink }}>$150</strong> — invoiced at month start</li>
              <li>Month 3: <strong style={{ color: C.ink }}>$150</strong> — invoiced at month start</li>
              <li>Month 4: <strong style={{ color: C.ink }}>$150</strong> — invoiced at month start</li>
            </>
          )}
          <li>No automatic renewal after Month 3.</li>
          <li>All work performed directly by Anthony Tatis.</li>
        </ul>
      </div>

      {/* Invoice preview */}
      <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, padding: "14px 20px", marginBottom: 24, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 3, height: 36, background: C.primary, borderRadius: 2 }} />
          <div>
            <div style={{ fontSize: 9, color: C.inkSubtle, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase" }}>
              {planPref === "flat" ? "Invoice on signing" : "First invoice on signing"}
            </div>

            <div style={{ fontSize: 20, fontWeight: 600, color: C.ink, letterSpacing: "-0.4px", marginTop: 2 }}>
              {invoice.amount} <span style={{ fontSize: 11, color: C.inkSubtle, fontWeight: 400 }}>{invoice.terms}</span>
            </div>
          </div>
        </div>
        <div style={{ fontSize: 10, color: C.inkTertiary, fontFamily: MONO }}>#{invoice.number}</div>
      </div>

      {/* Signature */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 11, color: C.inkSubtle, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 8 }}>Sign below</div>
        <canvas
          ref={canvasRef} width={560} height={110}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw}
          style={{ background: C.surface2, borderRadius: 8, border: `1px solid ${C.hairline}`, cursor: "crosshair", display: "block", width: "100%", maxWidth: 560, touchAction: "none" }}
        />
        <button onClick={clearSig} style={{ marginTop: 6, background: "transparent", border: `1px solid ${C.hairline}`, color: C.inkSubtle, padding: "4px 12px", fontSize: 11, cursor: "pointer", borderRadius: 6, fontFamily: FONT }}>
          Clear
        </button>
      </div>

      <button
        onClick={handleSign} disabled={!hasSig || saving}
        style={{
          padding: "9px 20px",
          background: hasSig && !saving ? C.primary : C.surface2,
          color: hasSig && !saving ? "#fff" : C.inkSubtle,
          border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
          cursor: hasSig && !saving ? "pointer" : "default", fontFamily: FONT,
          letterSpacing: "-0.1px", transition: "background 0.15s",
        }}
      >
        {saving ? "Saving…" : "Sign & confirm"}
      </button>
    </div>
  );
}

/* ═══════════════════════════════════════
   PDF GENERATOR UTILITY
   ═══════════════════════════════════════ */
function generatePdf(title: string, content: string, filename: string) {
  const doc = new jsPDF({ unit: "pt", format: "letter" });
  const pageW = doc.internal.pageSize.getWidth();
  const pageH = doc.internal.pageSize.getHeight();
  const margin = 56;
  const maxWidth = pageW - margin * 2;
  let y = margin;

  // Header bar
  doc.setFillColor(94, 106, 210);
  doc.rect(0, 0, pageW, 44, "F");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(255, 255, 255);
  doc.text("Gracie Jiu-Jitsu San Antonio — SEO Sprint", margin, 27);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(200, 210, 255);
  doc.text("Prepared by Anthony Tatis · Twanii", pageW - margin, 27, { align: "right" });

  y = 72;

  // Title
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(15, 15, 16);
  const titleLines = doc.splitTextToSize(title, maxWidth);
  doc.text(titleLines, margin, y);
  y += titleLines.length * 26 + 6;

  // Date line
  doc.setFont("helvetica", "normal");
  doc.setFontSize(9);
  doc.setTextColor(140, 145, 152);
  doc.text(`Generated ${new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`, margin, y);
  y += 20;

  // Divider
  doc.setDrawColor(225, 227, 232);
  doc.setLineWidth(0.5);
  doc.line(margin, y, pageW - margin, y);
  y += 20;

  // Content — parse lines, handle headers and bullets
  const lines = content.split("\n");
  for (const rawLine of lines) {
    const line = rawLine.trimEnd();

    if (y > pageH - margin) {
      doc.addPage();
      y = margin + 20;
    }

    if (line.startsWith("## ")) {
      y += 8;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(15, 15, 16);
      const h2 = doc.splitTextToSize(line.replace(/^## /, ""), maxWidth);
      doc.text(h2, margin, y);
      y += h2.length * 18 + 4;
      doc.setDrawColor(225, 227, 232);
      doc.line(margin, y, pageW - margin, y);
      y += 10;
    } else if (line.startsWith("# ")) {
      y += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(15);
      doc.setTextColor(94, 106, 210);
      const h1 = doc.splitTextToSize(line.replace(/^# /, ""), maxWidth);
      doc.text(h1, margin, y);
      y += h1.length * 20 + 6;
    } else if (line.startsWith("- ") || line.startsWith("• ")) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 63, 71);
      const bullet = doc.splitTextToSize(line.replace(/^[-•] /, ""), maxWidth - 16);
      doc.text("•", margin, y);
      doc.text(bullet, margin + 14, y);
      y += bullet.length * 14 + 3;
    } else if (line.startsWith("**") && line.endsWith("**")) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(15, 15, 16);
      const bold = doc.splitTextToSize(line.replace(/\*\*/g, ""), maxWidth);
      doc.text(bold, margin, y);
      y += bold.length * 14 + 3;
    } else if (line === "" || line === "---") {
      y += line === "---" ? 12 : 6;
    } else {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      doc.setTextColor(60, 63, 71);
      const wrapped = doc.splitTextToSize(line, maxWidth);
      doc.text(wrapped, margin, y);
      y += wrapped.length * 14 + 3;
    }
  }

  // Footer on every page
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(154, 153, 163);
    doc.text(`Page ${p} of ${totalPages}`, pageW - margin, pageH - 24, { align: "right" });
    doc.text("Twanii · twanii.com · Confidential", margin, pageH - 24);
  }

  doc.save(filename);
}

/* ═══════════════════════════════════════
   GBP ASSETS PAGE — Photos + Hours
   ═══════════════════════════════════════ */
const DAYS = [
  { key: "mon", label: "Monday"    },
  { key: "tue", label: "Tuesday"   },
  { key: "wed", label: "Wednesday" },
  { key: "thu", label: "Thursday"  },
  { key: "fri", label: "Friday"    },
  { key: "sat", label: "Saturday"  },
  { key: "sun", label: "Sunday"    },
];

type DayHours = { closed: boolean; open: string; close: string };
type WeekHours = Record<string, DayHours>;

const DEFAULT_HOURS: WeekHours = {
  mon: { closed: false, open: "09:00", close: "20:00" },
  tue: { closed: false, open: "09:00", close: "20:00" },
  wed: { closed: false, open: "09:00", close: "20:00" },
  thu: { closed: false, open: "09:00", close: "20:00" },
  fri: { closed: false, open: "09:00", close: "20:00" },
  sat: { closed: false, open: "09:00", close: "17:00" },
  sun: { closed: true,  open: "09:00", close: "17:00" },
};

function GbpAssetsPage({ isOps }: { isOps: boolean }) {
  const { C } = useContext(ThemeCtx);
  const existing   = useQuery(api.gbpAssets.getGbpAssets, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const saveAssets = useMutation(api.gbpAssets.saveGbpAssets);

  const [hours, setHours]           = useState<WeekHours>(DEFAULT_HOURS);
  const [photosLink, setPhotosLink] = useState("");
  const [photosNote, setPhotosNote] = useState("");
  const [yelpEmail, setYelpEmail]   = useState("");
  const [yelpPassword, setYelpPassword] = useState("");
  const [showYelpPass, setShowYelpPass] = useState(false);
  const [saved, setSaved]           = useState(false);
  const [saving, setSaving]         = useState(false);

  useEffect(() => {
    if (existing) {
      try {
        if (existing.hours)        setHours(JSON.parse(existing.hours));
        if (existing.photosLink)   setPhotosLink(existing.photosLink);
        if (existing.photosNote)   setPhotosNote(existing.photosNote);
        if (existing.yelpEmail)    setYelpEmail(existing.yelpEmail);
        if (existing.yelpPassword) setYelpPassword(existing.yelpPassword);
        setSaved(true);
      } catch {}
    }
  }, [existing]);

  const setDay = (day: string, field: "closed" | "open" | "close", value: string | boolean) => {
    if (isOps) return;
    setHours(prev => ({ ...prev, [day]: { ...prev[day], [field]: value } }));
  };

  const handleSave = async () => {
    setSaving(true);
    await saveAssets({
      clientSlug: CLIENT_SLUG,
      projectId: PROJECT_ID,
      hours: JSON.stringify(hours),
      photosLink: photosLink || undefined,
      photosNote: photosNote || undefined,
      yelpEmail: yelpEmail || undefined,
      yelpPassword: yelpPassword || undefined,
    });
    setSaving(false);
    setSaved(true);
  };

  const inputStyle: React.CSSProperties = {
    padding: "8px 12px", borderRadius: 7,
    border: `1px solid ${C.hairline}`, background: C.surface2,
    color: C.ink, fontSize: 13, fontFamily: FONT,
    outline: "none", boxSizing: "border-box",
  };

  const formatTime = (t: string) => {
    if (!t) return "—";
    const [h, m] = t.split(":");
    const hr = parseInt(h, 10);
    return `${hr % 12 || 12}:${m} ${hr < 12 ? "AM" : "PM"}`;
  };

  return (
    <div className="page-content">

      {/* ── Business Hours ── */}
      <SectionDivider label="Business Hours" />
      {!isOps && (
        <p style={{ fontSize: 13, color: C.inkSubtle, marginBottom: 20, lineHeight: 1.6, letterSpacing: "-0.05px" }}>
          Accurate hours on your GBP reduce missed calls and improve local ranking.
          Set each day below — toggle to Closed if you don't operate that day.
        </p>
      )}

      <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 12, overflow: "hidden", marginBottom: 32 }}>
        {DAYS.map((day, i) => {
          const d: DayHours = hours[day.key] || DEFAULT_HOURS[day.key];
          return (
            <div
              key={day.key}
              style={{
                display: "flex", alignItems: "center", padding: "12px 20px", gap: 16,
                borderBottom: i < DAYS.length - 1 ? `1px solid ${C.hairline}` : "none",
                flexWrap: "wrap",
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 500, color: C.inkMuted, width: 96, flexShrink: 0 }}>{day.label}</div>

              {/* Open/Closed toggle */}
              <div
                onClick={() => setDay(day.key, "closed", !d.closed)}
                style={{ display: "flex", alignItems: "center", gap: 7, cursor: isOps ? "default" : "pointer", flexShrink: 0 }}
              >
                <div style={{
                  width: 32, height: 18, borderRadius: 9, position: "relative",
                  background: d.closed ? C.surface3 : C.primary,
                  transition: "background 0.15s",
                }}>
                  <div style={{
                    position: "absolute", top: 2,
                    left: d.closed ? 2 : 16,
                    width: 14, height: 14, borderRadius: "50%", background: "#fff",
                    transition: "left 0.15s",
                  }} />
                </div>
                <span style={{ fontSize: 10, color: d.closed ? C.inkTertiary : C.primary, fontFamily: MONO, letterSpacing: "0.3px", width: 40 }}>
                  {d.closed ? "CLOSED" : "OPEN"}
                </span>
              </div>

              {/* Time inputs */}
              {!d.closed && !isOps && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="time" value={d.open}  onChange={e => setDay(day.key, "open",  e.target.value)} style={{ ...inputStyle, width: 120 }} />
                  <span style={{ fontSize: 11, color: C.inkTertiary }}>to</span>
                  <input type="time" value={d.close} onChange={e => setDay(day.key, "close", e.target.value)} style={{ ...inputStyle, width: 120 }} />
                </div>
              )}

              {/* Ops read-only time display */}
              {!d.closed && isOps && (
                <span style={{ fontSize: 13, color: C.inkMuted, fontFamily: MONO }}>
                  {formatTime(d.open)} – {formatTime(d.close)}
                </span>
              )}
            </div>
          );
        })}
      </div>

      {/* ── GBP Photos ── */}
      <SectionDivider label="GBP Photos" />

      {!isOps && (
        <>
          <div style={{ background: "rgba(94,106,210,0.06)", border: `1px solid rgba(94,106,210,0.2)`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 5 }}>Why photos matter</div>
            <div style={{ fontSize: 12, color: C.inkSubtle, lineHeight: 1.7 }}>
              Right now your Google profile has only 2 owner-uploaded photos. Profiles with 10+ owner photos get
              significantly more clicks, calls, and direction requests. We need real gym photos to unlock that boost.
            </div>
          </div>

          <div style={{ background: C.surface1, border: `1px solid ${C.hairline}`, borderRadius: 10, padding: "14px 18px", marginBottom: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.inkSubtle, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 10 }}>
              What to photograph (aim for 10+)
            </div>
            {[
              "Exterior of the building / signage",
              "Front entrance or lobby",
              "The mat / training floor",
              "Classes in action (with permission)",
              "Instructor / staff headshots",
              "Kids Bullyproof class",
              "Women's self-defense class",
              "Awards, belts, or achievement wall",
              "Logo banners or branded gear",
              "Any other gym / class shots",
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 5, alignItems: "flex-start" }}>
                <span style={{ fontSize: 10, color: C.primary, fontFamily: MONO, marginTop: 2, flexShrink: 0 }}>{String(i + 1).padStart(2, "0")}</span>
                <span style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.5 }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.surface2, border: `1px solid ${C.hairline}`, borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
            <div style={{ fontSize: 10, fontWeight: 500, color: C.inkSubtle, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 8 }}>How to share</div>
            {[
              "Take 10+ photos with your phone at the gym",
              "Open Google Photos or Google Drive",
              "Create an album/folder and add the photos",
              'Tap Share → "Anyone with the link can view"',
              "Paste the share link below and hit Save",
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 5 }}>
                <span style={{ fontSize: 11, color: C.primary, fontFamily: MONO, flexShrink: 0 }}>{i + 1}.</span>
                <span style={{ fontSize: 12, color: C.inkMuted, lineHeight: 1.5 }}>{step}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 6, letterSpacing: "-0.05px" }}>
          Google Drive or Google Photos share link
        </div>
        <input
          type="url"
          value={photosLink}
          onChange={e => !isOps && setPhotosLink(e.target.value)}
          placeholder={isOps ? "—" : "https://drive.google.com/drive/folders/..."}
          readOnly={isOps}
          style={{ ...inputStyle, width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 6, letterSpacing: "-0.05px" }}>
          Notes <span style={{ color: C.inkTertiary }}>(optional)</span>
        </div>
        <textarea
          value={photosNote}
          onChange={e => !isOps && setPhotosNote(e.target.value)}
          placeholder={isOps ? "" : "e.g. The mat photos are from Saturday class, let me know if you need more"}
          readOnly={isOps}
          rows={3}
          style={{ ...inputStyle, width: "100%", resize: "vertical" as const }}
        />
      </div>

      {/* ── Yelp Login ── */}
      <SectionDivider label="Yelp Login" />

      {!isOps && (
        <div style={{ background: "rgba(245,95,68,0.06)", border: "1px solid rgba(245,95,68,0.2)", borderRadius: 10, padding: "14px 18px", marginBottom: 20 }}>
          <div style={{ fontSize: 13, fontWeight: 500, color: C.ink, marginBottom: 5 }}>One quick fix needed</div>
          <div style={{ fontSize: 12, color: C.inkSubtle, lineHeight: 1.7 }}>
            Your Yelp listing currently shows <strong style={{ color: C.ink }}>GracieUniversity.com</strong> as the website — that's the wrong URL.
            We need to log into <strong style={{ color: C.ink }}>biz.yelp.com</strong> to update it to{" "}
            <strong style={{ color: C.ink }}>graciejiujitsusanantonio.com</strong>.
            Enter your credentials below — we'll make the change and you can update your password after.
          </div>
        </div>
      )}

      <div style={{ marginBottom: 12 }}>
        <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 6, letterSpacing: "-0.05px" }}>
          Yelp login email
        </div>
        <input
          type={isOps ? "text" : "email"}
          value={yelpEmail}
          onChange={e => !isOps && setYelpEmail(e.target.value)}
          placeholder={isOps ? "—" : "your@email.com"}
          readOnly={isOps}
          style={{ ...inputStyle, width: "100%" }}
        />
      </div>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 6, letterSpacing: "-0.05px" }}>
          Yelp password
        </div>
        <div style={{ position: "relative" }}>
          <input
            type={showYelpPass ? "text" : "password"}
            value={yelpPassword}
            onChange={e => !isOps && setYelpPassword(e.target.value)}
            placeholder={isOps ? (yelpPassword ? "••••••••" : "—") : "••••••••"}
            readOnly={isOps && !showYelpPass}
            style={{ ...inputStyle, width: "100%", paddingRight: 48 }}
          />
          {yelpPassword && (
            <button
              onClick={() => setShowYelpPass(p => !p)}
              style={{
                position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                background: "none", border: "none", cursor: "pointer",
                color: C.inkTertiary, fontSize: 11, fontFamily: MONO, padding: 0,
              }}
            >
              {showYelpPass ? "hide" : "show"}
            </button>
          )}
        </div>
        {!isOps && (
          <div style={{ fontSize: 11, color: C.inkTertiary, marginTop: 6, letterSpacing: "-0.05px" }}>
            Stored securely in your private hub. You can change your Yelp password after we make the fix.
          </div>
        )}
      </div>

      {!isOps && (
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={handleSave}
            disabled={saving}
            style={{
              padding: "9px 20px",
              background: saving ? C.surface2 : C.primary,
              color: saving ? C.inkSubtle : "#fff",
              border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
              cursor: saving ? "default" : "pointer", fontFamily: FONT,
              letterSpacing: "-0.1px", transition: "background 0.15s",
            }}
          >
            {saving ? "Saving…" : saved ? "Update" : "Save"}
          </button>
          {saved && <span style={{ fontSize: 12, color: C.success }}>✓ Saved</span>}
        </div>
      )}

      {isOps && existing && (
        <div style={{ fontSize: 11, color: C.inkTertiary, fontFamily: MONO }}>
          Last updated {new Date(existing.updatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   REPORTS PAGE
   ═══════════════════════════════════════ */
function ReportsPage({ isOps }: { isOps: boolean }) {
  const { C } = useContext(ThemeCtx);
  const reports    = useQuery(api.reports.getReports, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID }) ?? [];
  const saveReport = useMutation(api.reports.saveReport);
  const deleteReport = useMutation(api.reports.deleteReport);

  const [showForm, setShowForm]   = useState(false);
  const [saving, setSaving]       = useState(false);
  const [form, setForm]           = useState({ title: "", taskKey: "", content: "", type: "task" as "task" | "master" });

  const allTasks = PHASES.flatMap(p => p.tasks);
  const taskReports  = reports.filter((r: any) => r.type === "task");
  const masterReport = reports.find((r: any) => r.type === "master");

  const handleSave = async () => {
    if (!form.title.trim() || !form.content.trim()) return;
    setSaving(true);
    await saveReport({
      clientSlug: CLIENT_SLUG,
      projectId: PROJECT_ID,
      taskKey: form.taskKey || undefined,
      title: form.title,
      content: form.content,
      type: form.type,
      generatedBy: "Anthony Tatis",
    });
    setSaving(false);
    setShowForm(false);
    setForm({ title: "", taskKey: "", content: "", type: "task" });
  };

  const handleGenerateMaster = async () => {
    if (taskReports.length === 0) return;
    const lines: string[] = [
      "# Month 1 SEO Report — Gracie Jiu-Jitsu San Antonio",
      "",
      `**Client:** Marc Torres — Gracie Jiu-Jitsu San Antonio`,
      `**Website:** graciejiujitsusanantonio.com`,
      `**Period:** June 2026 (Month 1 — Technical Foundation)`,
      `**Prepared by:** Anthony Tatis, Twanii`,
      "",
      "---",
      "",
      "## Executive Summary",
      "",
      "Month 1 focused on fixing the technical foundation of your website and Google Business Profile. " +
      "Every issue found in the initial audit has been addressed — your site is now optimized for local search with " +
      "proper meta descriptions, schema markup, correct heading structure, and a fully optimized GBP listing.",
      "",
      "---",
      "",
    ];

    for (const r of taskReports) {
      lines.push(`## ${r.title}`);
      lines.push("");
      lines.push(r.content);
      lines.push("");
      lines.push("---");
      lines.push("");
    }

    lines.push("## Next Steps — Month 2");
    lines.push("");
    lines.push("- Launch review generation campaign (email + text templates)");
    lines.push("- Submit to 6 local directories: Apple Maps, Bing Places, BJJMetrics, Foursquare, Alignable, Hotfrog");
    lines.push("- Optimize 3 program pages for local search (Bullyproof, Combatives, Adult BJJ)");
    lines.push("- Publish 1 local blog post targeting high-intent search terms");
    lines.push("- Deliver: keyword rankings baseline report");

    const content = lines.join("\n");
    setSaving(true);
    // Delete old master if exists
    if (masterReport) {
      await deleteReport({ reportId: masterReport._id });
    }
    await saveReport({
      clientSlug: CLIENT_SLUG,
      projectId: PROJECT_ID,
      taskKey: undefined,
      title: "Month 1 SEO Report — Technical Foundation",
      content,
      type: "master",
      generatedBy: "Anthony Tatis",
    });
    setSaving(false);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%", padding: "9px 12px", borderRadius: 8,
    border: `1px solid ${C.hairline}`, background: C.surface2,
    color: C.ink, fontSize: 13, fontFamily: FONT,
    outline: "none", boxSizing: "border-box",
  };

  return (
    <div className="page-content">
      <SectionDivider label={isOps ? "Reports" : "Deliverables"} />

      {/* Master report spotlight */}
      {masterReport ? (
        <div style={{
          background: "rgba(94,106,210,0.06)", border: `1px solid rgba(94,106,210,0.2)`,
          borderRadius: 12, padding: 20, marginBottom: 28,
        }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: 10, fontWeight: 500, color: C.primary, letterSpacing: "0.5px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 5 }}>Master Report</div>
              <div style={{ fontSize: 15, fontWeight: 600, color: C.ink, letterSpacing: "-0.2px", marginBottom: 4 }}>{masterReport.title}</div>
              <div style={{ fontSize: 11, color: C.inkTertiary, fontFamily: MONO }}>
                {new Date(masterReport.generatedAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                {masterReport.generatedBy && ` · ${masterReport.generatedBy}`}
              </div>
            </div>
            <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
              <button
                onClick={() => generatePdf(masterReport.title, masterReport.content, `gracie-jjsa-month1-report.pdf`)}
                style={{
                  padding: "7px 16px", background: C.primary, color: "#fff",
                  border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500,
                  cursor: "pointer", fontFamily: FONT, letterSpacing: "-0.1px",
                }}
              >
                Download PDF ↓
              </button>
              {isOps && (
                <button
                  onClick={async () => { if (confirm("Delete this master report?")) await deleteReport({ reportId: masterReport._id }); }}
                  style={{
                    padding: "7px 10px", background: C.surface3, color: C.inkSubtle,
                    border: `1px solid ${C.hairline}`, borderRadius: 8, fontSize: 12,
                    cursor: "pointer", fontFamily: FONT,
                  }}
                >×</button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div style={{
          background: C.surface1, border: `1px dashed ${C.hairline}`,
          borderRadius: 12, padding: 20, marginBottom: 28, textAlign: "center",
        }}>
          <div style={{ fontSize: 13, color: C.inkTertiary, marginBottom: 4 }}>No master report yet</div>
          <div style={{ fontSize: 11, color: C.inkTertiary }}>Add task reports below, then generate the master report for the client.</div>
        </div>
      )}

      {/* Ops controls */}
      {isOps && (
        <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <button
            onClick={() => setShowForm(s => !s)}
            style={{
              padding: "7px 16px", background: C.surface2, color: C.inkMuted,
              border: `1px solid ${C.hairline}`, borderRadius: 8, fontSize: 12, fontWeight: 500,
              cursor: "pointer", fontFamily: FONT,
            }}
          >
            {showForm ? "Cancel" : "+ Add report"}
          </button>
          {taskReports.length > 0 && (
            <button
              onClick={handleGenerateMaster}
              disabled={saving}
              style={{
                padding: "7px 16px",
                background: saving ? C.surface2 : C.primary,
                color: saving ? C.inkSubtle : "#fff",
                border: "none", borderRadius: 8, fontSize: 12, fontWeight: 500,
                cursor: saving ? "default" : "pointer", fontFamily: FONT,
              }}
            >
              {saving ? "Generating…" : "Generate master report →"}
            </button>
          )}
        </div>
      )}

      {/* Add Report Form */}
      {isOps && showForm && (
        <div style={{
          background: C.surface1, border: `1px solid ${C.hairline}`,
          borderRadius: 12, padding: 20, marginBottom: 24,
        }}>
          <div style={{ fontSize: 11, color: C.inkSubtle, fontFamily: MONO, textTransform: "uppercase", letterSpacing: "0.4px", marginBottom: 16 }}>New Report</div>

          <div style={{ display: "flex", gap: 12, marginBottom: 12, flexWrap: "wrap" }}>
            {/* Type toggle */}
            <div style={{ display: "inline-flex", background: C.surface2, border: `1px solid ${C.hairline}`, borderRadius: 9999, padding: 3 }}>
              {(["task", "master"] as const).map(t => (
                <button key={t} onClick={() => setForm(f => ({ ...f, type: t }))} style={{
                  padding: "4px 14px", borderRadius: 9999, border: "none", cursor: "pointer",
                  background: form.type === t ? C.surface3 : "transparent",
                  color: form.type === t ? C.ink : C.inkSubtle,
                  fontSize: 12, fontWeight: 500, fontFamily: FONT,
                }}>{t}</button>
              ))}
            </div>

            {/* Task key */}
            {form.type === "task" && (
              <select
                value={form.taskKey}
                onChange={e => setForm(f => ({ ...f, taskKey: e.target.value }))}
                style={{ ...inputStyle, width: "auto", minWidth: 160 }}
              >
                <option value="">Select task…</option>
                {allTasks.map(t => (
                  <option key={t.key} value={t.key}>{t.key} — {t.label.slice(0, 40)}</option>
                ))}
              </select>
            )}
          </div>

          <div style={{ marginBottom: 12 }}>
            <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 5 }}>Title</div>
            <input
              type="text"
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              placeholder="e.g. H1 Structure Fixed — Homepage + Inner Pages"
              style={inputStyle}
            />
          </div>

          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, color: C.inkSubtle, marginBottom: 5 }}>Report content <span style={{ color: C.inkTertiary }}>(markdown supported)</span></div>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              placeholder={`## What was done\n\nDescribe the work completed...\n\n## Results\n\n- Fixed homepage H1 typo\n- Reduced H1 count on Bullyproof page from 10 to 1`}
              rows={10}
              style={{ ...inputStyle, resize: "vertical" as const }}
            />
          </div>

          <button
            onClick={handleSave}
            disabled={saving || !form.title.trim() || !form.content.trim()}
            style={{
              padding: "8px 20px",
              background: (saving || !form.title.trim() || !form.content.trim()) ? C.surface3 : C.primary,
              color: (saving || !form.title.trim() || !form.content.trim()) ? C.inkTertiary : "#fff",
              border: "none", borderRadius: 8, fontSize: 13, fontWeight: 500,
              cursor: (saving || !form.title.trim() || !form.content.trim()) ? "default" : "pointer",
              fontFamily: FONT,
            }}
          >
            {saving ? "Saving…" : "Save report"}
          </button>
        </div>
      )}

      {/* Task Reports list */}
      <SectionDivider label="Task Reports" />
      {taskReports.length === 0 ? (
        <div style={{ fontSize: 13, color: C.inkTertiary, padding: "16px 0" }}>No task reports yet.</div>
      ) : (
        taskReports.map((r: any) => (
          <div key={r._id} style={{
            background: C.surface1, border: `1px solid ${C.hairline}`,
            borderRadius: 10, padding: "14px 16px", marginBottom: 8,
            display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap",
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                {r.taskKey && (
                  <span style={{
                    fontSize: 10, fontWeight: 600, letterSpacing: "0.3px",
                    padding: "2px 8px", borderRadius: 9999, fontFamily: MONO,
                    background: "rgba(94,106,210,0.1)", color: C.primary,
                  }}>{r.taskKey}</span>
                )}
                <span style={{ fontSize: 13, fontWeight: 500, color: C.ink, letterSpacing: "-0.1px" }}>{r.title}</span>
              </div>
              <div style={{ fontSize: 11, color: C.inkTertiary, fontFamily: MONO }}>
                {new Date(r.generatedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                {r.generatedBy && ` · ${r.generatedBy}`}
              </div>
            </div>
            <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
              <button
                onClick={() => generatePdf(r.title, r.content, `gracie-jjsa-${r.taskKey || "report"}-${Date.now()}.pdf`)}
                style={{
                  padding: "5px 12px", background: C.surface2, color: C.inkMuted,
                  border: `1px solid ${C.hairline}`, borderRadius: 7, fontSize: 11,
                  cursor: "pointer", fontFamily: FONT,
                }}
              >
                PDF ↓
              </button>
              {isOps && (
                <button
                  onClick={async () => { if (confirm("Delete this report?")) await deleteReport({ reportId: r._id }); }}
                  style={{
                    padding: "5px 8px", background: "transparent", color: C.inkTertiary,
                    border: `1px solid ${C.hairline}`, borderRadius: 7, fontSize: 11,
                    cursor: "pointer", fontFamily: FONT,
                  }}
                >×</button>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

/* ═══════════════════════════════════════
   ROOT HUB
   ═══════════════════════════════════════ */
export default function MarcHub() {
  const host  = typeof window !== "undefined" ? window.location.hostname : "";
  const isOps = host.includes("ops") || host === "localhost" || host.includes("127.0.0.1");
  const [page, setPage]   = useState("tracker");
  const [light, setLight] = useState(false);

  const theme = light ? LIGHT : DARK;
  // sync module-level C so non-context legacy refs still work during transition
  C = theme;

  const tasks         = useQuery(api.tasks.getTasks, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID }) ?? {};
  const setTask       = useMutation(api.tasks.setTask);
  const discoveryData = useQuery(api.discovery.getDiscovery, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const agreementData = useQuery(api.agreements.getAgreement, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const gbpAssetsData = useQuery(api.gbpAssets.getGbpAssets, { clientSlug: CLIENT_SLUG, projectId: PROJECT_ID });
  const discoveryBadge  = discoveryData !== undefined && !discoveryData;
  const agreementBadge  = agreementData !== undefined && !agreementData;
  const gbpAssetsBadge  = gbpAssetsData !== undefined && !gbpAssetsData;

  const total = PHASES.flatMap(p => p.tasks).length;
  const done  = Object.values(tasks).filter(Boolean).length;
  const pct   = Math.round((done / total) * 100);

  const NAV = isOps
    ? [{ id: "tracker", label: "Tracker" }, { id: "scope", label: "Scope" }, { id: "discovery", label: "Discovery", badge: discoveryBadge }, { id: "agreement", label: "Agreement", badge: agreementBadge }, { id: "gbp-assets", label: "GBP Assets", badge: gbpAssetsBadge }, { id: "reports", label: "Reports" }]
    : [{ id: "tracker", label: "Progress" }, { id: "scope", label: "Scope" }, { id: "discovery", label: "Onboarding", badge: discoveryBadge }, { id: "agreement", label: "Agreement", badge: agreementBadge }, { id: "gbp-assets", label: "Photos & Hours", badge: gbpAssetsBadge }, { id: "reports", label: "Deliverables" }];

  const T = theme;

  return (
    <ThemeCtx.Provider value={{ C: theme, light }}>
    <div style={{ minHeight: "100vh", background: T.canvas, color: T.ink, fontFamily: FONT }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${T.canvas}; }
        .page-content { padding: 28px 32px 56px; max-width: 800px; margin: 0 auto; }
        textarea:focus, input:focus { outline: 2px solid ${T.primaryFocus}; outline-offset: -1px; }
        ::-webkit-scrollbar { width: 5px; }
        ::-webkit-scrollbar-track { background: ${T.canvas}; }
        ::-webkit-scrollbar-thumb { background: ${T.surface3}; border-radius: 9999px; }
        @media (max-width: 600px) {
          .page-content { padding: 20px 16px 48px !important; }
          .hub-strip { overflow-x: auto; flex-wrap: nowrap !important; }
          .hub-nav { overflow-x: auto; scrollbar-width: none; }
          .hub-nav::-webkit-scrollbar { display: none; }
          .hub-nav button { white-space: nowrap; }
        }
        @media print {
          body { background: #fff !important; color: #000 !important; }
          .hub-strip, .hub-nav, [data-no-print], button { display: none !important; }
          .page-content { padding: 0 !important; max-width: 100% !important; }
          .print-section { display: block !important; }
        }
      `}</style>

      {/* Top bar */}
      <div style={{ background: T.canvas, borderBottom: `1px solid ${T.hairline}`, padding: "0 24px", height: 52, display: "flex", alignItems: "center", gap: 16, position: "sticky", top: 0, zIndex: 10 }}>
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <div style={{ width: 22, height: 22, background: T.primary, borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#fff", fontFamily: MONO }}>GJ</span>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: T.ink, letterSpacing: "-0.3px" }}>Gracie JJ SA</span>
          <span style={{ fontSize: 11, color: T.hairlineStrong }}>·</span>
          <span style={{ fontSize: 11, color: T.inkSubtle }}>SEO Sprint</span>
        </div>

        {/* Right side: progress + theme toggle */}
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 12 }}>
          <span style={{ fontSize: 11, color: pct === 100 ? T.success : T.inkSubtle, fontFamily: MONO }}>{pct}%</span>
          <div style={{ width: 72, height: 2, background: T.surface3, borderRadius: 9999 }}>
            <div style={{ width: `${pct}%`, height: "100%", background: pct === 100 ? T.success : T.primary, borderRadius: 9999 }} />
          </div>
          <span style={{ fontSize: 10, color: T.inkTertiary, fontFamily: MONO }}>{isOps ? "OPS" : "HUB"}</span>
          {/* Theme toggle */}
          <button
            onClick={() => setLight(l => !l)}
            title={light ? "Switch to dark" : "Switch to light"}
            style={{
              marginLeft: 4,
              width: 28, height: 28,
              borderRadius: 6,
              border: `1px solid ${T.hairline}`,
              background: T.surface2,
              color: T.inkSubtle,
              cursor: "pointer",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13,
              transition: "background 0.15s, border-color 0.15s",
            }}
          >
            {light ? "☾" : "☀"}
          </button>
        </div>
      </div>

      {/* Info strip */}
      <div className="hub-strip" style={{ background: T.surface1, borderBottom: `1px solid ${T.hairline}`, padding: "9px 24px", display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap" }}>
        {[
          { label: "Client", value: "Marc Torres", strong: true },
          { label: "Business", value: "Gracie JJ San Antonio" },
          { label: "Service", value: "3-Month SEO Sprint" },
          { label: "Flat rate", value: "$500 upfront" },
          { label: "Or 3 months", value: "$200 × 3" },
          { label: "Or 4 months", value: "$150 × 4" },
        ].map(item => (
          <div key={item.label} style={{ flexShrink: 0 }}>
            <div style={{ fontSize: 9, color: T.inkTertiary, letterSpacing: "0.4px", fontFamily: MONO, textTransform: "uppercase", marginBottom: 2 }}>{item.label}</div>
            <div style={{ fontSize: 12, color: item.strong ? T.ink : T.inkMuted, fontWeight: item.strong ? 500 : 400 }}>{item.value}</div>
          </div>
        ))}
      </div>

      {/* Nav */}
      <div className="hub-nav" style={{ background: T.canvas, borderBottom: `1px solid ${T.hairline}`, padding: "0 24px", display: "flex" }}>
        {NAV.map(n => (
          <button
            key={n.id}
            onClick={() => setPage(n.id)}
            style={{
              background: "transparent", border: "none",
              borderBottom: `2px solid ${page === n.id ? T.primary : "transparent"}`,
              color: page === n.id ? T.ink : T.inkSubtle,
              padding: "12px 14px", fontSize: 12, fontWeight: 500,
              letterSpacing: "-0.1px", cursor: "pointer", fontFamily: FONT,
              transition: "color 0.12s", position: "relative", flexShrink: 0,
            }}
          >
            {n.label}
            {n.badge && (
              <span style={{
                position: "absolute", top: 8, right: 5,
                width: 6, height: 6, borderRadius: "50%",
                background: T.primary,
              }} />
            )}
          </button>
        ))}
      </div>

      {/* Page */}
      {page === "tracker"    && <TrackerPage tasks={tasks} setTask={setTask} />}
      {page === "scope"      && <ScopePage />}
      {page === "discovery"  && <DiscoveryPage isOps={isOps} onGoToAgreement={() => setPage("agreement")} />}
      {page === "agreement"  && <AgreementPage />}
      {page === "gbp-assets" && <GbpAssetsPage isOps={isOps} />}
      {page === "reports"    && <ReportsPage isOps={isOps} />}
    </div>
    </ThemeCtx.Provider>
  );
}
