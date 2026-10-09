import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell
} from 'recharts'
import KPICard from '../components/KPICard'
import client from '../api/client'

const COLORS = ['#1F4E79', '#2E75B6', '#5BA3D0', '#9DC3E6', '#BDD7EE']

export default function Dashboard() {
  const [summary, setSummary] = useState(null)
  const [branchData, setBranchData] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      client.get('/analytics/summary'),
      client.get('/analytics/branch'),
    ])
      .then(([s, b]) => {
        setSummary(s.data)
        setBranchData(b.data.branch_data || [])
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Loading dashboard…</div>

  return (
    <div>
      <div className="page-title">📊 Placement Dashboard</div>

      {/* KPI Cards */}
      <div className="grid-4" style={{ marginBottom: 24 }}>
        <KPICard title="Total Students" value={summary?.total_students ?? '—'} icon="👥" color="#1F4E79" />
        <KPICard title="Placed Students" value={summary?.placed_students ?? '—'} icon="✅" color="#16a34a" />
        <KPICard title="Placement Rate" value={summary ? `${summary.overall_placement_rate}%` : '—'} icon="📈" color="#2E75B6" />
        <KPICard title="Avg Package" value={summary ? `₹${summary.avg_package_lpa} LPA` : '—'} icon="💰" color="#d97706" />
      </div>
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <KPICard title="Max Package" value={summary ? `₹${summary.max_package_lpa} LPA` : '—'} icon="🏆" color="#7c5cd8" />
        <KPICard title="Top Company" value={summary?.top_company ?? '—'} icon="🏢" color="#dc2626" />
      </div>

      {/* Branch-wise Placement Chart */}
      <div className="chart-container">
        <div className="chart-title">Branch-wise Placement Overview</div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={branchData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            <Bar dataKey="total_students" name="Total" fill="#BDD7EE" radius={[4, 4, 0, 0]} />
            <Bar dataKey="placed" name="Placed" fill="#1F4E79" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Sector split pie */}
      <div className="chart-container">
        <div className="chart-title">Branch Placement Rate (%)</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={branchData} layout="vertical" margin={{ left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} unit="%" />
            <YAxis dataKey="branch" type="category" tick={{ fontSize: 12 }} width={90} />
            <Tooltip formatter={(v) => `${v}%`} />
            <Bar dataKey="placement_rate" name="Placement Rate %" fill="#2E75B6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
