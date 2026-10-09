import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const NAV = [
  { label: 'Dashboard', path: '/', icon: '📊' },
  { label: 'Placement Rate', path: '/placement-rate', icon: '🎓' },
  { label: 'Salary Analysis', path: '/salary', icon: '💰' },
  { label: 'Branch Analysis', path: '/branch', icon: '🏫' },
  { label: 'CGPA Correlation', path: '/cgpa', icon: '📈' },
  { label: 'Recruitment Trends', path: '/trends', icon: '📅' },
]

const ADMIN_NAV = [
  { label: 'Upload Data', path: '/upload', icon: '⬆️' },
  { label: 'Manual Entry', path: '/manual-entry', icon: '✏️' },
]

const styles = {
  sidebar: {
    width: '220px',
    minHeight: '100vh',
    background: '#1F4E79',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    top: 0,
    left: 0,
    zIndex: 100,
  },
  logo: {
    padding: '20px 16px',
    fontSize: '15px',
    fontWeight: 700,
    borderBottom: '1px solid rgba(255,255,255,0.15)',
    lineHeight: 1.4,
  },
  nav: { padding: '12px 0', flex: 1 },
  link: (active) => ({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '10px 18px',
    fontSize: '13px',
    color: active ? '#fff' : 'rgba(255,255,255,0.75)',
    background: active ? 'rgba(255,255,255,0.15)' : 'transparent',
    borderLeft: active ? '3px solid #fff' : '3px solid transparent',
    transition: 'all 0.15s',
  }),
  section: {
    padding: '8px 18px 4px',
    fontSize: '11px',
    textTransform: 'uppercase',
    letterSpacing: '0.08em',
    color: 'rgba(255,255,255,0.45)',
    marginTop: '8px',
  },
  bottom: {
    padding: '16px 18px',
    borderTop: '1px solid rgba(255,255,255,0.15)',
    fontSize: '12px',
    color: 'rgba(255,255,255,0.6)',
  },
}

export default function Sidebar() {
  const { pathname } = useLocation()
  const { user, logout } = useAuth()

  return (
    <nav style={styles.sidebar}>
      <div style={styles.logo}>🎓 Placement<br />Analytics</div>
      <div style={styles.nav}>
        <div style={styles.section}>Main</div>
        {NAV.map(({ label, path, icon }) => (
          <Link key={path} to={path} style={styles.link(pathname === path)}>
            <span>{icon}</span> {label}
          </Link>
        ))}
        {user?.role === 'admin' && (
          <>
            <div style={styles.section}>Admin</div>
            {ADMIN_NAV.map(({ label, path, icon }) => (
              <Link key={path} to={path} style={styles.link(pathname === path)}>
                <span>{icon}</span> {label}
              </Link>
            ))}
          </>
        )}
      </div>
      <div style={styles.bottom}>
        <div style={{ marginBottom: 4 }}>
          <strong>{user?.username}</strong>
          <span style={{ marginLeft: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 10, padding: '1px 8px', fontSize: 11 }}>
            {user?.role}
          </span>
        </div>
        <button onClick={logout} style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', padding: '5px 12px', borderRadius: 6, fontSize: 12, border: 'none', cursor: 'pointer', marginTop: 4 }}>
          Logout
        </button>
      </div>
    </nav>
  )
}
