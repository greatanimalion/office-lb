export type OwnerType = 'group'|'user'|'folder'|'public'

export interface MyDocument  {
  id: number
  title: string
  filename: string
  filepath: string
  owner_id: number
  owner_type: OwnerType
  fileSize: number
  version_number: number
  permission: number
  status: string
  locked: 0 | 1
  locked_by?: number
  created_at: string
  updated_at: string
}

export interface ShareData {
  userId: number
  permission: 'read' | 'write'
}

export interface UploadProgress {
  percent: number
  loaded: number
  total: number
}
export interface Folder {
  id: number
  filename: string
  parentFolderId?: number
  permission: number
  groupId: number
  createdAt: Date
  updatedAt: Date
}
export interface DocumentVersion {
  id: number
  filename: string
  document_id: number
  version_number: number
  filesize: number
  filepath: string
  created_by: number
  created_at: Date
  alter_by_username?: string
}