'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useState } from 'react'
import StatusBadge from '@/components/admin/StatusBadge'
import OrderDetailDrawer from '@/components/admin/OrderDetailDrawer'

const tabs = ['all', 'pending', 'paid', 'shipped', 'fulfilled', 'cancelled']

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedOrder, setSelectedOrder] = useState<Id<'orders'> | null>(null)

  const orders = useQuery(api.orders.list, activeTab !== 'all' ? { status: activeTab } : {})

  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>SALES</p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Orders</h1>
      </div>

      {/* Status tabs */}
      <div style={{ display: 'flex', gap: 2, marginBottom: 32, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button key={t} onClick={() => setActiveTab(t)} style={{
            padding: '8px 16px', background: 'transparent', cursor: 'pointer',
            fontSize: 11, textTransform: 'uppercase', fontWeight: activeTab === t ? 700 : 400,
            border: `1px solid ${activeTab === t ? '#C9A84C' : 'rgba(255,255,255,0.12)'}`,
            color: activeTab === t ? '#C9A84C' : 'rgba(255,255,255,0.5)',
          }}>
            {t}
          </button>
        ))}
      </div>

      {!orders ? (
        <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
      ) : orders.length === 0 ? (
        <p style={{ color: 'rgba(255,255,255,0.3)', paddingTop: 40, fontSize: 14 }}>No orders found.</p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
              {['Order ID', 'Customer', 'Email', 'Total', 'Status', 'Date'].map((h) => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px 8px 0', fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o._id}
                onClick={() => setSelectedOrder(o._id)}
                style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', cursor: 'pointer' }}
              >
                <td style={{ padding: '14px 12px 14px 0', fontFamily: 'monospace', fontSize: 12, color: 'rgba(255,255,255,0.5)' }}>
                  #{o._id.slice(-8).toUpperCase()}
                </td>
                <td style={{ padding: '14px 12px 14px 0', fontWeight: 600 }}>{o.customerName}</td>
                <td style={{ padding: '14px 12px 14px 0', color: 'rgba(255,255,255,0.5)' }}>{o.customerEmail}</td>
                <td style={{ padding: '14px 12px 14px 0', fontVariantNumeric: 'tabular-nums' }}>${(o.total / 100).toFixed(2)}</td>
                <td style={{ padding: '14px 12px 14px 0' }}><StatusBadge status={o.status} /></td>
                <td style={{ padding: '14px 0 14px 0', color: 'rgba(255,255,255,0.4)' }}>
                  {new Date(o._creationTime).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {selectedOrder && (
        <OrderDetailDrawer orderId={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </main>
  )
}
