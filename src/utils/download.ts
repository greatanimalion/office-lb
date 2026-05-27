import request from '../services/request'

export function downloadFile(url: string, filename: string) {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

export async function downloadDocument(id: number, title: string) {
  const response = await request.get(`/documents/${id}/download`, {
    responseType: 'blob',
  })
  const url = URL.createObjectURL(new Blob([response.data]))
  downloadFile(url, title)
}