import { useState, useEffect } from 'react'

/**
 * useDataFetch - Generic data fetching hook
 * Handles loading, error states, and data fetching for any data structure
 *
 * @template T - Type of data being fetched
 * @param url - URL to fetch data from
 * @returns Data, loading state, error state, and refetch function
 */
export function useDataFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Failed to fetch data from ${url}: ${response.status} ${response.statusText}`)
      }
      const jsonData: T = await response.json()
      setData(jsonData)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error occurred'))
      console.error(`Error fetching from ${url}:`, err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [url])

  return { data, loading, error, refetch: fetchData }
}