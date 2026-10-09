export default function KPICard({ title, value, sub, color = '#1F4E79', icon }) {
  return (
    <div style={{
      background: '#fff',
      border: '1px solid #e5e7eb',
      borderRadius: 10,
      padding: '18px 20px',
      borderLeft: `4px solid ${color}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontSize: 12, color: '#57606a', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>
            {title}
          </div>
          <div style={{ fontSize: 26, fontWeight: 700, color }}>
            {value}
          </div>
          {sub && <div style={{ fontSize: 12, color: '#57606a', marginTop: 4 }}>{sub}</div>}
        </div>
        {icon && <span style={{ fontSize: 28, opacity: 0.7 }}>{icon}</span>}
      </div>
    </div>
  )
}
