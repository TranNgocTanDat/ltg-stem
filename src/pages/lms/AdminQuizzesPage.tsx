import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  CalendarPlus,
  ListPlus,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  X,
} from 'lucide-react'
import { toast } from 'sonner'
import { apiErrorMessage, lmsApi, resultOf } from '@/lib/lms-api'
import type {
  ClassRoom,
  Lesson,
  Page,
  Question,
  Quiz,
} from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  FieldError,
  ListSkeleton,
  PageHeader,
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

interface QuizForm {
  title: string
  description: string
  lessonId: string
  durationMinutes: string
  maxAttempts: string
  published: boolean
}

const EMPTY_FORM: QuizForm = {
  title: '',
  description: '',
  lessonId: '',
  durationMinutes: '',
  maxAttempts: '1',
  published: false,
}

export default function AdminQuizzesPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<Quiz | null>(null)
  const [form, setForm] = useState<QuizForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [questionsQuiz, setQuestionsQuiz] = useState<Quiz | null>(null)
  const [assignQuiz, setAssignQuiz] = useState<Quiz | null>(null)
  const [addQuestionId, setAddQuestionId] = useState('')
  const [addPoints, setAddPoints] = useState('1')
  const [assignClassId, setAssignClassId] = useState('')
  const [assignDueDate, setAssignDueDate] = useState('')

  const quizzesQuery = useQuery({
    queryKey: ['admin', 'quizzes'],
    queryFn: async () => {
      const res = await lmsApi.get('/quizzes?size=100&sort=createdAt,desc')
      return resultOf<Page<Quiz>>(res.data).content
    },
  })

  const lessonsQuery = useQuery({
    queryKey: ['admin', 'lessons-list'],
    queryFn: async () => {
      const res = await lmsApi.get('/lessons?size=100')
      return resultOf<Page<Lesson>>(res.data).content
    },
  })

  const questionsBankQuery = useQuery({
    queryKey: ['admin', 'questions-bank'],
    queryFn: async () => {
      const res = await lmsApi.get('/questions?size=100')
      return resultOf<Page<Question>>(res.data).content
    },
  })

  const classesQuery = useQuery({
    queryKey: ['admin', 'classes-list'],
    queryFn: async () => {
      const res = await lmsApi.get('/classes')
      return resultOf<ClassRoom[]>(res.data)
    },
  })

  const quizDetailQuery = useQuery({
    queryKey: ['admin', 'quiz-detail', questionsQuiz?.id],
    queryFn: async () => {
      const res = await lmsApi.get(`/quizzes/${questionsQuiz?.id}`)
      return resultOf<Quiz>(res.data)
    },
    enabled: questionsQuiz !== null,
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'quizzes'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim() || null,
        lessonId: form.lessonId ? Number(form.lessonId) : null,
        durationMinutes: form.durationMinutes
          ? Number(form.durationMinutes)
          : null,
        maxAttempts: Number(form.maxAttempts) || 1,
        published: form.published,
      }
      if (editing) {
        const res = await lmsApi.put(`/quizzes/${editing.id}`, payload)
        return resultOf<Quiz>(res.data)
      }
      const res = await lmsApi.post('/quizzes', payload)
      return resultOf<Quiz>(res.data)
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật bài tập' : 'Đã tạo bài tập')
      setDialogOpen(false)
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await lmsApi.delete(`/quizzes/${id}`)
    },
    onSuccess: () => {
      toast.success('Đã xóa bài tập')
      setConfirmDeleteId(null)
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const addQuestionMutation = useMutation({
    mutationFn: async () => {
      if (!questionsQuiz || !addQuestionId) return
      await lmsApi.post(`/quizzes/${questionsQuiz.id}/questions`, {
        questionId: Number(addQuestionId),
        points: Number(addPoints) || 1,
      })
    },
    onSuccess: () => {
      toast.success('Đã thêm câu hỏi vào bài tập')
      setAddQuestionId('')
      setAddPoints('1')
      quizDetailQuery.refetch()
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const removeQuestionMutation = useMutation({
    mutationFn: async (questionId: number) => {
      if (!questionsQuiz) return
      await lmsApi.delete(
        `/quizzes/${questionsQuiz.id}/questions/${questionId}`,
      )
    },
    onSuccess: () => {
      toast.success('Đã gỡ câu hỏi khỏi bài tập')
      quizDetailQuery.refetch()
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const assignMutation = useMutation({
    mutationFn: async () => {
      if (!assignQuiz || !assignClassId) return
      await lmsApi.post(`/quizzes/${assignQuiz.id}/assign`, {
        classRoomId: Number(assignClassId),
        dueDate: assignDueDate
          ? new Date(assignDueDate).toISOString()
          : null,
      })
    },
    onSuccess: () => {
      toast.success('Đã giao bài tập cho lớp')
      setAssignQuiz(null)
      setAssignClassId('')
      setAssignDueDate('')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setDialogOpen(true)
  }

  const openEdit = (q: Quiz) => {
    setEditing(q)
    setForm({
      title: q.title,
      description: q.description ?? '',
      lessonId: q.lessonId ? String(q.lessonId) : '',
      durationMinutes: q.durationMinutes ? String(q.durationMinutes) : '',
      maxAttempts: String(q.maxAttempts),
      published: q.published,
    })
    setFormError('')
    setDialogOpen(true)
  }

  const submitForm = () => {
    if (!form.title.trim()) {
      setFormError('Vui lòng nhập tiêu đề bài tập')
      return
    }
    saveMutation.mutate()
  }

  const quizzes = quizzesQuery.data ?? []
  const detailQuestions = quizDetailQuery.data?.questions ?? []

  return (
    <div>
      <PageHeader
        title="Quản lý bài tập"
        description="Tạo bài tập, thêm câu hỏi và giao cho lớp học."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo bài tập
          </Button>
        }
      />

      {quizzesQuery.isPending && <ListSkeleton rows={4} />}
      {quizzesQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách bài tập."
          onRetry={() => quizzesQuery.refetch()}
        />
      )}
      {quizzesQuery.isSuccess && quizzes.length === 0 && (
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
            <CardContent className="flex flex-1 flex-col gap-3">
              <p className="text-sm text-muted-foreground">
                {quiz.questions.length} câu hỏi • Tối đa {quiz.maxAttempts}{' '}
                lượt làm
                {quiz.durationMinutes ? ` • ${quiz.durationMinutes} phút` : ''}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setQuestionsQuiz(quiz)}
                >
                  <ListPlus className="size-4" />
                  Câu hỏi
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAssignQuiz(quiz)}
                >
                  <CalendarPlus className="size-4" />
                  Giao lớp
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openEdit(quiz)}
                >
                  <Pencil className="size-4" />
                  Sửa
                </Button>
                {confirmDeleteId === quiz.id ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(quiz.id)}
                  >
                    Chắc chắn xóa?
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDeleteId(quiz.id)}
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

      {/* Dialog tạo/sửa bài tập */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Sửa bài tập' : 'Tạo bài tập mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quizTitle">Tiêu đề</Label>
              <Input
                id="quizTitle"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <FieldError message={formError} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quizDesc">Mô tả</Label>
              <Textarea
                id="quizDesc"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>Bài giảng liên quan</Label>
              <Select
                value={form.lessonId || 'none'}
                onValueChange={(v) =>
                  setForm({ ...form, lessonId: v === 'none' ? '' : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn bài giảng" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Không gắn bài giảng</SelectItem>
                  {(lessonsQuery.data ?? []).map((l) => (
                    <SelectItem key={l.id} value={String(l.id)}>
                      {l.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Thời gian (phút)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  placeholder="Không giới hạn"
                  value={form.durationMinutes}
                  onChange={(e) =>
                    setForm({ ...form, durationMinutes: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="maxAttempts">Số lượt làm tối đa</Label>
                <Input
                  id="maxAttempts"
                  type="number"
                  min={1}
                  value={form.maxAttempts}
                  onChange={(e) =>
                    setForm({ ...form, maxAttempts: e.target.value })
                  }
                />
              </div>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <Checkbox
                checked={form.published}
                onCheckedChange={(v) =>
                  setForm({ ...form, published: v === true })
                }
              />
              Xuất bản ngay (học sinh chỉ thấy bài đã xuất bản và được giao)
            </label>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={submitForm} disabled={saveMutation.isPending}>
              {saveMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              {editing ? 'Lưu thay đổi' : 'Tạo bài tập'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog quản lý câu hỏi của bài tập */}
      <Dialog
        open={questionsQuiz !== null}
        onOpenChange={(open) => !open && setQuestionsQuiz(null)}
      >
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Câu hỏi — {questionsQuiz?.title}</DialogTitle>
            <DialogDescription>
              Thêm câu hỏi từ ngân hàng câu hỏi, kèm số điểm từng câu.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-wrap items-center gap-2">
            <Select value={addQuestionId} onValueChange={setAddQuestionId}>
              <SelectTrigger className="min-w-0 flex-1">
                <SelectValue placeholder="Chọn câu hỏi để thêm" />
              </SelectTrigger>
              <SelectContent>
                {(questionsBankQuery.data ?? [])
                  .filter(
                    (q) =>
                      !detailQuestions.some((dq) => dq.questionId === q.id),
                  )
                  .map((q) => (
                    <SelectItem key={q.id} value={String(q.id)}>
                      {q.content}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Input
              type="number"
              min={1}
              className="w-20"
              value={addPoints}
              onChange={(e) => setAddPoints(e.target.value)}
              title="Điểm"
            />
            <Button
              onClick={() => addQuestionMutation.mutate()}
              disabled={!addQuestionId || addQuestionMutation.isPending}
            >
              Thêm
            </Button>
          </div>
          <div className="max-h-80 space-y-2 overflow-y-auto">
            {quizDetailQuery.isPending && <ListSkeleton rows={2} />}
            {detailQuestions.map((qq, idx) => (
              <div
                key={qq.questionId}
                className="flex items-start gap-3 rounded-md border px-3 py-2.5"
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">
                    Câu {idx + 1} ({qq.points} điểm):{' '}
                    {qq.question.content}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={removeQuestionMutation.isPending}
                  onClick={() =>
                    removeQuestionMutation.mutate(qq.questionId)
                  }
                >
                  <X className="size-4 text-destructive" />
                </Button>
              </div>
            ))}
            {quizDetailQuery.isSuccess && detailQuestions.length === 0 && (
              <EmptyState message="Bài tập chưa có câu hỏi nào." />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setQuestionsQuiz(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog giao bài cho lớp */}
      <Dialog
        open={assignQuiz !== null}
        onOpenChange={(open) => !open && setAssignQuiz(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Giao bài tập — {assignQuiz?.title}</DialogTitle>
            <DialogDescription>
              Học sinh trong lớp sẽ thấy bài tập này khi đã xuất bản.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Lớp học</Label>
              <Select value={assignClassId} onValueChange={setAssignClassId}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn lớp" />
                </SelectTrigger>
                <SelectContent>
                  {(classesQuery.data ?? []).map((c) => (
                    <SelectItem key={c.id} value={String(c.id)}>
                      {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="dueDate">Hạn nộp (không bắt buộc)</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={assignDueDate}
                onChange={(e) => setAssignDueDate(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAssignQuiz(null)}>
              Hủy
            </Button>
            <Button
              onClick={() => assignMutation.mutate()}
              disabled={!assignClassId || assignMutation.isPending}
            >
              {assignMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Giao bài tập
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
