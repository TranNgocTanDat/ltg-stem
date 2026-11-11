import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { Search } from 'lucide-react'
import { lmsApi, resultOf } from '@/lib/lms-api'
import { useAuth } from '@/lib/auth'
import type { Lesson, Page } from '@/lib/lms-types'
import { EmptyState, ErrorBox, ListSkeleton, PageHeader } from '@/components/lms/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function LessonsPage() {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [grade, setGrade] = useState<string>('all')
  const [published, setPublished] = useState<string>('all')

  const params = new URLSearchParams({ size: '100', sort: 'orderIndex,asc' })
  if (grade !== 'all') params.set('grade', grade)
  if (published !== 'all' && user?.role !== 'STUDENT')
    params.set('published', published)

  const lessonsQuery = useQuery({
    queryKey: ['lessons', grade, published],
    queryFn: async () => {
      const res = await lmsApi.get(`/lessons?${params.toString()}`)
      return resultOf<Page<Lesson>>(res.data).content
    },
  })

  const lessons = (lessonsQuery.data ?? []).filter((lesson) =>
    search.trim()
      ? lesson.title.toLowerCase().includes(search.trim().toLowerCase())
      : true,
  )

  return (
    <div>
      <PageHeader
        title="Bài giảng"
        description={
          user?.role === 'STUDENT'
            ? 'Các bài giảng đã xuất bản — bấm vào để xem slide và giáo án.'
            : 'Danh sách bài giảng trong hệ thống.'
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên bài giảng..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={grade} onValueChange={setGrade}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Khối" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi khối</SelectItem>
            {[1, 2, 3, 4, 5].map((g) => (
              <SelectItem key={g} value={String(g)}>
                Khối {g}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {user?.role !== 'STUDENT' && (
          <Select value={published} onValueChange={setPublished}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả</SelectItem>
              <SelectItem value="true">Đã xuất bản</SelectItem>
              <SelectItem value="false">Chưa xuất bản</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      {lessonsQuery.isPending && <ListSkeleton rows={4} />}
      {lessonsQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách bài giảng."
          onRetry={() => lessonsQuery.refetch()}
        />
      )}
      {lessonsQuery.isSuccess && lessons.length === 0 && (
        <EmptyState message="Chưa có bài giảng nào phù hợp." />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {lessons.map((lesson) => (
          <Card key={lesson.id} className="flex flex-col">
            <CardHeader>
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="line-clamp-2 text-base">
                  {lesson.title}
                </CardTitle>
                <Badge variant={lesson.published ? 'default' : 'secondary'}>
                  {lesson.published ? 'Đã xuất bản' : 'Nháp'}
                </Badge>
              </div>
              <CardDescription>
                {lesson.grade ? `Khối ${lesson.grade}` : 'Mọi khối'}
                {lesson.createdByName ? ` • ${lesson.createdByName}` : ''}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-1 flex-col">
              <p className="line-clamp-3 flex-1 text-sm text-muted-foreground">
                {lesson.description || 'Chưa có mô tả.'}
              </p>
              <Button asChild className="mt-4" variant="outline">
                <Link to={`/lms/lessons/${lesson.id}`}>Xem bài giảng</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
