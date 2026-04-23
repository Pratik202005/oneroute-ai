import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'

function AnimatedCounter({ target, prefix = '', suffix = '', duration = 1400 }) {
  const [count, setCount] = useState(0)
  const [bounce, setBounce] = useState(false)
  const ref = useRef(null)
  const startedRef = useRef(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !startedRef.current) {
          startedRef.current = true

          let start = null
          let raf = null

          const tick = (t) => {
            if (!start) start = t
            const p = Math.min((t - start) / duration, 1)
            const eased = 1 - Math.pow(1 - p, 3) // easeOutCubic
            const v = Math.floor(eased * target)
            setCount(v)

            if (p < 1) raf = requestAnimationFrame(tick)
            else {
              setCount(target)
              setBounce(true)
              setTimeout(() => setBounce(false), 500)
            }
          }

          raf = requestAnimationFrame(tick)

          return () => {
            if (raf) cancelAnimationFrame(raf)
          }
        }
      },
      { threshold: 0.35 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [duration, target])

  return (
    <div ref={ref} className="text-center">
      <div
        className={`text-3xl sm:text-4xl font-headline font-extrabold text-white transition-transform duration-300 ${
          bounce ? 'scale-110' : 'scale-100'
        }`}
      >
        {prefix}
        {count.toLocaleString()}
        {suffix}
      </div>
    </div>
  )
}

