import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import {
  HiArrowTrendingUp,
  HiOutlineLightBulb,
  HiOutlineSparkles,
  HiOutlineSquaresPlus,
} from 'react-icons/hi2'
import AnimatedCard from '../components/AnimatedCard'

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
  const cards = [
    {
      title: 'Skill Match Score',
      value: <CountUp end={83} suffix="%" />,
      subtitle: 'Strong match with Data/AI roles',
      icon: HiOutlineSparkles,
    },
    {
      title: 'Market Demand Index',
      value: <CountUp end={91} suffix="/100" />,
      subtitle: 'High opportunity in your target stack',
      icon: HiArrowTrendingUp,
    },
    {
      title: 'Missing Skills',
      value: <CountUp end={6} />,
      subtitle: 'Core skills prioritized by demand impact',
      icon: HiOutlineSquaresPlus,
    },
    {
      title: 'Career Prediction',
      value: 'AI Product Analyst',
      subtitle: 'Best-fit role projected over 6 months',
      icon: HiOutlineLightBulb,
    },
  ]

  return (
    <section className="mx-auto max-w-7xl space-y-8 pt-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <p className="font-ai text-xs tracking-[0.26em] text-cyan-200/80">AI ANALYTICS DASHBOARD</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white sm:text-4xl">Live Skill Gap Intelligence</h1>
      </motion.div>

      <div className="grid gap-5 lg:grid-cols-2 xl:grid-cols-4">
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
          className="glass neon-border rounded-2xl p-6 shadow-[0_20px_50px_rgba(59,130,246,0.12)]"
        >
          <h2 className="font-heading text-xl text-white">Demand Momentum Stream</h2>
          <div className="mt-5 space-y-4">
            {[
              ['Generative AI', 92],
              ['Cloud Data Engineering', 85],
              ['Product Analytics', 77],
              ['Data Visualization', 73],
            ].map(([label, value]) => (
              <div key={label}>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-300">{label}</span>
                  <span className="text-cyan-200">{value}%</span>
                </div>
                <div className="h-2 rounded-full bg-slate-800/70">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${value}%` }}
                    transition={{ duration: 0.9, ease: 'easeOut' }}
                    className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-400"
                  />
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div whileHover={{ y: -4 }} className="glass rounded-2xl border border-fuchsia-300/20 p-6">
          <h3 className="font-heading text-xl text-white">AI Notes</h3>
          <div className="mt-4 space-y-3 text-sm text-slate-300">
            <p className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">Students with SQL + BI + ML foundations show 2.4x faster interview readiness.</p>
            <p className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">Portfolio projects with business outcomes correlate with higher job conversion.</p>
            <p className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-3">Focus next 4 weeks on Python data workflows and dashboard communication.</p>
          </div>
        </motion.div>
      </div>
    </section>
  )
}

export default Dashboard
