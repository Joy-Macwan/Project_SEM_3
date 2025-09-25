const express = require('express');
const router = express.Router();
const dashboardController = require('../../controllers/admin/dashboard.controller');
const { authenticateToken, requireAdminRole } = require('../../middleware/auth.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Use the imported general limiter for API routes
const apiLimiter = generalLimiter;

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