function LandingNavbar() {
  const navigate = useNavigate()
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto max-w-7xl mt-4 rounded-full border transition-all ${
          scrolled
            ? 'bg-white/10 border-white/15 backdrop-blur-xl shadow-[0px_18px_48px_rgba(0,0,0,0.28)]'
            : 'bg-white/5 border-white/10 backdrop-blur-lg'
        }`}
      >
        <div className="px-5 sm:px-7 py-3 flex items-center justify-between">
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-2"
          >
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/15">
              <span className="material-symbols-outlined text-white text-base">route</span>
            </span>
            <span className="text-white font-headline font-extrabold tracking-tight">
              OneRoute AI
            </span>
          </button>

          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-white/80">
            <a className="landing-link" href="#features">
              Features
            </a>
            <a className="landing-link" href="#about">
              About
            </a>
            <a className="landing-link" href="#how">
              How it works
            </a>
            <a className="landing-link" href="#testimonials">
              Testimonials
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/login')}
              className="hidden sm:inline-flex px-5 py-2 rounded-full bg-white text-[#001142] font-black text-sm hover:scale-[1.03] active:scale-[0.99] transition"
            >
              Login
            </button>
            <button
              onClick={() => navigate('/login')}
              className="sm:hidden inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15 backdrop-blur-xl"
              aria-label="Login"
            >
              <span className="material-symbols-outlined text-white">login</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function HeroMapCard() {
  // purely visual (no real maps) — but looks like “logistics route”
  return (
    <div className="relative w-full max-w-xl">
      <div className="absolute -top-8 -left-8 w-48 h-48 bg-[#14B8A6]/25 rounded-full blur-3xl animate-floatSlow" />
      <div className="absolute -bottom-10 -right-10 w-60 h-60 bg-[#1e3a8a]/30 rounded-full blur-3xl animate-floatSlow" />

      <div className="relative rounded-2xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-[0px_30px_80px_rgba(0,0,0,0.35)] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.08] landing-grid" />

        <div className="p-5 sm:p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <p className="text-white/60 text-xs font-bold uppercase tracking-[0.2em]">
              Live preview
            </p>
            <p className="text-white font-headline font-extrabold text-lg sm:text-xl">
              AI Route + Market
            </p>
          </div>
          <div className="px-3 py-1.5 rounded-full bg-white/10 border border-white/15 text-white/80 text-xs font-bold uppercase tracking-wider">
            Demo
          </div>
        </div>

        <div className="p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="text-white/85 text-sm font-semibold">
              Pune <span className="text-white/40">→</span> Nashik
            </div>
            <div className="text-[#14B8A6] text-sm font-extrabold">Best Deal</div>
          </div>

          <div className="relative h-40 sm:h-44 rounded-xl border border-white/10 bg-gradient-to-br from-white/5 to-white/0 overflow-hidden">
            {/* Route Line */}
            <svg viewBox="0 0 520 220" className="absolute inset-0 w-full h-full">
              <defs>
                <linearGradient id="routeGrad" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#14B8A6" stopOpacity="1" />
                  <stop offset="55%" stopColor="#ffffff" stopOpacity="0.65" />
                  <stop offset="100%" stopColor="#1e3a8a" stopOpacity="1" />
                </linearGradient>
              </defs>

              <path
                className="route-draw"
                d="M40,160 C120,90 160,160 240,120 C320,78 360,140 430,95 C470,70 485,82 500,62"
                fill="none"
                stroke="url(#routeGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
              />
            </svg>

            {/* Pins */}
            <div className="absolute left-6 top-[120px]">
              <div className="h-3 w-3 rounded-full bg-white shadow" />
              <div className="mt-1 text-[10px] text-white/70 font-bold uppercase tracking-widest">
                Source
              </div>
            </div>
            <div className="absolute right-8 top-[44px]">
              <div className="h-3 w-3 rounded-full bg-[#14B8A6] shadow animate-pulse" />
              <div className="mt-1 text-[10px] text-white/70 font-bold uppercase tracking-widest">
                Market
              </div>
            </div>
          </div>

          {/* Floating mini cards */}
          <div className="mt-5 grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/5 p-3 animate-floatCard">
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                Route
              </p>
              <p className="text-white font-extrabold text-sm mt-1">342 km</p>
              <p className="text-white/70 text-xs">6.5h ETA</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 animate-floatCard" style={{ animationDelay: '0.6s' }}>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                Savings
              </p>
              <p className="text-white font-extrabold text-sm mt-1">₹2,800</p>
              <p className="text-white/70 text-xs">Network</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/5 p-3 animate-floatCard" style={{ animationDelay: '1.1s' }}>
              <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">
                Fair price
              </p>
              <p className="text-white font-extrabold text-sm mt-1">₹4,200</p>
              <p className="text-white/70 text-xs">per quintal</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Landing() {
  const navigate = useNavigate()

  // Scroll reveal
  useEffect(() => {
    const els = document.querySelectorAll('[data-reveal]')
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add('reveal-in')
        })
      },
      { threshold: 0.15 }
    )
    els.forEach((el) => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const trustItems = useMemo(
    () => [
      { name: 'Google Cloud', icon: 'cloud' },
      { name: 'Vertex AI', icon: 'auto_awesome' },
      { name: 'BigQuery', icon: 'dataset' },
      { name: 'Firebase', icon: 'bolt' },
    ],
    []
  )

  return (
    <div className="relative min-h-screen text-white overflow-hidden landing-bg">
      <LandingNavbar />

      {/* HERO background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-28 w-[420px] h-[420px] bg-[#14B8A6]/20 rounded-full blur-[120px] animate-floatSlow" />
        <div className="absolute -bottom-36 -right-36 w-[520px] h-[520px] bg-[#1e3a8a]/25 rounded-full blur-[140px] animate-floatSlow" />
        <div className="absolute inset-0 landing-noise opacity-[0.10]" />
      </div>

      {/* 2) HERO SECTION */}
      <main className="relative z-10 pt-28 sm:pt-32">
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            <div className="lg:col-span-6" data-reveal>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/8 border border-white/12 backdrop-blur-lg">
                <span
                  className="material-symbols-outlined text-[#14B8A6] text-sm"
                  style={{ fontVariationSettings: "'FILL' 1" }}
                >
                  auto_awesome
                </span>
                <span className="text-white/80 text-xs font-bold uppercase tracking-[0.2em]">
                  Global Logistics Intelligence
                </span>
              </div>

              <h1 className="mt-5 font-headline font-extrabold tracking-tight leading-[1.05] text-4xl sm:text-5xl lg:text-6xl">
                Smart Routes.
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#14B8A6] via-white to-[#6ea8ff]">
                  Fair Prices.
                </span>
              </h1>

              <p className="mt-5 text-white/75 text-base sm:text-lg leading-relaxed max-w-xl">
                OneRoute AI helps you choose the best market, avoid unfair pricing, and reduce transport costs using route optimization + shared shipping.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => navigate('/login')}
                  className="h-12 sm:h-14 px-6 sm:px-7 rounded-full bg-white text-[#001142] font-black tracking-tight hover:scale-[1.02] active:scale-[0.99] transition"
                >
                  Get Started Free
                  <span className="material-symbols-outlined align-middle text-base ml-2">arrow_forward</span>
                </button>

                <a
                  href="#how"
                  className="h-12 sm:h-14 px-6 sm:px-7 rounded-full border border-white/20 bg-white/5 backdrop-blur-xl font-bold text-white/90 hover:bg-white/10 transition inline-flex items-center justify-center"
                >
                  <span className="material-symbols-outlined text-base mr-2">play_circle</span>
                  Watch Demo
                </a>
              </div>

              <div className="mt-6 text-xs text-white/55 font-semibold">
                Trusted by teams shipping across 50+ hubs • Powered by Google ecosystem
              </div>
            </div>

            <div className="lg:col-span-6" data-reveal>
              <HeroMapCard />
            </div>
          </div>
        </section>

        {/* 3) TRUST BAR */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-14 sm:pb-16" data-reveal>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-5 sm:p-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.2em]">
                  Powered by
                </p>
                <p className="text-white font-headline font-extrabold text-lg">
                  Google Cloud + AI Data Stack
                </p>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {trustItems.map((t) => (
                  <div
                    key={t.name}
                    className="inline-flex items-center gap-2 px-3 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-xs font-bold"
                  >
                    <span className="material-symbols-outlined text-sm text-[#14B8A6]">{t.icon}</span>
                    {t.name}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4) FEATURES SECTION */}
        <section id="features" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto" data-reveal>
            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.25em]">Features</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-headline font-extrabold">
              Built for real-world logistics decisions
            </h2>
            <p className="mt-3 text-white/70">
              From route optimization to market fairness checks, OneRoute AI gives you clear actions—not spreadsheets.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" data-reveal>
            <div className="landing-card">
              <div className="landing-icon">
                <span className="material-symbols-outlined">route</span>
              </div>
              <h3 className="mt-4 font-headline font-extrabold text-xl">Smart Routing</h3>
              <p className="mt-2 text-white/70 text-sm leading-relaxed">
                Compare multiple route options with time, cost, and distance—optimized for real transport constraints.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-icon">
                <span className="material-symbols-outlined">price_check</span>
              </div>
              <h3 className="mt-4 font-headline font-extrabold text-xl">Fair Market Pricing</h3>
              <p className="mt-2 text-white/70 text-sm leading-relaxed">
                Detect overpriced markets and get a recommended fair deal using AI-powered price intelligence.
              </p>
            </div>

            <div className="landing-card">
              <div className="landing-icon">
                <span className="material-symbols-outlined">group</span>
              </div>
              <h3 className="mt-4 font-headline font-extrabold text-xl">Shared Transport Network</h3>
              <p className="mt-2 text-white/70 text-sm leading-relaxed">
                Match with co-shippers heading to the same destination and split costs with transparent savings.
              </p>
            </div>
          </div>
        </section>

        {/* 5) HOW IT WORKS */}
        <section id="how" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 scroll-mt-32">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            <div className="lg:col-span-5" data-reveal>
              <p className="text-white/70 text-xs font-bold uppercase tracking-[0.25em]">How it works</p>
              <h2 className="mt-3 text-3xl sm:text-4xl font-headline font-extrabold">
                From input to execution in minutes
              </h2>
              <p className="mt-3 text-white/70">
                Enter your shipment, get AI recommendations, collaborate with others, then track progress end-to-end.
              </p>

              <button
                onClick={() => navigate('/login')}
                className="mt-7 h-12 px-6 rounded-full bg-white text-[#001142] font-black hover:scale-[1.02] transition"
              >
                Try the Demo Flow
              </button>
            </div>

            <div className="lg:col-span-7" data-reveal>
              <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-6 sm:p-8">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { n: '01', t: 'Enter shipment', d: 'Product, quantity, source, destination, time.' },
                    { n: '02', t: 'AI finds best route + market', d: 'Compare options and get best deal recommendation.' },
                    { n: '03', t: 'Match co-shippers', d: 'Join others heading to same destination to save cost.' },
                    { n: '04', t: 'Track in real time', d: 'See journey steps and progress with confidence score.' },
                  ].map((s) => (
                    <div key={s.n} className="rounded-xl border border-white/10 bg-white/5 p-5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black tracking-[0.25em] text-white/60">{s.n}</span>
                        <span className="material-symbols-outlined text-[#14B8A6]">check_circle</span>
                      </div>
                      <h3 className="mt-3 font-headline font-extrabold text-lg">{s.t}</h3>
                      <p className="mt-2 text-white/70 text-sm leading-relaxed">{s.d}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 6) STATS SECTION (animated counters) */}
        <section id="about" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 scroll-mt-32" data-reveal>
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl p-8 sm:p-10">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
              <div>
                <p className="text-white/70 text-xs font-bold uppercase tracking-[0.25em]">Impact</p>
                <h2 className="mt-3 text-3xl sm:text-4xl font-headline font-extrabold">
                  Clear outcomes, measurable savings
                </h2>
                <p className="mt-3 text-white/70 max-w-2xl">
                  We’re building a logistics layer that makes routes cheaper and market decisions fairer.
                </p>
              </div>

              <button
                onClick={() => navigate('/login')}
                className="h-12 px-6 rounded-full border border-white/20 bg-white/5 hover:bg-white/10 transition font-bold"
              >
                Access Dashboard
              </button>
            </div>

            <div className="mt-10 grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center">
                <AnimatedCounter target={10000} suffix="+" />
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                  Routes optimized
                </p>
              </div>

              <div className="text-center">
                <AnimatedCounter target={2000000} prefix="₹" suffix="+" duration={1600} />
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                  Savings generated
                </p>
              </div>

              <div className="text-center">
                <AnimatedCounter target={500} suffix="+" duration={1100} />
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.22em] text-white/60">
                  Users connected
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 7) TESTIMONIALS */}
        <section id="testimonials" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16 scroll-mt-32">
          <div className="text-center max-w-3xl mx-auto" data-reveal>
            <p className="text-white/70 text-xs font-bold uppercase tracking-[0.25em]">Testimonials</p>
            <h2 className="mt-3 text-3xl sm:text-4xl font-headline font-extrabold">
              Built with real users in mind
            </h2>
            <p className="mt-3 text-white/70">
              Early users love clarity: where to sell, which route to take, and how much they save.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6" data-reveal>
            {[
              { name: 'Farmer Cooperative', role: 'Nashik', text: 'We avoided an overpriced market and saved on transport by joining a shared route.' },
              { name: 'Small Trader', role: 'Pune', text: 'The market alert was accurate. The recommended route reduced delays and cost.' },
              { name: 'Logistics Partner', role: 'Mumbai', text: 'The flow is fast. It feels like a control center for shipments.' },
            ].map((t) => (
              <div key={t.name} className="landing-card">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-full bg-white/10 border border-white/15 flex items-center justify-center font-black">
                    {t.name.split(' ')[0][0]}
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.25em] text-white/55">
                    Verified
                  </span>
                </div>
                <p className="mt-4 text-white/80 text-sm leading-relaxed">“{t.text}”</p>
                <div className="mt-5">
                  <p className="font-headline font-extrabold">{t.name}</p>
                  <p className="text-white/60 text-sm">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 8) CTA SECTION */}
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-10 pb-16" data-reveal>
          <div className="rounded-3xl overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-[0px_30px_90px_rgba(0,0,0,0.35)]">
            <div className="p-8 sm:p-12 relative">
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-[#14B8A6]/20 rounded-full blur-3xl" />
              <div className="absolute -bottom-16 -left-16 w-64 h-64 bg-[#1e3a8a]/25 rounded-full blur-3xl" />

              <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
                <div>
                  <p className="text-white/70 text-xs font-bold uppercase tracking-[0.25em]">
                    Ready
                  </p>
                  <h2 className="mt-3 text-3xl sm:text-4xl font-headline font-extrabold">
                    Ready to optimize your supply chain?
                  </h2>
                  <p className="mt-3 text-white/70 max-w-2xl">
                    Sign in to access the dashboard demo flow (UI-only for now). We’ll connect real authentication later with backend.
                  </p>
                </div>

                <button
                  onClick={() => navigate('/login')}
                  className="h-12 sm:h-14 px-6 sm:px-7 rounded-full bg-white text-[#001142] font-black hover:scale-[1.02] transition"
                >
                  Sign in with Google
                  <span className="material-symbols-outlined align-middle text-base ml-2">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* 9) FOOTER */}
        <Footer />
      </main>
    </div>
  )
}

export default Landing