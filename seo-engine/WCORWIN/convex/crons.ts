import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

// Runs every 24 hours — triggers SEO Engine to run a fresh audit for wcorwin.com
crons.interval(
  "wcorwin-seo-audit",
  { hours: 24 },
  internal.seoAuditsCron.triggerSeoAudit
);

export default crons;
