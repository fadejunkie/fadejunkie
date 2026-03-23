import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import texasSchools from "./data/texas_barber_schools.json";
import texasShops from "./data/texas_barber_shops.json";
import texasSupply from "./data/texas_barber_supply.json";

export const listLocations = query({
  args: {
    type: v.optional(v.string()),
    state: v.string(),
  },
  handler: async (ctx, args) => {
    let q = ctx.db
      .query("locations")
      .withIndex("by_state", (q) => q.eq("state", args.state));

    const results = await q.collect();

    return results.filter((loc) => {
      if (!loc.isActive) return false;
      if (args.type && loc.type !== args.type) return false;
      return true;
    });
  },
});

export const seedTexasSchools = mutation({
  args: {},
  handler: async (ctx) => {
    const schools = texasSchools as Array<{
      id: string;
      name: string;
      address: string;
      coords?: { lat: number; lng: number };
      website?: string;
      phone?: string;
    }>;

    let seeded = 0;
    let skipped = 0;

    for (const school of schools) {
      const existing = await ctx.db
        .query("locations")
        .withIndex("by_state", (q) => q.eq("state", "TX"))
        .filter((q) => q.eq(q.field("externalId"), school.id))
        .first();

      if (existing) {
        skipped++;
        continue;
      }

      await ctx.db.insert("locations", {
        type: "school",
        name: school.name,
        address: school.address,
        state: "TX",
        lat: school.coords?.lat ?? undefined,
        lng: school.coords?.lng ?? undefined,
        website: school.website ?? undefined,
        phone: school.phone ?? undefined,
        status: "regular",
        externalId: school.id,
        isActive: true,
        createdAt: Date.now(),
      });

      seeded++;
    }

    return `Seeded ${seeded} schools (${skipped} skipped as duplicates)`;
  },
});

export const seedTexasShops = mutation({
  args: { offset: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const shops = texasShops as Array<{
      id: string;
      name: string;
      address: string;
      coords?: { lat: number; lng: number };
      rating?: number | null;
    }>;

    const BATCH = 500;
    const start = args.offset ?? 0;
    const batch = shops.slice(start, start + BATCH);

    if (batch.length === 0) return `Done — all ${shops.length} shops processed`;

    // Read existing externalIds for this batch in one query
    const existingDocs = await ctx.db
      .query("locations")
      .withIndex("by_type_state", (q) =>
        q.eq("type", "shop").eq("state", "TX")
      )
      .collect();
    const existingIds = new Set(existingDocs.map((d) => d.externalId).filter(Boolean));

    let seeded = 0;
    let skipped = 0;
    const now = Date.now();

    for (const shop of batch) {
      if (existingIds.has(shop.id)) { skipped++; continue; }
      await ctx.db.insert("locations", {
        type: "shop",
        name: shop.name,
        address: shop.address,
        state: "TX",
        lat: shop.coords?.lat ?? undefined,
        lng: shop.coords?.lng ?? undefined,
        status: "regular",
        externalId: shop.id,
        isActive: true,
        createdAt: now,
      });
      seeded++;
    }

    const next = start + BATCH;
    const remaining = shops.length - next;
    return `Batch ${start}–${start + BATCH - 1}: seeded ${seeded}, skipped ${skipped}. ${remaining > 0 ? `Run again with offset=${next}` : "All done!"}`;
  },
});

export const seedTexasSupply = mutation({
  args: { offset: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const stores = texasSupply as Array<{
      id: string;
      name: string;
      address: string;
      coords?: { lat: number; lng: number };
      rating?: number | null;
    }>;

    const BATCH = 500;
    const start = args.offset ?? 0;
    const batch = stores.slice(start, start + BATCH);

    if (batch.length === 0) return `Done — all ${stores.length} stores processed`;

    const existingDocs = await ctx.db
      .query("locations")
      .withIndex("by_type_state", (q) =>
        q.eq("type", "supply").eq("state", "TX")
      )
      .collect();
    const existingIds = new Set(existingDocs.map((d) => d.externalId).filter(Boolean));

    let seeded = 0;
    let skipped = 0;
    const now = Date.now();

    for (const store of batch) {
      if (existingIds.has(store.id)) { skipped++; continue; }
      await ctx.db.insert("locations", {
        type: "supply",
        name: store.name,
        address: store.address,
        state: "TX",
        lat: store.coords?.lat ?? undefined,
        lng: store.coords?.lng ?? undefined,
        status: "regular",
        externalId: store.id,
        isActive: true,
        createdAt: now,
      });
      seeded++;
    }

    const next = start + BATCH;
    const remaining = stores.length - next;
    return `Batch ${start}–${start + BATCH - 1}: seeded ${seeded}, skipped ${skipped}. ${remaining > 0 ? `Run again with offset=${next}` : "All done!"}`;
  },
});
