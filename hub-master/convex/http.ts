import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { internal } from "./_generated/api";

/**
 * HTTP router for ops-only mutations that cannot be called from the browser.
 *
 * All routes require:
 *   Authorization: Bearer <INTERNAL_API_KEY>
 *
 * Set INTERNAL_API_KEY in the Convex dashboard:
 *   Settings → Environment Variables → INTERNAL_API_KEY
 *
 * Usage from Twanii server or Claude Code:
 *   curl -X POST https://warmhearted-cormorant-536.convex.site/api/credentials/get \
 *     -H "Authorization: Bearer <key>" \
 *     -H "Content-Type: application/json" \
 *     -d '{"clientSlug":"marc-torres","projectId":"marc-torres-seo"}'
 *
 * SEC-9: These routes exist because the Convex browser SDK does not allow
 * calling internalMutation/internalQuery — the HTTP action layer is the
 * only way to reach them from outside Convex.
 */

const http = httpRouter();

// ─── Auth helper ──────────────────────────────────────────────────────────────

function notAuthorized(): Response {
  return new Response(JSON.stringify({ error: "Unauthorized" }), {
    status: 401,
    headers: { "Content-Type": "application/json" },
  });
}

function validateBearer(request: Request): boolean {
  const apiKey = process.env.INTERNAL_API_KEY;
  if (!apiKey) return false; // key not configured → deny all
  const auth = request.headers.get("Authorization");
  return auth === `Bearer ${apiKey}`;
}

function json(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

// ─── Credentials (SEC-9 highest priority) ────────────────────────────────────

http.route({
  path: "/api/credentials/get",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { clientSlug, projectId } = await request.json();
    const result = await ctx.runQuery(internal.credentials.getCredentials, { clientSlug, projectId });
    return json(result);
  }),
});

http.route({
  path: "/api/credentials/save",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { clientSlug, projectId, data } = await request.json();
    await ctx.runMutation(internal.credentials.saveCredentials, { clientSlug, projectId, data });
    return json({ ok: true });
  }),
});

// ─── Deliverables ─────────────────────────────────────────────────────────────

http.route({
  path: "/api/deliverables/add",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const body = await request.json();
    const id = await ctx.runMutation(internal.deliverables.addDeliverable, body);
    return json({ id });
  }),
});

http.route({
  path: "/api/deliverables/remove",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { id } = await request.json();
    await ctx.runMutation(internal.deliverables.removeDeliverable, { id });
    return json({ ok: true });
  }),
});

// ─── Reports ─────────────────────────────────────────────────────────────────

http.route({
  path: "/api/reports/save",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const body = await request.json();
    const id = await ctx.runMutation(internal.reports.saveReport, body);
    return json({ id });
  }),
});

http.route({
  path: "/api/reports/delete",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { reportId } = await request.json();
    await ctx.runMutation(internal.reports.deleteReport, { reportId });
    return json({ ok: true });
  }),
});

// ─── Agreements (ops writes) ──────────────────────────────────────────────────

http.route({
  path: "/api/agreements/clear",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { clientSlug, projectId } = await request.json();
    await ctx.runMutation(internal.agreements.clearAgreement, { clientSlug, projectId });
    return json({ ok: true });
  }),
});

http.route({
  path: "/api/agreements/update-payment",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const body = await request.json();
    await ctx.runMutation(internal.agreements.updatePayment, body);
    return json({ ok: true });
  }),
});

// ─── Clients registry ─────────────────────────────────────────────────────────

http.route({
  path: "/api/clients/upsert",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const body = await request.json();
    await ctx.runMutation(internal.clients.upsertClient, body);
    return json({ ok: true });
  }),
});

http.route({
  path: "/api/clients/set-status",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const body = await request.json();
    await ctx.runMutation(internal.clients.setClientStatus, body);
    return json({ ok: true });
  }),
});

// ─── Feedback (ops resolve/remove) ────────────────────────────────────────────

http.route({
  path: "/api/feedback/resolve",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { id } = await request.json();
    await ctx.runMutation(internal.feedback.resolve, { id });
    return json({ ok: true });
  }),
});

http.route({
  path: "/api/feedback/remove",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { id } = await request.json();
    await ctx.runMutation(internal.feedback.remove, { id });
    return json({ ok: true });
  }),
});

// ─── Signoffs (ops notes) ─────────────────────────────────────────────────────

http.route({
  path: "/api/signoffs/notes",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    if (!validateBearer(request)) return notAuthorized();
    const { clientSlug, projectId, notes } = await request.json();
    await ctx.runMutation(internal.signoffs.submitNotes, { clientSlug, projectId, notes });
    return json({ ok: true });
  }),
});

export default http;
