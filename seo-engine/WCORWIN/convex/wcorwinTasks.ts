import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getOverrides = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const rows = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) => q.eq("projectId", projectId))
      .collect();
    const map: Record<string, { status?: string; name?: string; detail?: string; doc?: string }> = {};
    for (const row of rows) {
      map[row.taskKey] = {};
      if (row.status) map[row.taskKey].status = row.status;
      if (row.name) map[row.taskKey].name = row.name;
      if (row.detail) map[row.taskKey].detail = row.detail;
      if (row.doc) map[row.taskKey].doc = row.doc;
    }
    return map;
  },
});

export const setStatus = mutation({
  args: {
    projectId: v.string(),
    taskKey: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { projectId, taskKey, status }) => {
    const existing = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { status });
    } else {
      await ctx.db.insert("wcorwinTasks", { projectId, taskKey, status });
    }
  },
});

export const setText = mutation({
  args: {
    projectId: v.string(),
    taskKey: v.string(),
    name: v.optional(v.string()),
    detail: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, taskKey, name, detail }) => {
    const existing = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .unique();
    const patch: { name?: string; detail?: string } = {};
    if (name !== undefined) patch.name = name;
    if (detail !== undefined) patch.detail = detail;
    if (existing) {
      await ctx.db.patch(existing._id, patch);
    } else {
      await ctx.db.insert("wcorwinTasks", { projectId, taskKey, ...patch });
    }
  },
});

export const setDoc = mutation({
  args: {
    projectId: v.string(),
    taskKey: v.string(),
    doc: v.string(),
  },
  handler: async (ctx, { projectId, taskKey, doc }) => {
    const existing = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { doc });
    } else {
      await ctx.db.insert("wcorwinTasks", { projectId, taskKey, doc });
    }
  },
});
