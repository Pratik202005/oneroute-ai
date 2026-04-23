function PageBackground() {
  return (
    <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
      {/* Use your existing landing aurora */}
      <div className="absolute inset-0 landing-bg" />

      {/* Glow blobs */}
      <div className="absolute -top-24 -left-24 w-[420px] h-[420px] rounded-full blur-[110px] bg-[#14B8A6]/22 animate-floatSlow" />
      <div className="absolute -bottom-32 -right-32 w-[520px] h-[520px] rounded-full blur-[130px] bg-[#1e3a8a]/28 animate-floatSlow" />

      {/* Noise */}
      <div className="absolute inset-0 landing-noise opacity-[0.10]" />
    </div>
  )
}

export default PageBackground