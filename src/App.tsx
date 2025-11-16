import { useEffect, useMemo, useState, type SVGProps } from 'react'
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
  // 'all' means no filtering by topic
  const [selectedTopic, setSelectedTopic] = useState<string | 'all'>('all')
  const [count, setCount] = useState<number>(10)
  const isTopicScoped = selectedTopic !== 'all'

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

  const { availableTopics, hasTopicMeta } = useMemo(() => {
    const set = new Set<string>()
    for (const q of questions) {
      if (typeof q.meta?.topic === 'string' && q.meta.topic.trim().length > 0) set.add(q.meta.topic.trim())
    }
    const topics = Array.from(set).sort((a, b) => a.localeCompare(b))
    return {
      availableTopics: topics,
      hasTopicMeta: topics.length > 0,
    }
  }, [questions])

  const session = useMemo(() => {
    const targetCount = isTopicScoped ? 5 : count
    const pool = selectedTopic === 'all'
      ? shuffled
      : (hasTopicMeta ? shuffled.filter(q => q.meta?.topic === selectedTopic) : shuffled)
    if (pool.length === 0) return []
    const n = Math.max(1, Math.min(targetCount, pool.length))
    return pool.slice(0, n)
  }, [shuffled, count, selectedTopic, hasTopicMeta, isTopicScoped])

  return (
  <div className="min-h-full">
      <div className="mx-auto max-w-3xl p-4 sm:p-8">
        <header className="mb-6 sm:mb-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Logo />
      <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white"></h1>
          </div>
          <div className="flex items-center gap-3">
            {/* Topic filter: mobile-first dropdown */}
            <label className="text-sm font-medium text-gt-gold flex items-center gap-1" htmlFor="topic-select">
              <FilterIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Topic
            </label>
            <select
              id="topic-select"
              aria-label="Select topic"
              value={selectedTopic === 'all' ? 'all' : selectedTopic}
              onChange={(e) => {
                const v = e.target.value === 'all' ? 'all' : e.target.value
                setSelectedTopic(v)
                if (v !== 'all') {
                  setCount(5)
                }
                setAnswers([])
                setSeed(Date.now())
              }}
              className="text-sm px-2 py-1.5 rounded-xl border border-gt-navy/40 bg-white text-gt-navy shadow-sm focus:ring-2 focus:ring-gt-gold/50"
            >
              <option value="all">All</option>
              {availableTopics.map(topic => (
                <option key={topic} value={topic}>{topic}</option>
              ))}
            </select>
            <label className="hidden sm:flex items-center gap-1 text-sm font-medium text-gt-gold">
              <QuestionIcon className="h-3.5 w-3.5" aria-hidden="true" />
              Questions
            </label>
            <select
              aria-label="Select number of questions"
              value={count}
              onChange={(e) => {
                const v = Number(e.target.value)
                setCount(v)
                setAnswers([])
                setSeed(Date.now())
              }}
              disabled={isTopicScoped}
              className={`text-sm px-2 py-1.5 rounded-xl border border-gt-navy/40 bg-white text-gt-navy shadow-sm focus:ring-2 focus:ring-gt-gold/50 ${isTopicScoped ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={33}>33</option>
            </select>
            <button
              className="hidden sm:inline-flex items-center gap-1.5 text-sm px-3 py-1.5 rounded-xl border border-gt-gold/60 bg-gt-gold/90 text-gt-navy font-semibold hover:bg-gt-gold transition-shadow"
              onClick={reshuffle}
            >
              <RefreshIcon className="h-3.5 w-3.5" aria-hidden="true" />
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

  <footer className="mt-10 text-xs">
          <div className="flex flex-col gap-3 rounded-2xl border border-gt-gold/60 bg-gt-gold/10 px-4 py-3 text-gt-gold sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-relaxed">
              Developed by students in the{' '}
              <a
                href="https://omscs.gatech.edu/cs-6262-network-security"
                target="_blank"
                rel="noreferrer"
                className="font-semibold underline decoration-dotted underline-offset-2 hover:text-white"
              >
                CS6262 Fall '25 cohort
              </a>
              . Keep learning, keep shipping.
            </p>
            <a
              href="https://github.com/daveymason/net-sec-quiz"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 self-start rounded-xl border border-gt-gold/50 bg-gt-gold/20 px-3 py-1.5 font-semibold text-gt-gold transition hover:bg-gt-gold/30 sm:self-auto"
            >
              <GitHubIcon className="h-4 w-4" aria-hidden="true" />
              GitHub repo
            </a>
          </div>
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
      className="h-10 w-10 rounded-2xl bg-gradient-to-br from-gt-gold to-gt-goldLight grid place-items-center border border-white/70 shadow-gold"
    >
      <span className="text-2xl" role="img" aria-label="Georgia Tech Yellow Jacket">🐝</span>
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

type IconProps = SVGProps<SVGSVGElement>

function FilterIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 6h16M7 12h10M10 18h4" />
    </svg>
  )
}

function QuestionIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.75 9a2.25 2.25 0 1 1 2.25 2.25V13" />
      <circle cx="12" cy="16.5" r="0.9" fill="currentColor" stroke="none" />
    </svg>
  )
}

function RefreshIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M3 4v6h6" />
      <path d="M21 20v-6h-6" />
      <path d="M5 14a7 7 0 0 0 12 3" />
      <path d="M19 10a7 7 0 0 0-12-3" />
    </svg>
  )
}

function GitHubIcon(props: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M12 2a10 10 0 0 0-3.16 19.48c.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.5.46-3.03-1.06-3.03-1.06-.45-1.14-1.1-1.44-1.1-1.44-.9-.61.07-.6.07-.6 1 .07 1.52 1.03 1.52 1.03.89 1.52 2.34 1.08 2.91.83.09-.65.35-1.08.64-1.33-1.99-.23-4.1-1-4.1-4.46 0-.99.35-1.79.92-2.43-.09-.22-.4-1.11.09-2.32 0 0 .75-.24 2.46.93a8.58 8.58 0 0 1 4.48 0c1.71-1.17 2.46-.93 2.46-.93.48 1.21.18 2.1.09 2.32.57.64.92 1.44.92 2.43 0 3.47-2.11 4.23-4.12 4.45.36.31.68.92.68 1.86 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10 10 0 0 0 12 2Z" />
    </svg>
  )
}
