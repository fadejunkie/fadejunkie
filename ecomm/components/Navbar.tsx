"use client";
import Link from "next/link";
import Image from "next/image";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { getCartSessionId } from "@/lib/cart";
import { brand } from "@/brand.config";
import { useState, useEffect } from "react";

export function Navbar() {
  const [sessionId, setSessionId] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    setSessionId(getCartSessionId());
  }, []);

  const cartItems = useQuery(
    api.cart.getCart,
    sessionId ? { sessionId } : "skip"
  );
  const cartCount = cartItems?.reduce((sum, i) => sum + i.quantity, 0) ?? 0;

  const navLinkStyle: React.CSSProperties = {
    color: "var(--muted)",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.5px",
    textTransform: "uppercase",
    textDecoration: "none",
    transition: "color 0.15s",
  };

  return (
    <nav
      style={{
        background: "var(--canvas)",
        borderBottom: "1px solid var(--hairline)",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
      }}
    >
      <div
        style={{
          maxWidth: "1152px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <Image
            src={brand.logo.symbolLight}
            alt={brand.logo.alt}
            width={32}
            height={32}
            style={{ objectFit: "contain", filter: "invert(1)" }}
          />
          <span
            style={{
              color: "var(--on-dark)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "14px",
              letterSpacing: "1.5px",
              textTransform: "uppercase",
            }}
          >
            {brand.name}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
          <Link
            href="/shop"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--on-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Shop
          </Link>
          <Link
            href="/shop?collection=apparel"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--on-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Apparel
          </Link>
          <Link
            href="/shop?collection=accessories"
            style={navLinkStyle}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--on-dark)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--muted)")}
          >
            Accessories
          </Link>
        </div>

        {/* Right side: cart + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
          {/* Cart */}
          <Link
            href="/cart"
            style={{ position: "relative", display: "flex", alignItems: "center", color: "var(--on-dark)", textDecoration: "none" }}
          >
            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            {cartCount > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-6px",
                  right: "-6px",
                  background: "var(--accent)",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: 700,
                  borderRadius: "9999px",
                  minWidth: "16px",
                  height: "16px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: "0 2px",
                }}
              >
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile hamburger */}
          <button
            className="md:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--on-dark)", padding: 0 }}
          >
            <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              {menuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div
          className="md:hidden"
          style={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            background: "var(--surface-soft)",
            borderBottom: "1px solid var(--hairline)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 49,
          }}
        >
          <Link
            href="/shop"
            onClick={() => setMenuOpen(false)}
            style={{ ...navLinkStyle, color: "var(--body)" }}
          >
            Shop All
          </Link>
          <Link
            href="/shop?collection=apparel"
            onClick={() => setMenuOpen(false)}
            style={{ ...navLinkStyle, color: "var(--body)" }}
          >
            Apparel
          </Link>
          <Link
            href="/shop?collection=accessories"
            onClick={() => setMenuOpen(false)}
            style={{ ...navLinkStyle, color: "var(--body)" }}
          >
            Accessories
          </Link>
        </div>
      )}
    </nav>
  );
}
