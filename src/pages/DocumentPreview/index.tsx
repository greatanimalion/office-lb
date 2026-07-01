import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Empty, message, Spin } from 'antd'
import { fileAPI } from '@/services/api/file'
import { DocumentEditor } from "@onlyoffice/document-editor-react"


function DocumentPreview() {
  const { id } = useParams<{ id: string }>()
  const [documentConfig, setDocumentConfig] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [shoudView, setShouldoudView] = useState(true)
  useEffect(() => {
    if (!id) return message.error("无效文档ID")
    setLoading(true)
    async function getConfig() {
      const config = await fileAPI.getConfig(Number(id))
      console.log(config)
      setShouldoudView(config.token ? true : false)
      setDocumentConfig(config)
      setLoading(false)
    }
    getConfig()
  }, [id])
  return (<>
    {shoudView ? <div className="flex flex-col h-full">
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
    </div>: <Empty style={{width:"100%",marginTop:"300px"}} description="文档不存在或没有权限查看" />
  }
  </>
  )
}

export default DocumentPreview