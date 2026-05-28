import type { AxiosProgressEvent } from 'axios'
import request from '../request'
import type { MyDocument } from '../../types'

export const fileAPI = {
  list: (params?: { folder?: string; search?: string }) =>
    request.get<MyDocument[]>('/documents', { params }),

  get: (id: number) =>
    request.get<MyDocument>(`/documents/${id}`),

  create: (data: FormData) =>
    request.post<{ id: number; title: string }>('/documents', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),

  update: (id: number, data: { title: string }) =>
    request.put(`/documents/${id}`, data),

  delete: (id: number) =>
    request.delete(`/documents/${id}`),

  upload: (data: FormData, onProgress?: (percent: number) => void) =>
    request.post('/documents/upload', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress: (e: AxiosProgressEvent) => {
        if (onProgress && e.total) {
          onProgress(Math.round((e.loaded * 100) / e.total))
        }
      },
    }),
}