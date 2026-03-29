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
