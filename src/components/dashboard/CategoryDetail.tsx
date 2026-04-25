import { FC } from 'react'
import { formatNumber } from '../../utils/helpers'

interface CategoryDetailProps {
  name: string
  amount: number
  percentage: number
}

/**
 * CategoryDetail - Displays individual category spending info
 * Used in the expense breakdown section
 */
const CategoryDetail: FC<CategoryDetailProps> = ({ name, amount, percentage }) => {
  return (
    <div className="category-item">
      <div className="category-name">{name}</div>
      <div className="category-amount">${formatNumber(amount)}</div>
      <div className="category-percentage">{percentage}% of total</div>
    </div>
  )
}

export default CategoryDetail