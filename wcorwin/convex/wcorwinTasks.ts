import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getDeliverables = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db.query("wcorwinDeliverables")
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

export const getSignoff = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("wcorwinSignoff")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .unique();
  },
});

export const submitSignoffNotes = mutation({
  args: { projectId: v.string(), notes: v.string() },
  handler: async (ctx, { projectId, notes }) => {
    const existing = await ctx.db
      .query("wcorwinSignoff")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .unique();
    if (existing) {
      await ctx.db.patch(existing._id, { notes, notesAt: Date.now() });
    } else {
      await ctx.db.insert("wcorwinSignoff", { projectId, notes, notesAt: Date.now() });
    }
  },
});

export const submitSignoffSignature = mutation({
  args: {
    projectId: v.string(),
    signature: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { projectId, signature, notes }) => {
    const existing = await ctx.db
      .query("wcorwinSignoff")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .unique();
    const data: Record<string, unknown> = { signature, signedAt: Date.now() };
    if (notes) { data.notes = notes; data.notesAt = Date.now(); }
    if (existing) {
      await ctx.db.patch(existing._id, data as Parameters<typeof ctx.db.patch>[1]);
    } else {
      await ctx.db.insert("wcorwinSignoff", { projectId, signature, signedAt: Date.now(), ...(notes ? { notes, notesAt: Date.now() } : {}) });
    }
    // Mark month1:6 as done
    const taskKey = "month1:6";
    const taskRow = await ctx.db
      .query("wcorwinTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", taskKey)
      )
      .unique();
    if (taskRow) {
      await ctx.db.patch(taskRow._id, { status: "done" });
    } else {
      await ctx.db.insert("wcorwinTasks", { projectId, taskKey, status: "done" });
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
