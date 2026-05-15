const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');
const {
  register,
  login,
  getProfile,
  updateProfile,
  getAllUsers,
  getUserById,
  deleteUser,
  updateUserRole,
  updateUserByAdmin,
} = require('../controllers/userController');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/profile', authMiddleware, getProfile);
router.put('/profile', authMiddleware, updateProfile);

// Admin routes
router.get('/', authMiddleware, adminMiddleware, getAllUsers);
router.get('/:id', authMiddleware, adminMiddleware, getUserById);
router.put('/:id', authMiddleware, adminMiddleware, updateUserByAdmin);
router.delete('/:id', authMiddleware, adminMiddleware, deleteUser);
router.put('/:id/role', authMiddleware, adminMiddleware, updateUserRole);

module.exports = router;
