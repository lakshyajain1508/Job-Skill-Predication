import { memo } from 'react'

function LoadingSkeleton({ className = '' }) {
  return (
    <div
      className={`relative overflow-hidden rounded-xl border border-slate-600/30 bg-slate-800/35 ${className}`}
    >
      <div className="absolute inset-0 bg-slate-700/25" />
    </div>
  )
}

export default memo(LoadingSkeleton)
