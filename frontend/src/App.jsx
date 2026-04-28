import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Markets from './pages/Markets'
import Tracking from './pages/Tracking'
import Connections from './pages/Connections'
import { AuthProvider, useAuth } from './context/AuthContext'
import { usePresence } from './hooks/usePresence'

const ProtectedRoute = ({ children }) => {
  const { currentUser } = useAuth()
  if (!currentUser) return <Navigate to="/login" replace />
  return children
}

// Activates presence tracking for any logged-in user
function PresenceManager() {
  usePresence()
  return null
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <PresenceManager />
        <Routes>
          {/* Public */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />

          {/* App Pages */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/markets"   element={<ProtectedRoute><Markets /></ProtectedRoute>} />
          <Route path="/tracking"  element={<ProtectedRoute><Tracking /></ProtectedRoute>} />
          <Route path="/connections" element={<ProtectedRoute><Connections /></ProtectedRoute>} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App