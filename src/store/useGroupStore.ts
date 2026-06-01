import { create } from 'zustand'
import type { Group, GroupMember, GroupDocument } from '../types'
import { groupAPI } from '../services/api/group'

interface GroupState {
  groups: Group[]
  currentGroup: Group | null
  members: GroupMember[]
  documents: GroupDocument[]
  loading: boolean
  fetchGroups: () => Promise<void>
  fetchMembers: (groupId: number) => Promise<void>
  fetchDocuments: (groupId: number, params?: { page: number; pageSize: number }) => Promise<void>
  createGroup: (data: { name: string; description?: string }) => Promise<Group | null>
  deleteGroup: (id: number) => Promise<boolean>
}

const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  members: [],
  documents: [],
  loading: false,

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

  fetchDocuments: async (groupId: number, params = { page: 1, pageSize: 20 }) => {
    try {
      const response = await groupAPI.getDocuments(groupId, params)
      set({ documents: response.data })
    } catch {
      set({ documents: [] })
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
}))

export default useGroupStore