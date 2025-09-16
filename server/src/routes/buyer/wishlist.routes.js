const express = require('express');
const router = express.Router();
const wishlistController = require('../../controllers/buyer/wishlist.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { rateLimit } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to wishlist routes
const wishlistLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 requests per windowMs for wishlist routes
  message: 'Too many wishlist requests, please try again later'
});

// All routes require authentication
router.use(authenticateToken);
router.use(wishlistLimiter);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

module.exports = router;