const express = require('express');
const router = express.Router();
const authController = require('../../controllers/buyer/auth.controller');
const { authLimiter } = require('../../middleware/rateLimit.middleware');
const rateLimit = require('express-rate-limit');

// Create verification-specific limiter
const verificationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 requests per windowMs for verification routes
  message: {
    error: true,
    code: 'VERIFICATION_RATE_LIMIT_EXCEEDED',
    message: 'Too many verification attempts, please try again later'
  }
});

// Registration route
router.post('/register', authLimiter, authController.register);

// Login route
router.post('/login', authLimiter, authController.login);

// Email verification route
router.get('/verify-email/:token', verificationLimiter, authController.verifyEmail);

// Forgot password route
router.post('/forgot-password', authLimiter, authController.forgotPassword);

// Reset password route
router.post('/reset-password', verificationLimiter, authController.resetPassword);

// Refresh token route
router.post('/refresh-token', authLimiter, authController.refreshToken);

// Logout route
router.post('/logout', authController.logout);

module.exports = router;