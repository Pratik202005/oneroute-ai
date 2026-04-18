import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Markets', path: '/markets' },
    { name: 'Tracking', path: '/tracking' },
    { name: 'Connections', path: '/connections' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 px-4 mt-4 mx-auto max-w-7xl">
      <div className="glass-nav rounded-full px-6 py-3 flex justify-between items-center shadow-[0px_12px_32px_rgba(0,35,111,0.08)]">

        {/* Logo */}
        <span className="text-lg font-extrabold bg-gradient-to-r from-[#1e3a8a] to-[#006b5f] bg-clip-text text-transparent font-headline tracking-tight">
          OneRoute AI
        </span>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={
                location.pathname === link.path
                  ? 'text-[#00236f] border-b-2 border-[#14B8A6] pb-1 font-headline font-bold tracking-tight transition-all duration-300'
                  : 'text-slate-500 hover:text-[#1e3a8a] transition-all duration-300 font-headline font-bold tracking-tight px-3 py-1 rounded-full hover:bg-slate-100/50'
              }
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-3">
          <span className="hidden lg:block text-xs font-label uppercase tracking-widest text-slate-400">
            Powered by Google
          </span>
          <div className="w-9 h-9 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
            JD
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden p-2 rounded-full hover:bg-slate-100 transition-colors"
          >
            <span className="material-symbols-outlined text-primary">
              {menuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="md:hidden mt-2 mx-2 glass-nav rounded-2xl shadow-lg overflow-hidden">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`flex items-center gap-3 px-6 py-4 font-headline font-bold transition-all
                ${location.pathname === link.path
                  ? 'text-[#006b5f] bg-secondary/5 border-l-4 border-[#14B8A6]'
                  : 'text-slate-600 hover:bg-slate-100/50'
                }
              `}
            >
              <span className="material-symbols-outlined text-base">
                {link.name === 'Dashboard' && 'dashboard'}
                {link.name === 'Markets' && 'storefront'}
                {link.name === 'Tracking' && 'local_shipping'}
                {link.name === 'Connections' && 'group'}
              </span>
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}

export default Navbar