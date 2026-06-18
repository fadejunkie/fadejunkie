// @ts-nocheck
import { useState, useEffect, useRef, Component } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { marked } from "marked";

class ErrorBoundary extends Component {
  state = { hasError: false, error: null };
  static getDerivedStateFromError(error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return <div style={{ padding: 40, fontFamily: "Inter,sans-serif", maxWidth: 600, margin: "0 auto" }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#ef4444", marginBottom: 12 }}>Something went wrong</div>
        <pre style={{ fontSize: 11, color: "#64748b", whiteSpace: "pre-wrap", wordBreak: "break-all" }}>{String(this.state.error)}</pre>
        <button onClick={() => window.location.reload()} style={{ marginTop: 16, padding: "8px 20px", fontSize: 12, background: "#1a2c4e", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" }}>Reload</button>
      </div>;
    }
    return this.props.children;
  }
}

/* ── color system ── */
const NAVY = "#1a2c4e", GOLD = "#c9a227", GOLD2 = "#e2b93b", GREEN = "#22c55e", EMBER = "#ef4444";

const lightColors = {
  NAVY, GOLD, GOLD2, GREEN, EMBER,
  BG: "#ffffff", CARD: "#f8fafc", DEEP: "#f1f5f9", INPUT: "#e2e8f0",
  EDGE: "#cbd5e1", SLATE: "#64748b", STONE: "#475569", INK: "#0f172a",
  ACCENT: NAVY, ACCENT2: "#243c6e",
};
const darkColors = {
  NAVY, GOLD, GOLD2, GREEN, EMBER,
  BG: "#0f1a2e", CARD: "#1a2844", DEEP: "#243259", INPUT: "#2d3f6b",
  EDGE: "#2d3f6b", SLATE: "#94a3b8", STONE: "#cbd5e1", INK: "#f1f5f9",
  ACCENT: GOLD, ACCENT2: GOLD2,
};

/* ── phases ── */
const phases = [
  {
    id: 1, name: "BRAND", subtitle: "Brand Discovery + Visual Identity", week: "WEEKS 1–2", short: "BRAND · KIT", icon: "◆",
    milestones: [
      {
        title: "DISCOVERY", clientDesc: "Define Bond Agency's brand voice, audience, and visual direction.",
        tasks: [
          { label: "Complete the Discovery Questionnaire", blocker: true },
          { label: "Client intake — brand story, values, target audience profile" },
          { label: "Define brand positioning: what makes Allison different from other agents?" },
          { label: "Identify tone: professional trust? warm and personal? community protector?" },
          { label: "Confirm service area for local SEO targeting" },
          { label: "Confirm preferred domain name" },
        ]
      },
      {
        title: "MOOD + DIRECTION", clientDesc: "Visual direction deck — two options, one approval gate.",
        tasks: [
          { label: "Build mood board — photography style, color feel, typography direction" },
          { label: "Present 2 direction options tailored to life insurance audience" },
          { label: "Get client approval on direction before any design work begins", blocker: true },
        ]
      },
      {
        title: "LOGO / MARK", clientDesc: "A professional mark for Bond Agency — built for trust.",
        tasks: [
          { label: "Generate 3 logo concepts (wordmark or icon + wordmark)" },
          { label: "Present concepts with mockups — email signature, social profile, landing page header" },
          { label: "Revision round 1 on selected direction" },
          { label: "Revision round 2 — final polish and lockup variants" },
          { label: "Export: PNG (transparent), SVG (vector), PDF (print-ready)" },
          { label: "Client approval on final logo package", blocker: true },
        ]
      },
      {
        title: "BRAND SYSTEM", clientDesc: "Colors, fonts, and tone guide — the full brand kit.",
        tasks: [
          { label: "Define primary palette with hex codes" },
          { label: "Define secondary palette + neutrals" },
          { label: "Select typography — heading font + body font pairing" },
          { label: "Build brand guidelines PDF: logo usage, colors, typography, tone of voice" },
          { label: "Deliver complete brand kit to client" },
          { label: "Client approval on brand system", blocker: true },
        ]
      },
    ]
  },
  {
    id: 2, name: "BUILD", subtitle: "Landing Page + SEO", week: "WEEKS 2–3", short: "PAGE · SEO", icon: "⬡",
    milestones: [
      {
        title: "DOMAIN SETUP", clientDesc: "Domain secured and configured for launch.",
        tasks: [
          { label: "Confirm and register preferred domain (allisonbond.com / bondagency.com)", blocker: true },
          { label: "Configure DNS — nameservers, SSL, WHOIS privacy" },
          { label: "Set up hosting environment and deployment pipeline" },
          { label: "Send domain confirmation + credentials to client" },
        ]
      },
      {
        title: "LANDING PAGE", clientDesc: "A high-converting single page built to generate leads.",
        tasks: [
          { label: "Hero section — headline, subhead, primary CTA (Get a Free Quote)" },
          { label: "Services section — all 6 products with clear descriptions" },
          { label: "About section — Allison's story, credentials, why Bond Agency" },
          { label: "Trust signals — testimonials, carrier logos, years of experience" },
          { label: "Lead capture form — name, phone, email, type of coverage interested in" },
          { label: "Footer — contact info, social links, SFG compliance disclaimer" },
          { label: "Mobile-first responsive build" },
        ]
      },
      {
        title: "SEO FOUNDATION", clientDesc: "Keyword-optimized from the ground up.",
        tasks: [
          { label: "Keyword research — life insurance + local market terms" },
          { label: "On-page optimization — title tag, meta description, H1/H2 hierarchy" },
          { label: "Schema markup — LocalBusiness + InsuranceAgency structured data" },
          { label: "Google Business Profile optimization guidance" },
          { label: "Submit XML sitemap to Google Search Console" },
          { label: "Page speed optimization — images, fonts, LCP target < 2.5s" },
        ]
      },
      {
        title: "LEAD CAPTURE", clientDesc: "Form submission → Allison's inbox, every time.",
        tasks: [
          { label: "Wire lead form to email (allisonbond.sfg@gmail.com)" },
          { label: "Set up form confirmation — thank you message + what to expect next" },
          { label: "Confirm lead tracking for profit share reporting" },
          { label: "Test end-to-end: submit → receive email" },
        ]
      },
    ]
  },
  {
    id: 3, name: "LAUNCH", subtitle: "QA, Go-Live + Handoff", week: "WEEK 3", short: "QA · LIVE", icon: "▲",
    milestones: [
      {
        title: "QUALITY ASSURANCE", clientDesc: "Every pixel and form tested before go-live.",
        tasks: [
          { label: "Cross-browser testing — Chrome, Safari, Firefox, Edge" },
          { label: "Mobile QA — iOS Safari, Android Chrome, tablet" },
          { label: "Test lead capture form — submissions, email delivery" },
          { label: "Page speed audit — Lighthouse score target 90+" },
          { label: "Accessibility check — color contrast, alt text, keyboard nav" },
        ]
      },
      {
        title: "GO LIVE", clientDesc: "DNS pointed. SSL active. Bond Agency is live.",
        tasks: [
          { label: "Final DNS cutover — point domain to hosting" },
          { label: "Verify SSL certificate active and forcing HTTPS" },
          { label: "Confirm canonical URLs resolve correctly" },
          { label: "Confirm live site loads correctly on chosen domain" },
        ]
      },
      {
        title: "ANALYTICS", clientDesc: "Tracking wired so we know what's working.",
        tasks: [
          { label: "Create and configure Google Analytics 4 property" },
          { label: "Install GA4 on site" },
          { label: "Set up Google Search Console — verify domain" },
          { label: "Configure conversion tracking — form submit = lead event" },
          { label: "Set up monthly traffic + lead report for profit share review" },
        ]
      },
      {
        title: "CLIENT HANDOFF", clientDesc: "Everything delivered. Profit share system running.",
        tasks: [
          { label: "Deliver all brand assets: logo files, guidelines PDF, font files" },
          { label: "Deliver credentials doc — hosting, domain registrar, GA4, GSC" },
          { label: "Live walkthrough of the site and admin controls" },
          { label: "Confirm profit share tracking is live and both parties can verify" },
          { label: "48-hour post-launch check-in — fix issues, answer questions" },
        ]
      },
    ]
  },
];

const DISCOVERY_QUESTIONS = [
  { id: "service_area", label: "Service Area", prompt: "What city/state do you primarily serve? Do you work in specific counties or zip codes?" },
  { id: "target_audience", label: "Target Clients", prompt: "Who are your ideal clients? (e.g. young families, homeowners, seniors, first-time buyers, small business owners)" },
  { id: "differentiator", label: "Your Edge", prompt: "What makes you different from other life insurance agents? Why do clients choose you?" },
  { id: "tone", label: "Brand Tone", prompt: "How would you describe your style? (e.g. warm & personal, professional & trustworthy, community-focused, financial expert)" },
  { id: "existing_brand", label: "Existing Branding", prompt: "Do you have any existing logo, colors, or materials you want us to keep or build from?" },
  { id: "domain", label: "Domain Preference", prompt: "What domain name do you want? (e.g. allisonbond.com, bondagency.com, bondlifeinsurance.com)" },
  { id: "competitors", label: "Competitors", prompt: "Name 2-3 competing agents or agencies in your area. What do you like or dislike about their sites?" },
  { id: "sfg_constraints", label: "SFG / Compliance", prompt: "Are there any SFG or Symmetry Financial Group branding rules or compliance disclaimers we need to include on the site?" },
  { id: "lead_goal", label: "Lead Goal", prompt: "What action do you want visitors to take? (e.g. fill out a form, call you, book a meeting, get a quote)" },
  { id: "anything_else", label: "Anything Else", prompt: "Anything else we should know before we start? Goals, concerns, things you love or hate in websites?" },
];

/* ── helpers ── */
function phaseProgress(p, ts) {
  let t = 0, d = 0;
  p.milestones.forEach(m => m.tasks.forEach((_, ti) => { t++; if (ts[`${p.id}-${m.title}-${ti}`]) d++; }));
  return { total: t, done: d, pct: t ? Math.round(d / t * 100) : 0 };
}
function overall(ts) {
  let t = 0, d = 0;
  phases.forEach(p => p.milestones.forEach(m => m.tasks.forEach((_, ti) => { t++; if (ts[`${p.id}-${m.title}-${ti}`]) d++; })));
  return { total: t, done: d, pct: t ? Math.round(d / t * 100) : 0 };
}

const Bar = ({ pct, h = 6, c }) => (
  <div style={{ background: c.EDGE + "44", borderRadius: 3, height: h, width: "100%", overflow: "hidden" }}>
    <div style={{ width: `${pct}%`, height: "100%", borderRadius: 3, transition: "width 0.5s cubic-bezier(.4,0,.2,1)", background: pct === 100 ? c.GREEN : `linear-gradient(90deg,${c.NAVY},${c.GOLD})` }} />
  </div>
);

const Grain = () => (
  <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 9999, opacity: 0.02, backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")` }} />
);

/* ═══════════════════════════════════════
   SCOPE PAGE
   ═══════════════════════════════════════ */
function ScopePage({ c }) {
  const Section = ({ title, children }) => (
    <div style={{ marginBottom: 28 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: c.GOLD, letterSpacing: 3, fontFamily: "Inter,sans-serif", marginBottom: 14, paddingBottom: 8, borderBottom: `1px solid ${c.EDGE}` }}>{title}</div>
      {children}
    </div>
  );
  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: c.GOLD, letterSpacing: 5, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>ANTHONY'S BRAND BUILDER</div>
        <div style={{ fontSize: 28, fontWeight: 900, color: c.INK, letterSpacing: 2, fontFamily: "'Playfair Display',serif" }}>Scope of Work</div>
        <div style={{ fontSize: 13, color: c.SLATE, marginTop: 4 }}>Bond Agency — Life Insurance Landing Page + SEO</div>
      </div>
      <Section title="PROJECT OVERVIEW">
        <div style={{ fontSize: 13, color: c.INK, lineHeight: 1.7, fontFamily: "Inter,sans-serif", padding: "0 4px" }}>
          Bond Agency is a life insurance brand serving clients in need of whole life, term, IUL, mortgage protection, and accidental death coverage. This engagement covers the full pipeline: brand identity, a high-converting landing page, and SEO optimization — built to generate leads and grow Allison's client base.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(140px,1fr))", gap: 8, marginTop: 14 }}>
          {[{ l: "CLIENT", v: "Allison Bond" }, { l: "BUSINESS", v: "Bond Agency" }, { l: "TYPE", v: "Life Insurance" }, { l: "MODEL", v: "Profit Share" }].map(i => (
            <div key={i.l} style={{ background: c.CARD, border: `1px solid ${c.EDGE}`, borderRadius: 4, padding: "8px 12px" }}>
              <div style={{ fontSize: 9, color: c.SLATE, letterSpacing: 2, fontFamily: "Inter,sans-serif" }}>{i.l}</div>
              <div style={{ fontSize: 12, color: c.INK, fontWeight: 600, marginTop: 2 }}>{i.v}</div>
            </div>
          ))}
        </div>
      </Section>
      <Section title="ENGAGEMENT TYPE">
        <div style={{ background: c.GOLD + "0c", border: `1px solid ${c.GOLD}22`, borderRadius: 8, padding: "16px 20px" }}>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.INK, marginBottom: 4 }}>Profit Share</div>
          <div style={{ fontSize: 11, color: c.SLATE, fontFamily: "Inter,sans-serif", lineHeight: 1.6 }}>
            No upfront cost. Anthony builds and maintains the landing page and SEO presence. Revenue is shared on qualified leads and/or policy sales generated through the site. Exact split and tracking method confirmed before launch.
          </div>
        </div>
      </Section>
      <Section title="SERVICES COVERED">
        {["Whole Life Insurance", "Term Life Insurance", "Indexed Universal Life (IUL)", "Mortgage Protection Insurance", "General Life Insurance", "Accidental Death & Dismemberment (AD&D)"].map((s, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", padding: "8px 16px", borderBottom: `1px solid ${c.EDGE}`, gap: 10 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: c.GOLD, flexShrink: 0 }} />
            <div style={{ fontSize: 13, color: c.INK, fontFamily: "Inter,sans-serif" }}>{s}</div>
          </div>
        ))}
      </Section>
      <Section title="PHASE DELIVERABLES">
        {phases.map(p => (
          <div key={p.id} style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 800, color: c.INK, letterSpacing: 1, marginBottom: 8 }}>
              <span style={{ color: c.GOLD, marginRight: 8 }}>PHASE {p.id}</span>{p.name} — {p.subtitle}
            </div>
            {p.milestones.map(m => (
              <div key={m.title} style={{ marginBottom: 8, paddingLeft: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: c.INK, marginBottom: 4 }}>{m.title}</div>
                {m.tasks.map((t, i) => (
                  <div key={i} style={{ fontSize: 11, color: c.SLATE, fontFamily: "Inter,sans-serif", paddingLeft: 12, lineHeight: 1.8 }}>• {t.label}</div>
                ))}
              </div>
            ))}
          </div>
        ))}
      </Section>
      <Section title="TERMS">
        {[
          { l: "Engagement", b: "Profit share model — no upfront payment. Anthony builds and maintains the page. Revenue is shared on leads/sales generated through the site." },
          { l: "Revisions", b: "Revision rounds included as noted per phase. Additional revisions accommodated within reason." },
          { l: "Client Responsibilities", b: "Client provides bio content, headshot, testimonials, and review feedback. Delays in client input may extend delivery." },
          { l: "Ownership", b: "Client retains full ownership of all brand assets. Site is jointly maintained under profit share terms." },
          { l: "Third-Party Costs", b: "Domain and hosting costs are paid by client. Estimated: $12–$25/yr for domain." },
        ].map(t => (
          <div key={t.l} style={{ marginBottom: 10 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: c.GOLD, letterSpacing: 1, marginBottom: 2 }}>{t.l}</div>
            <div style={{ fontSize: 11, color: c.INK, lineHeight: 1.6, fontFamily: "Inter,sans-serif", paddingLeft: 8 }}>{t.b}</div>
          </div>
        ))}
      </Section>
    </div>
  );
}

