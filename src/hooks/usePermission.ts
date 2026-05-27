import useUserStore from '../store/useUserStore'
import type { Permission } from '../types'

export function usePermission() {
  const { user } = useUserStore()

  const hasPermission = (documentOwnerId: number, requiredPermission?: Permission) => {
    if (!user) return false
    if (user.role === 'admin') return true
    if (requiredPermission === 'read') return true
    if (documentOwnerId === user.id) return true
    return false
  }

  const isAdmin = user?.role === 'admin'

  const canEdit = (documentOwnerId: number) => {
    return hasPermission(documentOwnerId, 'write')
  }

  const canDelete = (documentOwnerId: number) => {
    return user?.role === 'admin' || documentOwnerId === user?.id
  }

  return { hasPermission, isAdmin, canEdit, canDelete }
}