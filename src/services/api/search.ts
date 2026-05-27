import request from '../request'
import type { Document } from '../../types'

export const searchAPI = {
  search: (query: string) =>
    request.get<Document[]>('/search', { params: { q: query } }),
}