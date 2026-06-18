import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// Returns all tasks for a client+project as a map of taskKey → completed (bool)
// For wcorwin, also returns status/name/detail/doc fields
export const getTasks = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    const rows = await ctx.db
      .query("tasks")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .collect();

    const result: Record<string, boolean> = {};
    for (const row of rows) {
      result[row.taskKey] = row.completed ?? false;
    }
    return result;
  },
});

// Full task records (for wcorwin-style rich tasks)
export const getTasksFull = query({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId }) => {
    return await ctx.db
      .query("tasks")
      .withIndex("by_client_project", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId)
      )
      .collect();
  },
});

// Standard task toggle (boolean)
export const setTask = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  },
  handler: async (ctx, { clientSlug, projectId, taskKey, completed }) => {
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_client_project_key", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { completed });
    } else {
      await ctx.db.insert("tasks", { clientSlug, projectId, taskKey, completed });
    }
  },
});

// Wcorwin: set task status string
export const setTaskStatus = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.string(),
    status: v.string(),
  },
  handler: async (ctx, { clientSlug, projectId, taskKey, status }) => {
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_client_project_key", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { status });
    } else {
      await ctx.db.insert("tasks", { clientSlug, projectId, taskKey, status });
    }
  },
});

// Wcorwin: set task display text
export const setTaskText = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.string(),
    name: v.optional(v.string()),
    detail: v.optional(v.string()),
  },
  handler: async (ctx, { clientSlug, projectId, taskKey, name, detail }) => {
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_client_project_key", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { name, detail });
    } else {
      await ctx.db.insert("tasks", { clientSlug, projectId, taskKey, name, detail });
    }
  },
});

// Wcorwin: attach a doc URL to a task
export const setTaskDoc = mutation({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
    taskKey: v.string(),
    doc: v.optional(v.string()),
  },
  handler: async (ctx, { clientSlug, projectId, taskKey, doc }) => {
    const existing = await ctx.db
      .query("tasks")
      .withIndex("by_client_project_key", (q) =>
        q.eq("clientSlug", clientSlug).eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .first();

    if (existing) {
      await ctx.db.patch(existing._id, { doc });
    } else {
      await ctx.db.insert("tasks", { clientSlug, projectId, taskKey, doc });
    }
  },
});
