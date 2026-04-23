import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const navLinks = [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Markets', path: '/markets' },
    { name: 'Tracking', path: '/tracking' },
    { name: 'Connections', path: '/connections' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6">
      <div
        className={`mx-auto max-w-7xl mt-4 rounded-full border transition-all ${
          scrolled
            ? 'bg-white/10 border-white/15 backdrop-blur-xl shadow-[0px_18px_48px_rgba(0,0,0,0.28)]'
            : 'bg-white/5 border-white/10 backdrop-blur-lg'
        }`}
      >
        <div className="px-5 sm:px-7 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/10 border border-white/15">
              <span className="material-symbols-outlined text-white text-base">route</span>
            </span>
            <span className="text-white font-headline font-extrabold tracking-tight">
              OneRoute AI
            </span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 text-sm font-semibold text-white/80">
            {navLinks.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`landing-link ${
                    active ? 'text-[#14B8A6]' : ''
                  }`}
                >
                  {link.name}
                </Link>
              )
            })}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            <span className="hidden lg:block text-xs font-label uppercase tracking-widest text-white/55">
              Powered by Google
            </span>

            <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl flex items-center justify-center text-white font-black text-xs">
              JD
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden p-2 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl hover:bg-white/15 transition"
              aria-label="Toggle menu"
              aria-expanded={menuOpen}
            >
              <span className="material-symbols-outlined text-white">
                {menuOpen ? 'close' : 'menu'}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-auto max-w-7xl px-2">
          <div className="rounded-2xl border border-white/12 bg-white/8 backdrop-blur-xl overflow-hidden shadow-[0px_18px_48px_rgba(0,0,0,0.25)]">
            {navLinks.map((link) => {
              const active = location.pathname === link.path
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMenuOpen(false)}
                  className={`flex items-center gap-3 px-6 py-4 text-sm font-bold transition ${
                    active
                      ? 'text-[#14B8A6] bg-white/10'
                      : 'text-white/80 hover:bg-white/10'
                  }`}
                >
                  <span className="material-symbols-outlined text-base text-white/80">
                    {link.name === 'Dashboard' && 'dashboard'}
                    {link.name === 'Markets' && 'storefront'}
                    {link.name === 'Tracking' && 'local_shipping'}
                    {link.name === 'Connections' && 'group'}
                  </span>
                  {link.name}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar