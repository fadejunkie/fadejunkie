import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  handler: async (ctx) => ctx.db.query("collections").collect(),
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) =>
    ctx.db
      .query("collections")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique(),
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, args) => ctx.db.insert("collections", args),
});

export const update = mutation({
  args: {
    id: v.id("collections"),
    name: v.optional(v.string()),
    slug: v.optional(v.string()),
    description: v.optional(v.string()),
    image: v.optional(v.string()),
    sortOrder: v.optional(v.number()),
  },
  handler: async (ctx, { id, ...patch }) => ctx.db.patch(id, patch),
});

export const remove = mutation({
  args: { id: v.id("collections") },
  handler: async (ctx, args) => ctx.db.delete(args.id),
});
