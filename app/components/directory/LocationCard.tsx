"use client";

import { MapPin, Globe, Phone, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Doc } from "@/convex/_generated/dataModel";

type Location = Doc<"locations">;

interface LocationCardProps {
  location: Location;
  distance?: number;
  isSelected?: boolean;
  onSelect: (location: Location) => void;
}

export default function LocationCard({
  location,
  distance,
  isSelected,
  onSelect,
}: LocationCardProps) {
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(location.address)}`;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(location)}
      onKeyDown={(e) => e.key === "Enter" && onSelect(location)}
      className={cn(
        "group p-5 border-b border-border cursor-pointer transition-colors hover:bg-accent/50",
        isSelected && "bg-accent"
      )}
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <p className="text-base font-semibold text-foreground leading-snug">
          {location.name}
        </p>
        <div className="flex gap-1 shrink-0">
          {location.status === "featured" && (
            <Badge className="bg-amber-100 text-amber-800 border-amber-200 border">
              Featured
            </Badge>
          )}
          {location.status === "verified" && (
            <Badge variant="default">Verified</Badge>
          )}
        </div>
      </div>

      <div className="flex items-start gap-1.5 text-sm text-muted-foreground mb-3">
        <MapPin size={12} className="mt-0.5 shrink-0" />
        <span className="leading-relaxed">{location.address}</span>
      </div>

      {distance != null && (
        <p className="text-sm text-muted-foreground mb-3">
          {distance.toFixed(1)} mi away
        </p>
      )}

      <div className="flex gap-1.5 flex-wrap">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs px-2"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            <Navigation size={11} className="mr-1" />
            Directions
          </a>
        </Button>
        {location.website && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={location.website} target="_blank" rel="noopener noreferrer">
              <Globe size={11} className="mr-1" />
              Website
            </a>
          </Button>
        )}
        {location.phone && (
          <Button
            size="sm"
            variant="outline"
            className="h-7 text-xs px-2"
            asChild
            onClick={(e) => e.stopPropagation()}
          >
            <a href={`tel:${location.phone}`}>
              <Phone size={11} className="mr-1" />
              Call
            </a>
          </Button>
        )}
      </div>
    </div>
  );
}
