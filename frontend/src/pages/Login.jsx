import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.username, form.password)
      navigate('/')
    } catch {
      setError('Invalid username or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #1F4E79 0%, #2E75B6 100%)',
    }}>
      <div style={{
        background: '#fff', borderRadius: 14, padding: '40px 36px',
        width: 360, boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
      }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 40 }}>🎓</div>
          <h1 style={{ fontSize: 20, fontWeight: 700, color: '#1F4E79', marginTop: 8 }}>
            Placement Analytics
          </h1>
          <p style={{ fontSize: 13, color: '#57606a', marginTop: 4 }}>Sign in to your account</p>
        </div>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Username</label>
            <input
              type="text" required value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 14, outline: 'none' }}
              placeholder="Enter username"
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 13, fontWeight: 500, display: 'block', marginBottom: 6 }}>Password</label>
            <input
              type="password" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              style={{ width: '100%', padding: '9px 12px', border: '1px solid #d1d5db', borderRadius: 7, fontSize: 14, outline: 'none' }}
              placeholder="Enter password"
            />
          </div>
          {error && <div style={{ color: '#dc2626', fontSize: 13, marginBottom: 14, textAlign: 'center' }}>{error}</div>}
          <button type="submit" disabled={loading} className="btn-primary"
            style={{ width: '100%', padding: '10px', fontSize: 14, fontWeight: 600 }}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <div style={{ marginTop: 20, padding: '12px', background: '#f7f8fa', borderRadius: 8, fontSize: 12, color: '#57606a' }}>
          <strong>Demo accounts:</strong><br />
          admin / admin123 &nbsp;|&nbsp; mgmt / mgmt123 &nbsp;|&nbsp; student / student123
        </div>
      </div>
    </div>
  )
}
