import type { User } from './user'
import type { MyDocument } from './file'

export interface Group {
  id: number
  name: string
  description?: string
  avatar?: string
  ownerId: number
  owner?: User
  memberCount: number
  documentCount: number
  createdAt: string
  updatedAt: string
}

export interface GroupMember {
  id: number
  username: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  joinedAt: string
}

export interface GroupDocument extends MyDocument {
  uploaderId: number
  uploaderName: string
}