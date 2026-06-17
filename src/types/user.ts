export interface User {
  id: number
  username: string
  email: string
  provider?: string
  provider_id?: string
  avatar?: string
  group_id?: number
  role?: 'admin' | 'user'
  createdAt?: string
}

export interface LoginData {
  email: string
  password: string
  type?:1|2|3
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