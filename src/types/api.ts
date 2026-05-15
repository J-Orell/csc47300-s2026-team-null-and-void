export interface ApiUser {
  _id: string
  username: string
  email: string
  firstName?: string
  lastName?: string
  role: 'user' | 'admin'
  isActive?: boolean
  createdAt?: string
  updatedAt?: string
}

export interface ApiTransaction {
  _id: string
  userId: string | { _id: string; username?: string; email?: string }
  description: string
  amount: number
  category: string
  type: 'income' | 'expense'
  date: string
  notes?: string
  budget?: { _id: string; name?: string; category?: string } | string
  createdAt?: string
  updatedAt?: string
}

export interface ApiBudget {
  _id: string
  userId: string
  name: string
  category: string
  budgetedAmount: number
  spentAmount: number
  month: string
  description?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiSavingsGoal {
  _id: string
  name: string
  targetAmount: number
  currentAmount: number
  deadline: string
  category?: string
  description?: string
  status?: string
  createdAt?: string
  updatedAt?: string
}

export interface ApiSettings {
  _id: string
  userId: string
  theme?: string
  currency?: string
  notificationsEnabled?: boolean
  emailNotifications?: boolean
  monthlyBudgetReminder?: boolean
  savingsGoalReminder?: boolean
  language?: string
  paymentMethods?: Array<{
    id: string
    type: string
    name: string
    lastDigits: string
    isDefault?: boolean
  }>
}
