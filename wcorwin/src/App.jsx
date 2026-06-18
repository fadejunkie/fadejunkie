import { useState, useEffect, useRef } from "react";
import SEOJourneyTracker from "./SEOJourneyTracker";
import SEOHealthTab from "./SEOHealthTab";
import ContentTab from "./ContentTab";
import InvoiceTab from "./InvoiceTab";
import TemplatesTab from "./TemplatesTab";
import { INK, ACCENT, MUTED, WHITE, LIGHT, BG } from "./data";

const font = "'DM Sans', 'Satoshi', -apple-system, sans-serif";
const mono = "'DM Mono', monospace";

const TABS = [
  { id: "journey", label: "Journey" },
  { id: "health",  label: "SEO Health" },
  { id: "content", label: "Content" },
  { id: "templates", label: "Templates" },
  { id: "invoice", label: "Invoice · $950" },
];

function Nav({ active, onSwitch }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const activeLabel = TABS.find(t => t.id === active)?.label ?? "Journey";

  return (
    <div style={{
      position: "sticky", top: 0, zIndex: 200,
      background: INK,
      borderBottom: `1px solid rgba(255,255,255,0.07)`,
      padding: "0 24px",
      height: 48,
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      {/* Left: brand */}
      <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
        <div style={{
          width: 7, height: 7, borderRadius: "50%",
          background: ACCENT, boxShadow: `0 0 7px ${ACCENT}`,
        }} />
        <span style={{
          color: WHITE, fontFamily: mono, fontSize: 12,
          fontWeight: 500, letterSpacing: "0.07em", textTransform: "uppercase",
        }}>
          wcorwin.com
        </span>
      </div>

      {/* Right: active tab label + hamburger */}
      <div style={{ display: "flex", alignItems: "center", gap: 16 }} ref={ref}>
        <span style={{
          color: "rgba(255,255,255,0.35)", fontSize: 11,
          fontFamily: mono, letterSpacing: "0.04em",
        }}>
          {activeLabel}
        </span>

        {/* Hamburger button */}
        <button
          onClick={() => setOpen(o => !o)}
          style={{
            background: "none", border: "none", cursor: "pointer",
            padding: "6px 4px", display: "flex", flexDirection: "column",
            gap: 5, alignItems: "flex-end", outline: "none",
          }}
        >
          <span style={{ display: "block", width: 20, height: 1.5, background: open ? ACCENT : "rgba(255,255,255,0.7)", borderRadius: 2, transition: "background 0.15s" }} />
          <span style={{ display: "block", width: 14, height: 1.5, background: open ? ACCENT : "rgba(255,255,255,0.7)", borderRadius: 2, transition: "background 0.15s" }} />
          <span style={{ display: "block", width: 20, height: 1.5, background: open ? ACCENT : "rgba(255,255,255,0.7)", borderRadius: 2, transition: "background 0.15s" }} />
        </button>

        {/* Dropdown */}
        {open && (
          <div style={{
            position: "absolute", top: 48, right: 24,
            background: "#1a1a1a",
            border: `1px solid rgba(255,255,255,0.1)`,
            borderRadius: 8,
            overflow: "hidden",
            minWidth: 160,
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
          }}>
            {TABS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => { onSwitch(t.id); setOpen(false); }}
                style={{
                  display: "block", width: "100%", textAlign: "left",
                  padding: "12px 18px",
                  background: active === t.id ? "rgba(232,84,26,0.12)" : "transparent",
                  border: "none",
                  borderTop: i > 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                  color: active === t.id ? ACCENT : "rgba(255,255,255,0.75)",
                  fontSize: 13, fontWeight: active === t.id ? 600 : 400,
                  fontFamily: font, cursor: "pointer",
                  transition: "background 0.1s",
                }}
                onMouseEnter={e => { if (active !== t.id) e.target.style.background = "rgba(255,255,255,0.05)"; }}
                onMouseLeave={e => { if (active !== t.id) e.target.style.background = "transparent"; }}
              >
                {active === t.id && (
                  <span style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: ACCENT, marginRight: 10, verticalAlign: "middle" }} />
                )}
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState(() => localStorage.getItem("wcorwin-active-tab") || "journey");

  useEffect(() => {
    localStorage.setItem("wcorwin-active-tab", tab);
  }, [tab]);

  useEffect(() => {
    const handler = (e) => setTab(e.detail);
    window.addEventListener("switch-tab", handler);
    return () => window.removeEventListener("switch-tab", handler);
  }, []);

  return (
    <>
      <Nav active={tab} onSwitch={setTab} />
      {tab === "journey" && <SEOJourneyTracker />}
      {tab === "health" && <SEOHealthTab />}
      {tab === "content" && <ContentTab />}
      {tab === "templates" && <TemplatesTab />}
      {tab === "invoice" && <InvoiceTab />}
    </>
  );
}
