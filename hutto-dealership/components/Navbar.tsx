"use client";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { brand } from "@/brand.config";
import { useState, Suspense } from "react";

function NavLinks() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const collection = searchParams.get("collection");

  function linkStyle(href: string, collectionSlug?: string): React.CSSProperties {
    const isActive = collectionSlug
      ? pathname === "/shop" && collection === collectionSlug
      : pathname === "/shop" && !collection;
    return {
      color: isActive ? "var(--accent)" : "var(--muted)",
      fontFamily: "var(--font-display)",
      fontSize: "14px",
      fontWeight: isActive ? 700 : 600,
      letterSpacing: "0.3px",
      textDecoration: "none",
      borderBottom: isActive ? "2px solid var(--accent)" : "2px solid transparent",
      paddingBottom: "2px",
      transition: "color 0.15s",
    };
  }

  return (
    <>
      <Link href="/shop" style={linkStyle("/shop")}>Inventory</Link>
      <Link href="/shop?collection=trucks" style={linkStyle("/shop", "trucks")}>Trucks</Link>
      <Link href="/shop?collection=suvs" style={linkStyle("/shop", "suvs")}>SUVs</Link>
      <Link href="/shop?collection=sedans" style={linkStyle("/shop", "sedans")}>Sedans</Link>
    </>
  );
}

export function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinkStyle: React.CSSProperties = {
    color: "var(--muted)",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 600,
    letterSpacing: "0.3px",
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
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "0 24px",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "100%",
        }}
      >
        {/* Logo / Brand name */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <span
            style={{
              color: "var(--accent)",
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "18px",
              letterSpacing: "-0.3px",
            }}
          >
            {brand.name}
          </span>
        </Link>

        {/* Desktop nav links */}
        <div className="hidden md:flex" style={{ alignItems: "center", gap: "32px" }}>
          <Suspense fallback={null}>
            <NavLinks />
          </Suspense>
        </div>

        {/* Right side: CTA + hamburger */}
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <Link
            href="tel:+15128550000"
            className="hidden md:flex"
            style={{
              alignItems: "center",
              gap: "6px",
              background: "var(--accent)",
              color: "#fff",
              fontFamily: "var(--font-display)",
              fontWeight: 600,
              fontSize: "13px",
              letterSpacing: "0.3px",
              textDecoration: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              transition: "opacity 0.15s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.opacity = "0.88")}
            onMouseLeave={(e) => (e.currentTarget.style.opacity = "1")}
          >
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-.282.376-.769.542-1.21.38a12.035 12.035 0 01-7.143-7.143c-.162-.441.004-.928.38-1.21l1.293-.97c.363-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
            </svg>
            Call Us
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
            background: "var(--canvas)",
            borderBottom: "1px solid var(--hairline)",
            padding: "16px 24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            zIndex: 49,
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }}
        >
          <Link href="/shop" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: "var(--on-dark)" }}>
            All Inventory
          </Link>
          <Link href="/shop?collection=trucks" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: "var(--on-dark)" }}>
            Trucks
          </Link>
          <Link href="/shop?collection=suvs" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: "var(--on-dark)" }}>
            SUVs
          </Link>
          <Link href="/shop?collection=sedans" onClick={() => setMenuOpen(false)} style={{ ...navLinkStyle, color: "var(--on-dark)" }}>
            Sedans
          </Link>
          <Link
            href="tel:+15128550000"
            onClick={() => setMenuOpen(false)}
            style={{ ...navLinkStyle, color: "var(--accent)", fontWeight: 700 }}
          >
            Call Us
          </Link>
        </div>
      )}
    </nav>
  );
}
