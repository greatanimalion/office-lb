import type { Permission } from '../types'

export function checkPermission(
  userRole: string | undefined,
  ownerId: number,
  currentUserId: number | undefined,
  requiredPermission?: Permission,
): boolean {
  if (!currentUserId) return false
  if (userRole === 'admin') return true
  if (ownerId === currentUserId) return true
  if (requiredPermission === 'read') return true
  return false
}

export function isAdmin(role?: string): boolean {
  return role === 'admin'
}

export function canEdit(
  userRole: string | undefined,
  ownerId: number,
  currentUserId: number | undefined,
): boolean {
  return checkPermission(userRole, ownerId, currentUserId, 'write')
}

export function canDelete(
  userRole: string | undefined,
  ownerId: number,
  currentUserId: number | undefined,
): boolean {
  return userRole === 'admin' || ownerId === currentUserId
}