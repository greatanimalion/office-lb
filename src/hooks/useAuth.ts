import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/useUserStore'
import { toBase64 } from '@/utils'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, register, logout } = useUserStore()

  const handleLogin = useCallback(async (email: string, password: string) => {
    await login({ email, password: toBase64(password) })
    navigate('/', { replace: true })
  }, [login, navigate])

  const handleRegister = useCallback(async (username: string, email: string, password: string, code: string) => {
    const res = await register({ username, email, password: toBase64(password), code })
    return res
  }, [register])


  const handleLogout = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  return {
    user,
    isAuthenticated,
    handleLogin,
    handleRegister,
    handleLogout,
  }
}