import { useState } from "react";
import AllisonHub, { DiscoveryPage, WebsitePage } from "./AllisonHub";

const OPS_HOSTNAME = "allisonbond-ops.anthonytatis.com";
const AUTH_KEY = "ab_auth";
const VALID_USER = "allison";
const VALID_PASS = "terphead";

function LoginGate({ onAuth }: { onAuth: () => void }) {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (user.trim().toLowerCase() === VALID_USER && pass === VALID_PASS) {
      sessionStorage.setItem(AUTH_KEY, "1");
      onAuth();
    } else {
      setError(true);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif" }}>
      <div style={{ background: "#1a2844", border: "1px solid #2d3f6b", borderRadius: 12, padding: "40px 36px", width: "100%", maxWidth: 360 }}>
        <div style={{ fontSize: 10, color: "#c9a227", letterSpacing: 5, marginBottom: 6 }}>BOND AGENCY</div>
        <div style={{ fontSize: 20, fontWeight: 800, color: "#f1f5f9", marginBottom: 28, fontFamily: "'Playfair Display', serif" }}>Project Hub</div>

        <div style={{ marginBottom: 16 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>USERNAME</div>
          <input
            type="text"
            value={user}
            onChange={e => { setUser(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            autoComplete="username"
            style={{ width: "100%", padding: "10px 14px", background: "#243259", border: `1px solid ${error ? "#ef4444" : "#2d3f6b"}`, borderRadius: 6, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", marginBottom: 6 }}>PASSWORD</div>
          <input
            type="password"
            value={pass}
            onChange={e => { setPass(e.target.value); setError(false); }}
            onKeyDown={e => e.key === "Enter" && submit()}
            autoComplete="current-password"
            style={{ width: "100%", padding: "10px 14px", background: "#243259", border: `1px solid ${error ? "#ef4444" : "#2d3f6b"}`, borderRadius: 6, color: "#f1f5f9", fontSize: 14, outline: "none", boxSizing: "border-box" }}
          />
          {error && <div style={{ fontSize: 11, color: "#ef4444", marginTop: 6 }}>Invalid credentials</div>}
        </div>

        <button
          onClick={submit}
          style={{ width: "100%", padding: "11px", fontSize: 13, fontWeight: 700, background: "#1a2c4e", color: "#fff", border: "none", borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}
        >
          Sign In →
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const hostname = window.location.hostname;
  const isOps = hostname === OPS_HOSTNAME || hostname === "localhost";
  const path = window.location.pathname;
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(AUTH_KEY) === "1");

  if (path === "/discovery" || path === "/discovery/") {
    return <DiscoveryPage />;
  }

  if (path === "/site-preview" || path === "/site-preview/") {
    return (
      <div style={{ minHeight: "100vh", background: "#f1f5f9", padding: "32px 24px" }}>
        <div style={{ maxWidth: 960, margin: "0 auto" }}>
          <div style={{ fontSize: 11, color: "#64748b", fontFamily: "Inter,sans-serif", letterSpacing: 2, marginBottom: 8 }}>BOND AGENCY — SITE PREVIEW</div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", fontFamily: "Inter,sans-serif", marginBottom: 20 }}>Landing Page Preview</div>
          <WebsitePage />
        </div>
      </div>
    );
  }

  if (!authed) {
    return <LoginGate onAuth={() => setAuthed(true)} />;
  }

  return <AllisonHub defaultView={isOps ? "internal" : "client"} opsMode={isOps} />;
}
