'use client'
import ProductForm from '@/components/admin/ProductForm'

export default function NewProductPage() {
  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>PRODUCTS</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 40 }}>New Product</h1>
      <ProductForm />
    </main>
  )
}
