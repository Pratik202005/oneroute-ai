import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const steps = [
  { id: 1, name: 'Request Submitted', status: 'completed', time: '10:45 AM, Oct 24' },
  { id: 2, name: 'Routes Calculated', status: 'completed', time: '10:48 AM, Oct 24' },
  { id: 3, name: 'Market Prices Analyzed', status: 'completed', time: '11:02 AM, Oct 24' },
  { id: 4, name: 'Users Matched', status: 'active', time: 'IN PROGRESS' },
  { id: 5, name: 'Final Decision Ready', status: 'pending', time: 'PENDING' },
]

function Tracking() {
  const location = useLocation()
  const navigate = useNavigate()
  const formData = location.state?.formData

  return (
    <div className="bg-background font-body text-on-surface selection:bg-secondary-container">
      <Navbar />

      <main className="pt-28 pb-24 px-4 sm:px-6 max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-10 sm:mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6">
            <div className="max-w-2xl">
              <span className="text-[#14B8A6] font-label font-medium uppercase tracking-[0.2em] text-xs mb-3 block">
                Real-time Logistics Monitoring
              </span>
              <h1 className="text-4xl sm:text-5xl md:text-7xl font-headline font-extrabold text-primary tracking-tighter leading-none">
                Your Journey
              </h1>
              {formData && (
                <p className="text-on-surface-variant mt-2 text-sm sm:text-base">
                  {formData.source} → {formData.destination} · {formData.product}
                </p>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-surface-container-lowest text-primary font-medium hover:bg-surface-container transition-all flex items-center gap-2 shadow text-sm">
                <span className="material-symbols-outlined text-base sm:text-xl">share</span>
                Share Progress
              </button>
              <button className="px-4 sm:px-6 py-2.5 sm:py-3 rounded-full kinetic-gradient text-white font-medium hover:scale-95 transition-transform flex items-center gap-2 shadow-lg text-sm">
                <span className="material-symbols-outlined text-base sm:text-xl">contact_support</span>
                Live Support
              </button>
            </div>
          </div>
        </header>

        {/* Timeline - Desktop */}
        <section className="mb-10 sm:mb-12 bg-surface-container-low rounded-lg p-6 sm:p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 blur-[100px] rounded-full"></div>

          {/* Desktop Timeline */}
          <div className="hidden sm:block relative">
            <div className="relative flex justify-between items-start w-full px-4">
              <div className="absolute h-[4px] w-[calc(100%-2rem)] bg-surface-container-highest left-4 top-6 z-0 rounded-full"></div>
              <div className="absolute h-[4px] w-[75%] bg-gradient-to-r from-[#1e3a8a] to-[#14B8A6] left-4 top-6 z-0 rounded-full"></div>

              {steps.map((step) => (
                <div key={step.id} className="relative z-10 flex flex-col items-center gap-4 max-w-[120px]">
                  {step.status === 'completed' && (
                    <div className="w-12 h-12 rounded-full kinetic-gradient flex items-center justify-center text-white ring-8 ring-surface-container-low">
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container ring-8 ring-surface-container-low relative">
                      <div className="absolute inset-0 rounded-full bg-secondary-container animate-ping opacity-25"></div>
                      <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-slate-400 ring-8 ring-surface-container-low">
                      <span className="material-symbols-outlined text-xl">flag</span>
                    </div>
                  )}
                  <div className="text-center">
                    <p className={`font-headline font-bold leading-tight text-xs sm:text-sm
                      ${step.status === 'completed' ? 'text-primary' : ''}
                      ${step.status === 'active' ? 'text-[#006b5f]' : ''}
                      ${step.status === 'pending' ? 'text-slate-400' : ''}
                    `}>
                      {step.name}
                    </p>
                    <p className={`text-xs font-label mt-1
                      ${step.status === 'active' ? 'text-[#006b5f] font-bold' : 'text-slate-500'}
                    `}>
                      {step.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Mobile Timeline (Vertical) */}
          <div className="sm:hidden flex flex-col gap-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-start gap-4">

                {/* Icon */}
                <div className="flex flex-col items-center">
                  {step.status === 'completed' && (
                    <div className="w-10 h-10 rounded-full kinetic-gradient flex items-center justify-center text-white flex-shrink-0">
                      <span className="material-symbols-outlined text-base" style={{ fontVariationSettings: "'FILL' 1" }}>
                        check_circle
                      </span>
                    </div>
                  )}
                  {step.status === 'active' && (
                    <div className="w-11 h-11 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container flex-shrink-0 relative">
                      <div className="absolute inset-0 rounded-full bg-secondary-container animate-ping opacity-25"></div>
                      <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>sync</span>
                    </div>
                  )}
                  {step.status === 'pending' && (
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center text-slate-400 flex-shrink-0">
                      <span className="material-symbols-outlined text-base">flag</span>
                    </div>
                  )}
                  {index < steps.length - 1 && (
                    <div className={`w-0.5 h-8 mt-1 rounded-full
                      ${step.status === 'completed' ? 'bg-secondary' : 'bg-surface-container-highest'}
                    `}></div>
                  )}
                </div>

                {/* Text */}
                <div className="pt-1.5">
                  <p className={`font-headline font-bold text-sm leading-tight
                    ${step.status === 'completed' ? 'text-primary' : ''}
                    ${step.status === 'active' ? 'text-[#006b5f]' : ''}
                    ${step.status === 'pending' ? 'text-slate-400' : ''}
                  `}>
                    {step.name}
                  </p>
                  <p className={`text-xs font-label mt-0.5
                    ${step.status === 'active' ? 'text-[#006b5f] font-bold' : 'text-slate-500'}
                  `}>
                    {step.time}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-start">

          {/* Left - Matching Partners */}
          <div className="md:col-span-7 bg-surface-container-lowest rounded-lg p-6 sm:p-10 shadow flex flex-col gap-6 sm:gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-secondary/10 flex items-center justify-center flex-shrink-0">
                  <span className="material-symbols-outlined text-secondary text-lg sm:text-2xl">hourglass_empty</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-2xl font-headline font-bold text-primary">Matching Partners</h3>
                  <p className="text-slate-500 font-body text-xs sm:text-sm">Identifying optimized carrier nodes...</p>
                </div>
              </div>
              <div className="bg-secondary/10 text-secondary px-3 sm:px-4 py-1.5 sm:py-2 rounded-full font-label font-bold text-xs sm:text-sm self-start sm:self-auto">
                2 mins wait
              </div>
            </div>

            <div className="bg-surface-container-low rounded-md p-4 sm:p-6 border-l-4 border-secondary">
              <p className="text-on-surface-variant font-body leading-relaxed italic text-xs sm:text-sm">
                "Your request is being matched against 4,200+ live transport streams. We're prioritizing high-efficiency routes with zero-emission windows."
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="bg-surface-container-high rounded-md p-4 sm:p-6 flex flex-col gap-1 sm:gap-2">
                <span className="text-xs font-label uppercase tracking-widest text-slate-500">Confidence Score</span>
                <span className="text-2xl sm:text-3xl font-headline font-extrabold text-primary">98.4%</span>
              </div>
              <div className="bg-surface-container-high rounded-md p-4 sm:p-6 flex flex-col gap-1 sm:gap-2">
                <span className="text-xs font-label uppercase tracking-widest text-slate-500">Active Nodes</span>
                <span className="text-2xl sm:text-3xl font-headline font-extrabold text-primary">124</span>
              </div>
            </div>
          </div>

          {/* Right - Optimization + Map */}
          <div className="md:col-span-5 flex flex-col gap-4 sm:gap-8">

            <div className="bg-primary rounded-lg p-6 sm:p-8 text-white flex flex-col gap-4 sm:gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 150Q50 140 100 120Q150 100 200 130T300 110T400 80" stroke="white" strokeWidth="2" />
                  <circle cx="200" cy="130" r="4" fill="white" />
                </svg>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse"></div>
                <span className="text-xs font-label tracking-[0.3em] uppercase opacity-70">Real-time Stream</span>
              </div>
              <div>
                <h4 className="text-xl sm:text-3xl font-headline font-bold leading-tight">Optimization Efficiency</h4>
                <p className="opacity-60 text-xs sm:text-sm mt-2">
                  Active cost-saving maneuvers: <span className="text-[#14B8A6] font-bold">14</span>
                </p>
              </div>
            </div>

            <div className="bg-surface-container-low rounded-lg h-48 sm:h-64 overflow-hidden relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLuUNjAJMVOsHyCniluU0lnWVOxDwq37Az3hIMWtD_kdvUu8XcNZmvFWuqHCndlc29QgtS93Pc0XGolXChSLus9iB2A8LpCnvJwX2UKwDRVnFcMfWo8nekw7D2-XtQmI0Zr1PWqWVla3YL_6SNSilgRhGM3JK7fwYaBPwUeco6j4Jtyrii0hk7OJJoOiJhVqaObvjqXPdxL11_YNHbepPIa97wZbT23KUwR4ywh4Givg2_1xqbwEqHzGyxL_4mLMM0fgWNmm1TG"
                alt="Route Preview"
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-4 sm:p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs font-label tracking-widest uppercase opacity-70">Route Preview</p>
                    <p className="font-headline font-bold text-base sm:text-lg">Central Hub Dynamics</p>
                  </div>
                  <span className="material-symbols-outlined text-xl sm:text-2xl">fullscreen</span>
                </div>
              </div>
            </div>

          </div>
        </div>

      </main>

      <Footer />
    </div>
  )
}

export default Tracking