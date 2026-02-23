import { motion } from 'framer-motion'
import { HiSparkles } from 'react-icons/hi2'

function AIOrb() {
  return (
    <motion.div
      animate={{ y: [0, -10, 0], rotate: [0, 4, -4, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="glass neon-border fixed bottom-8 right-6 z-20 hidden items-center gap-3 rounded-full px-4 py-2 text-sm text-cyan-100 shadow-[0_0_30px_rgba(6,182,212,0.4)] lg:flex"
    >
      <span className="relative flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/20">
        <span className="absolute inset-0 animate-ping rounded-full bg-cyan-300/25" />
        <HiSparkles className="relative text-cyan-200" />
      </span>
      AI Assistant Active
    </motion.div>
  )
}

export default AIOrb
