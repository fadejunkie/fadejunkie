import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Wcorwin SEO audit — runs every 24 hours
// The seo-engine agent writes the actual audit result; this triggers the agent
// by inserting a trigger record that the agent polls.
// (Actual audit insertion happens via seoAudits:insertAudit from the agent)
crons.daily(
  "wcorwin-seo-audit-trigger",
  { hourUTC: 9, minuteUTC: 0 }, // 9am UTC = 4am CDT
  internal.seoAuditTrigger.triggerAudit,
  { clientSlug: "wcorwin", projectId: "wcorwin" }
);

export default crons;
