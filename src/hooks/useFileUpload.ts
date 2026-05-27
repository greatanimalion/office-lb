import { useState, useCallback } from 'react'
import { fileAPI } from '../services/api/file'

interface UploadState {
  uploading: boolean
  progress: number
  error: string | null
}

export function useFileUpload() {
  const [state, setState] = useState<UploadState>({
    uploading: false,
    progress: 0,
    error: null,
  })

  const upload = useCallback(async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)

    setState({ uploading: true, progress: 0, error: null })

    try {
      const response = await fileAPI.upload(formData, (percent) => {
        setState((prev) => ({ ...prev, progress: percent }))
      })
      setState((prev) => ({ ...prev, uploading: false, progress: 100 }))
      return response.data
    } catch {
      setState((prev) => ({ ...prev, uploading: false, error: '上传失败' }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null })
  }, [])

  return { ...state, upload, reset }
}