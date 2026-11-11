import { useEffect, useState, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { GraduationCap, Info, Loader2 } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { FieldError } from '@/components/lms/common'

const DEMO_ACCOUNTS = [
  { email: 'admin@ltg.edu.vn', password: 'Admin@123', role: 'Quản trị viên' },
  { email: 'gv@ltg.edu.vn', password: 'Gv@123', role: 'Giáo viên' },
  { email: 'hs@ltg.edu.vn', password: 'Hs@123', role: 'Học sinh' },
]

export default function LoginPage() {
  const { user, loading, login } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [fieldErrors, setFieldErrors] = useState<{
    email?: string
    password?: string
  }>({})
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  if (!loading && user) return <Navigate to="/lms/dashboard" replace />

  const fillDemo = (demoEmail: string, demoPassword: string) => {
    setEmail(demoEmail)
    setPassword(demoPassword)
    setError('')
  }

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const errs: typeof fieldErrors = {}
    if (!email.trim()) errs.email = 'Vui lòng nhập email'
    else if (!/^\S+@\S+\.\S+$/.test(email.trim()))
      errs.email = 'Email không hợp lệ'
    if (!password) errs.password = 'Vui lòng nhập mật khẩu'
    setFieldErrors(errs)
    if (Object.keys(errs).length > 0) return

    setSubmitting(true)
    setError('')
    try {
      await login(email.trim(), password)
      navigate('/lms/dashboard', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="dark flex min-h-screen items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-4">
        <div className="flex flex-col items-center gap-2 text-center">
          <span className="flex size-12 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-7" />
          </span>
          <h1 className="text-2xl font-bold tracking-tight">LTG LMS</h1>
          <p className="text-sm text-muted-foreground">
            Đăng nhập để học bài giảng và làm bài tập
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Đăng nhập</CardTitle>
            <CardDescription>
              Dùng tài khoản do quản trị viên cấp cho bạn.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="ban@ltg.edu.vn"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <FieldError message={fieldErrors.email} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Mật khẩu</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <FieldError message={fieldErrors.password} />
              </div>
              {error && (
                <p className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {error}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting && <Loader2 className="size-4 animate-spin" />}
                Đăng nhập
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-dashed">
          <CardContent className="space-y-2 pt-4 text-sm">
            <p className="flex items-center gap-2 font-medium">
              <Info className="size-4 text-muted-foreground" />
              Tài khoản demo — đổi mật khẩu khi chạy thật
            </p>
            {DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => fillDemo(acc.email, acc.password)}
                className="flex w-full items-center justify-between rounded-md px-2 py-1.5 text-left hover:bg-accent"
              >
                <span className="font-mono text-xs">{acc.email}</span>
                <span className="text-xs text-muted-foreground">{acc.role}</span>
              </button>
            ))}
            <p className="px-2 text-xs text-muted-foreground">
              Bấm vào một tài khoản để điền nhanh.
            </p>
          </CardContent>
        </Card>

        <p className="text-center text-sm text-muted-foreground">
          <Link to="/" className="underline underline-offset-4 hover:text-foreground">
            ← Về trang chủ
          </Link>
        </p>
      </div>
    </div>
  )
}
