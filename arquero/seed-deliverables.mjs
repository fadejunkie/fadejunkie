/**
 * Seed Arquero Discovery deliverables into Convex prod.
 * Run: node seed-deliverables.mjs
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "./convex/_generated/api.js";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new ConvexHttpClient("https://warmhearted-marlin-167.convex.cloud");

const brandPositioning = readFileSync(join(__dirname, "content/01-brand-positioning.md"), "utf-8");
const competitorAudit = readFileSync(join(__dirname, "content/01-competitor-audit.md"), "utf-8");

const deliverables = [
  {
    projectId: "arquero-co",
    milestoneKey: "1-DISCOVERY SESSION",
    label: "Brand Positioning",
    url: "",
    type: "md",
    addedAt: Date.now(),
    markdownContent: brandPositioning,
  },
  {
    projectId: "arquero-co",
    milestoneKey: "1-DISCOVERY SESSION",
    label: "Competitor Audit — 5 Brands",
    url: "",
    type: "md",
    addedAt: Date.now() + 1,
    markdownContent: competitorAudit,
  },
];

for (const d of deliverables) {
  try {
    await client.mutation(api.arqueroTasks.addDeliverable, d);
    console.log(`✓ Added: ${d.label}`);
  } catch (e) {
    console.error(`✗ Failed: ${d.label}`, e.message);
  }
}

console.log("Done.");
