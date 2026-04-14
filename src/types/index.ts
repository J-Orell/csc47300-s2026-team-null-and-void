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

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: 'income' | 'expense';
}

export interface Budget {
  id: string;
  icon: string;
  name: string;
  limit: number;
  spent: number;
}