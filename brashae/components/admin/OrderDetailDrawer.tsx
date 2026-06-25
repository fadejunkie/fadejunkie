'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useState } from 'react'
import StatusBadge from './StatusBadge'

const statuses = ['pending', 'paid', 'shipped', 'fulfilled', 'cancelled']

interface Props {
  orderId: Id<'orders'>
  onClose: () => void
}

export default function OrderDetailDrawer({ orderId, onClose }: Props) {
  const order = useQuery(api.orders.getById, { id: orderId })
  const updateStatus = useMutation(api.orders.updateStatus)
  const [status, setStatus] = useState<string>('')
  const [saving, setSaving] = useState(false)

  const currentStatus = order?.status ?? ''

  async function handleStatusUpdate() {
    if (!status || status === currentStatus) return
    setSaving(true)
    await updateStatus({ id: orderId, status })
    setSaving(false)
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex' }} onClick={onClose}>
      <div style={{ flex: 1, background: 'rgba(0,0,0,0.6)' }} />
      <div
        style={{ width: 480, background: '#0A0A0A', borderLeft: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', padding: 40 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
          <div>
            <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>ORDER</p>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#fff' }}>
              {order?._id.slice(-8).toUpperCase() ?? '—'}
            </h2>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: 20 }}>✕</button>
        </div>

        {!order ? (
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading…</p>
        ) : (
          <>
            <div style={{ marginBottom: 24 }}>
              <StatusBadge status={order.status} />
            </div>

            {/* Customer */}
            <div style={{ background: '#111', padding: 20, marginBottom: 2 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 12 }}>CUSTOMER</p>
              <p style={{ fontSize: 14, fontWeight: 600, color: '#fff' }}>{order.customerName}</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{order.customerEmail}</p>
            </div>

            {/* Shipping */}
            <div style={{ background: '#111', padding: 20, marginBottom: 2 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 12 }}>SHIPPING</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.7 }}>
                {order.shippingAddress.line1}<br />
                {order.shippingAddress.line2 && <>{order.shippingAddress.line2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                {order.shippingAddress.country}
              </p>
            </div>

            {/* Items */}
            <div style={{ background: '#111', padding: 20, marginBottom: 2 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 16 }}>ITEMS</p>
              {order.items.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 13 }}>
                  <div>
                    <p style={{ fontWeight: 600, color: '#fff' }}>{item.productName}</p>
                    {item.variant && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>{item.variant}</p>}
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>Qty: {item.quantity}</p>
                  </div>
                  <p style={{ color: '#fff', fontVariantNumeric: 'tabular-nums' }}>
                    ${(item.unitPrice / 100 * item.quantity).toFixed(2)}
                  </p>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 12, marginTop: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 6 }}>
                  <span>Subtotal</span><span>${(order.subtotal / 100).toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
                  <span>Shipping</span><span>{order.shipping === 0 ? 'FREE' : `$${(order.shipping / 100).toFixed(2)}`}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 15, fontWeight: 700, color: '#fff' }}>
                  <span>Total</span><span>${(order.total / 100).toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Stripe */}
            <div style={{ background: '#111', padding: 20, marginBottom: 24 }}>
              <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 8 }}>STRIPE SESSION</p>
              <p style={{ fontSize: 11, fontFamily: 'monospace', color: 'rgba(255,255,255,0.4)', wordBreak: 'break-all' }}>
                {order.stripeSessionId}
              </p>
            </div>

            {/* Status update */}
            <div>
              <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', fontWeight: 700, marginBottom: 12 }}>UPDATE STATUS</p>
              <div style={{ display: 'flex', gap: 8 }}>
                <select
                  defaultValue={order.status}
                  onChange={(e) => setStatus(e.target.value)}
                  style={{ flex: 1, padding: '10px 12px', background: '#000', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: 13, cursor: 'pointer' }}
                >
                  {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                <button onClick={handleStatusUpdate} disabled={saving} style={{ padding: '10px 20px', background: '#C9A84C', border: 'none', color: '#000', fontSize: 13, fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer' }}>
                  {saving ? '…' : 'Save'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
