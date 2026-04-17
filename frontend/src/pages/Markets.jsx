import { useState } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

function Markets() {
  return (
    <div className="bg-background font-body text-on-surface selection:bg-secondary-container">
      <Navbar />

      <main className="pt-32 pb-20 px-6 max-w-7xl mx-auto space-y-12">
        
        {/* Header & Alert Section */}
        <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl md:text-5xl font-headline font-extrabold tracking-tight text-primary">
              Market Intelligence
            </h1>
            <p className="text-on-surface-variant max-w-lg">
              Real-time supply chain analysis powered by Vertex AI and BigQuery datasets.
            </p>
          </div>

          {/* Price Alert Box */}
          <div className="flex items-center gap-4 p-4 rounded-lg bg-error-container/20 border-l-4 border-error max-w-md">
            <span className="material-symbols-outlined text-error">warning</span>
            <p className="text-sm text-on-error-container">
              <span className="font-bold">Price Alert:</span> Market B (Mumbai Central) is showing unfair pricing models (+18% above regional average). 
              <span className="font-semibold underline">Avoid for next 24h.</span>
            </p>
          </div>
        </header>

        {/* Market Intelligence Cards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Market A - Unfair/Avoid */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0px_4px_20px_rgba(0,35,111,0.04)] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-xs font-bold px-3 py-1 bg-error-container text-on-error-container rounded-full">
                Unfair/Avoid
              </span>
            </div>

            <h3 className="text-lg font-headline font-bold text-primary mb-1">Pune APMC</h3>
            
            <div className="text-3xl font-extrabold text-on-surface mb-4">
              ₹4,800 <span className="text-sm font-normal text-on-surface-variant">/ quintal</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-error text-sm">trending_up</span>
              <span className="text-xs font-medium text-error">+12.4% vs last week</span>
            </div>

            {/* 7-Day Trend Chart */}
            <div className="mb-6 h-12 w-full">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">7-Day Trend</p>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path 
                  d="M0,35 C20,35 40,30 60,32 C80,34 100,20 120,22 C140,24 160,10 180,8 C190,7 200,5 200,5" 
                  fill="none" 
                  stroke="#ba1a1a" 
                  strokeLinecap="round" 
                  strokeWidth="2"
                />
                <path 
                  d="M0,35 C20,35 40,30 60,32 C80,34 100,20 120,22 C140,24 160,10 180,8 C190,7 200,5 200,5 L200,40 L0,40 Z" 
                  fill="url(#gradient-red)" 
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="gradient-red" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ba1a1a" />
                    <stop offset="100%" stopColor="#ba1a1a" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="bg-surface-container-high p-4 rounded-sm">
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Vertex AI predicts a sharp price correction in 48 hours due to incoming surplus stock from northern districts.
              </p>
            </div>
          </div>

          {/* Market B - Slightly High */}
          <div className="bg-surface-container-lowest p-6 rounded-lg shadow-[0px_4px_20px_rgba(0,35,111,0.04)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-xs font-bold px-3 py-1 bg-amber-100 text-amber-700 rounded-full">
                Slightly High
              </span>
            </div>

            <h3 className="text-lg font-headline font-bold text-primary mb-1">Mumbai Central</h3>
            
            <div className="text-3xl font-extrabold text-on-surface mb-4">
              ₹5,100 <span className="text-sm font-normal text-on-surface-variant">/ quintal</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-amber-500 text-sm">trending_flat</span>
              <span className="text-xs font-medium text-amber-600">Stable, but above index</span>
            </div>

            {/* 7-Day Trend Chart */}
            <div className="mb-6 h-12 w-full">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">7-Day Trend</p>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path 
                  d="M0,20 C20,20 40,18 60,22 C80,26 100,20 120,22 C140,24 160,18 180,18 C190,18 200,20 200,20" 
                  fill="none" 
                  stroke="#d97706" 
                  strokeLinecap="round" 
                  strokeWidth="2"
                />
                <path 
                  d="M0,20 C20,20 40,18 60,22 C80,26 100,20 120,22 C140,24 160,18 180,18 C190,18 200,20 200,20 L200,40 L0,40 Z" 
                  fill="url(#gradient-amber)" 
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="gradient-amber" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#d97706" />
                    <stop offset="100%" stopColor="#d97706" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <div className="bg-surface-container-high p-4 rounded-sm text-xs text-on-surface-variant italic leading-relaxed">
              "Artificial scarcity detected in local warehouses. BigQuery cross-referencing suggests holding off transactions."
            </div>
          </div>

          {/* Market C - Best Deal (Recommended) */}
          <div className="bg-surface-container-lowest p-6 rounded-lg border-2 border-secondary/20 shadow-[0px_8px_32px_rgba(20,184,166,0.1)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="text-xs font-bold px-3 py-1 bg-secondary-container text-on-secondary-container rounded-full">
                Best Deal
              </span>
            </div>

            <h3 className="text-lg font-headline font-bold text-primary mb-1">Nashik Agri Hub</h3>
            
            <div className="text-3xl font-extrabold text-secondary mb-4">
              ₹4,200 <span className="text-sm font-normal text-on-surface-variant">/ quintal</span>
            </div>

            <div className="flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-secondary text-sm">trending_down</span>
              <span className="text-xs font-medium text-secondary">-8.2% Competitive Advantage</span>
            </div>

            {/* 7-Day Trend Chart */}
            <div className="mb-6 h-12 w-full">
              <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">7-Day Trend</p>
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 200 40">
                <path 
                  d="M0,5 C20,5 40,15 60,12 C80,9 100,25 120,22 C140,19 160,35 180,38 C190,39 200,40 200,40" 
                  fill="none" 
                  stroke="#006b5f" 
                  strokeLinecap="round" 
                  strokeWidth="2"
                />
                <path 
                  d="M0,5 C20,5 40,15 60,12 C80,9 100,25 120,22 C140,19 160,35 180,38 C190,39 200,40 200,40 L200,40 L0,40 Z" 
                  fill="url(#gradient-teal)" 
                  opacity="0.1"
                />
                <defs>
                  <linearGradient id="gradient-teal" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#006b5f" />
                    <stop offset="100%" stopColor="#006b5f" stopOpacity="0" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            <button className="w-full kinetic-gradient text-white py-3 rounded-sm font-bold text-sm tracking-wide shadow-lg shadow-primary/20 hover:scale-[1.02] transition-transform">
              Execute Trade Now
            </button>
          </div>

        </section>

        {/* Map & Route Section */}
        <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Map View (Left/Center Column) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Map Container */}
            <div className="relative h-[400px] w-full bg-surface-container-high rounded-lg overflow-hidden border-2 border-surface-container shadow-sm">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBuzggxas23MKhvKlglgGNI8pFCMUA6V-3VjPdjl7K0mm4gsd99Engl-5Kw8JD7P9CIQJ0_VZI_Wro_a5qOqSuQr5jj5NwDvcqIPz7Wu6rXhtkRVJJvxohy1ZVR5cBN9zPBsPl3guluDeeIqjk7V_2nIek17NcrtWmgpqqJnQoTRDUGjOQN9W0RuL-2eiIlMJuFyXWFKeK6t_TVlAFug0RgDl735DqyyQSFsiaq5uLXXgEeZk26grJrPCQQ1zEOlM5jQ8kPxeEsPq4"
                alt="Logistics map view"
                className="w-full h-full object-cover opacity-80"
              />

              {/* Floating Info Chip */}
              <div className="absolute top-6 left-6 glass-nav p-4 rounded-lg shadow-xl border border-white/30 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full kinetic-gradient flex items-center justify-center text-white">
                  <span className="material-symbols-outlined">route</span>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-primary tracking-widest leading-none mb-1">Active Shipment</p>
                  <p className="text-sm font-bold text-on-surface">Pune → Nashik Hub</p>
                </div>
              </div>

              {/* Destination Pin */}
              <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                <div className="w-4 h-4 bg-secondary rounded-full animate-pulse border-4 border-white shadow-lg"></div>
              </div>
            </div>

            {/* Optimized Routes Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Route 1 - Recommended */}
              <div className="p-4 rounded-lg bg-surface-container-lowest border-2 border-secondary shadow-md relative">
                <span className="absolute -top-2 left-4 text-[10px] font-bold bg-secondary text-white px-2 py-0.5 rounded-full">
                  RECOMMENDED
                </span>
                <h4 className="text-sm font-bold text-primary">Highway Express</h4>
                <div className="flex justify-between items-end mt-3">
                  <div className="text-xl font-extrabold">
                    342<span className="text-xs font-medium">km</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-secondary">6.5h</p>
                    <p className="text-sm font-bold">₹4,200</p>
                  </div>
                </div>
              </div>

              {/* Route 2 */}
              <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 opacity-70">
                <h4 className="text-sm font-bold text-on-surface-variant">Mountain Path</h4>
                <div className="flex justify-between items-end mt-3">
                  <div className="text-xl font-extrabold">
                    289<span className="text-xs font-medium">km</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-on-surface-variant">8.2h</p>
                    <p className="text-sm font-bold">₹5,100</p>
                  </div>
                </div>
              </div>

              {/* Route 3 */}
              <div className="p-4 rounded-lg bg-surface-container-lowest border border-outline-variant/30 opacity-70">
                <h4 className="text-sm font-bold text-on-surface-variant">Rural Bypass</h4>
                <div className="flex justify-between items-end mt-3">
                  <div className="text-xl font-extrabold">
                    412<span className="text-xs font-medium">km</span>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-on-surface-variant">7.1h</p>
                    <p className="text-sm font-bold">₹4,850</p>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Shared Transport Panel (Right Column) */}
          <div className="space-y-6">
            <div className="bg-primary-container p-8 rounded-lg text-white shadow-xl flex flex-col h-full">
              
              <div className="flex items-center gap-3 mb-8">
                <span className="material-symbols-outlined text-secondary-container">group_add</span>
                <h3 className="text-xl font-headline font-bold">Shared Transport</h3>
              </div>

              <div className="mb-8">
                <p className="text-secondary-container text-sm font-medium mb-4 italic">
                  "3 users going to same destination"
                </p>
                
                {/* User Avatars */}
                <div className="flex -space-x-4 mb-6">
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuAllNcYix7MyWvrMRQHA6TgJm6v4n8r8_XzzC0rCqRKNu_XCaVnwS-I8oqORCRI50_Yvqb38bW3ELLpx7MUA5TQ9HxIl-1fcWmcaq23GGPEoIk4LnrDklzup5w16TgeTA_qD9UJMCLya2IgoiyNDfc-VBWXlvmBeSN9LI1arxBxsK5pSHWvAetN8N4OpcW7qm7vmOAm63KTgk4RKR8kgv9ivPsHUUxRRXaibeuWxKQGHc86_dZR5Q5RjDmQzUGsrxHVToA7q6Y5FC"
                    alt="User 1"
                    className="w-12 h-12 rounded-full border-4 border-primary-container object-cover"
                  />
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBhEjxXDck1UDVnZMfE7C177KTDm7MWnHxfxH8OMRA7qEqu7i35XCK6Ja9jRN0X_huNQxxxh2tUG5ALPnAYm7oxzq3iW7MobuJVhtfIXr3e5pxJ--AQUvPXCw7VWXD4Xd25-P1F28x66OA_XPrTbAbS2ilFSBt0LZhrmGbT7VSsgsR3tsK3MUqxvI6S2e3kB_ZG2GT1mHu61C_K07Rkr9lIPoKdXeVcbtLyISaqOk2YuQFZ8rcb9jMiNYUwLufMDEAhzbmmx2p2sBq"
                    alt="User 2"
                    className="w-12 h-12 rounded-full border-4 border-primary-container object-cover"
                  />
                  <img 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBOqNYzAxJVhW4y9EaKBDpf6MjtPRDK5gmdRGHncpUANO8_9htGvl6VABK7y2qNbndMKrrEeDwPIzjy_yqqW6BYiIHRa28f9etmEC4ScwCVHFBgY2FrFowACx7xod_QB2x8BTdEej2PTdEdrjBFS0hoaXp9tMBEMMgbrTqfKzeP5XsDDdgOJBO-0XkWrvOgKE3HZsGN0fQyJ7NUq9NhBrzZBUe6-eCye8jlknPpWy01o2YVOV3bUEDahCtYyF5fE00V5zezLs81YfZg"
                    alt="User 3"
                    className="w-12 h-12 rounded-full border-4 border-primary-container object-cover"
                  />
                  <div className="w-12 h-12 rounded-full border-4 border-primary-container bg-on-primary-container flex items-center justify-center text-xs font-bold text-primary-container">
                    YOU
                  </div>
                </div>
              </div>

              {/* Cost Breakdown */}
              <div className="bg-white/10 rounded-sm p-6 space-y-4 mb-8">
                <div className="flex justify-between items-center opacity-70">
                  <span className="text-sm">Standard Full Cost</span>
                  <span className="text-sm font-bold">₹4,200</span>
                </div>
                <div className="flex justify-between items-center text-secondary-container">
                  <span className="text-sm font-bold uppercase tracking-wider">Network Savings</span>
                  <span className="text-sm font-bold">- ₹2,800</span>
                </div>
                <div className="pt-4 border-t border-white/20 flex justify-between items-center">
                  <span className="text-lg font-bold">Your share</span>
                  <span className="text-3xl font-extrabold text-secondary-container">₹1,400</span>
                </div>
              </div>

              {/* CTA Section */}
              <div className="mt-auto">
                <div className="flex items-center gap-2 mb-4 bg-secondary/20 p-3 rounded text-secondary-container">
                  <span className="material-symbols-outlined text-sm">savings</span>
                  <span className="text-sm font-bold">Save ₹500 today</span>
                </div>
                <button className="w-full bg-white text-primary-container py-4 rounded-sm font-black text-sm tracking-widest uppercase hover:bg-secondary-container transition-colors">
                  Join Route & Lock Price
                </button>
              </div>

            </div>
          </div>

        </section>

      </main>

      <Footer />
    </div>
  )
}

export default Markets