import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageBackground from '../components/PageBackground'
import MapView from '../components/MapView'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

function Tracking() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()

  const [formData,       setFormData]       = useState(null)
  const [routes,         setRoutes]         = useState([])
  const [journey,        setJourney]        = useState([])
  const [journeyHistory, setJourneyHistory] = useState([])
  const [loadingHistory, setLoadingHistory] = useState(true)
  const [selectedId,     setSelectedId]     = useState(null)

  const buildSteps = () => {
    const now = new Date()
    const fmt = (d) => d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) + ', ' + d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    const t = (m) => fmt(new Date(now.getTime() - m * 60000))
    return [
      { id: 1, name: 'Request Submitted',     status: 'completed', time: t(12) },
      { id: 2, name: 'Routes Calculated',      status: 'completed', time: t(9) },
      { id: 3, name: 'Market Prices Analyzed', status: 'completed', time: t(5) },
      { id: 4, name: 'Users Matched',          status: 'active',    time: 'IN PROGRESS' },
      { id: 5, name: 'Final Decision Ready',   status: 'pending',   time: 'PENDING' },
    ]
  }

  const loadJourney = (j) => {
    setFormData(j.request || null)
    setRoutes(j.routes || [])
    setJourney(buildSteps())
    setSelectedId(j.id)
  }

  // ── 1. Try location.state first ────────────────────────────────────────────
  useEffect(() => {
    if (location.state?.data) {
      const { data, formData: form } = location.state
      setFormData(form)
      setRoutes(data.routes || [])
      setJourney(buildSteps())
      setSelectedId(data.requestId || null)
    }
  }, [location.state])

  // ── 2. Fetch journey history from Firestore ────────────────────────────────
  useEffect(() => {
    if (!currentUser) return
    const q = query(collection(db, 'journeys'), where('uid', '==', currentUser.uid))
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
      setJourneyHistory(docs)
      setLoadingHistory(false)
      if (!location.state?.data && docs.length > 0 && !selectedId) {
        loadJourney(docs[0])
      }
    }, err => { console.error('[History]', err.message); setLoadingHistory(false) })
    return unsub
  }, [currentUser])

  const bestRoute = routes.find(r => r.recommended) || routes[0]
  const fmtDate   = (ts) => ts?.toDate ? ts.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—'

  // ── Empty State ────────────────────────────────────────────────────────────
  if (!loadingHistory && journeyHistory.length === 0 && !formData) {
    return (
      <div className="min-h-screen text-white font-body relative">
        <PageBackground /><Navbar />
        <main className="pt-40 px-4 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <span className="material-symbols-outlined text-7xl text-[#14B8A6]/40">route</span>
            <h1 className="text-3xl font-headline font-extrabold">Journey Tracking</h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Your journey timeline will appear here after you submit your first route.
            </p>
            <button onClick={() => navigate('/dashboard')} className="px-10 py-4 kinetic-gradient rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
              Start Your First Route →
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (loadingHistory && !formData) {
    return (
      <div className="min-h-screen text-white font-body relative flex items-center justify-center">
        <PageBackground /><Navbar />
        <span className="material-symbols-outlined animate-spin text-4xl text-[#14B8A6]">refresh</span>
      </div>
    )
  }

  return (
    <div className="min-h-screen text-white font-body relative">
      <PageBackground />
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* ── Journey History ── */}
        {journeyHistory.length > 0 && (
          <section className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/40">Journey History</h2>
              <button onClick={() => navigate('/dashboard')} className="text-xs font-black text-[#14B8A6] hover:underline uppercase tracking-wider">+ New Route</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {journeyHistory.map(j => (
                <button key={j.id} onClick={() => loadJourney(j)}
                  className={`flex-shrink-0 p-4 rounded-2xl border text-left transition-all hover:bg-white/10 min-w-[180px] ${
                    selectedId === j.id ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10' : 'border-white/10 bg-white/5'
                  }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${j.status === 'active' ? 'bg-[#14B8A6]' : 'bg-white/20'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">{j.status === 'active' ? 'Active' : 'Completed'}</span>
                  </div>
                  <p className="font-headline font-extrabold text-sm text-white leading-tight">{j.request?.source} → {j.request?.destination}</p>
                  <p className="text-[11px] text-white/50 mt-1">{j.request?.product} · {j.request?.quantity}T</p>
                  <p className="text-[10px] text-white/30 mt-1">{fmtDate(j.createdAt)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Header ── */}
        <header className="mb-10 sm:mb-14">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <span className="text-[#14B8A6] font-bold uppercase tracking-[0.2em] text-xs mb-3 block">Real-time Logistics Monitoring</span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-extrabold tracking-tighter leading-none">Your Journey</h1>
              {formData && (
                <p className="text-white/60 mt-3 text-sm sm:text-base">
                  {formData.source} → {formData.destination} · {formData.product} · {formData.quantity} Tons
                </p>
              )}
            </div>
            <button onClick={() => navigate('/connections', { state: { journeyId: selectedId } })} className="px-6 py-3 rounded-full kinetic-gradient text-white font-bold hover:scale-95 transition-transform flex items-center gap-2 shadow-lg text-sm self-start md:self-auto">
              <span className="material-symbols-outlined text-base">group</span>View Co-Shippers
            </button>
          </div>
        </header>

        {/* ── Timeline ── */}
        <section className="mb-10 sm:mb-12 rounded-2xl p-6 sm:p-10 relative overflow-hidden border border-white/12 bg-white/8 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)]">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#14B8A6]/10 blur-[110px] rounded-full pointer-events-none" />

          {/* Desktop */}
          <div className="hidden sm:block relative">
            <div className="relative flex justify-between items-start w-full px-4">
              <div className="absolute h-[4px] w-[calc(100%-2rem)] bg-white/10 left-4 top-6 z-0 rounded-full" />
              <div className="absolute h-[4px] bg-gradient-to-r from-[#1e3a8a] to-[#14B8A6] left-4 top-6 z-0 rounded-full"
                style={{ width: `${(journey.filter(s => s.status === 'completed').length / (journey.length || 1)) * 100}%` }} />
              {journey.map(step => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 max-w-[120px]">
                  {step.status === 'completed' && (
                    <div className="w-12 h-12 rounded-full kinetic-gradient flex items-center justify-center text-white ring-8 ring-white/10">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="w-14 h-14 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white ring-8 ring-white/10 relative">
                      <div className="absolute inset-0 rounded-full bg-[#14B8A6]/25 animate-ping opacity-30" />
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-12 h-12 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white/55 ring-8 ring-white/10">
                      <span className="material-symbols-outlined text-xl">flag</span>
                    </div>
                  )}
                  <div className="text-center">
                    <p className={`font-headline font-extrabold leading-tight text-xs sm:text-sm ${step.status === 'completed' ? 'text-white' : step.status === 'active' ? 'text-[#14B8A6]' : 'text-white/40'}`}>{step.name}</p>
                    <p className={`text-xs font-bold mt-1 ${step.status === 'active' ? 'text-[#14B8A6]' : 'text-white/50'}`}>{step.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile */}
          <div className="sm:hidden flex flex-col gap-4">
            {journey.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  {step.status === 'completed' && (
                    <div className="w-10 h-10 rounded-full kinetic-gradient flex items-center justify-center text-white flex-shrink-0">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="w-11 h-11 rounded-full bg-white/10 border border-white/15 flex items-center justify-center text-white flex-shrink-0 relative">
                      <div className="absolute inset-0 rounded-full bg-[#14B8A6]/25 animate-ping opacity-30" />
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-10 h-10 rounded-full bg-white/8 border border-white/12 flex items-center justify-center text-white/40 flex-shrink-0">
                      <span className="material-symbols-outlined text-base">flag</span>
                    </div>
                  )}
                  {index < journey.length - 1 && <div className={`w-0.5 h-8 mt-1 rounded-full ${step.status === 'completed' ? 'bg-[#14B8A6]' : 'bg-white/12'}`} />}
                </div>
                <div className="pt-1.5">
                  <p className={`font-headline font-extrabold text-sm leading-tight ${step.status === 'completed' ? 'text-white' : step.status === 'active' ? 'text-[#14B8A6]' : 'text-white/40'}`}>{step.name}</p>
                  <p className={`text-xs font-bold mt-0.5 ${step.status === 'active' ? 'text-[#14B8A6]' : 'text-white/50'}`}>{step.time}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Bottom Grid ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">
          <div className="md:col-span-7 rounded-2xl p-6 sm:p-10 border border-white/12 bg-white/8 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)] flex flex-col gap-5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[#14B8A6]/15 border border-[#14B8A6]/15 flex items-center justify-center">
                <span className="material-symbols-outlined text-[#14B8A6] text-2xl">route</span>
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-headline font-extrabold text-white">Route Details</h3>
                <p className="text-white/50 text-xs">AI-optimized logistics corridor</p>
              </div>
            </div>
            {routes.map(route => (
              <div key={route.id} className={`p-4 sm:p-5 rounded-2xl border ${route.recommended ? 'border-[#14B8A6]/40 bg-[#14B8A6]/5' : 'border-white/10 bg-white/5'}`}>
                <div className="flex justify-between items-center">
                  <div>
                    {route.recommended && <span className="text-[9px] font-black uppercase tracking-widest text-[#14B8A6] bg-[#14B8A6]/10 px-2 py-0.5 rounded-full mb-1 inline-block">Recommended</span>}
                    <p className="font-headline font-extrabold text-white">{route.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-white">{route.distance} km</p>
                    <p className="text-xs text-white/50">{route.time} · ₹{route.cost?.toLocaleString()}</p>
                  </div>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/8 border border-white/12 rounded-2xl p-4 sm:p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Confidence Score</span>
                <p className="text-2xl sm:text-3xl font-headline font-extrabold text-white mt-1">98.4%</p>
              </div>
              <div className="bg-white/8 border border-white/12 rounded-2xl p-4 sm:p-6">
                <span className="text-xs font-bold uppercase tracking-widest text-white/50">Active Nodes</span>
                <p className="text-2xl sm:text-3xl font-headline font-extrabold text-white mt-1">124</p>
              </div>
            </div>
          </div>

          <div className="md:col-span-5 flex flex-col gap-5">
            <div className="rounded-2xl h-64 sm:h-80 overflow-hidden relative border border-white/12 bg-white/6 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)]">
              <MapView start={bestRoute?.start_location} end={bestRoute?.end_location} polylinePoints={bestRoute?.polylinePoints} />
              <div className="absolute inset-0 bg-gradient-to-t from-black/65 to-transparent flex flex-col justify-end p-4 sm:p-6 pointer-events-none">
                <p className="text-xs font-bold uppercase tracking-widest text-white/60">Live Route Preview</p>
                <p className="font-headline font-extrabold text-base">{formData?.source} → {formData?.destination}</p>
              </div>
            </div>
            <button onClick={() => navigate('/connections', { state: { journeyId: selectedId } })} className="w-full py-4 kinetic-gradient text-white font-black rounded-2xl text-sm uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl">
              Connect with Co-Shippers →
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Tracking