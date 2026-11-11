import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import { lmsApi, resultOf } from '@/lib/lms-api'
import type {
  Attempt,
  ClassProgressResponse,
  ClassRoom,
  ClassStats,
  Page,
  Quiz,
  QuizQuestionStats,
} from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  ListSkeleton,
  PageHeader,
  formatDateTime,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export default function TeacherClassPage() {
  const { id } = useParams<{ id: string }>()
  const classId = Number(id)
  const [selectedQuizId, setSelectedQuizId] = useState<string>('')

  const classQuery = useQuery({
    queryKey: ['teacher', 'class', classId],
    queryFn: async () => {
      const res = await lmsApi.get(`/classes/${classId}`)
      return resultOf<ClassRoom>(res.data)
    },
    enabled: Number.isFinite(classId),
  })

  const progressQuery = useQuery({
    queryKey: ['teacher', 'class-progress', classId],
    queryFn: async () => {
      const res = await lmsApi.get(`/classes/${classId}/progress`)
      return resultOf<ClassProgressResponse>(res.data)
    },
    enabled: Number.isFinite(classId),
  })

  const statsQuery = useQuery({
    queryKey: ['teacher', 'class-stats', classId],
    queryFn: async () => {
      const res = await lmsApi.get(`/stats/classes/${classId}`)
      return resultOf<ClassStats>(res.data)
    },
    enabled: Number.isFinite(classId),
  })

  const quizzesQuery = useQuery({
    queryKey: ['teacher', 'quizzes-list'],
    queryFn: async () => {
      const res = await lmsApi.get('/quizzes?size=100')
      return resultOf<Page<Quiz>>(res.data).content
    },
  })

  const quizStatsQuery = useQuery({
    queryKey: ['teacher', 'quiz-question-stats', selectedQuizId],
    queryFn: async () => {
      const res = await lmsApi.get(
        `/stats/quizzes/${selectedQuizId}/questions`,
      )
      return resultOf<QuizQuestionStats>(res.data)
    },
    enabled: selectedQuizId !== '',
  })

  const attemptsQuery = useQuery({
    queryKey: ['teacher', 'class-attempts', classId, selectedQuizId],
    queryFn: async () => {
      const res = await lmsApi.get(
        `/classes/${classId}/attempts?quizId=${selectedQuizId}`,
      )
      return resultOf<Page<Attempt>>(res.data).content
    },
    enabled: selectedQuizId !== '',
  })

  if (!Number.isFinite(classId)) {
    return <ErrorBox message="Lớp học không tồn tại." />
  }

  const cls = classQuery.data
  const progress = progressQuery.data
  const stats = statsQuery.data

  return (
    <div className="space-y-6">
      <PageHeader
        title={cls?.name ?? 'Lớp học'}
        description={
          cls
            ? `${cls.grade ? `Khối ${cls.grade} • ` : ''}${cls.studentCount} học sinh${cls.teacherName ? ` • Giáo viên: ${cls.teacherName}` : ''}`
            : undefined
        }
        actions={
          <Button variant="outline" asChild>
            <Link to="/lms/teacher/classes">← Danh sách lớp</Link>
          </Button>
        }
      />

      {/* Thẻ thống kê tổng quan */}
      <div className="grid gap-4 sm:grid-cols-3">
        {statsQuery.isPending ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : stats ? (
          <>
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">{stats.studentCount}</p>
                <p className="text-sm text-muted-foreground">Học sinh</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">
                  {Math.round(stats.avgCompletionPercent)}%
                </p>
                <p className="text-sm text-muted-foreground">
                  Hoàn thành bài giảng trung bình ({stats.totalPublishedLessons}{' '}
                  bài đã xuất bản)
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="pt-6">
                <p className="text-2xl font-bold">
                  {stats.avgScorePercent === null
                    ? '—'
                    : `${Math.round(stats.avgScorePercent)}%`}
                </p>
                <p className="text-sm text-muted-foreground">
                  Điểm trung bình các bài tập
                </p>
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>

      {/* Bảng tiến độ từng học sinh */}
      <Card>
        <CardHeader>
          <CardTitle>Tiến độ từng học sinh</CardTitle>
          <CardDescription>
            Số bài giảng đã hoàn thành và điểm trung bình của mỗi học sinh.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {progressQuery.isPending && <ListSkeleton rows={3} />}
          {progressQuery.isError && (
            <ErrorBox
              message="Không tải được tiến độ lớp học."
              onRetry={() => progressQuery.refetch()}
            />
          )}
          {progress && progress.students.length === 0 && (
            <EmptyState message="Lớp chưa có học sinh nào." />
          )}
          {progress && progress.students.length > 0 && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Bài đã hoàn thành</TableHead>
                    <TableHead>Tiến độ</TableHead>
                    <TableHead>Điểm trung bình</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {progress.students.map((s) => (
                    <TableRow key={s.studentId}>
                      <TableCell className="font-medium">
                        {s.studentName}
                      </TableCell>
                      <TableCell>
                        {s.completedLessons}/{s.totalLessons}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-accent">
                            <div
                              className="h-full bg-primary"
                              style={{
                                width: `${Math.min(Math.round(s.completionPercent), 100)}%`,
                              }}
                            />
                          </div>
                          <span className="text-sm">
                            {Math.round(s.completionPercent)}%
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        {s.avgScorePercent === null
                          ? '—'
                          : `${Math.round(s.avgScorePercent)}%`}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Thống kê theo bài tập */}
      <Card>
        <CardHeader>
          <CardTitle>Thống kê theo bài tập</CardTitle>
          <CardDescription>
            Chọn một bài tập để xem tỉ lệ trả lời đúng từng câu và các lượt
            làm bài của lớp.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedQuizId} onValueChange={setSelectedQuizId}>
            <SelectTrigger className="w-full max-w-sm">
              <SelectValue placeholder="Chọn bài tập" />
            </SelectTrigger>
            <SelectContent>
              {(quizzesQuery.data ?? []).map((q) => (
                <SelectItem key={q.id} value={String(q.id)}>
                  {q.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedQuizId && quizStatsQuery.isPending && (
            <ListSkeleton rows={2} />
          )}
          {selectedQuizId && quizStatsQuery.data && (
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {quizStatsQuery.data.quizTitle} •{' '}
                {quizStatsQuery.data.submittedAttempts} lượt đã nộp
              </p>
              {quizStatsQuery.data.questions.length === 0 && (
                <EmptyState message="Chưa có học sinh nào nộp bài tập này." />
              )}
              {quizStatsQuery.data.questions.map((qs, idx) => (
                <div key={qs.questionId} className="space-y-1">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="min-w-0 flex-1 truncate">
                      Câu {idx + 1}: {qs.questionContent}
                    </span>
                    <Badge
                      variant={
                        qs.correctRatePercent >= 70
                          ? 'default'
                          : qs.correctRatePercent >= 40
                            ? 'secondary'
                            : 'destructive'
                      }
                    >
                      {Math.round(qs.correctRatePercent)}% đúng (
                      {qs.correctCount}/{qs.answeredCount})
                    </Badge>
                  </div>
                  <div className="h-2 w-full overflow-hidden rounded-full bg-accent">
                    <div
                      className="h-full bg-primary"
                      style={{
                        width: `${Math.min(Math.round(qs.correctRatePercent), 100)}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedQuizId && attemptsQuery.data && attemptsQuery.data.length > 0 && (
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Học sinh</TableHead>
                    <TableHead>Điểm</TableHead>
                    <TableHead>Nộp lúc</TableHead>
                    <TableHead>Trạng thái</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {attemptsQuery.data.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">
                        {a.studentName}
                      </TableCell>
                      <TableCell>
                        {a.score}/{a.totalPoints}
                      </TableCell>
                      <TableCell>
                        {a.submittedAt
                          ? formatDateTime(a.submittedAt)
                          : '—'}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            a.status === 'SUBMITTED'
                              ? 'default'
                              : 'secondary'
                          }
                        >
                          {a.status === 'SUBMITTED' ? 'Đã nộp' : 'Đang làm'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
