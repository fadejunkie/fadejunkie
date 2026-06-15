"use node";

import { internalAction } from "./_generated/server";
import { v } from "convex/values";
import * as fs from "fs";
import * as os from "os";
import * as path from "path";

// Triggered by the daily cron — writes a task file to the SEO Engine agent inbox.
// Runs in the Node.js runtime (required for fs/os/path).
export const triggerAudit = internalAction({
  args: {
    clientSlug: v.string(),
    projectId: v.string(),
  },
  handler: async (_ctx, { clientSlug, projectId }) => {
    const now = new Date(Date.now());
    const datePart = now.toISOString().slice(0, 10); // YYYY-MM-DD

    const inboxDir = path.join(os.homedir(), "agents", "seo-engine", "inbox");
    fs.mkdirSync(inboxDir, { recursive: true });

    const filename = `${clientSlug}-daily-audit-${datePart}.md`;
    const filepath = path.join(inboxDir, filename);

    const content = `<!-- execute -->
<!-- client: ${clientSlug} -->
<!-- dispatched-from: convex-cron -->

# Run Daily SEO Audit: ${clientSlug}

Trigger date: ${datePart}
Run a full 5-pillar SEO audit and write results to outbox.
Target projectId: ${projectId}
See agent instructions for full audit spec.
`;

    fs.writeFileSync(filepath, content, "utf-8");
    console.log(`[hub-master-cron] Trigger file written: ${filepath}`);
  },
});
