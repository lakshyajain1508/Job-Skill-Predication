import { memo, useCallback, useMemo } from 'react'
import { motion } from 'framer-motion'
import { HiArrowLongRight, HiBolt, HiChartBar, HiCpuChip } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import AnimatedCard from '../components/AnimatedCard'
import { fadeUp, staggerContainer } from '../animations/variants'

const features = [
  {
    title: 'Market Intelligence AI',
    desc: 'Track emerging role demand shifts and forecast hiring trends in real-time.',
    icon: HiChartBar,
  },
  {
    title: 'Skill Gap Prediction',
    desc: 'Compare your current stack against target job clusters to identify missing capabilities.',
    icon: HiCpuChip,
  },
  {
    title: 'Actionable Pathways',
    desc: 'Generate personalized course roadmap with milestone-based outcomes.',
    icon: HiBolt,
  },
]

function Home() {
  const navigate = useNavigate()
  const featureItems = useMemo(() => features, [])
  const goSkills = useCallback(() => navigate('/skills'), [navigate])
  const goDashboard = useCallback(() => navigate('/dashboard'), [navigate])

  return (
    <section className="relative mx-auto max-w-7xl space-y-20 pt-10 sm:pt-16">
      <div className="pointer-events-none absolute -top-14 left-10 h-52 w-52 rounded-full bg-cyan-500/20 blur-3xl" />
      <div className="pointer-events-none absolute right-0 top-16 h-56 w-56 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="pointer-events-none absolute bottom-20 left-1/2 h-52 w-52 -translate-x-1/2 rounded-full bg-indigo-500/15 blur-3xl" />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="relative grid gap-8 lg:grid-cols-[1.2fr_0.8fr]"
      >
        <motion.div variants={fadeUp} className="space-y-7">
          <p className="font-ai text-xs tracking-[0.35em] text-cyan-200/80">NEXT-GEN AI EDTECH PLATFORM</p>
          <h1 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-white sm:text-6xl">
            Predict Your Future Skills with AI
          </h1>
          <p className="max-w-xl text-base text-gray-400 sm:text-lg">
            SkillGap AI analyzes global job dynamics and translates market shifts into a personalized, high-impact
            learning strategy for students and career switchers.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={goSkills}
              className="button-ripple btn-3d rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-3 font-semibold text-white transition duration-200 hover:from-cyan-400 hover:to-blue-400"
            >
              Launch Skill Prediction
            </button>
            <button
              type="button"
              onClick={goDashboard}
              className="rounded-xl border border-white/10 bg-white/5 px-6 py-3 font-medium text-gray-200 transition duration-200 hover:bg-white/10 hover:text-white"
            >
              Explore Demo
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="card-3d glow-soft rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl sm:p-6">
          <p className="font-ai text-xs tracking-[0.2em] text-indigo-200">AI SIGNAL FEED</p>
          <div className="mt-4 space-y-4">
            {[
              ['Cloud + AI', '+22% demand surge'],
              ['Data Storytelling', '+16% role preference'],
              ['MLOps Fundamentals', 'Top skill gap in students'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-400">{label}</p>
                  <span className="text-sm font-bold text-cyan-400">{value}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </motion.div>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3"
      >
        {featureItems.map((item) => (
          <motion.div key={item.title} variants={fadeUp}>
            <AnimatedCard title={item.title} subtitle={item.desc} icon={item.icon} className="h-full" />
          </motion.div>
        ))}
      </motion.section>

      <motion.section
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
        variants={staggerContainer}
        className="space-y-8"
      >
        <motion.h2 variants={fadeUp} className="font-heading text-3xl font-semibold tracking-tight text-white sm:text-4xl">
          How It Works
        </motion.h2>
        <div className="card-3d relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl sm:p-8">
          <div className="absolute left-7 top-12 hidden h-[78%] w-0.5 bg-linear-to-b from-cyan-400/70 to-violet-400/30 sm:block" />
          <div className="space-y-7">
            {[
              ['Upload Profile', 'Add your skills, resume, and target career role.'],
              ['AI Market Scan', 'Engine maps profile against live demand and trend vectors.'],
              ['Roadmap Output', 'Get prioritized missing skills and learning milestones.'],
            ].map(([title, desc], index) => (
              <motion.div key={title} variants={fadeUp} className="card-3d flex gap-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/15 text-sm font-bold text-cyan-400">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-heading text-xl font-semibold tracking-tight text-white">{title}</h3>
                  <p className="mt-1 text-gray-400">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.div
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="card-3d rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl font-semibold tracking-tight text-white">Ready to close your skill gap?</h3>
            <p className="mt-1 text-gray-400">Start your AI-powered journey and align with the future job market.</p>
          </div>
          <button
            type="button"
            onClick={goSkills}
            className="button-ripple btn-3d inline-flex items-center gap-2 rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-5 py-3 font-semibold text-white transition duration-200 hover:from-cyan-400 hover:to-blue-400"
          >
            Begin Now <HiArrowLongRight className="text-lg" />
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default memo(Home)
