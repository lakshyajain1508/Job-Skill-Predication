import { memo, useMemo } from 'react'
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
  const navLinks = useMemo(() => links, [])

  return (
    <aside className="fixed left-0 top-24 z-20 hidden h-[calc(100vh-7rem)] w-20 px-3 md:block">
      <div className="card-3d flex h-full flex-col items-center gap-4 rounded-2xl border border-white/10 bg-white/5 py-4 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200">
        {navLinks.map(({ to, icon: Icon, label }) => (
          <NavLink key={to} to={to} className="group relative">
            {({ isActive }) => (
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl border text-lg transition-all duration-200 ${
                  isActive
                    ? 'border-cyan-400/60 bg-cyan-400/15 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.35)]'
                    : 'border-white/10 bg-white/5 text-gray-300 group-hover:border-cyan-400/40 group-hover:bg-white/10 group-hover:text-white'
                }`}
                title={label}
              >
                <Icon />
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </aside>
  )
}

export default memo(Sidebar)
