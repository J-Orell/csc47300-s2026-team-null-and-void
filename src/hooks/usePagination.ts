import { useState, useMemo } from 'react'

/**
 * usePagination - Handles pagination logic for lists
 * Automatically adjusts current page when items change
 * 
 * @template T - Type of items being paginated
 * @param items - Array of items to paginate
 * @param itemsPerPage - Number of items per page
 * @returns Paginated items and pagination controls
 */
export function usePagination<T>(items: T[], itemsPerPage: number) {
  const [currentPage, setCurrentPage] = useState(1)
  
  // Calculate total pages
  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))
  
  // Ensure current page is within bounds
  const safePage = Math.min(currentPage, totalPages)
  
  // Get items for current page
  const paginatedItems = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage
    return items.slice(start, start + itemsPerPage)
  }, [items, safePage, itemsPerPage])
  
  return {
    currentPage: safePage,
    totalPages,
    paginatedItems,
    setCurrentPage,
    goToNextPage: () => setCurrentPage(p => Math.min(totalPages, p + 1)),
    goToPrevPage: () => setCurrentPage(p => Math.max(1, p - 1)),
    goToPage: (page: number) => setCurrentPage(Math.max(1, Math.min(totalPages, page)))
  }
}