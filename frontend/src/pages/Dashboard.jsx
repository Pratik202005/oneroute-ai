import { useEffect, useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import worldmap from '../assets/worldmap.png'

// Animated Counter Component
function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [bounce, setBounce] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !hasStarted) {
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )

    if (ref.current) observer.observe(ref.current)

    return () => {
      if (ref.current) observer.unobserve(ref.current)
    }
  }, [hasStarted])

  useEffect(() => {
    if (!hasStarted) return

    let startTime = null
    let animationFrame

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const percentage = Math.min(progress / duration, 1)

      // Ease out cubic for smooth deceleration
      const eased = 1 - Math.pow(1 - percentage, 3)
      const current = Math.floor(eased * target)

      setCount(current)

      if (percentage < 1) {
        animationFrame = requestAnimationFrame(animate)
      } else {
        setCount(target)
        // Trigger bounce when counting ends
        setBounce(true)
        setTimeout(() => setBounce(false), 600)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(animationFrame)
  }, [hasStarted, target, duration])

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-xl font-headline font-extrabold text-secondary transition-transform duration-300 ${
          bounce ? 'scale-125' : 'scale-100'
        }`}
      >
        {prefix}{count}{suffix}
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    product: '',
    quantity: '',
    source: '',
    destination: '',
    time: ''
  })

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    navigate('/markets')
  }

  return (
    <div className="bg-background font-body text-on-background selection:bg-secondary-container">
      <Navbar />

      {/* Main Content */}
      <main className="min-h-screen pt-32 pb-20 px-6 lg:px-12 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

        {/* Left Column: Hero Branding */}
        <div className="lg:col-span-5 flex flex-col space-y-8">
          <div className="space-y-4">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-secondary-container/10 border border-secondary/10">
              <span
                className="material-symbols-outlined text-secondary text-sm"
                style={{ fontVariationSettings: "'FILL' 1" }}
              >
                auto_awesome
              </span>
              <span className="text-secondary text-xs font-bold uppercase tracking-widest">
                Global Logistics Intelligence
              </span>
            </div>

            {/* Hero Text */}
            <h1 className="text-6xl lg:text-7xl font-headline font-extrabold tracking-tight text-primary leading-[1.1]">
              Smart Routes.
              <br />
              <span className="bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent">
                Fair Prices.
              </span>
            </h1>

            <p className="text-xl text-on-surface-variant max-w-md font-body leading-relaxed">
              Shared Future. Master the complexity of global trade with our AI-orchestrated command center.
            </p>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-6 rounded-lg bg-surface-container-low flex flex-col gap-3 transition-all hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">savings</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-primary">Cut transport costs</h3>
                <p className="text-sm text-on-surface-variant">
                  Real-time carrier bidding and consolidation logic.
                </p>
              </div>
            </div>

            <div className="p-6 rounded-lg bg-surface-container-low flex flex-col gap-3 transition-all hover:bg-surface-container">
              <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-secondary">analytics</span>
              </div>
              <div>
                <h3 className="font-headline font-bold text-primary">Find best market</h3>
                <p className="text-sm text-on-surface-variant">
                  Predictive demand mapping across 50+ global hubs.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Floating Form */}
        <div className="lg:col-span-7 flex justify-center lg:justify-end">
          <div className="w-full max-w-xl glass-morphism p-8 lg:p-12 rounded-lg shadow-[0px_32px_64px_rgba(0,35,111,0.12)] relative overflow-hidden">

            {/* Decorative blur */}
            <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/5 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-8">

              {/* Form Header */}
              <header>
                <h2 className="text-2xl font-headline font-extrabold text-primary">
                  Initiate New Route
                </h2>
                <p className="text-on-surface-variant font-label text-sm">
                  Fill in the logistics parameters to begin optimization.
                </p>
              </header>

              {/* Form */}
              <form className="space-y-6" onSubmit={handleSubmit}>

                {/* Product + Quantity */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Product Name
                    </label>
                    <input
                      type="text"
                      name="product"
                      value={formData.product}
                      onChange={handleChange}
                      placeholder="e.g. Rice"
                      className="w-full h-14 px-5 rounded-sm bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                      Quantity (Tons)
                    </label>
                    <input
                      type="number"
                      name="quantity"
                      value={formData.quantity}
                      onChange={handleChange}
                      placeholder="500"
                      className="w-full h-14 px-5 rounded-sm bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface outline-none"
                    />
                  </div>
                </div>

                {/* Source */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Source Location
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-4 text-outline text-lg">
                      location_on
                    </span>
                    <input
                      type="text"
                      name="source"
                      value={formData.source}
                      onChange={handleChange}
                      placeholder="Search Google Places..."
                      className="w-full h-14 pl-12 pr-5 rounded-sm bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface outline-none"
                    />
                  </div>
                </div>

                {/* Destination */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Destination
                  </label>
                  <div className="relative">
                    <span className="material-symbols-outlined absolute left-4 top-4 text-outline text-lg">
                      near_me
                    </span>
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleChange}
                      placeholder="Search Google Places..."
                      className="w-full h-14 pl-12 pr-5 rounded-sm bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface outline-none"
                    />
                  </div>
                </div>

                {/* Preferred Time */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-on-surface-variant">
                    Preferred Time
                  </label>
                  <input
                    type="datetime-local"
                    name="time"
                    value={formData.time}
                    onChange={handleChange}
                    className="w-full h-14 px-5 rounded-sm bg-surface-container-high border-none focus:ring-0 focus:bg-surface-container-lowest transition-all duration-300 text-on-surface outline-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full h-16 kinetic-gradient text-white font-headline font-extrabold rounded-sm shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                >
                  Find Best Route & Market
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>

              {/* Animated Stats */}
              <div className="pt-8 border-t border-outline-variant/10 grid grid-cols-3 gap-4">

                {/* Routes Optimized */}
                <div className="text-center">
                  <AnimatedCounter
                    target={10}
                    suffix="K+"
                    duration={1800}
                  />
                  <div className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant mt-1">
                    Routes Optimized
                  </div>
                </div>

                {/* Saved */}
                <div className="text-center">
                  <AnimatedCounter
                    target={2}
                    prefix="₹"
                    suffix="M+"
                    duration={1200}
                  />
                  <div className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant mt-1">
                    Saved
                  </div>
                </div>

                {/* Users Connected */}
                <div className="text-center">
                  <AnimatedCounter
                    target={500}
                    suffix="+"
                    duration={2200}
                  />
                  <div className="text-[10px] font-label uppercase tracking-tighter text-on-surface-variant mt-1">
                    Users Connected
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Background Map Image */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <img
          src={worldmap}
          alt="world map background"
          className="w-full h-full object-cover opacity-10 grayscale"
        />
      </div>

      <Footer />
    </div>
  )
}

export default Dashboard