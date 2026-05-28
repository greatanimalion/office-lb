export interface MyDocument {
  id: number
  title: string
  filename: string
  filePath: string
  fileType: string
  fileSize?: number
  createdAt: string
  updatedAt: string
  userId: number
  username?: string
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