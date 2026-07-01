import type { User } from './user'

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
  userId: number
  username: string
  email: string
  avatar?: string
  role: 'owner' | 'admin' | 'member'
  createdAt: string
}
