
import type { DocumentVersion } from '@/types/file';
import request from '../request'
import type { MyDocument } from '@/types'

const CHUNK_SIZE = 5 * 1024 * 1024; // 每个分片 5MB
export const fileAPI = {
  list: (params: { page:number, pageSize:number,owner_id?:number,owner_type?:'folder'|'group'|'user'|'public'})=>
    request.get<{success: boolean,data: MyDocument[]}>('/api/documents/all', { params }),
  get: (id: number) =>
    request.get<MyDocument>(`/documents/${id}`),
  create: (data: FormData) =>
    request.post<{ id: number; title: string }>('/documents', data, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  upLoadToGroup: (documentId: number,targetId: number,owner_type: 'folder'|'group') =>
    request.post<{success: boolean,message: string}>('/api/documents/uploadToGroup',{targetId, documentId,owner_type}),  
  update: (id: number, data: { title: string }) =>
    request.put(`/documents/${id}`, data),

  delete: (id: number) =>
    request.delete(`/documents/${id}`),

  getConfig: async (id: number) => {
    const token = localStorage.getItem('token')
    const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
    const response = await request.get(`${baseURL}/api/onlyoffice/${id}/config`, {
      headers: token ? { Authorization: token } : {},
    })
    return response.data
  },
  // 上传文档
  upload: (file: File, _onProgress?: (percent: number) => void) => {
    const totalChunks = Math.ceil(file.size / CHUNK_SIZE);
    const uploadPromises: Promise<MyDocument>[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(file.size, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileId', file.name);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      request.post('/api/documents/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      const promise = fetch('http://localhost:3000/upload-chunk', {
        method: 'POST',
        body: formData
      }).then(async response => {
        const result = await response.json();
        if (result.message === 'Upload completed') {
          console.log('全部上传完成，文件已合并');
        }
        return result;
      }).catch(err => {
        console.error(`分片 ${i + 1} 上传失败: ${err.message}`);
      });
      uploadPromises.push(promise);
    }

  },
  chunkUpload:async  (fileId: string, file: File, setState?: (state: any) => void) => {
    const filesize = file.size;
    const totalChunks = Math.ceil(filesize / CHUNK_SIZE);
    setState?.({
      progress: 0,
      uploading: true,
      error: null,
    })
    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(filesize, start + CHUNK_SIZE);
      const chunk = file.slice(start, end);
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('fileId', fileId);
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());
      await request.post<MyDocument>('/api/documents/chunk/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })
      setState?.({
        progress: ((i + 1) / totalChunks * 100).toFixed(2),
        uploading: true,
        error: null,
      })
    }
    const fileName = file.name;
    await request.post<MyDocument>('/api/documents/chunk/merge', {fileId,fileSize:filesize,fileName}) 
    setTimeout(() => {
      setState?.({
        progress: 0,
        uploading: false,
        error: null,
      })
    },1000)
  },
  chunkInit: async (file: File) => {
    const filename = file.name;
    const filesize = file.size;
    const totalChunks = Math.ceil(filesize / CHUNK_SIZE);
    const hash = null
    const res = await request.post<{ fileId: string, filename: string, filesize: number, totalChunks: number }>('/api/documents/chunk/init', {
      filename,
      filesize,
      totalChunks,
      hash,
    })
    return res.data
  },

  getDocumentVersions: (documentId: number) =>
    request.get<{ success: boolean, data: DocumentVersion[] }>(`/api/documents/${documentId}/versions`),

  revertToVersion: (documentId: number, versionId: number) =>
    request.post(`/api/documents/revert`,{documentId, versionId}),
}

