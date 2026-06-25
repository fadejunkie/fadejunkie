// @ts-nocheck
import React, { useState } from "react";

/* ══════════════════════════════════════════
   DESIGN TOKENS — from DESIGN.md
══════════════════════════════════════════ */
const GOLD       = "#C9A84C";
const GOLD_LIGHT = "#E8C96A";
const GOLD_DIM   = "#8A6E2E";
const GREEN      = "#22c55e";
const ERROR      = "#E55353";

// Dark theme (canonical brand — DESIGN.md)
const DARK = {
  mode: "dark",
  canvas:    "#000000",
  soft:      "#0A0A0A",
  card:      "#111111",
  elevated:  "#1C1C1C",
  hairline:  "#2A2A2A",
  onDark:    "#FFFFFF",
  bodyStrong:"#E6E6E6",
  body:      "#BBBBBB",
  muted:     "#7E7E7E",
  cream:     "#FFF8F0",
};

// Light theme (cream-forward, for preview readability)
const LIGHT = {
  mode: "light",
  canvas:    "#FFF8F0",
  soft:      "#F5EFE8",
  card:      "#FFFFFF",
  elevated:  "#F0E8DF",
  hairline:  "#E2D9CE",
  onDark:    "#0A0A0A",
  bodyStrong:"#1C1C1C",
  body:      "#555555",
  muted:     "#999999",
  cream:     "#FFF8F0",
};

const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #000; }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #2A2A2A; border-radius: 4px; }
  button, a { -webkit-tap-highlight-color: transparent; }
  .bb-heading { text-wrap: balance; }
  .bb-body    { text-wrap: pretty; }
  .bb-price   { font-variant-numeric: tabular-nums; }

  /* ─ Chrome label hidden on mobile ─ */
  .bb-chrome-label { display: flex; }
  .bb-chrome-dots  { display: flex; }

  /* ─ Nav layout ─ */
  .bb-sitenav { display: flex; align-items: center; justify-content: space-between; height: 64px; }
  .bb-deskcat { display: flex; align-items: center; gap: 4px; }
  .bb-mobcat  { display: none; }

  /* ─ Product grid ─ */
  .bb-pgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; }

  /* ─ Category grid ─ */
  .bb-cgrid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }

  /* ─ Footer cols ─ */
  .bb-footer-inner { display: flex; justify-content: space-between; gap: 32px; flex-wrap: wrap; margin-bottom: 32px; }
  .bb-footer-links { display: flex; gap: 48px; }

  /* ─ Outer padding ─ */
  .bb-outer { padding-left: 2rem; padding-right: 2rem; }
  .bb-hero-inner { max-width: 1280px; margin: 0 auto; }
  .bb-section-inner { max-width: 1280px; margin: 0 auto; }

  /* ─ Button transitions ─ */
  .bb-btn-primary   { transition: background 0.2s ease, transform 0.15s ease; cursor: pointer; }
  .bb-btn-primary:hover   { background: ${GOLD_LIGHT} !important; }
  .bb-btn-primary:active  { transform: scale(0.97); }
  .bb-btn-outlined  { transition: background 0.2s ease, transform 0.15s ease; cursor: pointer; }
  .bb-btn-outlined:hover  { background: rgba(201,168,76,0.08) !important; }
  .bb-btn-outlined:active { transform: scale(0.97); }

  /* ─ Card hover ─ */
  .bb-card { transition: border-color 0.2s ease; }
  .bb-card:hover { border-color: rgba(201,168,76,0.4) !important; }

  /* ─ Sub-nav pills ─ */
  .bb-pill { transition: background 0.15s ease, color 0.15s ease, border-color 0.15s ease; }

  /* ─ Mobile ─ */
  @media (max-width: 639px) {
    .bb-chrome-label { display: none; }
    .bb-chrome-dots  { display: none; }
    .bb-sitenav { height: auto; flex-wrap: wrap; padding: 10px 0 0; }
    .bb-deskcat { display: none; }
    .bb-mobcat  { display: flex; width: 100%; overflow-x: auto; scrollbar-width: none; border-top: 1px solid; padding: 2px 0; }
    .bb-mobcat::-webkit-scrollbar { display: none; }
    .bb-pgrid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
    .bb-cgrid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
    .bb-outer { padding-left: 1rem; padding-right: 1rem; }
    .bb-footer-inner { flex-direction: column; gap: 24px; }
    .bb-footer-links { gap: 24px; }
  }
  @media (min-width: 640px) and (max-width: 1023px) {
    .bb-pgrid { grid-template-columns: repeat(3, 1fr); }
    .bb-outer { padding-left: 1.5rem; padding-right: 1.5rem; }
  }
