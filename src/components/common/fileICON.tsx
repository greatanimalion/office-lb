import { FilePdfOutlined, FilePptOutlined, FileTextOutlined, FileWordOutlined } from "@ant-design/icons"

export const getFileIcon = (title: string) => {
  const ext = title.split('.').pop()?.toLowerCase()
  switch (ext) {
    case 'doc':
    case 'docx':
      return <FileWordOutlined  style={{color:'oklch(54.6% 0.245 262.881)', fontSize:'20px'}}   />
    case 'pdf':
      return <FilePdfOutlined   style={{color:'oklch(63.7% 0.237 25.331)', fontSize:'20px'}}   />
    case 'ppt':
      return <FilePptOutlined   style={{color:'#f34e19', fontSize:'20px'}}   />
    default:
      return <FileTextOutlined  style={{color:'oklch(70.7% 0.022 261.325)', fontSize:'20px'}}   />
  }
}