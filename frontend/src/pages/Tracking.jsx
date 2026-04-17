import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Tracking() {
  return (
    <div className="bg-background font-body text-on-surface selection:bg-secondary-container">
      <Navbar />

      <main className="pt-32 pb-24 px-6 max-w-7xl mx-auto">

        {/* Header */}
        <header className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-2xl">
              <span className="text-[#14B8A6] font-label font-medium uppercase tracking-[0.2em] text-xs mb-3 block">
                Real-time Logistics Monitoring
              </span>
              <h1 className="text-5xl md:text-7xl font-headline font-extrabold text-primary tracking-tighter leading-none">
                Your Journey
              </h1>
            </div>

            <div className="flex gap-3">
              <button className="px-6 py-3 rounded-full bg-surface-container-lowest text-primary font-medium hover:bg-surface-container transition-all flex items-center gap-2 shadow">
                <span className="material-symbols-outlined">share</span>
                Share Progress
              </button>
              <button className="px-6 py-3 rounded-full kinetic-gradient text-white font-medium hover:scale-95 transition-transform flex items-center gap-2 shadow-lg">
                <span className="material-symbols-outlined">contact_support</span>
                Live Support
              </button>
            </div>
          </div>
        </header>

        {/* Timeline */}
        <section className="mb-12 bg-surface-container-low rounded-lg p-10 relative overflow-hidden">

          {/* Background blur */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-secondary-container/10 blur-[100px] rounded-full"></div>

          <div className="relative flex flex-col gap-12">

            {/* Progress Line Container */}
            <div className="relative flex justify-between items-center w-full px-4">

              {/* Background Line */}
              <div className="absolute h-[4px] w-[calc(100%-2rem)] bg-surface-container-highest left-4 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>

              {/* Completed Line */}
              <div className="absolute h-[4px] w-[75%] bg-gradient-to-r from-[#1e3a8a] to-[#14B8A6] left-4 top-1/2 -translate-y-1/2 z-0 rounded-full"></div>

              {/* Step 1 - Completed */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full kinetic-gradient flex items-center justify-center text-white ring-8 ring-surface-container-low">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-primary leading-tight">Request Submitted</p>
                  <p className="text-xs text-slate-500 font-label mt-1">10:45 AM, Oct 24</p>
                </div>
              </div>

              {/* Step 2 - Completed */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full kinetic-gradient flex items-center justify-center text-white ring-8 ring-surface-container-low">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-primary leading-tight">Routes Calculated</p>
                  <p className="text-xs text-slate-500 font-label mt-1">10:48 AM, Oct 24</p>
                </div>
              </div>

              {/* Step 3 - Completed */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full kinetic-gradient flex items-center justify-center text-white ring-8 ring-surface-container-low">
                  <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    check_circle
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-primary leading-tight">Market Prices Analyzed</p>
                  <p className="text-xs text-slate-500 font-label mt-1">11:02 AM, Oct 24</p>
                </div>
              </div>

              {/* Step 4 - Active */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container ring-8 ring-surface-container-low relative">
                  <div className="absolute inset-0 rounded-full bg-secondary-container animate-ping opacity-25"></div>
                  <span className="material-symbols-outlined text-2xl" style={{ fontVariationSettings: "'FILL' 1" }}>
                    sync
                  </span>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-[#006b5f] leading-tight">Users Matched</p>
                  <p className="text-xs text-[#006b5f] font-label font-bold mt-1">IN PROGRESS</p>
                </div>
              </div>

              {/* Step 5 - Pending */}
              <div className="relative z-10 flex flex-col items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-surface-container-highest flex items-center justify-center text-slate-400 ring-8 ring-surface-container-low">
                  <span className="material-symbols-outlined text-xl">flag</span>
                </div>
                <div className="text-center">
                  <p className="font-headline font-bold text-slate-400 leading-tight">Final Decision Ready</p>
                  <p className="text-xs text-slate-400 font-label mt-1">PENDING</p>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">

          {/* Left - Matching Partners */}
          <div className="md:col-span-7 bg-surface-container-lowest rounded-lg p-10 shadow flex flex-col gap-8">

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary/10 flex items-center justify-center">
                  <span className="material-symbols-outlined text-secondary">hourglass_empty</span>
                </div>
                <div>
                  <h3 className="text-2xl font-headline font-bold text-primary">Matching Partners</h3>
                  <p className="text-slate-500 font-body">Identifying optimized carrier nodes...</p>
                </div>
              </div>
              <div className="bg-secondary/10 text-secondary px-4 py-2 rounded-full font-label font-bold text-sm">
                2 mins wait
              </div>
            </div>

            {/* Quote */}
            <div className="bg-surface-container-low rounded-md p-6 border-l-4 border-secondary">
              <p className="text-on-surface-variant font-body leading-relaxed italic">
                "Your request is being matched against 4,200+ live transport streams. We're prioritizing high-efficiency routes with zero-emission windows."
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-container-high rounded-md p-6 flex flex-col gap-2">
                <span className="text-xs font-label uppercase tracking-widest text-slate-500">
                  Confidence Score
                </span>
                <span className="text-3xl font-headline font-extrabold text-primary">98.4%</span>
              </div>
              <div className="bg-surface-container-high rounded-md p-6 flex flex-col gap-2">
                <span className="text-xs font-label uppercase tracking-widest text-slate-500">
                  Active Nodes
                </span>
                <span className="text-3xl font-headline font-extrabold text-primary">124</span>
              </div>
            </div>

          </div>

          {/* Right - Optimization + Map */}
          <div className="md:col-span-5 flex flex-col gap-8">

            {/* Optimization Efficiency */}
            <div className="bg-primary rounded-lg p-8 text-white flex flex-col gap-6 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-full h-full opacity-10 pointer-events-none">
                <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 150Q50 140 100 120Q150 100 200 130T300 110T400 80" stroke="white" strokeWidth="2"/>
                  <circle cx="200" cy="130" r="4" fill="white"/>
                </svg>
              </div>

              <div className="flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-[#14B8A6] animate-pulse"></div>
                <span className="text-xs font-label tracking-[0.3em] uppercase opacity-70">
                  Real-time Stream
                </span>
              </div>

              <div>
                <h4 className="text-3xl font-headline font-bold leading-tight">
                  Optimization Efficiency
                </h4>
                <p className="opacity-60 text-sm mt-2">
                  Active cost-saving maneuvers: <span className="text-[#14B8A6] font-bold">14</span>
                </p>
              </div>
            </div>

            {/* Map Preview */}
            <div className="bg-surface-container-low rounded-lg h-64 overflow-hidden relative group">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDLuUNjAJMVOsHyCniluU0lnWVOxDwq37Az3hIMWtD_kdvUu8XcNZmvFWuqHCndlc29QgtS93Pc0XGolXChSLus9iB2A8LpCnvJwX2UKwDRVnFcMfWo8nekw7D2-XtQmI0Zr1PWqWVla3YL_6SNSilgRhGM3JK7fwYaBPwUeco6j4Jtyrii0hk7OJJoOiJhVqaObvjqXPdxL11_YNHbepPIa97wZbT23KUwR4ywh4Givg2_1xqbwEqHzGyxL_4mLMM0fgWNmm1TG"
                alt="Route Preview"
                className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent flex flex-col justify-end p-6">
                <div className="flex items-center justify-between text-white">
                  <div>
                    <p className="text-xs font-label tracking-widest uppercase opacity-70">Route Preview</p>
                    <p className="font-headline font-bold text-lg">Central Hub Dynamics</p>
                  </div>
                  <span className="material-symbols-outlined text-2xl">fullscreen</span>
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