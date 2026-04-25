import { FC } from 'react'
import { FormField, Button } from '../common'

type FilterType = 'all' | 'income' | 'expense'

interface TransactionFiltersProps {
  filterDate: string
  filterCategory: string
  filterType: FilterType
  onDateChange: (date: string) => void
  onCategoryChange: (category: string) => void
  onTypeChange: (type: FilterType) => void
  onApply: () => void
}

/**
 * TransactionFilters - Filter controls for transactions page
 * Allows filtering by date, category, and transaction type
 */
const TransactionFilters: FC<TransactionFiltersProps> = ({
  filterDate,
  filterCategory,
  filterType,
  onDateChange,
  onCategoryChange,
  onTypeChange,
  onApply
}) => {
  return (
    <div className="filter-bar">
      <FormField
        label="From Date"
        type="date"
        value={filterDate}
        onChange={onDateChange}
      />
      <FormField
        label="Category"
        type="select"
        value={filterCategory}
        onChange={onCategoryChange}
        options={[
          { value: 'all', label: 'All Categories' },
          { value: 'income', label: 'Income' },
          { value: 'food', label: 'Food' },
          { value: 'utilities', label: 'Utilities' },
          { value: 'entertainment', label: 'Entertainment' },
          { value: 'transport', label: 'Transport' },
          { value: 'shopping', label: 'Shopping' }
        ]}
      />
      <FormField
        label="Type"
        type="select"
        value={filterType}
        onChange={(val) => onTypeChange(val as FilterType)}
        options={[
          { value: 'all', label: 'All' },
          { value: 'income', label: 'Income Only' },
          { value: 'expense', label: 'Expenses Only' }
        ]}
      />
      <Button variant="filter" onClick={onApply}>Apply</Button>
    </div>
  )
}

export default TransactionFilters