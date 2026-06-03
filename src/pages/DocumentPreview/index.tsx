import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Spin } from 'antd'
import { fileAPI } from '@/services/api/file'
import {DocumentEditor} from "@onlyoffice/document-editor-react"


function DocumentPreview() {
  const { id } = useParams<{ id: string }>()
  const [documentConfig, setDocumentConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    if (!id) return
    setLoading(true)
    async function getConfig() {
      const config = await fileAPI.getConfig(Number(id))
      setDocumentConfig(config)
      setLoading(false)
    }
    getConfig()
  }, [id])
  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <Spin size="large" />
          </div>
        )}
        {documentConfig && (
          <DocumentEditor id={new Date().getTime().toString()}
           documentServerUrl={documentConfig.documentServerUrl} 
           config={documentConfig} 
           />)}
      </div>
    </div>
  )
}

export default DocumentPreview