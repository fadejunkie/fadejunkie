// @ts-nocheck
import React, { useState, useRef } from "react";

const BLACK   = "#000000";
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
const GREEN   = "#22c55e";

export default function SitePreviewStandalone() {
  const [sitePage, setSitePage] = useState("home");
  const scrollRef = useRef<HTMLDivElement>(null);

  const nav = (p: string) => {
    setSitePage(p);
    if (scrollRef.current) scrollRef.current.scrollTop = 0;
  };

  const LogoSvg = () => (
    <img src="/chuco-logo.svg" alt="CHUCO" style={{ height: 28, filter: "invert(1)", display: "block" }} />
  );

  const navLinks = [
    { l: "SHOP", p: "shop" },
    { l: "COLLECTIONS", p: "collections" },
    { l: "ABOUT", p: "about" },
  ];

  const SiteNav = () => (
    <div style={{ background: BLACK, borderBottom: "1px solid #1a1a1a", padding: "0 24px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 52 }}>
      <LogoSvg />
      <div style={{ display: "flex", gap: 24 }}>
        {navLinks.map(n => (
          <span key={n.l} onClick={() => nav(n.p)} style={{
            fontSize: 10, fontWeight: 700,
            color: sitePage === n.p ? RED : SMOKE,
            letterSpacing: 3, cursor: "pointer",
            fontFamily: "'IBM Plex Mono',monospace", transition: "color 0.15s"
          }}>{n.l}</span>
        ))}
      </div>
      <div style={{ fontSize: 10, color: GREY, fontFamily: "'IBM Plex Mono',monospace" }}>CART (0)</div>
    </div>
  );

  const SiteFooter = () => (
    <div style={{ background: "#080808", borderTop: "1px solid #1a1a1a", padding: "28px 24px", marginTop: 40 }}>
      <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 20, marginBottom: 20 }}>
        <div>
          <LogoSvg />
          <div style={{ fontSize: 10, color: GREY, marginTop: 8, fontFamily: "'IBM Plex Mono',monospace" }}>
            BUILT DIFFERENT. WEAR DIFFERENT.
          </div>
        </div>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            ["SHOP",  ["All Products", "Hoodies", "Tees", "Hats"]],
            ["INFO",  ["About", "Contact", "Shipping", "Returns"]],
          ].map(([title, links]) => (
            <div key={title as string}>
              <div style={{ fontSize: 9, fontWeight: 700, color: RED, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 10 }}>
                {title as string}
              </div>
              {(links as string[]).map(l => (
                <div key={l} style={{ fontSize: 11, color: GREY, marginBottom: 6, cursor: "pointer" }}>{l}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div style={{ borderTop: "1px solid #1a1a1a", paddingTop: 14, fontSize: 10, color: "#333", fontFamily: "'IBM Plex Mono',monospace" }}>
        © 2024 CHUCO APPAREL — ALL RIGHTS RESERVED
      </div>
    </div>
  );

  const ProductCard = ({ name, price, tag }: any) => (
    <div style={{ background: COAL, border: "1px solid #1a1a1a", borderRadius: 4, overflow: "hidden", cursor: "pointer" }}>
      <div style={{ aspectRatio: "1", background: IRON, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
        <img src="/chuco-mascot.svg" alt="" style={{ width: "60%", filter: "invert(1)", opacity: 0.15 }} />
        <div style={{ position: "absolute", top: 8, left: 8, background: RED, color: WHITE, fontSize: 8, fontWeight: 700, padding: "3px 7px", fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 1 }}>
          {tag || "NEW"}
        </div>
      </div>
      <div style={{ padding: "12px 14px" }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: WHITE, marginBottom: 4, letterSpacing: 0.5 }}>{name}</div>
        <div style={{ fontSize: 13, color: RED, fontWeight: 700 }}>{price}</div>
      </div>
    </div>
  );

  const renderHome = () => (
    <div>
      <div style={{ background: BLACK, padding: "52px 24px 48px", position: "relative", overflow: "hidden", minHeight: 320, display: "flex", alignItems: "center" }}>
        <img src="/chuco-mascot.svg" alt="" style={{ position: "absolute", right: -10, top: "50%", transform: "translateY(-50%)", width: 280, filter: "invert(1)", opacity: 0.07 }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: 460 }}>
          <div style={{ fontSize: 9, color: RED, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 14, fontWeight: 700 }}>
            CHUCO APPAREL — NEW DROP
          </div>
          <div style={{ fontSize: "clamp(28px,5vw,54px)", fontWeight: 900, color: WHITE, lineHeight: 0.95, letterSpacing: -1, marginBottom: 16 }}>
            BUILT<br />DIFFERENT.
          </div>
          <div style={{ fontSize: 12, color: ASH, marginBottom: 24, lineHeight: 1.6, fontFamily: "'IBM Plex Mono',monospace" }}>
            Streetwear for those who move different.<br />Raw. Dark. Unapologetic.
          </div>
          <button
            onClick={() => nav("shop")}
            style={{ background: RED, color: WHITE, border: "none", padding: "12px 28px", fontSize: 11, fontWeight: 700, letterSpacing: 3, cursor: "pointer", fontFamily: "'IBM Plex Mono',monospace" }}
          >
            SHOP NOW
          </button>
        </div>
      </div>

      <div style={{ padding: "32px 24px" }}>
        <div style={{ fontSize: 10, color: GREY, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 20 }}>FEATURED DROPS</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <ProductCard name="Castle Sweater" price="$65" tag="DROP" />
          <ProductCard name="OG Dragon Tee" price="$38" tag="NEW" />
          <ProductCard name="Chuco Cap" price="$28" tag="HOT" />
        </div>
      </div>

      <div style={{ background: RED, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "center", gap: 40 }}>
        {["FREE SHIPPING $75+", "DROPS EVERY FRIDAY", "BUILT IN SA"].map(t => (
          <div key={t} style={{ fontSize: 9, fontWeight: 700, color: WHITE, letterSpacing: 3, fontFamily: "'IBM Plex Mono',monospace" }}>{t}</div>
        ))}
      </div>
    </div>
  );

  const renderShop = () => (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ fontSize: 10, color: GREY, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 20 }}>ALL PRODUCTS</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
        {[
          { name: "Castle Sweater", price: "$65", tag: "DROP" },
          { name: "OG Dragon Tee",  price: "$38", tag: "NEW"  },
          { name: "Chuco Cap",      price: "$28", tag: "HOT"  },
          { name: "Black Hoodie",   price: "$72", tag: "NEW"  },
          { name: "Chuco Bandana",  price: "$18", tag: ""     },
          { name: "Logo Tee",       price: "$32", tag: ""     },
        ].map((p, i) => <ProductCard key={i} {...p} />)}
      </div>
    </div>
  );

  const renderCollections = () => (
    <div style={{ padding: "28px 24px" }}>
      <div style={{ fontSize: 10, color: GREY, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 20 }}>COLLECTIONS</div>
      {[
        ["HOODIES & SWEATERS", "Heavy silhouettes. Raw cuts. The core of the brand."],
        ["GRAPHIC TEES",       "Logo work, mascot art, limited prints."],
        ["HEADWEAR",           "Snapbacks, beanies, 6-panels."],
        ["ACCESSORIES",        "Bandanas, bags, small pieces."],
      ].map(([name, desc], i) => (
        <div key={i} style={{ background: COAL, border: "1px solid #1a1a1a", borderRadius: 4, padding: "18px 20px", marginBottom: 10, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: WHITE, marginBottom: 4 }}>{name}</div>
            <div style={{ fontSize: 11, color: GREY }}>{desc}</div>
          </div>
          <div style={{ fontSize: 18, color: RED }}>→</div>
        </div>
      ))}
    </div>
  );

  const renderAbout = () => (
    <div style={{ padding: "36px 24px" }}>
      <div style={{ maxWidth: 520 }}>
        <div style={{ fontSize: 9, color: RED, letterSpacing: 4, fontFamily: "'IBM Plex Mono',monospace", marginBottom: 14 }}>ABOUT CHUCO APPAREL</div>
        <div style={{ fontSize: "clamp(22px,4vw,38px)", fontWeight: 900, color: WHITE, lineHeight: 1.05, marginBottom: 20 }}>
          WEAR YOUR ROOTS.
        </div>
        <div style={{ fontSize: 13, color: ASH, lineHeight: 1.8, marginBottom: 20 }}>
          Chuco Apparel started from the streets — no corporate backing, no trends to chase. Just raw design and a vision to build something authentic for the people who actually live it.
        </div>
        <div style={{ fontSize: 13, color: ASH, lineHeight: 1.8 }}>
          Every drop is designed in-house. Every piece reflects where we come from. This isn't fashion — it's identity.
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (sitePage) {
      case "shop":        return renderShop();
      case "collections": return renderCollections();
      case "about":       return renderAbout();
      default:            return renderHome();
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: BLACK, color: WHITE }}>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { background: ${BLACK}; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: ${COAL}; }
        ::-webkit-scrollbar-thumb { background: ${ZINC}; border-radius: 3px; }
      `}</style>

      {/* Top bar */}
      <div style={{ background: COAL, borderBottom: `1px solid ${ZINC}`, padding: "10px 24px", display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{ display: "flex", gap: 5 }}>
          {["#ff5f57", "#ffbd2e", "#28ca41"].map(c => (
            <div key={c} style={{ width: 11, height: 11, borderRadius: "50%", background: c }} />
          ))}
        </div>
        <div style={{ flex: 1, background: IRON, borderRadius: 5, padding: "5px 14px", fontSize: 11, color: SILVER, fontFamily: "'IBM Plex Mono',monospace", display: "flex", alignItems: "center", gap: 8, maxWidth: 400 }}>
          <span style={{ color: GREEN, fontSize: 10 }}>🔒</span>
          chucoapparel.com{sitePage !== "home" ? `/${sitePage}` : ""}
        </div>
        <div style={{ fontSize: 9, color: ASH, fontFamily: "'IBM Plex Mono',monospace", letterSpacing: 2, marginLeft: "auto" }}>
          SITE PREVIEW
        </div>
      </div>

      {/* Full site */}
      <div style={{ fontFamily: "'Inter','Helvetica Neue',sans-serif" }}>
        <SiteNav />
        {renderPage()}
        <SiteFooter />
      </div>
    </div>
  );
}
