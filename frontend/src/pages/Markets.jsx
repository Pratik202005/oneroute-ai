import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageBackground from '../components/PageBackground'
import MapView from '../components/MapView'

function Markets() {
  const location = useLocation()
  const navigate = useNavigate()

  const [markets, setMarkets] = useState([])
  const [routes, setRoutes] = useState([])
  const [savings, setSavings] = useState(null)
  const [formData, setFormData] = useState(null)

  useEffect(() => {
    if (location.state?.data) {
      const { data, formData: form } = location.state
      setMarkets(data.markets || [])
      setRoutes(data.routes || [])
      setSavings(data.savings || null)
      setFormData(form)
    } else {
      navigate('/') // keep your original behavior
    }
  }, [location, navigate])

  const handleJoinRoute = () => {
    toast.success('Route locked! Tracking your journey...')
    setTimeout(() => {
      navigate('/tracking', {
        state: { data: location.state?.data, formData },
      })
    }, 500)
  }

  return (
    <div className="min-h-screen text-white font-body relative">
      {/* Full aurora background (same as Landing/Dashboard) */}
      <PageBackground />

      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12">
        {/* Header + Alert */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight">
              Market Intelligence
            </h1>
            <p className="text-white/70 text-sm sm:text-base max-w-lg">
              Real-time supply chain analysis powered by Vertex AI and BigQuery datasets.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl bg-red-500/10 border border-red-400/20 w-full md:max-w-md backdrop-blur-xl">
            <span className="material-symbols-outlined text-red-200 text-lg flex-shrink-0">
              warning
            </span>
            <p className="text-xs sm:text-sm text-red-100/90 leading-relaxed">
              <span className="font-extrabold">Price Alert:</span> Mumbai Central is showing unfair pricing (+18% above regional average).
              <span className="font-semibold underline"> Avoid for next 24h.</span>
            </p>
          </div>
        </header>

        {/* Market Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {markets.map((market) => {
            const isBest = market.status === 'best'
            const isUnfair = market.status === 'unfair'
            const isHigh = market.status === 'high'

            const badgeClass = isUnfair
              ? 'bg-red-500/15 text-red-100 border border-red-400/20'
              : isHigh
              ? 'bg-amber-500/15 text-amber-100 border border-amber-400/20'
              : 'bg-emerald-500/15 text-emerald-100 border border-emerald-400/20'

            const priceClass = isBest ? 'text-[#14B8A6]' : 'text-white'

            const strokeColor = isUnfair ? '#ff6b6b' : isHigh ? '#f59e0b' : '#14B8A6'

            return (
              <div
                key={market.id}
                className={`relative overflow-hidden rounded-2xl border backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)]
                  ${isBest ? 'bg-white/10 border-white/18' : 'bg-white/8 border-white/12'}
                `}
              >
                <div className="absolute top-0 right-0 p-3 sm:p-4">
                  <span className={`text-xs font-extrabold px-2 sm:px-3 py-1 rounded-full ${badgeClass}`}>
                    {market.statusLabel}
                  </span>
                </div>

                <div className="p-5 sm:p-6">
                  <h3 className="text-base sm:text-lg font-headline font-extrabold mb-1 pr-20">
                    {market.name}
                  </h3>

                  <div className={`text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4 ${priceClass}`}>
                    ₹{market.price.toLocaleString()}
                    <span className="text-xs sm:text-sm font-normal text-white/60"> / quintal</span>
                  </div>

                  <div className="flex items-center gap-2 mb-4 sm:mb-6">
                    <span className="material-symbols-outlined text-sm text-white/80">
                      {market.trendDirection === 'up' && 'trending_up'}
                      {market.trendDirection === 'flat' && 'trending_flat'}
                      {market.trendDirection === 'down' && 'trending_down'}
                    </span>
                    <span className="text-xs font-bold text-white/75">{market.trend}</span>
                  </div>

                  <div className="mb-4 sm:mb-6 h-10 sm:h-12 w-full">
                    <svg className="w-full h-full" viewBox="0 0 200 40" preserveAspectRatio="none">
                      <path
                        className="draw-line"
                        d={
                          market.trendDirection === 'up'
                            ? 'M0,35 C20,35 40,30 60,32 C80,34 100,20 120,22 C140,24 160,10 180,8 C190,7 200,5 200,5'
                            : market.trendDirection === 'flat'
                            ? 'M0,20 C20,20 40,18 60,22 C80,26 100,20 120,22 C140,24 160,18 180,18 C190,18 200,20 200,20'
                            : 'M0,5 C20,5 40,15 60,12 C80,9 100,25 120,22 C140,19 160,35 180,38 C190,39 200,40 200,40'
                        }
                        fill="none"
                        stroke={strokeColor}
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>

                  {isBest ? (
                    <button
                      onClick={handleJoinRoute}
                      className="w-full kinetic-gradient text-white py-2.5 sm:py-3 rounded-xl font-black text-sm tracking-wide shadow hover:scale-[1.02] transition-transform"
                    >
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

        {/* Map + Routes + Shared */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Left: Map + Route cards */}
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            {/* Map */}
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full rounded-2xl overflow-hidden border border-white/12 bg-white/6 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)]">
              <MapView 
                start={routes.find(r => r.recommended)?.start_location || routes[0]?.start_location}
                end={routes.find(r => r.recommended)?.end_location || routes[0]?.end_location}
                polylinePoints={routes.find(r => r.recommended)?.polylinePoints || routes[0]?.polylinePoints}
              />

              {/* Floating chip (dark-glass) */}
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 rounded-2xl border border-white/15 bg-white/10 backdrop-blur-xl p-3 sm:p-4 shadow-xl flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full kinetic-gradient flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-sm sm:text-base">route</span>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-extrabold text-white/70 tracking-widest leading-none mb-1">
                    Active Shipment
                  </p>
                  <p className="text-xs sm:text-sm font-extrabold text-white">
                    {formData?.source || 'Pune'} → {formData?.destination || 'Nashik'}
                  </p>
                </div>
              </div>

              {/* Pulse pin */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-4 h-4 bg-[#14B8A6] rounded-full animate-pulse border-4 border-white/80 shadow-lg" />
              </div>
            </div>

            {/* Route cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={`p-4 rounded-2xl border backdrop-blur-2xl shadow-[0px_20px_60px_rgba(0,0,0,0.30)] relative
                    ${route.recommended ? 'bg-white/10 border-white/18' : 'bg-white/8 border-white/12 opacity-90'}
                  `}
                >
                  {route.recommended && (
                    <span className="absolute -top-2 left-3 text-[9px] sm:text-[10px] font-extrabold bg-[#14B8A6] text-[#001142] px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </span>
                  )}

                  <h4 className={`text-sm font-extrabold mb-2 sm:mb-3 ${route.recommended ? 'text-white' : 'text-white/75'}`}>
                    {route.name}
                  </h4>

                  <div className="flex justify-between items-end">
                    <div className="text-lg sm:text-xl font-extrabold text-white">
                      {route.distance}
                      <span className="text-xs font-medium text-white/60">km</span>
                    </div>

                    <div className="text-right">
                      <p className={`text-xs font-extrabold ${route.recommended ? 'text-[#14B8A6]' : 'text-white/65'}`}>
                        {route.time}
                      </p>
                      <p className="text-xs sm:text-sm font-extrabold text-white">
                        ₹{route.cost.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Shared Transport */}
          <div className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-2xl shadow-[0px_28px_80px_rgba(0,0,0,0.35)] p-6 sm:p-8 flex flex-col">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="material-symbols-outlined text-[#14B8A6]">group_add</span>
              <h3 className="text-lg sm:text-xl font-headline font-extrabold text-white">
                Shared Transport
              </h3>
            </div>

            <p className="text-white/70 text-sm font-semibold mb-4 italic">
              "{savings?.coShippers || 3} users going to same destination"
            </p>

            <div className="flex -space-x-3 sm:-space-x-4 mb-6">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/150?img=${i}`}
                  alt={`User ${i}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white/10 object-cover"
                />
              ))}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-white/10 bg-white/10 flex items-center justify-center text-xs font-black text-white">
                YOU
              </div>
            </div>

            {savings && (
              <div className="bg-white/8 border border-white/12 rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 mb-6">
                <div className="flex justify-between items-center text-white/70">
                  <span className="text-xs sm:text-sm">Standard Full Cost</span>
                  <span className="text-xs sm:text-sm font-extrabold">₹{savings.standardCost.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-center text-[#14B8A6]">
                  <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider">Network Savings</span>
                  <span className="text-xs sm:text-sm font-extrabold">- ₹{savings.networkSavings.toLocaleString()}</span>
                </div>

                <div className="pt-3 sm:pt-4 border-t border-white/10 flex justify-between items-center">
                  <span className="text-base sm:text-lg font-extrabold text-white">Your share</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-[#14B8A6]">
                    ₹{savings.yourShare.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 bg-[#14B8A6]/12 border border-[#14B8A6]/18 p-3 rounded-xl text-[#bffdf4]">
              <span className="material-symbols-outlined text-sm">savings</span>
              <span className="text-xs sm:text-sm font-extrabold">
                Save ₹{savings?.networkSavings.toLocaleString() || '2,800'} today
              </span>
            </div>

            <button
              onClick={handleJoinRoute}
              className="w-full kinetic-gradient text-white py-3 sm:py-4 rounded-xl font-black text-xs sm:text-sm tracking-widest uppercase hover:scale-[1.01] active:scale-[0.99] transition-transform mt-auto"
            >
              Join Route & Lock Price
            </button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}

export default Markets