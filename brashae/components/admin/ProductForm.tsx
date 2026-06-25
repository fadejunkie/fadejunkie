'use client'
import { useState } from 'react'
import { useQuery, useMutation } from 'convex/react'
import { api } from '@/convex/_generated/api'
import { Id } from '@/convex/_generated/dataModel'
import { useRouter } from 'next/navigation'

interface ProductData {
  name: string
  slug: string
  description: string
  price: string
  compareAtPrice: string
  collectionId: string
  images: string[]
  tags: string
  inStock: boolean
  featured: boolean
  sortOrder: string
  variants: { name: string; options: string }[]
}

const empty: ProductData = {
  name: '', slug: '', description: '', price: '', compareAtPrice: '',
  collectionId: '', images: [''], tags: '', inStock: true, featured: false,
  sortOrder: '', variants: [],
}

function toSlug(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

interface Props {
  initialData?: ProductData & { _id: Id<'products'> }
}

export default function ProductForm({ initialData }: Props) {
  const [form, setForm] = useState<ProductData>(initialData ?? empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const collections = useQuery(api.collections.list)
  const create = useMutation(api.products.create)
  const update = useMutation(api.products.update)
  const router = useRouter()

  function set<K extends keyof ProductData>(key: K, val: ProductData[K]) {
    setForm((f) => ({ ...f, [key]: val }))
  }

  function handleNameChange(name: string) {
    setForm((f) => ({ ...f, name, slug: f.slug || toSlug(name) }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError('')
    try {
      const price = Math.round(parseFloat(form.price) * 100)
      const compareAtPrice = form.compareAtPrice ? Math.round(parseFloat(form.compareAtPrice) * 100) : undefined
      const images = form.images.filter(Boolean)
      const tags = form.tags.split(',').map((t) => t.trim()).filter(Boolean)
      const variants = form.variants
        .filter((v) => v.name && v.options)
        .map((v) => ({ name: v.name, options: v.options.split(',').map((o) => o.trim()).filter(Boolean) }))
      const collectionId = form.collectionId as Id<'collections'> | undefined

      const payload = {
        name: form.name, slug: form.slug, description: form.description,
        price, compareAtPrice, collectionId: collectionId || undefined,
        images, tags, variants, inStock: form.inStock, featured: form.featured,
        sortOrder: form.sortOrder ? parseInt(form.sortOrder) : undefined,
      }

      if (initialData) {
        await update({ id: initialData._id, ...payload })
      } else {
        await create(payload)
      }
      router.push('/admin/products')
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Save failed')
      setSaving(false)
    }
  }

  const inputStyle = {
    width: '100%', padding: '10px 12px',
    background: 'var(--surface-soft)' as const, border: '1px solid var(--hairline)' as const,
    color: 'var(--on-dark)' as const, fontSize: 13,
    borderRadius: 6,
    transition: 'border-color 0.2s ease' as const,
    fontFamily: 'inherit' as const,
  }
  const labelStyle = { fontSize: 11, textTransform: 'uppercase' as const, fontWeight: 700, color: 'var(--muted)' as const, display: 'block' as const, marginBottom: 6 }
  const fieldStyle = { marginBottom: 20 }

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: 700 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Name *</label>
          <input style={inputStyle} value={form.name} onChange={(e) => handleNameChange(e.target.value)} required />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Slug *</label>
          <input style={inputStyle} value={form.slug} onChange={(e) => set('slug', e.target.value)} required />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Description</label>
        <textarea style={{ ...inputStyle, minHeight: 80, resize: 'vertical' }} value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
        <div style={fieldStyle}>
          <label style={labelStyle}>Price ($) *</label>
          <input style={inputStyle} type="number" step="0.01" value={form.price} onChange={(e) => set('price', e.target.value)} required />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Compare At ($)</label>
          <input style={inputStyle} type="number" step="0.01" value={form.compareAtPrice} onChange={(e) => set('compareAtPrice', e.target.value)} />
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>Sort Order</label>
          <input style={inputStyle} type="number" value={form.sortOrder} onChange={(e) => set('sortOrder', e.target.value)} />
        </div>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Collection</label>
        <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.collectionId} onChange={(e) => set('collectionId', e.target.value)}>
          <option value="">— None —</option>
          {(collections ?? []).map((c) => (
            <option key={c._id} value={c._id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div style={fieldStyle}>
        <label style={labelStyle}>Tags (comma-separated)</label>
        <input style={inputStyle} value={form.tags} onChange={(e) => set('tags', e.target.value)} placeholder="Andis, clippers" />
      </div>

      {/* Images */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Images (one URL per line)</label>
        {form.images.map((img, i) => (
          <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <input
              style={{ ...inputStyle, flex: 1 }}
              value={img}
              onChange={(e) => {
                const imgs = [...form.images]; imgs[i] = e.target.value; set('images', imgs)
              }}
              placeholder="https://..."
            />
            <button type="button" onClick={() => { const imgs = form.images.filter((_, j) => j !== i); set('images', imgs.length ? imgs : ['']) }}
              style={{ padding: '0 12px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => set('images', [...form.images, ''])}
          style={{ fontSize: 12, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>
          + Add image URL
        </button>
      </div>

      {/* Variants */}
      <div style={fieldStyle}>
        <label style={labelStyle}>Variants</label>
        {form.variants.map((v, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 2fr auto', gap: 8, marginBottom: 8 }}>
            <input style={inputStyle} placeholder="e.g. Color" value={v.name} onChange={(e) => { const vs = [...form.variants]; vs[i] = { ...vs[i], name: e.target.value }; set('variants', vs) }} />
            <input style={inputStyle} placeholder="e.g. Black, Gold, Chrome" value={v.options} onChange={(e) => { const vs = [...form.variants]; vs[i] = { ...vs[i], options: e.target.value }; set('variants', vs) }} />
            <button type="button" onClick={() => set('variants', form.variants.filter((_, j) => j !== i))}
              style={{ padding: '0 12px', background: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer' }}>✕</button>
          </div>
        ))}
        <button type="button" onClick={() => set('variants', [...form.variants, { name: '', options: '' }])}
          style={{ fontSize: 12, color: '#C9A84C', background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginTop: 4 }}>
          + Add variant
        </button>
      </div>

      {/* Flags */}
      <div style={{ display: 'flex', gap: 32, marginBottom: 28 }}>
        {[
          { key: 'inStock' as const, label: 'In Stock' },
          { key: 'featured' as const, label: 'Featured' },
        ].map(({ key, label }) => (
          <label key={key} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 13 }}>
            <input type="checkbox" checked={form[key] as boolean} onChange={(e) => set(key, e.target.checked)} style={{ width: 16, height: 16, accentColor: '#C9A84C' }} />
            {label}
          </label>
        ))}
      </div>

      {error && <p style={{ color: '#f87171', fontSize: 13, marginBottom: 16 }}>{error}</p>}

      <div style={{ display: 'flex', gap: 12 }}>
        <button type="submit" disabled={saving} className={!saving ? 'btn-gold' : ''} style={{
          padding: '14px 32px', background: saving ? 'var(--muted)' : 'var(--gold)', border: 'none',
          color: '#000', fontSize: 13, fontWeight: 700,
          textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer',
          borderRadius: 6,
          transition: 'background 0.2s ease, transform 0.15s ease',
          fontFamily: 'inherit',
        }}>
          {saving ? 'Saving…' : initialData ? 'Update Product' : 'Create Product'}
        </button>
        <button type="button" onClick={() => router.push('/admin/products')} style={{
          padding: '14px 24px', background: 'transparent',
          border: '1px solid var(--hairline)', color: 'var(--body)',
          fontSize: 13, cursor: 'pointer',
          borderRadius: 6,
          transition: 'border-color 0.2s ease, color 0.2s ease',
          fontFamily: 'inherit',
        }}>
          Cancel
        </button>
      </div>
    </form>
  )
}
