import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";

export const toggleLike = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const existing = await ctx.db
      .query("likes")
      .withIndex("by_postId_userId", (q) =>
        q.eq("postId", postId).eq("userId", userId)
      )
      .unique();

    if (existing) {
      await ctx.db.delete(existing._id);
      return { liked: false };
    } else {
      await ctx.db.insert("likes", {
        postId,
        userId,
        createdAt: Date.now(),
      });
      return { liked: true };
    }
  },
});

export const getLikeState = query({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);

    const allLikes = await ctx.db
      .query("likes")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .collect();

    let liked = false;
    if (userId) {
      liked = allLikes.some((l) => l.userId === userId);
    }

    return { liked, count: allLikes.length };
  },
});
