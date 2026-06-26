'use client'
import { useQuery } from 'convex/react'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'
import { api } from '@/convex/_generated/api'
import ProductCard from '@/components/ProductCard'
import ProductGridLayout from '@/components/shop/ProductGridLayout'
import PromoBanner from '@/components/shop/PromoBanner'
import ShopByBrand from '@/components/shop/ShopByBrand'
import MonthlySpecials from '@/components/shop/MonthlySpecials'
import ProSupplyBand from '@/components/shop/ProSupplyBand'
import StoreFooter from '@/components/shop/StoreFooter'

// ─── Product grid (Convex-powered) ───────────────────────────────────────────

function ShopContent() {
  const searchParams = useSearchParams()
  const activeCollection = searchParams.get('collection') ?? ''

  const products = useQuery(api.products.list, {})

  const filtered = products?.filter((p) => {
    if (!activeCollection) return true
    return p.tags?.some((t) => t.toLowerCase().replace(/\s+/g, '-') === activeCollection)
  })

  const collectionLabel = activeCollection
    ? activeCollection.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : 'All Products'

  return (
    <ProductGridLayout
      activeCollection={collectionLabel}
      productCount={filtered?.length}
    >
      {products === undefined ? (
        /* Skeleton grid */
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              style={{
                aspectRatio: '3/4',
                background: '#EDE8E1',
                border: '1px solid rgba(0,0,0,0.06)',
                borderRadius: 8,
              }}
            />
          ))}
        </div>
      ) : filtered && filtered.length === 0 ? (
        <div style={{ paddingTop: 80, textAlign: 'center', color: '#999999', fontSize: 15, fontFamily: 'Inter, sans-serif' }}>
          No products found
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: 16,
        }}>
          {(filtered ?? []).map((p) => (
            <ProductCard
              key={p._id}
              name={p.name}
              price={p.price}
              compareAtPrice={p.compareAtPrice}
              imageUrl={p.images?.[0]}
              tags={p.tags}
              slug={p.slug}
            />
          ))}
        </div>
      )}
    </ProductGridLayout>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ShopPage() {
  return (
    <>
      {/* 1. Hero promo banner */}
      <PromoBanner />

      {/* 2. Product grid — Convex-powered, wrapped in layout with filter sidebar */}
      <Suspense fallback={
        <div style={{ minHeight: 400, background: '#FAF7F2' }} />
      }>
        <ShopContent />
      </Suspense>

      {/* 3. Brand discovery */}
      <ShopByBrand />

      {/* 4. Monthly specials */}
      <MonthlySpecials />

      {/* 5. Pro supply conversion band (dark section) */}
      <ProSupplyBand />

      {/* 6. Footer */}
      <StoreFooter />
    </>
  )
}
