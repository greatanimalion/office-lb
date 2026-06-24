import type { OnlineUser } from '@/types/user'
import request from '../request'
import type { LoginData, RegisterData, LoginResponse, User } from '@/types'

export const authAPI = {
  login: (data: LoginData) => request.post<LoginResponse>('/api/auth/login', data),
  getSocialAccount: () => request.post<{
    success: boolean
    user: User
  }>('/api/auth/user/socialAccount').then(res => res.data),
  gitlabLogin: () => request.get<LoginResponse>('/api/oauth/gitlab', {}),
  dingtalkLogin: () => request.get<LoginResponse>('/api/oauth/dingtalk', {}),
  weixinLogin: () => request.get<LoginResponse>('/api/oauth/weixin', {}),
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
  getAllUser: () => request.get<{success:boolean,message:string,user:OnlineUser[]}>('/api/auth/user/all'),
  profile: () => request.get<User>('/api/auth/profile'),
  updateUser: (user: Partial<User>) => request.put<{success:boolean,message:string}>('/api/auth/user', user),
}