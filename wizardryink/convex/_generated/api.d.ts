/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as dist__generated_api from "../dist/_generated/api.js";
import type * as dist__generated_server from "../dist/_generated/server.js";
import type * as dist_dist__generated_api from "../dist/dist/_generated/api.js";
import type * as dist_dist__generated_server from "../dist/dist/_generated/server.js";
import type * as dist_dist_wizardryTasks from "../dist/dist/wizardryTasks.js";
import type * as dist_wizardryTasks from "../dist/wizardryTasks.js";
import type * as wizardryTasks from "../wizardryTasks.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  "dist/_generated/api": typeof dist__generated_api;
  "dist/_generated/server": typeof dist__generated_server;
  "dist/dist/_generated/api": typeof dist_dist__generated_api;
  "dist/dist/_generated/server": typeof dist_dist__generated_server;
  "dist/dist/wizardryTasks": typeof dist_dist_wizardryTasks;
  "dist/wizardryTasks": typeof dist_wizardryTasks;
  wizardryTasks: typeof wizardryTasks;
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
