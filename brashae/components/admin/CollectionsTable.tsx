'use client'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import Link from 'next/link'
import { useState } from 'react'
import ConfirmModal from './ConfirmModal'

export default function CollectionsTable() {
  const collections = useQuery(api.collections.list)
  const remove = useMutation(api.collections.remove)
  const [deleting, setDeleting] = useState<Id<'collections'> | null>(null)

  if (!collections) return <p style={{ color: 'rgba(255,255,255,0.4)', padding: '32px 0' }}>Loading…</p>

  return (
    <>
      {deleting && (
        <ConfirmModal
          title="Delete collection?"
          message="Products in this collection will not be deleted, but will lose their collection assignment."
          onConfirm={async () => { await remove({ id: deleting }); setDeleting(null) }}
          onCancel={() => setDeleting(null)}
        />
      )}
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
        <thead>
          <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            {['Name', 'Slug', 'Sort Order', 'Actions'].map((h) => (
              <th key={h} style={{ textAlign: 'left', padding: '8px 12px 8px 0', fontSize: 11, textTransform: 'uppercase', color: 'rgba(255,255,255,0.3)', fontWeight: 700 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {collections.map((c) => (
            <tr key={c._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <td style={{ padding: '14px 12px 14px 0', fontWeight: 600 }}>{c.name}</td>
              <td style={{ padding: '14px 12px 14px 0', color: 'rgba(255,255,255,0.4)', fontFamily: 'monospace', fontSize: 12 }}>{c.slug}</td>
              <td style={{ padding: '14px 12px 14px 0', color: 'rgba(255,255,255,0.4)' }}>{c.sortOrder ?? '—'}</td>
              <td style={{ padding: '14px 0 14px 0' }}>
                <div style={{ display: 'flex', gap: 16 }}>
                  <Link href={`/admin/collections/${c._id}/edit`} style={{ fontSize: 12, color: '#C9A84C' }}>Edit</Link>
                  <button onClick={() => setDeleting(c._id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: 12, color: '#f87171', padding: 0 }}>Delete</button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  )
}
