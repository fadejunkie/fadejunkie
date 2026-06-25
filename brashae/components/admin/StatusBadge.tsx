const colors: Record<string, { bg: string; color: string }> = {
  pending:   { bg: 'rgba(234,179,8,0.15)',  color: '#eab308' },
  paid:      { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
  shipped:   { bg: 'rgba(168,85,247,0.15)', color: '#c084fc' },
  fulfilled: { bg: 'rgba(34,197,94,0.15)',  color: '#4ade80' },
  cancelled: { bg: 'rgba(239,68,68,0.15)',  color: '#f87171' },
}

export default function StatusBadge({ status }: { status: string }) {
  const c = colors[status] ?? { bg: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }
  return (
    <span style={{
      display: 'inline-block', padding: '3px 10px',
      background: c.bg, color: c.color,
      fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
    }}>
      {status}
    </span>
  )
}
