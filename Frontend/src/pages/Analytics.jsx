import { useEffect, useMemo, useState } from 'react'
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
  const memoDemandData = useMemo(() => demandData, [demandData])
  const memoGrowthData = useMemo(() => growthData, [growthData])
  const memoVolatilityData = useMemo(() => volatilityData, [volatilityData])
  const memoRadarData = useMemo(() => radarData, [radarData])

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
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white">Market Trend & Skill Growth Analytics</h1>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <motion.div transition={{ duration: 0.2 }} className="card-3d rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl">
          <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Demand Trend Graph</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={memoDemandData}>
                <defs>
                  <linearGradient id="lineDemandStroke" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#22d3ee" />
                    <stop offset="100%" stopColor="#3b82f6" />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="month" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(56,189,248,0.3)' }} />
                <Line type="monotone" dataKey="demand" stroke="url(#lineDemandStroke)" strokeWidth={3} dot={{ r: 4, fill: '#22d3ee' }} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div
          transition={{ duration: 0.2 }}
          className="card-3d rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl"
        >
          <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Skill Growth Index</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={memoGrowthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
                <XAxis dataKey="skill" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" />
                <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(99,102,241,0.3)' }} />
                <Bar dataKey="growth" radius={[6, 6, 0, 0]} isAnimationActive={false}>
                  {memoGrowthData.map((entry) => (
                    <Cell key={entry.skill} fill={entry.growth >= 0 ? '#22d3ee' : '#fb7185'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      <motion.div transition={{ duration: 0.2 }} className="card-3d rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Skill Volatility Score</h2>
        <div className="mt-4 h-72">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={memoVolatilityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.12)" />
              <XAxis dataKey="skill" stroke="#94a3b8" />
              <YAxis domain={[0, 100]} stroke="#94a3b8" />
              <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(34,211,238,0.3)' }} />
              <Bar dataKey="volatility" fill="#22d3ee" radius={[8, 8, 0, 0]} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {memoVolatilityData.slice(0, 6).map((item) => (
            <span
              key={item.skill}
              className="rounded-full border border-cyan-300/25 bg-cyan-500/10 px-3 py-1 text-xs text-cyan-100"
            >
              {item.skill}: {item.volatility}/100
            </span>
          ))}
        </div>
      </motion.div>

      <motion.div transition={{ duration: 0.2 }} className="card-3d rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl">
        <h2 className="font-heading text-lg font-semibold tracking-tight text-white">Radar Skill Chart</h2>
        <div className="mt-4 h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={memoRadarData}>
              <PolarGrid stroke="rgba(148,163,184,0.2)" />
              <PolarAngleAxis dataKey="subject" stroke="#94a3b8" />
              <Radar name="You" dataKey="A" stroke="#22d3ee" fill="#22d3ee" fillOpacity={0.28} isAnimationActive={false} />
              <Legend />
              <Tooltip contentStyle={{ background: '#0b1120', border: '1px solid rgba(34,211,238,0.3)' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </section>
  )
}

export default Analytics
