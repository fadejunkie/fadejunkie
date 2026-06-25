'use client'
import Link from 'next/link'
import ProductsTable from '@/components/admin/ProductsTable'

export default function ProductsPage() {
  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 40 }}>
        <div>
          <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>INVENTORY</p>
          <h1 style={{ fontSize: '2rem', fontWeight: 800 }}>Products</h1>
        </div>
        <Link href="/admin/products/new" style={{
          padding: '12px 24px', background: '#C9A84C', color: '#000',
          fontSize: 13, fontWeight: 700, textTransform: 'uppercase',
        }}>
          + Add Product
        </Link>
      </div>
      <ProductsTable />
    </main>
  )
}
