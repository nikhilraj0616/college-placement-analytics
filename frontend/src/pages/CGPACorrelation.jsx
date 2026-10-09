import { useEffect, useState } from 'react'
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  ZAxis, Legend
} from 'recharts'
import KPICard from '../components/KPICard'
import client from '../api/client'

const BRANCH_COLORS = ['#1F4E79', '#2E75B6', '#e67e22', '#16a34a', '#7c5cd8']

export default function CGPACorrelation() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/analytics/cgpa')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>
  if (!data || data.error) return <div style={{ padding: 40 }}>No data available.</div>

  // Group scatter by branch for multi-color
  const branches = [...new Set(data.scatter_data.map(d => d.branch))]
  const grouped = branches.map((b, i) => ({
    branch: b,
    color: BRANCH_COLORS[i % BRANCH_COLORS.length],
    points: data.scatter_data.filter(d => d.branch === b).map(d => ({ x: d.cgpa, y: d.package })),
  }))

  return (
    <div>
      <div className="page-title">📈 CGPA vs Package Correlation</div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        <KPICard
          title="Pearson Correlation (r)"
          value={data.pearson_r}
          sub={data.interpretation}
          color={data.pearson_r >= 0.4 ? '#16a34a' : '#d97706'}
          icon="🔗"
        />
        <KPICard
          title="Data Points"
          value={data.scatter_data.length}
          sub="Placed students"
          color="#1F4E79"
          icon="📊"
        />
      </div>

      <div className="chart-container">
        <div className="chart-title">CGPA vs Package Scatter Plot (by Branch)</div>
        <ResponsiveContainer width="100%" height={380}>
          <ScatterChart margin={{ top: 10, right: 20, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis
              dataKey="x" name="CGPA" type="number"
              domain={[4, 10]} tick={{ fontSize: 11 }}
              label={{ value: 'CGPA', position: 'insideBottom', offset: -10, fontSize: 12 }}
            />
            <YAxis
              dataKey="y" name="Package (LPA)" type="number"
              tick={{ fontSize: 11 }}
              label={{ value: 'Package (LPA)', angle: -90, position: 'insideLeft', fontSize: 12 }}
            />
            <ZAxis range={[50, 50]} />
            <Tooltip cursor={{ strokeDasharray: '3 3' }} formatter={(v, n) => [v, n]} />
            <Legend />
            {grouped.map(g => (
              <Scatter key={g.branch} name={g.branch} data={g.points} fill={g.color} opacity={0.8} />
            ))}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="chart-container">
        <div className="chart-title">CGPA Band Analysis</div>
        <table>
          <thead>
            <tr><th>CGPA Band</th><th>Students Placed</th><th>Avg Package (LPA)</th></tr>
          </thead>
          <tbody>
            {data.band_analysis.map(b => (
              <tr key={b.band}>
                <td><strong>{b.band}</strong></td>
                <td>{b.count}</td>
                <td>₹{b.avg_package}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
