import { FC } from 'react'

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

/**
 * Pagination - Page navigation controls
 * Shows current page and allows navigation between pages
 */
const Pagination: FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null

  return (
    <div className="pagination">
      <button
        className="page-btn"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        ‹
      </button>
      
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          className={`page-btn${page === currentPage ? ' active' : ''}`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}
      
      <button
        className="page-btn"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        ›
      </button>
    </div>
  )
}

export default Pagination