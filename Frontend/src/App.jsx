import { Suspense, lazy, useMemo } from 'react'
import { Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Global3DBackground from './components/Global3DBackground'
import LoadingSkeleton from './components/LoadingSkeleton'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

const Home = lazy(() => import('./pages/Home'))
const Dashboard = lazy(() => import('./pages/Dashboard'))
const SkillInput = lazy(() => import('./pages/SkillInput'))
const Results = lazy(() => import('./pages/Results'))
const Roadmap = lazy(() => import('./pages/Roadmap'))
const Analytics = lazy(() => import('./pages/Analytics'))

function PageFrame({ children }) {
  return <div className="min-h-[calc(100vh-7rem)]">{children}</div>
}

function App() {
  const location = useLocation()
  const showSidebar = useMemo(() => location.pathname !== '/', [location.pathname])

  return (
    <div className="relative min-h-screen overflow-x-hidden text-slate-100">
      <Global3DBackground />
      <Navbar />

      <div className="relative z-10 flex pt-20">
        {showSidebar && <Sidebar />}
        <main className={`w-full px-4 pb-10 sm:px-6 lg:px-10 ${showSidebar ? 'md:ml-20' : ''}`}>
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
        </main>
      </div>
    </div>
  )
}

export default App
