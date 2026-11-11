import { useEffect, useState } from 'react'
import { useMutation, useQuery } from '@tanstack/react-query'
import { Link, useParams } from 'react-router-dom'
import {
  CheckCircle2,
  Download,
  Eye,
  FileText,
  Loader2,
  Presentation,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  apiErrorMessage,
  fetchFileBlobUrl,
  lmsApi,
  resultOf,
} from '@/lib/lms-api'
import { useAuth } from '@/lib/auth'
import type { Lesson, LessonMaterial } from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  formatBytes,
  PageHeader,
} from '@/components/lms/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

const KIND_LABEL: Record<string, string> = {
  SLIDE: 'Slide bài giảng',
  LESSON_PLAN: 'Giáo án',
}

export default function LessonDetailPage() {
  const { id } = useParams<{ id: string }>()
  const lessonId = Number(id)
  const { user } = useAuth()
  const [selected, setSelected] = useState<LessonMaterial | null>(null)
  const [blobUrl, setBlobUrl] = useState<string | null>(null)
  const [loadingPdf, setLoadingPdf] = useState(false)
  const [completed, setCompleted] = useState(false)

  const lessonQuery = useQuery({
    queryKey: ['lesson', lessonId],
    queryFn: async () => {
      const res = await lmsApi.get(`/lessons/${lessonId}`)
      return resultOf<Lesson>(res.data)
    },
    enabled: Number.isFinite(lessonId),
  })

  const materialsQuery = useQuery({
    queryKey: ['lesson-materials', lessonId],
    queryFn: async () => {
      const res = await lmsApi.get(`/lessons/${lessonId}/materials`)
      return resultOf<LessonMaterial[]>(res.data)
    },
    enabled: Number.isFinite(lessonId),
  })

  const viewedMutation = useMutation({
    mutationFn: async () => {
      await lmsApi.post(`/progress/lessons/${lessonId}/viewed`)
    },
  })

  const completeMutation = useMutation({
    mutationFn: async () => {
      await lmsApi.post(`/progress/lessons/${lessonId}/complete`)
    },
    onSuccess: () => {
      setCompleted(true)
      toast.success('Đã đánh dấu hoàn thành bài giảng')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  // Học sinh mở bài là tự đánh dấu đã xem
  useEffect(() => {
    if (user?.role === 'STUDENT' && lessonQuery.data?.published) {
      viewedMutation.mutate()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lessonQuery.data?.id, user?.role])

  // Dọn object URL cũ khi đổi tài liệu
  useEffect(() => {
    return () => {
      if (blobUrl) URL.revokeObjectURL(blobUrl)
    }
  }, [blobUrl])

  const openMaterial = async (material: LessonMaterial) => {
    setSelected(material)
    setLoadingPdf(true)
    try {
      const url = await fetchFileBlobUrl(material.storedName)
      setBlobUrl((old) => {
        if (old) URL.revokeObjectURL(old)
        return url
      })
    } catch (e) {
      toast.error(apiErrorMessage(e))
      setSelected(null)
    } finally {
      setLoadingPdf(false)
    }
  }

  if (!Number.isFinite(lessonId)) {
    return <ErrorBox message="Bài giảng không tồn tại." />
  }

  if (lessonQuery.isPending) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    )
  }

  if (lessonQuery.isError || !lessonQuery.data) {
    return (
      <ErrorBox
        message="Không tải được bài giảng. Có thể bài chưa được xuất bản hoặc bạn không có quyền xem."
        onRetry={() => lessonQuery.refetch()}
      />
    )
  }

  const lesson = lessonQuery.data
  const materials = materialsQuery.data ?? []

  return (
    <div className="space-y-6">
      <PageHeader
        title={lesson.title}
        description={lesson.description ?? undefined}
        actions={
          <>
            <Badge variant={lesson.published ? 'default' : 'secondary'}>
              {lesson.published ? 'Đã xuất bản' : 'Nháp'}
            </Badge>
            {lesson.grade && <Badge variant="outline">Khối {lesson.grade}</Badge>}
          </>
        }
      />

      {user?.role === 'STUDENT' && lesson.published && (
        <div className="flex flex-wrap items-center gap-3">
          <Button
            variant={completed ? 'secondary' : 'default'}
            disabled={completed || completeMutation.isPending}
            onClick={() => completeMutation.mutate()}
          >
            {completeMutation.isPending && (
              <Loader2 className="size-4 animate-spin" />
            )}
            <CheckCircle2 className="size-4" />
            {completed ? 'Đã hoàn thành' : 'Đánh dấu hoàn thành'}
          </Button>
          <Button variant="outline" asChild>
            <Link to="/lms/quizzes">Xem bài tập</Link>
          </Button>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tài liệu đính kèm</CardTitle>
        </CardHeader>
        <CardContent>
          {materialsQuery.isPending && <Skeleton className="h-12 w-full" />}
          {materialsQuery.isError && (
            <ErrorBox
              message="Không tải được danh sách tài liệu."
              onRetry={() => materialsQuery.refetch()}
            />
          )}
          {materialsQuery.isSuccess && materials.length === 0 && (
            <EmptyState message="Bài giảng chưa có tài liệu PDF đính kèm." />
          )}
          <div className="space-y-2">
            {materials.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => openMaterial(material)}
                className={`flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left transition-colors hover:bg-accent ${
                  selected?.id === material.id ? 'border-primary bg-accent' : ''
                }`}
              >
                {material.kind === 'SLIDE' ? (
                  <Presentation className="size-5 shrink-0 text-muted-foreground" />
                ) : (
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {material.originalName}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {KIND_LABEL[material.kind] ?? material.kind} •{' '}
                    {formatBytes(material.sizeBytes)}
                  </span>
                </span>
                <Eye className="size-4 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
        </CardContent>
      </Card>

      {selected && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-3">
            <CardTitle className="truncate text-base">
              {selected.originalName}
            </CardTitle>
            {blobUrl && (
              <Button variant="outline" size="sm" asChild>
                <a href={blobUrl} download={selected.originalName}>
                  <Download className="size-4" />
                  Tải xuống
                </a>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {loadingPdf && <Skeleton className="h-[70vh] w-full" />}
            {!loadingPdf && blobUrl && (
              <iframe
                title={selected.originalName}
                src={blobUrl}
                className="h-[70vh] w-full rounded-md border bg-white"
              />
            )}
            {!loadingPdf && !blobUrl && (
              <p className="text-sm text-muted-foreground">
                Không xem trước được file này, hãy thử tải xuống.
              </p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
