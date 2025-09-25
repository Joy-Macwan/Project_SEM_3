const express = require('express');
const router = express.Router();
const authController = require('../../controllers/admin/auth.controller');
const { authenticateToken, requireAdminRole } = require('../../middleware/auth.middleware');
const { authLimiter, sensitiveOperationLimiter } = require('../../middleware/rateLimit.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const { rateLimit } = require('express-rate-limit');

// Create MFA-specific limiter
const mfaLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5, // limit each IP to 5 requests per windowMs for MFA routes
  message: {
    error: true,
    code: 'MFA_RATE_LIMIT_EXCEEDED',
    message: 'Too many MFA attempts, please try again later'
  }
});

// Create refresh token limiter
const refreshLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50, // limit each IP to 50 refresh requests per hour
  message: {
    error: true,
    code: 'REFRESH_RATE_LIMIT_EXCEEDED',
    message: 'Too many refresh attempts, please try again later'
  }
});

// Admin login route
router.post('/login', authLimiter, auditLog('AUTH_LOGIN_ATTEMPT'), authController.login);

// MFA verification route
router.post('/verify-mfa', mfaLimiter, auditLog('AUTH_MFA_ATTEMPT'), authController.verifyMfa);

// Refresh token route - update to match client API call
router.post('/refresh', refreshLimiter, authController.refresh);
router.post('/refresh-token', refreshLimiter, authController.refresh); // Alias for consistency

// Logout route
router.post('/logout', authenticateToken, auditLog('AUTH_LOGOUT'), authController.logout);

// Protected routes that require authentication
// MFA setup route
router.get('/mfa-setup', 
  authenticateToken, 
  requireAdminRole, 
  auditLog('AUTH_MFA_SETUP'),
  authController.setupMfa
);

// MFA enable route
router.post('/mfa-enable',
  authenticateToken,
  requireAdminRole,
  auditLog('AUTH_MFA_ENABLE'),
  authController.enableMfa
);

// MFA disable route
router.post('/mfa-disable',
  authenticateToken,
  requireAdminRole,
  sensitiveOperationLimiter,
  auditLog('AUTH_MFA_DISABLE_ATTEMPT'),
  authController.disableMfa
);

module.exports = router;