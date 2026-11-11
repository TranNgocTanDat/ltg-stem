import { useEffect, useState } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import {
  BookOpen,
  Bot,
  ClipboardList,
  FileText,
  GraduationCap,
  HelpCircle,
  Home,
  LayoutDashboard,
  LogOut,
  Menu,
  School,
  Users,
  X,
} from 'lucide-react'
import { useAuth } from '@/lib/auth'
import { ROLE_LABEL } from '@/lib/lms-types'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

interface NavItem {
  to: string
  label: string
  icon: React.ComponentType<{ className?: string }>
  end?: boolean
}

const COMMON_NAV: NavItem[] = [
  { to: '/lms/dashboard', label: 'Bảng điều khiển', icon: LayoutDashboard, end: true },
  { to: '/lms/lessons', label: 'Bài giảng', icon: BookOpen },
  { to: '/lms/quizzes', label: 'Bài tập', icon: ClipboardList },
]

const ADMIN_NAV: NavItem[] = [
  { to: '/lms/admin/users', label: 'Người dùng', icon: Users },
  { to: '/lms/admin/classes', label: 'Lớp học', icon: School },
  { to: '/lms/admin/questions', label: 'Ngân hàng câu hỏi', icon: HelpCircle },
  { to: '/lms/admin/quizzes', label: 'Quản lý bài tập', icon: FileText },
]

const TEACHER_NAV: NavItem[] = [
  { to: '/lms/teacher/classes', label: 'Lớp của tôi', icon: School },
]

const TITLE_BY_PATH: [RegExp, string][] = [
  [/^\/lms\/dashboard$/, 'Bảng điều khiển'],
  [/^\/lms\/lessons\/\d+$/, 'Chi tiết bài giảng'],
  [/^\/lms\/lessons$/, 'Bài giảng'],
  [/^\/lms\/quizzes\/\d+$/, 'Làm bài tập'],
  [/^\/lms\/quizzes$/, 'Bài tập'],
  [/^\/lms\/admin\/users$/, 'Quản lý người dùng'],
  [/^\/lms\/admin\/classes$/, 'Quản lý lớp học'],
  [/^\/lms\/admin\/questions$/, 'Ngân hàng câu hỏi'],
  [/^\/lms\/admin\/quizzes$/, 'Quản lý bài tập'],
  [/^\/lms\/teacher\/classes\/\d+$/, 'Lớp học của tôi'],
  [/^\/lms\/teacher\/classes$/, 'Lớp của tôi'],
]

function titleFor(pathname: string): string {
  for (const [re, title] of TITLE_BY_PATH) {
    if (re.test(pathname)) return title
  }
  return 'LTG LMS'
}

function initials(name: string): string {
  const parts = name.trim().split(/\s+/)
  const first = parts[0]?.[0] ?? ''
  const last = parts.length > 1 ? parts[parts.length - 1][0] : ''
  return (first + last).toUpperCase() || 'U'
}

export default function LmsLayout() {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // LMS luôn dùng dark theme (phong cách Antigravity)
  useEffect(() => {
    document.documentElement.classList.add('dark')
    return () => {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  if (!user) return null

  const nav: NavItem[] = [
    ...COMMON_NAV,
    ...(user.role === 'ADMIN' ? ADMIN_NAV : []),
    ...(user.role === 'TEACHER' ? TEACHER_NAV : []),
  ]

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <button
        type="button"
        onClick={() => navigate('/lms/dashboard')}
        className="flex items-center gap-2.5 px-4 pt-5 pb-4 text-left"
      >
        <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
          <GraduationCap className="size-5" />
        </span>
        <span className="min-w-0">
          <span className="block truncate text-base font-bold tracking-tight">
            LTG LMS
          </span>
          <span className="block text-xs text-muted-foreground">
            Học lập trình STEM
          </span>
        </span>
      </button>

      <nav className="flex-1 space-y-1 overflow-y-auto px-3">
        {nav.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            onClick={() => setSidebarOpen(false)}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-accent text-accent-foreground'
                  : 'text-muted-foreground hover:bg-accent/60 hover:text-foreground',
              )
            }
          >
            <item.icon className="size-4 shrink-0" />
            {item.label}
          </NavLink>
        ))}

        <Separator className="my-3" />

        <NavLink
          to="/editor-blockly"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Bot className="size-4 shrink-0" />
          Lập trình Robot
        </NavLink>
        <NavLink
          to="/"
          className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent/60 hover:text-foreground"
        >
          <Home className="size-4 shrink-0" />
          Trang chủ
        </NavLink>
      </nav>

      <div className="border-t p-3">
        <div className="flex items-center gap-3 rounded-md px-2 py-1.5">
          <Avatar>
            <AvatarFallback>{initials(user.fullName)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{user.fullName}</p>
            <Badge variant="secondary" className="mt-0.5">
              {ROLE_LABEL[user.role]}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="icon"
            title="Đăng xuất"
            onClick={logout}
          >
            <LogOut className="size-4" />
          </Button>
        </div>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar desktop */}
      <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r bg-sidebar md:block">
        {sidebarContent}
      </aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setSidebarOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-72 bg-sidebar shadow-xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-3 right-3"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="size-4" />
            </Button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b bg-background/95 px-4 backdrop-blur">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="size-5" />
          </Button>
          <h1 className="text-base font-semibold">
            {titleFor(location.pathname)}
          </h1>
        </header>

        <main className="mx-auto w-full max-w-6xl flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
