export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT'

export const ROLE_LABEL: Record<Role, string> = {
  ADMIN: 'Quản trị viên',
  TEACHER: 'Giáo viên',
  STUDENT: 'Học sinh',
}

export interface User {
  id: number
  fullName: string
  email: string
  role: Role
  classRoomId: number | null
  classRoomName: string | null
  enabled: boolean
}

export interface Page<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}

export interface ClassRoom {
  id: number
  name: string
  grade: number | null
  teacherId: number | null
  teacherName: string | null
  studentCount: number
}

export type MaterialKind = 'SLIDE' | 'LESSON_PLAN'

export interface LessonMaterial {
  id: number
  kind: MaterialKind
  originalName: string
  storedName: string
  contentType: string
  sizeBytes: number
}

export interface Lesson {
  id: number
  title: string
  description: string | null
  grade: number | null
  orderIndex: number
  published: boolean
  createdByName: string | null
  materials?: LessonMaterial[] | null
}

export type QuestionType = 'SINGLE' | 'MULTIPLE' | 'TRUE_FALSE'

export const QUESTION_TYPE_LABEL: Record<QuestionType, string> = {
  SINGLE: 'Một đáp án',
  MULTIPLE: 'Nhiều đáp án',
  TRUE_FALSE: 'Đúng / Sai',
}

export interface QuestionOption {
  id: number
  text: string
  correct?: boolean
  orderIndex: number
}

export interface Question {
  id: number
  type: QuestionType
  content: string
  imagePath: string | null
  explanation: string | null
  points: number
  options: QuestionOption[]
}

/** Câu hỏi ở dạng học sinh được xem: không đáp án đúng, không giải thích. */
export interface QuestionView {
  id: number
  type: QuestionType
  content: string
  imagePath: string | null
  points: number
  options: { id: number; text: string; orderIndex: number }[]
}

export interface QuizQuestionItem {
  questionId: number
  points: number
  orderIndex: number
  question: Question
}

export interface Quiz {
  id: number
  lessonId: number | null
  lessonTitle: string | null
  title: string
  description: string | null
  durationMinutes: number | null
  maxAttempts: number
  published: boolean
  questions: QuizQuestionItem[]
}

export interface QuizSummary {
  id: number
  lessonId: number | null
  lessonTitle: string | null
  title: string
  description: string | null
  durationMinutes: number | null
  maxAttempts: number
  published: boolean
  dueDate: string | null
}

export interface StudentQuizQuestion {
  questionId: number
  points: number
  orderIndex: number
  question: QuestionView
}

export interface StudentQuizView {
  id: number
  lessonId: number | null
  lessonTitle: string | null
  title: string
  description: string | null
  durationMinutes: number | null
  maxAttempts: number
  attemptsUsed: number
  dueDate: string | null
  questions: StudentQuizQuestion[]
}

export type AttemptStatus = 'IN_PROGRESS' | 'SUBMITTED'

export interface Attempt {
  id: number
  quizId: number
  quizTitle: string
  studentId: number
  studentName: string
  startedAt: string
  submittedAt: string | null
  score: number
  totalPoints: number
  status: AttemptStatus
}

export interface AnswerReview {
  questionId: number
  questionContent: string
  questionType: string
  imagePath: string | null
  selectedOptionIds: number[]
  correctOptionIds: number[]
  correct: boolean
  pointsAwarded: number
  points: number
  explanation: string | null
  options: QuestionOption[]
}

export interface AttemptReview {
  attempt: Attempt
  answers: AnswerReview[]
}

export interface LessonProgress {
  lessonId: number
  lessonTitle: string
  viewed: boolean
  completed: boolean
  updatedAt: string
}

export interface StudentProgress {
  studentId: number
  studentName: string
  completedLessons: number
  totalLessons: number
  completionPercent: number
  avgScorePercent: number | null
}

export interface ClassProgressResponse {
  classId: number
  className: string
  totalLessons: number
  students: StudentProgress[]
}

export interface ClassStats {
  classId: number
  className: string
  studentCount: number
  totalPublishedLessons: number
  avgCompletionPercent: number
  avgScorePercent: number | null
}

export interface QuestionStat {
  questionId: number
  questionContent: string
  answeredCount: number
  correctCount: number
  correctRatePercent: number
}

export interface QuizQuestionStats {
  quizId: number
  quizTitle: string
  submittedAttempts: number
  questions: QuestionStat[]
}
