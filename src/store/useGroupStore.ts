import { create } from 'zustand'
import type { Group, GroupMember, GroupDocument } from '../types'
import { groupAPI } from '../services/api/group'
import type { Folder } from '@/types/file'

interface GroupState {
  groups: Group[]
  currentGroup: Group | null
  members: GroupMember[]
  documents: GroupDocument[]
  loading: boolean
  folders: Folder[]
  currentFolder: Folder | null
  getFolders: (groupId?: number, parentFolderId?: number) => Promise<void>
  fetchGroups: () => Promise<void>
  fetchMembers: (groupId: number) => Promise<void>
  createGroup: (data: { name: string; description?: string }) => Promise<Group | null>
  deleteGroup: (id: number) => Promise<boolean>
}

const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  members: [],
  documents: [],
  folders: [],
  loading: false,
  currentFolder: null,

  fetchGroups: async () => {
    set({ loading: true })
    try {
      const response = await groupAPI.list()
      set({ groups: response.data })
    } finally {
      set({ loading: false })
    }
  },

  fetchMembers: async (groupId: number) => {
    try {
      const response = await groupAPI.getMembers(groupId)
      set({ members: response.data })
    } catch {
      set({ members: [] })
    }
  },

  createGroup: async (data: { name: string; description?: string }) => {
    try {
      const response = await groupAPI.create(data)
      await get().fetchGroups()
      return response.data
    } catch {
      return null
    }
  },
  deleteGroup: async (id: number) => {
    try {
      await groupAPI.delete(id)
      await get().fetchGroups()
      return true
    } catch {
      return false
    }
  },
  getFolders: async (groupId?: number, parentFolderId?: number) => {
    try {
      const response = await groupAPI.getFolders(groupId, parentFolderId)
      set({ folders: response.data })
    } catch {
      set({ folders: [] })
    }
  }
}))

export default useGroupStore