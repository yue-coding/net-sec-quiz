import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import type { Question, UserSelection } from '../types'

type Props = {
  questions: Question[]
  answers: UserSelection[]
  onAnswer: (selection: UserSelection) => void
}

export default function Quiz({ questions, answers, onAnswer }: Props) {
  const current = answers.length
  const q = questions[current]
  const [selected, setSelected] = useState<UserSelection>([])

  useEffect(() => setSelected([]), [current])

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '9') {
        const idx = parseInt(e.key, 10) - 1
        if (idx < q.options.length) handleSelect(idx)
      }
      if (e.key === 'Enter' && selected.length > 0) {
        onAnswer(selected)
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [selected, q.options.length, onAnswer])

  const options = useMemo(() => q.options.map((c, i) => ({ label: c, i })), [q])

  const isRadio = q.answerType === 'radio'

  const handleSelect = (i: number) => {
    if (isRadio) setSelected([i])
    else setSelected((prev) => (prev.includes(i) ? prev.filter((x) => x !== i) : [...prev, i]))
  }

  const selectedSet = new Set(selected)

  return (
    <motion.div
      key={String(q.id)}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
  className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-xl shadow-slate-900/10 text-slate-900"
    >
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <p className="text-sm font-medium text-slate-900">Question {current + 1} of {questions.length}</p>
        </div>
        <div className="text-[13px] text-slate-900 bg-white/60 backdrop-blur-sm px-2 py-1 rounded-md border border-white/60 shadow-sm">
          {q.meta?.sourceFile && <span className="mr-2 align-middle">{q.meta.sourceFile}</span>}
          {q.meta?.pageNumber != null && <span className="opacity-90 align-middle">p.{q.meta.pageNumber}</span>}
        </div>
      </div>

  <h2 className="text-[22px] sm:text-2xl font-semibold text-slate-900 leading-snug mb-3">
        {q.questionText}
      </h2>

      {q.image && (
        <div className="mb-5 overflow-hidden rounded-xl border border-white/60 bg-white/70">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={q.image} alt={q.imageAlt || 'Question image'} className="w-full h-auto block" />
        </div>
      )}

      <ul className="space-y-3">
        {options.map(({ label, i }) => {
          const active = selectedSet.has(i)
          return (
            <li key={i}>
              <button
                type="button"
                onClick={() => handleSelect(i)}
                className={`w-full text-left px-4 py-3 rounded-xl border transition-all will-change-transform hover:-translate-y-0.5 focus:outline-none ${
                  active
                    ? 'border-sky-300/80 bg-white/90 ring-2 ring-sky-300/40'
                    : 'border-white/50 bg-white/80 hover:bg-white/90 focus:ring-2 focus:ring-sky-300/40'
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className={`h-6 w-6 mt-0.5 grid place-items-center rounded-md text-xs font-semibold ${
                    active ? 'bg-sky-400 text-white' : 'bg-white text-slate-700 border border-slate-300'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="text-slate-900">{label}</span>
                </div>
              </button>
            </li>
          )
        })}
      </ul>

    <div className="mt-6 flex justify-end">
        <button
          disabled={selected.length === 0}
      onClick={() => selected.length > 0 && onAnswer(selected)}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-300 bg-white/70 hover:bg-white/80 disabled:opacity-50 transition-all text-slate-900"
        >
          Next
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M5 12h14M13 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </motion.div>
  )
}
