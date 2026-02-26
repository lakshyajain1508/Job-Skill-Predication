import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { HiCheckBadge, HiSparkles } from 'react-icons/hi2'
import LoadingSkeleton from '../components/LoadingSkeleton'

const defaultPrediction = {
  match_score: 78,
  missing_skills: ['MLOps', 'A/B Testing', 'Feature Engineering', 'Stakeholder Storytelling'],
  career_prediction: 'Data Scientist',
}

function Results() {
  const [loading, setLoading] = useState(true)
  const [prediction, setPrediction] = useState(defaultPrediction)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('prediction')
      if (raw) {
        const parsed = JSON.parse(raw)
        setPrediction({
          match_score: parsed?.match_score ?? defaultPrediction.match_score,
          missing_skills:
            Array.isArray(parsed?.missing_skills) && parsed.missing_skills.length
              ? parsed.missing_skills
              : defaultPrediction.missing_skills,
          career_prediction: parsed?.career_prediction || defaultPrediction.career_prediction,
        })
      }
    } catch {
      setPrediction(defaultPrediction)
    }

    const timer = setTimeout(() => setLoading(false), 1700)
    return () => clearTimeout(timer)
  }, [])

  if (loading) {
    return (
      <section className="mx-auto max-w-6xl space-y-5 pt-8">
        <div className="flex items-center gap-3 text-cyan-200">
          <HiSparkles className="text-xl" />
          <span className="font-ai text-xs tracking-[0.25em]">AI THINKING...</span>
          <div className="flex gap-1">
            {[0, 1, 2].map((index) => (
              <span
                key={index}
                className="h-2 w-2 rounded-full bg-cyan-300"
                style={{ animation: `pulseDot 1.1s ${index * 0.15}s infinite` }}
              />
            ))}
          </div>
        </div>
        <LoadingSkeleton className="h-32" />
        <div className="grid gap-5 md:grid-cols-2">
          <LoadingSkeleton className="h-56" />
          <LoadingSkeleton className="h-56" />
        </div>
      </section>
    )
  }

  return (
    <section className="mx-auto max-w-6xl space-y-8 pt-6">
      <div>
        <p className="font-ai text-xs tracking-[0.25em] text-cyan-200/80">SKILL GAP RESULT</p>
        <h1 className="mt-2 font-heading text-3xl font-bold text-white">AI-Powered Career Readiness Output</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass neon-border rounded-3xl p-6"
        >
          <p className="text-sm text-slate-300">Overall Match</p>
          <div className="mt-4 flex items-center justify-center">
            <div
              className="relative flex h-56 w-56 items-center justify-center rounded-full"
              style={{
                background:
                  'conic-gradient(from 120deg, rgba(34,211,238,1) 0deg, rgba(99,102,241,1) 220deg, rgba(30,41,59,0.5) 220deg 360deg)',
              }}
            >
              <div className="absolute inset-4 rounded-full bg-slate-950/90" />
              <div className="relative text-center">
                <p className="font-heading text-5xl font-bold text-white">{prediction.match_score}%</p>
                <p className="text-xs uppercase tracking-[0.16em] text-cyan-200/80">Readiness</p>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
          <div className="glass rounded-2xl border border-slate-700/40 p-5">
            <h2 className="font-heading text-xl text-white">Skill Comparison</h2>
            <div className="mt-4 space-y-3">
              {[
                ['Python for Data', 88],
                ['SQL Optimization', 72],
                ['Power BI / Tableau', 65],
                ['MLOps Basics', 44],
              ].map(([label, value]) => (
                <div key={label}>
                  <div className="mb-1 flex justify-between text-sm">
                    <span className="text-slate-300">{label}</span>
                    <span className="text-cyan-200">{value}%</span>
                  </div>
                  <div className="h-2 rounded-full bg-slate-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${value}%` }}
                      transition={{ duration: 0.8 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-400 via-indigo-500 to-violet-400"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl border border-slate-700/40 p-5">
            <h3 className="font-heading text-xl text-white">Missing Skills</h3>
            <div className="mt-3 flex flex-wrap gap-2">
              {prediction.missing_skills.map((item) => (
                <span key={item} className="glow-chip rounded-full bg-fuchsia-500/10 px-3 py-1 text-sm text-fuchsia-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass neon-border rounded-2xl p-6"
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-ai text-xs tracking-[0.18em] text-indigo-200">AI RECOMMENDATION</p>
            <h3 className="mt-2 font-heading text-2xl text-white">Fastest Path: {prediction.career_prediction}</h3>
            <p className="mt-2 max-w-3xl text-slate-300">
              Prioritize MLOps foundations, dashboard storytelling, and experimentation design. You can close the current
              gap in approximately 10 weeks with consistent weekly execution.
            </p>
          </div>
          <span className="inline-flex items-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-100">
            <HiCheckBadge /> Growth Probability: High
          </span>
        </div>
      </motion.div>
    </section>
  )
}

export default Results
