import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const getGalleryForBarber = query({
  args: { barberId: v.id("barbers") },
  handler: async (ctx, { barberId }) => {
    return ctx.db
      .query("gallery")
      .withIndex("by_barberId_order", (q) => q.eq("barberId", barberId))
      .order("asc")
      .collect();
  },
});

export const addGalleryPhoto = mutation({
  args: {
    barberId: v.id("barbers"),
    storageId: v.id("_storage"),
    caption: v.optional(v.string()),
  },
  handler: async (ctx, { barberId, storageId, caption }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    // Verify ownership
    const barber = await ctx.db.get(barberId);
    if (!barber || barber.userId !== userId) throw new Error("Not authorized");

    const url = (await ctx.storage.getUrl(storageId)) ?? "";

    // Get current max order
    const photos = await ctx.db
      .query("gallery")
      .withIndex("by_barberId", (q) => q.eq("barberId", barberId))
      .collect();
    const maxOrder = photos.reduce((max, p) => Math.max(max, p.order), -1);

    return ctx.db.insert("gallery", {
      barberId,
      storageId,
      url,
      caption,
      order: maxOrder + 1,
      createdAt: Date.now(),
    });
  },
});

export const deleteGalleryPhoto = mutation({
  args: { photoId: v.id("gallery") },
  handler: async (ctx, { photoId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const photo = await ctx.db.get(photoId);
    if (!photo) throw new Error("Photo not found");

    const barber = await ctx.db.get(photo.barberId);
    if (!barber || barber.userId !== userId) throw new Error("Not authorized");

    await ctx.storage.delete(photo.storageId);
    await ctx.db.delete(photoId);
  },
});
