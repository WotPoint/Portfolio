const BASE = '/api'

function getToken() {
  return localStorage.getItem('admin_token')
}

function authHeaders(): Record<string, string> {
  const token = getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...authHeaders(),
    ...(options.headers as Record<string, string> | undefined),
  }
  const res = await fetch(`${BASE}${url}`, { ...options, headers })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error || 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

// --- Public ---
export const getProjects = () => request<import('../types').Project[]>('/projects')
export const getConfig = () => request<import('../types').SiteConfig>('/config')

// --- Auth ---
export const login = (email: string, password: string) =>
  request<{ token: string }>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })

export const changePassword = (currentPassword: string, newPassword: string) =>
  request<{ ok: boolean }>('/auth/password', {
    method: 'PUT',
    body: JSON.stringify({ currentPassword, newPassword }),
  })

// --- Admin Projects ---
export const adminGetProjects = () =>
  request<import('../types').Project[]>('/projects/admin/all')

export const adminCreateProject = (data: Partial<import('../types').Project>) =>
  request<import('../types').Project>('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  })

export const adminUpdateProject = (
  id: string,
  data: Partial<import('../types').Project>
) =>
  request<import('../types').Project>(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

export const adminDeleteProject = (id: string) =>
  request<void>(`/projects/${id}`, { method: 'DELETE' })

export const adminReorderProjects = (orders: { id: string; order: number }[]) =>
  request<{ ok: boolean }>('/projects/admin/reorder', {
    method: 'POST',
    body: JSON.stringify({ orders }),
  })

// --- Admin Config ---
export const adminUpdateConfig = (data: Partial<import('../types').SiteConfig>) =>
  request<{ ok: boolean }>('/config', {
    method: 'PUT',
    body: JSON.stringify(data),
  })

// --- Upload ---
export async function uploadScreenshots(files: File[]): Promise<string[]> {
  const formData = new FormData()
  files.forEach((f) => formData.append('screenshots', f))
  const token = getToken()
  const res = await fetch(`${BASE}/upload`, {
    method: 'POST',
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: formData,
  })
  if (!res.ok) throw new Error('Upload failed')
  const { urls } = await res.json()
  return urls as string[]
}

export const deleteUpload = (filename: string) =>
  request<{ ok: boolean }>(`/upload/${filename}`, { method: 'DELETE' })
