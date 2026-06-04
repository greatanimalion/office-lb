import { useState, useCallback } from 'react'
import { fileAPI } from '../services/api/file'
import useFileStore from '@/store/useFileStore'
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
    setState({ uploading: true, progress: 0, error: null })
    try {
      const response = await fileAPI.chunkInit(file)
      await fileAPI.chunkUpload(response.fileId,file,setState) 
      return response
    } catch { 
      // setState((prev) => ({ ...prev, uploading: false, error: '上传失败' }))
      return null
    }
  }, [])

  const reset = useCallback(() => {
    setState({ uploading: false, progress: 0, error: null })
  }, [])
  return { ...state, upload, reset }
}

