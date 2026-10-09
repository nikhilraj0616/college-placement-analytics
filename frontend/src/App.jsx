import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import PlacementRate from './pages/PlacementRate'
import SalaryAnalysis from './pages/SalaryAnalysis'
import BranchAnalysis from './pages/BranchAnalysis'
import CGPACorrelation from './pages/CGPACorrelation'
import RecruitmentTrends from './pages/RecruitmentTrends'
import DataUpload from './pages/DataUpload'
import ManualEntry from './pages/ManualEntry'

function Layout({ children }) {
  return (
    <div style={{ display: 'flex' }}>
      <Sidebar />
      <main style={{
        marginLeft: '220px',
        padding: '28px 32px',
        flex: 1,
        minHeight: '100vh',
        maxWidth: 'calc(100vw - 220px)',
      }}>
        {children}
      </main>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />

          <Route path="/" element={
            <ProtectedRoute>
              <Layout><Dashboard /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/placement-rate" element={
            <ProtectedRoute>
              <Layout><PlacementRate /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/salary" element={
            <ProtectedRoute>
              <Layout><SalaryAnalysis /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/branch" element={
            <ProtectedRoute>
              <Layout><BranchAnalysis /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/cgpa" element={
            <ProtectedRoute>
              <Layout><CGPACorrelation /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/trends" element={
            <ProtectedRoute>
              <Layout><RecruitmentTrends /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/upload" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><DataUpload /></Layout>
            </ProtectedRoute>
          } />

          <Route path="/manual-entry" element={
            <ProtectedRoute roles={['admin']}>
              <Layout><ManualEntry /></Layout>
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}
