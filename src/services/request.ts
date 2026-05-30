import { message } from 'antd'
import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios'

const request: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  timeout: 30000,
})

request.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `${token}`
  }
  return config
})

function getErrorMessage(code:number){
  switch(code){
    case 401:return "暂无权限";
    case 502:return "网络错误";
    default:"未知错误:"+code;
  }
}
request.interceptors.response.use(
  (response) => response,
  (error: { response?: { status: number },status:number }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    message.error(getErrorMessage(error.status))
    return error
  },
)

export default request