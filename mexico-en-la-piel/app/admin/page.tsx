"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { brand } from "@/brand.config";
import { formatPrice } from "@/lib/cart";
import { Id } from "@/convex/_generated/dataModel";
import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const STATUSES = ["pending", "paid", "shipped", "fulfilled", "cancelled"] as const;
type OrderStatus = (typeof STATUSES)[number];

const STATUS_COLORS: Record<OrderStatus, { bg: string; text: string }> = {
  pending:   { bg: "#FEF3C7", text: "#92400E" },
  paid:      { bg: "#D1FAE5", text: "#065F46" },
  shipped:   { bg: "#DBEAFE", text: "#1E40AF" },
  fulfilled: { bg: "#F3F4F6", text: "#374151" },
  cancelled: { bg: "#FEE2E2", text: "#991B1B" },
};

function pill(status: string) {
  const c = STATUS_COLORS[status as OrderStatus] ?? { bg: "#F3F4F6", text: "#374151" };
  return (
    <span
      className="px-2 py-0.5 rounded-full text-xs font-medium"
      style={{ background: c.bg, color: c.text, fontFamily: brand.fonts.body }}
    >
      {status}
    </span>
  );
}

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

// ─── KPI Card ──────────────────────────────────────────────────────────────
function KpiCard({
  label,
  value,
  sub,
  alert,
}: {
  label: string;
  value: string | number;
  sub?: string;
  alert?: boolean;
}) {
  return (
    <div
      className="rounded-lg p-5 flex flex-col gap-2"
      style={{
        background: brand.colors.surfaceCard,
        border: `1px solid ${brand.colors.hairline}`,
        fontFamily: brand.fonts.body,
      }}
    >
      <p
        className="text-xs uppercase tracking-widest"
        style={{ color: brand.colors.muted }}
      >
        {label}
      </p>
      <p
        className="text-2xl font-bold"
        style={{ color: alert ? "#991B1B" : brand.colors.bodyStrong }}
      >
        {value}
      </p>
      {sub && (
        <p className="text-xs" style={{ color: brand.colors.muted }}>
          {sub}
        </p>
      )}
    </div>
  );
}

// ─── Section header ────────────────────────────────────────────────────────
function SectionHead({ title, action }: { title: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <h2
        className="text-sm font-semibold uppercase tracking-widest"
        style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}
      >
        {title}
      </h2>
      {action}
    </div>
  );
}

// ─── Revenue chart tooltip ─────────────────────────────────────────────────
function ChartTooltip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div
      className="px-3 py-2 rounded shadow text-xs"
      style={{
        background: brand.colors.primary,
        color: brand.colors.canvas,
        fontFamily: brand.fonts.body,
        border: `1px solid ${brand.colors.accent}`,
      }}
    >
      <p>{label}</p>
      <p className="font-semibold">{fmt(payload[0].value)}</p>
    </div>
  );
}

