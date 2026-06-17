import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import useUserStore from '@/store/useUserStore'
import { toBase64 } from '@/utils'

export function useAuth() {
  const navigate = useNavigate()
  const { user, isAuthenticated, login, register, logout, changeGroup,otherLogin } = useUserStore()

  const handleLogin = useCallback(async (email: string, password: string,type?:1|2|3) => {
      const hasLogin = await login({ email, password: toBase64(password),type })
      if(hasLogin){
        navigate('/', { replace: true })
      }
  }, [login, navigate])

  const handleOtherLogin = useCallback(async () => {
    const hasLogin = await otherLogin()
     if(hasLogin){
        navigate('/', { replace: true })
      }
  }, [otherLogin])
  
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
    handleOtherLogin,
  }
}