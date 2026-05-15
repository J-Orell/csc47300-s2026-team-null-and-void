const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const {
  getUserSettings,
  updateSettings,
  addPaymentMethod,
  getPaymentMethods,
  deletePaymentMethod,
} = require('../controllers/settingsController');

// Protected routes
router.get('/', authMiddleware, getUserSettings);
router.put('/', authMiddleware, updateSettings);
router.post('/payment-methods', authMiddleware, addPaymentMethod);
router.get('/payment-methods', authMiddleware, getPaymentMethods);
router.delete('/payment-methods/:paymentMethodId', authMiddleware, deletePaymentMethod);

module.exports = router;
