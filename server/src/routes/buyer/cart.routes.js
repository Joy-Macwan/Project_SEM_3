const express = require('express');
const router = express.Router();
const cartController = require('../../controllers/buyer/cart.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Use the general limiter for cart routes
const cartLimiter = generalLimiter;

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