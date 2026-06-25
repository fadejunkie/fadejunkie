'use client'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  onConfirm: () => void
  onCancel: () => void
}

export default function ConfirmModal({ title, message, confirmLabel = 'Delete', onConfirm, onCancel }: Props) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 1000,
      background: 'rgba(0,0,0,0.8)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
    }} onClick={onCancel}>
      <div
        style={{ background: 'var(--surface-card)', padding: 32, width: 420, border: '1px solid var(--hairline)', borderRadius: 12 }}
        onClick={(e) => e.stopPropagation()}
      >
        <h2 style={{ fontSize: 18, fontWeight: 700, marginBottom: 12 }}>{title}</h2>
        <p style={{ fontSize: 14, color: 'var(--body)', lineHeight: 1.6, marginBottom: 28 }}>{message}</p>
        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '12px 0', background: 'transparent',
            border: '1px solid var(--hairline)', color: 'var(--body)',
            fontSize: 13, cursor: 'pointer',
            borderRadius: 6,
            transition: 'border-color 0.2s ease, color 0.2s ease',
          }}>
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '12px 0', background: '#E55353',
            border: 'none', color: '#fff',
            fontSize: 13, fontWeight: 700, cursor: 'pointer',
            borderRadius: 6,
            transition: 'background 0.2s ease',
          }}>
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
