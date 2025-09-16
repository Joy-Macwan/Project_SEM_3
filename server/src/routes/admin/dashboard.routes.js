const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');
const { authenticateToken, requireAdminRole } = require('../../middleware/auth.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const { rateLimit } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to API routes
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests, please try again later'
});

// Apply authentication and admin role check to all routes
router.use(authenticateToken);
router.use(requireAdminRole);
router.use(apiLimiter);

// Get dashboard metrics
router.get(
  '/metrics',
  auditLog('ADMIN_GET_DASHBOARD_METRICS'),
  dashboardController.getDashboardMetrics
);

// Get system status
router.get(
  '/system-status',
  auditLog('ADMIN_GET_SYSTEM_STATUS'),
  dashboardController.getSystemStatus
);

// Get sales statistics
router.get(
  '/sales-stats',
  auditLog('ADMIN_GET_SALES_STATS'),
  dashboardController.getSalesStats
);

module.exports = router;