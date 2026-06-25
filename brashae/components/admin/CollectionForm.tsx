'use client'
import { useState } from 'react'
import { useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useRouter } from 'next/navigation'

interface CollectionData {
  name: string
  slug: string
  description: string
  image: string
  sortOrder: string
}

const empty: CollectionData = { name: '', slug: '', description: '', image: '', sortOrder: '' }

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface Props {
  initialData?: CollectionData & { _id: Id<'collections'> }
}

export default function CollectionForm({ initialData }: Props) {
  const [form, setForm] = useState<CollectionData>(initialData ?? empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const create = useMutation(api.collections.create)
  const update = useMutation(api.collections.update)
  const router = useRouter()

  function set<K extends keyof CollectionData>(key: K, val: string) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const payload = {
        name: form.name, slug: form.slug,
        description: form.description || undefined,
        image: form.image || undefined,
        sortOrder: form.sortOrder ? parseInt(form.sortOrder) : undefined,
      }
      if (initialData) {
        await update({ id: initialData._id, ...payload })
      } else {
        await create(payload)
      }
      router.push('/admin/collections')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSaving(false)
    }
  }

  const inputStyle = { width: '100%', padding: '10px 12px', background: '#0A0A0A', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: 13, outline: 'none' }
  const labelStyle = { fontSize: 11, textTransform: 'uppercase' as const, fontWeight: 700, color: 'rgba(255,255,255,0.4)', display: 'block' as const, marginBottom: 6 }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div>
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => { set('name', e.target.value); if (!initialData) set('slug', toSlug(e.target.value)) }} required />
        </div>
        <div>
          <label style={labelStyle}>Slug *</label>
          <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
        </div>
      </div>
      <div style={{ marginBottom: 20 }}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 60, resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20, marginBottom: 28 }}>
        <div>
          <label style={labelStyle}>Image URL</label>
          <input style={inputStyle} value={form.image} onChange={(e) => set('image', e.target.value)} placeholder="https://..." />
        </div>
        <div>
          <label style={labelStyle}>Sort Order</label>
          <input style={inputStyle} type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
        </div>
      </div>
      {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</p>}
      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={saving} style={{ padding: '14px 32px', background: '#C9A84C', border: 'none', color: '#000', fontSize: 13, fontWeight: 700, textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer' }}>
          {saving ? 'Saving…' : initialData ? 'Update' : 'Create Collection'}
        </button>
        <button type="button" onClick={() => router.push('/admin/collections')} style={{ padding: '14px 24px', background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.6)', fontSize: 13, cursor: 'pointer' }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
