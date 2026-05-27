import { useParams } from 'react-router-dom'

function DocumentPreview() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h2>文档预览 - {id}</h2>
      <p>文档预览页面（含水印）</p>
    </div>
  )
}

export default DocumentPreview