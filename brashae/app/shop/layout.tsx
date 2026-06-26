import { Suspense } from 'react'
import StoreHeader from '@/components/shop/StoreHeader'
import CategorySubNav from '@/components/shop/CategorySubNav'

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-theme="ecomm" style={{ minHeight: '100vh', background: '#FAF7F2' }}>
      {/* Fixed store header */}
      <StoreHeader />

      {/* Sticky category sub-nav — needs Suspense for useSearchParams */}
      <Suspense fallback={
        <div
          style={{
            position: 'sticky',
            top: 64,
            zIndex: 90,
            height: 52,
            background: '#FAF7F2',
            borderBottom: '1px solid rgba(0,0,0,0.08)',
          }}
        />
      }>
        <CategorySubNav />
      </Suspense>

      {/* Page content — offset by header (64px) + subnav (52px) = 116px */}
      <div style={{ paddingTop: 116 }}>
        {children}
      </div>
    </div>
  )
}
