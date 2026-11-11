import { Navigate } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'
import { useAuth } from '@/lib/auth'
import type { Role } from '@/lib/lms-types'
import { Skeleton } from '@/components/ui/skeleton'

export function ProtectedRoute({
  children,
  allowedRoles,
}: {
  children: React.ReactNode
  allowedRoles?: Role[]
}) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6">
        <div className="w-full max-w-md space-y-3">
          <Skeleton className="h-10 w-2/3" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/lms/login" replace />

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-3 p-6 text-center">
        <ShieldAlert className="size-10 text-destructive" />
        <h2 className="text-lg font-semibold">Không có quyền truy cập</h2>
        <p className="text-sm text-muted-foreground">
          Trang này chỉ dành cho vai trò: {allowedRoles.join(', ')}.
        </p>
      </div>
    )
  }

  return <>{children}</>
}
