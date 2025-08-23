export type QuestionMeta = {
  sourceFile?: string
  pageNumber?: number
  topic?: string
  week?: number
}

export type Question = {
  id: string | number
  questionText: string
  options: string[]
  // One or more correct answers by label text
  correctAnswer: string[]
  // 'radio' for single choice, 'checkbox' for multi-select
  answerType: 'radio' | 'checkbox'
  // Optional image path under public/ (e.g., "/images/foo.png") and alt text
  image?: string
  imageAlt?: string
  meta?: QuestionMeta
}

// User's selection for a question: indices into options
export type UserSelection = number[]
