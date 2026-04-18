import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

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
      navigate('/')
    }
  }, [location, navigate])

  const handleJoinRoute = () => {
    toast.success('Route locked! Tracking your journey...')
    setTimeout(() => {
      navigate('/tracking', {
        state: { data: location.state?.data, formData }
      })
    }, 500)
  }

  return (
    <div className="bg-background font-body text-on-surface selection:bg-secondary-container">
      <Navbar />

      <main className="pt-28 pb-20 px-4 sm:px-6 max-w-7xl mx-auto space-y-8 sm:space-y-12">

        {/* Header & Alert */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
          <div className="space-y-2">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary">
              Market Intelligence
            </h1>
            <p className="text-on-surface-variant text-sm sm:text-base max-w-lg">
              Real-time supply chain analysis powered by Vertex AI and BigQuery datasets.
            </p>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-lg bg-error-container/20 border-l-4 border-error w-full md:max-w-md">
            <span className="material-symbols-outlined text-error text-lg flex-shrink-0">warning</span>
            <p className="text-xs sm:text-sm text-on-error-container">
              <span className="font-bold">Price Alert:</span> Mumbai Central is showing unfair pricing (+18% above regional average).
              <span className="font-semibold underline"> Avoid for next 24h.</span>
            </p>
          </div>
        </header>

        {/* Market Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
          {markets.map((market) => (
            <div
              key={market.id}
              className={`bg-surface-container-lowest p-5 sm:p-6 rounded-lg shadow relative overflow-hidden
                ${market.status === 'best' ? 'border-2 border-secondary/20' : ''}
              `}
            >
              <div className="absolute top-0 right-0 p-3 sm:p-4">
                <span className={`text-xs font-bold px-2 sm:px-3 py-1 rounded-full
                  ${market.status === 'unfair' ? 'bg-error-container text-on-error-container' : ''}
                  ${market.status === 'high' ? 'bg-amber-100 text-amber-700' : ''}
                  ${market.status === 'best' ? 'bg-secondary-container text-on-secondary-container' : ''}
                `}>
                  {market.statusLabel}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-headline font-bold text-primary mb-1 pr-20">
                {market.name}
              </h3>

              <div className={`text-2xl sm:text-3xl font-extrabold mb-3 sm:mb-4
                ${market.status === 'best' ? 'text-secondary' : 'text-on-surface'}
              `}>
                ₹{market.price.toLocaleString()}
                <span className="text-xs sm:text-sm font-normal text-on-surface-variant"> / quintal</span>
              </div>

              <div className="flex items-center gap-2 mb-4 sm:mb-6">
                <span className={`material-symbols-outlined text-sm
                  ${market.status === 'unfair' ? 'text-error' : ''}
                  ${market.status === 'high' ? 'text-amber-500' : ''}
                  ${market.status === 'best' ? 'text-secondary' : ''}
                `}>
                  {market.trendDirection === 'up' && 'trending_up'}
                  {market.trendDirection === 'flat' && 'trending_flat'}
                  {market.trendDirection === 'down' && 'trending_down'}
                </span>
                <span className={`text-xs font-medium
                  ${market.status === 'unfair' ? 'text-error' : ''}
                  ${market.status === 'high' ? 'text-amber-600' : ''}
                  ${market.status === 'best' ? 'text-secondary' : ''}
                `}>
                  {market.trend}
                </span>
              </div>

              <div className="mb-4 sm:mb-6 h-10 sm:h-12 w-full">
                <svg className="w-full h-full" viewBox="0 0 200 40">
                  <path
                    d={
                      market.trendDirection === 'up'
                        ? 'M0,35 C20,35 40,30 60,32 C80,34 100,20 120,22 C140,24 160,10 180,8 C190,7 200,5 200,5'
                        : market.trendDirection === 'flat'
                        ? 'M0,20 C20,20 40,18 60,22 C80,26 100,20 120,22 C140,24 160,18 180,18 C190,18 200,20 200,20'
                        : 'M0,5 C20,5 40,15 60,12 C80,9 100,25 120,22 C140,19 160,35 180,38 C190,39 200,40 200,40'
                    }
                    fill="none"
                    stroke={
                      market.status === 'unfair' ? '#ba1a1a'
                        : market.status === 'high' ? '#d97706'
                        : '#006b5f'
                    }
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              {market.status === 'best' ? (
                <button
                  onClick={handleJoinRoute}
                  className="w-full kinetic-gradient text-white py-2.5 sm:py-3 rounded-sm font-bold text-sm tracking-wide shadow hover:scale-[1.02] transition-transform"
                >
                  Execute Trade Now
                </button>
              ) : (
                <div className="bg-surface-container-high p-3 sm:p-4 rounded-sm">
                  <p className="text-xs text-on-surface-variant leading-relaxed">{market.insight}</p>
                </div>
              )}
            </div>
          ))}
        </section>

        {/* Map & Routes */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">

          <div className="lg:col-span-2 space-y-4 sm:space-y-6">

            {/* Map */}
            <div className="relative h-[280px] sm:h-[350px] md:h-[400px] w-full bg-surface-container-high rounded-lg overflow-hidden border-2 border-surface-container shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuzggxas23MKhvKlglgGNI8pFCMUA6V-3VjPdjl7K0mm4gsd99Engl-5Kw8JD7P9CIQJ0_VZI_Wro_a5qOqSuQr5jj5NwDvcqIPz7Wu6rXhtkRVJJvxohy1ZVR5cBN9zPBsPl3guluDeeIqjk7V_2nIek17NcrtWmgpqqJnQoTRDUGjOQN9W0RuL-2eiIlMJuFyXWFKeK6t_TVlAFug0RgDl735DqyyQSFsiaq5uLXXgEeZk26grJrPCQQ1zEOlM5jQ8kPxeEsPq4"
                alt="Map"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute top-4 sm:top-6 left-4 sm:left-6 glass-nav p-3 sm:p-4 rounded-lg shadow-xl border border-white/30 flex items-center gap-3 sm:gap-4">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full kinetic-gradient flex items-center justify-center text-white flex-shrink-0">
                  <span className="material-symbols-outlined text-sm sm:text-base">route</span>
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] uppercase font-bold text-primary tracking-widest leading-none mb-1">
                    Active Shipment
                  </p>
                  <p className="text-xs sm:text-sm font-bold text-on-surface">
                    {formData?.source || 'Pune'} → {formData?.destination || 'Nashik'}
                  </p>
                </div>
              </div>
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary rounded-full animate-pulse border-4 border-white shadow-lg"></div>
              </div>
            </div>

            {/* Route Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              {routes.map((route) => (
                <div
                  key={route.id}
                  className={`p-4 rounded-lg bg-surface-container-lowest relative
                    ${route.recommended ? 'border-2 border-secondary shadow-md' : 'border border-outline-variant/30 opacity-70'}
                  `}
                >
                  {route.recommended && (
                    <span className="absolute -top-2 left-3 text-[9px] sm:text-[10px] font-bold bg-secondary text-white px-2 py-0.5 rounded-full">
                      RECOMMENDED
                    </span>
                  )}
                  <h4 className={`text-sm font-bold mb-2 sm:mb-3 ${route.recommended ? 'text-primary' : 'text-on-surface-variant'}`}>
                    {route.name}
                  </h4>
                  <div className="flex justify-between items-end">
                    <div className="text-lg sm:text-xl font-extrabold">
                      {route.distance}<span className="text-xs font-medium">km</span>
                    </div>
                    <div className="text-right">
                      <p className={`text-xs font-bold ${route.recommended ? 'text-secondary' : 'text-on-surface-variant'}`}>
                        {route.time}
                      </p>
                      <p className="text-xs sm:text-sm font-bold">₹{route.cost.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

          </div>

          {/* Shared Transport */}
          <div className="bg-primary-container p-6 sm:p-8 rounded-lg text-white shadow flex flex-col">
            <div className="flex items-center gap-3 mb-6 sm:mb-8">
              <span className="material-symbols-outlined text-secondary-container">group_add</span>
              <h3 className="text-lg sm:text-xl font-headline font-bold">Shared Transport</h3>
            </div>

            <p className="text-secondary-container text-sm font-medium mb-4 italic">
              "{savings?.coShippers || 3} users going to same destination"
            </p>

            <div className="flex -space-x-3 sm:-space-x-4 mb-6">
              {[1, 2, 3].map((i) => (
                <img
                  key={i}
                  src={`https://i.pravatar.cc/150?img=${i}`}
                  alt={`User ${i}`}
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-primary-container object-cover"
                />
              ))}
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-4 border-primary-container bg-white/20 flex items-center justify-center text-xs font-bold">
                YOU
              </div>
            </div>

            {savings && (
              <div className="bg-white/10 rounded-sm p-4 sm:p-6 space-y-3 sm:space-y-4 mb-6">
                <div className="flex justify-between items-center opacity-70">
                  <span className="text-xs sm:text-sm">Standard Full Cost</span>
                  <span className="text-xs sm:text-sm font-bold">₹{savings.standardCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-secondary-container">
                  <span className="text-xs sm:text-sm font-bold uppercase tracking-wider">Network Savings</span>
                  <span className="text-xs sm:text-sm font-bold">- ₹{savings.networkSavings.toLocaleString()}</span>
                </div>
                <div className="pt-3 sm:pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-base sm:text-lg font-bold">Your share</span>
                  <span className="text-2xl sm:text-3xl font-extrabold text-secondary-container">
                    ₹{savings.yourShare.toLocaleString()}
                  </span>
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 mb-4 bg-secondary/20 p-3 rounded text-secondary-container">
              <span className="material-symbols-outlined text-sm">savings</span>
              <span className="text-xs sm:text-sm font-bold">
                Save ₹{savings?.networkSavings.toLocaleString() || '2,800'} today
              </span>
            </div>

            <button
              onClick={handleJoinRoute}
              className="w-full bg-white text-primary-container py-3 sm:py-4 rounded-sm font-black text-xs sm:text-sm tracking-widest uppercase hover:bg-secondary-container transition-colors mt-auto"
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