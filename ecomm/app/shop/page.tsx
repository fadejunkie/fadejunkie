"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ShopGrid() {
  const searchParams = useSearchParams();
  const collectionSlug = searchParams.get("collection");

  const collections = useQuery(api.collections.list);
  const activeCollection = collections?.find((c) => c.slug === collectionSlug);

  const products = useQuery(api.products.list, {
    collectionId: activeCollection?._id,
  });

  const filterTabActive: React.CSSProperties = {
    color: "var(--on-dark)",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    textDecoration: "none",
    paddingBottom: "4px",
    borderBottom: "2px solid var(--on-dark)",
    transition: "color 0.15s",
  };

  const filterTabInactive: React.CSSProperties = {
    color: "var(--muted)",
    fontFamily: "var(--font-display)",
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "1.5px",
    textTransform: "uppercase",
    textDecoration: "none",
    paddingBottom: "4px",
    borderBottom: "2px solid transparent",
    transition: "color 0.15s",
  };

  return (
    <div
      style={{
        maxWidth: "1152px",
        margin: "0 auto",
        padding: "64px 24px",
      }}
    >
      {/* Header row */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "40px",
          flexWrap: "wrap",
          gap: "16px",
          borderBottom: "1px solid var(--hairline)",
          paddingBottom: "24px",
        }}
      >
        <h1
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 700,
            fontSize: "clamp(28px, 4vw, 40px)",
            letterSpacing: "-0.5px",
            textTransform: "uppercase",
            color: "var(--on-dark)",
          }}
        >
          {activeCollection ? activeCollection.name : "All Products"}
        </h1>

        {/* Collection filter tabs */}
        {collections && (
          <div style={{ display: "flex", gap: "24px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <a
              href="/shop"
              style={!collectionSlug ? filterTabActive : filterTabInactive}
            >
              All
            </a>
            {collections.map((c) => (
              <a
                key={c._id}
                href={`/shop?collection=${c.slug}`}
                style={collectionSlug === c.slug ? filterTabActive : filterTabInactive}
              >
                {c.name}
              </a>
            ))}
          </div>
        )}
      </div>

      {/* Product grid */}
      {!products ? (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: "24px",
          }}
          className="grid-cols-2 md:grid-cols-3"
        >
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: "1 / 1",
                borderRadius: 0,
                background: "var(--surface-card)",
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p style={{ color: "var(--muted)", fontSize: "14px", fontWeight: 300, padding: "48px 0", textAlign: "center" }}>
          No products found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "24px",
          }}
          className="grid-cols-1 sm:grid-cols-2 md:grid-cols-3"
        >
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: "var(--canvas)" }}>
        <Suspense fallback={<div style={{ padding: "80px", textAlign: "center", color: "var(--muted)" }}>Loading…</div>}>
          <ShopGrid />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
