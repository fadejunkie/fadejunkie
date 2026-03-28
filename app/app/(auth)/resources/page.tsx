"use client";

import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import ResourceCard from "@/components/ResourceCard";

const TABS = [
  { id: "all",      label: "All" },
  { id: "Barbers",  label: "Barbers" },
  { id: "Students", label: "Students" },
  { id: "Schools",  label: "Schools" },
  { id: "Shops",    label: "Shops" },
];

export default function ResourcesPage() {
  const [active, setActive] = useState("all");

  const resources = useQuery(
    api.resources.listResources,
    active === "all" ? {} : { audience: active }
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-[22px] font-bold text-foreground">Resources</h1>
        <p className="text-[13.5px] text-muted-foreground mt-1 leading-relaxed">
          Curated tools, products, and services for barbers, students, schools, and shop owners.
        </p>
      </div>

      {/* Category filters — pill style matching reference */}
      <div className="flex items-center gap-2 flex-wrap">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActive(t.id)}
            className="font-sans text-[13px] px-4 py-1.5 rounded-full border transition-colors"
            style={{
              borderColor: active === t.id ? "var(--foreground)" : "var(--border)",
              fontWeight: active === t.id ? 600 : 400,
              color: active === t.id ? "var(--foreground)" : "var(--muted-foreground)",
              background: "var(--background)",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Skeleton */}
      {!resources && (
        <div className="grid gap-3 sm:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-card border border-border h-36 animate-pulse" style={{ borderRadius: "20px" }} />
          ))}
        </div>
      )}

      {resources?.length === 0 && (
        <p className="text-[13.5px] text-muted-foreground py-10 text-center">
          No resources in this section yet.
        </p>
      )}

      {/* 3-column grid matching reference */}
      <div className="grid gap-3 sm:grid-cols-3">
        {resources?.map((r) => (
          <ResourceCard
            key={r._id}
            businessName={r.businessName}
            category={r.category}
            audience={r.audience}
            tagline={r.tagline}
            description={r.description}
            logoUrl={r.logoUrl}
            offerUrl={r.offerUrl}
            isInternal={r.isInternal}
            badge={r.badge}
            price={r.price}
            affiliate={r.affiliate}
          />
        ))}
      </div>
    </div>
  );
}
