'use client'
import Link from 'next/link'
import CollectionsTable from '@/components/admin/CollectionsTable'

export default function CollectionsPage() {
  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>CATALOG</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Collections</h1>
        </div>
        <Link href="/admin/collections/new" style={{ padding: '12px 24px', background: '#C9A84C', color: '#000', fontSize: 13, fontWeight: 700, textTransform: 'uppercase' }}>
          + Add Collection
        </Link>
      </div>
      <CollectionsTable />
    </main>
  )
}
