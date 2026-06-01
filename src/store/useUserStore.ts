import { create } from 'zustand'
import type { User, LoginData, RegisterData } from '../types'
import { authAPI } from '../services/api/auth'

interface UserState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  login: (data: LoginData) => Promise<void>
  register: (data: RegisterData) => Promise<{success: boolean, message: string}>
  logout: () => void
  fetchProfile: () => Promise<void>
  setUser: (user: User) => void
}

const useUserStore = create<UserState>((set) => ({
  user: JSON.parse(localStorage.getItem('user') || 'null'),
  token: localStorage.getItem('token') || null,
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (data: LoginData) => {
    const response = await authAPI.login(data)
    const { token='1', user='1' } = response.data||{}
    localStorage.setItem('token', token)
    localStorage.setItem('user', JSON.stringify(user))
    set({ token, user: user as User, isAuthenticated: true })
  },

  register: async (data: RegisterData) => {
    const res=await authAPI.register(data)
    console.log(res)
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