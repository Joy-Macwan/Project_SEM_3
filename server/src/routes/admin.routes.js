const express = require('express');
const router = express.Router();

// Import admin routes
const authRoutes = require('./admin/auth.routes');
const userRoutes = require('./admin/users.routes');
const dashboardRoutes = require('./admin/dashboard.routes');

// Map routes to their respective paths
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/dashboard', dashboardRoutes);

// Export the router
module.exports = router;