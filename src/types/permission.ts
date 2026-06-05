export interface PermissionRule {
  userId: number
  permissions: string[]
  expiresAt?: string
}

export interface RolePermission {
  role: string
  permissions: string[]
}