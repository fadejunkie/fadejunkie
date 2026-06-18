import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  allisonTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  }).index("by_project_key", ["projectId", "taskKey"]),

  allisonAgreements: defineTable({
    projectId: v.string(),
    sigData: v.string(),
    signedDate: v.string(),
    signedAt: v.number(),
  }).index("by_project", ["projectId"]),

  allisonDiscovery: defineTable({
    projectId: v.string(),
    responses: v.string(),
    submittedAt: v.number(),
  }).index("by_project", ["projectId"]),

  allisonDeliverables: defineTable({
    projectId: v.string(),
    milestoneKey: v.string(),
    label: v.string(),
    url: v.optional(v.string()),
    type: v.string(),
    addedAt: v.number(),
    markdownContent: v.optional(v.string()),
  }).index("by_project_milestone", ["projectId", "milestoneKey"]),
});
