import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/useUserStore'
import { toBase64 } from '@/utils'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, register, logout, changeGroup } = useUserStore()

  const handleLogin = useCallback(async (email: string, password: string) => {
      const hasLogin = await login({ email, password: toBase64(password) })
      if(hasLogin){
        navigate('/', { replace: true })
      }
  }, [login, navigate])

  const handleRegister = useCallback(async (username: string, email: string, password: string, code: string) => {
    const res = await register({ username, email, password: toBase64(password), code })
    return res
  }, [register])

  const handleChangeGroup = useCallback(async (groupId: number) => {
    await changeGroup(groupId)
  }, [changeGroup])



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
    handleChangeGroup,
  }
}