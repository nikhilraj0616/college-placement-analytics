import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  LineChart, Line
} from 'recharts'
import KPICard from '../components/KPICard'
import ExportToolbar from '../components/ExportToolbar'
import client from '../api/client'

export default function PlacementRate() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/analytics/placement-rate')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>
  if (!data) return <div style={{ padding: 40 }}>No data available. Upload placement data first.</div>

  return (
    <div>
      <div className="page-title">🎓 Placement Rate Analysis</div>
      <ExportToolbar module="placement-rate" />

      <div className="grid-3" style={{ marginBottom: 24 }}>
        <KPICard title="Overall Rate" value={`${data.overall_rate}%`} icon="📈" color="#1F4E79" />
        <KPICard title="Total Students" value={data.total_students} icon="👥" color="#2E75B6" />
        <KPICard title="Unplaced" value={data.unplaced_students} icon="⚠️" color="#d97706" />
      </div>

      <div className="chart-container">
        <div className="chart-title">Branch-wise Placement Rate</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data.branch_breakdown} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
            <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Bar dataKey="rate" name="Placement Rate %" fill="#1F4E79" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Year-over-Year Placement Trend</div>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={data.yoy_trend} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis unit="%" domain={[0, 100]} tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Legend />
            <Line type="monotone" dataKey="rate" name="Rate %" stroke="#2E75B6" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Branch Breakdown Table</div>
        <table>
          <thead>
            <tr>
              <th>Branch</th><th>Total</th><th>Placed</th><th>Unplaced</th><th>Rate %</th>
            </tr>
          </thead>
          <tbody>
            {data.branch_breakdown.map(b => (
              <tr key={b.branch}>
                <td>{b.branch}</td>
                <td>{b.total}</td>
                <td><span className="badge badge-green">{b.placed}</span></td>
                <td><span className="badge badge-orange">{b.total - b.placed}</span></td>
                <td><strong>{b.rate}%</strong></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
