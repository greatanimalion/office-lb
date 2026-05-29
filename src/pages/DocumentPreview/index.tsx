import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Spin, Button } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { fileAPI } from '@/services/api/file'
import {DocumentEditor} from "@onlyoffice/document-editor-react"


function DocumentPreview() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [documentConfig, setDocumentConfig] = useState<Object | null>(null)
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
      <div className="flex items-center gap-4 px-4 py-3 border-b border-gray-200 bg-white">
        <Button type="text" icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
          返回
        </Button>
        <span className="text-base font-medium">文档预览</span>
      </div>
      <div className="flex-1 relative">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white">
            <Spin size="large" />
          </div>
        )}
        {documentConfig && (<DocumentEditor id={new Date().getTime().toString()} documentServerUrl={documentConfig.documentServerUrl} config={documentConfig} />)}
      </div>
    </div>
  )
}

export default DocumentPreview