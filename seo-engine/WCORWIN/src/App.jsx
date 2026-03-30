import { useState } from "react";
import SEOJourneyTracker from "./SEOJourneyTracker";
import SEOHealthTab from "./SEOHealthTab";
import { BG, INK, ACCENT, MUTED, WHITE, LIGHT } from "./data";

const font = "'DM Sans', 'Satoshi', -apple-system, sans-serif";
const mono = "'DM Mono', monospace";

function TabNav({ active, onSwitch }) {
  const pill = (id) => ({
    padding: "6px 18px",
    borderRadius: 100,
    fontSize: 13,
    fontWeight: active === id ? 600 : 400,
    background: active === id ? ACCENT : "transparent",
    color: active === id ? WHITE : MUTED,
    border: "none",
    cursor: "pointer",
    fontFamily: font,
    transition: "background 0.15s ease, color 0.15s ease",
    outline: "none",
  });

  return (
    <div
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: BG,
        borderBottom: `1px solid ${LIGHT}`,
        padding: "8px 20px",
        display: "flex",
        gap: 4,
        alignItems: "center",
      }}
    >
      <button style={pill("journey")} onClick={() => onSwitch("journey")}>
        Journey
      </button>
      <button style={pill("health")} onClick={() => onSwitch("health")}>
        SEO Health
      </button>
    </div>
  );
}

export default function App() {
  const [tab, setTab] = useState("journey");

  return (
    <>
      <TabNav active={tab} onSwitch={setTab} />
      {tab === "journey" && <SEOJourneyTracker />}
      {tab === "health" && <SEOHealthTab />}
    </>
  );
}
