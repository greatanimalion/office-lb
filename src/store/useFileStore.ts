import { create } from 'zustand'
import type { MyDocument } from '../types'
import { fileAPI } from '../services/api/file'

interface FileState {
  ODocuments: MyDocument[]
  currentDocument: MyDocument | null
  loading: boolean
  fetchODocuments: (params?: { page: number; pageSize: number }) => Promise<void>
  setCurrentDocument: (doc: MyDocument | null) => void
  createDocument: (data: FormData) => Promise<{ id: number; title: string } | null>
  updateDocument: (id: number, title: string) => Promise<boolean>
  deleteDocument: (id: number) => Promise<boolean>
}

const useFileStore = create<FileState>((set, get) => ({
  ODocuments: [],
  currentDocument: null,
  loading: false,

  fetchODocuments: async (params: { page: number; pageSize: number }={page:1,pageSize:10}) => {
    set({ loading: true })
    try {
      const response = await fileAPI.list(params)
      set({ ODocuments: response.data })
    } finally {
      set({ loading: false })
    }
  },

  setCurrentDocument: (doc) => {
    set({ currentDocument: doc })
  },

  createDocument: async (data: FormData) => {
    try {
      const response = await fileAPI.create(data)
      await get().fetchODocuments()
      return response.data
    } catch {
      return null
    }
  },

  updateDocument: async (id: number, title: string) => {
    try {
      await fileAPI.update(id, { title })
      await get().fetchODocuments()
      return true
    } catch {
      return false
    }
  },

  deleteDocument: async (id: number) => {
    try {
      await fileAPI.delete(id)
      await get().fetchODocuments()
      return true
    } catch {
      return false
    }
  },
}))

export default useFileStore