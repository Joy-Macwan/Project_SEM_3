const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/buyer/wishlist.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Use the general limiter for wishlist routes
const wishlistLimiter = generalLimiter;

// All routes require authentication
router.use(authenticateToken);
router.use(wishlistLimiter);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;