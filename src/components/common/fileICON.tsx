import { FilePdfOutlined, FileTextOutlined, FileWordOutlined } from "@ant-design/icons"

export const getFileIcon = (title: string) => {
  const ext = title.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'doc':
    case 'docx':
      return <FileWordOutlined className="text-blue-600" />
    case 'pdf':
      return <FilePdfOutlined className="text-red-500" />
    default:
      return <FileTextOutlined className="text-gray-400" />
  }
}