import request from '../request'
import type { LoginData, RegisterData, LoginResponse, User } from '@/types'

export const authAPI = {
  login: (data: LoginData) => request.post<LoginResponse>('/api/auth/login', data),
  changeGroup: (groupId:number) => request.post<{
    success: boolean
    message: string
  }>('/api/auth/user/change-group', {groupId}),
  register: (data: RegisterData) => request.post<{
    success: boolean
    message: string
  }>('/api/auth/register', data),
  sendEmail: (email: string) => request.post<{
    message:string
    success:boolean
  }>('/api/auth/sendcode', { email }),
  getAllUser: () => request.get<{success:boolean,message:string,user:User[]}>('/api/auth/user/all'),
  profile: () => request.get<User>('/api/auth/profile'),
}