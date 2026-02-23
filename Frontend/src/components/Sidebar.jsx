import { motion } from 'framer-motion'
import { NavLink } from 'react-router-dom'
import {
  HiHome,
  HiOutlineChartBar,
  HiOutlineClipboardDocumentList,
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineSquares2X2,
} from 'react-icons/hi2'

const links = [
  { to: '/dashboard', icon: HiOutlineSquares2X2, label: 'Dashboard' },
  { to: '/skills', icon: HiOutlineClipboardDocumentList, label: 'Input' },
  { to: '/results', icon: HiOutlineSparkles, label: 'Results' },
  { to: '/roadmap', icon: HiOutlineLightBulb, label: 'Roadmap' },
  { to: '/analytics', icon: HiOutlineChartBar, label: 'Analytics' },
  { to: '/', icon: HiHome, label: 'Home' },
]

function Sidebar() {
  return (
    <aside className="fixed left-0 top-24 z-20 hidden h-[calc(100vh-7rem)] w-20 px-3 md:block">
      <div className="glass neon-border flex h-full flex-col items-center gap-4 rounded-2xl py-4">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="group relative">
            {({ isActive }) => (
              <motion.div
                whileHover={{ scale: 1.08, y: -2 }}
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition-all ${
                  isActive
                    ? 'border-cyan-300/50 bg-cyan-400/20 text-cyan-100 shadow-[0_0_24px_rgba(34,211,238,0.4)]'
                    : 'border-slate-600/40 bg-slate-800/30 text-slate-300 group-hover:border-cyan-300/40 group-hover:text-cyan-100'
                }`}
                title={label}
              >
                <Icon />
              </motion.div>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default Sidebar
