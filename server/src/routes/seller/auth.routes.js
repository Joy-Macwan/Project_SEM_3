const express = require('express');
const router = express.Router();
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const { authenticateToken } = require('../../middleware/auth.middleware');
const authController = require('../../controllers/seller/auth.controller');

// Apply rate limiting to auth routes
router.use(authLimiter);

// Register as seller
router.post('/register', auditLog('SELLER_REGISTER'), authController.register);

// Login
router.post('/login', auditLog('SELLER_LOGIN'), authController.login);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail);

// Refresh token - support both endpoint names for compatibility
router.post('/refresh', authController.refreshToken);
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authenticateToken, auditLog('SELLER_LOGOUT'), authController.logout);

// Apply for seller verification (KYC)
router.post('/kyc', authenticateToken, auditLog('SELLER_KYC_SUBMIT'), authController.applyForKYC);

// Get KYC status
router.get('/kyc', authenticateToken, authController.getKYCStatus);

module.exports = router;