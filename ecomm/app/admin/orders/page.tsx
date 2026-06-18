"use client";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { formatPrice } from "@/lib/cart";
import { Id } from "@/convex/_generated/dataModel";

const STATUSES = ["pending", "paid", "shipped", "fulfilled", "cancelled"];

export default function AdminOrders() {
  const orders = useQuery(api.orders.list, {});
  const updateStatus = useMutation(api.orders.updateStatus);

  return (
    <div>
      <h1 className="text-xl font-bold mb-6">Orders</h1>

      {!orders ? (
        <p className="text-gray-400 text-sm">Loading…</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-400 text-sm">No orders yet.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white border border-gray-200 rounded-lg p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">{order.customerName}</p>
                  <p className="text-xs text-gray-400">{order.customerEmail}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">{formatPrice(order.total)}</p>
                  <p className="text-xs text-gray-400">
                    {order.items.reduce((s, i) => s + i.quantity, 0)} items
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center gap-3">
                <label className="text-xs text-gray-500">Status:</label>
                <select
                  value={order.status}
                  onChange={(e) =>
                    updateStatus({
                      id: order._id as Id<"orders">,
                      status: e.target.value,
                    })
                  }
                  className="text-xs border border-gray-200 rounded px-2 py-1"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>

                <span className="text-xs text-gray-300 ml-auto font-mono">
                  {order.stripeSessionId.slice(-8)}
                </span>
              </div>

              <details className="mt-2">
                <summary className="text-xs text-gray-400 cursor-pointer hover:text-gray-600">
                  View items
                </summary>
                <div className="mt-2 space-y-1">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex justify-between text-xs text-gray-600">
                      <span>
                        {item.productName}
                        {item.variant && (
                          <span className="text-gray-400 ml-1">({item.variant})</span>
                        )}
                        {" × "}
                        {item.quantity}
                      </span>
                      <span>{formatPrice(item.unitPrice * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </details>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