`;

/* ══════════════════════════════════════════
   DATA
══════════════════════════════════════════ */
const CATS = [
  { id: "all",      label: "All Products" },
  { id: "hair",     label: "Hair Care" },
  { id: "barber",   label: "Barber Supplies" },
  { id: "wigs",     label: "Wigs & Extensions" },
  { id: "tools",    label: "Styling Tools" },
  { id: "pro",      label: "Pro Products" },
  { id: "specials", label: "Monthly Specials" },
];

const PRODUCTS = [
  { id: 1,  name: "Andis Master Cordless",     cat: "barber",  price: 199, tag: "Best Seller", brand: "Andis" },
  { id: 2,  name: "BaByliss FX Clipper",       cat: "barber",  price: 179, tag: "New",         brand: "BaByliss PRO" },
  { id: 3,  name: "JRL Fade 2020C",            cat: "barber",  price: 219, tag: "Top Pick",    brand: "JRL" },
  { id: 4,  name: "Wahl Senior Clipper",        cat: "barber",  price: 89,  tag: "",            brand: "Wahl" },
  { id: 5,  name: "Gamma+ Absolute Hitter",    cat: "barber",  price: 129, tag: "Hot",         brand: "Gamma+" },
  { id: 6,  name: "Mizani Butter Blend Mask",  cat: "hair",    price: 28,  tag: "Special",     brand: "Mizani" },
  { id: 7,  name: "CHI Silk Infusion",         cat: "hair",    price: 22,  tag: "New",         brand: "CHI" },
  { id: 8,  name: "Avlon Keracare System",     cat: "hair",    price: 45,  tag: "",            brand: "Avlon" },
  { id: 9,  name: "Level3 Hydrating Shampoo",  cat: "hair",    price: 18,  tag: "",            brand: "Level3" },
  { id: 10, name: "26\" Body Wave Wig",        cat: "wigs",    price: 149, tag: "New",         brand: "Brashae's" },
  { id: 11, name: "Lace Front Straight 18\"",  cat: "wigs",    price: 119, tag: "Hot",         brand: "Brashae's" },
  { id: 12, name: "Clip-In Extensions Set",    cat: "wigs",    price: 79,  tag: "",            brand: "Brashae's" },
  { id: 13, name: "Oster Fast Feed Pro",       cat: "tools",   price: 92,  tag: "",            brand: "Oster" },
  { id: 14, name: "Cocco Pro Blower",          cat: "tools",   price: 68,  tag: "Special",     brand: "Cocco" },
  { id: 15, name: "ST Supreme Trimmer",        cat: "barber",  price: 159, tag: "",            brand: "ST Supreme" },
  { id: 16, name: "Andis Slimline Pro Li",     cat: "barber",  price: 74,  tag: "Special",     brand: "Andis" },
  { id: 17, name: "Mizani True Textures Curl", cat: "pro",     price: 32,  tag: "",            brand: "Mizani" },
  { id: 18, name: "Avlon Ferm Texture Kit",    cat: "pro",     price: 65,  tag: "New",         brand: "Avlon" },
];

const SPECIALS = PRODUCTS.filter(p => p.tag === "Special");

/* ══════════════════════════════════════════
   PRODUCT CARD  (per DESIGN.md spec)
══════════════════════════════════════════ */
function ProductCard({ p, onAdd, t }: any) {
  return (
    <div className="bb-card" style={{
      background: t.card, borderRadius: 8,
      border: `1px solid ${t.hairline}`,
      boxShadow: "0 1px 3px rgba(0,0,0,0.2), 0 0 1px rgba(0,0,0,0.3)",
      overflow: "hidden", display: "flex", flexDirection: "column",
    }}>
      {/* Image placeholder */}
      <div style={{ aspectRatio: "4/3", background: t.elevated, display: "flex", alignItems: "center", justifyContent: "center", position: "relative", borderRadius: "8px 8px 0 0" }}>
        <div style={{ fontSize: "0.6875rem", fontWeight: 700, color: GOLD_DIM, textAlign: "center", textTransform: "uppercase" }}>
          {p.brand}
        </div>
        {p.tag && (
          <div style={{ position: "absolute", top: 8, left: 8, background: GOLD, color: "#000", fontSize: "0.6875rem", fontWeight: 700, padding: "3px 8px", borderRadius: 4, textTransform: "uppercase" }}>
            {p.tag}
          </div>
        )}
      </div>
      {/* Card body */}
      <div style={{ padding: "14px 16px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, marginBottom: 4, textTransform: "uppercase" }}>
          {p.brand}
        </div>
        <div className="bb-heading" style={{ fontSize: "1rem", fontWeight: 700, color: t.onDark, marginBottom: "auto", lineHeight: 1.35, paddingBottom: 12 }}>
          {p.name}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginTop: 12 }}>
          <div className="bb-price" style={{ fontSize: "1.25rem", fontWeight: 700, color: GOLD }}>${p.price}</div>
          <button
            className="bb-btn-primary"
            onClick={(e) => { e.stopPropagation(); onAdd(p); }}
            style={{ background: GOLD, color: "#000", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: "0.875rem", fontWeight: 700, flexShrink: 0 }}
          >
            Add to cart
          </button>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   SHOP PAGE
══════════════════════════════════════════ */
function ShopPage({ filter, onAdd, t }: any) {
  const [active, setActive] = useState(filter || "all");

  const filtered = active === "all" ? PRODUCTS
    : active === "specials" ? SPECIALS
    : PRODUCTS.filter(p => p.cat === active);

  const activeLabel = CATS.find(c => c.id === active)?.label || "All Products";

  // Sub-nav pill
  const Pill = ({ cat }: any) => {
    const isActive = active === cat.id;
    return (
      <button className="bb-pill"
        onClick={() => setActive(cat.id)}
        style={{
          flexShrink: 0, padding: "6px 16px", borderRadius: 20,
          background: isActive ? GOLD : "transparent",
          color: isActive ? "#000" : t.body,
          border: `1px solid ${isActive ? GOLD : t.hairline}`,
          fontSize: "0.875rem", fontWeight: isActive ? 700 : 400,
          cursor: "pointer",
        }}
      >
        {cat.label}
      </button>
    );
  };

  return (
    <div>
      {/* Sub-nav */}
      <div style={{ borderBottom: `1px solid ${t.hairline}`, background: t.soft }}>
        <div className="bb-outer bb-section-inner" style={{ paddingTop: "12px", paddingBottom: "12px" }}>
          <div style={{ display: "flex", gap: 8, overflowX: "auto", scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}>
            {CATS.map(cat => <Pill key={cat.id} cat={cat} />)}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="bb-outer" style={{ paddingTop: "2rem", paddingBottom: "3rem" }}>
        <div className="bb-section-inner">
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: "1.5rem" }}>
            <h2 className="bb-heading" style={{ fontSize: "1.75rem", fontWeight: 700, color: t.onDark }}>{activeLabel}</h2>
            <span className="bb-price" style={{ fontSize: "0.875rem", color: t.muted }}>{filtered.length} items</span>
          </div>
          <div className="bb-pgrid">
            {filtered.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} t={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   HOME PAGE
══════════════════════════════════════════ */
function HomePage({ setPage, onAdd, t }: any) {
  const isDark = t.mode === "dark";

  return (
    <div>
      {/* Hero */}
      <div style={{ background: isDark ? t.canvas : "#000", paddingTop: "5rem", paddingBottom: "5rem", borderBottom: `1px solid ${isDark ? t.hairline : "#2A2A2A"}`, position: "relative", overflow: "hidden" }}>
        <div className="bb-outer bb-hero-inner" style={{ position: "relative", zIndex: 1 }}>
          {/* Watermark */}
          <div aria-hidden style={{ position: "absolute", right: 0, top: "50%", transform: "translateY(-50%)", fontSize: "clamp(80px, 20vw, 220px)", fontWeight: 800, color: isDark ? "#111" : "#111", lineHeight: 1, userSelect: "none", pointerEvents: "none" }}>B|B</div>

          <div style={{ maxWidth: 560, position: "relative" }}>
            <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", marginBottom: "1rem" }}>
              Houston's Premier Beauty Supply
            </div>
            <h1 className="bb-heading" style={{ fontSize: "clamp(2rem, 6vw, 3.5rem)", fontWeight: 800, color: "#FFF", lineHeight: 1, marginBottom: "1rem" }}>
              Professional Beauty Supply
            </h1>
            <p className="bb-body" style={{ fontSize: "1rem", color: "#BBBBBB", marginBottom: "1.75rem", lineHeight: 1.7 }}>
              Hair care · Barber tools · Wigs &amp; extensions. Serving professionals and consumers in Houston since day one.
            </p>
            <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
              <button className="bb-btn-primary" onClick={() => setPage("shop")}
                style={{ background: GOLD, color: "#000", border: `1px solid ${GOLD}`, borderRadius: 6, padding: "12px 24px", fontSize: "0.875rem", fontWeight: 700 }}>
                Shop Now
              </button>
              <button className="bb-btn-outlined" onClick={() => setPage("specials")}
                style={{ background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 6, padding: "12px 24px", fontSize: "0.875rem", fontWeight: 700 }}>
                ★ Monthly Specials
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Announcement bar */}
      <div style={{ background: GOLD, padding: "10px 1rem" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "center", gap: "2.5rem", flexWrap: "wrap" }}>
          {["Free shipping on orders $75+", "Professional hair stylists on staff", "11902 S Gessner · Houston, TX"].map(t => (
            <span key={t} style={{ fontSize: "0.75rem", fontWeight: 700, color: "#000", textAlign: "center" }}>{t}</span>
          ))}
        </div>
      </div>

      {/* Shop by category */}
      <div className="bb-outer" style={{ paddingTop: "3rem", paddingBottom: "3rem", background: t.soft }}>
        <div className="bb-section-inner">
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", marginBottom: "1rem" }}>Shop by Category</div>
          <h2 className="bb-heading" style={{ fontSize: "2rem", fontWeight: 700, color: t.onDark, marginBottom: "1.5rem" }}>Everything you need</h2>
          <div className="bb-cgrid">
            {[
              { id: "hair",     label: "Hair Care",          sub: "Shampoo · Conditioner · Treatments" },
              { id: "barber",   label: "Barber Supplies",    sub: "Clippers · Trimmers · Blades" },
              { id: "wigs",     label: "Wigs & Extensions",  sub: "Lace front · Clip-in · Body wave" },
              { id: "tools",    label: "Styling Tools",      sub: "Blowdryers · Flat irons" },
              { id: "pro",      label: "Pro Products",       sub: "Salon-grade · Wholesale" },
              { id: "specials", label: "Monthly Specials",   sub: "This month's featured deals", gold: true },
            ].map(cat => (
              <div key={cat.id} className="bb-card" onClick={() => setPage("shop")}
                style={{ background: t.card, border: `1px solid ${cat.gold ? GOLD : t.hairline}`, borderRadius: 8, padding: "20px 18px", cursor: "pointer" }}>
                {cat.gold && <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>★ Featured</div>}
                <div className="bb-heading" style={{ fontSize: "1rem", fontWeight: 700, color: cat.gold ? GOLD : t.onDark, marginBottom: 6 }}>{cat.label}</div>
                <div className="bb-body" style={{ fontSize: "0.875rem", color: t.body }}>{cat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Specials */}
      <div className="bb-outer" style={{ paddingTop: "3rem", paddingBottom: "3rem", background: t.canvas }}>
        <div className="bb-section-inner">
          <div style={{ display: "flex", alignItems: "baseline", gap: 12, marginBottom: "1.5rem" }}>
            <div>
              <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", marginBottom: 6 }}>★ Monthly Specials</div>
              <h2 className="bb-heading" style={{ fontSize: "2rem", fontWeight: 700, color: t.onDark }}>This month's deals</h2>
            </div>
            <button className="bb-btn-outlined" onClick={() => setPage("specials")}
              style={{ marginLeft: "auto", flexShrink: 0, background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 6, padding: "8px 16px", fontSize: "0.875rem", fontWeight: 700 }}>
              View all
            </button>
          </div>
          <div className="bb-pgrid">
            {SPECIALS.map(p => <ProductCard key={p.id} p={p} onAdd={onAdd} t={{ ...t, card: "#111111", elevated: "#1C1C1C", onDark: "#FFFFFF", hairline: "#2A2A2A" }} />)}
          </div>
        </div>
      </div>

      {/* Brands — cream band */}
      <div className="bb-outer" style={{ paddingTop: "2.5rem", paddingBottom: "2.5rem", background: t.mode === "light" ? "#FFF8F0" : "#0A0A0A", borderTop: `1px solid ${t.hairline}`, borderBottom: `1px solid ${t.hairline}` }}>
        <div className="bb-section-inner">
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: t.mode === "light" ? GOLD_DIM : GOLD, textTransform: "uppercase", marginBottom: "1rem", textAlign: "center" }}>Brands We Carry</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", justifyContent: "center" }}>
            {["Andis","BaByliss PRO","Wahl","Oster","JRL","Gamma+","ST Supreme","Cocco","CHI","Mizani","Avlon","Level3"].map(b => (
              <div key={b} style={{ padding: "6px 14px", border: `1px solid ${t.mode === "light" ? "#C8B89A" : "#2A2A2A"}`, borderRadius: 6, fontSize: "0.875rem", color: t.mode === "light" ? "#555" : "#BBBBBB", background: t.mode === "light" ? "#FFF" : "transparent" }}>
                {b}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   CART
══════════════════════════════════════════ */
function CartPage({ cart, setCart, setPage, t }: any) {
  const total = cart.reduce((s: number, i: any) => s + i.price * i.qty, 0);
  const remove = (id: number) => setCart((c: any[]) => c.filter(i => i.id !== id));

  return (
    <div className="bb-outer" style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: 600, margin: "0 auto" }}>
      <h1 className="bb-heading" style={{ fontSize: "1.75rem", fontWeight: 700, color: t.onDark, marginBottom: "1.5rem" }}>Your cart</h1>

      {cart.length === 0 ? (
        <div style={{ textAlign: "center", paddingTop: "4rem", paddingBottom: "4rem" }}>
          <div className="bb-body" style={{ color: t.muted, marginBottom: "1.5rem", fontSize: "1rem" }}>Your cart is empty.</div>
          <button className="bb-btn-primary" onClick={() => setPage("shop")}
            style={{ background: GOLD, color: "#000", border: "none", borderRadius: 6, padding: "12px 24px", fontSize: "0.875rem", fontWeight: 700 }}>
            Browse products
          </button>
        </div>
      ) : (
        <>
          {cart.map((item: any) => (
            <div key={item.id} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: `1px solid ${t.hairline}` }}>
              <div style={{ width: 56, height: 56, background: t.elevated, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: "0.6875rem", color: GOLD_DIM, fontWeight: 700, textTransform: "uppercase" }}>{item.brand.slice(0,3)}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="bb-heading" style={{ fontSize: "1rem", fontWeight: 700, color: t.onDark, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{item.name}</div>
                <div style={{ fontSize: "0.875rem", color: t.muted }}>{item.brand}</div>
              </div>
              <div className="bb-price" style={{ fontSize: "1.125rem", fontWeight: 700, color: GOLD, flexShrink: 0 }}>${item.price}</div>
              <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", color: t.muted, cursor: "pointer", fontSize: "1.25rem", lineHeight: 1, padding: "4px 8px", flexShrink: 0 }}>×</button>
            </div>
          ))}

          <div style={{ paddingTop: "1.5rem" }}>
            {total >= 75 && (
              <div style={{ background: t.mode === "dark" ? "rgba(34,197,94,0.08)" : "#F0FAF4", border: `1px solid ${t.mode === "dark" ? "rgba(34,197,94,0.2)" : "#A3D9B8"}`, borderRadius: 6, padding: "10px 14px", marginBottom: "1rem", fontSize: "0.875rem", color: GREEN }}>
                ✓ Free shipping applied
              </div>
            )}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "1.5rem" }}>
              <span className="bb-body" style={{ fontSize: "1rem", color: t.body }}>Subtotal</span>
              <span className="bb-price" style={{ fontSize: "1.5rem", fontWeight: 700, color: GOLD }}>${total}</span>
            </div>
            <button className="bb-btn-primary" style={{ width: "100%", padding: "14px", background: GOLD, color: "#000", border: "none", borderRadius: 6, fontSize: "1rem", fontWeight: 700 }}>
              Checkout — ${total}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════
   FOOTER
══════════════════════════════════════════ */
function SiteFooter({ t }: any) {
  const fg = t.mode === "dark" ? t.body : "#555";
  return (
    <div style={{ background: "#000", borderTop: `1px solid #2A2A2A`, padding: "3rem 0 1.5rem" }}>
      <div className="bb-outer bb-section-inner">
        <div className="bb-footer-inner">
          <div>
            <img src="/brashae-logo.svg" alt="Brashae's" style={{ height: 36, marginBottom: 12, filter: "none" }} />
            <p className="bb-body" style={{ fontSize: "0.875rem", color: "#BBBBBB", lineHeight: 1.8 }}>
              11902 S Gessner Rd<br />Houston, TX 77071<br />713-541-2279
            </p>
          </div>
          <div className="bb-footer-links">
            {[
              ["SHOP",  ["Hair Care","Barber Supplies","Wigs & Extensions","Styling Tools","Pro Products"]],
              ["HOURS", ["Mon–Tue   10am–6pm","Wed–Fri    8am–7pm","Saturday   8am–6pm","Sunday     Closed"]],
            ].map(([title, items]) => (
              <div key={title as string}>
                <div style={{ fontSize: "0.75rem", fontWeight: 700, color: GOLD, textTransform: "uppercase", marginBottom: "0.75rem" }}>{title as string}</div>
                {(items as string[]).map(i => (
                  <div key={i} style={{ fontSize: "0.875rem", color: "#7E7E7E", marginBottom: "0.5rem", fontFamily: "monospace" }}>{i}</div>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div style={{ borderTop: "1px solid #2A2A2A", paddingTop: "1rem", fontSize: "0.75rem", color: "#2A2A2A" }}>
          © 2026 Brashae's Barber Beauty Supply · Houston, TX
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════
   MAIN
══════════════════════════════════════════ */
export default function BrashaeEcommPreview() {
  const [page,   setPage]  = useState("home");
  const [cart,   setCart]  = useState<any[]>([]);
  const [isDark, setDark]  = useState(() => {
    try { return localStorage.getItem("bb-ecomm-theme") === "dark"; } catch { return false; }
  });

  const t = isDark ? DARK : LIGHT;
  const toggleTheme = () => setDark(d => {
    const next = !d;
    try { localStorage.setItem("bb-ecomm-theme", next ? "dark" : "light"); } catch {}
    return next;
  });

  const shopPages = ["shop", "specials"];
  const isShopPage = shopPages.includes(page);

  const currentUrl =
    page === "home"     ? "shop.brashaesbeautysupplytx.com" :
    page === "cart"     ? "shop.brashaesbeautysupplytx.com/cart" :
    page === "shop"     ? "shop.brashaesbeautysupplytx.com/products" :
    page === "specials" ? "shop.brashaesbeautysupplytx.com/specials" :
                          `shop.brashaesbeautysupplytx.com/${page}`;

  const addToCart = (product: any) => {
    setCart(c => {
      const ex = c.find(i => i.id === product.id);
      return ex
        ? c.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i)
        : [...c, { ...product, qty: 1 }];
    });
  };

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  // mobile cat nav class
  const mobCatBorderColor = t.hairline;

  return (
    <div style={{ minHeight: "100vh", background: t.canvas, color: t.onDark, fontFamily: "Inter, system-ui, -apple-system, sans-serif" }}>
      <style>{CSS}</style>

      {/* ── Browser chrome ── */}
      <div style={{ background: "#1A1A1A", borderBottom: "1px solid #2A2A2A", padding: "9px 16px", display: "flex", alignItems: "center", gap: 10, position: "sticky", top: 0, zIndex: 300 }}>
        <div className="bb-chrome-dots" style={{ gap: 5, flexShrink: 0 }}>
          {["#FF5F57","#FFBD2E","#28CA41"].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: "#0A0A0A", borderRadius: 5, padding: "5px 12px", fontSize: "0.6875rem", color: "#7E7E7E", fontFamily: "monospace", display: "flex", alignItems: "center", gap: 7, overflow: "hidden" }}>
          <span style={{ color: "#22c55e", flexShrink: 0 }}>🔒</span>
          <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{currentUrl}</span>
        </div>
        {/* Theme toggle inside chrome */}
        <button onClick={toggleTheme} className="bb-chrome-label"
          style={{ background: "none", border: "1px solid #2A2A2A", borderRadius: 4, padding: "4px 10px", cursor: "pointer", fontSize: "0.6875rem", color: "#7E7E7E", gap: 6, alignItems: "center", flexShrink: 0, fontFamily: "monospace" }}>
          {isDark ? "☀ Light" : "⬛ Dark"}
        </button>
      </div>

      {/* ── Site shell ── */}
      <div>
        {/* Site nav */}
        <div style={{ background: "#000000", borderBottom: `1px solid #2A2A2A`, padding: "0 2rem", position: "sticky", top: 44, zIndex: 200 }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div className="bb-sitenav">
              {/* Logo */}
              <div onClick={() => setPage("home")} style={{ cursor: "pointer", flexShrink: 0 }}>
                <img src="/brashae-logo.svg" alt="Brashae's Barber Beauty Supply" style={{ height: 40, display: "block" }} />
              </div>

              {/* Desktop category links */}
              <div className="bb-deskcat">
                {CATS.slice(1).map(cat => (
                  <button key={cat.id}
                    onClick={() => setPage(cat.id === "all" ? "shop" : cat.id === "specials" ? "specials" : "shop")}
                    style={{
                      padding: "8px 12px", background: "none", border: "none",
                      borderBottom: page === cat.id ? `2px solid ${GOLD}` : "2px solid transparent",
                      color: page === cat.id ? GOLD : "#BBBBBB",
                      fontSize: "0.875rem", fontWeight: 400, cursor: "pointer",
                      transition: "color 0.15s, border-color 0.15s",
                    }}>
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* Right: cart + book */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <button className="bb-btn-outlined" onClick={() => {}}
                  style={{ display: "none", background: "transparent", color: GOLD, border: `1px solid ${GOLD}`, borderRadius: 6, padding: "8px 16px", fontSize: "0.8125rem", fontWeight: 700, cursor: "pointer" }}>
                  Book a Suite
                </button>
                <button className="bb-btn-primary" onClick={() => setPage("cart")}
                  style={{ background: GOLD, color: "#000", border: "none", borderRadius: 6, padding: "8px 16px", fontSize: "0.8125rem", fontWeight: 700, display: "flex", alignItems: "center", gap: 7 }}>
                  Cart
                  {cartCount > 0 && (
                    <span style={{ background: "#000", color: GOLD, width: 18, height: 18, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.6875rem", fontWeight: 700 }}>{cartCount}</span>
                  )}
                </button>
              </div>
            </div>

            {/* Mobile category scroll */}
            <div className="bb-mobcat" style={{ borderTopColor: "#2A2A2A" }}>
              {CATS.map(cat => (
                <button key={cat.id}
                  onClick={() => setPage(cat.id === "all" ? "shop" : cat.id === "specials" ? "specials" : "shop")}
                  style={{
                    flexShrink: 0, padding: "8px 14px",
                    background: "none", border: "none",
                    borderBottom: page === cat.id ? `2px solid ${GOLD}` : "2px solid transparent",
                    color: page === cat.id ? GOLD : "#7E7E7E",
                    fontSize: "0.8125rem", fontWeight: page === cat.id ? 700 : 400,
                    cursor: "pointer", whiteSpace: "nowrap",
                  }}>
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Pages */}
        {page === "home"     && <HomePage setPage={setPage} onAdd={addToCart} t={t} />}
        {page === "cart"     && <CartPage cart={cart} setCart={setCart} setPage={setPage} t={t} />}
        {(page === "shop" || page === "specials") && <ShopPage filter={page === "specials" ? "specials" : "all"} onAdd={addToCart} t={t} />}

        <SiteFooter t={t} />
      </div>
    </div>
  );
}
