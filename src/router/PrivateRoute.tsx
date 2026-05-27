import { Navigate, Outlet } from 'react-router-dom'
import useUserStore from '../store/useUserStore'

function PrivateRoute() {
  const { isAuthenticated } = useUserStore()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}

export default PrivateRoute