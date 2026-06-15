import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listClients = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("clients").collect();
  },
});

export const getClient = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return await ctx.db
      .query("clients")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
  },
});

export const upsertClient = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    status: v.union(v.literal("active"), v.literal("prospect"), v.literal("archived")),
    hubUrl: v.optional(v.string()),
  },
  handler: async (ctx, { slug, name, status, hubUrl }) => {
    const existing = await ctx.db
      .query("clients")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name, status, hubUrl });
    } else {
      await ctx.db.insert("clients", {
        slug,
        name,
        status,
        hubUrl,
        createdAt: Date.now(),
      });
    }
  },
});

export const setClientStatus = mutation({
  args: {
    slug: v.string(),
    status: v.union(v.literal("active"), v.literal("prospect"), v.literal("archived")),
  },
  handler: async (ctx, { slug, status }) => {
    const client = await ctx.db
      .query("clients")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .first();
    if (client) {
      await ctx.db.patch(client._id, { status });
    }
  },
});
