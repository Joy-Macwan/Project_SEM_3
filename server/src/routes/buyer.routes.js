const express = require('express');
const router = express.Router();

// Import buyer routes
const authRoutes = require('./buyer/auth.routes');
const profileRoutes = require('./buyer/profile.routes');
const productRoutes = require('./buyer/product.routes');
const cartRoutes = require('./buyer/cart.routes');
const wishlistRoutes = require('./buyer/wishlist.routes');
const reviewRoutes = require('./buyer/review.routes');

// Map routes to their respective paths
router.use('/auth', authRoutes);
router.use('/profile', profileRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);

// Export the router
module.exports = router;