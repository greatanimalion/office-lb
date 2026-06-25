
import type { DocumentVersion } from '@/types/file';
import request from '../request'
import type { MyDocument } from '@/types'

const CHUNK_SIZE = 5 * 1024 * 1024; // 每个分片 5MB
export const fileAPI = {
  /**
   * 获取可以获取的列表，可分页
  */
  list: (params: { page:number, pageSize?:number,owner_id:number,owner_type:'folder'|'group'|'user'|'public',filter?:string})=>
    request.get<{success: boolean,data: {total:number,documents: MyDocument[]}}>('/api/documents/all', { params }),
  /**
   * 将文档长传到文件夹，组，或公共空间
  */
  upLoadTo: (documentId: number,targetId: number,owner_type: 'folder'|'group'|'public') =>
    request.post<{success: boolean,message: string}>('/api/documents/uploadTo',{targetId, documentId,owner_type}),  
  /**
   * 获取文档配置
  */
  getConfig: async (id: number) => {
    const token = localStorage.getItem('token')
    const baseURL = import.meta.env.VITE_API_URL
    const response = await request.get(`${baseURL}/api/onlyoffice/${id}/config`, {
      headers: token ? { Authorization: token } : {},
    })
    return response.data
  },
  /**
   * 分片上传文档
  */
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
  /**
   * 初始化分片上传请求
  */
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
  /**
   * 获取文档版本
  */
  getDocumentVersions: (documentId: number) =>
    request.get<{ success: boolean, data: DocumentVersion[],currentVersion:number,message?:string }>(`/api/documents/${documentId}/versions`),
  /**
   * 回滚到指定版本
  */
  revertToVersion: (documentId: number, versionId: number) =>
    request.post<{ success: boolean, message: string }>(`/api/documents/revert`,{documentId, versionId}),
  /**
   * 修改文件夹
  */
  updateFolder: (id: number, title: string,permissions: number) =>
    request.put<{ success: boolean, message: string }>(`/api/folders/${id}`, { title,permissions }),
  /**
   * 删除文件夹
  */
  deleteFolder: (id: number) =>
    request.delete<{ success: boolean, message: string }>(`/api/folders/${id}`),
  /**
   * 删除文档版本
  */
  deleteDocumentVersion: (id: number) =>
    request.delete<{ success: boolean, message: string }>(`/api/documents/${id}/version`),
}

