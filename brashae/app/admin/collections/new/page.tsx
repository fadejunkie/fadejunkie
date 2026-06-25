'use client'
import CollectionForm from '@/components/admin/CollectionForm'

export default function NewCollectionPage() {
  return (
    <main style={{ padding: '40px 48px', color: '#fff', minHeight: '100vh' }}>
      <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 8 }}>COLLECTIONS</p>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: 40 }}>New Collection</h1>
      <CollectionForm />
    </main>
  )
}
