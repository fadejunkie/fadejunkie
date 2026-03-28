import { cronJobs } from "convex/server";
import { internal } from "./_generated/api";

const crons = cronJobs();

crons.interval(
  "expire stale statuses",
  { hours: 1 },
  internal.statuses.expireStatuses
);

export default crons;
