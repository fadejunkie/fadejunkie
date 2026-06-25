'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await fetch('/api/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setError('Incorrect password.')
      setLoading(false)
    }
  }

  return (
    <main style={{
      minHeight: '100vh', background: '#000',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }}>
      <div style={{ width: '100%', maxWidth: 360, padding: '0 24px' }}>
        <p style={{ fontSize: 11, textTransform: 'uppercase', color: '#C9A84C', fontWeight: 700, marginBottom: 16 }}>
          BRASHAE'S
        </p>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>
          Admin Access
        </h1>
        <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 40 }}>
          Inventory & order management
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoFocus
            style={{
              width: '100%', padding: '14px 16px',
              background: 'var(--surface-soft)', border: '1px solid var(--hairline)',
              color: 'var(--on-dark)', fontSize: 14,
              marginBottom: 12,
              borderRadius: 6,
              transition: 'border-color 0.2s ease',
              fontFamily: 'inherit',
            }}
          />
          {error && (
            <p style={{ fontSize: 12, color: '#e05252', marginBottom: 12 }}>{error}</p>
          )}
          <button
            type="submit"
            disabled={loading || !password}
            className={(!loading && password) ? 'btn-gold' : ''}
            style={{
              width: '100%', padding: 16,
              background: (loading || !password) ? 'var(--muted)' : 'var(--gold)',
              color: '#000', border: 'none',
              fontSize: 13, fontWeight: 700,
              textTransform: 'uppercase', cursor: (loading || !password) ? 'not-allowed' : 'pointer',
              borderRadius: 6,
              transition: 'background 0.2s ease',
              fontFamily: 'inherit',
            }}
          >
            {loading ? 'Checking...' : 'Enter'}
          </button>
        </form>
      </div>
    </main>
  )
}
