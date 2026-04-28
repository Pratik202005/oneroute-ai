import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'

function Navbar() {
  const location = useLocation()
  const navigate = useNavigate()
  const { currentUser } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  const handleLogout = async () => {
    try {
      await signOut(auth)
      navigate('/login')
    } catch (error) {
      console.error('Logout error', error)
    }
  }

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

            {currentUser ? (
              <div className="relative group">
                <img 
                  src={currentUser.photoURL || `https://ui-avatars.com/api/?name=${currentUser.displayName || 'U'}`} 
                  alt="Profile" 
                  className="w-9 h-9 rounded-full border border-white/15 object-cover cursor-pointer"
                />
                <div className="absolute right-0 top-12 hidden group-hover:block bg-white/10 backdrop-blur-xl border border-white/15 rounded-lg overflow-hidden shadow-xl p-2 w-48">
                  <p className="text-white text-sm font-bold px-3 py-2 truncate">{currentUser.displayName}</p>
                  <button 
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 text-sm text-red-300 hover:bg-white/10 rounded-md transition"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-white/10 border border-white/15 backdrop-blur-xl flex items-center justify-center text-white font-black text-xs">
                JD
              </div>
            )}

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