import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getListings = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("sydneyListings").order("desc").collect();
  },
});

export const upsertListing = mutation({
  args: {
    address: v.string(),
    price: v.number(),
    beds: v.number(),
    baths: v.number(),
    sqft: v.optional(v.number()),
    status: v.string(),
    listingUrl: v.string(),
    photoUrl: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sydneyListings")
      .filter((q) => q.eq(q.field("address"), args.address))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, args);
    } else {
      await ctx.db.insert("sydneyListings", args);
    }
  },
});

export const clearListings = mutation({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("sydneyListings").collect();
    for (const doc of all) {
      await ctx.db.delete(doc._id);
    }
    return all.length;
  },
});
