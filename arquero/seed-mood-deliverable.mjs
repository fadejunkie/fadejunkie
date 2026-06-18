import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new ConvexHttpClient("https://warmhearted-marlin-167.convex.cloud");

const moodBrief = readFileSync(join(__dirname, "content/02-mood-direction.md"), "utf-8");

await client.mutation(api.arqueroTasks.addDeliverable, {
  projectId: "arquero-co",
  milestoneKey: "1-MOOD + DIRECTION",
  label: "Mood + Direction Creative Brief",
  url: "",
  type: "md",
  addedAt: Date.now(),
  markdownContent: moodBrief,
});
console.log("✓ Added: Mood + Direction Creative Brief");

// Mark mood+direction task 0 complete (mood board built)
