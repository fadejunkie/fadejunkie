import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const client = new ConvexHttpClient("https://warmhearted-marlin-167.convex.cloud");

// Get existing deliverables, remove old mood+direction brief, re-add with new content
const existing = await client.query(api.arqueroTasks.getDeliverables, { projectId: "arquero-co" });
const old = existing.filter(d => d.milestoneKey === "1-MOOD + DIRECTION" && d.label === "Mood + Direction Creative Brief");
for (const d of old) {
  await client.mutation(api.arqueroTasks.removeDeliverable, { id: d._id });
  console.log("✓ Removed stale:", d.label);
}

const content = readFileSync(join(__dirname, "content/02-mood-direction.md"), "utf-8");
await client.mutation(api.arqueroTasks.addDeliverable, {
  projectId: "arquero-co",
  milestoneKey: "1-MOOD + DIRECTION",
  label: "Mood + Direction — Full Presentation",
  url: "",
  type: "md",
  addedAt: Date.now(),
  markdownContent: content,
});
console.log("✓ Seeded: Mood + Direction — Full Presentation (15 slides)");
