import Hero from '@/components/sections/Hero'
import FeaturedBrands from '@/components/sections/FeaturedBrands'
import ShopCategories from '@/components/sections/ShopCategories'
import MonthlySpecials from '@/components/sections/MonthlySpecials'
import SalonServices from '@/components/sections/SalonServices'
import MeetProfessionals from '@/components/sections/MeetProfessionals'
import BeforeAfterGallery from '@/components/sections/BeforeAfterGallery'
import ProSupplyProgram from '@/components/sections/ProSupplyProgram'
import Testimonials from '@/components/sections/Testimonials'
import InstagramFeed from '@/components/sections/InstagramFeed'
import LocationHours from '@/components/sections/LocationHours'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      {/* Promo banner */}
      <div style={{
        height: 44,
        background: 'var(--canvas)',
        borderBottom: '1px solid var(--hairline)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 11,
        textTransform: 'uppercase',
        color: 'var(--body)',
        fontWeight: 500,
        letterSpacing: 0,
      }}>
        Free shipping on orders over $75 &nbsp;·&nbsp; 713-541-2279
      </div>

      <main style={{ background: 'var(--canvas)', color: 'var(--on-dark)' }}>
        {/* 1. Hero */}
        <Hero />

        {/* 2. Featured Brands */}
        <FeaturedBrands />

        {/* 3. Shop Categories */}
        <ShopCategories />

        {/* 4. Monthly Specials */}
        <MonthlySpecials />

        {/* 5. Salon Services */}
        <SalonServices />

        {/* 6. Meet the Professionals */}
        <MeetProfessionals />

        {/* 7. Before & After Gallery */}
        <BeforeAfterGallery />

        {/* 8. Pro Supply Program */}
        <ProSupplyProgram />

        {/* 9. Testimonials */}
        <Testimonials />

        {/* 10. Instagram Feed */}
        <InstagramFeed />

        {/* 11. Location + Hours */}
        <LocationHours />
      </main>

      {/* 12. Footer */}
      <Footer />
    </>
  )
}
