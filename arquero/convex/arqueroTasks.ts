import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const rows = await ctx.db
      .query("arqueroTasks")
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
      .query("arqueroTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", key)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: value });
    } else {
      await ctx.db.insert("arqueroTasks", { projectId, taskKey: key, completed: value });
    }
  },
});
