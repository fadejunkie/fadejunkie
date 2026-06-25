/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as agreements from "../agreements.js";
import type * as clients from "../clients.js";
import type * as credentials from "../credentials.js";
import type * as crons from "../crons.js";
import type * as deliverables from "../deliverables.js";
import type * as directionPicks from "../directionPicks.js";
import type * as discovery from "../discovery.js";
import type * as feedback from "../feedback.js";
import type * as gbpAssets from "../gbpAssets.js";
import type * as listings from "../listings.js";
import type * as reports from "../reports.js";
import type * as seed from "../seed.js";
import type * as seoAuditTrigger from "../seoAuditTrigger.js";
import type * as seoAudits from "../seoAudits.js";
import type * as signoffs from "../signoffs.js";
import type * as submissions from "../submissions.js";
import type * as tasks from "../tasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  agreements: typeof agreements;
  clients: typeof clients;
  credentials: typeof credentials;
  crons: typeof crons;
  deliverables: typeof deliverables;
  directionPicks: typeof directionPicks;
  discovery: typeof discovery;
  feedback: typeof feedback;
  gbpAssets: typeof gbpAssets;
  listings: typeof listings;
  reports: typeof reports;
  seed: typeof seed;
  seoAuditTrigger: typeof seoAuditTrigger;
  seoAudits: typeof seoAudits;
  signoffs: typeof signoffs;
  submissions: typeof submissions;
  tasks: typeof tasks;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {};
