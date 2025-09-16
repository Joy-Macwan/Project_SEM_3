const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/buyer/profile.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { rateLimit } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to profile routes
const profileLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for profile routes
  message: 'Too many profile requests, please try again later'
});

// All routes require authentication
router.use(authenticateToken);
router.use(profileLimiter);

// Profile routes
router.get('/me', profileController.getProfile);
router.put('/me', profileController.updateProfile);
router.post('/change-password', profileController.changePassword);

// Address routes
router.get('/addresses', profileController.getAddresses);
router.post('/addresses', profileController.addAddress);
router.put('/addresses/:addressId', profileController.updateAddress);
router.delete('/addresses/:addressId', profileController.deleteAddress);

module.exports = router;