"use client";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default function AdminDashboard() {
  const products = useQuery(api.products.list, {});
  const orders = useQuery(api.orders.list, {});

  const revenue = orders
    ?.filter((o) => o.status === "paid" || o.status === "fulfilled")
    .reduce((sum, o) => sum + o.total, 0) ?? 0;

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        <Stat label="Products" value={products?.length ?? "—"} href="/admin/products" />
        <Stat label="Orders" value={orders?.length ?? "—"} href="/admin/orders" />
        <Stat
          label="Revenue"
          value={revenue ? `$${(revenue / 100).toFixed(2)}` : "$0"}
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold">Recent Orders</h2>
          <Link href="/admin/orders" className="text-xs text-gray-400 hover:text-black underline">
            View all
          </Link>
        </div>
        {!orders ? (
          <p className="text-gray-400 text-sm">Loading…</p>
        ) : orders.length === 0 ? (
          <p className="text-gray-400 text-sm">No orders yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-gray-400 border-b border-gray-200">
              <tr>
                <th className="py-2 text-left font-medium">Customer</th>
                <th className="py-2 text-left font-medium">Total</th>
                <th className="py-2 text-left font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 5).map((o) => (
                <tr key={o._id} className="border-b border-gray-100">
                  <td className="py-2">{o.customerName}</td>
                  <td className="py-2">${(o.total / 100).toFixed(2)}</td>
                  <td className="py-2">
                    <StatusBadge status={o.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

function Stat({
  label,
  value,
  href,
}: {
  label: string;
  value: string | number;
  href?: string;
}) {
  const content = (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
    </div>
  );
  return href ? <Link href={href}>{content}</Link> : content;
}

function StatusBadge({ status }: { status: string }) {
  const colors: Record<string, string> = {
    pending: "bg-yellow-100 text-yellow-700",
    paid: "bg-green-100 text-green-700",
    shipped: "bg-blue-100 text-blue-700",
    fulfilled: "bg-gray-100 text-gray-600",
    cancelled: "bg-red-100 text-red-600",
  };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] ?? "bg-gray-100 text-gray-600"}`}>
      {status}
    </span>
  );
}
