"use client";

import { useEffect, useRef } from "react";
import type { Doc } from "@/convex/_generated/dataModel";

type Location = Doc<"locations">;

interface DirectoryMapProps {
  locations: Location[];
  selectedLocation: Location | null;
  searchCenter: { lat: number; lng: number } | null;
  onSelect: (location: Location) => void;
}

const TEXAS_CENTER: [number, number] = [31.9686, -99.9018];

const TYPE_COLORS: Record<string, string> = {
  school: "#3b82f6",
  shop: "#10b981",
  supply: "#f59e0b",
};

export default function DirectoryMap({
  locations,
  selectedLocation,
  searchCenter,
  onSelect,
}: DirectoryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").CircleMarker[]>([]);
  const searchMarkerRef = useRef<import("leaflet").CircleMarker | null>(null);

  // Initialize map
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    let L: typeof import("leaflet");
    import("leaflet").then((mod) => {
      L = mod.default ?? mod;

      const map = L.map(containerRef.current!, {
        center: TEXAS_CENTER,
        zoom: 6,
        zoomControl: true,
      });

      L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
        {
          attribution:
            '&copy; <a href="https://carto.com/">CARTO</a> &copy; <a href="https://openstreetmap.org/">OpenStreetMap</a>',
          maxZoom: 19,
        }
      ).addTo(map);

      mapRef.current = map;
    });

    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, []);

  // Update markers + fit map to visible locations
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((mod) => {
      const L = mod.default ?? mod;
      const map = mapRef.current!;

      // Remove old markers
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];

      const withCoords = locations.filter(
        (loc) => loc.lat != null && loc.lng != null
      );

      withCoords.forEach((loc) => {
        const color = TYPE_COLORS[loc.type] ?? "#6b7280";
        const isSelected = selectedLocation?._id === loc._id;

        const marker = L.circleMarker([loc.lat!, loc.lng!], {
          radius: isSelected ? 10 : 7,
          fillColor: color,
          color: "#fff",
          weight: 2,
          fillOpacity: isSelected ? 1 : 0.85,
        }).addTo(map);

        marker.bindTooltip(loc.name, { direction: "top", offset: [0, -8] });
        marker.on("click", () => onSelect(loc));
        markersRef.current.push(marker);
      });

      // Always fit to visible markers — when radius-filtered they'll be near the
      // search center already, so this naturally centers on the right region.
      if (withCoords.length > 0) {
        const bounds = L.latLngBounds(
          withCoords.map((loc) => [loc.lat!, loc.lng!] as [number, number])
        );
        map.fitBounds(bounds, { padding: [60, 60], maxZoom: 13 });
      }
    });
  }, [locations, selectedLocation, onSelect]);

  // Search center dot marker (view is handled by fitBounds above)
  useEffect(() => {
    if (!mapRef.current) return;

    import("leaflet").then((mod) => {
      const L = mod.default ?? mod;
      const map = mapRef.current!;

      searchMarkerRef.current?.remove();
      searchMarkerRef.current = null;

      if (searchCenter) {
        const marker = L.circleMarker([searchCenter.lat, searchCenter.lng], {
          radius: 8,
          fillColor: "#10b981",
          color: "#fff",
          weight: 2.5,
          fillOpacity: 1,
        }).addTo(map);
        marker.bindTooltip("Search location", { direction: "top" });
        searchMarkerRef.current = marker;
      }
    });
  }, [searchCenter]);

  return (
    <div
      ref={containerRef}
      className="w-full h-full min-h-[300px]"
      style={{ zIndex: 0 }}
    />
  );
}