// ─── Order row ─────────────────────────────────────────────────────────────
function OrderRow({ order, updateStatus }: {
  order: {
    _id: Id<"orders">;
    customerName: string;
    customerEmail: string;
    total: number;
    status: string;
    items: { productName: string; quantity: number; unitPrice: number; variant?: string }[];
    shippingAddress: { line1: string; city: string; state: string; postalCode: string; country: string; line2?: string };
    notes?: string;
    _creationTime: number;
  };
  updateStatus: (args: { id: Id<"orders">; status: string }) => Promise<unknown>;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className="rounded-lg overflow-hidden"
      style={{
        background: brand.colors.surfaceCard,
        border: `1px solid ${brand.colors.hairline}`,
        fontFamily: brand.fonts.body,
      }}
    >
      {/* Row header */}
      <div className="flex items-center gap-4 px-5 py-4">
        {/* Customer */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium truncate" style={{ color: brand.colors.bodyStrong }}>
            {order.customerName}
          </p>
          <p className="text-xs truncate" style={{ color: brand.colors.muted }}>
            {order.customerEmail}
          </p>
        </div>

        {/* Items summary */}
        <div className="hidden sm:block text-xs" style={{ color: brand.colors.muted }}>
          {order.items.reduce((s, i) => s + i.quantity, 0)} item
          {order.items.reduce((s, i) => s + i.quantity, 0) !== 1 ? "s" : ""}
          {" · "}
          {order.items[0]?.productName}
          {order.items.length > 1 && ` +${order.items.length - 1}`}
        </div>

        {/* Total */}
        <p className="text-sm font-semibold w-20 text-right" style={{ color: brand.colors.bodyStrong }}>
          {fmt(order.total)}
        </p>

        {/* Status dropdown */}
        <select
          value={order.status}
          onChange={(e) => updateStatus({ id: order._id, status: e.target.value })}
          className="text-xs rounded px-2 py-1 appearance-none cursor-pointer"
          style={{
            background: STATUS_COLORS[order.status as OrderStatus]?.bg ?? "#F3F4F6",
            color: STATUS_COLORS[order.status as OrderStatus]?.text ?? "#374151",
            border: "none",
            fontFamily: brand.fonts.body,
            fontWeight: 500,
          }}
        >
          {STATUSES.map((s) => (
            <option key={s} value={s} style={{ background: "#fff", color: "#000" }}>
              {s}
            </option>
          ))}
        </select>

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((x) => !x)}
          className="text-xs transition-opacity"
          style={{ color: brand.colors.muted }}
        >
          {expanded ? "▲" : "▼"}
        </button>
      </div>

      {/* Expanded detail */}
      {expanded && (
        <div
          className="px-5 pb-5 pt-3 space-y-4"
          style={{ borderTop: `1px solid ${brand.colors.hairline}40` }}
        >
          {/* Items */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: brand.colors.muted }}>Items</p>
            <div className="space-y-1">
              {order.items.map((item, i) => (
                <div key={i} className="flex justify-between text-xs" style={{ color: brand.colors.bodyColor }}>
                  <span>
                    {item.productName}
                    {item.variant && <span style={{ color: brand.colors.muted }}> ({item.variant})</span>}
                    {" × "}{item.quantity}
                  </span>
                  <span>{fmt(item.unitPrice * item.quantity)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping */}
          <div>
            <p className="text-xs uppercase tracking-widest mb-1" style={{ color: brand.colors.muted }}>Ship To</p>
            <p className="text-xs" style={{ color: brand.colors.bodyColor }}>
              {order.shippingAddress.line1}
              {order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}
              {" · "}
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
              {" · "}
              {order.shippingAddress.country}
            </p>
          </div>

          {/* Date + session id */}
          <p className="text-xs font-mono" style={{ color: brand.colors.muted }}>
            {new Date(order._creationTime).toLocaleString()}
          </p>
        </div>
      )}
    </div>
  );
}

// ─── Dashboard ─────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const summary = useQuery(api.orders.summary, {});
  const chartData = useQuery(api.orders.revenueByDay, {});
  const abandoned = useQuery(api.cart.abandonedSummary, {});
  const orders = useQuery(api.orders.list, {});
  const products = useQuery(api.products.listAll, {});
  const updateStatus = useMutation(api.orders.updateStatus);

  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  const filteredOrders = orders
    ? statusFilter
      ? orders.filter((o) => o.status === statusFilter)
      : orders
    : [];

  const outOfStock = products?.filter((p) => !p.inStock).length ?? 0;

  return (
    <div className="p-8 md:p-10 space-y-10 max-w-5xl">
      {/* Page title */}
      <div>
        <h1
          className="text-3xl font-bold tracking-tight"
          style={{ color: brand.colors.bodyStrong, fontFamily: brand.fonts.body }}
        >
          Dashboard
        </h1>
        <p className="text-sm mt-1.5" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
          {brand.name} — Store Overview
        </p>
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <KpiCard
          label="Total Revenue"
          value={summary ? fmt(summary.totalRevenue) : "—"}
          sub={summary ? `${summary.paidOrders} paid orders` : undefined}
        />
        <KpiCard
          label="This Month"
          value={summary ? fmt(summary.revenueLast30Days) : "—"}
          sub={summary ? `${summary.ordersLast30Days} orders` : undefined}
        />
        <KpiCard
          label="Avg Order"
          value={summary ? fmt(summary.avgOrderValue) : "—"}
        />
        <KpiCard
          label="Active Products"
          value={products ? products.filter((p) => p.inStock).length : "—"}
        />
        <KpiCard
          label="Out of Stock"
          value={outOfStock}
          alert={outOfStock > 0}
          sub={outOfStock > 0 ? "needs attention" : "all good"}
        />
      </div>

      {/* Revenue chart */}
      <div
        className="rounded-lg p-6"
        style={{
          background: brand.colors.surfaceCard,
          border: `1px solid ${brand.colors.hairline}`,
        }}
      >
        <SectionHead title="Revenue — Last 30 Days" />
        {chartData && chartData.some((d) => d.revenue > 0) ? (
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke={`${brand.colors.hairline}40`} />
              <XAxis
                dataKey="date"
                tick={{ fontSize: 10, fill: brand.colors.muted, fontFamily: brand.fonts.body }}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                tick={{ fontSize: 10, fill: brand.colors.muted, fontFamily: brand.fonts.body }}
                tickLine={false}
                axisLine={false}
                tickFormatter={(v) => `$${(v / 100).toFixed(0)}`}
              />
              <Tooltip content={<ChartTooltip />} cursor={{ fill: `${brand.colors.hairline}20` }} />
              <Bar dataKey="revenue" fill={brand.colors.primary} radius={[3, 3, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div
            className="h-44 flex items-center justify-center text-sm rounded"
            style={{
              color: brand.colors.muted,
              background: `${brand.colors.hairline}10`,
              fontFamily: brand.fonts.body,
            }}
          >
            No paid orders yet — chart will appear once sales come in.
          </div>
        )}
      </div>

      {/* Order pipeline */}
      <div>
        <SectionHead title="Order Pipeline" />
        <div className="flex flex-wrap gap-3">
          {STATUSES.map((s) => {
            const count = summary?.byStatus?.[s] ?? 0;
            const active = statusFilter === s;
            const c = STATUS_COLORS[s];
            return (
              <button
                key={s}
                onClick={() => setStatusFilter(active ? null : s)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm transition-all"
                style={{
                  background: active ? c.bg : brand.colors.surfaceCard,
                  color: active ? c.text : brand.colors.bodyColor,
                  border: `1px solid ${active ? c.text + "40" : brand.colors.hairline}`,
                  fontFamily: brand.fonts.body,
                  fontWeight: active ? 600 : 400,
                }}
              >
                <span className="font-semibold">{count}</span>
                <span className="capitalize">{s}</span>
              </button>
            );
          })}
          {statusFilter && (
            <button
              onClick={() => setStatusFilter(null)}
              className="px-4 py-2.5 rounded-lg text-xs transition-opacity"
              style={{ color: brand.colors.muted, fontFamily: brand.fonts.body, background: "transparent", border: `1px solid ${brand.colors.hairline}` }}
            >
              Clear ×
            </button>
          )}
        </div>
      </div>

      {/* Orders list */}
      <div>
        <SectionHead
          title={statusFilter ? `Orders — ${statusFilter}` : "All Orders"}
          action={
            <span className="text-xs" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
              {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
            </span>
          }
        />
        {!orders ? (
          <p className="text-sm" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
            Loading…
          </p>
        ) : filteredOrders.length === 0 ? (
          <p className="text-sm" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
            No orders{statusFilter ? ` with status "${statusFilter}"` : ""} yet.
          </p>
        ) : (
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                updateStatus={updateStatus}
              />
            ))}
          </div>
        )}
      </div>

      {/* Bottom grid: Top Products + Cart Abandonment */}
      <div className="grid md:grid-cols-2 gap-6 pb-10">
        {/* Top Products */}
        <div
          className="rounded-lg p-6"
          style={{
            background: brand.colors.surfaceCard,
            border: `1px solid ${brand.colors.hairline}`,
          }}
        >
          <SectionHead title="Top Products" />
          {!summary?.topProducts || summary.topProducts.length === 0 ? (
            <p className="text-sm" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
              No sales data yet.
            </p>
          ) : (
            <div className="space-y-3">
              {summary.topProducts.map((p, i) => (
                <div key={p.productId} className="flex items-center gap-3">
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background: brand.colors.primary, color: brand.colors.canvas, fontFamily: brand.fonts.body }}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: brand.colors.bodyStrong, fontFamily: brand.fonts.body }}>
                      {p.name}
                    </p>
                    <p className="text-xs" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
                      {p.qty} unit{p.qty !== 1 ? "s" : ""} sold
                    </p>
                  </div>
                  <p className="text-sm font-semibold" style={{ color: brand.colors.bodyStrong, fontFamily: brand.fonts.body }}>
                    {fmt(p.revenue)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Abandonment */}
        <div
          className="rounded-lg p-6"
          style={{
            background: brand.colors.surfaceCard,
            border: `1px solid ${brand.colors.hairline}`,
          }}
        >
          <SectionHead title="Abandoned Carts" />
          {!abandoned ? (
            <p className="text-sm" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>Loading…</p>
          ) : abandoned.sessionCount === 0 ? (
            <p className="text-sm" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
              No active carts right now.
            </p>
          ) : (
            <div className="space-y-4">
              <div className="flex gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
                    Open Carts
                  </p>
                  <p className="text-3xl font-bold" style={{ color: brand.colors.bodyStrong, fontFamily: brand.fonts.body }}>
                    {abandoned.sessionCount}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest mb-1" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
                    Value at Risk
                  </p>
                  <p className="text-3xl font-bold" style={{ color: brand.colors.primary, fontFamily: brand.fonts.body }}>
                    {fmt(abandoned.totalValue)}
                  </p>
                </div>
              </div>
              <p className="text-xs" style={{ color: brand.colors.muted, fontFamily: brand.fonts.body }}>
                These sessions have items but never checked out. Consider a retargeting campaign once email capture is live.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
