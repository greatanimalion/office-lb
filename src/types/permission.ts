export type Permission = 'read' | 'write' | 'admin'

export interface PermissionRule {
  userId: number
  documentId: number
  permission: Permission
}

export interface RolePermission {
  role: string
  permissions: string[]
}