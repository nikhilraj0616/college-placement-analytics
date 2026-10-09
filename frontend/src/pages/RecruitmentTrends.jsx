import { useEffect, useState } from 'react'
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts'
import client from '../api/client'

const SECTOR_COLORS = ['#1F4E79', '#2E75B6', '#5BA3D0', '#9DC3E6', '#e67e22', '#16a34a']

export default function RecruitmentTrends() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.get('/analytics/trends')
      .then(r => setData(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div style={{ padding: 40 }}>Loading…</div>
  if (!data) return <div style={{ padding: 40 }}>No data available.</div>

  return (
    <div>
      <div className="page-title">📅 Recruitment Trends</div>

      <div className="chart-container">
        <div className="chart-title">Monthly Offer Timeline</div>
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={data.monthly_timeline} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Line type="monotone" dataKey="offers" name="Offers" stroke="#1F4E79" strokeWidth={2} dot={{ r: 5 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid-2">
        <div className="chart-container">
          <div className="chart-title">Sector-wise Hiring Split</div>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={data.sector_split} dataKey="count" nameKey="sector"
                cx="50%" cy="50%" outerRadius={100} label={({ sector, percent }) => `${sector} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {data.sector_split.map((_, i) => (
                  <Cell key={i} fill={SECTOR_COLORS[i % SECTOR_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(v, n) => [v, n]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <div className="chart-title">Top Recruiting Companies</div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={data.top_companies} layout="vertical" margin={{ left: 10, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 11 }} />
              <YAxis dataKey="company" type="category" tick={{ fontSize: 11 }} width={110} />
              <Tooltip />
              <Bar dataKey="hires" name="Hires" fill="#2E75B6" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="chart-container">
        <div className="chart-title">Year-over-Year Company Participation</div>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.yoy_company_participation} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="year" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="companies" name="Companies" fill="#1F4E79" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
