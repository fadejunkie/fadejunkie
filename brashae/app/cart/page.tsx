import Link from 'next/link'

export default function CartPage() {
  return (
    <main style={{
      paddingTop: 64, minHeight: '100vh',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ textAlign: 'center' }}>
        <p style={{
          fontSize: 11, textTransform: 'uppercase',
          color: 'var(--gold)', marginBottom: 16, fontWeight: 700,
        }}>
          CART
        </p>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: 16, textWrap: 'balance' }}>Your Cart</h1>
        <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 40, textWrap: 'pretty' }}>
          Cart is empty.
        </p>
        <Link href="/shop" style={{
          fontSize: 13, fontWeight: 600, color: 'var(--gold)',
          borderBottom: '1px solid var(--gold-glow-border)', paddingBottom: 2,
          cursor: 'pointer',
        }}>
          ← Continue Shopping
        </Link>
      </div>
    </main>
  )
}
