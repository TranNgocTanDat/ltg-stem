import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  Eye,
  FileText,
  Loader2,
  Pencil,
  Plus,
  Presentation,
  Trash2,
  Upload,
} from 'lucide-react'
import { toast } from 'sonner'
import { apiErrorMessage, lmsApi, resultOf } from '@/lib/lms-api'
import type { Lesson, LessonMaterial, Page } from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  FieldError,
  ListSkeleton,
  PageHeader,
  formatBytes,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

interface LessonForm {
  title: string
  description: string
  grade: string
  orderIndex: string
}

const EMPTY_FORM: LessonForm = {
  title: '',
  description: '',
  grade: '',
  orderIndex: '0',
}

const KIND_LABEL: Record<string, string> = {
  SLIDE: 'Slide bài giảng',
  LESSON_PLAN: 'Giáo án',
}

export default function AdminLessonsPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Lesson | null>(null)
  const [form, setForm] = useState<LessonForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [materialsLesson, setMaterialsLesson] = useState<Lesson | null>(null)
  const [uploadKind, setUploadKind] = useState<'SLIDE' | 'LESSON_PLAN'>('SLIDE')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const lessonsQuery = useQuery({
    queryKey: ['admin', 'lessons'],
    queryFn: async () => {
      const res = await lmsApi.get('/lessons?size=100&sort=orderIndex,asc')
      return resultOf<Page<Lesson>>(res.data).content
    },
  })

  const materialsQuery = useQuery({
    queryKey: ['admin', 'lesson-materials', materialsLesson?.id],
    queryFn: async () => {
      const res = await lmsApi.get(
        `/lessons/${materialsLesson?.id}/materials`,
      )
      return resultOf<LessonMaterial[]>(res.data)
    },
    enabled: materialsLesson !== null,
  })

  const invalidateLessons = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'lessons'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        grade: form.grade ? Number(form.grade) : null,
        orderIndex: Number(form.orderIndex) || 0,
      }
      if (editing) {
        const res = await lmsApi.put(`/lessons/${editing.id}`, payload)
        return resultOf<Lesson>(res.data)
      }
      const res = await lmsApi.post('/lessons', payload)
      return resultOf<Lesson>(res.data)
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật bài giảng' : 'Đã tạo bài giảng')
      setDialogOpen(false)
      invalidateLessons()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await lmsApi.delete(`/lessons/${id}`)
    },
    onSuccess: () => {
      toast.success('Đã xóa bài giảng')
      setConfirmDeleteId(null)
      invalidateLessons()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const publishMutation = useMutation({
    mutationFn: async (lesson: Lesson) => {
      await lmsApi.post(
        `/lessons/${lesson.id}/${lesson.published ? 'unpublish' : 'publish'}`,
      )
    },
    onSuccess: (_, lesson) => {
      toast.success(
        lesson.published ? 'Đã gỡ xuất bản' : 'Đã xuất bản bài giảng',
      )
      invalidateLessons()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!materialsLesson) return
      const formData = new FormData()
      formData.append('file', file)
      formData.append('kind', uploadKind)
      const res = await lmsApi.post(
        `/lessons/${materialsLesson.id}/materials`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return resultOf<LessonMaterial>(res.data)
    },
    onSuccess: () => {
      toast.success('Đã tải tài liệu lên')
      materialsQuery.refetch()
      invalidateLessons()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const deleteMaterialMutation = useMutation({
    mutationFn: async (materialId: number) => {
      await lmsApi.delete(`/lessons/materials/${materialId}`)
    },
    onSuccess: () => {
      toast.success('Đã xóa tài liệu')
      materialsQuery.refetch()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setDialogOpen(true)
  }

  const openEdit = (lesson: Lesson) => {
    setEditing(lesson)
    setForm({
      title: lesson.title,
      description: lesson.description ?? '',
      grade: lesson.grade ? String(lesson.grade) : '',
      orderIndex: String(lesson.orderIndex),
    })
    setFormError('')
    setDialogOpen(true)
  }

  const submitForm = () => {
    if (!form.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề bài giảng')
      return
    }
    saveMutation.mutate()
  }

  const onFilePicked = (file: File | undefined) => {
    if (!file) return
    if (!file.name.toLowerCase().endsWith('.pdf')) {
      toast.error('Chỉ chấp nhận file PDF')
      return
    }
    if (file.size > 50 * 1024 * 1024) {
      toast.error('File PDF không được vượt quá 50MB')
      return
    }
    uploadMutation.mutate(file)
  }

  const lessons = lessonsQuery.data ?? []

  return (
    <div>
      <PageHeader
        title="Quản lý bài giảng"
        description="Tạo bài giảng, xuất bản và tải lên slide/giáo án PDF."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo bài giảng
          </Button>
        }
      />

      {lessonsQuery.isPending && <ListSkeleton rows={4} />}
      {lessonsQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách bài giảng."
          onRetry={() => lessonsQuery.refetch()}
        />
      )}
      {lessonsQuery.isSuccess && lessons.length === 0 && (
        <EmptyState message="Chưa có bài giảng nào." />
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
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="line-clamp-2 flex-1 text-sm text-muted-foreground">
                {lesson.description || 'Chưa có mô tả.'}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => publishMutation.mutate(lesson)}
                  disabled={publishMutation.isPending}
                >
                  <Eye className="size-4" />
                  {lesson.published ? 'Gỡ xuất bản' : 'Xuất bản'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setMaterialsLesson(lesson)}
                >
                  <Upload className="size-4" />
                  Tài liệu
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(lesson)}
                >
                  <Pencil className="size-4" />
                  Sửa
                </Button>
                {confirmDeleteId === lesson.id ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(lesson.id)}
                  >
                    Chắc chắn xóa?
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDeleteId(lesson.id)}
                  >
                    <Trash2 className="size-4 text-destructive" />
                    Xóa
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Dialog tạo/sửa bài giảng */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Sửa bài giảng' : 'Tạo bài giảng mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lessonTitle">Tiêu đề</Label>
              <Input
                id="lessonTitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <FieldError message={formError} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lessonDesc">Mô tả</Label>
              <Textarea
                id="lessonDesc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Khối</Label>
                <Select
                  value={form.grade || 'none'}
                  onValueChange={(v) =>
                    setForm({ ...form, grade: v === 'none' ? '' : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn khối" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Không chọn</SelectItem>
                    {[1, 2, 3, 4, 5].map((g) => (
                      <SelectItem key={g} value={String(g)}>
                        Khối {g}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="orderIndex">Thứ tự</Label>
                <Input
                  id="orderIndex"
                  type="number"
                  value={form.orderIndex}
                  onChange={(e) =>
                    setForm({ ...form, orderIndex: e.target.value })
                  }
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={submitForm} disabled={saveMutation.isPending}>
              {saveMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {editing ? 'Lưu thay đổi' : 'Tạo bài giảng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog tài liệu */}
      <Dialog
        open={materialsLesson !== null}
        onOpenChange={(open) => !open && setMaterialsLesson(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tài liệu — {materialsLesson?.title}</DialogTitle>
            <DialogDescription>
              Tải lên slide bài giảng hoặc giáo án (file PDF, tối đa 50MB).
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Select
              value={uploadKind}
              onValueChange={(v) =>
                setUploadKind(v as 'SLIDE' | 'LESSON_PLAN')
              }
            >
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SLIDE">Slide bài giảng</SelectItem>
                <SelectItem value="LESSON_PLAN">Giáo án</SelectItem>
              </SelectContent>
            </Select>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf,.pdf"
              className="hidden"
              onChange={(e) => {
                onFilePicked(e.target.files?.[0])
                e.target.value = ''
              }}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploadMutation.isPending}
            >
              {uploadMutation.isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Upload className="size-4" />
              )}
              Chọn file PDF để tải lên
            </Button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {materialsQuery.isPending && <ListSkeleton rows={2} />}
            {(materialsQuery.data ?? []).map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 rounded-md border px-3 py-2.5"
              >
                {m.kind === 'SLIDE' ? (
                  <Presentation className="size-5 shrink-0 text-muted-foreground" />
                ) : (
                  <FileText className="size-5 shrink-0 text-muted-foreground" />
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium">
                    {m.originalName}
                  </span>
                  <span className="block text-xs text-muted-foreground">
                    {KIND_LABEL[m.kind]} • {formatBytes(m.sizeBytes)}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={deleteMaterialMutation.isPending}
                  onClick={() => deleteMaterialMutation.mutate(m.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            {materialsQuery.isSuccess &&
              (materialsQuery.data ?? []).length === 0 && (
                <EmptyState message="Bài giảng chưa có tài liệu nào." />
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setMaterialsLesson(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
