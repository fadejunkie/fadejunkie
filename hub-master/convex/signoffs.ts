import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getSignoff = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("signoffs")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();
  },
});

export const submitNotes = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    notes: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId, notes }) => {
    const existing = await ctx.db
      .query("signoffs")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { notes, notesAt: Date.now() });
    } else {
      await ctx.db.insert("signoffs", {
        clientSlug,
        projectId,
        notes,
        notesAt: Date.now(),
      });
    }
  },
});

export const submitSignature = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    signature: v.string(),
    // Optional: auto-complete a task key on sign (e.g. wcorwin "month1:6")
    completionTaskKey: v.optional(v.string()),
  },
  handler: async (ctx, { clientSlug, projectId, signature, completionTaskKey }) => {
    const existing = await ctx.db
      .query("signoffs")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { signature, signedAt: Date.now() });
    } else {
      await ctx.db.insert("signoffs", {
        clientSlug,
        projectId,
        signature,
        signedAt: Date.now(),
      });
    }

    // Auto-mark a task complete on signoff (wcorwin pattern)
    if (completionTaskKey) {
      const task = await ctx.db
        .query("tasks")
        .withIndex("by_client_project_key", (q) =>
          q.eq("clientSlug", clientSlug).eq("projectId", projectId).eq("taskKey", completionTaskKey)
        )
        .first();
      if (task) {
        await ctx.db.patch(task._id, { status: "done" });
      } else {
        await ctx.db.insert("tasks", {
          clientSlug,
          projectId,
          taskKey: completionTaskKey,
          status: "done",
        });
      }
    }
  },
});
