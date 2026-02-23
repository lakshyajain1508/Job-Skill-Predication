import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import gsap from 'gsap'
import { HiArrowLongRight, HiBolt, HiChartBar, HiCpuChip } from 'react-icons/hi2'
import AIOrb from '../components/AIOrb'
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
  const ctaRef = useRef(null)

  useEffect(() => {
    if (!ctaRef.current) {
      return
    }
    const tween = gsap.to(ctaRef.current, {
      scale: 1.05,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'sine.inOut',
    })
    return () => tween.kill()
  }, [])

  return (
    <section className="relative mx-auto max-w-7xl space-y-20 pt-10 sm:pt-16">
      <AIOrb />

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
          <h1 className="font-heading text-4xl font-extrabold leading-tight text-white sm:text-6xl">
            Predict Your Future Skills with AI
          </h1>
          <p className="max-w-xl text-base text-slate-300 sm:text-lg">
            SkillGap AI analyzes global job dynamics and translates market shifts into a personalized, high-impact
            learning strategy for students and career switchers.
          </p>
          <div className="flex flex-wrap items-center gap-4">
            <button
              ref={ctaRef}
              className="button-ripple rounded-xl bg-gradient-to-r from-blue-500 via-indigo-500 to-cyan-400 px-6 py-3 font-semibold text-white shadow-[0_0_35px_rgba(34,211,238,0.45)]"
            >
              Launch Skill Prediction
            </button>
            <button className="rounded-xl border border-cyan-300/30 bg-slate-900/60 px-6 py-3 font-medium text-cyan-100 hover:border-cyan-200/50">
              Explore Demo
            </button>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} className="glass neon-border rounded-3xl p-5 sm:p-6">
          <p className="font-ai text-xs tracking-[0.2em] text-indigo-200">AI SIGNAL FEED</p>
          <div className="mt-4 space-y-4">
            {[
              ['Cloud + AI', '+22% demand surge'],
              ['Data Storytelling', '+16% role preference'],
              ['MLOps Fundamentals', 'Top skill gap in students'],
            ].map(([label, value]) => (
              <div key={label} className="rounded-xl border border-slate-700/40 bg-slate-900/40 p-4">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-300">{label}</p>
                  <span className="text-sm text-cyan-200">{value}</span>
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
        {features.map((item) => (
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
        <motion.h2 variants={fadeUp} className="font-heading text-3xl font-bold text-white sm:text-4xl">
          How It Works
        </motion.h2>
        <div className="relative rounded-3xl border border-indigo-300/20 bg-gradient-to-b from-slate-900/60 to-slate-950/70 p-6 sm:p-8">
          <div className="absolute left-7 top-12 hidden h-[78%] w-[2px] bg-gradient-to-b from-cyan-400/70 to-violet-400/30 sm:block" />
          <div className="space-y-7">
            {[
              ['Upload Profile', 'Add your skills, resume, and target career role.'],
              ['AI Market Scan', 'Engine maps profile against live demand and trend vectors.'],
              ['Roadmap Output', 'Get prioritized missing skills and learning milestones.'],
            ].map(([title, desc], index) => (
              <motion.div key={title} variants={fadeUp} className="flex gap-4 rounded-2xl border border-slate-700/30 bg-slate-900/35 p-5">
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-cyan-400/20 text-sm font-bold text-cyan-100">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-heading text-xl text-white">{title}</h3>
                  <p className="mt-1 text-slate-300">{desc}</p>
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
        className="glass neon-border rounded-3xl p-6 sm:p-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h3 className="font-heading text-2xl text-white">Ready to close your skill gap?</h3>
            <p className="mt-1 text-slate-300">Start your AI-powered journey and align with the future job market.</p>
          </div>
          <button className="button-ripple inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-cyan-500 px-5 py-3 font-semibold text-white">
            Begin Now <HiArrowLongRight className="text-lg" />
          </button>
        </div>
      </motion.div>
    </section>
  )
}

export default Home
