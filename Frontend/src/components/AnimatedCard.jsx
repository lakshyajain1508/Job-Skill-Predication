import { memo } from 'react'
import { motion } from 'framer-motion'
import clsx from 'clsx'

function AnimatedCard({ title, value, subtitle, icon: Icon, className = '', children }) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className={clsx(
        'glass neon-border rounded-2xl p-5 text-slate-100 shadow-[0_20px_60px_rgba(2,132,199,0.12)]',
        className,
      )}
    >
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] text-cyan-200/80">{title}</p>
          {value && <h3 className="mt-2 font-heading text-3xl font-bold text-white">{value}</h3>}
          {subtitle && <p className="mt-1 text-sm text-slate-300">{subtitle}</p>}
        </div>
        {Icon && (
          <div className="rounded-xl border border-cyan-300/20 bg-cyan-500/10 p-3 text-cyan-300">
            <Icon className="text-xl" />
          </div>
        )}
      </div>
      {children}
    </motion.div>
  )
}

export default memo(AnimatedCard)
