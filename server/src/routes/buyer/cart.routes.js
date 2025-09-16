const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/buyer/cart.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { rateLimit } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to cart routes
const cartLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs for cart routes
  message: 'Too many cart requests, please try again later'
});

// All routes require authentication
router.use(authenticateToken);
router.use(cartLimiter);

// Cart routes
router.get('/', cartController.getCart);
router.post('/', cartController.addToCart);
router.put('/items/:itemId', cartController.updateCartItem);
router.delete('/items/:itemId', cartController.removeCartItem);
router.delete('/', cartController.clearCart);

module.exports = router;