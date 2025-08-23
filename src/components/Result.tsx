import { motion } from 'framer-motion'
import type { Question, UserSelection } from '../types'

type Props = {
  questions: Question[]
  answers: UserSelection[]
  onRestart: () => void
}

export default function Result({ questions, answers, onRestart }: Props) {
  const total = questions.length
  const correctCount = total > 0 ? answers.reduce((acc, sel, i) => acc + (isCorrect(questions[i], sel) ? 1 : 0), 0) : 0
  const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
  className="rounded-2xl border border-white/60 bg-white/70 backdrop-blur-lg p-6 sm:p-8 shadow-xl shadow-slate-900/10 text-slate-900"
    >
    <div className="flex items-center justify-between gap-4">
        <div>
      <h2 className="text-2xl font-semibold text-slate-900">Your score</h2>
      <p className="text-slate-800">{correctCount} / {total} correct</p>
        </div>
        <div className="text-right">
      <div className="text-4xl font-black text-cyan-600">{pct}%</div>
        </div>
      </div>

      {total === 0 ? (
        <p className="mt-6 text-slate-800">No questions match your filters. Try selecting a different week or increase the count.</p>
      ) : (
      <ul className="mt-6 space-y-3">
        {questions.map((q, i) => {
          const right = isCorrect(q, answers[i])
          return (
            <li key={String(q.id)} className={`rounded-lg border px-4 py-3 ${right ? 'border-emerald-400/60 bg-emerald-50/80' : 'border-orange-300/60 bg-orange-50/80'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  <span className="text-xs mr-2 px-1.5 py-0.5 rounded bg-white text-slate-800 border border-slate-300">{i + 1}</span>
                  {q.questionText}
                </p>
                <div className="text-xs">
                  <span className={right ? 'text-emerald-700' : 'text-orange-700'}>
                    {right ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>
              {q.image && (
                <div className="mt-2 overflow-hidden rounded-lg border border-slate-200/60 bg-white/70">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img src={q.image} alt={q.imageAlt || 'Question image'} className="w-full h-auto block" />
                </div>
              )}
              {!right && (
                <p className="mt-2 text-sm text-slate-800">
                  Correct answer: <span className="text-sky-700">{q.correctAnswer.join(', ')}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-slate-900">
                {q.meta?.sourceFile}{q.meta?.pageNumber != null ? ` · p.${q.meta.pageNumber}` : ''}{q.meta?.topic ? ` · ${q.meta.topic}` : ''}
              </p>
            </li>
          )
        })}
  </ul>
  )}

      <div className="mt-6 flex justify-end">
        <button
          onClick={onRestart}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/30 bg-white/30 hover:bg-white/40 transition-all"
        >
          Restart
        </button>
      </div>
    </motion.div>
  )
}

function isCorrect(q: Question, selection: UserSelection) {
  const correctSet = new Set(q.correctAnswer)
  const selectedLabels = selection.map((i) => q.options[i])
  if (q.answerType === 'radio') {
    return selectedLabels.length === 1 && correctSet.has(selectedLabels[0])
  }
  if (selectedLabels.length !== q.correctAnswer.length) return false
  return selectedLabels.every((l) => correctSet.has(l))
}
