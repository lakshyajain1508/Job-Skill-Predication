import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  HiArrowTrendingUp,
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineSquaresPlus,
} from 'react-icons/hi2'
import AnimatedCard from '../components/AnimatedCard'
import { fetchDashboard } from '../api/dashboardService'
import { fetchPortfolio } from '../api/intelligenceService'

function CountUp({ end, suffix = '' }) {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame = 0
    const totalFrames = 55
    const timer = setInterval(() => {
      frame += 1
      const progress = frame / totalFrames
      setValue(Math.round(end * progress))
      if (frame >= totalFrames) {
        clearInterval(timer)
      }
    }, 18)
    return () => clearInterval(timer)
  }, [end])

  return (
    <span>
      {value}
      {suffix}
    </span>
  )
}

function Dashboard() {
  const [dashboardData, setDashboardData] = useState({
    skill_match: 83,
    market_demand: 91,
    missing_skills_count: 6,
    career_prediction: 'AI Product Analyst',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [portfolio, setPortfolio] = useState({
    salary_projection: '8-12 LPA',
    growth_potential: 50,
    risk_level: 'Medium',
  })

  useEffect(() => {
    let isMounted = true
    const loadDashboard = async () => {
      setIsLoading(true)
      try {
        const [data, portfolioData] = await Promise.all([
          fetchDashboard(),
          fetchPortfolio(
            (() => {
              try {
                const raw = sessionStorage.getItem('user_skills')
                const parsed = raw ? JSON.parse(raw) : []
                return Array.isArray(parsed) ? parsed : []
              } catch {
                return []
              }
            })(),
          ),
        ])

        if (isMounted && data) {
          setDashboardData({
            skill_match: Number(data.skill_match ?? 0),
            market_demand: Number(data.market_demand ?? 0),
            missing_skills_count: Number(data.missing_skills_count ?? 0),
            career_prediction: data.career_prediction || 'Data Scientist',
          })

          setPortfolio({
            salary_projection: portfolioData?.salary_projection || '8-12 LPA',
            growth_potential: Number(portfolioData?.growth_potential ?? 50),
            risk_level: portfolioData?.risk_level || 'Medium',
          })
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadDashboard()
    return () => {
      isMounted = false
    }
  }, [])

  const cards = useMemo(() => [
    {
      title: 'Skill Match Score',
      value: <CountUp end={dashboardData.skill_match} suffix="%" />,
      subtitle: 'Strong match with Data/AI roles',
      icon: HiOutlineSparkles,
    },
    {
      title: 'Market Demand Index',
      value: <CountUp end={dashboardData.market_demand} suffix="/100" />,
      subtitle: 'High opportunity in your target stack',
      icon: HiArrowTrendingUp,
    },
    {
      title: 'Missing Skills',
      value: <CountUp end={dashboardData.missing_skills_count} />,
      subtitle: 'Core skills prioritized by demand impact',
      icon: HiOutlineSquaresPlus,
    },
    {
      title: 'Career Prediction',
      value: dashboardData.career_prediction,
      subtitle: 'Best-fit role projected over 6 months',
      icon: HiOutlineLightBulb,
    },
    {
      title: 'Skill Portfolio',
      value: portfolio.salary_projection,
      subtitle: `Growth ${portfolio.growth_potential}/100 • Risk ${portfolio.risk_level}`,
      icon: HiOutlineSparkles,
    },
  ], [dashboardData, portfolio])

  return (
    <section className="mx-auto max-w-7xl space-y-8 pt-6">
      <motion.div transition={{ duration: 0.2 }}>
        <p className="font-ai text-xs tracking-[0.26em] text-cyan-200/80">AI ANALYTICS DASHBOARD</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">Live Skill Gap Intelligence</h1>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4" data-loading={isLoading}>
        {cards.map((card) => (
          <AnimatedCard
            key={card.title}
            title={card.title}
            value={card.value}
            subtitle={card.subtitle}
            icon={card.icon}
          />
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[1.4fr_0.6fr]">
        <motion.div
          whileHover={{ y: -4 }}
          className="card-3d rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl"
        >
          <h2 className="font-heading text-xl font-semibold tracking-tight text-white">Demand Momentum Stream</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Generative AI', 92],
              ['Cloud Data Engineering', 85],
              ['Product Analytics', 77],
              ['Data Visualization', 73],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-gray-400">{label}</span>
                  <span className="font-bold text-cyan-400">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <motion.div
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full bg-linear-to-r from-cyan-400 via-indigo-500 to-violet-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="card-3d rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl">
          <h3 className="font-heading text-xl font-semibold tracking-tight text-white">AI Notes</h3>
          <div className="mt-4 space-y-3 text-sm text-gray-400">
            <p className="rounded-xl border border-white/10 bg-white/5 p-3">Students with SQL + BI + ML foundations show 2.4x faster interview readiness.</p>
            <p className="rounded-xl border border-white/10 bg-white/5 p-3">Portfolio projects with business outcomes correlate with higher job conversion.</p>
            <p className="rounded-xl border border-white/10 bg-white/5 p-3">Focus next 4 weeks on Python data workflows and dashboard communication.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Dashboard
