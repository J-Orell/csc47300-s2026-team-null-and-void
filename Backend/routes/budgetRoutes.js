const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  createBudget,
  getUserBudgets,
  getBudgetById,
  updateBudget,
  deleteBudget,
  getAllBudgets,
} = require('../controllers/budgetController');

// Admin routes (must be before /:id)
router.get('/admin/all', authMiddleware, adminMiddleware, getAllBudgets);

// Protected routes
router.post('/', authMiddleware, createBudget);
router.get('/', authMiddleware, getUserBudgets);
router.get('/:id', authMiddleware, getBudgetById);
router.put('/:id', authMiddleware, updateBudget);
router.delete('/:id', authMiddleware, deleteBudget);

module.exports = router;
