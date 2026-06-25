'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import ProductForm from '@/components/admin/ProductForm'

export default function EditProductPage() {
  const { id } = useParams()
  const product = useQuery(api.products.getById, { id: id as Id<'products'> })

  if (product === undefined) {
    return <main style={{ padding: '40px 48px', color: '#fff' }}>Loading…</main>
  }
  if (!product) {
    return <main style={{ padding: '40px 48px', color: '#fff' }}>Product not found.</main>
  }

  const initialData = {
    ...product,
    featured: product.featured ?? false,
    price: (product.price / 100).toFixed(2),
    compareAtPrice: product.compareAtPrice ? (product.compareAtPrice / 100).toFixed(2) : '',
    collectionId: product.collectionId ?? '',
    images: product.images.length ? product.images : [''],
    tags: (product.tags ?? []).join(', '),
    sortOrder: product.sortOrder?.toString() ?? '',
    variants: (product.variants ?? []).map((v) => ({ name: v.name, options: v.options.join(', ') })),
  }

  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>PRODUCTS</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 40 }}>Edit Product</h1>
      <ProductForm initialData={initialData} />
    </main>
  )
}
