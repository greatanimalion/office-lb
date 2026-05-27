import { create } from 'zustand'

interface GlobalState {
  sidebarCollapsed: boolean
  globalLoading: boolean
  toggleSidebar: () => void
  setGlobalLoading: (loading: boolean) => void
}

const useGlobalStore = create<GlobalState>((set) => ({
  sidebarCollapsed: false,
  globalLoading: false,

  toggleSidebar: () => {
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed }))
  },

  setGlobalLoading: (loading: boolean) => {
    set({ globalLoading: loading })
  },
}))

export default useGlobalStore