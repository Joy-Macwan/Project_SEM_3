const express = require('express');
const router = express.Router();
const usersController = require('../../controllers/admin/users.controller');
const { authenticateToken, requireAdminRole } = require('../../middleware/auth.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to API routes

// Apply authentication and admin role check to all routes
router.use(authenticateToken);
router.use(requireAdminRole);
router.use(generalLimiter);

// Get all users
router.get(
  '/',
  auditLog('ADMIN_GET_USERS'),
  usersController.getUsers
);

// Get user by ID
router.get(
  '/:userId',
  auditLog('ADMIN_GET_USER_DETAILS'),
  usersController.getUserById
);

// Create a new user
router.post(
  '/',
  auditLog('ADMIN_CREATE_USER'),
  usersController.createUser
);

// Update user
router.put(
  '/:userId',
  auditLog('ADMIN_UPDATE_USER'),
  usersController.updateUser
);

// Reset user password
router.post(
  '/:userId/reset-password',
  auditLog('ADMIN_RESET_USER_PASSWORD'),
  usersController.resetUserPassword
);

// Delete user (soft delete)
router.delete(
  '/:userId',
  auditLog('ADMIN_DELETE_USER'),
  usersController.deleteUser
);

// Get user activity logs
router.get(
  '/:userId/activity-logs',
  auditLog('ADMIN_GET_USER_LOGS'),
  usersController.getUserActivityLogs
);

module.exports = router;