import request from '../request'
import type { LoginData, RegisterData, LoginResponse, User } from '../../types'

export const authAPI = {
  login: (data: LoginData) =>request.post<LoginResponse>('/api/auth/login', data),

  register: (data: RegisterData) =>request.post<User>('/auth/register', data),

  profile: () =>request.get<User>('/auth/profile'),
}