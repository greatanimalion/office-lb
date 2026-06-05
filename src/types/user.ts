export interface User {
  id: number
  username: string
  email: string
  avatar?: string
  group_id?: number
  role?: 'admin' | 'user'
  createdAt?: string
}

export interface LoginData {
  email: string
  password: string
}

export interface RegisterData {
  username: string
  email: string
  password: string
  code: string
}

export interface LoginResponse {
  token: string
  message: string
  user: {
    id: number
    username: string
    role: string
  }
}