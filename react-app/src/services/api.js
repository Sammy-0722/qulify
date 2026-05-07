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
    localStorage.setItem('adminToken', response.data.token) // your backend returns { success, token, email }
  }
  return response.data
}

export const adminLogout = () => {
  localStorage.removeItem('adminToken')
}

export const isAuthenticated = () => {
  return !!localStorage.getItem('adminToken')
}
export const registerAdmin = async (email, password) => {
  const response = await api.post('/auth/register', { email, password })
  return response.data
}

// ===== QUEUE =====
export const getQueue = async () => {
  const response = await api.get('/queue')
  return response.data  // returns { queue, currentServing, waiting, servedtoday }
}

export const joinQueue = async (name) => {
  const response = await api.post('/queue/join', { name })  // only name, no phone
  return response.data
}

export const callNext = async () => {
  const response = await api.post('/queue/next')  // no body needed
  return response.data
}

export const holdCurrent = async () => {
  const response = await api.post('/queue/hold')  // no body needed
  return response.data
}

export const skipCurrent = async () => {
  const response = await api.post('/queue/skip')  // no body needed
  return response.data
}

export const resetQueue = async () => {
  const response = await api.post('/queue/reset')  // no body needed
  return response.data
}

export const updateQueueStatus = async (isOpen) => {
  const response = await api.put('/queue/status', { isOpen })
  return response.data
}

export default api