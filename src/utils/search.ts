export interface SearchParams {
  query: string
  page?: number
  pageSize?: number
  sortBy?: 'relevance' | 'date' | 'name'
}

export interface SearchResult<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
  highlight?: Record<string, string>
}

export function buildSearchQuery(params: SearchParams): string {
  const queryParams = new URLSearchParams()
  queryParams.set('q', params.query)
  if (params.page) queryParams.set('page', String(params.page))
  if (params.pageSize) queryParams.set('pageSize', String(params.pageSize))
  if (params.sortBy) queryParams.set('sortBy', params.sortBy)
  return queryParams.toString()
}