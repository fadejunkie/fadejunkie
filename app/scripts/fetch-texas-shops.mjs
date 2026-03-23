#!/usr/bin/env node
/**
 * scripts/fetch-texas-shops.mjs
 *
 * Grid-searches Texas via Google Places Text Search API and writes
 * convex/data/texas_barber_shops.json  (committed, then seeded via Convex).
 *
 * Usage:
 *   node scripts/fetch-texas-shops.mjs
 *
 * The script reads `google_places_api` from .env.local automatically.
 * Saves a checkpoint every 25 grid points so it can resume on failure.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

// ── API key ────────────────────────────────────────────────────────────────
function getApiKey() {
  if (process.env.GOOGLE_PLACES_API_KEY) return process.env.GOOGLE_PLACES_API_KEY;
  if (process.env.google_places_api) return process.env.google_places_api;
  try {
    const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
    const m = env.match(/google_places_api=(.+)/);
    if (m) return m[1].trim();
  } catch {}
  return null;
}

const API_KEY = getApiKey();
if (!API_KEY) {
  console.error("❌  No API key found. Add google_places_api=YOUR_KEY to .env.local");
  process.exit(1);
}

// ── Grid config ────────────────────────────────────────────────────────────
// Texas bbox: lat 25.84–36.50, lng -106.65 to -93.51
// 0.65° step ≈ 72 km at 31°N, 50 km radius → good overlap
const LAT_MIN = 25.9, LAT_MAX = 36.45, LAT_STEP = 0.65;
const LNG_MIN = -106.5, LNG_MAX = -93.55, LNG_STEP = 0.75;
const RADIUS = 50000; // metres

function generateGrid() {
  const pts = [];
  for (let lat = LAT_MIN; lat <= LAT_MAX + 0.01; lat += LAT_STEP)
    for (let lng = LNG_MIN; lng <= LNG_MAX + 0.01; lng += LNG_STEP)
      pts.push({ lat: +lat.toFixed(4), lng: +lng.toFixed(4) });
  return pts;
}

// ── Paths ──────────────────────────────────────────────────────────────────
const OUTPUT = path.join(ROOT, "convex/data/texas_barber_shops.json");
const CHECKPOINT = path.join(ROOT, "convex/data/.shops_checkpoint.json");

// ── Helpers ────────────────────────────────────────────────────────────────
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function searchGrid(lat, lng) {
  const results = [];
  let pageToken = null;
  let page = 0;

  do {
    let url;
    if (pageToken) {
      await sleep(2200); // Google requires ~2 s between paginated requests
      url = `https://maps.googleapis.com/maps/api/place/textsearch/json?pagetoken=${pageToken}&key=${API_KEY}`;
    } else {
      url =
        `https://maps.googleapis.com/maps/api/place/textsearch/json` +
        `?query=barber+shop` +
        `&location=${lat},${lng}` +
        `&radius=${RADIUS}` +
        `&key=${API_KEY}`;
    }

    const data = await fetchJson(url);

    if (data.status === "ZERO_RESULTS") break;
    if (data.status !== "OK") {
      process.stderr.write(` [${data.status}: ${data.error_message ?? ""}] `);
      break;
    }

    results.push(...data.results);
    pageToken = data.next_page_token ?? null;
    page++;
  } while (pageToken && page < 3);

  return results;
}

// ── Main ───────────────────────────────────────────────────────────────────
async function main() {
  const grid = generateGrid();
  console.log(`\n📍  ${grid.length} grid points · 50 km radius · up to 3 pages each`);
  console.log(`    Output → ${OUTPUT}\n`);

  // Load checkpoint if it exists
  const allPlaces = new Map();
  let startIdx = 0;

  if (fs.existsSync(CHECKPOINT)) {
    try {
      const cp = JSON.parse(fs.readFileSync(CHECKPOINT, "utf8"));
      for (const p of cp.places) allPlaces.set(p.id, p);
      startIdx = cp.nextIdx;
      console.log(`▶  Resuming from grid point ${startIdx} (${allPlaces.size} shops already found)\n`);
    } catch {
      console.log("⚠  Checkpoint unreadable, starting fresh\n");
    }
  }

  for (let i = startIdx; i < grid.length; i++) {
    const { lat, lng } = grid[i];
    const pct = (((i + 1) / grid.length) * 100).toFixed(1);
    process.stdout.write(`[${String(i + 1).padStart(3)}/${grid.length}] ${pct.padStart(5)}%  (${lat}, ${lng})  `);

    try {
      const raw = await searchGrid(lat, lng);
      let newCount = 0;

      for (const p of raw) {
        if (p.business_status === "CLOSED_PERMANENTLY") continue;
        if (!allPlaces.has(p.place_id)) {
          allPlaces.set(p.place_id, {
            id: p.place_id,
            name: p.name,
            address: p.formatted_address ?? "",
            coords: {
              lat: p.geometry.location.lat,
              lng: p.geometry.location.lng,
            },
            rating: p.rating ?? null,
          });
          newCount++;
        }
      }

      console.log(`+${String(newCount).padStart(3)} new   (${allPlaces.size} total)`);
    } catch (err) {
      console.log(`ERROR: ${err.message}`);
    }

    // Checkpoint every 25 grid points
    if ((i + 1) % 25 === 0 || i === grid.length - 1) {
      fs.writeFileSync(
        CHECKPOINT,
        JSON.stringify({ nextIdx: i + 1, places: Array.from(allPlaces.values()) })
      );
    }

    await sleep(120); // small pause between grid points
  }

  // Final output
  const shops = Array.from(allPlaces.values()).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, JSON.stringify(shops, null, 2));

  // Clean up checkpoint
  try { fs.unlinkSync(CHECKPOINT); } catch {}

  console.log(`\n✅  Saved ${shops.length} shops → ${OUTPUT}`);
  console.log(`\nNext steps:`);
  console.log(`  1. npx convex run locations:seedTexasShops`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
