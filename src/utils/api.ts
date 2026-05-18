import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5050/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  const isAuthRoute =
    config.url?.includes('/login') ||
    config.url?.includes('/register');

  if (token && !isAuthRoute) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle responses
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const url = error.config?.url ?? '';
      const isAuthRoute =
        url.includes('/login') || url.includes('/register');
      if (!isAuthRoute) {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:unauthorized'));
      }
    }
    return Promise.reject(error);
  }
);

// User APIs
export const userAPI = {
  register: (data: {
    username: string;
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) => apiClient.post('/users/register', data),

  login: (data: { email: string; password: string }) =>
    apiClient.post('/users/login', data),

  getProfile: () => apiClient.get('/users/profile'),

  updateProfile: (data: {
    firstName?: string;
    lastName?: string;
    username?: string;
    email?: string;
    profilePicture?: string;
    phone?: string;
  }) => apiClient.put('/users/profile', data),

  deleteOwnAccount: (password: string) =>
    apiClient.delete('/users/me', { data: { password } }),

  getAllUsers: () => apiClient.get('/users'),

  getUserById: (id: string) => apiClient.get(`/users/${id}`),

  deleteUser: (id: string) => apiClient.delete(`/users/${id}`),

  updateUserRole: (id: string, role: string) =>
    apiClient.put(`/users/${id}/role`, { role }),

  updateUser: (id: string, data: object) => apiClient.put(`/users/${id}`, data),
};

// Budget APIs
export const budgetAPI = {
  createBudget: (data: {
    name: string;
    category: string;
    budgetedAmount: number;
    month: string;
    description?: string;
    spentAmount?: number;
  }) => apiClient.post('/budgets', data),

  getUserBudgets: () => apiClient.get('/budgets'),

  getBudgetById: (id: string) => apiClient.get(`/budgets/${id}`),

  updateBudget: (id: string, data: object) =>
    apiClient.put(`/budgets/${id}`, data),

  deleteBudget: (id: string) => apiClient.delete(`/budgets/${id}`),

  getAllBudgets: () => apiClient.get('/budgets/admin/all'),
};

// Transaction APIs
export const transactionAPI = {
  createTransaction: (data: {
    description: string;
    amount: number;
    category: string;
    type: 'income' | 'expense';
    date: string;
    budget?: string;
    notes?: string;
  }) => apiClient.post('/transactions', data),

  getUserTransactions: (filters?: {
    category?: string;
    type?: string;
    startDate?: string;
    endDate?: string;
  }) =>
    apiClient.get('/transactions', {
      params: filters,
    }),

  getTransactionById: (id: string) => apiClient.get(`/transactions/${id}`),

  updateTransaction: (id: string, data: object) =>
    apiClient.put(`/transactions/${id}`, data),

  deleteTransaction: (id: string) => apiClient.delete(`/transactions/${id}`),

  getAllTransactions: () => apiClient.get('/transactions/admin/all'),

  getTransactionsByUserId: (userId: string) =>
    apiClient.get(`/transactions/admin/user/${userId}`),
};

// Savings Goal APIs
export const savingsGoalAPI = {
  createGoal: (data: {
    name: string;
    targetAmount: number;
    deadline: string;
    category?: string;
    description?: string;
  }) => apiClient.post('/savings-goals', data),

  getUserGoals: () => apiClient.get('/savings-goals'),

  getGoalById: (id: string) => apiClient.get(`/savings-goals/${id}`),

  updateGoal: (id: string, data: object) =>
    apiClient.put(`/savings-goals/${id}`, data),

  deleteGoal: (id: string) => apiClient.delete(`/savings-goals/${id}`),

  addToGoal: (id: string, amount: number) =>
    apiClient.post(`/savings-goals/${id}/add`, { amount }),

  getAllGoals: () => apiClient.get('/savings-goals/admin/all'),
};

// Settings APIs
export const settingsAPI = {
  getSettings: () => apiClient.get('/settings'),

  updateSettings: (data: object) => apiClient.put('/settings', data),

  addPaymentMethod: (data: {
    type: string;
    name: string;
    lastDigits: string;
  }) => apiClient.post('/settings/payment-methods', data),

  getPaymentMethods: () => apiClient.get('/settings/payment-methods'),

  deletePaymentMethod: (paymentMethodId: string) =>
    apiClient.delete(`/settings/payment-methods/${paymentMethodId}`),
};

export default apiClient;
