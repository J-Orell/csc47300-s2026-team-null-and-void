const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  createTransaction,
  getUserTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
  getAllTransactions,
  getTransactionsByUserId,
} = require('../controllers/transactionController');

// Admin routes (must be before /:id)
router.get('/admin/all', authMiddleware, adminMiddleware, getAllTransactions);
router.get(
  '/admin/user/:userId',
  authMiddleware,
  adminMiddleware,
  getTransactionsByUserId
);

// Protected routes
router.post('/', authMiddleware, createTransaction);
router.get('/', authMiddleware, getUserTransactions);
router.get('/:id', authMiddleware, getTransactionById);
router.put('/:id', authMiddleware, updateTransaction);
router.delete('/:id', authMiddleware, deleteTransaction);

module.exports = router;
