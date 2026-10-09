import { useState } from 'react'
import client from '../api/client'

export default function DataUpload() {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [dragging, setDragging] = useState(false)

  const handleDrop = (e) => {
    e.preventDefault()
    setDragging(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) setFile(dropped)
  }

  const handleUpload = async () => {
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await client.post('/upload/csv', fd)
      setResult(res.data)
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <div className="page-title">⬆️ Upload Placement Data</div>
      <p style={{ color: '#57606a', marginBottom: 20 }}>
        Upload a <strong>.csv</strong> or <strong>.xlsx</strong> file. Required columns:
        roll_no, name, branch, cgpa, graduation_year, company, sector, company_type, job_role, package_lpa, offer_type, placement_date, status
      </p>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${dragging ? '#2E75B6' : '#d1d5db'}`,
          borderRadius: 12, padding: '40px 20px', textAlign: 'center',
          background: dragging ? '#eff6ff' : '#f9fafb', marginBottom: 20, cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onClick={() => document.getElementById('file-input').click()}
      >
        <div style={{ fontSize: 36 }}>📂</div>
        <div style={{ marginTop: 8, fontWeight: 600, color: '#1F4E79' }}>
          {file ? file.name : 'Drag & drop your CSV/Excel file here'}
        </div>
        <div style={{ fontSize: 12, color: '#57606a', marginTop: 4 }}>
          or click to browse
        </div>
        <input
          id="file-input" type="file" accept=".csv,.xlsx"
          style={{ display: 'none' }}
          onChange={(e) => setFile(e.target.files[0])}
        />
      </div>

      <button
        className="btn-primary" onClick={handleUpload} disabled={!file || loading}
        style={{ padding: '10px 28px', fontSize: 14 }}>
        {loading ? 'Uploading…' : '⬆️ Upload & Process'}
      </button>

      {error && (
        <div style={{ marginTop: 20, padding: 14, background: '#fef2f2', border: '1px solid #fca5a5', borderRadius: 8, color: '#dc2626' }}>
          ⚠️ {error}
        </div>
      )}

      {result && (
        <div style={{ marginTop: 20, padding: 16, background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 8 }}>
          <div style={{ fontWeight: 700, color: '#16a34a', fontSize: 16, marginBottom: 8 }}>✅ Upload Complete</div>
          <div>Inserted: <strong>{result.inserted}</strong> rows</div>
          <div>Skipped: <strong>{result.skipped_count}</strong> rows</div>
          {result.skipped_rows?.length > 0 && (
            <details style={{ marginTop: 10 }}>
              <summary style={{ cursor: 'pointer', fontWeight: 500 }}>Show skipped rows</summary>
              <ul style={{ marginTop: 8, fontSize: 12, color: '#57606a' }}>
                {result.skipped_rows.map((s, i) => (
                  <li key={i}>Row {s.row}: {s.reason}</li>
                ))}
              </ul>
            </details>
          )}
        </div>
      )}

      <div style={{ marginTop: 30, padding: 16, background: '#f7f8fa', borderRadius: 8, fontSize: 13 }}>
        <strong>📥 Sample CSV format:</strong>
        <pre style={{ marginTop: 8, fontSize: 11, overflow: 'auto', color: '#374151' }}>
{`roll_no,name,branch,cgpa,graduation_year,company,sector,company_type,job_role,package_lpa,offer_type,placement_date,status
CS001,Aarav Sharma,CSE,9.1,2024,Google,IT,MNC,SDE,28.0,Full-Time,2024-09-10,Placed`}
        </pre>
      </div>
    </div>
  )
}