/* ═══════════════════════════════════════
   AGREEMENT PAGE
   ═══════════════════════════════════════ */
const DEV_MODE = new URLSearchParams(window.location.search).has("dev");

function AgreementPage({ c }) {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [signed, setSigned] = useState(DEV_MODE);
  const [signedDate, setSignedDate] = useState<string | null>(DEV_MODE ? new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }) : null);
  const [sigData, setSigData] = useState<string | null>(DEV_MODE ? "data:image/png;base64,DEV" : null);
  const [saving, setSaving] = useState(false);

  const saveAgreementMutation = useMutation(api.agreements.saveAgreement);
  const existingAgreement = useQuery(api.agreements.getAgreement, { clientSlug: "allison-bond", projectId: "allison-bond" });

  useEffect(() => {
    if (DEV_MODE || !existingAgreement) return;
    setSigned(true);
    setSignedDate(existingAgreement.signedDate);
    setSigData(existingAgreement.sigData);
  }, [existingAgreement]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || signed) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = c.BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = c.INK;
    ctx.lineWidth = 2;
    ctx.lineCap = "round";
  }, [signed, c]);

  const getPos = (e, canvas) => {
    const r = canvas.getBoundingClientRect();
    const src = e.touches ? e.touches[0] : e;
    return { x: src.clientX - r.left, y: src.clientY - r.top };
  };

  const startDraw = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    setDrawing(true);
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const draw = (e) => {
    e.preventDefault();
    if (!drawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const { x, y } = getPos(e, canvas);
    ctx.lineTo(x, y);
    ctx.stroke();
  };
  const endDraw = () => setDrawing(false);

  const clearSig = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    ctx.fillStyle = c.BG;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  const submitSig = async () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const data = canvas.toDataURL("image/png");
    const date = new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
    setSaving(true);
    try {
      await saveAgreementMutation({ clientSlug: "allison-bond", projectId: "allison-bond", sigData: data, signedDate: date });
      setSigned(true);
      setSignedDate(date);
      setSigData(data);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (signed) {
    return (
      <div style={{ maxWidth: 620, margin: "0 auto", padding: "40px 24px", textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>✓</div>
        <div style={{ fontSize: 22, fontWeight: 800, color: c.INK, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Agreement Signed</div>
        <div style={{ fontSize: 13, color: c.SLATE, marginBottom: 24 }}>Signed on {signedDate}</div>
        {sigData && sigData !== "data:image/png;base64,DEV" && (
          <img src={sigData} alt="signature" style={{ maxWidth: 300, border: `1px solid ${c.EDGE}`, borderRadius: 6, background: c.BG }} />
        )}
        <div style={{ marginTop: 20, fontSize: 11, color: c.SLATE, lineHeight: 1.6 }}>
          Thank you, Allison. We're excited to build something great together.
        </div>
      </div>
    );
  }

  const terms = [
    { n: "Parties", v: "This agreement is between Anthony Tatis (\"Builder\") and Allison Bond / Bond Agency (\"Client\")." },
    { n: "Scope", v: "Builder will design, develop, and launch a life insurance landing page with SEO optimization for Bond Agency." },
    { n: "Engagement Model", v: "Profit share. No upfront payment. Revenue sharing on qualified leads or policy sales generated through the site. Specific split and lead tracking method confirmed separately before launch." },
    { n: "Deliverables", v: "Brand identity (logo, colors, typography), high-converting landing page, SEO foundation, lead capture form, analytics setup, and client handoff documentation." },
    { n: "Client Responsibilities", v: "Client provides bio, headshot, testimonials, and feedback in a timely manner. Delays may affect timeline." },
    { n: "Ownership", v: "Client retains full ownership of brand assets. Site is jointly maintained under profit share terms until otherwise agreed." },
    { n: "Compliance", v: "Client is responsible for ensuring all content meets SFG/Symmetry Financial Group and applicable insurance regulatory requirements." },
    { n: "Term", v: "This agreement remains in effect until both parties agree to modify or terminate in writing." },
  ];

  return (
    <div style={{ maxWidth: 720, margin: "0 auto", padding: "32px 24px" }}>
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 11, color: c.GOLD, letterSpacing: 5, fontFamily: "Inter,sans-serif", marginBottom: 6 }}>BOND AGENCY</div>
        <div style={{ fontSize: 26, fontWeight: 900, color: c.INK, letterSpacing: 1, fontFamily: "'Playfair Display',serif" }}>Profit Share Agreement</div>
        <div style={{ fontSize: 12, color: c.SLATE, marginTop: 4 }}>Landing Page + SEO — Anthony Tatis × Allison Bond</div>
      </div>
      {terms.map(t => (
        <div key={t.n} style={{ marginBottom: 14, padding: "12px 16px", background: c.CARD, borderRadius: 6, border: `1px solid ${c.EDGE}` }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: c.GOLD, letterSpacing: 2, marginBottom: 4 }}>{t.n.toUpperCase()}</div>
          <div style={{ fontSize: 12, color: c.INK, lineHeight: 1.6, fontFamily: "Inter,sans-serif" }}>{t.v}</div>
        </div>
      ))}
      <div style={{ marginTop: 28, padding: "20px", background: c.CARD, borderRadius: 8, border: `1px solid ${c.EDGE}` }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: c.INK, marginBottom: 12 }}>Sign below to confirm agreement</div>
        <canvas
          ref={canvasRef}
          width={560} height={120}
          style={{ width: "100%", maxWidth: 560, height: 120, border: `1px solid ${c.EDGE}`, borderRadius: 4, cursor: "crosshair", background: c.BG, touchAction: "none" }}
          onMouseDown={startDraw} onMouseMove={draw} onMouseUp={endDraw} onMouseLeave={endDraw}
          onTouchStart={startDraw} onTouchMove={draw} onTouchEnd={endDraw}
        />
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <button onClick={clearSig} style={{ padding: "7px 16px", fontSize: 11, background: "transparent", color: c.SLATE, border: `1px solid ${c.EDGE}`, borderRadius: 4, cursor: "pointer" }}>Clear</button>
          <button onClick={submitSig} disabled={saving} style={{ padding: "7px 20px", fontSize: 11, background: c.NAVY, color: "#fff", border: "none", borderRadius: 4, cursor: "pointer", fontWeight: 700, flex: 1 }}>
            {saving ? "Saving…" : "I Agree — Submit Signature"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   WEBSITE MOCKUP PAGE (LIFE INSURANCE)
   Miro design system applied
   ═══════════════════════════════════════ */
function useWindowWidth() {
  const [w, setW] = useState(typeof window !== "undefined" ? window.innerWidth : 900);
  useEffect(() => {
    const handler = () => setW(window.innerWidth);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);
  return w;
}

export function WebsitePage() {
  const [section, setSection] = useState("home");
  const [formData, setFormData] = useState({ firstName: "", lastName: "", birthday: "", phone: "", hasSpouse: "", hobbies: "", isHomeowner: "", mortgage: "", coverage: "" });
  const [formSent, setFormSent] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const winW = useWindowWidth();
  const isMobile = winW < 680;

  /* ── Miro design system ── */
  const S = {
    bg: "#ffffff",
    text: "#1c1c1e",
    muted: "#555a6a",
    placeholder: "#a5a8b5",
    border: "#c7cad5",
    ring: "rgb(224,226,232) 0px 0px 0px 1px",
    blue: "#5b76fe",
    bluePressed: "#2a41b6",
    success: "#00b473",
    /* pastel pairs */
    tealLight: "#c3faf5", tealDark: "#187574",
    coralLight: "#ffc6c6", coralDark: "#600000",
    roseLight: "#ffd8f4",
    orangeLight: "#ffe6cd",
    /* font stacks */
    display: "'Plus Jakarta Sans', 'Inter', sans-serif",
    body: "'Noto Sans', 'Inter', sans-serif",
  };

  const services = [
    { name: "Whole Life Insurance", desc: "Permanent coverage with a guaranteed death benefit and cash value that grows over time — a policy for life.", icon: "◆", pastel: "#c3faf5" },
    { name: "Term Life Insurance", desc: "Straightforward, affordable protection for a set period. Ideal for young families who want maximum coverage now.", icon: "◈", pastel: "#ffd8f4" },
    { name: "Indexed Universal Life (IUL)", desc: "Flexible premiums with growth potential tied to a market index — protection and wealth-building in one policy.", icon: "⬡", pastel: "#ffe6cd" },
    { name: "Mortgage Protection", desc: "Ensures your family can stay in their home if you pass away. Your home is protected, no matter what.", icon: "⌂", pastel: "#ffc6c6" },
    { name: "General Life Insurance", desc: "Tailored coverage built around your specific situation, goals, and budget. No one-size-fits-all here.", icon: "◉", pastel: "#c3faf5" },
    { name: "Accidental Death (AD&D)", desc: "An affordable safety net that pays out in the event of accidental death or serious injury. Peace of mind at a low cost.", icon: "▲", pastel: "#ffd8f4" },
  ];

  const testimonials = [
    { name: "Marcus & Priya T.", text: "Allison walked us through every option without any pressure. We left with a whole life policy that fits our family perfectly. She genuinely cares." },
    { name: "David R.", text: "I've been putting off life insurance for years. Allison made it so simple — one conversation and I was covered. Wish I'd done it sooner." },
    { name: "Sandra & Mike L.", text: "We needed mortgage protection fast when we bought our home. Allison had us set up within days. Professional, fast, and thorough." },
    { name: "Jerome F.", text: "The IUL she recommended has already grown in value. I didn't know life insurance could work like this. She explained everything clearly — no jargon." },
  ];

  const go = (s) => { setSection(s); setMobileMenuOpen(false); if (scrollRef.current) scrollRef.current.scrollTop = 0; window.scrollTo({ top: 0, behavior: "instant" }); };
  const px = isMobile ? "16px" : "28px";
  const heroSize = isMobile ? 34 : 52;
  const sectionSize = isMobile ? 26 : 40;

  /* ── shared component styles ── */
  const BtnPrimary = ({ label, onClick }: any) => (
    <button onClick={onClick} style={{ padding: isMobile ? "13px 20px" : "13px 28px", fontSize: 15, fontWeight: 700, letterSpacing: 0.175, fontFamily: S.display, background: S.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", minHeight: 44 }}>{label}</button>
  );
  const BtnOutline = ({ label, onClick }: any) => (
    <button onClick={onClick} style={{ padding: isMobile ? "12px 18px" : "12px 24px", fontSize: 15, fontWeight: 600, fontFamily: S.display, background: "transparent", color: S.text, border: `1px solid ${S.border}`, borderRadius: 8, cursor: "pointer", minHeight: 44 }}>{label}</button>
  );

  const SiteNav = () => (
    <div style={{ background: S.bg, boxShadow: `${S.ring}`, padding: `0 ${px}`, display: "flex", alignItems: "center", justifyContent: "space-between", height: 60, position: "sticky", top: 0, zIndex: 100 }}>
      <div onClick={() => go("home")} style={{ cursor: "pointer" }}>
        <span style={{ fontSize: 17, fontWeight: 800, color: S.text, fontFamily: S.display, letterSpacing: -0.3 }}>Bond Agency</span>
        <span style={{ fontSize: 11, color: S.blue, fontFamily: S.body, marginLeft: 6 }}>· Life Insurance</span>
      </div>
      {isMobile ? (
        <button onClick={() => setMobileMenuOpen(o => !o)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: S.text, padding: "4px 8px" }}>
          {mobileMenuOpen ? "✕" : "☰"}
        </button>
      ) : (
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          {[{ l: "Home", s: "home" }, { l: "Services", s: "services" }, { l: "About", s: "about" }].map(n => (
            <button key={n.s} onClick={() => go(n.s)} style={{ padding: "7px 14px", fontSize: 14, fontWeight: 600, fontFamily: S.body, color: section === n.s ? S.blue : S.muted, background: section === n.s ? `${S.blue}10` : "transparent", border: "none", borderRadius: 8, cursor: "pointer" }}>{n.l}</button>
          ))}
          <BtnPrimary label="Get a Free Quote" onClick={() => go("contact")} />
        </div>
      )}
      {/* mobile dropdown */}
      {isMobile && mobileMenuOpen && (
        <div style={{ position: "absolute", top: 60, left: 0, right: 0, background: S.bg, boxShadow: "0 8px 24px rgba(0,0,0,0.1)", padding: "12px 16px 20px", zIndex: 200 }}>
          {[{ l: "Home", s: "home" }, { l: "Services", s: "services" }, { l: "About", s: "about" }, { l: "Contact", s: "contact" }].map(n => (
            <button key={n.s} onClick={() => go(n.s)} style={{ display: "block", width: "100%", textAlign: "left", padding: "13px 12px", fontSize: 16, fontWeight: 600, fontFamily: S.body, color: section === n.s ? S.blue : S.text, background: "none", border: "none", borderBottom: `1px solid ${S.border}`, cursor: "pointer", minHeight: 48 }}>{n.l}</button>
          ))}
          <button onClick={() => go("contact")} style={{ marginTop: 12, width: "100%", padding: "14px", fontSize: 15, fontWeight: 700, fontFamily: S.display, background: S.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer" }}>Get a Free Quote</button>
        </div>
      )}
    </div>
  );

  const SiteFooter = () => (
    <div style={{ background: "#f5f5f7", borderTop: `1px solid ${S.border}`, padding: isMobile ? "36px 16px 24px" : "48px 40px 28px" }}>
      <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 28, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: S.text, fontFamily: S.display, marginBottom: 4 }}>Bond Agency</div>
          <div style={{ fontSize: 13, color: S.muted, fontFamily: S.body, lineHeight: 1.6, maxWidth: 220 }}>Protecting families — one policy at a time.</div>
        </div>
        <div style={{ display: "flex", gap: isMobile ? 32 : 48, flexWrap: "wrap" }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.text, fontFamily: S.body, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Coverage</div>
            {services.slice(0, 4).map(s => <div key={s.name} onClick={() => go("services")} style={{ fontSize: 13, color: S.muted, marginBottom: 7, cursor: "pointer", fontFamily: S.body }}>{s.name}</div>)}
          </div>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.text, fontFamily: S.body, letterSpacing: 1, marginBottom: 10, textTransform: "uppercase" }}>Contact</div>
            {["allisonbond.sfg@gmail.com", "Free consultations", "Symmetry Financial Group"].map(l => <div key={l} style={{ fontSize: 13, color: S.muted, marginBottom: 7, fontFamily: S.body }}>{l}</div>)}
          </div>
        </div>
      </div>
      <div style={{ borderTop: `1px solid ${S.border}`, paddingTop: 16, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontSize: 12, color: S.placeholder, fontFamily: S.body }}>© 2026 Bond Agency — Allison Bond.</div>
        <div style={{ fontSize: 12, color: S.placeholder, fontFamily: S.body }}>Built by Anthony's Brand Builder</div>
      </div>
    </div>
  );

  const renderHome = () => (
    <>
      {/* Hero — white canvas, Miro style */}
      <div style={{ padding: isMobile ? "52px 16px 44px" : "80px 48px 72px", maxWidth: 860, margin: "0 auto" }}>
        <div style={{ display: "inline-block", padding: "5px 14px", background: S.tealLight, borderRadius: 20, fontSize: 12, fontWeight: 600, color: S.tealDark, fontFamily: S.body, marginBottom: 24 }}>
          Licensed SFG Agent · Serving All of Texas
        </div>
        <div style={{ fontSize: heroSize, fontWeight: 700, color: S.text, fontFamily: S.display, lineHeight: 1.12, letterSpacing: isMobile ? -0.5 : -1.5, marginBottom: 20, maxWidth: 680 }}>
          Your family deserves someone who will <span style={{ color: S.blue }}>fight for them.</span>
        </div>
        <div style={{ fontSize: isMobile ? 16 : 18, color: S.muted, fontFamily: S.body, lineHeight: 1.65, marginBottom: 36, maxWidth: 520 }}>
          I don't just sell policies — I stay in your corner. From finding the right coverage to making sure your family actually gets paid out, I'm with you every step of the way.
        </div>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <BtnPrimary label="Get a Free Quote" onClick={() => go("contact")} />
          <BtnOutline label="See Coverage Options" onClick={() => go("services")} />
        </div>
      </div>

      {/* Trust pills */}
      <div style={{ background: S.tealLight, padding: "16px 24px", display: "flex", justifyContent: "center", gap: isMobile ? 14 : 32, flexWrap: "wrap" }}>
        {["Serving All of Texas", "E&O Licensed Agent", "No Pressure. Ever.", "I Fight For Your Payout"].map(t => (
          <div key={t} style={{ fontSize: 13, fontWeight: 600, color: S.tealDark, fontFamily: S.body }}>✓ {t}</div>
        ))}
      </div>

      {/* Services grid */}
      <div style={{ padding: isMobile ? "48px 16px" : "72px 32px", maxWidth: 920, margin: "0 auto" }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: sectionSize, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -1, marginBottom: 10 }}>Protection for every stage of life</div>
          <div style={{ fontSize: 16, color: S.muted, fontFamily: S.body }}>Six types of coverage. One agent who explains all of them clearly.</div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(260px,1fr))", gap: 14 }}>
          {services.map(s => (
            <div key={s.name} style={{ background: s.pastel, borderRadius: 20, padding: "24px", boxShadow: S.ring }}>
              <div style={{ fontSize: 22, marginBottom: 10 }}>{s.icon}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: S.text, fontFamily: S.display, marginBottom: 8, letterSpacing: -0.3 }}>{s.name}</div>
              <div style={{ fontSize: 14, color: S.muted, lineHeight: 1.65, fontFamily: S.body }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Testimonial — coral pastel */}
      <div style={{ background: S.coralLight, padding: isMobile ? "48px 16px" : "64px 48px" }}>
        <div style={{ maxWidth: 640, margin: "0 auto" }}>
          <div style={{ fontSize: isMobile ? 22 : 32, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -0.72, lineHeight: 1.2, marginBottom: 20 }}>
            "{testimonials[1].text}"
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, color: S.muted, fontFamily: S.body, marginBottom: 28 }}>— {testimonials[1].name}</div>
          <BtnOutline label="Meet Allison →" onClick={() => go("about")} />
        </div>
      </div>

      {/* CTA */}
      <div style={{ padding: isMobile ? "56px 16px" : "80px 48px", textAlign: "center" }}>
        <div style={{ fontSize: isMobile ? 28 : 40, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -1, marginBottom: 14, maxWidth: 560, margin: "0 auto 14px" }}>
          Ready to protect what matters most?
        </div>
        <div style={{ fontSize: 16, color: S.muted, fontFamily: S.body, marginBottom: 28 }}>A free consultation is just a form away — no commitment, no pressure.</div>
        <BtnPrimary label="Get Started Today" onClick={() => go("contact")} />
      </div>
    </>
  );

  const renderServices = () => (
    <div>
      <div style={{ padding: isMobile ? "48px 16px 36px" : "72px 48px 56px", maxWidth: 900, margin: "0 auto" }}>
        <div style={{ fontSize: sectionSize, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -1, marginBottom: 10 }}>What we cover</div>
        <div style={{ fontSize: 16, color: S.muted, fontFamily: S.body, marginBottom: 44, maxWidth: 480 }}>Every family across Texas has a different story. I'll find the right coverage for yours — and through carriers most agents can't access, often at half the price.</div>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {services.map((s, i) => (
            <div key={s.name} style={{ display: "flex", gap: 20, padding: "24px 0", borderBottom: `1px solid ${S.border}`, alignItems: "flex-start", flexWrap: isMobile ? "wrap" : "nowrap" }}>
              <div style={{ width: 52, height: 52, borderRadius: 16, background: s.pastel, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: 22 }}>{s.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: S.text, fontFamily: S.display, marginBottom: 6, letterSpacing: -0.3 }}>{s.name}</div>
                <div style={{ fontSize: 14, color: S.muted, lineHeight: 1.7, fontFamily: S.body }}>{s.desc}</div>
              </div>
              <button onClick={() => go("contact")} style={{ padding: "9px 18px", fontSize: 13, fontWeight: 600, fontFamily: S.body, background: "transparent", color: S.blue, border: `1px solid ${S.border}`, borderRadius: 8, cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap", minHeight: 40 }}>Get quote →</button>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 44 }}>
          <BtnPrimary label="Schedule a Free Consultation" onClick={() => go("contact")} />
        </div>
      </div>
    </div>
  );

  const renderAbout = () => (
    <div>
      {/* Header — rose pastel */}
      <div style={{ background: S.roseLight, padding: isMobile ? "48px 16px 36px" : "72px 48px 56px" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <div style={{ fontSize: sectionSize, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -1, marginBottom: 10 }}>Allison Bond</div>
          <div style={{ fontSize: 16, color: S.muted, fontFamily: S.body, letterSpacing: 0.5 }}>Life Insurance Agent · Bond Agency · Symmetry Financial Group</div>
        </div>
      </div>

      {/* Story sections */}
      <div style={{ padding: isMobile ? "40px 16px 48px" : "64px 48px", maxWidth: 720, margin: "0 auto" }}>
        {[
          { t: "My mission", b: "I started Bond Agency because I believe every family deserves to feel secure. Life insurance shouldn't be confusing or out of reach — I make it simple, clear, and affordable for anyone over 18 across Texas. My job is to find you the right coverage and make sure it's there when your family needs it most." },
          { t: "How I work", b: "I start by listening — your family, your goals, your budget. Then I go to work. I carry E&O insurance, which means I can work with carriers that most agents can't access. That translates to the same quality coverage, often at half the price. When something happens, I don't just file a claim and disappear — I stay in contact with the carriers and push hard to make sure your family gets paid out, quickly." },
          { t: "Why Bond Agency", b: "I'm always available. Always. Whether you have a question at 9am or a concern on a Saturday, I pick up. No pressure, ever — I'd rather you leave our conversation with clarity than leave with a policy that doesn't fit. My clients send me their siblings, parents, and neighbors because they trust me to take care of their families the same way I take care of my own." },
        ].map(s => (
          <div key={s.t} style={{ marginBottom: 36, paddingBottom: 36, borderBottom: `1px solid ${S.border}` }}>
            <div style={{ fontSize: 20, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -0.4, marginBottom: 12 }}>{s.t}</div>
            <div style={{ fontSize: 15, color: S.muted, lineHeight: 1.8, fontFamily: S.body }}>{s.b}</div>
          </div>
        ))}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 36 }}>
          {["Licensed Insurance Agent", "E&O Insured", "Serving All of Texas", "Symmetry Financial Group", "Free Consultations"].map(tag => (
            <div key={tag} style={{ padding: "6px 14px", background: S.tealLight, borderRadius: 20, fontSize: 12, fontWeight: 600, color: S.tealDark, fontFamily: S.body }}>{tag}</div>
          ))}
        </div>
        <BtnPrimary label="Book a Consultation" onClick={() => go("contact")} />
      </div>

      {/* Testimonials */}
      <div style={{ background: "#f5f5f7", padding: isMobile ? "40px 16px" : "56px 40px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ fontSize: isMobile ? 22 : 32, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -0.72, marginBottom: 28 }}>What clients say</div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(2,1fr)", gap: 14 }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: S.bg, borderRadius: 16, padding: "24px", boxShadow: S.ring }}>
                <div style={{ fontSize: 32, color: S.blue, lineHeight: 1, marginBottom: 10, fontFamily: S.display, fontWeight: 800 }}>"</div>
                <div style={{ fontSize: 14, color: S.text, lineHeight: 1.75, marginBottom: 14, fontFamily: S.body }}>{t.text}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: S.muted, fontFamily: S.body }}>— {t.name}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContact = () => (
    <div style={{ padding: isMobile ? "40px 16px 56px" : "72px 48px 80px", maxWidth: 560, margin: "0 auto" }}>
      <div style={{ fontSize: sectionSize, fontWeight: 700, color: S.text, fontFamily: S.display, letterSpacing: -1, marginBottom: 8 }}>Let's talk coverage</div>
      <div style={{ fontSize: 15, color: S.muted, fontFamily: S.body, marginBottom: 36 }}>No commitment. No pressure. Just a real conversation about protecting your family.</div>

      {formSent ? (
        <div style={{ background: `${S.success}12`, border: `1px solid ${S.success}33`, borderRadius: 20, padding: "48px 28px", textAlign: "center" }}>
          <div style={{ fontSize: 44, marginBottom: 12 }}>✓</div>
          <div style={{ fontSize: 22, fontWeight: 700, color: S.success, fontFamily: S.display, letterSpacing: -0.5, marginBottom: 10 }}>You're in good hands</div>
          <div style={{ fontSize: 14, color: S.muted, fontFamily: S.body, lineHeight: 1.7 }}>Allison will reach out within 24 hours to go over your options.</div>
          <button onClick={() => setFormSent(false)} style={{ marginTop: 24, padding: "10px 24px", fontSize: 13, fontWeight: 600, fontFamily: S.body, background: "transparent", color: S.muted, border: `1px solid ${S.border}`, borderRadius: 8, cursor: "pointer" }}>Start over</button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>First Name</div>
              <input type="text" placeholder="First" value={formData.firstName} onChange={e => setFormData(p => ({ ...p, firstName: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: S.text, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Last Name</div>
              <input type="text" placeholder="Last" value={formData.lastName} onChange={e => setFormData(p => ({ ...p, lastName: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: S.text, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: 14 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Date of Birth</div>
              <input type="date" value={formData.birthday} onChange={e => setFormData(p => ({ ...p, birthday: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: formData.birthday ? S.text : S.placeholder, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Phone Number</div>
              <input type="tel" placeholder="(555) 000-0000" value={formData.phone} onChange={e => setFormData(p => ({ ...p, phone: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: S.text, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }} />
            </div>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Do you have a spouse?</div>
            <select value={formData.hasSpouse} onChange={e => setFormData(p => ({ ...p, hasSpouse: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: formData.hasSpouse ? S.text : S.placeholder, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }}>
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Hobbies or Activities</div>
            <input type="text" placeholder="e.g. hiking, sports, motorcycles…" value={formData.hobbies} onChange={e => setFormData(p => ({ ...p, hobbies: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: S.text, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }} />
          </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Do you own a home?</div>
            <select value={formData.isHomeowner} onChange={e => setFormData(p => ({ ...p, isHomeowner: e.target.value, mortgage: e.target.value === "no" ? "" : formData.mortgage }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: formData.isHomeowner ? S.text : S.placeholder, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }}>
              <option value="">Select…</option>
              <option value="yes">Yes</option>
              <option value="no">No</option>
            </select>
          </div>
          {formData.isHomeowner === "yes" && (
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Mortgage Amount (approx.)</div>
              <input type="text" placeholder="e.g. $250,000" value={formData.mortgage} onChange={e => setFormData(p => ({ ...p, mortgage: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: S.text, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }} />
            </div>
          )}
          <div>
            <div style={{ fontSize: 13, fontWeight: 600, color: S.text, fontFamily: S.body, marginBottom: 6 }}>Type of Coverage (optional)</div>
            <select value={formData.coverage} onChange={e => setFormData(p => ({ ...p, coverage: e.target.value }))} style={{ width: "100%", padding: "12px 16px", background: S.bg, border: `1px solid #e9eaef`, borderRadius: 8, color: formData.coverage ? S.text : S.placeholder, fontSize: 15, fontFamily: S.body, outline: "none", boxSizing: "border-box", minHeight: 44 }}>
              <option value="">Not sure yet</option>
              {services.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
            </select>
          </div>
          <button onClick={() => { if (formData.firstName && formData.phone) setFormSent(true); }} style={{ padding: "14px", fontSize: 16, fontWeight: 700, fontFamily: S.display, background: S.blue, color: "#fff", border: "none", borderRadius: 8, cursor: "pointer", minHeight: 48 }}>Request My Free Quote</button>
        </div>
      )}

      <div style={{ marginTop: 44, paddingTop: 28, borderTop: `1px solid ${S.border}`, display: "flex", gap: 28, flexWrap: "wrap" }}>
        {[{ l: "Email", v: "allisonbond.sfg@gmail.com" }, { l: "Agency", v: "Bond Agency" }, { l: "Service Area", v: "All of Texas" }].map(i => (
          <div key={i.l}>
            <div style={{ fontSize: 11, fontWeight: 700, color: S.muted, fontFamily: S.body, letterSpacing: 1, marginBottom: 3, textTransform: "uppercase" }}>{i.l}</div>
            <div style={{ fontSize: 13, color: S.text, fontFamily: S.body }}>{i.v}</div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div ref={scrollRef} style={{ background: S.bg, minHeight: "100%", overflow: "auto", borderRadius: 12, boxShadow: "0 4px 32px rgba(0,0,0,0.08)", position: "relative" }}>
      <SiteNav />
      {section === "home" && renderHome()}
      {section === "services" && renderServices()}
      {section === "about" && renderAbout()}
      {section === "contact" && renderContact()}
      <SiteFooter />
    </div>
  );
}

/* ═══════════════════════════════════════
   DISCOVERY PAGE
   ═══════════════════════════════════════ */
export function DiscoveryPage() {
  const c = lightColors;
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [saving, setSaving] = useState(false);

  const saveDiscovery = useMutation(api.discovery.saveDiscovery);
  const setTask = useMutation(api.tasks.setTask);
  const existing = useQuery(api.discovery.getDiscovery, { clientSlug: "allison-bond", projectId: "allison-bond" });

  useEffect(() => {
    if (existing) {
      try {
        setAnswers(JSON.parse(existing.responses));
        setSubmitted(true);
      } catch { }
    }
  }, [existing]);

  const handleSubmit = async () => {
    const filled = DISCOVERY_QUESTIONS.filter(q => answers[q.id]?.trim()).length;
    if (filled < 5) { alert("Please answer at least 5 questions before submitting."); return; }
    setSaving(true);
    try {
      await saveDiscovery({ clientSlug: "allison-bond", projectId: "allison-bond", responses: JSON.stringify(answers) });
      await setTask({ clientSlug: "allison-bond", projectId: "allison-bond", taskKey: "1-DISCOVERY-0", completed: true });
      setSubmitted(true);
    } catch (e) { console.error(e); }
    setSaving(false);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: c.BG, display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
        <div style={{ maxWidth: 520, textAlign: "center" }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 24, fontWeight: 800, color: c.INK, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Discovery Submitted</div>
          <div style={{ fontSize: 14, color: c.SLATE, lineHeight: 1.7, marginBottom: 24 }}>
            Thank you, Allison! We'll review your answers and be in touch within 1–2 days to walk through next steps.
          </div>
          <button onClick={() => setSubmitted(false)} style={{ padding: "9px 22px", fontSize: 12, fontWeight: 700, background: "transparent", color: c.SLATE, border: `1px solid ${c.EDGE}`, borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>
            Edit answers
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: c.BG, padding: "40px 24px" }}>
      <div style={{ maxWidth: 640, margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <div style={{ fontSize: 11, color: c.GOLD, letterSpacing: 5, fontFamily: "Inter,sans-serif", marginBottom: 8 }}>BOND AGENCY</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: c.INK, fontFamily: "'Playfair Display',serif", marginBottom: 8 }}>Brand Discovery</div>
          <div style={{ fontSize: 13, color: c.SLATE, lineHeight: 1.6 }}>
            Help us understand Bond Agency before we start. There are no wrong answers — just be yourself.
          </div>
        </div>
        {DISCOVERY_QUESTIONS.map((q, i) => (
          <div key={q.id} style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: c.INK, marginBottom: 4 }}>
              <span style={{ color: c.GOLD, marginRight: 6 }}>{i + 1}.</span>{q.label}
            </div>
            <div style={{ fontSize: 11, color: c.SLATE, marginBottom: 8, lineHeight: 1.5 }}>{q.prompt}</div>
            <textarea
              value={answers[q.id] || ""}
              onChange={e => setAnswers(a => ({ ...a, [q.id]: e.target.value }))}
              rows={3}
              style={{ width: "100%", padding: "10px 12px", border: `1px solid ${c.EDGE}`, borderRadius: 6, fontSize: 13, fontFamily: "Inter,sans-serif", color: c.INK, background: c.CARD, resize: "vertical", boxSizing: "border-box", outline: "none" }}
              placeholder="Your answer…"
            />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={saving} style={{ width: "100%", padding: "14px", fontSize: 14, fontWeight: 700, background: c.NAVY, color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>
          {saving ? "Saving…" : "Save answers →"}
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN HUB
   ═══════════════════════════════════════ */
export default function AllisonHub({ defaultView = "client", opsMode = false }) {
  const [dark, setDark] = useState(false);
  const c = dark ? darkColors : lightColors;
  const [view, setView] = useState<"client" | "internal">(defaultView);
  const [tab, setTab] = useState("progress");
  const [expandedPhase, setExpandedPhase] = useState<number | null>(1);
  const [expandedMilestone, setExpandedMilestone] = useState<string | null>(null);

  const rawTasks = useQuery(api.tasks.getTasks, { clientSlug: "allison-bond", projectId: "allison-bond" });
  const tasks = rawTasks ?? {};
  const setTaskMut = useMutation(api.tasks.setTask);
  const agreement = useQuery(api.agreements.getAgreement, { clientSlug: "allison-bond", projectId: "allison-bond" });
  const discovery = useQuery(api.discovery.getDiscovery, { clientSlug: "allison-bond", projectId: "allison-bond" });
  const deliverables = useQuery(api.deliverables.getDeliverables, { clientSlug: "allison-bond", projectId: "allison-bond" });

  const ov = overall(tasks);
  const isInternal = view === "internal";

  const toggleTask = async (key: string, val: boolean) => {
    if (!isInternal) return;
    await setTaskMut({ clientSlug: "allison-bond", projectId: "allison-bond", taskKey: key, completed: val });
  };

  /* ── nav tabs ── */
  const tabs = [
    { id: "progress", label: "PROGRESS" },
    { id: "scope", label: "SCOPE" },
    { id: "website", label: "WEBSITE" },
    { id: "agreement", label: "AGREEMENT" },
    { id: "discovery", label: "DISCOVERY" },
    ...(isInternal ? [{ id: "deliverables", label: "DELIVERABLES" }] : []),
  ];

  /* ── milestone key ── */
  const mkKey = (phaseId, title, ti) => `${phaseId}-${title}-${ti}`;

  /* ── blocker check ── */
  const hasBlocker = (phase, milestone) => {
    const m = phase.milestones.find(m => m.title === milestone.title);
    if (!m) return false;
    const blockerIdx = m.tasks.findIndex(t => t.blocker);
    if (blockerIdx === -1) return false;
    return !tasks[mkKey(phase.id, m.title, blockerIdx)];
  };

  /* ── discovery answers ── */
  let discoveryAnswers: Record<string, string> = {};
  try { if (discovery?.responses) discoveryAnswers = JSON.parse(discovery.responses); } catch { }

  const font = "Inter,sans-serif";
  const serif = "'Playfair Display',serif";

  return (
    <ErrorBoundary>
      <div style={{ minHeight: "100vh", background: c.BG, color: c.INK, fontFamily: font, transition: "background 0.3s" }}>
        <Grain />

        {/* ── header ── */}
        <div style={{ borderBottom: `1px solid ${c.EDGE}`, padding: "0 24px", background: c.CARD, position: "sticky", top: 0, zIndex: 100 }}>
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", gap: 16, height: 56 }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 9, color: c.GOLD, letterSpacing: 4, fontFamily: font }}>BOND AGENCY</div>
              <div style={{ fontSize: 14, fontWeight: 800, color: c.INK, letterSpacing: 1, fontFamily: serif }}>Project Hub</div>
            </div>
            {/* overall progress */}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 80 }}><Bar pct={ov.pct} h={4} c={c} /></div>
              <div style={{ fontSize: 11, color: c.SLATE, fontWeight: 700 }}>{ov.pct}%</div>
            </div>
            {/* view toggle (ops only) */}
            {opsMode && (
              <div style={{ display: "flex", border: `1px solid ${c.EDGE}`, borderRadius: 6, overflow: "hidden" }}>
                {(["client", "internal"] as const).map(v => (
                  <button key={v} onClick={() => setView(v)} style={{ padding: "5px 12px", fontSize: 10, fontWeight: 700, letterSpacing: 1, cursor: "pointer", border: "none", background: view === v ? c.NAVY : "transparent", color: view === v ? "#fff" : c.SLATE, transition: "all 0.2s" }}>
                    {v === "client" ? "CLIENT" : "OPS"}
                  </button>
                ))}
              </div>
            )}
            {/* dark mode */}
            <button onClick={() => setDark(d => !d)} style={{ fontSize: 14, background: "transparent", border: "none", cursor: "pointer", color: c.SLATE, padding: 4 }}>
              {dark ? "☀" : "◑"}
            </button>
          </div>

          {/* tabs */}
          <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", gap: 0, overflowX: "auto" }}>
            {tabs.map(t => (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                padding: "10px 16px", fontSize: 10, fontWeight: 700, letterSpacing: 2, cursor: "pointer",
                border: "none", background: "transparent", color: tab === t.id ? c.GOLD : c.SLATE,
                borderBottom: `2px solid ${tab === t.id ? c.GOLD : "transparent"}`, transition: "all 0.2s", whiteSpace: "nowrap"
              }}>{t.label}</button>
            ))}
          </div>
        </div>

        <div style={{ maxWidth: 900, margin: "0 auto", padding: "24px 24px 80px" }}>

          {/* ═══ PROGRESS TAB ═══ */}
          {tab === "progress" && (
            <div>
              {/* phase cards */}
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(220px,1fr))", gap: 12, marginBottom: 28 }}>
                {phases.map(p => {
                  const prog = phaseProgress(p, tasks);
                  const active = expandedPhase === p.id;
                  return (
                    <div key={p.id} onClick={() => setExpandedPhase(active ? null : p.id)}
                      style={{ padding: "16px 18px", background: c.CARD, borderRadius: 8, border: `1px solid ${active ? c.GOLD : c.EDGE}`, cursor: "pointer", transition: "border-color 0.2s" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                        <div>
                          <div style={{ fontSize: 9, color: c.GOLD, letterSpacing: 3, fontFamily: font, marginBottom: 2 }}>PHASE {p.id}</div>
                          <div style={{ fontSize: 14, fontWeight: 800, color: c.INK }}>{p.name}</div>
                          <div style={{ fontSize: 10, color: c.SLATE, marginTop: 1 }}>{p.subtitle}</div>
                        </div>
                        <div style={{ fontSize: 18, color: c.GOLD }}>{p.icon}</div>
                      </div>
                      <Bar pct={prog.pct} h={5} c={c} />
                      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                        <div style={{ fontSize: 10, color: c.SLATE }}>{prog.done}/{prog.total} tasks</div>
                        <div style={{ fontSize: 10, fontWeight: 700, color: prog.pct === 100 ? c.GREEN : c.GOLD }}>{prog.pct}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* expanded phase milestones */}
              {expandedPhase && (() => {
                const phase = phases.find(p => p.id === expandedPhase)!;
                return (
                  <div>
                    <div style={{ fontSize: 10, color: c.GOLD, letterSpacing: 4, fontFamily: font, marginBottom: 14 }}>PHASE {phase.id} — {phase.name}</div>
                    {phase.milestones.map((m, mi) => {
                      const mKey = `${phase.id}-${m.title}`;
                      const mDone = m.tasks.filter((_, ti) => tasks[mkKey(phase.id, m.title, ti)]).length;
                      const mPct = Math.round(mDone / m.tasks.length * 100);
                      const open = expandedMilestone === mKey;
                      const blocked = !isInternal && hasBlocker(phase, m);

                      return (
                        <div key={m.title} style={{ marginBottom: 8, borderRadius: 8, border: `1px solid ${c.EDGE}`, overflow: "hidden" }}>
                          <div onClick={() => setExpandedMilestone(open ? null : mKey)}
                            style={{ padding: "14px 18px", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", background: c.CARD }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: mPct === 100 ? c.GREEN : c.DEEP, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                              {mPct === 100
                                ? <span style={{ fontSize: 14, color: "#fff" }}>✓</span>
                                : <span style={{ fontSize: 10, fontWeight: 800, color: c.GOLD }}>{mi + 1}</span>}
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                                <div style={{ fontSize: 12, fontWeight: 700, color: c.INK }}>{m.title}</div>
                                {blocked && <span style={{ fontSize: 9, padding: "2px 6px", background: c.EMBER + "18", color: c.EMBER, borderRadius: 3, fontWeight: 700, letterSpacing: 1 }}>AWAITING CLIENT</span>}
                              </div>
                              <div style={{ fontSize: 10, color: c.SLATE, marginTop: 2 }}>{m.clientDesc}</div>
                            </div>
                            <div style={{ textAlign: "right", flexShrink: 0 }}>
                              <div style={{ fontSize: 11, fontWeight: 700, color: mPct === 100 ? c.GREEN : c.GOLD }}>{mPct}%</div>
                              <div style={{ fontSize: 9, color: c.SLATE }}>{mDone}/{m.tasks.length}</div>
                            </div>
                            <div style={{ fontSize: 10, color: c.SLATE, transform: open ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>▼</div>
                          </div>

                          {open && (
                            <div style={{ borderTop: `1px solid ${c.EDGE}`, background: c.BG }}>
                              {m.tasks.map((task, ti) => {
                                const key = mkKey(phase.id, m.title, ti);
                                const done = !!tasks[key];
                                return (
                                  <div key={ti} onClick={() => toggleTask(key, !done)}
                                    style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "10px 18px", borderBottom: `1px solid ${c.EDGE}`, cursor: isInternal ? "pointer" : "default", background: done ? c.CARD : "transparent" }}>
                                    <div style={{ width: 18, height: 18, borderRadius: 4, border: `2px solid ${done ? c.GREEN : c.EDGE}`, background: done ? c.GREEN : "transparent", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                                      {done && <span style={{ fontSize: 10, color: "#fff", lineHeight: 1 }}>✓</span>}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                      <div style={{ fontSize: 12, color: done ? c.SLATE : c.INK, textDecoration: done ? "line-through" : "none" }}>{task.label}</div>
                                      {task.blocker && !done && <div style={{ fontSize: 9, color: c.EMBER, fontWeight: 700, letterSpacing: 1, marginTop: 2 }}>CLIENT ACTION REQUIRED</div>}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>
          )}

          {/* ═══ SCOPE TAB ═══ */}
          {tab === "scope" && <ScopePage c={c} />}

          {/* ═══ WEBSITE TAB ═══ */}
          {tab === "website" && (
            <div>
              <div style={{ fontSize: 10, color: c.GOLD, letterSpacing: 4, marginBottom: 6 }}>LANDING PAGE MOCKUP</div>
              <div style={{ fontSize: 11, color: c.SLATE, fontFamily: "Inter,sans-serif", marginBottom: 18, lineHeight: 1.6 }}>
                Interactive preview of the Bond Agency landing page. Brand colors and copy will update after Discovery is complete.
              </div>
              <WebsitePage />
            </div>
          )}

          {/* ═══ AGREEMENT TAB ═══ */}
          {tab === "agreement" && (
            <div>
              {isInternal && agreement && (
                <div style={{ marginBottom: 16, padding: "10px 16px", background: c.GREEN + "15", border: `1px solid ${c.GREEN}33`, borderRadius: 6, fontSize: 12, color: c.GREEN, fontWeight: 700 }}>
                  ✓ Agreement signed — {agreement.signedDate}
                </div>
              )}
              <AgreementPage c={c} />
            </div>
          )}

          {/* ═══ DISCOVERY TAB ═══ */}
          {tab === "discovery" && (
            <div>
              {discovery ? (
                <div>
                  <div style={{ marginBottom: 20, padding: "10px 16px", background: c.GREEN + "15", border: `1px solid ${c.GREEN}33`, borderRadius: 6, fontSize: 12, color: c.GREEN, fontWeight: 700 }}>
                    ✓ Discovery submitted — {new Date(discovery.submittedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                  </div>
                  {isInternal && (
                    <div>
                      <div style={{ fontSize: 10, color: c.GOLD, letterSpacing: 4, marginBottom: 14 }}>DISCOVERY RESPONSES</div>
                      {DISCOVERY_QUESTIONS.map(q => (
                        <div key={q.id} style={{ marginBottom: 14, padding: "12px 16px", background: c.CARD, borderRadius: 6, border: `1px solid ${c.EDGE}` }}>
                          <div style={{ fontSize: 10, fontWeight: 700, color: c.GOLD, letterSpacing: 2, marginBottom: 4 }}>{q.label.toUpperCase()}</div>
                          <div style={{ fontSize: 13, color: c.INK, lineHeight: 1.6 }}>{discoveryAnswers[q.id] || <span style={{ color: c.SLATE, fontStyle: "italic" }}>No answer</span>}</div>
                        </div>
                      ))}
                    </div>
                  )}
                  {!isInternal && (
                    <div style={{ textAlign: "center", padding: "40px 24px", color: c.SLATE, fontSize: 13 }}>
                      Discovery questionnaire submitted. We'll be in touch soon!
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  <div style={{ marginBottom: 20, padding: "12px 16px", background: c.GOLD + "12", border: `1px solid ${c.GOLD}33`, borderRadius: 6 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: c.INK, marginBottom: 4 }}>Discovery Questionnaire</div>
                    <div style={{ fontSize: 11, color: c.SLATE, lineHeight: 1.6 }}>
                      Share your answers at the link below. This helps us understand Bond Agency before we start design work.
                    </div>
                    <a href="/discovery" style={{ display: "inline-block", marginTop: 10, padding: "7px 16px", fontSize: 11, fontWeight: 700, background: c.NAVY, color: "#fff", borderRadius: 4, textDecoration: "none" }}>
                      Open Discovery Form →
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ═══ DELIVERABLES TAB (ops only) ═══ */}
          {tab === "deliverables" && isInternal && (
            <div>
              <div style={{ fontSize: 10, color: c.GOLD, letterSpacing: 4, marginBottom: 16 }}>DELIVERABLES</div>
              {(!deliverables || deliverables.length === 0) ? (
                <div style={{ textAlign: "center", padding: "40px 24px", color: c.SLATE, fontSize: 13 }}>No deliverables added yet.</div>
              ) : (
                deliverables.map(d => (
                  <div key={d._id} style={{ padding: "12px 16px", background: c.CARD, borderRadius: 6, border: `1px solid ${c.EDGE}`, marginBottom: 8, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: c.INK }}>{d.label}</div>
                      <div style={{ fontSize: 10, color: c.SLATE }}>{d.milestoneKey} · {d.type}</div>
                    </div>
                    {d.url && <a href={d.url} target="_blank" rel="noreferrer" style={{ fontSize: 11, color: c.GOLD, fontWeight: 700, textDecoration: "none" }}>View →</a>}
                  </div>
                ))
              )}
            </div>
          )}

        </div>
      </div>
    </ErrorBoundary>
  );
}
