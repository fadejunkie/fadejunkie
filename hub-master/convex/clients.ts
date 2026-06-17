import { v } from "convex/values";
import { internalMutation, query } from "./_generated/server";

// Client-facing reads: listClients, getClient (hubs use these to bootstrap)
// Ops-only writes: upsertClient, setClientStatus → internalMutation (SEC-9)

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

// Ops-only: client registry is managed by Anthony/agents, not by clients
export const upsertClient = internalMutation({
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

// Ops-only
export const setClientStatus = internalMutation({
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
