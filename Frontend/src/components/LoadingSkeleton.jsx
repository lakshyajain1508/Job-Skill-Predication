import { memo } from 'react'

function LoadingSkeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm shadow-lg shadow-black/20 ${className}`}
    >
      <div className="absolute inset-0 bg-white/5" />
    </div>
  )
}

export default memo(LoadingSkeleton)
