import { useEffect, useMemo, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Quiz from './components/Quiz'
import Result from './components/Result'
import type { Question, UserSelection } from './types'

type LoadState = 'loading' | 'ready' | 'error'

export default function App() {
  const [questions, setQuestions] = useState<Question[]>([])
  const [state, setState] = useState<LoadState>('loading')
  const [seed, setSeed] = useState<number>(() => Date.now())
  const [answers, setAnswers] = useState<UserSelection[]>([])
  // 'all' means no filtering by week
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all')
  const [count, setCount] = useState<number>(10)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/questions.json', { cache: 'no-store' })
        if (!res.ok) throw new Error('Failed to load questions')
        const data: Question[] = await res.json()
        setQuestions(data)
        setState('ready')
      } catch (e) {
        console.error(e)
        setState('error')
      }
    }
    load()
  }, [])

  const reshuffle = () => {
    setSeed(Date.now())
    setAnswers([])
  }

  const shuffled = useMemo(() => {
    const rng = mulberry32(seed)
    const arr = [...questions]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1))
      ;[arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  }, [questions, seed])

  const { availableWeeks, hasWeekMeta } = useMemo(() => {
    const set = new Set<number>()
    for (const q of questions) {
      if (typeof q.meta?.week === 'number' && Number.isFinite(q.meta.week)) set.add(q.meta.week)
    }
    const weeks = Array.from(set).sort((a, b) => a - b)
    return {
      availableWeeks: weeks.length > 0 ? weeks : [1],
      hasWeekMeta: weeks.length > 0,
    }
  }, [questions])

  const session = useMemo(() => {
    const pool = selectedWeek === 'all'
      ? shuffled
      : (hasWeekMeta ? shuffled.filter(q => q.meta?.week === selectedWeek) : shuffled)
    if (pool.length === 0) return []
    const n = Math.max(1, Math.min(count, pool.length))
    return pool.slice(0, n)
  }, [shuffled, count, selectedWeek, hasWeekMeta])

  return (
  <div className="min-h-full">
      <div className="mx-auto max-w-3xl p-4 sm:p-8">
        <header className="mb-6 sm:mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-slate-100">Net Sec Quiz</h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Week filter: mobile-first dropdown */}
            <label className="text-sm text-slate-200" htmlFor="week-select">Week</label>
            <select
              id="week-select"
              aria-label="Select week"
              value={selectedWeek === 'all' ? 'all' : String(selectedWeek)}
              onChange={(e) => {
                const v = e.target.value === 'all' ? 'all' : Number(e.target.value)
                setSelectedWeek(v)
                setAnswers([])
                setSeed(Date.now())
              }}
              className="text-sm px-2 py-1.5 rounded-xl border border-white/60 bg-white/70 text-slate-900"
            >
              <option value="all">All</option>
              {availableWeeks.map(w => (
                <option key={w} value={w}>{`Week ${w}`}</option>
              ))}
            </select>
            <label className="hidden sm:block text-sm text-slate-200">Questions</label>
            <select
              aria-label="Select number of questions"
              value={count}
              onChange={(e) => {
                const v = Number(e.target.value)
                setCount(v)
                setAnswers([])
                setSeed(Date.now())
              }}
              className="text-sm px-2 py-1.5 rounded-xl border border-white/60 bg-white/70 text-slate-900"
            >
              <option value={3}>3</option>
              <option value={5}>5</option>
              <option value={7}>7</option>
              <option value={10}>10</option>
            </select>
            <button
              className="hidden sm:inline-flex text-sm px-3 py-1.5 rounded-xl border border-white/30 bg-white/70 hover:bg-white/80 transition-shadow text-slate-900"
              onClick={reshuffle}
            >
              New Session
            </button>
          </div>
        </header>

        <main>
          <AnimatePresence mode="wait">
            {state === 'loading' && (
              <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="glass p-6 sm:p-10">
                <Skeleton />
              </motion.div>
            )}
            {state === 'error' && (
              <motion.div key="error" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                className="glass p-6 sm:p-10">
                <p className="text-orange-300">Could not load questions. Ensure public/questions.json exists.</p>
              </motion.div>
            )}
            {state === 'ready' && answers.length < session.length && (
              <Quiz
                key={`quiz-${seed}`}
                questions={session}
        onAnswer={(choice) => setAnswers((a) => [...a, choice])}
                answers={answers}
              />
            )}
            {state === 'ready' && answers.length >= session.length && (
              <Result key={`result-${seed}`} questions={session} answers={answers} onRestart={reshuffle} />
            )}
          </AnimatePresence>
        </main>

  <footer className="mt-10 text-center text-xs text-slate-300">
          <p>Edit questions in <code>public/questions.json</code>. Deploy to Netlify.</p>
        </footer>
      </div>
    </div>
  )
}

function Logo() {
  return (
    <motion.div
      initial={{ scale: 0.9, rotate: -5, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 200, damping: 16 }}
      className="h-8 w-8 rounded-lg bg-brand-500 grid place-items-center shadow-glow"
    >
      <span className="text-slate-950 font-bold">Q</span>
    </motion.div>
  )
}

function Skeleton() {
  return (
    <div className="animate-pulse space-y-4">
      <div className="h-6 w-1/2 bg-white/10 rounded" />
      <div className="h-4 w-3/4 bg-white/10 rounded" />
      <div className="h-4 w-2/3 bg-white/10 rounded" />
      <div className="h-20 w-full bg-white/10 rounded" />
    </div>
  )
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
