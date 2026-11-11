import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import {
  BookOpen,
  CheckCircle2,
  ClipboardList,
  School,
  Users,
} from 'lucide-react'
import { lmsApi, resultOf } from '@/lib/lms-api'
import { useAuth } from '@/lib/auth'
import type {
  ClassRoom,
  Lesson,
  LessonProgress,
  Page,
  QuizSummary,
} from '@/lib/lms-types'
import { formatDateTime, isOverdue } from '@/components/lms/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

async function fetchTotal(url: string): Promise<number> {
  const res = await lmsApi.get(url)
  const result = resultOf<Page<unknown> | unknown[]>(res.data)
  // Có endpoint trả về Page, có endpoint trả về List thuần (/classes)
  return Array.isArray(result) ? result.length : result.totalElements
}

function StatCard({
  icon: Icon,
  label,
  value,
  to,
}: {
  icon: React.ComponentType<{ className?: string }>
  label: string
  value: number | string
  to?: string
}) {
  const inner = (
    <CardContent className="flex items-center gap-4 pt-6">
      <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-accent">
        <Icon className="size-5" />
      </span>
      <span>
        <span className="block text-2xl font-bold">{value}</span>
        <span className="block text-sm text-muted-foreground">{label}</span>
      </span>
    </CardContent>
  )
  return <Card>{to ? <Link to={to}>{inner}</Link> : inner}</Card>
}

