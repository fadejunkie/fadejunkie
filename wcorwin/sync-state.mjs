#!/usr/bin/env node
/**
 * sync-state.mjs — Pull Convex overrides and merge with baseline data.js
 * Writes .sync-state.json for Claude Code to read before WCORWIN sessions.
 *
 * Usage: node sync-state.mjs
 */

import { execSync } from "child_process";
import { readFileSync, writeFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// Load baseline phases from data.js (parse statically — avoid ESM import of JSX-adjacent code)
const dataPath = join(__dirname, "src", "data.js");
const dataSource = readFileSync(dataPath, "utf-8");

// Extract PHASES array by evaluating the export (safe — it's our own file, pure data)
const phasesMatch = dataSource.match(/export const PHASES\s*=\s*(\[[\s\S]*?\n\];)/);
if (!phasesMatch) {
  console.error("Could not parse PHASES from data.js");
  process.exit(1);
}

// Simple eval with the color constants stubbed
const colorStub = `
  const ACCENT = "#e8541a"; const ACCENT_SOFT = ""; const ACCENT_MED = "";
  const INK = ""; const BODY = ""; const MUTED = ""; const LIGHT = "";
  const BG = ""; const WHITE = ""; const GREEN = ""; const GREEN_SOFT = "";
  const YELLOW = ""; const YELLOW_SOFT = ""; const BLUE = ""; const BLUE_SOFT = "";
`;
const PHASES = new Function(`${colorStub} return ${phasesMatch[1]}`)();

// Pull overrides from Convex prod
let overrides = {};
try {
  // Write args to a temp file to avoid shell quoting issues on Windows
  const tmpArgs = join(__dirname, ".tmp-args.json");
  writeFileSync(tmpArgs, JSON.stringify({ projectId: "wcorwin" }));
  const argsJson = readFileSync(tmpArgs, "utf-8").trim();
  const raw = execSync(
    `npx convex run --prod wcorwinTasks:getOverrides "${argsJson.replace(/"/g, '\\"')}"`,
    { cwd: __dirname, encoding: "utf-8", timeout: 30000 }
  );
  // Output may contain log lines before the JSON — find the first { or null
  const jsonStart = raw.indexOf("{");
  if (jsonStart >= 0) {
    overrides = JSON.parse(raw.slice(jsonStart));
  }
} catch (err) {
  console.warn("Warning: Could not fetch Convex overrides:", err.message);
  console.warn("Proceeding with baseline data only.");
}

// Merge overrides into phases
const merged = {};
const summary = {};

for (const phase of PHASES) {
  merged[phase.id] = phase.tasks.map((task, i) => {
    const key = `${phase.id}:${i}`;
    const ov = overrides[key] || {};
    return {
      key,
      name: ov.name || task.name,
      status: ov.status || task.status,
      detail: ov.detail || task.detail,
      ...(ov.doc ? { doc: ov.doc } : {}),
    };
  });

  const tasks = merged[phase.id];
  summary[phase.id] = {
    done: tasks.filter((t) => t.status === "done").length,
    active: tasks.filter((t) => t.status === "active").length,
    pending: tasks.filter((t) => t.status === "pending").length,
  };
}

const output = {
  syncedAt: new Date().toISOString(),
  overrides,
  merged,
  summary,
};

const outPath = join(__dirname, ".sync-state.json");
writeFileSync(outPath, JSON.stringify(output, null, 2));
console.log(`Synced at ${output.syncedAt}`);
console.log("Summary:", JSON.stringify(summary, null, 2));
console.log(`Written to ${outPath}`);
