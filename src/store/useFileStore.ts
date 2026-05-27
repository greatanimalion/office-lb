import { create } from 'zustand'
import type { Document } from '../types'
import { fileAPI } from '../services/api/file'

interface FileState {
  documents: Document[]
  currentDocument: Document | null
  loading: boolean
  fetchDocuments: (params?: { folder?: string; search?: string }) => Promise<void>
  setCurrentDocument: (doc: Document | null) => void
  createDocument: (data: FormData) => Promise<{ id: number; title: string } | null>
  updateDocument: (id: number, title: string) => Promise<boolean>
  deleteDocument: (id: number) => Promise<boolean>
}

const useFileStore = create<FileState>((set, get) => ({
  documents: [],
  currentDocument: null,
  loading: false,

  fetchDocuments: async (params) => {
    set({ loading: true })
    try {
      const response = await fileAPI.list(params)
      set({ documents: response.data })
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
      await get().fetchDocuments()
      return response.data
    } catch {
      return null
    }
  },

  updateDocument: async (id: number, title: string) => {
    try {
      await fileAPI.update(id, { title })
      await get().fetchDocuments()
      return true
    } catch {
      return false
    }
  },

  deleteDocument: async (id: number) => {
    try {
      await fileAPI.delete(id)
      await get().fetchDocuments()
      return true
    } catch {
      return false
    }
  },
}))

export default useFileStore