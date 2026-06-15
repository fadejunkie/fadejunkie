"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/ProductCard";
import { Suspense, useState, useMemo, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Doc } from "@/convex/_generated/dataModel";

// Maps ?collection= URL param → bodyType filter value
const COLLECTION_MAP: Record<string, string> = {
  trucks: "Truck",
  suvs: "SUV",
  sedans: "Sedan",
  coupes: "Coupe",
  minivans: "Minivan",
};

const BODY_TYPES = ["Truck", "SUV", "Sedan", "Coupe", "Minivan", "Convertible", "Wagon", "Hatchback"];
const CONDITIONS = ["New", "Used", "Certified Pre-Owned"];
const PRICE_RANGES = [
  { label: "Any Price", min: 0, max: Infinity },
  { label: "Under $10k", min: 0, max: 1000000 },
  { label: "$10k – $20k", min: 1000000, max: 2000000 },
  { label: "$20k – $30k", min: 2000000, max: 3000000 },
  { label: "$30k – $50k", min: 3000000, max: 5000000 },
  { label: "$50k+", min: 5000000, max: Infinity },
];
const MILEAGE_RANGES = [
  { label: "Any Mileage", min: 0, max: Infinity },
  { label: "Under 30k", min: 0, max: 30000 },
  { label: "30k – 60k", min: 30000, max: 60000 },
  { label: "60k – 100k", min: 60000, max: 100000 },
  { label: "100k+", min: 100000, max: Infinity },
];

function chipStyle(active: boolean): React.CSSProperties {
  return {
    padding: "6px 12px",
    borderRadius: "4px",
    border: `1.5px solid ${active ? "var(--accent)" : "var(--hairline)"}`,
    background: active ? "var(--accent)" : "transparent",
    color: active ? "#fff" : "var(--body)",
    fontFamily: "var(--font-display)",
    fontWeight: 600,
    fontSize: "12px",
    cursor: "pointer",
    transition: "all 0.15s",
    whiteSpace: "nowrap" as const,
  };
}

function FilterSection({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: "24px" }}>
      <p
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 700,
          fontSize: "11px",
          letterSpacing: "1px",
          textTransform: "uppercase",
          color: "var(--muted)",
          marginBottom: "10px",
        }}
      >
        {label}
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>{children}</div>
    </div>
  );
}

