export const TRANSACTION_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Shopping',
  'Income',
  'Other',
] as const

export const BUDGET_CATEGORIES = [
  'Housing',
  'Food',
  'Transportation',
  'Entertainment',
  'Healthcare',
  'Utilities',
  'Shopping',
  'Other',
] as const

export const SAVINGS_GOAL_CATEGORIES = [
  'Emergency Fund',
  'Vacation',
  'Home',
  'Car',
  'Education',
  'Other',
] as const

export const CATEGORY_ICONS: Record<string, string> = {
  Housing: '🏠',
  Food: '🛒',
  Transportation: '🚗',
  Entertainment: '🎬',
  Healthcare: '💊',
  Utilities: '💡',
  Shopping: '🛍',
  Income: '💰',
  Other: '💰',
  'Emergency Fund': '🆘',
  Vacation: '✈️',
  Home: '🏡',
  Car: '🚙',
  Education: '📚',
}

export function categorySelectOptions(categories: readonly string[]) {
  return categories.map(c => ({ value: c, label: c }))
}
