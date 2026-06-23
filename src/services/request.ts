import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
})
const clearToken = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

request.interceptors.response.use(
  (response) => response,
  (error: { response?: { status: number },status:number }) => {
    if (error.response?.status=== 403) {
      clearToken()
      window.location.href = '/login'
    }
    return error
  },
)

export default request