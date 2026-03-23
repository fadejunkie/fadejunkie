import { useState } from "react";
import { checkAuth, login, logout } from "./auth";
import SEOJourneyTracker from "./SEOJourneyTracker";

const ACCENT = "#e8541a";
const INK = "#111111";
const WHITE = "#ffffff";
const LIGHT = "#e5e5e5";
const MUTED = "#999999";
const BG = "#fafaf9";

function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTimeout(() => {
      if (login(email, password)) {
        onLogin();
      } else {
        setError("Invalid credentials. Please try again.");
        setLoading(false);
      }
    }, 300);
  }

  return (
    <div style={{
      fontFamily: "'DM Sans', -apple-system, sans-serif",
      background: BG, minHeight: "100vh", color: INK,
      display: "flex", flexDirection: "column",
    }}>
      {/* Top Bar */}
      <div style={{
        background: INK, padding: "14px 24px", display: "flex",
        alignItems: "center", justifyContent: "space-between",
        borderBottom: `3px solid ${ACCENT}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 8, height: 8, borderRadius: "50%",
            background: ACCENT, boxShadow: `0 0 8px ${ACCENT}`,
          }} />
          <span style={{
            color: WHITE, fontFamily: "'DM Mono', monospace",
            fontSize: 13, fontWeight: 500, letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}>
            wcorwin.com SEO ENGINE
          </span>
        </div>
        <span style={{
          color: "rgba(255,255,255,0.4)", fontSize: 11,
          fontFamily: "'DM Mono', monospace",
        }}>
          Anthony's SEO Engine
        </span>
      </div>

      {/* Login Form */}
      <div style={{
        flex: 1, display: "flex", alignItems: "center", justifyContent: "center",
        padding: 24,
      }}>
        <div style={{
          background: WHITE, borderRadius: 12,
          border: `1px solid ${LIGHT}`, padding: "32px 40px",
          width: "100%", maxWidth: 400,
          boxShadow: "0 2px 16px rgba(0,0,0,0.06)",
        }}>
          <div style={{ marginBottom: 28 }}>
            <div style={{
              fontSize: 11, color: MUTED, fontFamily: "'DM Mono', monospace",
              fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.05em",
              marginBottom: 6,
            }}>
              Client Portal
            </div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>Sign in to your tracker</div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 16 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600,
                marginBottom: 6, color: INK,
              }}>
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
                style={{
                  width: "100%", padding: "10px 12px",
                  border: `1px solid ${LIGHT}`, borderRadius: 8,
                  fontSize: 14, fontFamily: "inherit",
                  outline: "none", color: INK, background: WHITE,
                }}
              />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={{
                display: "block", fontSize: 12, fontWeight: 600,
                marginBottom: 6, color: INK,
              }}>
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                style={{
                  width: "100%", padding: "10px 12px",
                  border: `1px solid ${LIGHT}`, borderRadius: 8,
                  fontSize: 14, fontFamily: "inherit",
                  outline: "none", color: INK, background: WHITE,
                }}
              />
            </div>

            {error && (
              <div style={{
                marginBottom: 16, padding: "10px 12px",
                background: "rgba(220, 38, 38, 0.08)",
                border: "1px solid rgba(220, 38, 38, 0.2)",
                borderRadius: 8, fontSize: 13, color: "#dc2626",
              }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%", padding: "12px",
                background: ACCENT, color: WHITE,
                border: "none", borderRadius: 8,
                fontSize: 14, fontWeight: 600,
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                fontFamily: "inherit",
                transition: "opacity 0.15s",
              }}
            >
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [authed, setAuthed] = useState(checkAuth());

  if (!authed) {
    return <LoginScreen onLogin={() => setAuthed(true)} />;
  }

  return <SEOJourneyTracker onLogout={() => { logout(); setAuthed(false); }} />;
}
