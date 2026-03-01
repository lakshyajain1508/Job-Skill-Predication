import { memo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

function AnimatedCard({ title, value, subtitle, icon: Icon, className = '', children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'card-3d rounded-2xl border border-white/10 bg-white/5 p-5 text-slate-100 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-gray-400">{title}</p>
          {value && <h3 className="mt-2 font-heading text-3xl font-bold text-cyan-400">{value}</h3>}
          {subtitle && <p className="mt-1 text-sm text-gray-400">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 text-cyan-300">
            <Icon className="text-xl" />
          </div>
        )}
      </div>
      {children}
    </motion.div>
  )
}

export default memo(AnimatedCard)
