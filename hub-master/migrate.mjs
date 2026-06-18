/**
 * Phase 2 Migration: Import data from old hub deployments into hub-master
 * Run from hub-master dir: node migrate.mjs
 */

import { execSync } from "child_process";

const HUB_MASTER_URL = "https://warmhearted-cormorant-536.convex.cloud";

// ─── Helper: call a hub-master mutation via HTTP ──────────────────────────────
async function runMutation(path, args) {
  const res = await fetch(`${HUB_MASTER_URL}/api/mutation`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ path, args, format: "json" }),
  });
  const text = await res.text();
  if (!res.ok) throw new Error(`Mutation ${path} failed: ${text}`);
  return JSON.parse(text);
}

// ─── Helper: dump a table from an old deployment ─────────────────────────────
function dumpTable(dir, deployment, table) {
  try {
    const out = execSync(
      `npx convex data ${table} --format json --limit 1000`,
      {
        cwd: dir,
        env: { ...process.env, CONVEX_DEPLOYMENT: deployment },
        encoding: "utf8",
        stdio: ["pipe", "pipe", "pipe"],
      }
    );
    return JSON.parse(out.trim());
  } catch {
    return [];
  }
}

// ─── Migration definitions ────────────────────────────────────────────────────
const migrations = [
  // ── WCORWIN (dev: necessary-horse-18) ───────────────────────────────────────
  {
    clientSlug: "wcorwin",
    dir: "C:/Users/twani/fadejunkie/wcorwin",
    deployment: "dev:necessary-horse-18",
    tables: [
      {
        table: "wcorwinTasks",
        target: "tasks",
        transform: (r) => ({
          clientSlug: "wcorwin",
          projectId: r.projectId,
          taskKey: r.taskKey,
          status: r.status,
          name: r.name,
          detail: r.detail,
          doc: r.doc,
        }),
        mutation: "tasks:setTaskStatus",
        insertFn: async (record) => {
          // Use setTask or setTaskStatus depending on what fields exist
          if (record.status !== undefined) {
            await runMutation("tasks:setTaskStatus", {
              clientSlug: record.clientSlug,
              projectId: record.projectId,
              taskKey: record.taskKey,
              status: record.status || "active",
            });
          }
          if (record.doc) {
            await runMutation("tasks:setTaskDoc", {
              clientSlug: record.clientSlug,
              projectId: record.projectId,
              taskKey: record.taskKey,
              doc: record.doc,
            });
          }
          if (record.name || record.detail) {
            await runMutation("tasks:setTaskText", {
              clientSlug: record.clientSlug,
              projectId: record.projectId,
              taskKey: record.taskKey,
              name: record.name,
              detail: record.detail,
            });
          }
        },
      },
    ],
  },
  // ── CHUCO (dev: cautious-spider-162) ────────────────────────────────────────
  {
    clientSlug: "chuco",
    dir: "C:/Users/twani/fadejunkie/chuco",
    deployment: "dev:cautious-spider-162",
    tables: [
      {
        table: "chucoTasks",
        transform: (r) => ({
          clientSlug: "chuco",
          projectId: r.projectId,
          taskKey: r.taskKey,
          completed: r.completed ?? false,
        }),
        insertFn: async (record) => {
          await runMutation("tasks:setTask", {
            clientSlug: record.clientSlug,
            projectId: record.projectId,
            taskKey: record.taskKey,
            completed: record.completed,
          });
        },
      },
      {
        table: "chucoDiscovery",
        transform: (r) => ({
          clientSlug: "chuco",
          projectId: r.projectId,
          responses: r.responses,
        }),
        insertFn: async (record) => {
          await runMutation("discovery:saveDiscovery", {
            clientSlug: record.clientSlug,
            projectId: record.projectId,
            responses: record.responses,
          });
        },
      },
      {
        table: "chucoSubmissions",
        transform: (r) => ({
          clientSlug: "chuco",
          type: r.type,
          payload: r.payload,
        }),
        insertFn: async (record) => {
          await runMutation("submissions:addSubmission", {
            clientSlug: record.clientSlug,
            type: record.type,
            payload: record.payload,
          });
        },
      },
    ],
  },
];

// ─── Run migration ────────────────────────────────────────────────────────────
async function main() {
  console.log("🚀 Starting hub-master migration\n");

  for (const { clientSlug, dir, deployment, tables } of migrations) {
    console.log(`\n── ${clientSlug.toUpperCase()} (${deployment}) ──`);

    for (const { table, transform, insertFn } of tables) {
      const rows = dumpTable(dir, deployment, table);
      console.log(`  ${table}: ${rows.length} records`);

      let inserted = 0;
      let skipped = 0;
      for (const row of rows) {
        try {
          const record = transform(row);
          await insertFn(record);
          inserted++;
        } catch (err) {
          console.error(`    ✗ row ${row._id}: ${err.message}`);
          skipped++;
        }
      }
      console.log(`    ✓ ${inserted} inserted, ${skipped} skipped`);
    }
  }

  console.log("\n✅ Migration complete.");
}

main().catch((e) => {
  console.error("Migration failed:", e);
  process.exit(1);
});
