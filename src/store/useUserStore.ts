import { create } from 'zustand'
import type { User, LoginData, RegisterData } from '../types'
import { authAPI } from '../services/api/auth'
import { message } from 'antd'

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<boolean>
  register: (data: RegisterData) => Promise<{success: boolean, message: string}>
  logout: () => void
  changeGroup: (groupId:number) => Promise<void>
  fetchProfile: () => Promise<void>
  setUser: (user: User) => void
  otherLogin: () => Promise<boolean>
}

const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),
  changeGroup: async (groupId:number) => {
    const res=await authAPI.changeGroup(groupId)
    if(res.data.success){
      message.success(res.data.message)
      set((state) => ({ user: { ...state.user!, group_id:groupId } as any }))
      localStorage.setItem('user', JSON.stringify({...JSON.parse(localStorage.getItem('user') || 'null'), group_id:groupId}))
    }else{
      message.error(res.data.message)
    }
  },

  login: async (data: LoginData): Promise<boolean> => {
    const response = await authAPI.login(data)
    const { token, user } = response.data||{}
    if(!token || !user){ 
      message.error(response.data.message)
      return false
    }
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user: user as any, isAuthenticated: true })
    return true
  },
  otherLogin: async () => {
    const res=await authAPI.getSocialAccount()
    if(res.provider){
      const token=localStorage.getItem('token') || ''
      set({ token, user: {
        id: res.id,
        username: JSON.parse(res.profileData).username,
        email: res.email,
        provider: res.provider,
        provider_id: res.provider_id,
        avatar: res.avatar,
      }, isAuthenticated: true })
      return true
    }
      return false
  },
  register: async (data: RegisterData) => {
    const res=await authAPI.register(data)
    return res.data||{success: false, message: '未知错误'}
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    set({ user: null, token: null, isAuthenticated: false })
  },

  fetchProfile: async () => {
    try {
      const response = await authAPI.profile()
      set({ user: response.data })
    } catch {
      set({ user: null, token: null, isAuthenticated: false })
    }
  },

  setUser: (user: User) => {
    localStorage.setItem('user', JSON.stringify(user))
    set({ user })
  },
}))

export default useUserStore