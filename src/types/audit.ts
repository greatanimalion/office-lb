export interface AuditLog {
  id: number
  userId: number
  username: string
  action: string
  targetType: string
  targetId: number
  targetName: string
  detail: string
  ip: string
  createdAt: string
}