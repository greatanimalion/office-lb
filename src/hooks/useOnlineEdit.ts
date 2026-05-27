import { useState, useCallback } from 'react'

interface OnlineEditState {
  isEditing: boolean
  editorUrl: string | null
}

export function useOnlineEdit() {
  const [state, setState] = useState<OnlineEditState>({
    isEditing: false,
    editorUrl: null,
  })

  const openEditor = useCallback((documentId: number) => {
    const token = localStorage.getItem('token')
    const url = `${import.meta.env.VITE_ONLYOFFICE_URL || 'http://localhost:5000'}/editor/${documentId}?token=${token}`
    setState({ isEditing: true, editorUrl: url })
  }, [])

  const closeEditor = useCallback(() => {
    setState({ isEditing: false, editorUrl: null })
  }, [])

  return { ...state, openEditor, closeEditor }
}