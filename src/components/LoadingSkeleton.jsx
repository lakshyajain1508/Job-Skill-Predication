function LoadingSkeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-600/30 bg-slate-800/35 ${className}`}
    >
      <div className="absolute inset-0 animate-pulse bg-slate-700/25" />
      <div className="absolute inset-y-0 left-0 w-1/2 -skew-x-12 bg-gradient-to-r from-transparent via-cyan-200/15 to-transparent animate-[shimmer_1.6s_linear_infinite]" />
    </div>
  )
}

export default LoadingSkeleton
