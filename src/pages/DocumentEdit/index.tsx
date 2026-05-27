import { useParams } from 'react-router-dom'

function DocumentEdit() {
  const { id } = useParams<{ id: string }>()

  return (
    <div>
      <h2>文档编辑 - {id}</h2>
      <p>OnlyOffice 在线编辑器将嵌入此处</p>
    </div>
  )
}

export default DocumentEdit