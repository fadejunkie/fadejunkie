'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function ProductsTable() {
  const products = useQuery(api.products.listAll)
  const collections = useQuery(api.collections.list)
  const toggleStock = useMutation(api.products.toggleStock)
  const remove = useMutation(api.products.remove)
  const [deleting, setDeleting] = useState<Id<'products'> | null>(null)

  const collectionMap = Object.fromEntries((collections ?? []).map((c) => [c._id, c.name]))

  if (!products) return <p style={{ color: 'rgba(255,255,255,0.4)', padding: '32px 0' }}>Loading products…</p>

  return (
    <>
      {deleting && (
        <ConfirmModal
          title="Delete product?"
          message="This cannot be undone. The product will be permanently removed."
          confirmLabel="Delete"
          onConfirm={async () => { await remove({ id: deleting }); setDeleting(null) }}
          onCancel={() => setDeleting(null)}
        />
      )}

      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Product', 'Collection', 'Price', 'Stock', 'Featured', 'Actions'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px 8px 0', fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {products.map((p) => (
            <tr key={p._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 12px 14px 0' }}>
                <p style={{ fontWeight: 600, marginBottom: 2 }}>{p.name}</p>
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)' }}>{p.slug}</p>
              </td>
              <td style={{ padding: '14px 12px 14px 0', color: 'rgba(255,255,255,0.5)' }}>
                {p.collectionId ? collectionMap[p.collectionId] ?? '—' : '—'}
              </td>
              <td style={{ padding: '14px 12px 14px 0', fontVariantNumeric: 'tabular-nums' }}>
                ${(p.price / 100).toFixed(2)}
                {p.compareAtPrice && (
                  <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginLeft: 6, textDecoration: 'line-through' }}>
                    ${(p.compareAtPrice / 100).toFixed(2)}
                  </span>
                )}
              </td>
              <td style={{ padding: '14px 12px 14px 0' }}>
                <button
                  onClick={() => toggleStock({ id: p._id, inStock: !p.inStock })}
                  style={{
                    padding: '4px 12px', fontSize: 11, fontWeight: 700,
                    textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                    background: p.inStock ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                    color: p.inStock ? '#4ade80' : '#f87171',
                  }}
                >
                  {p.inStock ? 'In Stock' : 'Out'}
                </button>
              </td>
              <td style={{ padding: '14px 12px 14px 0', color: p.featured ? '#C9A84C' : 'rgba(255,255,255,0.2)', fontSize: 12 }}>
                {p.featured ? '★ Featured' : '—'}
              </td>
              <td style={{ padding: '14px 0 14px 0' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Link href={`/admin/products/${p._id}/edit`} style={{ fontSize: 12, color: '#C9A84C' }}>Edit</Link>
                  <button onClick={() => setDeleting(p._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#f87171', padding: 0 }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
