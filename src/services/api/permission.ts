import request from '../request'
import type { PermissionRule } from '../../types'

export const permissionAPI = {
  list: (documentId: number) =>
    request.get<PermissionRule[]>(`/documents/${documentId}/permissions`),

  set: (documentId: number, data: PermissionRule) =>
    request.post(`/documents/${documentId}/permissions`, data),

  remove: (documentId: number, userId: number) =>
    request.delete(`/documents/${documentId}/permissions/${userId}`),
}