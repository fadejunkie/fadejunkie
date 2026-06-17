import { v } from "convex/values";
import { internalMutation, mutation, query } from "./_generated/server";

// Client-facing: getSignoff (hub reads), submitSignature (wcorwin client signs monthly)
// Ops-only: submitNotes → internalMutation (Anthony writes notes, not the client)

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

// Ops-only: Anthony writes monthly notes before client sees the signoff
export const submitNotes = internalMutation({
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

// Client-facing: wcorwin client signs off on the monthly deliverable report
export const submitSignature = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    signature: v.string(),
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
