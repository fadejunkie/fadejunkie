export interface GeoResult {
  lat: number;
  lng: number;
  displayName: string;
}

/** Geocode a free-text query using Nominatim (OpenStreetMap). Returns null on failure. */
export async function geocode(query: string): Promise<GeoResult | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(query)}`;
    const res = await fetch(url, {
      headers: { "User-Agent": "fadejunkie-directory/1.0" },
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (!data.length) return null;
    return {
      lat: parseFloat(data[0].lat),
      lng: parseFloat(data[0].lon),
      displayName: data[0].display_name,
    };
  } catch {
    return null;
  }
}
