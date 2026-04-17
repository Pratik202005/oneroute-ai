import { Link, useLocation } from 'react-router-dom'

function Navbar() {
  const location = useLocation()

  const navLinks = [
    { name: 'Dashboard', path: '/' },
    { name: 'Markets', path: '/markets' },
    { name: 'Tracking', path: '/tracking' },
    { name: 'Connections', path: '/connections' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center px-8 py-3 glass-nav rounded-full mt-4 mx-auto max-w-7xl blue-shadow">
      
      {/* Left: Logo + Links */}
      <div className="flex items-center gap-8">
        
        {/* Logo */}
        <span className="text-xl font-extrabold bg-gradient-to-r from-[#1e3a8a] to-[#006b5f] bg-clip-text text-transparent font-headline">
          OneRoute AI
        </span>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={
                location.pathname === link.path
                  ? 'text-[#00236f] border-b-2 border-[#14B8A6] pb-1 font-headline font-bold tracking-tight transition-all duration-300'
                  : 'text-slate-500 hover:text-[#1e3a8a] hover:bg-slate-100/50 transition-all duration-300 px-3 py-1 rounded-full font-headline font-bold tracking-tight'
              }
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Right: Powered by Google + Avatar */}
      <div className="flex items-center gap-4">
        <span className="hidden lg:block text-xs font-label uppercase tracking-widest text-slate-400">
          Powered by Google
        </span>
        <div className="w-10 h-10 rounded-full bg-primary-container flex items-center justify-center text-white font-bold text-xs ring-2 ring-white/20">
          JD
        </div>
      </div>
    </nav>
  )
}

export default Navbar