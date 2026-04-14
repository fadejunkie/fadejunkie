"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// ─── Internal Action ─────────────────────────────────────────────────────────
// Triggered by the daily cron — writes a task file to the SEO Engine inbox.
// Runs in the Node.js runtime (required for fs/os/path).

export const triggerSeoAudit = internalAction({
  args: {},
  handler: async (_ctx, _args) => {
    const now = new Date(Date.now());
    const datePart = now.toISOString().slice(0, 10); // YYYY-MM-DD

    const inboxDir = path.join(os.homedir(), "agents", "seo-engine", "inbox");
    fs.mkdirSync(inboxDir, { recursive: true });

    const filename = `wcorwin-daily-audit-${datePart}.md`;
    const filepath = path.join(inboxDir, filename);

    const content = `<!-- execute -->
<!-- client: wcorwin -->
<!-- dispatched-from: convex-cron -->

# Run Daily SEO Audit: wcorwin.com

Trigger date: ${datePart}
Run a full 5-pillar SEO audit of wcorwin.com and write results to outbox.
See agent instructions for full audit spec.
`;

    fs.writeFileSync(filepath, content, "utf-8");
    console.log(`[wcorwin-seo-cron] Trigger file written: ${filepath}`);
  },
});
