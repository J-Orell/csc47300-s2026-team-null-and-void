const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  createSavingsGoal,
  getUserSavingsGoals,
  getSavingsGoalById,
  updateSavingsGoal,
  deleteSavingsGoal,
  getAllSavingsGoals,
  addToSavingsGoal,
} = require('../controllers/savingsGoalController');

// Protected routes
router.post('/', authMiddleware, createSavingsGoal);
router.get('/', authMiddleware, getUserSavingsGoals);
router.get('/:id', authMiddleware, getSavingsGoalById);
router.put('/:id', authMiddleware, updateSavingsGoal);
router.delete('/:id', authMiddleware, deleteSavingsGoal);
router.post('/:id/add', authMiddleware, addToSavingsGoal);

// Admin routes
router.get('/admin/all', authMiddleware, adminMiddleware, getAllSavingsGoals);

module.exports = router;
