import { create } from 'zustand'
import type { MyDocument } from '../types'
import { fileAPI } from '../services/api/file'

interface FileState {
  myDocuments: MyDocument[]
  currentDocument: MyDocument | null
  loading: boolean
  fetchMyDocuments: (params?: { folder?: string; search?: string }) => Promise<void>
  setCurrentDocument: (doc: MyDocument | null) => void
  createDocument: (data: FormData) => Promise<{ id: number; title: string } | null>
  updateDocument: (id: number, title: string) => Promise<boolean>
  deleteDocument: (id: number) => Promise<boolean>
}

const useFileStore = create<FileState>((set, get) => ({
  myDocuments: [],
  currentDocument: null,
  loading: false,

  fetchMyDocuments: async (params) => {
    set({ loading: true })
    try {
      const response = await fileAPI.list(params)
      set({ myDocuments: response.data })
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
      await get().fetchMyDocuments()
      return response.data
    } catch {
      return null
    }
  },

  updateDocument: async (id: number, title: string) => {
    try {
      await fileAPI.update(id, { title })
      await get().fetchMyDocuments()
      return true
    } catch {
      return false
    }
  },

  deleteDocument: async (id: number) => {
    try {
      await fileAPI.delete(id)
      await get().fetchMyDocuments()
      return true
    } catch {
      return false
    }
  },
}))

export default useFileStore