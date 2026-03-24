"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useAuthActions } from "@convex-dev/auth/react";
import Link from "next/link";

/* ── Grain texture — same SVG noise as hero.tsx ─────────────────────── */
const GrainOverlay = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute inset-0 h-full w-full"
    style={{ opacity: 0.035, mixBlendMode: "multiply" }}
  >
    <filter id="signin-grain">
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.65"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
    </filter>
    <rect width="100%" height="100%" filter="url(#signin-grain)" />
  </svg>
);

/* ── Halftone dot cluster — decorative accent ───────────────────────── */
const HalftoneAccent = () => (
  <svg
    aria-hidden="true"
    className="pointer-events-none absolute bottom-12 right-10"
    width="140"
    height="140"
    viewBox="0 0 140 140"
    style={{ opacity: 0.06 }}
  >
    {Array.from({ length: 6 }, (_, row) =>
      Array.from({ length: 6 }, (_, col) => {
        const r = 1.2 + (row + col) * 0.38;
        return (
          <circle
            key={`${row}-${col}`}
            cx={col * 24 + 10}
            cy={row * 24 + 10}
            r={r}
            fill="rgba(22,16,8,1)"
          />
        );
      })
    )}
  </svg>
);

/* ── Brand panel (left column, desktop only) ────────────────────────── */
function BrandPanel() {
  return (
    <div
      className="signin-brand-panel"
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "clamp(2.5rem, 4vw, 4rem)",
        backgroundColor: "#fff4ea",
        overflow: "hidden",
        minHeight: "100vh",
      }}
    >
      <GrainOverlay />
      <HalftoneAccent />

      {/* Ambient warmth */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 70% 50% at 30% 70%, rgba(255,210,150,0.14) 0%, transparent 70%)",
        }}
      />

      {/* Top: wordmark */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <Link
          href="/"
          style={{
            fontFamily: "var(--font-spectral), Georgia, 'Times New Roman', serif",
            fontSize: "1.375rem",
            fontWeight: 400,
            fontStyle: "italic",
            color: "hsl(0, 0%, 8%)",
            letterSpacing: "-0.02em",
            textDecoration: "none",
          }}
        >
          fadejunkie
        </Link>
      </div>

      {/* Center: editorial quote */}
      <div style={{ position: "relative", zIndex: 1 }}>
        <p
          style={{
            fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
            fontSize: "0.625rem",
            fontWeight: 500,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "hsl(34, 42%, 44%)",
            marginBottom: "1.5rem",
          }}
        >
          The barber community
        </p>

        <h1
          style={{
            fontFamily: "var(--font-spectral), Georgia, 'Times New Roman', serif",
            fontSize: "clamp(2.25rem, 3.5vw, 3.5rem)",
            fontWeight: 300,
            fontStyle: "italic",
            letterSpacing: "-0.02em",
            lineHeight: 1.12,
            color: "hsl(0, 0%, 8%)",
            margin: 0,
            marginBottom: "1.25rem",
          }}
        >
          {"\u201C"}Every barber
          <br />
          remembers their
          <br />
          first clean fade.{"\u201D"}
        </h1>

        <p
          style={{
            fontFamily: "var(--font-inter), -apple-system, sans-serif",
            fontSize: "0.875rem",
            lineHeight: 1.6,
            color: "hsl(34, 20%, 38%)",
            maxWidth: "22rem",
          }}
        >
          This is for that feeling.
        </p>
      </div>

      {/* Bottom: social proof */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          display: "flex",
          alignItems: "center",
          gap: "0.75rem",
        }}
      >
        {/* Stacked avatars */}
        <div style={{ display: "flex", alignItems: "center" }}>
          {["JM", "DR", "KH", "MT"].map((initials, i) => (
            <div
              key={initials}
              style={{
                width: 30,
                height: 30,
                borderRadius: "50%",
                backgroundColor:
                  i % 2 === 0 ? "rgba(22,16,8,0.09)" : "rgba(22,16,8,0.06)",
                border: "1.5px solid #fff4ea",
                marginLeft: i > 0 ? -8 : 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                zIndex: 4 - i,
                position: "relative",
              }}
            >
              <span
                style={{
                  fontFamily: "var(--font-spectral), Georgia, serif",
                  fontSize: "0.5rem",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "rgba(22,16,8,0.55)",
                }}
              >
                {initials}
              </span>
            </div>
          ))}
        </div>

        <div>
          <p
            style={{
              fontFamily: "var(--font-inter), -apple-system, sans-serif",
              fontSize: "0.8125rem",
              fontWeight: 600,
              color: "hsl(0, 0%, 8%)",
              letterSpacing: "-0.01em",
              lineHeight: 1.3,
            }}
          >
            2,400+ barbers already in
          </p>
          <p
            style={{
              fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
              fontSize: "0.5rem",
              fontWeight: 500,
              letterSpacing: "0.13em",
              textTransform: "uppercase",
              color: "hsl(34, 22%, 44%)",
              marginTop: "0.2rem",
            }}
          >
            Free to join
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Sign-in form ───────────────────────────────────────────────────── */
function SignInForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signIn } = useAuthActions();

  const initialTab = searchParams.get("mode") === "signup" ? "signup" : "signin";
  const [tab, setTab] = useState(initialTab);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await signIn("password", { email, password, flow: tab === "signup" ? "signUp" : "signIn" });
      router.push("/home");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="signin-page-root"
      style={{ backgroundColor: "#fff4ea", minHeight: "100vh" }}
    >
      {/* Two-column layout: brand (left) + form (right) */}
      <div className="signin-layout">
        {/* Brand panel — desktop only */}
        <BrandPanel />

        {/* Form panel */}
        <div
          className="signin-form-panel"
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "3rem clamp(1.5rem, 5vw, 3.5rem)",
            minHeight: "100vh",
            backgroundColor: "rgba(22,16,8,0.025)",
            position: "relative",
          }}
        >
          <div style={{ width: "100%", maxWidth: 380 }}>
            {/* Wordmark + subtitle (always visible — acts as header on mobile) */}
            <div style={{ marginBottom: "2.5rem" }}>
              <Link
                href="/"
                style={{
                  fontFamily: "var(--font-spectral), Georgia, 'Times New Roman', serif",
                  fontSize: "1.5rem",
                  fontWeight: 400,
                  fontStyle: "italic",
                  color: "hsl(0, 0%, 8%)",
                  letterSpacing: "-0.02em",
                  textDecoration: "none",
                  display: "block",
                  marginBottom: "0.375rem",
                }}
              >
                fadejunkie
              </Link>
              <p
                style={{
                  fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                  fontSize: "0.5rem",
                  fontWeight: 500,
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "hsl(34, 22%, 44%)",
                }}
              >
                The barber community
              </p>
            </div>

            {/* Tab switcher */}
            <div
              style={{
                display: "flex",
                gap: 0,
                marginBottom: "2rem",
                borderBottom: "1px solid rgba(22,16,8,0.1)",
              }}
            >
              {(["signin", "signup"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  style={{
                    flex: 1,
                    padding: "0.75rem 0",
                    fontFamily: "var(--font-inter), -apple-system, sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: tab === t ? 600 : 400,
                    color: tab === t ? "hsl(0, 0%, 8%)" : "hsl(34, 20%, 50%)",
                    background: "transparent",
                    border: "none",
                    borderBottom:
                      tab === t
                        ? "2px solid hsl(0, 0%, 8%)"
                        : "2px solid transparent",
                    cursor: "pointer",
                    transition: "color 0.15s ease, border-color 0.15s ease",
                    marginBottom: "-1px",
                  }}
                >
                  {t === "signin" ? "Sign in" : "Sign up"}
                </button>
              ))}
            </div>

            {/* Form */}
            <form
              onSubmit={handleSubmit}
              style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}
            >
              {/* Email */}
              <div>
                <label
                  htmlFor="signin-email"
                  style={{
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                    fontSize: "0.5625rem",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "hsl(34, 22%, 44%)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Email
                </label>
                <input
                  id="signin-email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete={tab === "signup" ? "email" : "username"}
                  className="signin-input"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.875rem",
                    fontFamily: "var(--font-inter), -apple-system, sans-serif",
                    fontSize: "0.875rem",
                    color: "hsl(0, 0%, 8%)",
                    backgroundColor: "#fff4ea",
                    border: "1px solid rgba(22,16,8,0.15)",
                    borderRadius: "0.625rem",
                    outline: "none",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  }}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="signin-password"
                  style={{
                    fontFamily: "var(--font-geist-mono), ui-monospace, monospace",
                    fontSize: "0.5625rem",
                    fontWeight: 500,
                    letterSpacing: "0.14em",
                    textTransform: "uppercase",
                    color: "hsl(34, 22%, 44%)",
                    display: "block",
                    marginBottom: "0.5rem",
                  }}
                >
                  Password
                </label>
                <input
                  id="signin-password"
                  type="password"
                  placeholder={tab === "signup" ? "Create a password" : "Your password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete={tab === "signup" ? "new-password" : "current-password"}
                  className="signin-input"
                  style={{
                    width: "100%",
                    padding: "0.75rem 0.875rem",
                    fontFamily: "var(--font-inter), -apple-system, sans-serif",
                    fontSize: "0.875rem",
                    color: "hsl(0, 0%, 8%)",
                    backgroundColor: "#fff4ea",
                    border: "1px solid rgba(22,16,8,0.15)",
                    borderRadius: "0.625rem",
                    outline: "none",
                    transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                  }}
                />
              </div>

              {/* Error */}
              {error && (
                <p
                  style={{
                    fontFamily: "var(--font-inter), -apple-system, sans-serif",
                    fontSize: "0.8125rem",
                    color: "hsl(0, 65%, 48%)",
                    backgroundColor: "hsla(0, 70%, 50%, 0.06)",
                    border: "1px solid hsla(0, 70%, 50%, 0.12)",
                    borderRadius: "0.625rem",
                    padding: "0.625rem 0.875rem",
                    margin: 0,
                  }}
                >
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="signin-submit"
                style={{
                  width: "100%",
                  padding: "0.875rem 1.75rem",
                  backgroundColor: "hsl(0, 0%, 8%)",
                  color: "#fff4ea",
                  borderRadius: "0.625rem",
                  fontFamily: "var(--font-inter), -apple-system, sans-serif",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.65 : 1,
                  transition: "background-color 0.15s ease, transform 0.12s ease, opacity 0.15s ease",
                  marginTop: "0.25rem",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                }}
              >
                {loading && (
                  <svg
                    className="signin-spinner"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.25"
                    />
                    <path
                      d="M4 12a8 8 0 018-8"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      opacity="0.75"
                    />
                  </svg>
                )}
                {tab === "signup" ? "Create account" : "Sign in"}
              </button>
            </form>

            {/* Toggle link */}
            <p
              style={{
                textAlign: "center",
                fontFamily: "var(--font-inter), -apple-system, sans-serif",
                fontSize: "0.8125rem",
                color: "hsl(34, 18%, 42%)",
                marginTop: "1.75rem",
              }}
            >
              {tab === "signup" ? (
                <>
                  Already have an account?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("signin")}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      fontWeight: 600,
                      color: "hsl(34, 42%, 44%)",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                    className="signin-toggle-link"
                  >
                    Sign in
                  </button>
                </>
              ) : (
                <>
                  New to fadejunkie?{" "}
                  <button
                    type="button"
                    onClick={() => setTab("signup")}
                    style={{
                      background: "none",
                      border: "none",
                      padding: 0,
                      fontFamily: "inherit",
                      fontSize: "inherit",
                      fontWeight: 600,
                      color: "hsl(34, 42%, 44%)",
                      cursor: "pointer",
                      textDecoration: "none",
                    }}
                    className="signin-toggle-link"
                  >
                    Create account
                  </button>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {/* ── Scoped styles ─────────────────────────────────────────────── */}
      <style>{`
        /* Two-column on desktop */
        .signin-layout {
          display: grid;
          grid-template-columns: 1fr;
          min-height: 100vh;
        }
        @media (min-width: 768px) {
          .signin-layout {
            grid-template-columns: 45fr 55fr;
          }
        }

        /* Brand panel hidden on mobile */
        .signin-brand-panel {
          display: none !important;
        }
        @media (min-width: 768px) {
          .signin-brand-panel {
            display: flex !important;
          }
        }

        /* Input focus states — warm, not blue */
        .signin-input:focus {
          border-color: rgba(22, 16, 8, 0.35) !important;
          box-shadow: 0 0 0 3px rgba(22, 16, 8, 0.06) !important;
        }
        .signin-input::placeholder {
          color: rgba(22, 16, 8, 0.3);
        }

        /* Submit hover */
        .signin-submit:hover:not(:disabled) {
          background-color: hsl(0, 0%, 16%) !important;
          transform: translateY(-1px);
        }
        .signin-submit:active:not(:disabled) {
          transform: translateY(0px);
        }

        /* Toggle link hover */
        .signin-toggle-link:hover {
          text-decoration: underline;
        }

        /* Spinner */
        @keyframes signin-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .signin-spinner {
          animation: signin-spin 0.7s linear infinite;
        }

        /* Mobile form panel adjustments */
        @media (max-width: 767px) {
          .signin-form-panel {
            min-height: 100dvh !important;
            padding-top: 4rem !important;
            padding-bottom: 4rem !important;
          }
        }
      `}</style>
    </div>
  );
}

/* ── Page export ─────────────────────────────────────────────────────── */
export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
