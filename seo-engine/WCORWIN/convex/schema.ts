import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  wcorwinTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    status: v.optional(v.string()),
    name: v.optional(v.string()),
    detail: v.optional(v.string()),
  }).index("by_project_key", ["projectId", "taskKey"]),
});
