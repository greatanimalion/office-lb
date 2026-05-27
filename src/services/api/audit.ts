import request from '../request'
import type { AuditLog } from '../../types'

export const auditAPI = {
  list: (params?: { page?: number; pageSize?: number; userId?: number }) =>
    request.get<{ list: AuditLog[]; total: number }>('/audit-logs', { params }),
}