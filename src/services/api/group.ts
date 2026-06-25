import request from '../request'
import type { Group, GroupMember } from '../../types'
import type { Folder, MyDocument } from '@/types/file';

export const groupAPI = {
  list: () =>
    request.get<Group[]>('/api/groups/all'),

  create: (data: { name: string; description?: string }) =>
    request.post<Group>('/api/groups', data),

  update: (id: number, data: { name?: string; description?: string }) =>
    request.put(`/api/groups/${id}`, data),

  delete: (id: number) =>
    request.delete(`/api/groups/${id}`),

  getMembers: (groupId: number) =>
    request.get<GroupMember[]>(`/api/groups/${groupId}/members`),

  addMember: (groupId: number, userId: number, role: 'admin' | 'member' = 'member') =>
    request.post(`/api/groups/${groupId}/members`, { userId, role }),

  removeMember: (groupId: number, userId: number) =>
    request.delete(`/api/groups/${groupId}/members/${userId}`),

  getDocuments: (groupId: number, params?: { page: number; pageSize: number }) =>
    request.get<MyDocument[]>(`/api/groups/${groupId}/documents`, { params }),

  deleteDocument: (groupId: number, documentId: number) =>
    request.delete(`/api/groups/${groupId}/documents/${documentId}`),
  /**
   * 必须存在一个真
  */
  getFolders:async (groupId?: number,parentFolderId?: number) =>{
    return (await request.get<{success:boolean,data:Folder[]}>(`/api/folders`, { params: { groupId, parentFolderId } })).data
  },

  createFolder: (groupId: number,permission: number,filename: string,parentFolderId?: number) =>
    request.post<Folder>(`/api/folders`, { permission, groupId,filename,parentFolderId }),

  updateFolder: (folderId: number, data: { filename: string; permission: number }) =>
    request.put<{success:boolean,message?:string}>(`/api/folders/${folderId}`, data),

  shareDocumentToGroup: (groupId: number, documentId: number) =>
    request.post(`/api/groups/${groupId}/documents`, { documentId }),
}