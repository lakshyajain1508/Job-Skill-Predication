import { Suspense, lazy, useMemo } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import CursorGlow from './components/CursorGlow'
import LoadingSkeleton from './components/LoadingSkeleton'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import ThreeBackground from './components/ThreeBackground'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SkillInput = lazy(() => import('./pages/SkillInput'))
const Results = lazy(() => import('./pages/Results'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Analytics = lazy(() => import('./pages/Analytics'))

function PageFrame({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, filter: 'blur(8px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -12, filter: 'blur(8px)' }}
      transition={{ duration: 0.45, ease: [0.2, 0.65, 0.3, 1] }}
      className="min-h-[calc(100vh-7rem)]"
    >
      {children}
    </motion.div>
  )
}

function App() {
  const location = useLocation()
  const showSidebar = useMemo(() => location.pathname !== '/', [location.pathname])

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#02030a] text-slate-100">
      <ThreeBackground />
      <div className="animated-aurora" />
      <div className="grid-overlay" />
      <CursorGlow />

      <Navbar />

      <div className="relative z-10 flex pt-20">
        {showSidebar && <Sidebar />}
        <main className={`w-full px-4 pb-10 sm:px-6 lg:px-10 ${showSidebar ? 'md:ml-20' : ''}`}>
          <AnimatePresence mode="wait">
            <Suspense
              fallback={
                <div className="mx-auto mt-8 grid max-w-6xl gap-5">
                  <LoadingSkeleton className="h-24" />
                  <LoadingSkeleton className="h-48" />
                  <LoadingSkeleton className="h-64" />
                </div>
              }
            >
              <Routes location={location} key={location.pathname}>
                <Route path="/" element={<PageFrame><Home /></PageFrame>} />
                <Route path="/dashboard" element={<PageFrame><Dashboard /></PageFrame>} />
                <Route path="/skills" element={<PageFrame><SkillInput /></PageFrame>} />
                <Route path="/results" element={<PageFrame><Results /></PageFrame>} />
                <Route path="/roadmap" element={<PageFrame><Roadmap /></PageFrame>} />
                <Route path="/analytics" element={<PageFrame><Analytics /></PageFrame>} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Suspense>
          </AnimatePresence>
        </main>
      </div>
    </div>
  )
}

export default App
