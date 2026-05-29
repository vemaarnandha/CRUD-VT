// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'

export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE_URL}/login`,
    register: `${API_BASE_URL}/register`,
    logout: `${API_BASE_URL}/logout`,
  },
  users: {
    list: `${API_BASE_URL}/api/users`,
    create: `${API_BASE_URL}/api/users`,
  },
}

// Helper function untuk fetch dengan token
export async function apiCall(
  url: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('token')
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  const response = await fetch(url, {
    ...options,
    headers,
  })

  if (!response.ok && response.status === 401) {
    // Token expired, clear localStorage
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    // Redirect to login
    window.location.href = '/'
  }

  return response
}
