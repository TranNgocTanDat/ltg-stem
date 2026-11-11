import axios, {
  type AxiosError,
  type InternalAxiosRequestConfig,
} from 'axios'

const baseURL =
  import.meta.env.VITE_LMS_API_URL || 'http://localhost:8080/api'

const ACCESS = 'lms.access-token'
const REFRESH = 'lms.refresh-token'

export const lmsApi = axios.create({ baseURL, timeout: 20000 })

/** Bóc lớp bọc { result: T } của backend. */
export const resultOf = <T,>(value: { result?: T } | T): T =>
  value && typeof value === 'object' && 'result' in value
    ? (value as { result: T }).result
    : (value as T)

/** Lấy thông báo lỗi tiếng Việt từ response backend. */
export const apiErrorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    const d = e.response?.data as
      | { message?: string; error?: string }
      | string
      | undefined
    return typeof d === 'string'
      ? d
      : d?.message ?? d?.error ?? e.message
  }
  return e instanceof Error ? e.message : 'Có lỗi xảy ra.'
}

export const saveTokens = (token: string, refresh: string) => {
  localStorage.setItem(ACCESS, token)
  localStorage.setItem(REFRESH, refresh)
}

export const clearTokens = () => {
  localStorage.removeItem(ACCESS)
  localStorage.removeItem(REFRESH)
}

export const hasAccessToken = () => !!localStorage.getItem(ACCESS)

lmsApi.interceptors.request.use((c: InternalAxiosRequestConfig) => {
  const t = localStorage.getItem(ACCESS)
  if (t) c.headers.Authorization = 'Bearer ' + t
  return c
})

let refreshing: Promise<string | null> | null = null

lmsApi.interceptors.response.use(
  (r) => r,
  async (e: AxiosError) => {
    const o = e.config as
      | (InternalAxiosRequestConfig & { retried?: boolean })
      | undefined
    if (
      e.response?.status !== 401 ||
      !o ||
      o.retried ||
      o.url?.includes('/auth/')
    )
      return Promise.reject(e)
    const refresh = localStorage.getItem(REFRESH)
    if (!refresh) {
      clearTokens()
      window.dispatchEvent(new Event('lms-logout'))
      return Promise.reject(e)
    }
    o.retried = true
    refreshing ??= axios
      .post(baseURL + '/auth/refresh', { refreshToken: refresh })
      .then((r) => {
        const a = resultOf<{ token: string; refreshToken: string }>(r.data)
        saveTokens(a.token, a.refreshToken)
        return a.token
      })
      .catch(() => {
        clearTokens()
        window.dispatchEvent(new Event('lms-logout'))
        return null
      })
      .finally(() => {
        refreshing = null
      })
    const token = await refreshing
    if (!token) return Promise.reject(e)
    o.headers.Authorization = 'Bearer ' + token
    return lmsApi(o)
  },
)

/** URL tải file PDF (slide/giáo án). Dùng kèm header Authorization khi fetch blob. */
export const fileUrl = (storedName: string) => `${baseURL}/files/${storedName}`

/**
 * Tải ảnh minh họa câu hỏi qua axios (kèm token đăng nhập) rồi trả về object URL.
 * Ảnh không dùng <img src> trực tiếp được vì /files yêu cầu Bearer token.
 */
export async function fetchImageBlobUrl(imagePath: string): Promise<string> {
  const res = await lmsApi.get(`/files/${imagePath}`, {
    responseType: 'blob',
  })
  return URL.createObjectURL(res.data as Blob)
}

/** Tải file qua axios (kèm token) rồi trả về object URL để xem/tải xuống. */
export async function fetchFileBlobUrl(storedName: string): Promise<string> {
  const res = await lmsApi.get(`/files/${storedName}`, {
    responseType: 'blob',
  })
  return URL.createObjectURL(res.data as Blob)
}
