import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Loader2, Pencil, Plus, Trash2, Users } from 'lucide-react'
import { toast } from 'sonner'
import { apiErrorMessage, lmsApi, resultOf } from '@/lib/lms-api'
import type { ClassRoom, Page, User } from '@/lib/lms-types'
import {
  EmptyState,
  ErrorBox,
  FieldError,
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

interface ClassForm {
  name: string
  grade: string
  teacherId: string
}

const EMPTY_FORM: ClassForm = { name: '', grade: '', teacherId: '' }

export default function AdminClassesPage() {
  const queryClient = useQueryClient()
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<ClassRoom | null>(null)
  const [form, setForm] = useState<ClassForm>(EMPTY_FORM)
  const [formError, setFormError] = useState('')
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [studentsDialog, setStudentsDialog] = useState<ClassRoom | null>(null)
  const [addStudentId, setAddStudentId] = useState('')

  const classesQuery = useQuery({
    queryKey: ['admin', 'classes'],
    queryFn: async () => {
      const res = await lmsApi.get('/classes')
      return resultOf<ClassRoom[]>(res.data)
    },
  })

  const teachersQuery = useQuery({
    queryKey: ['admin', 'teachers-list'],
    queryFn: async () => {
      const res = await lmsApi.get('/users?role=TEACHER&size=100')
      return resultOf<Page<User>>(res.data).content
    },
  })

  const studentsQuery = useQuery({
    queryKey: ['admin', 'students-list'],
    queryFn: async () => {
      const res = await lmsApi.get('/users?role=STUDENT&size=100')
      return resultOf<Page<User>>(res.data).content
    },
  })

  const classStudentsQuery = useQuery({
    queryKey: ['admin', 'class-students', studentsDialog?.id],
    queryFn: async () => {
      const res = await lmsApi.get(
        `/users?role=STUDENT&classRoomId=${studentsDialog?.id}&size=100`,
      )
      return resultOf<Page<User>>(res.data).content
    },
    enabled: studentsDialog !== null,
  })

  const invalidateClasses = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'classes'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        name: form.name.trim(),
        grade: form.grade ? Number(form.grade) : null,
        teacherId: form.teacherId ? Number(form.teacherId) : null,
      }
      if (editing) {
        const res = await lmsApi.put(`/classes/${editing.id}`, payload)
        return resultOf<ClassRoom>(res.data)
      }
      const res = await lmsApi.post('/classes', payload)
      return resultOf<ClassRoom>(res.data)
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật lớp học' : 'Đã tạo lớp học')
      setDialogOpen(false)
      invalidateClasses()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await lmsApi.delete(`/classes/${id}`)
    },
    onSuccess: () => {
      toast.success('Đã xóa lớp học')
      setConfirmDeleteId(null)
      invalidateClasses()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const addStudentMutation = useMutation({
    mutationFn: async () => {
      if (!studentsDialog || !addStudentId) return
      await lmsApi.post(`/classes/${studentsDialog.id}/students`, {
        userIds: [Number(addStudentId)],
      })
    },
    onSuccess: () => {
      toast.success('Đã thêm học sinh vào lớp')
      setAddStudentId('')
      classStudentsQuery.refetch()
      invalidateClasses()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const removeStudentMutation = useMutation({
    mutationFn: async (studentId: number) => {
      if (!studentsDialog) return
      await lmsApi.delete(
        `/classes/${studentsDialog.id}/students/${studentId}`,
      )
    },
    onSuccess: () => {
      toast.success('Đã gỡ học sinh khỏi lớp')
      classStudentsQuery.refetch()
      invalidateClasses()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormError('')
    setDialogOpen(true)
  }

  const openEdit = (c: ClassRoom) => {
    setEditing(c)
    setForm({
      name: c.name,
      grade: c.grade ? String(c.grade) : '',
      teacherId: c.teacherId ? String(c.teacherId) : '',
    })
    setFormError('')
    setDialogOpen(true)
  }

  const submitForm = () => {
    if (!form.name.trim()) {
      setFormError('Vui lòng nhập tên lớp')
      return
    }
    saveMutation.mutate()
  }

  const classes = classesQuery.data ?? []
  const availableStudents = (studentsQuery.data ?? []).filter(
    (s) =>
      !s.classRoomId ||
      (studentsDialog && s.classRoomId === studentsDialog.id),
  )

  return (
    <div>
      <PageHeader
        title="Quản lý lớp học"
        description="Tạo lớp, giao giáo viên chủ nhiệm và xếp học sinh."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo lớp học
          </Button>
        }
      />

      {classesQuery.isPending && <ListSkeleton rows={3} />}
      {classesQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách lớp học."
          onRetry={() => classesQuery.refetch()}
        />
      )}
      {classesQuery.isSuccess && classes.length === 0 && (
        <EmptyState message="Chưa có lớp học nào." />
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {classes.map((cls) => (
          <Card key={cls.id}>
            <CardHeader>
              <CardTitle className="text-base">{cls.name}</CardTitle>
              <CardDescription>
                {cls.grade ? `Khối ${cls.grade} • ` : ''}
                {cls.teacherName
                  ? `Giáo viên: ${cls.teacherName}`
                  : 'Chưa có giáo viên'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">
                {cls.studentCount} học sinh
              </p>
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setStudentsDialog(cls)}
                >
                  <Users className="size-4" />
                  Học sinh
                </Button>
                <Button variant="ghost" size="sm" onClick={() => openEdit(cls)}>
                  <Pencil className="size-4" />
                  Sửa
                </Button>
                {confirmDeleteId === cls.id ? (
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={deleteMutation.isPending}
                    onClick={() => deleteMutation.mutate(cls.id)}
                  >
                    Chắc chắn xóa?
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setConfirmDeleteId(cls.id)}
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

      {/* Dialog tạo/sửa lớp */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Sửa lớp học' : 'Tạo lớp học mới'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="className">Tên lớp</Label>
              <Input
                id="className"
                placeholder="Ví dụ: Lớp 4A"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <FieldError message={formError} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="grade">Khối</Label>
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
              <Label>Giáo viên chủ nhiệm</Label>
              <Select
                value={form.teacherId || 'none'}
                onValueChange={(v) =>
                  setForm({ ...form, teacherId: v === 'none' ? '' : v })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Chọn giáo viên" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Chưa giao</SelectItem>
                  {(teachersQuery.data ?? []).map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.fullName} ({t.email})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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
              {editing ? 'Lưu thay đổi' : 'Tạo lớp học'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog quản lý học sinh */}
      <Dialog
        open={studentsDialog !== null}
        onOpenChange={(open) => !open && setStudentsDialog(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Học sinh — {studentsDialog?.name}</DialogTitle>
            <DialogDescription>
              Thêm học sinh chưa xếp lớp, hoặc gỡ học sinh khỏi lớp.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-2">
            <Select value={addStudentId} onValueChange={setAddStudentId}>
              <SelectTrigger className="flex-1">
                <SelectValue placeholder="Chọn học sinh để thêm" />
              </SelectTrigger>
              <SelectContent>
                {availableStudents
                  .filter(
                    (s) => s.classRoomId !== studentsDialog?.id,
                  )
                  .map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.fullName} ({s.email})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <Button
              onClick={() => addStudentMutation.mutate()}
              disabled={!addStudentId || addStudentMutation.isPending}
            >
              Thêm
            </Button>
          </div>
          <div className="max-h-64 space-y-1 overflow-y-auto">
            {classStudentsQuery.isPending && <SkeletonList />}
            {(classStudentsQuery.data ?? []).map((s) => (
              <div
                key={s.id}
                className="flex items-center justify-between rounded-md px-3 py-2 hover:bg-accent"
              >
                <span className="text-sm">
                  {s.fullName}
                  <span className="block text-xs text-muted-foreground">
                    {s.email}
                  </span>
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  disabled={removeStudentMutation.isPending}
                  onClick={() => removeStudentMutation.mutate(s.id)}
                >
                  Gỡ khỏi lớp
                </Button>
              </div>
            ))}
            {classStudentsQuery.isSuccess &&
              (classStudentsQuery.data ?? []).length === 0 && (
                <EmptyState message="Lớp chưa có học sinh nào." />
              )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setStudentsDialog(null)}>
              Đóng
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function SkeletonList() {
  return (
    <div className="space-y-2">
      <div className="h-10 animate-pulse rounded-md bg-accent" />
      <div className="h-10 animate-pulse rounded-md bg-accent" />
    </div>
  )
}
