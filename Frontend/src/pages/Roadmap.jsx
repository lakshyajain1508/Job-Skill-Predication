import { useState } from 'react'
import { motion } from 'framer-motion'
import { HiChevronDown } from 'react-icons/hi2'

const roadmapSteps = [
  {
    title: 'Milestone 1 · Foundations',
    duration: 'Week 1-2',
    modules: ['Python Data Pipelines', 'Advanced SQL Patterns', 'EDA Storytelling'],
  },
  {
    title: 'Milestone 2 · Applied AI',
    duration: 'Week 3-6',
    modules: ['Feature Engineering', 'Model Evaluation', 'Prompt Design for Analytics'],
  },
  {
    title: 'Milestone 3 · Portfolio & Hiring',
    duration: 'Week 7-10',
    modules: ['Capstone Build', 'Business Case Deck', 'Interview Scenario Practice'],
  },
]

function Roadmap() {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <section className="mx-auto max-w-5xl space-y-8 pt-6">
      <div>
        <p className="font-ai text-xs tracking-[0.24em] text-cyan-200/80">LEARNING ROADMAP</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white">Your Personalized Skill Growth Timeline</h1>
      </div>

      <div className="relative space-y-5">
        <div className="absolute left-5 top-3 h-[94%] w-[2px] bg-gradient-to-b from-cyan-400/80 via-indigo-400/55 to-violet-500/20" />

        {roadmapSteps.map((step, index) => {
          const open = openIndex === index
          return (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.08 }}
              className="relative pl-14"
            >
              <span className="absolute left-0 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/50 bg-cyan-400/15 shadow-[0_0_24px_rgba(34,211,238,0.45)]">
                <span className="h-3 w-3 rounded-full bg-cyan-300" />
              </span>

              <div className="glass rounded-2xl border border-slate-700/40 p-5">
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? -1 : index)}
                  className="flex w-full items-center justify-between text-left"
                >
                  <div>
                    <p className="font-heading text-xl text-white">{step.title}</p>
                    <p className="text-sm text-cyan-200">{step.duration}</p>
                  </div>
                  <motion.span animate={{ rotate: open ? 180 : 0 }}>
                    <HiChevronDown className="text-xl text-cyan-200" />
                  </motion.span>
                </button>

                <motion.div
                  initial={false}
                  animate={{ height: open ? 'auto' : 0, opacity: open ? 1 : 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-2">
                    {step.modules.map((module) => (
                      <div key={module} className="rounded-xl border border-slate-700/40 bg-slate-900/45 px-3 py-2 text-sm text-slate-200">
                        {module}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}

export default Roadmap
