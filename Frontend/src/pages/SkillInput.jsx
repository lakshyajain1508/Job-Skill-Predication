import { useMemo, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { HiOutlineArrowUpTray, HiPlus, HiXMark } from 'react-icons/hi2'
import { useNavigate } from 'react-router-dom'
import { runPrediction } from '../api/predictService'
import { fetchPortfolio } from '../api/intelligenceService'
import { uploadResume } from '../api/uploadService'

function SkillInput() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)
  const [skills, setSkills] = useState(['Python', 'SQL'])
  const [tagInput, setTagInput] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
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

  const mergeSkills = (incoming = []) => {
    setSkills((prev) => {
      const existing = new Set(prev.map((item) => item.trim().toLowerCase()))
      const merged = [...prev]

      incoming.forEach((item) => {
        const normalized = String(item || '').trim()
        if (!normalized) {
          return
        }
        const key = normalized.toLowerCase()
        if (!existing.has(key)) {
          existing.add(key)
          merged.push(normalized)
        }
      })

      return merged
    })
  }

  const handleRunPrediction = async () => {
    if (!canSubmit || isSubmitting) {
      return
    }

    setIsSubmitting(true)
    try {
      const [response, portfolio] = await Promise.all([
        runPrediction({
          skills,
          target_role: form.targetRole,
        }),
        fetchPortfolio(skills),
      ])

      sessionStorage.setItem('user_skills', JSON.stringify(skills))
      sessionStorage.setItem('portfolio', JSON.stringify(portfolio))
      sessionStorage.setItem('user_profile', JSON.stringify(form))
      sessionStorage.setItem('prediction', JSON.stringify(response))
      navigate('/results')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUploadClick = () => {
    if (!isUploading) {
      fileInputRef.current?.click()
    }
  }

  const handleResumeSelect = async (event) => {
    const file = event.target.files?.[0]
    if (!file) {
      return
    }

    setIsUploading(true)
    try {
      const response = await uploadResume(file)
      mergeSkills(response?.detected_skills || [])
    } finally {
      setIsUploading(false)
      event.target.value = ''
    }
  }

  return (
    <section className="mx-auto max-w-4xl space-y-6 pt-6">
      <div>
        <p className="font-ai text-xs tracking-[0.25em] text-cyan-200/80">SKILL INPUT ENGINE</p>
        <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-white">Build Your AI Skill Profile</h1>
      </div>

      <motion.form
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-3d rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm shadow-lg shadow-black/30 transition-all duration-200 hover:bg-white/[0.07] hover:shadow-xl sm:p-8"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.txt,.doc,.docx"
          onChange={handleResumeSelect}
          className="hidden"
        />

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
                className="peer surface-input w-full rounded-xl px-4 pb-3 pt-6 text-white outline-none transition-all focus:ring-1 focus:ring-cyan-400"
                placeholder=" "
              />
              <span className="pointer-events-none absolute left-4 top-4 text-sm text-slate-400 transition-all peer-focus:top-2 peer-focus:text-xs peer-focus:text-cyan-200 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-xs">
                {label}
              </span>
            </label>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          <p className="text-sm text-gray-400">Skill Tags</p>
          <div className="rounded-xl border border-white/10 bg-white/5 p-3 backdrop-blur-sm">
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
                className="surface-input w-full rounded-lg px-3 py-2 text-sm text-white outline-none focus:ring-1 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={addSkill}
                className="inline-flex items-center gap-1 rounded-lg border border-white/10 px-3 text-gray-200 transition duration-200 hover:bg-white/5 hover:text-white"
              >
                <HiPlus /> Add
              </button>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={handleUploadClick}
            disabled={isUploading}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-gray-200 transition duration-200 hover:bg-white/5 hover:text-white"
          >
            <HiOutlineArrowUpTray /> Upload Resume
          </button>
          <button
            type="button"
            onClick={handleRunPrediction}
            disabled={!canSubmit || isSubmitting}
            className="button-ripple btn-3d rounded-xl bg-linear-to-r from-cyan-500 to-blue-500 px-6 py-2.5 font-semibold text-white transition duration-200 hover:from-cyan-400 hover:to-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Run AI Skill Analysis
          </button>
        </div>
      </motion.form>
    </section>
  )
}

export default SkillInput
