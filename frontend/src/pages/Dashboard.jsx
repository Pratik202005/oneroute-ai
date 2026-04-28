import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import PageBackground from '../components/PageBackground'
import { processRequest } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { db } from '../firebase'
import { doc, setDoc, serverTimestamp } from 'firebase/firestore'

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [bounce, setBounce] = useState(false)
  const [hasStarted, setHasStarted] = useState(false)
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true
          setHasStarted(true)
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!hasStarted) return
    let startTime = null
    let rafId = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = timestamp - startTime
      const t = Math.min(progress / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3)
      setCount(Math.floor(eased * target))
      if (t < 1) rafId = requestAnimationFrame(animate)
      else {
        setCount(target)
        setBounce(true)
        setTimeout(() => setBounce(false), 600)
      }
    }
    rafId = requestAnimationFrame(animate)
    return () => { if (rafId) cancelAnimationFrame(rafId) }
  }, [hasStarted, target, duration])

  return (
    <div ref={ref} className="text-center">
      <div className={`text-xl font-headline font-extrabold text-[#14B8A6] transition-transform duration-300 ${bounce ? 'scale-125' : 'scale-100'}`}>
        {prefix}{count}{suffix}
      </div>
    </div>
  )
}

function Dashboard() {
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [formData, setFormData] = useState({ product: '', quantity: '', source: '', destination: '', time: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }))
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.product.trim()) newErrors.product = 'Product name is required'
    if (!formData.quantity) newErrors.quantity = 'Quantity is required'
    else if (Number(formData.quantity) <= 0) newErrors.quantity = 'Must be greater than 0'
    if (!formData.source.trim()) newErrors.source = 'Source location is required'
    if (!formData.destination.trim()) newErrors.destination = 'Destination is required'
    if (formData.source.trim() && formData.destination.trim() &&
      formData.source.trim().toLowerCase() === formData.destination.trim().toLowerCase()) {
      newErrors.destination = 'Must be different from source'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) { toast.error('Please fill in all required fields'); return }
    setLoading(true)
    try {
      const payload = {
        ...formData,
        uid: currentUser?.uid,
        userName: currentUser?.displayName,
        userPhoto: currentUser?.photoURL,
      }
      const response = await processRequest(payload)
      if (response.success) {
        // Save complete journey data to Firestore (history + matching)
        const journeyData = {
          ...response.data,
          uid: currentUser?.uid || 'anonymous',
          userName: currentUser?.displayName || 'Anonymous',
          userPhoto: currentUser?.photoURL || '',
          normalizedSource: formData.source.toLowerCase().trim(),
          normalizedDestination: formData.destination.toLowerCase().trim(),
          createdAt: serverTimestamp(),
          status: 'active'
        }
        setDoc(doc(db, 'journeys', response.data.requestId), journeyData)
          .then(() => console.log('Journey saved to Firestore:', response.data.requestId))
          .catch(err => console.error('Firestore save error:', err.message))

        toast.success('Route analysis complete!')
        setTimeout(() => navigate('/markets', { state: { data: response.data, formData } }), 500)
      }
    } catch {
      toast.error('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen text-white font-body selection:bg-white/10 relative">
      <PageBackground />
      <div className="relative z-10">
        <Navbar />
        <main className="min-h-screen pt-28 pb-20 px-4 sm:px-6 lg:px-12 max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column */}
          <div className="lg:col-span-5 flex flex-col space-y-6 lg:space-y-8 pt-4 lg:pt-0">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl">
                <span className="material-symbols-outlined text-[#14B8A6] text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>auto_awesome</span>
                <span className="text-white/85 text-xs font-bold uppercase tracking-widest">Global Logistics Intelligence</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-headline font-extrabold tracking-tight leading-[1.1]">
                Smart Routes.<br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] via-white to-[#6ea8ff]">Fair Prices.</span>
              </h1>
              <p className="text-base sm:text-xl text-white/70 max-w-md leading-relaxed">
                Shared Future. Master the complexity of global trade with our AI-orchestrated command center.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-4 sm:p-6 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-xl flex flex-col gap-2 sm:gap-3 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#14B8A6]/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#14B8A6] text-lg sm:text-2xl">savings</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-white text-sm sm:text-base">Cut transport costs</h3>
                  <p className="text-xs sm:text-sm text-white/70">Real-time carrier bidding and consolidation logic.</p>
                </div>
              </div>
              <div className="p-4 sm:p-6 rounded-2xl bg-white/8 border border-white/12 backdrop-blur-xl flex flex-col gap-2 sm:gap-3 hover:bg-white/10 transition-all">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#14B8A6]/15 flex items-center justify-center">
                  <span className="material-symbols-outlined text-[#14B8A6] text-lg sm:text-2xl">analytics</span>
                </div>
                <div>
                  <h3 className="font-headline font-bold text-white text-sm sm:text-base">Find best market</h3>
                  <p className="text-xs sm:text-sm text-white/70">Predictive demand mapping across 50+ global hubs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7 flex justify-center lg:justify-end">
            <div className="w-full max-w-xl p-6 sm:p-8 lg:p-12 rounded-3xl border border-white/12 bg-white/8 backdrop-blur-2xl shadow-[0px_32px_80px_rgba(0,0,0,0.35)] relative overflow-hidden">
              <div className="absolute -top-24 -right-24 w-64 h-64 bg-[#14B8A6]/12 rounded-full blur-3xl" />
              <div className="relative z-10 space-y-6 sm:space-y-8">
                <header>
                  <h2 className="text-xl sm:text-2xl font-headline font-extrabold text-white">Initiate New Route</h2>
                  <p className="text-white/70 font-label text-xs sm:text-sm">Fill in the logistics parameters to begin optimization.</p>
                </header>

                <form className="space-y-4 sm:space-y-6" onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/65">Product Name</label>
                      <input type="text" name="product" value={formData.product} onChange={handleChange} placeholder="e.g. Rice"
                        className={`w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl bg-white/10 border border-white/15 outline-none transition-all text-white placeholder:text-white/40 text-sm ${errors.product ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-[#14B8A6]/35'}`} />
                      {errors.product && <p className="text-xs text-red-200">{errors.product}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold uppercase tracking-widest text-white/65">Quantity (Tons)</label>
                      <input type="number" name="quantity" value={formData.quantity} onChange={handleChange} placeholder="500" min="1"
                        className={`w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl bg-white/10 border border-white/15 outline-none transition-all text-white placeholder:text-white/40 text-sm ${errors.quantity ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-[#14B8A6]/35'}`} />
                      {errors.quantity && <p className="text-xs text-red-200">{errors.quantity}</p>}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/65">Source Location</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-3 sm:top-4 text-white/50 text-base sm:text-lg">location_on</span>
                      <input type="text" name="source" value={formData.source} onChange={handleChange} placeholder="e.g. Pune"
                        className={`w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 rounded-xl bg-white/10 border border-white/15 outline-none transition-all text-white placeholder:text-white/40 text-sm ${errors.source ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-[#14B8A6]/35'}`} />
                    </div>
                    {errors.source && <p className="text-xs text-red-200">{errors.source}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/65">Destination</label>
                    <div className="relative">
                      <span className="material-symbols-outlined absolute left-4 top-3 sm:top-4 text-white/50 text-base sm:text-lg">near_me</span>
                      <input type="text" name="destination" value={formData.destination} onChange={handleChange} placeholder="e.g. Mumbai"
                        className={`w-full h-12 sm:h-14 pl-11 sm:pl-12 pr-4 rounded-xl bg-white/10 border border-white/15 outline-none transition-all text-white placeholder:text-white/40 text-sm ${errors.destination ? 'ring-2 ring-red-400' : 'focus:ring-2 focus:ring-[#14B8A6]/35'}`} />
                    </div>
                    {errors.destination && <p className="text-xs text-red-200">{errors.destination}</p>}
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/65">Preferred Time (Optional)</label>
                    <input type="datetime-local" name="time" value={formData.time} onChange={handleChange}
                      className="w-full h-12 sm:h-14 px-4 sm:px-5 rounded-xl bg-white/10 border border-white/15 outline-none transition-all text-white text-sm focus:ring-2 focus:ring-[#14B8A6]/35" />
                  </div>

                  <button type="submit" disabled={loading}
                    className="w-full h-14 sm:h-16 kinetic-gradient text-white font-headline font-extrabold rounded-xl shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100">
                    {loading ? (
                      <><span className="material-symbols-outlined animate-spin">refresh</span>Processing...</>
                    ) : (
                      <>Find Best Route &amp; Market<span className="material-symbols-outlined">arrow_forward</span></>
                    )}
                  </button>
                </form>

                <div className="pt-6 sm:pt-8 border-t border-white/10 grid grid-cols-3 gap-2 sm:gap-4">
                  <div className="text-center">
                    <AnimatedCounter target={10} suffix="K+" duration={1800} />
                    <div className="text-[9px] sm:text-[10px] font-label uppercase tracking-tighter text-white/60 mt-1">Routes Optimized</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter target={2} prefix="₹" suffix="M+" duration={1200} />
                    <div className="text-[9px] sm:text-[10px] font-label uppercase tracking-tighter text-white/60 mt-1">Saved</div>
                  </div>
                  <div className="text-center">
                    <AnimatedCounter target={500} suffix="+" duration={2200} />
                    <div className="text-[9px] sm:text-[10px] font-label uppercase tracking-tighter text-white/60 mt-1">Users Connected</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default Dashboard