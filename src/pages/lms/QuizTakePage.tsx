import { useMemo, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  ChevronLeft,
  Clock,
  Loader2,
  XCircle,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  apiErrorMessage,
  lmsApi,
  questionImageUrl,
  resultOf,
} from '@/lib/lms-api'
import { useAuth } from '@/lib/auth'
import type {
  Attempt,
  AttemptReview,
  Page,
  QuestionType,
  StudentQuizView,
} from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  formatDateTime,
  isOverdue,
} from '@/components/lms/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Skeleton } from '@/components/ui/skeleton'

type Phase = 'intro' | 'taking' | 'review'

function QuestionImage({ src, alt }: { src: string | null; alt: string }) {
  const [failed, setFailed] = useState(false)
  if (!src || failed) return null
  return (
    <img
      src={questionImageUrl(src)}
      alt={alt}
      onError={() => setFailed(true)}
      className="mt-3 max-h-72 w-auto max-w-full rounded-md border object-contain"
    />
  )
}

export default function QuizTakePage() {
  const { id } = useParams<{ id: string }>()
  const quizId = Number(id)
  const { user } = useAuth()

  const [phase, setPhase] = useState<Phase>('intro')
  const [attemptId, setAttemptId] = useState<number | null>(null)
  const [quiz, setQuiz] = useState<StudentQuizView | null>(null)
  const [answers, setAnswers] = useState<Record<number, number[]>>({})
  const [review, setReview] = useState<AttemptReview | null>(null)
  const [confirming, setConfirming] = useState(false)

  const quizQuery = useQuery({
    queryKey: ['quiz', 'student', quizId],
    queryFn: async () => {
      const res = await lmsApi.get(`/quizzes/${quizId}`)
      return resultOf<StudentQuizView>(res.data)
    },
    enabled: Number.isFinite(quizId) && user?.role === 'STUDENT',
  })

  const myAttemptsQuery = useQuery({
    queryKey: ['attempts', 'mine', quizId],
    queryFn: async () => {
      const res = await lmsApi.get('/attempts/mine')
      return resultOf<Page<Attempt>>(res.data).content.filter(
        (a) => a.quizId === quizId,
      )
    },
    enabled: user?.role === 'STUDENT',
  })

  const startMutation = useMutation({
    mutationFn: async () => {
      const res = await lmsApi.post('/attempts/start', { quizId })
      return resultOf<{
        attempt: Attempt
        quiz: StudentQuizView
      }>(res.data)
    },
    onSuccess: (data) => {
      setAttemptId(data.attempt.id)
      setQuiz(data.quiz)
      setAnswers({})
      setReview(null)
      setPhase('taking')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const submitMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        answers: (quiz?.questions ?? []).map((q) => ({
          questionId: q.questionId,
          selectedOptionIds: answers[q.questionId] ?? [],
        })),
      }
      const res = await lmsApi.post(`/attempts/${attemptId}/submit`, payload)
      return resultOf<AttemptReview>(res.data)
    },
    onSuccess: (data) => {
      setReview(data)
      setPhase('review')
      setConfirming(false)
      myAttemptsQuery.refetch()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const loadReviewMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await lmsApi.get(`/attempts/${id}`)
      return resultOf<AttemptReview>(res.data)
    },
    onSuccess: (data) => {
      setReview(data)
      setPhase('review')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const submittedAttempts = useMemo(
    () =>
      (myAttemptsQuery.data ?? []).filter((a) => a.status === 'SUBMITTED'),
    [myAttemptsQuery.data],
  )

  const setSingle = (questionId: number, optionId: number) =>
    setAnswers((prev) => ({ ...prev, [questionId]: [optionId] }))

  const toggleMultiple = (questionId: number, optionId: number) =>
    setAnswers((prev) => {
      const current = prev[questionId] ?? []
      const next = current.includes(optionId)
        ? current.filter((v) => v !== optionId)
        : [...current, optionId]
      return { ...prev, [questionId]: next }
    })

  if (user?.role !== 'STUDENT') {
    return (
      <div className="space-y-4">
        <ErrorBox message="Chỉ học sinh mới làm bài tập. Giáo viên và quản trị viên xem bài tập ở mục Quản lý bài tập." />
        <Button variant="outline" asChild>
          <Link to="/lms/quizzes">← Về danh sách bài tập</Link>
        </Button>
      </div>
    )
  }

  if (!Number.isFinite(quizId)) {
    return <ErrorBox message="Bài tập không tồn tại." />
  }

  if (quizQuery.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (quizQuery.isError || !quizQuery.data) {
    return (
      <ErrorBox
        message="Không tải được bài tập. Có thể bài chưa được giao cho lớp của bạn."
        onRetry={() => quizQuery.refetch()}
      />
    )
  }

  const quizInfo = quizQuery.data
  // attemptsUsed từ quiz có thể cũ sau khi vừa nộp bài — lấy max với lịch sử đã nộp
  const attemptsUsed = Math.max(
    quizInfo.attemptsUsed,
    submittedAttempts.length,
  )
  const attemptsLeft = Math.max(quizInfo.maxAttempts - attemptsUsed, 0)
  const overdue = isOverdue(quizInfo.dueDate)
  const lastSubmitted = submittedAttempts[0]

  const renderOptions = (
    questionId: number,
    type: QuestionType,
    options: { id: number; text: string; orderIndex: number }[],
  ) => {
    const selected = answers[questionId] ?? []
    if (type === 'MULTIPLE') {
      return (
        <div className="space-y-2">
          {options.map((opt) => (
            <label
              key={opt.id}
              className="flex cursor-pointer items-start gap-3 rounded-md border px-3 py-2.5 hover:bg-accent"
            >
              <Checkbox
                checked={selected.includes(opt.id)}
                onCheckedChange={() => toggleMultiple(questionId, opt.id)}
              />
              <span className="text-sm">{opt.text}</span>
            </label>
          ))}
        </div>
      )
    }
    return (
      <RadioGroup
        value={selected[0] ? String(selected[0]) : ''}
        onValueChange={(v) => setSingle(questionId, Number(v))}
        className="space-y-2"
      >
        {options.map((opt) => (
          <div
            key={opt.id}
            className="flex items-center gap-3 rounded-md border px-3 py-2.5 hover:bg-accent"
          >
            <RadioGroupItem value={String(opt.id)} id={`q${questionId}-o${opt.id}`} />
            <Label htmlFor={`q${questionId}-o${opt.id}`} className="cursor-pointer font-normal">
              {opt.text}
            </Label>
          </div>
        ))}
      </RadioGroup>
    )
  }

  // ---------- REVIEW ----------
  if (phase === 'review' && review) {
    const total = review.attempt.totalPoints
    const score = review.attempt.score
    const percent = total > 0 ? Math.round((score / total) * 100) : 0
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">
              Kết quả: {score}/{total} điểm ({percent}%)
            </CardTitle>
            <CardDescription>
              {review.attempt.quizTitle} • Nộp lúc{' '}
              {formatDateTime(review.attempt.submittedAt)}
            </CardDescription>
          </CardHeader>
        </Card>

        <div className="space-y-4">
          {review.answers.map((ans, idx) => (
            <Card key={ans.questionId}>
              <CardHeader>
                <CardTitle className="flex items-start gap-2 text-base">
                  {ans.correct ? (
                    <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-green-500" />
                  ) : (
                    <XCircle className="mt-0.5 size-5 shrink-0 text-destructive" />
                  )}
                  <span>
                    Câu {idx + 1}: {ans.questionContent}
                  </span>
                </CardTitle>
                <CardDescription>
                  {ans.pointsAwarded}/{ans.points} điểm
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <QuestionImage src={ans.imagePath} alt={`Câu ${idx + 1}`} />
                {ans.options.map((opt) => {
                  const wasSelected = ans.selectedOptionIds.includes(opt.id)
                  const isCorrect = ans.correctOptionIds.includes(opt.id)
                  return (
                    <div
                      key={opt.id}
                      className={`flex items-center gap-2 rounded-md border px-3 py-2 text-sm ${
                        isCorrect
                          ? 'border-green-500/50 bg-green-500/10'
                          : wasSelected
                            ? 'border-destructive/50 bg-destructive/10'
                            : ''
                      }`}
                    >
                      <span className="flex-1">{opt.text}</span>
                      {isCorrect && (
                        <Badge variant="default">Đáp án đúng</Badge>
                      )}
                      {wasSelected && !isCorrect && (
                        <Badge variant="destructive">Bạn đã chọn</Badge>
                      )}
                      {wasSelected && isCorrect && (
                        <Badge variant="secondary">Bạn đã chọn</Badge>
                      )}
                    </div>
                  )
                })}
                {ans.explanation && (
                  <p className="rounded-md bg-accent px-3 py-2 text-sm">
                    <strong>Giải thích:</strong> {ans.explanation}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-wrap gap-3">
          <Button variant="outline" asChild>
            <Link to="/lms/quizzes">
              <ChevronLeft className="size-4" />
              Về danh sách bài tập
            </Link>
          </Button>
          {attemptsLeft > 0 && !overdue && (
            <Button
              onClick={() => {
                setPhase('intro')
                setReview(null)
                quizQuery.refetch()
                myAttemptsQuery.refetch()
              }}
            >
              Làm lại (còn {attemptsLeft} lượt)
            </Button>
          )}
        </div>
      </div>
    )
  }

  // ---------- TAKING ----------
  if (phase === 'taking' && quiz) {
    const answeredCount = quiz.questions.filter(
      (q) => (answers[q.questionId] ?? []).length > 0,
    ).length
    return (
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-bold tracking-tight">{quiz.title}</h2>
            <p className="text-sm text-muted-foreground">
              Đã trả lời {answeredCount}/{quiz.questions.length} câu
              {quiz.durationMinutes
                ? ` • Thời gian gợi ý: ${quiz.durationMinutes} phút`
                : ''}
            </p>
          </div>
          <Badge variant="secondary">Đang làm bài</Badge>
        </div>

        <div className="space-y-4">
          {quiz.questions.map((q, idx) => (
            <Card key={q.questionId}>
              <CardHeader>
                <CardTitle className="text-base">
                  Câu {idx + 1} ({q.points} điểm): {q.question.content}
                </CardTitle>
                <CardDescription>
                  {q.question.type === 'MULTIPLE'
                    ? 'Chọn tất cả đáp án đúng'
                    : q.question.type === 'TRUE_FALSE'
                      ? 'Chọn Đúng hoặc Sai'
                      : 'Chọn một đáp án đúng'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <QuestionImage
                  src={q.question.imagePath}
                  alt={`Câu ${idx + 1}`}
                />
                <div className="mt-3">
                  {renderOptions(
                    q.questionId,
                    q.question.type,
                    q.question.options,
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {confirming ? (
          <Card className="border-primary">
            <CardContent className="flex flex-wrap items-center justify-between gap-3 pt-6">
              <p className="text-sm font-medium">
                Bạn chắc chắn muốn nộp bài? Đã trả lời {answeredCount}/
                {quiz.questions.length} câu. Sau khi nộp sẽ không sửa được.
              </p>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setConfirming(false)}>
                  Hủy
                </Button>
                <Button
                  onClick={() => submitMutation.mutate()}
                  disabled={submitMutation.isPending}
                >
                  {submitMutation.isPending && (
                    <Loader2 className="size-4 animate-spin" />
                  )}
                  Xác nhận nộp bài
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Button size="lg" onClick={() => setConfirming(true)}>
            Nộp bài
          </Button>
        )}
      </div>
    )
  }

  // ---------- INTRO ----------
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">{quizInfo.title}</CardTitle>
          <CardDescription>
            {quizInfo.lessonTitle
              ? `Bài giảng: ${quizInfo.lessonTitle}`
              : 'Bài tập trắc nghiệm'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          {quizInfo.description && <p>{quizInfo.description}</p>}
          <p className="flex items-center gap-2">
            <ClipboardListIcon />
            {quizInfo.questions.length} câu hỏi
          </p>
          {quizInfo.durationMinutes && (
            <p className="flex items-center gap-2">
              <Clock className="size-4 text-muted-foreground" />
              Thời gian gợi ý: {quizInfo.durationMinutes} phút
            </p>
          )}
          <p>
            Lượt làm: đã dùng {attemptsUsed}/{quizInfo.maxAttempts}
            {attemptsLeft === 0 && ' — đã hết lượt làm'}
          </p>
          {quizInfo.dueDate && (
            <p>
              Hạn nộp: {formatDateTime(quizInfo.dueDate)}
              {overdue && (
                <Badge variant="destructive" className="ml-2">
                  Đã quá hạn
                </Badge>
              )}
            </p>
          )}
        </CardContent>
      </Card>

      {overdue && (
        <ErrorBox message="Bài tập đã quá hạn nộp, bạn không thể bắt đầu làm nữa." />
      )}
      {!overdue && attemptsLeft === 0 && (
        <ErrorBox message="Bạn đã dùng hết lượt làm bài tập này." />
      )}

      <div className="flex flex-wrap gap-3">
        <Button variant="outline" asChild>
          <Link to="/lms/quizzes">
            <ChevronLeft className="size-4" />
            Về danh sách
          </Link>
        </Button>
        <Button
          disabled={
            overdue || attemptsLeft === 0 || startMutation.isPending
          }
          onClick={() => startMutation.mutate()}
        >
          {startMutation.isPending && (
            <Loader2 className="size-4 animate-spin" />
          )}
          Bắt đầu làm bài
        </Button>
        {lastSubmitted && (
          <Button
            variant="outline"
            disabled={loadReviewMutation.isPending}
            onClick={() => loadReviewMutation.mutate(lastSubmitted.id)}
          >
            Xem lại bài đã nộp ({lastSubmitted.score}/
            {lastSubmitted.totalPoints} điểm)
          </Button>
        )}
      </div>

      {submittedAttempts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Lịch sử làm bài</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {submittedAttempts.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => loadReviewMutation.mutate(a.id)}
                className="flex w-full items-center justify-between rounded-md px-3 py-2 text-sm hover:bg-accent"
              >
                <span>Nộp lúc {formatDateTime(a.submittedAt)}</span>
                <Badge variant={a.score === a.totalPoints ? 'default' : 'secondary'}>
                  {a.score}/{a.totalPoints} điểm
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      )}

      {submittedAttempts.length === 0 && myAttemptsQuery.isSuccess && (
        <EmptyState message="Bạn chưa làm bài tập này lần nào." />
      )}
    </div>
  )
}

function ClipboardListIcon() {
  return <span className="text-muted-foreground">•</span>
}
