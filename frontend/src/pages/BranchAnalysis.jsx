import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend
} from 'recharts'
import ExportToolbar from '../components/ExportToolbar'
import client from '../api/client'

export default function BranchAnalysis() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/analytics/branch')
      .then(r => setData(r.data.branch_data || []))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>

  return (
    <div>
      <div className="page-title">🏫 Branch Analysis</div>
      <ExportToolbar module="branch" />

      <div className="chart-container">
        <div className="chart-title">Placements by Branch</div>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_students" name="Total" fill="#BDD7EE" radius={[4, 4, 0, 0]} />
            <Bar dataKey="placed" name="Placed" fill="#1F4E79" radius={[4, 4, 0, 0]} />
            <Bar dataKey="unplaced" name="Unplaced" fill="#f87171" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Average Package by Branch (LPA)</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit=" LPA" />
            <Tooltip formatter={(v) => `₹${v} LPA`} />
            <Bar dataKey="avg_package" name="Avg Package" fill="#2E75B6" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">Detailed Branch Table</div>
        <table>
          <thead>
            <tr>
              <th>Branch</th><th>Total</th><th>Placed</th><th>Rate %</th>
              <th>Avg Pkg (LPA)</th><th>Companies Visited</th>
            </tr>
          </thead>
          <tbody>
            {data.map(b => (
              <tr key={b.branch}>
                <td><strong>{b.branch}</strong></td>
                <td>{b.total_students}</td>
                <td><span className="badge badge-green">{b.placed}</span></td>
                <td>{b.placement_rate}%</td>
                <td>₹{b.avg_package}</td>
                <td><span className="badge badge-blue">{b.companies_visited}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
