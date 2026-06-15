#!/usr/bin/env node
/**
 * seo-push-audit.mjs
 *
 * Called by Task Scheduler at 10:00 AM daily.
 * Reads the latest audit results JSON from the SEO engine outbox and
 * pushes to Convex if it's newer than what's already stored.
 *
 * Idempotent — safe to run multiple times.
 */

import { execSync } from "child_process";
import { readdirSync, readFileSync, existsSync } from "fs";
// Note: execSync is only used for the Convex query below (CLI doesn't need shell escaping for reads)
import { join } from "path";
import { homedir } from "os";

const HOME       = homedir();
const SEO_OUTBOX = join(HOME, "twanii", "agents", "seo-engine", "outbox");
const CONVEX_DIR = join(HOME, "fadejunkie", "wcorwin");
const PROJECT_ID = "wcorwin";
const log        = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

// ─── Get latest audit from Convex ───────────────────────────────────────────

function getLatestConvexAudit() {
  try {
    const raw = execSync(
      `npx convex run --prod seoAudits:getLatestAudit "${JSON.stringify({ projectId: PROJECT_ID }).replace(/"/g, '\\"')}"`,
      { cwd: CONVEX_DIR, encoding: "utf-8", timeout: 30000 }
    );
    const jsonStart = raw.indexOf("{");
    return jsonStart >= 0 ? JSON.parse(raw.slice(jsonStart)) : null;
  } catch (err) {
    log(`Warning: could not query Convex — ${err.message}`);
    return null;
  }
}

// ─── Find newest outbox JSON ─────────────────────────────────────────────────

if (!existsSync(SEO_OUTBOX)) {
  log("Outbox directory not found. Nothing to push.");
  process.exit(0);
}

const jsonFiles = readdirSync(SEO_OUTBOX)
  .filter(f => f.startsWith("wcorwin-audit-results-") && f.endsWith(".json"))
  .sort()
  .reverse(); // newest filename first

if (jsonFiles.length === 0) {
  log("No audit results JSON in outbox. Nothing to push.");
  process.exit(0);
}

const latestFile = jsonFiles[0];
const latestPath = join(SEO_OUTBOX, latestFile);
let outboxData;

try {
  outboxData = JSON.parse(readFileSync(latestPath, "utf-8"));
} catch (err) {
  log(`Could not parse ${latestFile}: ${err.message}`);
  process.exit(1);
}

log(`Latest outbox file: ${latestFile} (runAt: ${new Date(outboxData.runAt).toISOString()})`);

// ─── Compare with Convex ─────────────────────────────────────────────────────

const convexAudit = getLatestConvexAudit();

if (convexAudit && convexAudit.runAt >= outboxData.runAt) {
  log(`Convex already has this audit or newer (Convex runAt: ${new Date(convexAudit.runAt).toISOString()}). Nothing to do.`);
  process.exit(0);
}

log("Outbox has newer data than Convex. Pushing…");

// ─── Push to Convex ──────────────────────────────────────────────────────────

// Map outbox JSON to Convex schema — handles both flat and nested formats
const payload = {
  projectId:       PROJECT_ID,
  runAt:           outboxData.runAt ?? new Date(outboxData.auditDate ?? Date.now()).getTime(),
  overallScore:    outboxData.overallScore,
  onPage:          outboxData.onPage          ?? outboxData.pillars?.onPage?.score,
  technical:       outboxData.technical       ?? outboxData.pillars?.technical?.score,
  content:         outboxData.content         ?? outboxData.pillars?.content?.score,
  local:           outboxData.local           ?? outboxData.pillars?.local?.score,
  authority:       outboxData.authority       ?? outboxData.pillars?.authority?.score,
  summary:         outboxData.summary         ?? `Audit ${outboxData.auditDate}. Overall ${outboxData.overallScore}/10.`,
  recommendations: outboxData.recommendations ?? outboxData.criticalActions?.map(a => a.action) ?? [],
  rawReport:       outboxData.rawReport       ?? `See seo-engine/outbox/${latestFile}`,
};

const missing = Object.entries(payload).filter(([k, v]) => v === undefined).map(([k]) => k);
if (missing.length > 0) {
  log(`Outbox JSON is missing fields: ${missing.join(", ")}. Cannot push.`);
  process.exit(1);
}

try {
  const res = await fetch("https://kindred-scorpion-550.convex.cloud/api/mutation", {
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ path: "seoAudits:insertAudit", args: payload, format: "json" }),
  });
  const json = await res.json();
  if (json.status === "success") {
    log(`✓ Pushed to Convex (id: ${json.value}). Hub will update within seconds.`);
  } else {
    log(`Convex error: ${JSON.stringify(json)}`);
    process.exit(1);
  }
} catch (err) {
  log(`Error pushing to Convex: ${err.message}`);
  process.exit(1);
}
