import request from '../request'
import type { MyDocument } from '@/types'

export const publicDocumentAPI = {
  list: (page: number=1, pageSize: number=10) =>
    request.get<{success: boolean,data: MyDocument[]}>(`/api/documents/allPublic`,{params: { page, pageSize}}),
}