import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageBackground from '../components/PageBackground'
import MapView from '../components/MapView'
import { db } from '../firebase'
import { collection, onSnapshot, query, where } from 'firebase/firestore'
import { useAuth } from '../context/AuthContext'

function Markets() {
  const location  = useLocation()
  const navigate  = useNavigate()
  const { currentUser } = useAuth()

  const [markets,            setMarkets]           = useState([])
  const [routes,             setRoutes]            = useState([])
  const [savings,            setSavings]           = useState(null)
  const [formData,           setFormData]          = useState(null)
  const [marketIntelligence, setMarketIntelligence] = useState(null)
  const [journeyHistory,     setJourneyHistory]    = useState([])
  const [coShippers,         setCoShippers]        = useState([])
  const [loadingHistory,     setLoadingHistory]    = useState(true)
  const [selectedId,         setSelectedId]        = useState(null)

  // ── Helper: load a journey document into page state ────────────────────────
  const loadJourney = (j) => {
    setMarkets(j.markets || [])
    setRoutes(j.routes   || [])
    setSavings(j.savings || null)
    setFormData(j.request || null)
    setMarketIntelligence(j.marketIntelligence || null)
    setSelectedId(j.id)
  }

  // ── 1. Try location.state first (fresh navigation from Dashboard) ──────────
  useEffect(() => {
    if (location.state?.data) {
      const { data, formData: form } = location.state
      setMarkets(data.markets || [])
      setRoutes(data.routes   || [])
      setSavings(data.savings || null)
      setFormData(form)
      setMarketIntelligence(data.marketIntelligence || null)
      setSelectedId(data.requestId || null)
    }
  }, [location.state])

  // ── 2. Fetch user's journey history from Firestore ─────────────────────────
  useEffect(() => {
    if (!currentUser) return
    const q = query(collection(db, 'journeys'), where('uid', '==', currentUser.uid))
    const unsub = onSnapshot(q, snap => {
      const docs = snap.docs.map(d => ({ id: d.id, ...d.data() }))
      docs.sort((a, b) => (b.createdAt?.toMillis() || 0) - (a.createdAt?.toMillis() || 0))
      setJourneyHistory(docs)
      setLoadingHistory(false)

      // If no data loaded from location.state, auto-load the latest journey
      if (!location.state?.data && docs.length > 0 && !selectedId) {
        loadJourney(docs[0])
      }
    }, err => {
      console.error('[History]', err.message)
      setLoadingHistory(false)
    })
    return unsub
  }, [currentUser])

  // ── 3. Real-time co-shippers on same route ─────────────────────────────────
  // Use normalizedSource/Destination from the SELECTED journey doc (not formData)
  // This guarantees correct matching regardless of casing.
  useEffect(() => {
    if (!currentUser || !selectedId) return

    const selectedJourney = journeyHistory.find(j => j.id === selectedId)
    if (!selectedJourney) return

    const normSrc  = selectedJourney.normalizedSource  || (selectedJourney.request?.source  || '').toLowerCase().trim()
    const normDest = selectedJourney.normalizedDestination || (selectedJourney.request?.destination || '').toLowerCase().trim()
    if (!normSrc || !normDest) return

    const q = query(collection(db, 'journeys'), where('status', '==', 'active'))
    const unsub = onSnapshot(q, snap => {
      const shippers = snap.docs
        .map(d => ({ id: d.id, ...d.data() }))
        .filter(j => {
          if (j.uid === currentUser.uid) return false
          const jSrc  = j.normalizedSource  || j.request?.source?.toLowerCase().trim()
          const jDest = j.normalizedDestination || j.request?.destination?.toLowerCase().trim()
          return jSrc === normSrc && jDest === normDest
        })
      const userMap = {}
      shippers.forEach(j => {
        if (!userMap[j.uid] || (j.createdAt?.toMillis() || 0) > (userMap[j.uid].createdAt?.toMillis() || 0)) {
          userMap[j.uid] = j
        }
      })
      setCoShippers(Object.values(userMap))
    })
    return unsub
  }, [selectedId, journeyHistory, currentUser])

  const handleJoinRoute = () => {
    toast.success('Route locked! Tracking your journey...')
    setTimeout(() => navigate('/tracking', { state: { data: { markets, routes, savings, marketIntelligence }, formData, journeyId: selectedId } }), 500)
  }

  // Navigate to Connections for the selected journey
  const handleGoToConnections = () => {
    navigate('/connections', { state: { journeyId: selectedId } })
  }

  const fmtDate = (ts) => ts?.toDate ? ts.toDate().toLocaleDateString([], { month: 'short', day: 'numeric' }) : '—'

  // ── EMPTY STATE — new user with no journeys ────────────────────────────────
  if (!loadingHistory && journeyHistory.length === 0 && !formData) {
    return (
      <div className="min-h-screen text-white font-body relative">
        <PageBackground /><Navbar />
        <main className="pt-40 px-4 text-center">
          <div className="max-w-lg mx-auto space-y-6">
            <span className="material-symbols-outlined text-7xl text-[#14B8A6]/40">storefront</span>
            <h1 className="text-3xl font-headline font-extrabold">Market Intelligence</h1>
            <p className="text-white/50 text-lg leading-relaxed">
              Submit your first route on the Dashboard to see real-time market prices, AI-powered recommendations, and cost savings.
            </p>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-10 py-4 kinetic-gradient rounded-2xl font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl"
            >
              Start Your First Route →
            </button>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  // ── LOADING ────────────────────────────────────────────────────────────────
  if (loadingHistory && !formData) {
    return (
      <div className="min-h-screen text-white font-body relative flex items-center justify-center">
        <PageBackground /><Navbar />
        <span className="material-symbols-outlined animate-spin text-4xl text-[#14B8A6]">refresh</span>
      </div>
    )
  }

  const bestRoute = routes.find(r => r.recommended) || routes[0]

  return (
    <div className="min-h-screen text-white font-body relative">
      <PageBackground />
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-10">

        {/* ── Journey History Carousel ── */}
        {journeyHistory.length > 0 && (
          <section>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xs font-black uppercase tracking-[0.25em] text-white/40">Journey History</h2>
              <button onClick={() => navigate('/dashboard')} className="text-xs font-black text-[#14B8A6] hover:underline uppercase tracking-wider">+ New Route</button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar">
              {journeyHistory.map(j => (
                <button
                  key={j.id}
                  onClick={() => loadJourney(j)}
                  className={`flex-shrink-0 p-4 rounded-2xl border text-left transition-all hover:bg-white/10 min-w-[180px] ${
                    selectedId === j.id
                      ? 'border-[#14B8A6]/50 bg-[#14B8A6]/10'
                      : 'border-white/10 bg-white/5'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${j.status === 'active' ? 'bg-[#14B8A6]' : 'bg-white/20'}`} />
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">
                      {j.status === 'active' ? 'Active' : 'Completed'}
                    </span>
                  </div>
                  <p className="font-headline font-extrabold text-sm text-white leading-tight">
                    {j.request?.source} → {j.request?.destination}
                  </p>
                  <p className="text-[11px] text-white/50 mt-1">{j.request?.product} · {j.request?.quantity}T</p>
                  <p className="text-[10px] text-white/30 mt-1">{fmtDate(j.createdAt)}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* ── Header + Alert ── */}
        {formData && (
          <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight">Market Intelligence</h1>
              <p className="text-white/60 text-sm">
                {formData.source} → {formData.destination} · {formData.product} · {formData.quantity} Tons
              </p>
            </div>
            {marketIntelligence && (
              <div className={`flex items-start gap-3 p-4 rounded-2xl border w-full md:max-w-md backdrop-blur-xl ${
                marketIntelligence.color === 'red'    ? 'bg-red-500/10 border-red-400/20 text-red-100/90' :
                marketIntelligence.color === 'orange' ? 'bg-orange-500/10 border-orange-400/20 text-orange-100/90' :
                marketIntelligence.color === 'yellow' ? 'bg-yellow-500/10 border-yellow-400/20 text-yellow-100/90' :
                marketIntelligence.color === 'green'  ? 'bg-green-500/10 border-green-400/20 text-green-100/90' :
                'bg-blue-500/10 border-blue-400/20 text-blue-100/90'
              }`}>
                <span className={`material-symbols-outlined text-lg flex-shrink-0 ${
                  marketIntelligence.color === 'red' || marketIntelligence.color === 'orange' ? 'text-orange-200' : 'text-blue-200'
                }`}>
                  {marketIntelligence.color === 'red' || marketIntelligence.color === 'orange' ? 'warning' : 'info'}
                </span>
                <p className="text-xs sm:text-sm leading-relaxed">
                  <span className="font-extrabold">{marketIntelligence.verdict}:</span> {marketIntelligence.summary}
                </p>
              </div>
            )}
          </header>
        )}

        {/* ── Market Cards ── */}
        {markets.length > 0 && (
          <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {markets.map(market => {
              const isBest   = market.status === 'best'
              const isUnfair = market.status === 'unfair'
              const isHigh   = market.status === 'high'
              const badgeClass = isUnfair ? 'bg-red-500/15 text-red-100 border border-red-400/20'
                : isHigh ? 'bg-amber-500/15 text-amber-100 border border-amber-400/20'
                : 'bg-emerald-500/15 text-emerald-100 border border-emerald-400/20'
              const strokeColor = isUnfair ? '#ff6b6b' : isHigh ? '#f59e0b' : '#14B8A6'
              return (
                <div key={market.id} className={`relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)] ${isBest ? 'bg-white/10 border-white/18' : 'bg-white/8 border-white/12'}`}>
                  <div className="absolute top-0 right-0 p-3 sm:p-4">
                    <span className={`text-xs font-extrabold px-2 sm:px-3 py-1 rounded-full ${badgeClass}`}>{market.statusLabel}</span>
                  </div>
                  <div className="p-5 sm:p-6">
                    <h3 className="text-base sm:text-lg font-headline font-extrabold mb-1 pr-20">{market.name}</h3>
                    <div className={`text-2xl sm:text-3xl font-extrabold mb-3 ${isBest ? 'text-[#14B8A6]' : 'text-white'}`}>
                      ₹{market.price.toLocaleString()}<span className="text-xs font-normal text-white/60"> / quintal</span>
                    </div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="material-symbols-outlined text-sm text-white/80">
                        {market.trendDirection === 'up' ? 'trending_up' : market.trendDirection === 'flat' ? 'trending_flat' : 'trending_down'}
                      </span>
                      <span className="text-xs font-bold text-white/75">{market.trend}</span>
                    </div>
                    <div className="mb-4 sm:mb-6 h-10 sm:h-12 w-full">
                      <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                        <path className="draw-line"
                          d={market.trendDirection === 'up'
                            ? 'M0,35 C20,35 40,30 60,32 C80,34 100,20 120,22 C140,24 160,10 180,8 C190,7 200,5 200,5'
                            : market.trendDirection === 'flat'
                            ? 'M0,20 C20,20 40,18 60,22 C80,26 100,20 120,22 C140,24 160,18 180,18 C190,18 200,20 200,20'
                            : 'M0,5 C20,5 40,15 60,12 C80,9 100,25 120,22 C140,19 160,35 180,38 C190,39 200,40 200,40'}
                          fill="none" stroke={strokeColor} strokeWidth="2.2" strokeLinecap="round" />
                      </svg>
                    </div>
                    {isBest ? (
                      <button onClick={handleJoinRoute} className="w-full kinetic-gradient text-white py-2.5 sm:py-3 rounded-xl font-black text-sm hover:scale-[1.02] transition-transform">
                        Execute Trade Now
                      </button>
                    ) : (
                      <div className="rounded-xl border border-white/10 bg-white/6 p-3 sm:p-4">
                        <p className="text-xs text-white/70 leading-relaxed">{market.insight}</p>
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </section>
        )}

        {/* ── Map + Routes + Shared Transport ── */}
        {(routes.length > 0 || savings) && (
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
            {/* Map + Route cards */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              <div className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-white/12 bg-white/6 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)]">
                <MapView
                  start={routes.find(r => r.recommended)?.start_location || routes[0]?.start_location}
                  end={routes.find(r => r.recommended)?.end_location || routes[0]?.end_location}
                  polylinePoints={routes.find(r => r.recommended)?.polylinePoints || routes[0]?.polylinePoints}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                {routes.map(route => (
                  <div key={route.id} className={`p-4 rounded-2xl border backdrop-blur-2xl relative ${route.recommended ? 'bg-white/10 border-white/18' : 'bg-white/8 border-white/12 opacity-90'}`}>
                    {route.recommended && <span className="absolute -top-2 left-3 text-[9px] font-extrabold bg-[#14B8A6] text-[#001142] px-2 py-0.5 rounded-full">RECOMMENDED</span>}
                    <h4 className={`text-sm font-extrabold mb-2 ${route.recommended ? 'text-white' : 'text-white/75'}`}>{route.name}</h4>
                    <div className="flex justify-between items-end">
                      <div className="text-lg sm:text-xl font-extrabold text-white">{route.distance}<span className="text-xs font-medium text-white/60">km</span></div>
                      <div className="text-right">
                        <p className={`text-xs font-extrabold ${route.recommended ? 'text-[#14B8A6]' : 'text-white/65'}`}>{route.time}</p>
                        <p className="text-xs sm:text-sm font-extrabold text-white">₹{route.cost?.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shared Transport — REAL co-shippers */}
            <div className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)] p-6 sm:p-8 flex flex-col">
              <div className="flex items-center gap-3 mb-6">
                <span className="material-symbols-outlined text-[#14B8A6]">group_add</span>
                <h3 className="text-lg sm:text-xl font-headline font-extrabold text-white">Shared Transport</h3>
                {coShippers.length > 0 && (
                  <span className="ml-auto text-[10px] font-black uppercase bg-[#14B8A6]/15 text-[#14B8A6] px-2 py-1 rounded-full border border-[#14B8A6]/20">
                    {coShippers.length} Live
                  </span>
                )}
              </div>

              {coShippers.length > 0 ? (
                <>
                  <p className="text-white/60 text-sm font-medium mb-4 italic">
                    "{coShippers.length} shipper{coShippers.length !== 1 ? 's' : ''} going to same destination right now"
                  </p>
                  <div className="space-y-3 mb-6">
                    {coShippers.slice(0, 4).map(cs => (
                      <div key={cs.uid} className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/10">
                        {cs.userPhoto
                          ? <img src={cs.userPhoto} className="w-9 h-9 rounded-full border border-white/10" alt={cs.userName} />
                          : <div className="w-9 h-9 rounded-full bg-[#14B8A6]/20 flex items-center justify-center text-sm font-black text-[#14B8A6]">{cs.userName?.charAt(0)}</div>
                        }
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-white truncate">{cs.userName}</p>
                          <p className="text-[10px] text-white/40 uppercase tracking-widest">{cs.request?.product} · {cs.request?.quantity}T</p>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-[#14B8A6] flex-shrink-0" />
                      </div>
                    ))}
                    {coShippers.length > 4 && (
                      <p className="text-xs text-white/30 text-center">+{coShippers.length - 4} more on this route</p>
                    )}
                  </div>
                </>
              ) : (
                <>
                  <p className="text-white/60 text-sm font-medium mb-4 italic">
                    "No co-shippers on this route yet — you could be the first!"
                  </p>
                  <div className="flex -space-x-3 sm:-space-x-4 mb-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white/10 bg-white/10 flex items-center justify-center text-white/20">
                        <span className="material-symbols-outlined text-sm">person</span>
                      </div>
                    ))}
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white/10 bg-[#14B8A6]/20 flex items-center justify-center text-xs font-black text-[#14B8A6]">YOU</div>
                  </div>
                </>
              )}

              {savings && (
                <div className="bg-white/8 border border-white/12 rounded-2xl p-4 sm:p-6 space-y-3 mb-6">
                  <div className="flex justify-between items-center text-white/70">
                    <span className="text-xs sm:text-sm">Standard Full Cost</span>
                    <span className="text-xs sm:text-sm font-extrabold">₹{savings.standardCost?.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-[#14B8A6]">
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Network Savings</span>
                    <span className="text-xs sm:text-sm font-extrabold">- ₹{savings.networkSavings?.toLocaleString()}</span>
                  </div>
                  <div className="pt-3 sm:pt-4 border-t border-white/10 flex justify-between items-center">
                    <span className="text-base sm:text-lg font-extrabold text-white">Your share</span>
                    <span className="text-2xl sm:text-3xl font-extrabold text-[#14B8A6]">₹{savings.yourShare?.toLocaleString()}</span>
                  </div>
                </div>
              )}

              <div className="flex flex-col gap-3 mt-auto pt-2">
                <button onClick={handleJoinRoute} className="w-full kinetic-gradient text-white py-3 sm:py-4 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-transform">
                  Join Route &amp; Lock Price
                </button>
                <button onClick={handleGoToConnections} className="w-full bg-white/10 border border-white/15 text-white py-3 sm:py-4 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase hover:bg-white/15 active:scale-[0.99] transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[#14B8A6] text-base">sensors</span>
                  Chat with Co-Shippers
                </button>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  )
}

export default Markets