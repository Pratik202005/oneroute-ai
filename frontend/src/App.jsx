import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ToastProvider from './components/ToastProvider.jsx'

import Dashboard from './pages/Dashboard.jsx'
import Markets from './pages/Markets.jsx'
import Tracking from './pages/Tracking.jsx'
import Connections from './pages/Connections.jsx'

function App() {
  return (
    <BrowserRouter>
      <ToastProvider />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="/connections" element={<Connections />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App