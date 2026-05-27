import request from '../request'
import type { ShareData, Document } from '../../types'

export const shareAPI = {
  share: (id: number, data: ShareData) =>
    request.post(`/documents/${id}/share`, data),

  unshare: (id: number, userId: number) =>
    request.delete(`/documents/${id}/share/${userId}`),

  sharedList: () =>
    request.get<Document[]>('/documents/shared'),

  getSharedByToken: (token: string) =>
    request.get<Document & { permission: string }>(`/share/${token}`),
}