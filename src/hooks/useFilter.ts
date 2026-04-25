import { useState, useMemo } from 'react'

/**
 * useFilter - Generic filtering hook for lists
 * Handles filter state and returns filtered items
 * 
 * @template T - Type of items being filtered
 * @param items - Array of items to filter
 * @param filterFn - Function that determines if item passes filter
 * @returns Filtered items and filter state setters
 */
export function useFilter<T>(
  items: T[],
  filterFn: (item: T, filters: Record<string, any>) => boolean
) {
  const [filters, setFilters] = useState<Record<string, any>>({})

  const filteredItems = useMemo(() => {
    return items.filter(item => filterFn(item, filters))
  }, [items, filters, filterFn])

  const updateFilter = (key: string, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }))
  }

  const resetFilters = () => {
    setFilters({})
  }

  return {
    filteredItems,
    filters,
    updateFilter,
    resetFilters
  }
}