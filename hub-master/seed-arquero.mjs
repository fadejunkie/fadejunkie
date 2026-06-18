/**
 * Seed Arquero Phase 1 state into hub-master.
 * - 19 Phase 1 task completions (all done)
 * - 5 brand document deliverables from disk
 * - Direction pick: "B" (Refined Craft)
 * - Agreement: signed offline (PDF)
 *
 * Run: node seed-arquero.mjs
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const HUB_MASTER_URL = "https://warmhearted-cormorant-536.convex.cloud";
const CLIENT_SLUG = "arquero";
const PROJECT_ID = "arquero-co";

// ─── HTTP helper ──────────────────────────────────────────────────────────────
async function mutation(path, args) {
  const res = await fetch(`${HUB_MASTER_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`${path} failed: ${text}`);
  return JSON.parse(text);
}

// ─── Content files (from arquero project) ────────────────────────────────────
const CONTENT_DIR = join(__dirname, "../arquero/content");

function readContent(filename) {
  return readFileSync(join(CONTENT_DIR, filename), "utf-8");
}

// ─── 1. Phase 1 task completions ─────────────────────────────────────────────
console.log("\n── Phase 1 task completions ──");

const phase1Tasks = [
  // DISCOVERY SESSION (4 tasks)
  "1-DISCOVERY SESSION-0",
  "1-DISCOVERY SESSION-1",
  "1-DISCOVERY SESSION-2",
  "1-DISCOVERY SESSION-3",
  // MOOD + DIRECTION (3 tasks)
  "1-MOOD + DIRECTION-0",
  "1-MOOD + DIRECTION-1",
  "1-MOOD + DIRECTION-2",
  // LOGO DESIGN (6 tasks)
  "1-LOGO DESIGN-0",
  "1-LOGO DESIGN-1",
  "1-LOGO DESIGN-2",
  "1-LOGO DESIGN-3",
  "1-LOGO DESIGN-4",
  "1-LOGO DESIGN-5",
  // BRAND SYSTEM (6 tasks)
  "1-BRAND SYSTEM-0",
  "1-BRAND SYSTEM-1",
  "1-BRAND SYSTEM-2",
  "1-BRAND SYSTEM-3",
  "1-BRAND SYSTEM-4",
  "1-BRAND SYSTEM-5",
];

for (const taskKey of phase1Tasks) {
  await mutation("tasks:setTask", {
    clientSlug: CLIENT_SLUG,
    projectId: PROJECT_ID,
    taskKey,
    completed: true,
  });
  console.log(`  ✓ ${taskKey}`);
}

// ─── 2. Deliverables — brand documents ───────────────────────────────────────
console.log("\n── Brand deliverables ──");

const deliverables = [
  {
    milestoneKey: "1-DISCOVERY SESSION",
    label: "Client Intake Questionnaire",
    type: "md",
    file: "01-client-intake.md",
  },
  {
    milestoneKey: "1-DISCOVERY SESSION",
    label: "Brand Positioning",
    type: "md",
    file: "01-brand-positioning.md",
  },
  {
    milestoneKey: "1-DISCOVERY SESSION",
    label: "Competitor Audit — 5 Brands",
    type: "md",
    file: "01-competitor-audit.md",
  },
  {
    milestoneKey: "1-MOOD + DIRECTION",
    label: "Mood + Direction Research",
    type: "md",
    file: "02-mood-direction-research.md",
  },
  {
    milestoneKey: "1-MOOD + DIRECTION",
    label: "Mood + Direction — Full Presentation",
    type: "md",
    file: "02-mood-direction.md",
  },
];

for (const d of deliverables) {
  const markdownContent = readContent(d.file);
  await mutation("deliverables:addDeliverable", {
    clientSlug: CLIENT_SLUG,
    projectId: PROJECT_ID,
    milestoneKey: d.milestoneKey,
    label: d.label,
    url: "",
    type: d.type,
    markdownContent,
  });
  console.log(`  ✓ ${d.milestoneKey} / ${d.label}`);
}

// ─── 3. Direction pick ────────────────────────────────────────────────────────
console.log("\n── Direction pick ──");
await mutation("directionPicks:saveDirectionPick", {
  clientSlug: CLIENT_SLUG,
  projectId: PROJECT_ID,
  pick: "B", // Direction B — Refined Craft (earth tones, San Miguel heritage palette)
});
console.log("  ✓ Direction B — Refined Craft");

// ─── 4. Agreement (signed offline) ───────────────────────────────────────────
console.log("\n── Agreement (offline/PDF) ──");
await mutation("agreements:saveAgreement", {
  clientSlug: CLIENT_SLUG,
  projectId: PROJECT_ID,
  sigData: "SIGNED_OFFLINE",
  signedDate: "2026-03-27",
  agreementType: "one-time",
  invoiceNumber: "CAPLYORH-0020",
  paymentStatus: "paid",
});
console.log("  ✓ Agreement: SIGNED_OFFLINE | Invoice: CAPLYORH-0020 | paid");

console.log("\n✅ Arquero Phase 1 seed complete.");
