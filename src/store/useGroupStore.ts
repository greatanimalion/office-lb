import { create } from 'zustand'
import type { Group, GroupMember } from '../types'
import { groupAPI } from '../services/api/group'
import type { Folder } from '@/types/file'
import { fileAPI } from '@/services/api/file'
import type { MyDocument } from '@/types/file'

interface GroupState {
  groups: Group[]
  currentGroup: Group | null
  members: GroupMember[]
  documents: MyDocument[]
  loading: boolean
  folders: Folder[]
  pathFolder: Folder[]
  getFolders: () => Promise<void>
  fetchGroups: () => Promise<void>
  fetchMembers: (groupId: number) => Promise<void>
  createGroup: (data: { name: string; description?: string }) => Promise<Group | null>
  deleteGroup: (id: number) => Promise<boolean>
  getDocuments: () => Promise<void>
  pushPath: (folder: Folder) => void
  popPath: () => void
  clearPathFolder:()=>void
  setCurrentGroup: (group: Group | null) => void
}

const useGroupStore = create<GroupState>((set, get) => ({
  groups: [],
  currentGroup: null,
  pathFolder: [],
  members: [],
  documents: [],
  folders: [],
  loading: false,
  currentFolder: null,
  clearPathFolder:()=>{
    set({pathFolder:[]})
  },
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
  getFolders: async () => {
    try {
      const groupId = get().currentGroup.id
      const pathfolder=get().pathFolder
      const parentFolderId = pathfolder[pathfolder.length-1]?.id||undefined
      const response = await groupAPI.getFolders(groupId, parentFolderId)
      set({ folders: response.data })
    } catch(error) {
      set({ folders: [] })
    }
  },
  pushPath: (folder: Folder) => {
    set({ pathFolder: [...get().pathFolder, folder] })
    get().getDocuments()
    get().getFolders()
  },
  popPath: () => {
    set({ pathFolder: get().pathFolder.slice(0, -1) })
    get().getDocuments()
    get().getFolders()
  },
  getDocuments: async () => {
    try {
      const pathFolder=get().pathFolder
      const owner_type =pathFolder.length==0?'group':'folder'
      const owner_id = pathFolder.length==0 ? get().currentGroup.id : pathFolder[pathFolder.length-1].id
      const response = await fileAPI.list({ page: 1, pageSize: 100, owner_id, owner_type })
      set({ documents: response.data.data || [] })
    } catch {
      set({ documents: [] })
    }
  },
  setCurrentGroup: (group: Group | null) => {
    set({ currentGroup: group })
  }
}))

export default useGroupStore