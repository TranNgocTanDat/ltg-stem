import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { KeyRound, Loader2, Pencil, Plus, Search, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { apiErrorMessage, lmsApi, resultOf } from '@/lib/lms-api'
import type { ClassRoom, Page, Role, User } from '@/lib/lms-types'
import { ROLE_LABEL } from '@/lib/lms-types'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface UserForm {
  fullName: string
  email: string
  password: string
  role: Role
  classRoomId: string
}

const EMPTY_FORM: UserForm = {
  fullName: '',
  email: '',
  password: '',
  role: 'STUDENT',
  classRoomId: '',
}

export default function AdminUsersPage() {
  const queryClient = useQueryClient()
  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState<string>('all')
  const [dialogOpen, setDialogOpen] = useState(false)
  const [editing, setEditing] = useState<User | null>(null)
  const [form, setForm] = useState<UserForm>(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | null>(null)
  const [pwDialogUser, setPwDialogUser] = useState<User | null>(null)
  const [newPassword, setNewPassword] = useState('')

  const params = new URLSearchParams({ size: '100', sort: 'createdAt,desc' })
  if (roleFilter !== 'all') params.set('role', roleFilter)

  const usersQuery = useQuery({
    queryKey: ['admin', 'users', roleFilter],
    queryFn: async () => {
      const res = await lmsApi.get(`/users?${params.toString()}`)
      return resultOf<Page<User>>(res.data).content
    },
  })

  const classesQuery = useQuery({
    queryKey: ['admin', 'classes-list'],
    queryFn: async () => {
      const res = await lmsApi.get('/classes')
      return resultOf<ClassRoom[]>(res.data)
    },
  })

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        fullName: form.fullName.trim(),
        email: form.email.trim(),
        role: form.role,
      }
      if (form.role === 'STUDENT' && form.classRoomId)
        payload.classRoomId = Number(form.classRoomId)
      if (editing) {
        const res = await lmsApi.put(`/users/${editing.id}`, payload)
        return resultOf<User>(res.data)
      }
      payload.password = form.password
      const res = await lmsApi.post('/users', payload)
      return resultOf<User>(res.data)
    },
    onSuccess: () => {
      toast.success(editing ? 'Đã cập nhật người dùng' : 'Đã tạo người dùng')
      setDialogOpen(false)
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      await lmsApi.delete(`/users/${id}`)
    },
    onSuccess: () => {
      toast.success('Đã xóa người dùng')
      setConfirmDeleteId(null)
      invalidate()
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const changePwMutation = useMutation({
    mutationFn: async () => {
      if (!pwDialogUser) return
      await lmsApi.post(`/users/${pwDialogUser.id}/change-password`, {
        newPassword,
      })
    },
    onSuccess: () => {
      toast.success('Đã đặt lại mật khẩu')
      setPwDialogUser(null)
      setNewPassword('')
    },
    onError: (e) => toast.error(apiErrorMessage(e)),
  })

  const openCreate = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setFormErrors({})
    setDialogOpen(true)
  }

  const openEdit = (u: User) => {
    setEditing(u)
    setForm({
      fullName: u.fullName,
      email: u.email,
      password: '',
      role: u.role,
      classRoomId: u.classRoomId ? String(u.classRoomId) : '',
    })
    setFormErrors({})
    setDialogOpen(true)
  }

  const submitForm = () => {
    const errs: Record<string, string> = {}
    if (!form.fullName.trim()) errs.fullName = 'Vui lòng nhập họ tên'
    if (!form.email.trim()) errs.email = 'Vui lòng nhập email'
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim()))
      errs.email = 'Email không hợp lệ'
    if (!editing) {
      if (!form.password) errs.password = 'Vui lòng nhập mật khẩu'
      else if (form.password.length < 6)
        errs.password = 'Mật khẩu phải có ít nhất 6 ký tự'
    }
    setFormErrors(errs)
    if (Object.keys(errs).length > 0) return
    saveMutation.mutate()
  }

  const users = (usersQuery.data ?? []).filter((u) =>
    search.trim()
      ? `${u.fullName} ${u.email}`
          .toLowerCase()
          .includes(search.trim().toLowerCase())
      : true,
  )

  return (
    <div>
      <PageHeader
        title="Quản lý người dùng"
        description="Tạo, sửa và xóa tài khoản admin, giáo viên, học sinh."
        actions={
          <Button onClick={openCreate}>
            <Plus className="size-4" />
            Tạo người dùng
          </Button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative min-w-56 flex-1">
          <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm theo tên hoặc email..."
            className="pl-9"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Mọi vai trò</SelectItem>
            <SelectItem value="ADMIN">Quản trị viên</SelectItem>
            <SelectItem value="TEACHER">Giáo viên</SelectItem>
            <SelectItem value="STUDENT">Học sinh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {usersQuery.isPending && <ListSkeleton rows={5} />}
      {usersQuery.isError && (
        <ErrorBox
          message="Không tải được danh sách người dùng."
          onRetry={() => usersQuery.refetch()}
        />
      )}
      {usersQuery.isSuccess && users.length === 0 && (
        <EmptyState message="Chưa có người dùng nào phù hợp." />
      )}
      {users.length > 0 && (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Họ tên</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Vai trò</TableHead>
                <TableHead>Lớp</TableHead>
                <TableHead className="text-right">Thao tác</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((u) => (
                <TableRow key={u.id}>
                  <TableCell className="font-medium">{u.fullName}</TableCell>
                  <TableCell>{u.email}</TableCell>
                  <TableCell>
                    <Badge
                      variant={u.role === 'ADMIN' ? 'default' : 'secondary'}
                    >
                      {ROLE_LABEL[u.role]}
                    </Badge>
                  </TableCell>
                  <TableCell>{u.classRoomName ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Đặt lại mật khẩu"
                        onClick={() => {
                          setPwDialogUser(u)
                          setNewPassword('')
                        }}
                      >
                        <KeyRound className="size-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        title="Sửa"
                        onClick={() => openEdit(u)}
                      >
                        <Pencil className="size-4" />
                      </Button>
                      {confirmDeleteId === u.id ? (
                        <Button
                          variant="destructive"
                          size="sm"
                          disabled={deleteMutation.isPending}
                          onClick={() => deleteMutation.mutate(u.id)}
                        >
                          Chắc chắn xóa?
                        </Button>
                      ) : (
                        <Button
                          variant="ghost"
                          size="icon"
                          title="Xóa"
                          onClick={() => setConfirmDeleteId(u.id)}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Dialog tạo/sửa */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editing ? 'Sửa người dùng' : 'Tạo người dùng mới'}
            </DialogTitle>
            <DialogDescription>
              {editing
                ? 'Cập nhật thông tin tài khoản (không đổi mật khẩu ở đây).'
                : 'Tài khoản mới sẽ đăng nhập được ngay sau khi tạo.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Họ tên</Label>
              <Input
                id="fullName"
                value={form.fullName}
                onChange={(e) =>
                  setForm({ ...form, fullName: e.target.value })
                }
              />
              <FieldError message={formErrors.fullName} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
              <FieldError message={formErrors.email} />
            </div>
            {!editing && (
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                />
                <FieldError message={formErrors.password} />
              </div>
            )}
            <div className="space-y-2">
              <Label>Vai trò</Label>
              <Select
                value={form.role}
                onValueChange={(v) =>
                  setForm({ ...form, role: v as Role })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ADMIN">Quản trị viên</SelectItem>
                  <SelectItem value="TEACHER">Giáo viên</SelectItem>
                  <SelectItem value="STUDENT">Học sinh</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === 'STUDENT' && (
              <div className="space-y-2">
                <Label>Lớp học</Label>
                <Select
                  value={form.classRoomId || 'none'}
                  onValueChange={(v) =>
                    setForm({ ...form, classRoomId: v === 'none' ? '' : v })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Chưa xếp lớp" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Chưa xếp lớp</SelectItem>
                    {(classesQuery.data ?? []).map((c) => (
                      <SelectItem key={c.id} value={String(c.id)}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
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
              {editing ? 'Lưu thay đổi' : 'Tạo người dùng'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Dialog đặt lại mật khẩu */}
      <Dialog
        open={pwDialogUser !== null}
        onOpenChange={(open) => !open && setPwDialogUser(null)}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Đặt lại mật khẩu</DialogTitle>
            <DialogDescription>
              Đặt mật khẩu mới cho {pwDialogUser?.fullName} (
              {pwDialogUser?.email}).
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="newPassword">Mật khẩu mới</Label>
            <Input
              id="newPassword"
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            {newPassword.length > 0 && newPassword.length < 6 && (
              <FieldError message="Mật khẩu phải có ít nhất 6 ký tự" />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPwDialogUser(null)}>
              Hủy
            </Button>
            <Button
              onClick={() => changePwMutation.mutate()}
              disabled={newPassword.length < 6 || changePwMutation.isPending}
            >
              {changePwMutation.isPending && (
                <Loader2 className="size-4 animate-spin" />
              )}
              Đặt lại mật khẩu
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
