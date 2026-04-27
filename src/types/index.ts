// Dashboard types
export interface MonthlyData {
  months: string[];
  income: number[];
  expenses: number[];
}

export interface CurrentMonth {
  totalIncome: number;
  totalExpenses: number;
  savings: number;
  savingsRate: string;
}

export interface CategoryBreakdown {
  [key: string]: number;
}

export interface DashboardData {
  monthlyData: MonthlyData;
  categoryBreakdown: CategoryBreakdown;
  currentMonth: CurrentMonth;
}

// Transaction types
export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

// Budget types
export interface Budget {
  id: string;
  icon: string;
  name: string;
  limit: number;
  spent: number;
}

// Settings types
export interface UserSettings {
  fullName: string;
  email: string;
  phone: string;
  currency: string;
  threshold: number;
  dateFormat: string;
  budgetCycleStart: string;
}

export interface NotificationSettings {
  budgetAlerts: boolean;
  weeklySummary: boolean;
  transactionAlerts: boolean;
  monthlyReport: boolean;
}

export interface SettingsData {
  userSettings: UserSettings;
  notifications: NotificationSettings;
}

// Savings Goals types
export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentSavings: number;
  deadline: string;
  createdDate: string;
}