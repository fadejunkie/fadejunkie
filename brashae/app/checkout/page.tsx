import Link from 'next/link'

export default function CheckoutPage() {
  return (
    <main style={{
      paddingTop: 56, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 11, textTransform: 'uppercase',
          color: '#C9A84C', fontWeight: 700, marginBottom: 16,
        }}>
          CHECKOUT
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16 }}>Coming Soon</h1>
        <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', marginBottom: 40 }}>
          Secure checkout is being configured.
        </p>
        <Link href="/shop" style={{
          fontSize: 13, fontWeight: 600, color: '#C9A84C',
          borderBottom: '1px solid rgba(201,168,76,0.4)', paddingBottom: 2,
        }}>
          ← Back to Shop
        </Link>
      </div>
    </main>
  )
}
