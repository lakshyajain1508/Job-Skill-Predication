import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineArrowUpTray, HiPlus, HiXMark } from 'react-icons/hi2'

function SkillInput() {
  const [skills, setSkills] = useState(['Python', 'SQL'])
  const [tagInput, setTagInput] = useState('')
  const [form, setForm] = useState({
    fullName: '',
    email: '',
    targetRole: '',
    experience: '',
  })

  const canSubmit = useMemo(() => form.fullName && form.email && form.targetRole, [form])

  const addSkill = () => {
    const clean = tagInput.trim()
    if (!clean || skills.includes(clean)) {
      return
    }
    setSkills((prev) => [...prev, clean])
    setTagInput('')
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 pt-6">
      <div>
        <p className="font-ai text-xs tracking-[0.25em] text-cyan-200/80">SKILL INPUT ENGINE</p>
        <h1 className="mt-3 font-heading text-3xl font-bold text-white">Build Your AI Skill Profile</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass neon-border rounded-3xl p-6 sm:p-8"
      >
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            ['fullName', 'Full Name'],
            ['email', 'Email Address'],
            ['targetRole', 'Target Role'],
            ['experience', 'Experience (years)'],
          ].map(([key, label]) => (
            <label key={key} className="group relative block">
              <input
                value={form[key]}
                onChange={(event) => setForm((prev) => ({ ...prev, [key]: event.target.value }))}
                className="peer w-full rounded-xl border border-slate-600/50 bg-slate-900/50 px-4 pb-3 pt-6 text-slate-100 outline-none transition-all focus:border-cyan-300/70 focus:shadow-[0_0_16px_rgba(34,211,238,0.35)]"
                placeholder=" "
              />
              <span className="pointer-events-none absolute left-4 top-4 text-sm text-slate-400 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-200 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                {label}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm text-slate-300">Skill Tags</p>
          <div className="rounded-xl border border-slate-600/50 bg-slate-900/50 p-3">
            <div className="mb-3 flex flex-wrap gap-2">
              {skills.map((skill) => (
                <span key={skill} className="glow-chip inline-flex items-center gap-1 rounded-full bg-cyan-500/10 px-3 py-1 text-sm text-cyan-100">
                  {skill}
                  <button type="button" onClick={() => setSkills((prev) => prev.filter((item) => item !== skill))}>
                    <HiXMark />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') {
                    event.preventDefault()
                    addSkill()
                  }
                }}
                placeholder="Type a skill and press Enter"
                className="w-full rounded-lg border border-slate-700/50 bg-slate-950/70 px-3 py-2 text-sm text-slate-100 outline-none focus:border-cyan-300/70"
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-1 rounded-lg border border-cyan-300/40 bg-cyan-500/15 px-3 text-cyan-100"
              >
                <HiPlus /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button type="button" className="inline-flex items-center gap-2 rounded-xl border border-indigo-300/30 bg-indigo-500/15 px-4 py-2 text-indigo-100">
            <HiOutlineArrowUpTray /> Upload Resume
          </button>
          <button
            type="button"
            disabled={!canSubmit}
            className="button-ripple rounded-xl bg-linear-to-r from-indigo-500 via-violet-500 to-cyan-500 px-6 py-2.5 font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Run AI Skill Analysis
          </button>
        </div>
      </motion.form>
    </section>
  )
}

export default SkillInput
