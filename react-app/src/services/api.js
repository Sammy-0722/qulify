import axios from 'axios'

const API_URL = 'https://qulify-backend.onrender.com/api'

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('adminToken')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ===== AUTH =====
export const adminLogin = async (email, password) => {
  const response = await api.post('/auth/login', { email, password })
  if (response.data.token) {
    localStorage.setItem('adminToken', response.data.token)
    localStorage.setItem('adminId', response.data.adminId)
  }
  return response.data
}

export const adminLogout = () => {
  localStorage.removeItem('adminToken')
  localStorage.removeItem('adminId')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken')
}

export const registerAdmin = async (email, password) => {
  const response = await api.post('/auth/register', { email, password })
  return response.data
}

// ===== QUEUE =====
export const getQueue = async (adminId) => {
  const id = adminId || localStorage.getItem('adminId')
  const response = await api.get(`/queue/${id}`)
  return response.data
}

export const getQueueStatus = async (adminId) => {
  const response = await api.get(`/queue/status/${adminId}`)
  return response.data
}

export const joinQueue = async (name, note, adminId) => {
  const response = await api.post(`/queue/join/${adminId}`, { name, note })
  return response.data
}

export const callNext = async () => {
  const adminId = localStorage.getItem('adminId')
  const response = await api.put(`/queue/next/${adminId}`)
  return response.data
}

export const holdCurrent = async () => {
  const adminId = localStorage.getItem('adminId')
  const response = await api.put(`/queue/hold/${adminId}`)
  return response.data
}

export const skipCurrent = async () => {
  const adminId = localStorage.getItem('adminId')
  const response = await api.put(`/queue/skip/${adminId}`)
  return response.data
}

export const resetQueue = async () => {
  const adminId = localStorage.getItem('adminId')
  const response = await api.delete(`/queue/reset/${adminId}`)
  return response.data
}

export const updateQueueStatus = async (isOpen) => {
  const adminId = localStorage.getItem('adminId')
  const response = await api.put(`/queue/status/${adminId}`, { isOpen })
  return response.data
}
export const resumeCurrent = async () => {
  const adminId = localStorage.getItem('adminId')
  const response = await api.put(`/queue/resume/${adminId}`)
  return response.data
}

export default api