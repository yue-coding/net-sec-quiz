import { motion } from 'framer-motion'
import type { SVGProps } from 'react'
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
  className="rounded-2xl border border-white/70 bg-white/95 backdrop-blur-xl p-6 sm:p-8 shadow-xl shadow-[0_18px_38px_rgba(5,27,48,0.18)] text-gt-navy"
    >
    <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-gt-navy text-gt-gold">
            <TrophyIcon className="h-6 w-6" aria-hidden="true" />
          </span>
          <div>
      <h2 className="text-2xl font-semibold text-gt-navy">Your score</h2>
      <p className="text-gt-navy/80">{correctCount} / {total} correct</p>
          </div>
        </div>
        <div className="text-right">
      <div className="text-4xl font-black text-gt-gold">{pct}%</div>
        </div>
      </div>

      {total === 0 ? (
        <p className="mt-6 text-gt-navy">No questions match your filters. Try selecting a different topic or increase the count.</p>
      ) : (
      <ul className="mt-6 space-y-3">
        {questions.map((q, i) => {
          const right = isCorrect(q, answers[i])
          return (
            <li key={String(q.id)} className={`rounded-lg border px-4 py-3 ${right ? 'border-gt-gold/70 bg-gt-gold/10' : 'border-red-200 bg-red-50/80'}`}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="font-medium">
                  <span className="text-xs mr-2 px-1.5 py-0.5 rounded bg-white text-gt-navy border border-gt-navy/30">{i + 1}</span>
                  {q.questionText}
                </p>
                <div className="text-xs">
                  <span className={right ? 'text-gt-gold' : 'text-red-600'}>
                    {right ? 'Correct' : 'Incorrect'}
                  </span>
                </div>
              </div>
              {q.image && (
                <div className="mt-2 overflow-hidden rounded-lg border border-gt-gold/30 bg-white/70">
                  {/* eslint-disable-next-line jsx-a11y/alt-text */}
                  <img src={q.image} alt={q.imageAlt || 'Question image'} className="w-full h-auto block" />
                </div>
              )}
              {!right && (
                <p className="mt-2 text-sm text-gt-navy">
                  Correct answer: <span className="text-gt-gold font-semibold">{q.correctAnswer.join(', ')}</span>
                </p>
              )}
              <p className="mt-1 text-xs text-gt-navy/80">
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
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-gt-gold/70 bg-gt-gold text-gt-navy font-semibold hover:bg-gt-gold/90 transition-all"
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

function TrophyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M8 4h8v4a4 4 0 0 1-8 0V4Z" />
      <path d="M6 4v2a6 6 0 0 0 6 6" />
      <path d="M18 4v2a6 6 0 0 1-6 6" />
      <path d="M9 20h6" />
      <path d="M12 18v2" />
      <path d="M7 4h-3v3c0 1.1.9 2 2 2h1" />
      <path d="M17 4h3v3c0 1.1-.9 2-2 2h-1" />
    </svg>
  )
}
