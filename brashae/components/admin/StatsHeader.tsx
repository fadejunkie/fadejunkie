'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'

function fmt(cents: number) {
  return `$${(cents / 100).toLocaleString('en-US', { minimumFractionDigits: 2 })}`
}

export default function StatsHeader() {
  const stats = useQuery(api.admin.stats)

  const cards = [
    { label: 'TOTAL PRODUCTS', value: stats?.totalProducts ?? '—' },
    { label: 'OUT OF STOCK', value: stats?.outOfStock ?? '—', warn: (stats?.outOfStock ?? 0) > 0 },
    { label: 'PENDING ORDERS', value: stats?.pendingOrders ?? '—', warn: (stats?.pendingOrders ?? 0) > 0 },
    { label: 'TOTAL REVENUE', value: stats ? fmt(stats.totalRevenue) : '—' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2, marginBottom: 40 }}>
      {cards.map((c) => (
        <div key={c.label} style={{ background: '#0A0A0A', padding: '28px 24px', borderTop: `2px solid ${c.warn ? '#e05252' : '#C9A84C'}` }}>
          <p style={{ fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', fontWeight: 700, marginBottom: 12 }}>
            {c.label}
          </p>
          <p style={{ fontSize: 28, fontWeight: 800, color: c.warn ? '#e05252' : '#fff', fontVariantNumeric: 'tabular-nums' }}>
            {String(c.value)}
          </p>
        </div>
      ))}
    </div>
  )
}
