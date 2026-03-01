import { memo, useCallback, useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { HiBars3BottomRight, HiXMark } from 'react-icons/hi2'

const links = [
  { to: '/', label: 'Home' },
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/skills', label: 'Skills' },
  { to: '/results', label: 'Results' },
  { to: '/roadmap', label: 'Roadmap' },
  { to: '/analytics', label: 'Analytics' },
]

function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const navLinks = useMemo(() => links, [])
  const goToSkills = useCallback(() => navigate('/skills'), [navigate])
  const toggleMenu = useCallback(() => setMenuOpen((prev) => !prev), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 px-4 transition-all sm:px-6 lg:px-10 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <nav
        className={`navbar-glow mx-auto flex max-w-7xl items-center justify-between rounded-2xl border border-b border-white/10 bg-black/40 px-4 py-3 backdrop-blur-lg transition-all sm:px-6 ${
          scrolled
            ? 'shadow-lg shadow-black/40'
            : 'md:border-transparent md:bg-transparent md:backdrop-blur-0'
        }`}
      >
        <div className="rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 font-ai text-sm tracking-[0.18em] text-white">
          SKILLGAP AI
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group relative rounded-lg px-3 py-2 text-sm transition-all duration-200 ${
                  isActive ? 'text-cyan-300' : 'text-gray-300 hover:text-white'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {link.label}
                  <motion.span
                    className="absolute bottom-0 left-2 h-0.5 rounded-full bg-linear-to-r from-cyan-400 via-indigo-400 to-violet-400"
                    initial={{ width: 0 }}
                    animate={{ width: isActive ? 'calc(100% - 1rem)' : 0 }}
                    transition={{ duration: 0.2 }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <button
          type="button"
          onClick={goToSkills}
          className="button-ripple btn-3d hidden rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:from-cyan-400 hover:to-blue-400 md:block"
        >
          Start Predicting
        </button>

        <button
          type="button"
          onClick={toggleMenu}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white transition duration-200 hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <HiXMark className="text-xl" /> : <HiBars3BottomRight className="text-xl" />}
        </button>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-white/10 bg-black/50 p-3 backdrop-blur-md md:hidden"
          >
            <div className="grid gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm ${
                      isActive
                        ? 'bg-white/10 text-cyan-300'
                        : 'text-gray-200 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button
                type="button"
                onClick={goToSkills}
                className="button-ripple btn-3d mt-1 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-4 py-2 text-sm font-medium text-white transition duration-200 hover:from-cyan-400 hover:to-blue-400"
              >
                Start Predicting
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default memo(Navbar)
