import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  arqueroTasks: defineTable({
    projectId: v.string(),
    taskKey: v.string(),
    completed: v.boolean(),
  }).index("by_project_key", ["projectId", "taskKey"]),
});
