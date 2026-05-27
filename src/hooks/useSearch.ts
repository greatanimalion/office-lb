import { useState, useCallback, useRef } from 'react'
import { searchAPI } from '../services/api/search'
import type { Document } from '../types'

export function useSearch() {
  const [results, setResults] = useState<Document[]>([])
  const [searching, setSearching] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(null)

  const search = useCallback(async (query: string) => {
    if (!query.trim()) {
      setResults([])
      return
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    timerRef.current = setTimeout(async () => {
      setSearching(true)
      try {
        const response = await searchAPI.search(query)
        setResults(response.data)
      } catch {
        setResults([])
      } finally {
        setSearching(false)
      }
    }, 300)
  }, [])

  const clearResults = useCallback(() => {
    setResults([])
  }, [])

  return { results, searching, search, clearResults }
}