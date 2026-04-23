import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Markets from './pages/Markets'
import Tracking from './pages/Tracking'
import Connections from './pages/Connections'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* App Pages */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/connections" element={<Connections />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App