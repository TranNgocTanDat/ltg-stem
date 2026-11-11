import { useRef, useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  ImagePlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import {
  apiErrorMessage,
  lmsApi,
  questionImageUrl,
  resultOf,
} from '@/lib/lms-api'
import type { Page, Question, QuestionType } from '@/lib/lms-types'
import { QUESTION_TYPE_LABEL } from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  FieldError,
  ListSkeleton,
  PageHeader,
} from '@/components/lms/common'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
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

interface OptionForm {
  text: string
  correct: boolean
}

interface QuestionForm {
  type: QuestionType
  content: string
  explanation: string
  points: string
  options: OptionForm[]
}

const EMPTY_FORM: QuestionForm = {
  type: 'SINGLE',
  content: '',
  explanation: '',
  points: '1',
  options: [
    { text: '', correct: true },
    { text: '', correct: false },
  ],
}

export default function AdminQuestionsPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Question | null>(null)
  const [form, setForm] = useState<QuestionForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [imageError, setImageError] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const params = new URLSearchParams({ size: '100', sort: 'createdAt,desc' })
  if (typeFilter !== 'all') params.set('type', typeFilter)
  if (search.trim()) params.set('search', search.trim())

  const questionsQuery = useQuery({
    queryKey: ['admin', 'questions', typeFilter, search],
    queryFn: async () => {
      const res = await lmsApi.get(`/questions?${params.toString()}`)
      return resultOf<Page<Question>>(res.data).content
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'questions'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const options = form.options.map((o, i) => ({
        text: o.text.trim(),
        correct: o.correct,
        orderIndex: i,
      }))
      const payload = {
        type: form.type,
        content: form.content.trim(),
        explanation: form.explanation.trim() || null,
        points: Number(form.points) || 1,
        options,
      }
      if (editing) {
        const res = await lmsApi.put(`/questions/${editing.id}`, payload)
        return resultOf<Question>(res.data)
      }
      const res = await lmsApi.post('/questions', payload)
      return resultOf<Question>(res.data)
    },
    onSuccess: (data) => {
      toast.success(editing ? 'Đã cập nhật câu hỏi' : 'Đã tạo câu hỏi')
      if (!editing) {
        // Mở lại form sửa để có thể tải ảnh lên ngay
        setEditing(data)
        setForm({
          type: data.type,
          content: data.content,
          explanation: data.explanation ?? '',
          points: String(data.points),
          options: data.options.map((o) => ({
            text: o.text,
            correct: o.correct ?? false,
          })),
        })
      } else {
        setDialogOpen(false)
      }
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await lmsApi.delete(`/questions/${id}`)
    },
    onSuccess: () => {
      toast.success('Đã xóa câu hỏi')
      setConfirmDeleteId(null)
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const uploadImageMutation = useMutation({
    mutationFn: async (file: File) => {
      if (!editing) return
      const formData = new FormData()
      formData.append('file', file)
      const res = await lmsApi.post(
        `/questions/${editing.id}/image`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      )
      return resultOf<Question>(res.data)
    },
    onSuccess: (data) => {
      toast.success('Đã tải ảnh minh họa lên')
      if (data) setEditing(data)
      setImageError(false)
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const setType = (type: QuestionType) => {
    if (type === 'TRUE_FALSE') {
      setForm({
        ...form,
        type,
        options: [
          { text: 'Đúng', correct: true },
          { text: 'Sai', correct: false },
        ],
      })
    } else {
      setForm({ ...form, type })
    }
  }

  const setOptionCorrect = (index: number, checked: boolean) => {
    setForm((prev) => {
      const options = prev.options.map((o, i) => ({
        ...o,
        correct:
          prev.type === 'SINGLE'
            ? i === index
              ? checked
              : false
            : i === index
              ? checked
              : o.correct,
      }))
      return { ...prev, options }
    })
  }

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setImageError(false)
    setDialogOpen(true)
  }

  const openEdit = (q: Question) => {
    setEditing(q)
    setForm({
      type: q.type,
      content: q.content,
      explanation: q.explanation ?? '',
      points: String(q.points),
      options: q.options.map((o) => ({
        text: o.text,
        correct: o.correct ?? false,
      })),
    })
    setFormError('')
    setImageError(false)
    setDialogOpen(true)
  }

  const submitForm = () => {
    if (!form.content.trim()) {
      setFormError('Vui lòng nhập nội dung câu hỏi')
      return
    }
    const filled = form.options.filter((o) => o.text.trim())
    if (filled.length < 2) {
      setFormError('Câu hỏi phải có ít nhất 2 lựa chọn')
      return
    }
    if (!filled.some((o) => o.correct)) {
      setFormError('Phải đánh dấu ít nhất một đáp án đúng')
      return
    }
    setFormError('')
    saveMutation.mutate()
  }

  const onImagePicked = (file: File | undefined) => {
    if (!file) return
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      toast.error('Chỉ chấp nhận ảnh jpg, png hoặc webp')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ảnh không được vượt quá 5MB')
      return
    }
    uploadImageMutation.mutate(file)
  }

  const questions = questionsQuery.data ?? []

  return (
    <div>
      <PageHeader
        title="Ngân hàng câu hỏi"
        description="Câu hỏi trắc nghiệm dùng chung cho các bài tập."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo câu hỏi
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Input
          placeholder="Tìm theo nội dung câu hỏi..."
          className="min-w-56 flex-1"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Loại câu hỏi" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi loại</SelectItem>
            <SelectItem value="SINGLE">Một đáp án</SelectItem>
            <SelectItem value="MULTIPLE">Nhiều đáp án</SelectItem>
            <SelectItem value="TRUE_FALSE">Đúng / Sai</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {questionsQuery.isPending && <ListSkeleton rows={4} />}
      {questionsQuery.isError && (
        <ErrorBox
          message="Không tải được ngân hàng câu hỏi."
          onRetry={() => questionsQuery.refetch()}
        />
      )}
      {questionsQuery.isSuccess && questions.length === 0 && (
        <EmptyState message="Chưa có câu hỏi nào phù hợp." />
      )}

      <div className="space-y-3">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className="flex flex-wrap items-start justify-between gap-3 rounded-lg border p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-medium">
                Câu {idx + 1}: {q.content}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {QUESTION_TYPE_LABEL[q.type]} • {q.points} điểm •{' '}
                {q.options.length} lựa chọn
                {q.imagePath ? ' • Có ảnh minh họa' : ''}
              </p>
              <div className="mt-2 flex flex-wrap gap-1.5">
                {q.options.map((o) => (
                  <Badge
                    key={o.id}
                    variant={o.correct ? 'default' : 'outline'}
                  >
                    {o.text}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="flex gap-1">
              <Button variant="ghost" size="icon" onClick={() => openEdit(q)}>
                <Pencil className="size-4" />
              </Button>
              {confirmDeleteId === q.id ? (
                <Button
                  variant="destructive"
                  size="sm"
                  disabled={deleteMutation.isPending}
                  onClick={() => deleteMutation.mutate(q.id)}
                >
                  Chắc chắn xóa?
                </Button>
              ) : (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setConfirmDeleteId(q.id)}
                >
                  <Trash2 className="size-4 text-destructive" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Dialog tạo/sửa câu hỏi */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Sửa câu hỏi' : 'Tạo câu hỏi mới'}
            </DialogTitle>
            <DialogDescription>
              Đáp án đúng không bao giờ hiển thị cho học sinh.
            </DialogDescription>
          </DialogHeader>
          <div className="max-h-[65vh] space-y-4 overflow-y-auto pr-1">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Loại câu hỏi</Label>
                <Select
                  value={form.type}
                  onValueChange={(v) => setType(v as QuestionType)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Một đáp án</SelectItem>
                    <SelectItem value="MULTIPLE">Nhiều đáp án</SelectItem>
                    <SelectItem value="TRUE_FALSE">Đúng / Sai</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="points">Điểm</Label>
                <Input
                  id="points"
                  type="number"
                  min={1}
                  value={form.points}
                  onChange={(e) =>
                    setForm({ ...form, points: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Nội dung câu hỏi</Label>
              <Textarea
                id="content"
                value={form.content}
                onChange={(e) =>
                  setForm({ ...form, content: e.target.value })
                }
              />
              <FieldError message={formError} />
            </div>

            <div className="space-y-2">
              <Label>Các lựa chọn</Label>
              {form.options.map((opt, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Checkbox
                    checked={opt.correct}
                    onCheckedChange={(v) =>
                      setOptionCorrect(i, v === true)
                    }
                    title="Đáp án đúng"
                  />
                  <Input
                    placeholder={`Lựa chọn ${i + 1}`}
                    value={opt.text}
                    disabled={form.type === 'TRUE_FALSE'}
                    onChange={(e) =>
                      setForm((prev) => ({
                        ...prev,
                        options: prev.options.map((o, j) =>
                          j === i ? { ...o, text: e.target.value } : o,
                        ),
                      }))
                    }
                  />
                  {form.type !== 'TRUE_FALSE' && form.options.length > 2 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() =>
                        setForm((prev) => ({
                          ...prev,
                          options: prev.options.filter((_, j) => j !== i),
                        }))
                      }
                    >
                      <X className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
              {form.type !== 'TRUE_FALSE' && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    setForm((prev) => ({
                      ...prev,
                      options: [...prev.options, { text: '', correct: false }],
                    }))
                  }
                >
                  <Plus className="size-4" />
                  Thêm lựa chọn
                </Button>
              )}
              <p className="text-xs text-muted-foreground">
                Tích vào ô vuông trước lựa chọn để đánh dấu đáp án đúng
                {form.type === 'SINGLE'
                  ? ' (chỉ được chọn một đáp án đúng).'
                  : ' (được chọn nhiều đáp án đúng).'}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="explanation">Giải thích đáp án</Label>
              <Textarea
                id="explanation"
                placeholder="Học sinh sẽ thấy phần giải thích này sau khi nộp bài."
                value={form.explanation}
                onChange={(e) =>
                  setForm({ ...form, explanation: e.target.value })
                }
              />
            </div>

            {editing && (
              <div className="space-y-2">
                <Label>Ảnh minh họa</Label>
                {editing.imagePath && !imageError ? (
                  <img
                    src={questionImageUrl(editing.imagePath)}
                    alt="Ảnh minh họa câu hỏi"
                    onError={() => setImageError(true)}
                    className="max-h-48 w-auto max-w-full rounded-md border object-contain"
                  />
                ) : (
                  <p className="text-xs text-muted-foreground">
                    {editing.imagePath
                      ? 'Không xem trước được ảnh (backend chưa có endpoint phục vụ ảnh câu hỏi).'
                      : 'Chưa có ảnh minh họa.'}
                  </p>
                )}
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={(e) => {
                    onImagePicked(e.target.files?.[0])
                    e.target.value = ''
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadImageMutation.isPending}
                >
                  {uploadImageMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <ImagePlus className="size-4" />
                  )}
                  Tải ảnh lên (jpg/png/webp, tối đa 5MB)
                </Button>
              </div>
            )}
            {!editing && (
              <p className="text-xs text-muted-foreground">
                Lưu câu hỏi xong rồi mở lại để tải ảnh minh họa lên.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={submitForm} disabled={saveMutation.isPending}>
              {saveMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {editing ? 'Lưu thay đổi' : 'Tạo câu hỏi'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
