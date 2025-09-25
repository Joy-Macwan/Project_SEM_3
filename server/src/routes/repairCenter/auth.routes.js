const express = require('express');
const router = express.Router();
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const { authenticateToken } = require('../../middleware/auth.middleware');
const authController = require('../../controllers/repairCenter/auth.controller');

// Apply rate limiting to auth routes
router.use(authLimiter);

// Register as repair center
router.post('/register', auditLog('REPAIR_CENTER_REGISTER'), authController.register);

// Login
router.post('/login', auditLog('REPAIR_CENTER_LOGIN'), authController.login);

// Verify email
router.get('/verify-email/:token', authController.verifyEmail);

// Refresh token - support both endpoint names for compatibility
router.post('/refresh', authController.refreshToken);
router.post('/refresh-token', authController.refreshToken);

// Logout
router.post('/logout', authenticateToken, auditLog('REPAIR_CENTER_LOGOUT'), authController.logout);

// Apply for repair center verification (KYC)
router.post('/kyc', authenticateToken, auditLog('REPAIR_CENTER_KYC_SUBMIT'), authController.applyForKYC);

// Get KYC status
router.get('/kyc', authenticateToken, authController.getKYCStatus);

module.exports = router;