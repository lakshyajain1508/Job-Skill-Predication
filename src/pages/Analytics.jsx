import { motion } from 'framer-motion'
import {
  Bar,
  BarChart,
  CartesianGrid,
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

const demandData = [
  { month: 'Jan', demand: 42 },
  { month: 'Feb', demand: 48 },
  { month: 'Mar', demand: 55 },
  { month: 'Apr', demand: 59 },
  { month: 'May', demand: 68 },
  { month: 'Jun', demand: 74 },
]

const growthData = [
  { skill: 'Python', growth: 82 },
  { skill: 'SQL', growth: 67 },
  { skill: 'MLOps', growth: 48 },
  { skill: 'BI Tools', growth: 71 },
  { skill: 'Storytelling', growth: 64 },
]

const radarData = [
  { subject: 'Tech Depth', A: 78 },
  { subject: 'Analytics', A: 84 },
  { subject: 'Communication', A: 63 },
  { subject: 'Business', A: 58 },
  { subject: 'AI Use', A: 70 },
]

function Analytics() {
  return (
    <section className="mx-auto max-w-7xl space-y-8 pt-6">
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
          <h2 className="font-heading text-lg text-white">Skill Growth Chart</h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(148,163,184,0.2)" />
                <XAxis dataKey="skill" stroke="#cbd5e1" />
                <YAxis stroke="#cbd5e1" />
                <Tooltip contentStyle={{ background: '#0f172a', border: '1px solid rgba(99,102,241,0.35)' }} />
                <Bar dataKey="growth" fill="url(#colorGrowth)" radius={[6, 6, 0, 0]} animationDuration={1200} />
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