function AdminDashboard() {
  const counts = useQuery({
    queryKey: ['dashboard', 'admin-counts'],
    queryFn: async () => {
      const [users, classes, lessons, quizzes] = await Promise.all([
        fetchTotal('/users?size=1'),
        fetchTotal('/classes?size=1'),
        fetchTotal('/lessons?size=1'),
        fetchTotal('/quizzes?size=1'),
      ])
      return { users, classes, lessons, quizzes }
    },
  })
  const recent = useQuery({
    queryKey: ['dashboard', 'recent-lessons'],
    queryFn: async () => {
      const res = await lmsApi.get('/lessons?size=5&sort=createdAt,desc')
      return resultOf<Page<Lesson>>(res.data).content
    },
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {counts.isPending ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))
        ) : (
          <>
            <StatCard icon={Users} label="Người dùng" value={counts.data?.users ?? 0} to="/lms/admin/users" />
            <StatCard icon={School} label="Lớp học" value={counts.data?.classes ?? 0} to="/lms/admin/classes" />
            <StatCard icon={BookOpen} label="Bài giảng" value={counts.data?.lessons ?? 0} to="/lms/lessons" />
            <StatCard icon={ClipboardList} label="Bài tập" value={counts.data?.quizzes ?? 0} to="/lms/admin/quizzes" />
          </>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bài giảng mới nhất</CardTitle>
          <CardDescription>Các bài giảng vừa được tạo trong hệ thống.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {recent.isPending ? (
            <Skeleton className="h-20 w-full" />
          ) : recent.data?.length ? (
            recent.data.map((lesson) => (
              <Link
                key={lesson.id}
                to={`/lms/lessons/${lesson.id}`}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-accent"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{lesson.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {lesson.grade ? `Khối ${lesson.grade}` : 'Mọi khối'}
                    {lesson.createdByName ? ` • ${lesson.createdByName}` : ''}
                  </span>
                </span>
                <Badge variant={lesson.published ? 'default' : 'secondary'}>
                  {lesson.published ? 'Đã xuất bản' : 'Nháp'}
                </Badge>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">Chưa có bài giảng nào.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function TeacherDashboard() {
  const classes = useQuery({
    queryKey: ['dashboard', 'teacher-classes'],
    queryFn: async () => {
      const res = await lmsApi.get('/classes')
      return resultOf<ClassRoom[]>(res.data)
    },
  })

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.isPending ? (
          <Skeleton className="h-24 w-full" />
        ) : (
          <StatCard
            icon={School}
            label="Lớp bạn đang dạy"
            value={classes.data?.length ?? 0}
            to="/lms/teacher/classes"
          />
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lớp của tôi</CardTitle>
          <CardDescription>
            Bấm vào một lớp để xem điểm và tiến độ của học sinh.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {classes.isPending ? (
            <Skeleton className="h-20 w-full" />
          ) : classes.data?.length ? (
            classes.data.map((cls) => (
              <Link
                key={cls.id}
                to={`/lms/teacher/classes/${cls.id}`}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-accent"
              >
                <span className="font-medium">{cls.name}</span>
                <span className="text-sm text-muted-foreground">
                  {cls.grade ? `Khối ${cls.grade} • ` : ''}
                  {cls.studentCount} học sinh
                </span>
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Bạn chưa được giao lớp nào.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function StudentDashboard() {
  const assigned = useQuery({
    queryKey: ['dashboard', 'assigned'],
    queryFn: async () => {
      const res = await lmsApi.get('/quizzes/assigned')
      return resultOf<QuizSummary[]>(res.data)
    },
  })
  const progress = useQuery({
    queryKey: ['dashboard', 'my-progress'],
    queryFn: async () => {
      const res = await lmsApi.get('/progress/mine')
      return resultOf<LessonProgress[]>(res.data)
    },
  })

  const completed = progress.data?.filter((p) => p.completed).length ?? 0
  const total = progress.data?.length ?? 0

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={ClipboardList}
          label="Bài tập được giao"
          value={assigned.data?.length ?? 0}
          to="/lms/quizzes"
        />
        <StatCard
          icon={CheckCircle2}
          label="Bài giảng đã hoàn thành"
          value={total > 0 ? `${completed}/${total}` : 0}
          to="/lms/lessons"
        />
        <StatCard
          icon={BookOpen}
          label="Bài giảng đã xem"
          value={progress.data?.filter((p) => p.viewed).length ?? 0}
          to="/lms/lessons"
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Bài tập cần làm</CardTitle>
          <CardDescription>Các bài tập giáo viên đã giao cho lớp của bạn.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          {assigned.isPending ? (
            <Skeleton className="h-20 w-full" />
          ) : assigned.data?.length ? (
            assigned.data.slice(0, 5).map((quiz) => (
              <Link
                key={quiz.id}
                to={`/lms/quizzes/${quiz.id}`}
                className="flex items-center justify-between gap-3 rounded-md px-3 py-2 hover:bg-accent"
              >
                <span className="min-w-0">
                  <span className="block truncate font-medium">{quiz.title}</span>
                  <span className="block text-xs text-muted-foreground">
                    {quiz.lessonTitle ?? 'Không gắn bài giảng'}
                    {quiz.dueDate
                      ? ` • Hạn: ${formatDateTime(quiz.dueDate)}`
                      : ''}
                  </span>
                </span>
                {quiz.dueDate && isOverdue(quiz.dueDate) ? (
                  <Badge variant="destructive">Quá hạn</Badge>
                ) : (
                  <Badge variant="secondary">Cần làm</Badge>
                )}
              </Link>
            ))
          ) : (
            <p className="text-sm text-muted-foreground">
              Hiện chưa có bài tập nào được giao.
            </p>
          )}
          {assigned.data && assigned.data.length > 5 && (
            <Button variant="outline" size="sm" asChild>
              <Link to="/lms/quizzes">Xem tất cả</Link>
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function DashboardPage() {
  const { user } = useAuth()

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold tracking-tight sm:text-2xl">
          Xin chào, {user?.fullName}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {user?.role === 'ADMIN' &&
            'Tổng quan hệ thống LMS — quản lý người dùng, lớp học, bài giảng và bài tập.'}
          {user?.role === 'TEACHER' &&
            'Theo dõi lớp học, điểm số và tiến độ làm bài của học sinh.'}
          {user?.role === 'STUDENT' &&
            'Xem bài giảng, làm bài tập được giao và theo dõi tiến độ của bạn.'}
        </p>
      </div>

      {user?.role === 'ADMIN' && <AdminDashboard />}
      {user?.role === 'TEACHER' && <TeacherDashboard />}
      {user?.role === 'STUDENT' && <StudentDashboard />}
    </div>
  )
}