function InventoryGrid() {
  const searchParams = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const initialBodyType = collectionParam ? (COLLECTION_MAP[collectionParam] ?? null) : null;

  const allVehicles = useQuery(api.products.list, {});

  const [bodyType, setBodyType] = useState<string | null>(initialBodyType);
  const [condition, setCondition] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState(0);
  const [mileageRange, setMileageRange] = useState(0);
  const [make, setMake] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  // Sync if user navigates between collection links without unmounting
  useEffect(() => {
    setBodyType(collectionParam ? (COLLECTION_MAP[collectionParam] ?? null) : null);
    setCondition(null);
    setPriceRange(0);
    setMileageRange(0);
    setMake(null);
  }, [collectionParam]);

  // Derive unique makes from data
  const makes = useMemo(() => {
    if (!allVehicles) return [];
    const set = new Set(allVehicles.map((v) => v.make).filter(Boolean) as string[]);
    return Array.from(set).sort();
  }, [allVehicles]);

  // Apply filters
  const vehicles = useMemo(() => {
    if (!allVehicles) return null;
    const pr = PRICE_RANGES[priceRange];
    const mr = MILEAGE_RANGES[mileageRange];
    return allVehicles.filter((v) => {
      if (bodyType && v.bodyType !== bodyType) return false;
      if (condition && v.condition !== condition) return false;
      if (make && v.make !== make) return false;
      if (v.price < pr.min || v.price > pr.max) return false;
      if (mr.max !== Infinity && (v.mileage == null || v.mileage > mr.max)) return false;
      if (mr.min > 0 && (v.mileage == null || v.mileage < mr.min)) return false;
      return true;
    });
  }, [allVehicles, bodyType, condition, priceRange, mileageRange, make]);

  const activeFilterCount = [
    bodyType, condition, priceRange > 0 ? 1 : null, mileageRange > 0 ? 1 : null, make,
  ].filter(Boolean).length;

  function clearAll() {
    setBodyType(null);
    setCondition(null);
    setPriceRange(0);
    setMileageRange(0);
    setMake(null);
  }

  const filterPanel = (
    <div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "14px", color: "var(--on-dark)", margin: 0 }}>
          Filters
        </p>
        {activeFilterCount > 0 && (
          <button
            onClick={clearAll}
            style={{ background: "none", border: "none", cursor: "pointer", color: "var(--accent)", fontSize: "12px", fontWeight: 600, padding: 0 }}
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <FilterSection label="Condition">
        {CONDITIONS.map((c) => (
          <button key={c} style={chipStyle(condition === c)} onClick={() => setCondition(condition === c ? null : c)}>
            {c}
          </button>
        ))}
      </FilterSection>

      <FilterSection label="Body Type">
        {BODY_TYPES.map((bt) => (
          <button key={bt} style={chipStyle(bodyType === bt)} onClick={() => setBodyType(bodyType === bt ? null : bt)}>
            {bt}
          </button>
        ))}
      </FilterSection>

      {makes.length > 0 && (
        <FilterSection label="Make">
          {makes.map((m) => (
            <button key={m} style={chipStyle(make === m)} onClick={() => setMake(make === m ? null : m)}>
              {m}
            </button>
          ))}
        </FilterSection>
      )}

      <FilterSection label="Price">
        {PRICE_RANGES.map((pr, i) => (
          <button key={pr.label} style={chipStyle(priceRange === i)} onClick={() => setPriceRange(i)}>
            {pr.label}
          </button>
        ))}
      </FilterSection>

      <FilterSection label="Mileage">
        {MILEAGE_RANGES.map((mr, i) => (
          <button key={mr.label} style={chipStyle(mileageRange === i)} onClick={() => setMileageRange(i)}>
            {mr.label}
          </button>
        ))}
      </FilterSection>
    </div>
  );

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "48px 24px" }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: "32px",
          flexWrap: "wrap",
          gap: "12px",
          borderBottom: "1px solid var(--hairline)",
          paddingBottom: "20px",
        }}
      >
        <div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 700,
              fontSize: "clamp(24px, 4vw, 36px)",
              letterSpacing: "-0.5px",
              color: "var(--on-dark)",
              margin: "0 0 4px",
            }}
          >
            {bodyType ? `${bodyType}s` : "Vehicle Inventory"}
          </h1>
          {vehicles != null && (
            <p style={{ color: "var(--muted)", fontSize: "13px", margin: 0 }}>
              {vehicles.length} vehicle{vehicles.length !== 1 ? "s" : ""} available
            </p>
          )}
        </div>

        {/* Mobile filter toggle */}
        <button
          className="md:hidden"
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "6px",
            background: activeFilterCount > 0 ? "var(--accent)" : "var(--surface-card)",
            color: activeFilterCount > 0 ? "#fff" : "var(--on-dark)",
            border: `1.5px solid ${activeFilterCount > 0 ? "var(--accent)" : "var(--hairline)"}`,
            borderRadius: "4px",
            padding: "8px 14px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z" />
          </svg>
          Filters {activeFilterCount > 0 && `(${activeFilterCount})`}
        </button>
      </div>

      {/* Mobile filter panel */}
      {showFilters && (
        <div
          className="md:hidden"
          style={{
            background: "var(--surface-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: "6px",
            padding: "20px",
            marginBottom: "24px",
          }}
        >
          {filterPanel}
        </div>
      )}

      <div style={{ display: "grid", gap: "32px" }} className="md:grid-cols-[240px_1fr]">
        {/* Sidebar — desktop */}
        <div
          className="hidden md:block"
          style={{
            background: "var(--surface-soft)",
            border: "1px solid var(--hairline)",
            borderRadius: "8px",
            padding: "20px",
            alignSelf: "start",
            position: "sticky",
            top: "80px",
          }}
        >
          {filterPanel}
        </div>

        {/* Grid */}
        <div>
          {!vehicles ? (
            <div
              style={{ display: "grid", gap: "24px" }}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  style={{
                    aspectRatio: "16 / 10",
                    borderRadius: "6px",
                    background: "var(--surface-card)",
                    animation: "pulse 1.5s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          ) : vehicles.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center" }}>
              <p style={{ color: "var(--muted)", fontSize: "15px", marginBottom: "12px" }}>
                No vehicles match your filters.
              </p>
              <button
                onClick={clearAll}
                style={{
                  background: "var(--accent)",
                  color: "#fff",
                  border: "none",
                  borderRadius: "4px",
                  padding: "10px 20px",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Clear Filters
              </button>
            </div>
          ) : (
            <div
              style={{ display: "grid", gap: "28px" }}
              className="grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            >
              {vehicles.map((v) => (
                <ProductCard key={v._id} product={v} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ShopPage() {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1, background: "var(--canvas)" }}>
        <Suspense fallback={<div style={{ padding: "80px", textAlign: "center", color: "var(--muted)" }}>Loading inventory…</div>}>
          <InventoryGrid />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
