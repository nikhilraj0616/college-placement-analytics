import { useAuth } from '../context/AuthContext'
import client from '../api/client'

export default function ExportToolbar({ module }) {
  const { user } = useAuth()
  if (!user || user.role === 'student') return null

  const handleExport = async (type) => {
    try {
      const res = await client.get(`/export/${type}?module=${module}`, { responseType: 'blob' })
      const ext = type === 'pdf' ? 'pdf' : 'xlsx'
      const mime = type === 'pdf' ? 'application/pdf'
        : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      const url = URL.createObjectURL(new Blob([res.data], { type: mime }))
      const a = document.createElement('a')
      a.href = url
      a.download = `placement_${module}.${ext}`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('Export failed. Make sure data is loaded.')
    }
  }

  return (
    <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
      <button className="btn-secondary" onClick={() => handleExport('excel')}>
        📥 Export Excel
      </button>
      <button className="btn-secondary" onClick={() => handleExport('pdf')}>
        📄 Export PDF
      </button>
    </div>
  )
}
