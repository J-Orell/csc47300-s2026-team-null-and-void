import { CATEGORY_ICONS } from '../constants/categories'
import { DashboardData, Transaction } from '../types'
import { ApiBudget, ApiSavingsGoal, ApiTransaction } from '../types/api'

export function getApiErrorMessage(err: unknown, fallback: string): string {
  if (err && typeof err === 'object' && 'response' in err) {
    const data = (err as { response?: { data?: { message?: string } } }).response
      ?.data
    if (data?.message) return data.message
  }
  return fallback
}

export function mapTransactionFromApi(tx: ApiTransaction): Transaction {
  return {
    id: tx._id,
    date: new Date(tx.date).toISOString().split('T')[0],
    description: tx.description,
    category: tx.category,
    amount: tx.amount,
    type: tx.type,
  }
}

export function mapTransactionToApi(data: {
  description: string
  amount: number
  category: string
  date: string
  type?: 'income' | 'expense'
}) {
  const type =
    data.type ??
    (data.category === 'Income' ? 'income' : ('expense' as const))
  return {
    description: data.description,
    amount: data.amount,
    category: data.category,
    type,
    date: data.date,
  }
}

export interface BudgetCardData {
  id: string
  icon: string
  name: string
  limit: number
  spent: number
  category: string
  month: string
  description?: string
}

export function mapBudgetFromApi(b: ApiBudget): BudgetCardData {
  return {
    id: b._id,
    icon: CATEGORY_ICONS[b.category] ?? '💰',
    name: b.name,
    limit: b.budgetedAmount,
    spent: b.spentAmount,
    category: b.category,
    month: new Date(b.month).toISOString().split('T')[0],
    description: b.description,
  }
}

export interface SavingsGoalUi {
  id: string
  name: string
  targetAmount: number
  currentSavings: number
  deadline: string
  createdDate: string
}

export function mapSavingsGoalFromApi(g: ApiSavingsGoal): SavingsGoalUi {
  return {
    id: g._id,
    name: g.name,
    targetAmount: g.targetAmount,
    currentSavings: g.currentAmount,
    deadline: new Date(g.deadline).toISOString().split('T')[0],
    createdDate: g.createdAt
      ? new Date(g.createdAt).toISOString().split('T')[0]
      : new Date().toISOString().split('T')[0],
  }
}

export function buildDashboardFromTransactions(
  transactions: ApiTransaction[]
): DashboardData {
  const now = new Date()
  const months: string[] = []
  const income: number[] = []
  const expenses: number[] = []

  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push(d.toLocaleDateString('en-US', { month: 'short' }))
    const monthIncome = transactions
      .filter(tx => {
        const td = new Date(tx.date)
        return (
          tx.type === 'income' &&
          td.getMonth() === d.getMonth() &&
          td.getFullYear() === d.getFullYear()
        )
      })
      .reduce((s, tx) => s + tx.amount, 0)
    const monthExpenses = transactions
      .filter(tx => {
        const td = new Date(tx.date)
        return (
          tx.type === 'expense' &&
          td.getMonth() === d.getMonth() &&
          td.getFullYear() === d.getFullYear()
        )
      })
      .reduce((s, tx) => s + tx.amount, 0)
    income.push(monthIncome)
    expenses.push(monthExpenses)
  }

  const currentMonthTxs = transactions.filter(tx => {
    const d = new Date(tx.date)
    return (
      d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    )
  })

  const totalIncome = currentMonthTxs
    .filter(t => t.type === 'income')
    .reduce((s, t) => s + t.amount, 0)
  const totalExpenses = currentMonthTxs
    .filter(t => t.type === 'expense')
    .reduce((s, t) => s + t.amount, 0)
  const savings = totalIncome - totalExpenses
  const savingsRate =
    totalIncome > 0 ? `${((savings / totalIncome) * 100).toFixed(1)}%` : '0%'

  const categoryBreakdown: Record<string, number> = {}
  currentMonthTxs
    .filter(t => t.type === 'expense')
    .forEach(t => {
      categoryBreakdown[t.category] =
        (categoryBreakdown[t.category] || 0) + t.amount
    })

  return {
    monthlyData: { months, income, expenses },
    categoryBreakdown,
    currentMonth: {
      totalIncome,
      totalExpenses,
      savings,
      savingsRate,
    },
  }
}
