import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { lmsApi, resultOf } from '@/lib/lms-api'
import { useAuth } from '@/lib/auth'
import type { Attempt, Page, Quiz, QuizSummary } from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  ListSkeleton,
  PageHeader,
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

export default function QuizListPage() {
  const { user } = useAuth()
  const isStudent = user?.role === 'STUDENT'

  const assignedQuery = useQuery({
    queryKey: ['quizzes', 'assigned'],
    queryFn: async () => {
      const res = await lmsApi.get('/quizzes/assigned')
      return resultOf<QuizSummary[]>(res.data)
    },
    enabled: isStudent,
  })

  const allQuery = useQuery({
    queryKey: ['quizzes', 'all'],
    queryFn: async () => {
      const res = await lmsApi.get('/quizzes?size=100&sort=createdAt,desc')
      return resultOf<Page<Quiz>>(res.data).content
    },
    enabled: !isStudent,
  })

  const myAttemptsQuery = useQuery({
    queryKey: ['attempts', 'mine'],
    queryFn: async () => {
      const res = await lmsApi.get('/attempts/mine')
      return resultOf<Page<Attempt>>(res.data).content
    },
    enabled: isStudent,
  })

  const attemptsByQuiz = useMemo(() => {
    const map = new Map<number, Attempt[]>()
    for (const attempt of myAttemptsQuery.data ?? []) {
      const list = map.get(attempt.quizId) ?? []
      list.push(attempt)
      map.set(attempt.quizId, list)
    }
    return map
  }, [myAttemptsQuery.data])

  const bestScore = (quizId: number): string | null => {
    const attempts = (attemptsByQuiz.get(quizId) ?? []).filter(
      (a) => a.status === 'SUBMITTED',
    )
    if (attempts.length === 0) return null
    const best = attempts.reduce((a, b) =>
      a.score / Math.max(a.totalPoints, 1) >=
      b.score / Math.max(b.totalPoints, 1)
        ? a
        : b,
    )
    return `${best.score}/${best.totalPoints}`
  }

  const attemptsUsed = (quizId: number) =>
    (attemptsByQuiz.get(quizId) ?? []).length

  if (isStudent) {
    const quizzes = assignedQuery.data ?? []
    return (
      <div>
        <PageHeader
          title="Bài tập của tôi"
          description="Các bài tập giáo viên đã giao cho lớp của bạn."
        />
        {assignedQuery.isPending && <ListSkeleton rows={4} />}
        {assignedQuery.isError && (
          <ErrorBox
            message="Không tải được danh sách bài tập."
            onRetry={() => assignedQuery.refetch()}
          />
        )}
        {assignedQuery.isSuccess && quizzes.length === 0 && (
          <EmptyState message="Hiện chưa có bài tập nào được giao." />
        )}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {quizzes.map((quiz) => {
            const overdue = isOverdue(quiz.dueDate)
            const used = attemptsUsed(quiz.id)
            const left = Math.max(quiz.maxAttempts - used, 0)
            const best = bestScore(quiz.id)
            return (
              <Card key={quiz.id} className="flex flex-col">
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <CardTitle className="line-clamp-2 text-base">
                      {quiz.title}
                    </CardTitle>
                    {overdue ? (
                      <Badge variant="destructive">Quá hạn</Badge>
                    ) : (
                      <Badge variant="secondary">Cần làm</Badge>
                    )}
                  </div>
                  <CardDescription>
                    {quiz.lessonTitle ?? 'Không gắn bài giảng'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
                  <p>
                    Hạn nộp:{' '}
                    {quiz.dueDate ? formatDateTime(quiz.dueDate) : 'Không giới hạn'}
                  </p>
                  <p>
                    Lượt làm còn lại: {left}/{quiz.maxAttempts}
                    {best ? ` • Điểm cao nhất: ${best}` : ''}
                  </p>
                  {quiz.durationMinutes && (
                    <p>Thời gian: {quiz.durationMinutes} phút</p>
                  )}
                  <Button asChild className="mt-auto" disabled={left === 0}>
                    <Link to={`/lms/quizzes/${quiz.id}`}>
                      {used > 0 ? 'Làm lại / Xem lại' : 'Bắt đầu làm bài'}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    )
  }

  const quizzes = allQuery.data ?? []
  return (
    <div>
      <PageHeader
        title="Bài tập"
        description="Tất cả bài tập trong hệ thống. Quản lý chi tiết ở mục Quản lý bài tập."
      />
      {allQuery.isPending && <ListSkeleton rows={4} />}
      {allQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách bài tập."
          onRetry={() => allQuery.refetch()}
        />
      )}
      {allQuery.isSuccess && quizzes.length === 0 && (
        <EmptyState message="Chưa có bài tập nào." />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {quizzes.map((quiz) => (
          <Card key={quiz.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-base">
                  {quiz.title}
                </CardTitle>
                <Badge variant={quiz.published ? 'default' : 'secondary'}>
                  {quiz.published ? 'Đã xuất bản' : 'Nháp'}
                </Badge>
              </div>
              <CardDescription>
                {quiz.lessonTitle ?? 'Không gắn bài giảng'}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col gap-2 text-sm text-muted-foreground">
              <p>{quiz.description || 'Chưa có mô tả.'}</p>
              <p>
                {quiz.questions.length} câu hỏi • Tối đa {quiz.maxAttempts} lượt
                làm
                {quiz.durationMinutes ? ` • ${quiz.durationMinutes} phút` : ''}
              </p>
              <Button asChild className="mt-auto" variant="outline">
                <Link to={`/lms/admin/quizzes`}>Quản lý bài tập</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
