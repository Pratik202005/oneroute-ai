import { useNavigate } from 'react-router-dom'
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth'
import { auth } from '../firebase'
import toast from 'react-hot-toast'

function Login() {
  const navigate = useNavigate()

  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider()
    try {
      await signInWithPopup(auth, provider)
      toast.success('Successfully logged in!')
      navigate('/dashboard')
    } catch (error) {
      console.error(error)
      toast.error('Failed to log in with Google')
    }
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-[#001142] via-[#001d3d] to-[#006b5f] flex items-center justify-center px-4">
      {/* background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-28 -left-28 w-[420px] h-[420px] bg-[#14B8A6]/20 rounded-full blur-[120px]" />
        <div className="absolute -bottom-36 -right-36 w-[520px] h-[520px] bg-[#1e3a8a]/25 rounded-full blur-[140px]" />
        <div className="absolute inset-0 landing-noise opacity-[0.10]" />
      </div>

      <div className="relative w-full max-w-md rounded-2xl border border-white/15 bg-white/8 backdrop-blur-xl shadow-[0px_30px_80px_rgba(0,0,0,0.40)] p-7 sm:p-9 text-white">
        {/* Logo */}
        <button
          onClick={() => navigate('/')}
          className="flex items-center justify-center gap-2 w-full"
        >
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 border border-white/15">
            <span className="material-symbols-outlined text-white">route</span>
          </span>
          <span className="text-xl font-headline font-extrabold tracking-tight">
            OneRoute AI
          </span>
        </button>

        <h1 className="mt-6 text-3xl font-headline font-extrabold text-center">
          Welcome Back
        </h1>
        <p className="mt-2 text-center text-white/70 text-sm">
          Sign in to access your dashboard
        </p>

        {/* Google button */}
        <button
          onClick={handleGoogleSignIn}
          className="mt-7 w-full h-12 rounded-xl bg-white text-[#001142] font-black flex items-center justify-center gap-2 hover:scale-[1.01] active:scale-[0.99] transition"
        >
          <span className="material-symbols-outlined">account_circle</span>
          Continue with Google
        </button>

        {/* OR */}
        <div className="my-6 flex items-center gap-3">
          <div className="h-px bg-white/15 flex-1"></div>
          <span className="text-[11px] font-bold text-white/55 tracking-[0.22em] uppercase">
            OR
          </span>
          <div className="h-px bg-white/15 flex-1"></div>
        </div>

        {/* Email */}
        <label className="text-[11px] font-bold text-white/60 tracking-[0.22em] uppercase">
          Email
        </label>
        <input
          type="email"
          placeholder="you@example.com"
          className="mt-2 w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 outline-none focus:ring-2 focus:ring-[#14B8A6]/40"
        />

        {/* Password */}
        <label className="mt-4 block text-[11px] font-bold text-white/60 tracking-[0.22em] uppercase">
          Password
        </label>
        <input
          type="password"
          placeholder="••••••••"
          className="mt-2 w-full h-12 rounded-xl bg-white/10 border border-white/15 px-4 outline-none focus:ring-2 focus:ring-[#14B8A6]/40"
        />

        {/* Sign In */}
        <button
          onClick={() => navigate('/dashboard')}
          className="mt-6 w-full h-12 rounded-xl kinetic-gradient text-white font-black hover:scale-[1.01] active:scale-[0.99] transition"
        >
          Sign In
        </button>

        {/* Create account (UI only) */}
        <div className="mt-6 text-center text-sm text-white/70">
          New here?{' '}
          <button
            onClick={() => navigate('/dashboard')}
            className="font-extrabold text-white underline underline-offset-4 hover:text-[#14B8A6] transition"
          >
            Create account
          </button>
        </div>

        <p className="mt-5 text-center text-xs text-white/55 leading-relaxed">
          By signing in you agree to our Terms & Privacy Policy
        </p>
      </div>
    </div>
  )
}

export default Login