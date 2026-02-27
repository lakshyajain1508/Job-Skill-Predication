import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  PolarAngleAxis,
  PolarGrid,
  Radar,
  RadarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { fetchAnalytics } from '../api/analyticsService'

const defaultDemandData = [
  { month: 'Jan', demand: 42 },
  { month: 'Feb', demand: 48 },
  { month: 'Mar', demand: 55 },
  { month: 'Apr', demand: 59 },
  { month: 'May', demand: 68 },
  { month: 'Jun', demand: 74 },
]

const defaultGrowthData = [
  { skill: 'Python', growth: 32 },
  { skill: 'React', growth: 21 },
  { skill: 'Hadoop', growth: -15 },
  { skill: 'SQL', growth: 12 },
  { skill: 'Blockchain', growth: -8 },
]

const defaultRadarData = [
  { subject: 'Tech Depth', A: 78 },
  { subject: 'Analytics', A: 84 },
  { subject: 'Communication', A: 63 },
  { subject: 'Business', A: 58 },
  { subject: 'AI Use', A: 70 },
]

function Analytics() {
  const [demandData, setDemandData] = useState(defaultDemandData)
  const [growthData, setGrowthData] = useState(defaultGrowthData)
  const [radarData, setRadarData] = useState(defaultRadarData)
  const [volatilityData, setVolatilityData] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadAnalytics = async () => {
      setIsLoading(true)
      try {
        const response = await fetchAnalytics()
        if (!isMounted) {
          return
        }

        setDemandData(
          Array.isArray(response?.demandTrend) && response.demandTrend.length
            ? response.demandTrend
            : defaultDemandData,
        )
        const growthEntries = Object.entries(response?.growthIndex || {}).slice(0, 8)
        setGrowthData(growthEntries.length
          ? growthEntries.map(([skill, growth]) => ({
              skill,
              growth: Number((Number(growth) * 100).toFixed(2)),
            }))
          : defaultGrowthData)

        const volatilityEntries = Object.entries(response?.volatility || {}).slice(0, 8)
        setVolatilityData(
          volatilityEntries.map(([skill, score]) => ({
            skill,
            volatility: Number(score),
          })),
        )
        setRadarData(
          Array.isArray(response?.radarSkills) && response.radarSkills.length
            ? response.radarSkills
            : defaultRadarData,
        )
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadAnalytics()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <section className="mx-auto max-w-7xl space-y-8 pt-6" data-loading={isLoading}>
      <div>
        <p className="font-ai text-xs tracking-[0.24em] text-cyan-200/80">CHARTS & VISUALIZATION</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white">Market Trend & Skill Growth Analytics</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass neon-border rounded-2xl p-5"
        >
          <h2 className="font-heading text-lg text-white">Demand Trend Graph</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={demandData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="month" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(56,189,248,0.35)' }} />
                <Line type="monotone" dataKey="demand" stroke="#22d3ee" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="glass neon-border rounded-2xl p-5"
        >
          <h2 className="font-heading text-lg text-white">Skill Growth Index</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="skill" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.35)' }} />
                <Bar dataKey="growth" radius={[6, 6, 0, 0]} animationDuration={1200}>
                  {growthData.map((entry) => (
                    <Cell key={entry.skill} fill={entry.growth >= 0 ? '#34d399' : '#f87171'} />
                  ))}
                </Bar>
                <defs>
                  <linearGradient id="colorGrowth" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#818cf8" />
                    <stop offset="100%" stopColor="#22d3ee" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
        className="glass neon-border rounded-2xl p-5"
      >
        <h2 className="font-heading text-lg text-white">Skill Volatility Score</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={volatilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
              <XAxis dataKey="skill" stroke="#cbd5e1" />
              <YAxis domain={[0, 100]} stroke="#cbd5e1" />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(34,211,238,0.35)' }} />
              <Bar dataKey="volatility" fill="#22d3ee" radius={[6, 6, 0, 0]} animationDuration={900} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {volatilityData.slice(0, 6).map((item) => (
            <span
              key={item.skill}
              className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100"
            >
              {item.skill}: {item.volatility}/100
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.14 }}
        className="glass neon-border rounded-2xl p-5"
      >
        <h2 className="font-heading text-lg text-white">Radar Skill Chart</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(148,163,184,0.35)" />
              <PolarAngleAxis dataKey="subject" stroke="#cbd5e1" />
              <Radar name="You" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.35} />
              <Legend />
              <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(34,211,238,0.35)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  )
}

export default Analytics
