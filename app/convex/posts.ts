import { query, mutation } from "./_generated/server";
import { getAuthUserId } from "@convex-dev/auth/server";
import { v } from "convex/values";
import { paginationOptsValidator } from "convex/server";

export const listFeedPosts = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const page = await ctx.db
      .query("posts")
      .withIndex("by_createdAt")
      .order("desc")
      .paginate(paginationOpts);

    const enriched = await Promise.all(
      page.page.map(async (post) => {
        let barberName: string | null = null;
        let barberSlug: string | null = null;
        let barberAvatarUrl: string | null = null;

        if (post.barberId) {
          const barber = await ctx.db.get(post.barberId);
          if (barber) {
            barberName = barber.name;
            barberSlug = barber.slug;
            barberAvatarUrl = barber.avatarUrl ?? null;
          }
        }

        // Fallback: look up barber by authorId
        if (!barberName) {
          const barber = await ctx.db
            .query("barbers")
            .withIndex("by_userId", (q) => q.eq("userId", post.authorId))
            .unique();
          if (barber) {
            barberName = barber.name;
            barberSlug = barber.slug;
            barberAvatarUrl = barber.avatarUrl ?? null;
          }
        }

        const likesCount = await ctx.db
          .query("likes")
          .withIndex("by_postId", (q) => q.eq("postId", post._id))
          .collect();

        const myLike = await ctx.db
          .query("likes")
          .withIndex("by_postId_userId", (q) =>
            q.eq("postId", post._id).eq("userId", userId)
          )
          .unique();

        return {
          ...post,
          barberName,
          barberSlug,
          barberAvatarUrl,
          likeCount: likesCount.length,
          liked: !!myLike,
          isOwn: post.authorId === userId,
        };
      })
    );

    return { ...page, page: enriched };
  },
});

export const createPost = mutation({
  args: {
    content: v.string(),
    imageStorageId: v.optional(v.id("_storage")),
  },
  handler: async (ctx, { content, imageStorageId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");
    if (content.trim().length === 0) throw new Error("Post cannot be empty");
    if (content.length > 500) throw new Error("Post exceeds 500 characters");

    const barber = await ctx.db
      .query("barbers")
      .withIndex("by_userId", (q) => q.eq("userId", userId))
      .unique();

    let imageUrl: string | undefined;
    if (imageStorageId) {
      imageUrl = (await ctx.storage.getUrl(imageStorageId)) ?? undefined;
    }

    return ctx.db.insert("posts", {
      authorId: userId,
      barberId: barber?._id,
      content: content.trim(),
      imageStorageId,
      imageUrl,
      createdAt: Date.now(),
    });
  },
});

export const deletePost = mutation({
  args: { postId: v.id("posts") },
  handler: async (ctx, { postId }) => {
    const userId = await getAuthUserId(ctx);
    if (!userId) throw new Error("Not authenticated");

    const post = await ctx.db.get(postId);
    if (!post) throw new Error("Post not found");
    if (post.authorId !== userId) throw new Error("Not authorized");

    // Delete all likes
    const likes = await ctx.db
      .query("likes")
      .withIndex("by_postId", (q) => q.eq("postId", postId))
      .collect();
    await Promise.all(likes.map((l) => ctx.db.delete(l._id)));

    // Delete image if present
    if (post.imageStorageId) {
      await ctx.storage.delete(post.imageStorageId);
    }

    await ctx.db.delete(postId);
  },
});
