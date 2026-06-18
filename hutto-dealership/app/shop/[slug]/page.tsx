"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { formatPrice } from "@/lib/cart";
import Image from "next/image";
import Link from "next/link";
import { useState, use } from "react";

function formatMileage(miles: number) {
  return miles.toLocaleString() + " miles";
}

// ─── Agent Contact Form ─────────────────────────────────────────────────────
function AgentForm({
  vehicleId,
  vehicleName,
  defaultType = "question",
  compact = false,
}: {
  vehicleId?: string;
  vehicleName: string;
  defaultType?: string;
  compact?: boolean;
}) {
  const submitLead = useMutation(api.leads.submit);
  const [type, setType] = useState(defaultType);
  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  function set(field: keyof typeof form, val: string) {
    setForm((f) => ({ ...f, [field]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await submitLead({
        vehicleId,
        vehicleName,
        name: form.name,
        phone: form.phone,
        email: form.email,
        message: form.message || undefined,
        type,
      });
      setStatus("done");
    } catch {
      setStatus("error");
    }
  }

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: compact ? "8px 10px" : "10px 12px",
    border: "1.5px solid var(--hairline)",
    borderRadius: "4px",
    fontSize: "14px",
    color: "var(--on-dark)",
    background: "var(--canvas)",
    outline: "none",
    fontFamily: "var(--font-body)",
    transition: "border-color 0.15s",
  };

  if (status === "done") {
    return (
      <div
        style={{
          background: "#f0fdf4",
          border: "1.5px solid #86efac",
          borderRadius: "6px",
          padding: compact ? "16px" : "24px",
          textAlign: "center",
        }}
      >
        <p style={{ color: "#15803d", fontWeight: 700, fontSize: "15px", marginBottom: "4px" }}>
          Message Received!
        </p>
        <p style={{ color: "#166534", fontSize: "13px" }}>
          We'll reach out within 1 business hour. Thanks, {form.name.split(" ")[0]}.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: compact ? "10px" : "14px" }}>
      {/* Type toggle */}
      <div style={{ display: "flex", gap: "6px" }}>
        {[
          { value: "test-drive", label: "Test Drive" },
          { value: "question", label: "Question" },
          { value: "offer", label: "Make Offer" },
        ].map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setType(opt.value)}
            style={{
              flex: 1,
              padding: "7px 4px",
              borderRadius: "4px",
              border: `1.5px solid ${type === opt.value ? "var(--accent)" : "var(--hairline)"}`,
              background: type === opt.value ? "var(--accent)" : "transparent",
              color: type === opt.value ? "#fff" : "var(--muted)",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "0.3px",
              cursor: "pointer",
              transition: "all 0.15s",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Name + Phone */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
        <input
          required
          placeholder="Your name"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        />
        <input
          required
          type="tel"
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => set("phone", e.target.value)}
          style={inputStyle}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        />
      </div>

      {/* Email */}
      <input
        required
        type="email"
        placeholder="Email address"
        value={form.email}
        onChange={(e) => set("email", e.target.value)}
        style={inputStyle}
        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
      />

      {/* Message (skipped in compact mode unless offer) */}
      {(!compact || type === "offer") && (
        <textarea
          placeholder={
            type === "test-drive"
              ? "Best time to come in? Any questions?"
              : type === "offer"
              ? "Your offer amount or financing question…"
              : "What would you like to know?"
          }
          value={form.message}
          onChange={(e) => set("message", e.target.value)}
          style={{ ...inputStyle, resize: "none", height: compact ? "64px" : "80px" }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--accent)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--hairline)")}
        />
      )}

      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          background: "var(--accent)",
          color: "#fff",
          border: "none",
          borderRadius: "4px",
          padding: compact ? "10px" : "13px",
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "14px",
          letterSpacing: "0.3px",
          cursor: status === "sending" ? "wait" : "pointer",
          opacity: status === "sending" ? 0.7 : 1,
          transition: "opacity 0.15s",
        }}
      >
        {status === "sending" ? "Sending…" : "Send Message"}
      </button>

      {status === "error" && (
        <p style={{ color: "#dc2626", fontSize: "12px", textAlign: "center" }}>
          Something went wrong. Call us at (512) 855-0000.
        </p>
      )}

      <p style={{ color: "var(--muted)", fontSize: "11px", textAlign: "center" }}>
        We respond within 1 business hour · No spam, ever
      </p>
    </form>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────
export default function VehiclePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const product = useQuery(api.products.getBySlug, { slug });
  const [activeImage, setActiveImage] = useState(0);
  const [mobileFormOpen, setMobileFormOpen] = useState(false);

  const skeletonStyle: React.CSSProperties = {
    background: "var(--surface-card)",
    borderRadius: "6px",
    animation: "pulse 1.5s ease-in-out infinite",
  };

  if (product === undefined) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
          <div style={{ display: "grid", gap: "48px" }} className="md:grid-cols-2">
            <div style={{ aspectRatio: "16 / 10", ...skeletonStyle }} />
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              <div style={{ height: "40px", width: "66%", ...skeletonStyle }} />
              <div style={{ height: "28px", width: "25%", ...skeletonStyle }} />
              <div style={{ height: "120px", ...skeletonStyle }} />
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <main style={{ flex: 1, maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
          <p style={{ color: "var(--muted)" }}>Vehicle not found.</p>
          <Link href="/shop" style={{ color: "var(--accent)", fontSize: "14px" }}>← Back to inventory</Link>
        </main>
        <Footer />
      </>
    );
  }

  const isVehicle = !!(product.year || product.make);
  const title = isVehicle && product.year && product.make && product.model
    ? `${product.year} ${product.make} ${product.model}`
    : product.name;
  const subtitle = product.trim ?? null;

  const specs: { label: string; value: string }[] = [];
  if (product.year) specs.push({ label: "Year", value: String(product.year) });
  if (product.make) specs.push({ label: "Make", value: product.make });
  if (product.model) specs.push({ label: "Model", value: product.model });
  if (product.trim) specs.push({ label: "Trim", value: product.trim });
  if (product.bodyType) specs.push({ label: "Body Type", value: product.bodyType });
  if (product.condition) specs.push({ label: "Condition", value: product.condition });
  if (product.mileage != null) specs.push({ label: "Mileage", value: formatMileage(product.mileage) });
  if (product.transmission) specs.push({ label: "Transmission", value: product.transmission });
  if (product.exteriorColor) specs.push({ label: "Exterior Color", value: product.exteriorColor });
  if (product.vin) specs.push({ label: "VIN", value: product.vin });

  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: "var(--canvas)" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "32px 24px 120px" }}>

          {/* Breadcrumb */}
          <div style={{ marginBottom: "20px", display: "flex", gap: "8px", alignItems: "center" }}>
            <Link href="/shop" style={{ color: "var(--muted)", fontSize: "13px", textDecoration: "none" }}>
              Inventory
            </Link>
            <span style={{ color: "var(--hairline)" }}>›</span>
            <span style={{ color: "var(--body)", fontSize: "13px" }}>{title}</span>
          </div>

          {/* Main layout: images left | info right */}
          <div style={{ display: "grid", gap: "48px" }} className="md:grid-cols-2">

            {/* ── LEFT: Images ──────────────────────────────────── */}
            <div>
              <div
                style={{
                  aspectRatio: "16 / 10",
                  overflow: "hidden",
                  borderRadius: "8px",
                  background: "var(--surface-card)",
                  marginBottom: "10px",
                }}
              >
                {product.images[activeImage] ? (
                  <Image
                    src={product.images[activeImage]}
                    alt={title}
                    width={800}
                    height={500}
                    style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "8px", display: "block" }}
                  />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--hairline)" }}>
                    <svg width="80" height="50" viewBox="0 0 80 50" fill="none" stroke="currentColor" strokeWidth="1.5">
                      <path d="M5 35h70M10 35V42M70 35V42M18 35l8-13h30l8 13" strokeLinecap="round" strokeLinejoin="round" />
                      <circle cx="22" cy="38" r="4" />
                      <circle cx="58" cy="38" r="4" />
                    </svg>
                  </div>
                )}
              </div>

              {product.images.length > 1 && (
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      style={{
                        width: "72px",
                        height: "48px",
                        borderRadius: "4px",
                        overflow: "hidden",
                        border: `2px solid ${activeImage === i ? "var(--accent)" : "var(--hairline)"}`,
                        background: "none",
                        cursor: "pointer",
                        padding: 0,
                        transition: "border-color 0.15s",
                      }}
                    >
                      <Image src={img} alt="" width={72} height={48} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                    </button>
                  ))}
                </div>
              )}

              {/* ── INLINE FORM: below images on desktop ── */}
              <div
                className="hidden md:block"
                style={{
                  marginTop: "32px",
                  background: "var(--surface-soft)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "8px",
                  padding: "20px",
                }}
              >
                <p
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "13px",
                    letterSpacing: "0.3px",
                    color: "var(--on-dark)",
                    marginBottom: "14px",
                  }}
                >
                  Talk to an Agent
                </p>
                <p style={{ color: "var(--muted)", fontSize: "12px", marginBottom: "14px" }}>
                  About the {title}
                </p>
                <AgentForm
                  vehicleId={product._id}
                  vehicleName={title}
                  defaultType="test-drive"
                  compact
                />
              </div>
            </div>

            {/* ── RIGHT: Vehicle info + sticky agent form ──────── */}
            <div>
              {/* Condition badge */}
              {product.condition && (
                <span
                  style={{
                    display: "inline-block",
                    background:
                      product.condition === "New" ? "var(--accent)"
                      : product.condition === "Certified Pre-Owned" ? "#1a7f4b"
                      : "#495057",
                    color: "#fff",
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.8px",
                    textTransform: "uppercase",
                    padding: "3px 9px",
                    borderRadius: "3px",
                    marginBottom: "12px",
                  }}
                >
                  {product.condition}
                </span>
              )}

              <h1
                style={{
                  fontFamily: "var(--font-display)",
                  fontWeight: 700,
                  fontSize: "clamp(24px, 4vw, 36px)",
                  letterSpacing: "-0.5px",
                  color: "var(--on-dark)",
                  marginBottom: "4px",
                  lineHeight: 1.1,
                }}
              >
                {title}
              </h1>

              {subtitle && (
                <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "16px" }}>{subtitle}</p>
              )}

              {/* Price */}
              <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "16px" }}>
                <span style={{ color: "var(--accent)", fontWeight: 700, fontSize: "30px" }}>
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && product.compareAtPrice > product.price && (
                  <span style={{ color: "var(--muted)", fontWeight: 400, fontSize: "18px", textDecoration: "line-through" }}>
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>

              {/* Quick stats bar */}
              <div
                style={{
                  display: "flex",
                  gap: "20px",
                  padding: "12px 16px",
                  background: "var(--surface-soft)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "6px",
                  marginBottom: "20px",
                  flexWrap: "wrap",
                }}
              >
                {product.mileage != null && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px" }}>🛣</span>
                    <span style={{ color: "var(--body)", fontSize: "13px", fontWeight: 600 }}>
                      {formatMileage(product.mileage)}
                    </span>
                  </div>
                )}
                {product.transmission && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px" }}>⚙️</span>
                    <span style={{ color: "var(--body)", fontSize: "13px", fontWeight: 600 }}>
                      {product.transmission}
                    </span>
                  </div>
                )}
                {product.exteriorColor && (
                  <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={{ fontSize: "14px" }}>🎨</span>
                    <span style={{ color: "var(--body)", fontSize: "13px", fontWeight: 600 }}>
                      {product.exteriorColor}
                    </span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <p style={{ color: "var(--body)", lineHeight: 1.75, fontSize: "15px", marginBottom: "24px" }}>
                  {product.description}
                </p>
              )}

              {/* Primary CTAs */}
              {product.inStock ? (
                <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
                  <button
                    onClick={() => setMobileFormOpen(true)}
                    className="md:hidden"
                    style={{
                      flex: 1,
                      minWidth: "140px",
                      height: "48px",
                      background: "var(--accent)",
                      color: "#fff",
                      border: "none",
                      borderRadius: "4px",
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "14px",
                      cursor: "pointer",
                    }}
                  >
                    Talk to an Agent
                  </button>
                  <a
                    href="tel:+15128550000"
                    style={{
                      flex: 1,
                      minWidth: "120px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      height: "48px",
                      background: "transparent",
                      color: "var(--on-dark)",
                      fontFamily: "var(--font-display)",
                      fontWeight: 600,
                      fontSize: "14px",
                      textDecoration: "none",
                      borderRadius: "4px",
                      border: "1.5px solid var(--hairline)",
                      gap: "6px",
                      transition: "border-color 0.15s",
                    }}
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                    </svg>
                    (512) 855-0000
                  </a>
                </div>
              ) : (
                <div style={{ padding: "14px 16px", background: "var(--surface-card)", border: "1px solid var(--hairline)", borderRadius: "4px", color: "var(--muted)", fontSize: "14px", fontWeight: 600, marginBottom: "28px" }}>
                  This vehicle has been sold
                </div>
              )}

              {/* Specs table */}
              {specs.length > 0 && (
                <div
                  style={{
                    background: "var(--surface-soft)",
                    border: "1px solid var(--hairline)",
                    borderRadius: "6px",
                    overflow: "hidden",
                    marginBottom: "28px",
                  }}
                >
                  <p
                    style={{
                      fontFamily: "var(--font-display)",
                      fontWeight: 700,
                      fontSize: "11px",
                      letterSpacing: "1px",
                      textTransform: "uppercase",
                      color: "var(--muted)",
                      padding: "12px 16px",
                      borderBottom: "1px solid var(--hairline)",
                      margin: 0,
                    }}
                  >
                    Vehicle Details
                  </p>
                  <table style={{ width: "100%", borderCollapse: "collapse" }}>
                    <tbody>
                      {specs.map((s, i) => (
                        <tr key={s.label} style={{ borderBottom: i < specs.length - 1 ? "1px solid var(--hairline)" : "none" }}>
                          <td style={{ padding: "10px 16px", color: "var(--muted)", fontSize: "13px", fontWeight: 600, width: "40%" }}>{s.label}</td>
                          <td style={{ padding: "10px 16px", color: "var(--on-dark)", fontSize: "13px" }}>{s.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* ── INLINE AGENT FORM: right column, below specs, desktop only ── */}
              {product.inStock && (
                <div
                  className="hidden md:block"
                  style={{
                    background: "#f0f4ff",
                    border: "1.5px solid #c7d7f5",
                    borderRadius: "8px",
                    padding: "20px",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "50%",
                        background: "var(--accent)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                      </svg>
                    </div>
                    <div>
                      <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--on-dark)", margin: 0 }}>
                        Talk to an Agent
                      </p>
                      <p style={{ color: "var(--muted)", fontSize: "12px", margin: 0 }}>
                        Questions about this {product.year} {product.make}? We're here.
                      </p>
                    </div>
                  </div>
                  <div style={{ height: "1px", background: "#c7d7f5", margin: "14px 0" }} />
                  <AgentForm
                    vehicleId={product._id}
                    vehicleName={title}
                    defaultType="question"
                    compact={false}
                  />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── MOBILE STICKY BAR ─────────────────────────────────────────────── */}
        {product.inStock && (
          <div
            className="md:hidden"
            style={{
              position: "fixed",
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 40,
              background: "var(--canvas)",
              borderTop: "1px solid var(--hairline)",
              boxShadow: "0 -4px 20px rgba(0,0,0,0.08)",
            }}
          >
            {/* Expanded form */}
            {mobileFormOpen && (
              <div style={{ padding: "16px 20px", maxHeight: "80vh", overflowY: "auto" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--on-dark)", margin: 0 }}>
                    Talk to an Agent
                  </p>
                  <button
                    onClick={() => setMobileFormOpen(false)}
                    style={{ background: "none", border: "none", cursor: "pointer", color: "var(--muted)", padding: 0 }}
                  >
                    <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <AgentForm vehicleId={product._id} vehicleName={title} defaultType="test-drive" compact />
              </div>
            )}

            {/* Collapsed bar */}
            {!mobileFormOpen && (
              <div style={{ padding: "12px 20px", display: "flex", gap: "10px" }}>
                <button
                  onClick={() => setMobileFormOpen(true)}
                  style={{
                    flex: 1,
                    height: "46px",
                    background: "var(--accent)",
                    color: "#fff",
                    border: "none",
                    borderRadius: "4px",
                    fontFamily: "var(--font-display)",
                    fontWeight: 700,
                    fontSize: "14px",
                    cursor: "pointer",
                  }}
                >
                  Talk to an Agent
                </button>
                <a
                  href="tel:+15128550000"
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "46px",
                    width: "46px",
                    background: "var(--surface-card)",
                    border: "1.5px solid var(--hairline)",
                    borderRadius: "4px",
                    color: "var(--on-dark)",
                    textDecoration: "none",
                  }}
                >
                  <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
                  </svg>
                </a>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
