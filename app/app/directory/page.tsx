"use client";

import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import LocationCard from "@/components/directory/LocationCard";
import LocationModal from "@/components/directory/LocationModal";
import { distanceMiles } from "@/lib/distance";
import { geocode } from "@/lib/geo";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

type Location = Doc<"locations">;
type LocationType = "school" | "shop" | "supply";

const DirectoryMap = dynamic(
  () => import("@/components/directory/DirectoryMap"),
  { ssr: false, loading: () => <div className="w-full h-full bg-muted animate-pulse" /> }
);

const RADIUS_OPTIONS = [
  { label: "Any distance", value: 0 },
  { label: "Within 10 mi", value: 10 },
  { label: "Within 25 mi", value: 25 },
  { label: "Within 50 mi", value: 50 },
  { label: "Within 100 mi", value: 100 },
];

const TYPE_TABS: { type: LocationType; label: string }[] = [
  { type: "school", label: "Schools" },
  { type: "shop", label: "Shops" },
  { type: "supply", label: "Supply" },
];

const TYPE_LABELS: Record<LocationType, { singular: string; plural: string }> = {
  school: { singular: "school", plural: "schools" },
  shop: { singular: "shop", plural: "shops" },
  supply: { singular: "supply store", plural: "supply stores" },
};

export default function DirectoryPage() {
  const [activeType, setActiveType] = useState<LocationType>("school");
  const [query, setQuery] = useState("");
  const [radius, setRadius] = useState(0);
  const [geocoding, setGeocoding] = useState(false);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  const rawLocations = useQuery(api.locations.listLocations, {
    state: "TX",
    type: activeType,
  });

  const visibleLocations = useMemo(() => {
    if (!rawLocations) return [];

    let list = rawLocations;

    // Text search — only when not in geocoded-location mode
    if (query.trim() && !searchCenter) {
      const q = query.toLowerCase();
      list = list.filter(
        (loc) =>
          loc.name.toLowerCase().includes(q) ||
          loc.address.toLowerCase().includes(q)
      );
    }

    // Radius filter
    if (searchCenter && radius > 0) {
      list = list.filter((loc) => {
        if (loc.lat == null || loc.lng == null) return false;
        return distanceMiles(searchCenter.lat, searchCenter.lng, loc.lat, loc.lng) <= radius;
      });
    }

    return list;
  }, [rawLocations, query, radius, searchCenter]);

  const getDistance = (loc: Location) => {
    if (!searchCenter || loc.lat == null || loc.lng == null) return undefined;
    return distanceMiles(searchCenter.lat, searchCenter.lng, loc.lat, loc.lng);
  };

  const handleSearch = async () => {
    if (!query.trim()) return;
    setGeocoding(true);
    try {
      const result = await geocode(query + ", Texas");
      if (result) {
        setSearchCenter({ lat: result.lat, lng: result.lng });
        if (radius === 0) setRadius(25);
      }
    } finally {
      setGeocoding(false);
    }
  };

  const handleTypeChange = (type: LocationType) => {
    setActiveType(type);
    setSelectedLocation(null);
    setQuery("");
    setSearchCenter(null);
    setRadius(0);
  };

  const { plural } = TYPE_LABELS[activeType];

  return (
    <>
      {/* Page header */}
      <div className="border-b border-border px-6 py-5 sm:py-6">
        <div className="max-w-screen-xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-semibold text-foreground" style={{ textTransform: "none" }}>
              Texas Barber {plural.charAt(0).toUpperCase() + plural.slice(1)}
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {rawLocations == null
                ? "Loading..."
                : `${rawLocations.length.toLocaleString()} ${plural} across Texas`}
            </p>
          </div>

          {/* Filters */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Type tabs */}
            <div className="flex items-center border border-foreground rounded-md overflow-hidden h-8 text-xs shrink-0">
              {TYPE_TABS.map(({ type, label }, i) => (
                <button
                  key={type}
                  onClick={() => handleTypeChange(type)}
                  className={cn(
                    "px-3.5 h-full font-sans font-semibold transition-colors",
                    i > 0 && "border-l border-foreground",
                    activeType === type
                      ? "bg-foreground text-background"
                      : "bg-background text-foreground hover:bg-accent"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>

            {/* Search input */}
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Input
                placeholder={`City or ${activeType} name...`}
                value={query}
                onChange={(e) => { setQuery(e.target.value); setSearchCenter(null); }}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                className="pr-9 h-8 text-sm"
              />
              <button
                onClick={handleSearch}
                disabled={geocoding}
                className="absolute right-2 top-1/2 -translate-y-1/2 font-sans text-muted-foreground hover:text-foreground"
                aria-label="Search"
              >
                {geocoding ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <Search size={14} />
                )}
              </button>
            </div>

            {/* Radius */}
            <select
              value={radius}
              onChange={(e) => setRadius(Number(e.target.value))}
              className="h-8 text-sm border border-border rounded-md px-2 bg-background text-foreground"
            >
              {RADIUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Main layout */}
      <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
        {/* List */}
        <div className="md:w-[400px] shrink-0 overflow-y-auto border-r border-border order-2 md:order-1 max-h-[40vh] md:max-h-none">
          {rawLocations == null ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground text-sm gap-2">
              <Loader2 size={16} className="animate-spin" />
              Loading {plural}...
            </div>
          ) : visibleLocations.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground text-sm px-6">
              No {plural} match your search.{" "}
              {(query || radius > 0) && (
                <button
                  onClick={() => { setQuery(""); setSearchCenter(null); setRadius(0); }}
                  className="font-sans underline hover:no-underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            visibleLocations.map((loc) => (
              <LocationCard
                key={loc._id}
                location={loc}
                distance={getDistance(loc)}
                isSelected={selectedLocation?._id === loc._id}
                onSelect={setSelectedLocation}
              />
            ))
          )}
        </div>

        {/* Map */}
        <div className="flex-1 order-1 md:order-2 h-64 md:h-auto relative">
          <DirectoryMap
            locations={visibleLocations}
            selectedLocation={selectedLocation}
            searchCenter={searchCenter}
            onSelect={setSelectedLocation}
          />
          {visibleLocations.length > 0 && rawLocations != null && (
            <div className="absolute bottom-3 right-3 bg-background/90 border border-border rounded-md px-2 py-1 text-xs text-muted-foreground pointer-events-none">
              {visibleLocations.length.toLocaleString()} of {rawLocations.length.toLocaleString()} shown
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {selectedLocation && (
        <LocationModal
          location={selectedLocation}
          onClose={() => setSelectedLocation(null)}
        />
      )}
    </>
  );
}
