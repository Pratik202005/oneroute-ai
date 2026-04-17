function Footer() {
  return (
    <footer className="w-full py-12 px-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-slate-50 border-t border-slate-200/10">
      
      {/* Left: Brand */}
      <div className="flex flex-col gap-2 items-center md:items-start">
        <span className="font-headline font-bold text-slate-900">
          OneRoute AI
        </span>
        <p className="font-body text-sm tracking-wide text-slate-600">
          © 2024 OneRoute AI. Built with Google Cloud Precision.
        </p>
      </div>

      {/* Right: Links */}
      <div className="flex gap-8">
        <a href="#" className="text-slate-500 hover:text-slate-800 underline decoration-teal-500/30 underline-offset-4 transition-all opacity-80 hover:opacity-100">
          Google Maps
        </a>
        <a href="#" className="text-slate-500 hover:text-slate-800 underline decoration-teal-500/30 underline-offset-4 transition-all opacity-80 hover:opacity-100">
          Vertex AI
        </a>
        <a href="#" className="text-slate-500 hover:text-slate-800 underline decoration-teal-500/30 underline-offset-4 transition-all opacity-80 hover:opacity-100">
          Firebase
        </a>
        <a href="#" className="text-slate-500 hover:text-slate-800 underline decoration-teal-500/30 underline-offset-4 transition-all opacity-80 hover:opacity-100">
          BigQuery
        </a>
      </div>
    </footer>
  )
}

export default Footer