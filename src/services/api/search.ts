import request from '../request'
import type { MyDocument } from '../../types'

export const searchAPI = {
  search: (query: string) =>
    request.get<MyDocument[]>('/search', { params: { q: query } }),
}