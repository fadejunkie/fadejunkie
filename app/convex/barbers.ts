import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getMyBarberProfile = query({
  args: {},
  handler: async (ctx) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) return null;
    return ctx.db
      .query("barbers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();
  },
});

export const getBarberBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    return ctx.db
      .query("barbers")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
  },
});

export const checkSlugAvailable = query({
  args: { slug: v.string() },
  handler: async (ctx, { slug }) => {
    const userId = await getAuthUserId(ctx);
    const existing = await ctx.db
      .query("barbers")
      .withIndex("by_slug", (q) => q.eq("slug", slug))
      .unique();
    if (!existing) return true;
    // slug is available if it belongs to the current user
    if (userId && existing.userId === userId) return true;
    return false;
  },
});

export const upsertBarberProfile = mutation({
  args: {
    slug: v.string(),
    name: v.string(),
    bio: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    bookingUrl: v.optional(v.string()),
    shopName: v.optional(v.string()),
    location: v.optional(v.string()),
    services: v.array(v.string()),
    avatarStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, args) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Validate slug format
    if (!/^[a-z0-9-]{3,30}$/.test(args.slug)) {
      throw new Error("Slug must be 3–30 lowercase letters, numbers, or hyphens");
    }

    // Check slug uniqueness
    const slugConflict = await ctx.db
      .query("barbers")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
    if (slugConflict && slugConflict.userId !== userId) {
      throw new Error("That handle is already taken");
    }

    // Resolve avatar URL if a new storage ID was provided
    let avatarUrl: string | undefined;
    if (args.avatarStorageId) {
      avatarUrl = (await ctx.storage.getUrl(args.avatarStorageId)) ?? undefined;
    }

    const now = Date.now();
    const existing = await ctx.db
      .query("barbers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, {
        ...args,
        ...(avatarUrl ? { avatarUrl } : {}),
        updatedAt: now,
      });
      return existing._id;
    } else {
      return ctx.db.insert("barbers", {
        userId,
        ...args,
        avatarUrl,
        createdAt: now,
        updatedAt: now,
      });
    }
  },
});

export const listAllBarbers = query({
  args: {},
  handler: async (ctx) => {
    return ctx.db.query("barbers").collect();
  },
});
