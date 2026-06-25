'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import Link from 'next/link'
import StatsHeader from '@/components/admin/StatsHeader'
import StatusBadge from '@/components/admin/StatusBadge'

function fmt(cents: number) {
  return `$${(cents / 100).toFixed(2)}`
}

export default function AdminDashboard() {
  const orders = useQuery(api.orders.list, {})
  const recent = orders?.slice(0, 10) ?? []

  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <div style={{ marginBottom: 40 }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>
          OVERVIEW
        </p>
        <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Dashboard</h1>
      </div>

      <StatsHeader />

      {/* Recent Orders */}
      <div style={{ marginTop: 48 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>
            RECENT ORDERS
          </p>
          <Link href="/admin/orders" style={{ fontSize: 12, color: '#C9A84C' }}>View all →</Link>
        </div>

        {recent.length === 0 ? (
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.3)', padding: '32px 0' }}>No orders yet.</p>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                {['Customer', 'Email', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} style={{ textAlign: 'left', padding: '8px 16px 8px 0', fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((o) => (
                <tr key={o._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <td style={{ padding: '14px 16px 14px 0', fontWeight: 600 }}>{o.customerName}</td>
                  <td style={{ padding: '14px 16px 14px 0', color: 'rgba(255,255,255,0.5)' }}>{o.customerEmail}</td>
                  <td style={{ padding: '14px 16px 14px 0', fontVariantNumeric: 'tabular-nums' }}>{fmt(o.total)}</td>
                  <td style={{ padding: '14px 16px 14px 0' }}><StatusBadge status={o.status} /></td>
                  <td style={{ padding: '14px 16px 14px 0', color: 'rgba(255,255,255,0.4)' }}>
                    {new Date(o._creationTime).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2, marginTop: 48 }}>
        {[
          { href: '/admin/products/new', label: 'Add Product', sub: 'Create a new product listing' },
          { href: '/admin/collections/new', label: 'Add Collection', sub: 'Create a product collection' },
          { href: '/admin/orders', label: 'Manage Orders', sub: 'Update order statuses' },
        ].map((q) => (
          <Link key={q.href} href={q.href} style={{
            display: 'block', background: '#0A0A0A', padding: '24px',
            borderTop: '2px solid rgba(255,255,255,0.08)',
          }}>
            <p style={{ fontWeight: 600, fontSize: 14, marginBottom: 6 }}>{q.label}</p>
            <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>{q.sub}</p>
          </Link>
        ))}
      </div>
    </main>
  )
}
