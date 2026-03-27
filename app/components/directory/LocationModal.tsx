"use client";

import { useEffect } from "react";
import { X, MapPin, Phone, Globe, Navigation, Clock, GraduationCap } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import type { Doc } from "@/convex/_generated/dataModel";

type Location = Doc<"locations">;

interface LocationModalProps {
  location: Location;
  onClose: () => void;
}

const TYPE_LABEL: Record<string, string> = {
  school: "Barber School",
  shop: "Barber Shop",
  supply: "Supply Store",
};

export default function LocationModal({ location, onClose }: LocationModalProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative bg-background w-full sm:max-w-lg sm:rounded-xl shadow-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-background border-b border-border px-5 py-4 flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground leading-snug">{location.name}</p>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              <Badge variant="muted">{TYPE_LABEL[location.type] ?? location.type}</Badge>
              {location.status === "featured" && (
                <Badge variant="secondary">Featured</Badge>
              )}
              {location.status === "verified" && (
                <Badge variant="outline">Verified</Badge>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={16} />
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-5 space-y-5">
          {/* Address */}
          <div className="flex items-start gap-2 text-sm">
            <MapPin size={15} className="mt-0.5 shrink-0 text-muted-foreground" />
            <a
              href={mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground hover:underline leading-relaxed"
            >
              {location.address}
            </a>
          </div>

          {/* Facts grid */}
          {(location.phone || location.programs?.length || location.hoursRequired || location.schedule || location.tuition) && (
            <div className="grid grid-cols-2 gap-3">
              {location.phone && (
                <div className="flex items-start gap-2 text-sm">
                  <Phone size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                    <a href={`tel:${location.phone}`} className="hover:underline">
                      {location.phone}
                    </a>
                  </div>
                </div>
              )}
              {location.hoursRequired != null && (
                <div className="flex items-start gap-2 text-sm">
                  <Clock size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Hours Required</p>
                    <p>{location.hoursRequired.toLocaleString()} hrs</p>
                  </div>
                </div>
              )}
              {location.schedule && (
                <div className="flex items-start gap-2 text-sm">
                  <Clock size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Schedule</p>
                    <p>{location.schedule}</p>
                  </div>
                </div>
              )}
              {location.tuition && (
                <div className="flex items-start gap-2 text-sm">
                  <GraduationCap size={13} className="mt-0.5 shrink-0 text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Tuition</p>
                    <p>{location.tuition}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Programs */}
          {location.programs && location.programs.length > 0 && (
            <div>
              <p className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                <GraduationCap size={13} />
                Programs
              </p>
              <div className="flex flex-wrap gap-1.5">
                {location.programs.map((p) => (
                  <Badge key={p} variant="outline">{p}</Badge>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          {location.description ? (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {location.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground leading-relaxed">
              {location.name} is a licensed barber {TYPE_LABEL[location.type]?.toLowerCase() ?? "institution"} located in {location.city ?? location.address.split(",").slice(-2, -1)[0]?.trim() ?? "Texas"}.
            </p>
          )}
        </div>

        {/* Footer actions */}
        <div className="sticky bottom-0 bg-background border-t border-border px-5 py-4 flex gap-2 flex-wrap">
          <Button asChild>
            <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation size={14} className="mr-1.5" />
              Get Directions
            </a>
          </Button>
          {location.phone && (
            <Button variant="outline" asChild>
              <a href={`tel:${location.phone}`}>
                <Phone size={14} className="mr-1.5" />
                Call
              </a>
            </Button>
          )}
          {location.website && (
            <Button variant="outline" asChild>
              <a href={location.website} target="_blank" rel="noopener noreferrer">
                <Globe size={14} className="mr-1.5" />
                Visit Website
              </a>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
