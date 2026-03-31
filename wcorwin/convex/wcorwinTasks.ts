import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const rows = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) => q.eq("projectId", projectId))
      .collect();
    const result: Record<string, boolean> = {};
    for (const row of rows) {
      result[row.taskKey] = row.completed;
    }
    return result;
  },
});

export const setTask = mutation({
  args: {
    projectId: v.string(),
    key: v.string(),
    value: v.boolean(),
  },
  handler: async (ctx, { projectId, key, value }) => {
    const existing = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", key)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: value });
    } else {
      await ctx.db.insert("wcorwinTasks", { projectId, taskKey: key, completed: value });
    }
  },
});

export const getDeliverables = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("wcorwinDeliverables")
      .withIndex("by_project_milestone", (q) => q.eq("projectId", projectId))
      .collect();
  },
});

export const addDeliverable = mutation({
  args: {
    projectId: v.string(),
    milestoneKey: v.string(),
    label: v.string(),
    url: v.optional(v.string()),
    type: v.string(),
    addedAt: v.number(),
    markdownContent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("wcorwinDeliverables", args);
  },
});

export const removeDeliverable = mutation({
  args: { id: v.id("wcorwinDeliverables") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
