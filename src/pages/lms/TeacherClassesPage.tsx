import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { lmsApi, resultOf } from '@/lib/lms-api'
import type { ClassRoom } from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  ListSkeleton,
  PageHeader,
} from '@/components/lms/common'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function TeacherClassesPage() {
  const classesQuery = useQuery({
    queryKey: ['teacher', 'classes'],
    queryFn: async () => {
      const res = await lmsApi.get('/classes')
      return resultOf<ClassRoom[]>(res.data)
    },
  })

  const classes = classesQuery.data ?? []

  return (
    <div>
      <PageHeader
        title="Lớp của tôi"
        description="Các lớp bạn đang dạy — bấm vào để xem điểm và tiến độ của học sinh."
      />

      {classesQuery.isPending && <ListSkeleton rows={3} />}
      {classesQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách lớp học."
          onRetry={() => classesQuery.refetch()}
        />
      )}
      {classesQuery.isSuccess && classes.length === 0 && (
        <EmptyState message="Bạn chưa được giao lớp nào." />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="text-base">{cls.name}</CardTitle>
              <CardDescription>
                {cls.grade ? `Khối ${cls.grade} • ` : ''}
                {cls.studentCount} học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline">
                <Link to={`/lms/teacher/classes/${cls.id}`}>
                  Xem điểm & tiến độ
                </Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
