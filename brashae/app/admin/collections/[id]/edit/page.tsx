'use client'
import { useQuery } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useParams } from 'next/navigation'
import CollectionForm from '@/components/admin/CollectionForm'

export default function EditCollectionPage() {
  const { id } = useParams()
  const collections = useQuery(api.collections.list)
  const collection = collections?.find((c) => c._id === id)

  if (!collections) return <main style={{ padding: '40px 48px', color: '#fff' }}>Loading…</main>
  if (!collection) return <main style={{ padding: '40px 48px', color: '#fff' }}>Not found.</main>

  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>COLLECTIONS</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 40 }}>Edit Collection</h1>
      <CollectionForm initialData={{
        ...collection,
        _id: collection._id as Id<'collections'>,
        description: collection.description ?? '',
        image: collection.image ?? '',
        sortOrder: collection.sortOrder?.toString() ?? '',
      }} />
    </main>
  )
}
