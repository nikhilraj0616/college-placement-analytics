import { useEffect, useState } from 'react'
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, Sector
} from 'recharts'
import KPICard from '../components/KPICard'
import ExportToolbar from '../components/ExportToolbar'
import client from '../api/client'

const BAND_COLORS = ['#BDD7EE', '#9DC3E6', '#5BA3D0', '#2E75B6', '#1F4E79']
const BAND_LABELS = { lt_4: '<4 LPA', '4_to_8': '4–8 LPA', '8_to_15': '8–15 LPA', gt_15: '15+ LPA' }

export default function SalaryAnalysis() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/analytics/salary')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>
  if (!data || data.error) return <div style={{ padding: 40 }}>No salary data available.</div>

  const bandData = Object.entries(data.package_bands).map(([key, val]) => ({
    band: BAND_LABELS[key] || key,
    count: val,
  }))

  return (
    <div>
      <div className="page-title">💰 Salary Analysis</div>
      <ExportToolbar module="salary" />

      <div className="grid-4" style={{ marginBottom: 24 }}>
        <KPICard title="Min Package" value={`₹${data.overall.min} LPA`} color="#57606a" icon="📉" />
        <KPICard title="Avg Package" value={`₹${data.overall.avg} LPA`} color="#1F4E79" icon="💰" />
        <KPICard title="Median Package" value={`₹${data.overall.median} LPA`} color="#2E75B6" icon="📊" />
        <KPICard title="Max Package" value={`₹${data.overall.max} LPA`} color="#16a34a" icon="🏆" />
      </div>

      <div className="grid-2">
        <div className="chart-container">
          <div className="chart-title">Package Band Distribution</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={bandData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="band" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="count" name="Students" fill="#2E75B6" radius={[4, 4, 0, 0]}>
                {bandData.map((_, i) => <Cell key={i} fill={BAND_COLORS[i % BAND_COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-title">Top 10 Paying Companies</div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.top_companies} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} unit=" LPA" />
              <YAxis dataKey="company" type="category" tick={{ fontSize: 11 }} width={110} />
              <Tooltip formatter={(v) => `₹${v} LPA`} />
              <Bar dataKey="avg_package" name="Avg Package" fill="#1F4E79" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Branch-wise Average Salary</div>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data.branch_salary} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="branch" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} unit=" LPA" />
            <Tooltip formatter={(v) => `₹${v} LPA`} />
            <Legend />
            <Bar dataKey="min" name="Min" fill="#BDD7EE" radius={[4, 4, 0, 0]} />
            <Bar dataKey="avg" name="Avg" fill="#2E75B6" radius={[4, 4, 0, 0]} />
            <Bar dataKey="max" name="Max" fill="#1F4E79" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
