import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getListings = query({
  args: { clientSlug: v.string() },
  handler: async (ctx, { clientSlug }) => {
    return await ctx.db
      .query("listings")
      .withIndex("by_client", (q) => q.eq("clientSlug", clientSlug))
      .collect();
  },
});

export const upsertListing = mutation({
  args: {
    clientSlug: v.string(),
    address: v.string(),
    price: v.optional(v.number()),
    beds: v.optional(v.number()),
    baths: v.optional(v.number()),
    sqft: v.optional(v.number()),
    status: v.optional(v.string()),
    listingUrl: v.optional(v.string()),
    photoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("listings")
      .withIndex("by_client", (q) => q.eq("clientSlug", args.clientSlug))
      .filter((q) => q.eq(q.field("address"), args.address))
      .first();

    if (existing) {
      const { clientSlug: _, ...updates } = args;
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("listings", args);
    }
  },
});

export const clearListings = mutation({
  args: { clientSlug: v.string() },
  handler: async (ctx, { clientSlug }) => {
    const rows = await ctx.db
      .query("listings")
      .withIndex("by_client", (q) => q.eq("clientSlug", clientSlug))
      .collect();
    await Promise.all(rows.map((r) => ctx.db.delete(r._id)));
  },
});
