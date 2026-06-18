#!/usr/bin/env node
/**
 * seo-daily-runner.mjs
 *
 * Called by Task Scheduler at 6:00 AM daily.
 * Writes a daily audit task to the SEO engine inbox.
 * The SEO engine picks it up whenever it runs (watch mode or manual).
 *
 * Idempotent — skips if today's file already exists.
 */

import { writeFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";

const HOME      = homedir();
const SEO_INBOX = join(HOME, "twanii", "agents", "seo-engine", "inbox");
const today     = new Date().toISOString().slice(0, 10);
const log       = (msg) => console.log(`[${new Date().toISOString()}] ${msg}`);

const taskFilename = `wcorwin-daily-audit-${today}.md`;
const taskPath     = join(SEO_INBOX, taskFilename);

if (existsSync(taskPath)) {
  log(`Task already exists for today (${taskFilename}). Nothing to do.`);
  process.exit(0);
}

const content = `<!-- execute -->
<!-- client: wcorwin -->
<!-- dispatched-from: task-scheduler -->

# Daily SEO Audit: wcorwin.com

Trigger date: ${today}

Run a full 5-pillar SEO audit of wcorwin.com (On-Page, Technical, Content, Local, Authority).
Score each pillar and write the results JSON to outbox as wcorwin-audit-results-${today}.json.

Then persist to Convex prod (kindred-scorpion-550) seoAudits table using:
  npx convex run --prod seoAudits:insertAudit '<json>'

from cwd: C:/Users/twani/fadejunkie/wcorwin

Base recommendations on the current phase (see context file for phase/task status).
`;

writeFileSync(taskPath, content, "utf-8");
log(`Task written: ${taskFilename}`);
