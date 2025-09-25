const express = require('express');
const router = express.Router();
const profileController = require('../../controllers/buyer/profile.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Use the general limiter for profile routes
const profileLimiter = generalLimiter;

// All routes require authentication
router.use(authenticateToken);
router.use(profileLimiter);

// Profile routes
router.get('/', profileController.getProfile);  // GET /profile
router.put('/', profileController.updateProfile);  // PUT /profile
router.post('/change-password', profileController.changePassword);

// Address routes
router.get('/addresses', profileController.getAddresses);
router.post('/addresses', profileController.addAddress);
router.put('/addresses/:addressId', profileController.updateAddress);
router.delete('/addresses/:addressId', profileController.deleteAddress);

module.exports = router;