const express = require('express');
const router = express.Router();

// Import seller routes
const authRoutes = require('./seller/auth.routes');
const productsRoutes = require('./seller/products.routes');
const ordersRoutes = require('./seller/orders.routes');
const payoutsRoutes = require('./seller/payouts.routes');
const inventoryRoutes = require('./seller/inventory.routes');
const returnsRoutes = require('./seller/returns.routes');

// Map routes to their respective paths
router.use('/auth', authRoutes);
router.use('/products', productsRoutes);
router.use('/orders', ordersRoutes);
router.use('/payouts', payoutsRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/returns', returnsRoutes);

// Export the router
module.exports = router;