import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { AuthProvider } from '@/lib/auth'
import { queryClient } from '@/lib/query-client'

/**
 * Gốc của khu vực LMS: chỉ bọc QueryClientProvider + AuthProvider quanh
 * các route /lms/*, không chạm tới trang chủ và trang Blockly.
 */
export default function LmsRoot() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    </QueryClientProvider>
  )
}
