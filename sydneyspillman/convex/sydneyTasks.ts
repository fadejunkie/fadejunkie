import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

export const getTasks = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const rows = await ctx.db
      .query("sydneyTasks")
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
      .query("sydneyTasks")
      .withIndex("by_project_key", (q) =>
        q.eq("projectId", projectId).eq("taskKey", key)
      )
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, { completed: value });
    } else {
      await ctx.db.insert("sydneyTasks", { projectId, taskKey: key, completed: value });
    }
  },
});

export const getAgreement = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("sydneyAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
  },
});

export const saveAgreement = mutation({
  args: {
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sydneyAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    const doc = {
      sigData: args.sigData,
      signedDate: args.signedDate,
      signedAt: args.signedAt,
    };
    if (existing) {
      await ctx.db.patch(existing._id, doc);
    } else {
      await ctx.db.insert("sydneyAgreements", { projectId: args.projectId, ...doc });
    }
  },
});

export const clearAgreement = mutation({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    const existing = await ctx.db
      .query("sydneyAgreements")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
    if (existing) {
      await ctx.db.delete(existing._id);
    }
  },
});

export const saveDiscovery = mutation({
  args: {
    projectId: v.string(),
    responses: v.string(),
    submittedAt: v.number(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query("sydneyDiscovery")
      .withIndex("by_project", (q) => q.eq("projectId", args.projectId))
      .first();
    if (existing) {
      await ctx.db.patch(existing._id, {
        responses: args.responses,
        submittedAt: args.submittedAt,
      });
    } else {
      await ctx.db.insert("sydneyDiscovery", {
        projectId: args.projectId,
        responses: args.responses,
        submittedAt: args.submittedAt,
      });
    }
  },
});

export const getDiscovery = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("sydneyDiscovery")
      .withIndex("by_project", (q) => q.eq("projectId", projectId))
      .first();
  },
});

export const getDeliverables = query({
  args: { projectId: v.string() },
  handler: async (ctx, { projectId }) => {
    return await ctx.db
      .query("sydneyDeliverables")
      .withIndex("by_project_milestone", (q) => q.eq("projectId", projectId))
      .collect();
  },
});

export const addDeliverable = mutation({
  args: {
    projectId: v.string(),
    milestoneKey: v.string(),
    label: v.string(),
    url: v.string(),
    type: v.string(),
    addedAt: v.number(),
  },
  handler: async (ctx, args) => {
    await ctx.db.insert("sydneyDeliverables", args);
  },
});

export const removeDeliverable = mutation({
  args: { id: v.id("sydneyDeliverables") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
