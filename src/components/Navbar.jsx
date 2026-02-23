import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { NavLink, useLocation } from 'react-router-dom'
import gsap from 'gsap'
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
  const logoRef = useRef(null)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!logoRef.current) {
      return
    }
    const tween = gsap.to(logoRef.current, {
      boxShadow: '0 0 20px rgba(34, 211, 238, 0.4), 0 0 60px rgba(79, 70, 229, 0.35)',
      repeat: -1,
      yoyo: true,
      duration: 2.4,
      ease: 'sine.inOut',
    })
    return () => tween.kill()
  }, [])

  return (
    <header
      className={`fixed inset-x-0 top-0 z-30 px-4 transition-all sm:px-6 lg:px-10 ${
        scrolled ? 'py-2' : 'py-4'
      }`}
    >
      <nav
        className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-3 transition-all sm:px-6 ${
          scrolled
            ? 'glass border-cyan-300/20 shadow-[0_12px_40px_rgba(8,145,178,0.12)]'
            : 'glass border-cyan-300/15 md:border-transparent md:bg-transparent md:backdrop-blur-0'
        }`}
      >
        <div
          ref={logoRef}
          className="rounded-xl border border-indigo-300/30 bg-indigo-500/20 px-3 py-1.5 font-ai text-sm tracking-[0.18em] text-cyan-100"
        >
          SKILLGAP AI
        </div>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `group relative rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive ? 'text-cyan-200' : 'text-slate-300 hover:text-cyan-100'
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
                    transition={{ duration: 0.3 }}
                  />
                </>
              )}
            </NavLink>
          ))}
        </div>

        <button className="button-ripple hidden rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-300/20 md:block">
          Start Predicting
        </button>

        <button
          type="button"
          onClick={() => setMenuOpen((prev) => !prev)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-slate-900/60 text-cyan-100 md:hidden"
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
            className="mx-auto mt-2 max-w-7xl rounded-2xl border border-cyan-300/20 bg-slate-950/85 p-3 backdrop-blur-xl md:hidden"
          >
            <div className="grid gap-1">
              {links.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `rounded-xl px-3 py-2 text-sm ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-100'
                        : 'text-slate-200 hover:bg-slate-800/70 hover:text-cyan-100'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <button className="button-ripple mt-1 rounded-xl border border-cyan-300/30 bg-cyan-400/15 px-4 py-2 text-sm font-medium text-cyan-100 hover:bg-cyan-300/20">
                Start Predicting
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

export default Navbar
