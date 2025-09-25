const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/buyer/review.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Use the general limiter for review routes
const reviewLimiter = generalLimiter;

// Public route for getting reviews
router.get('/products/:productId/reviews', reviewController.getProductReviews);

// Protected routes that require authentication
router.use(authenticateToken);
router.use(reviewLimiter);

// Review routes
router.post('/products/:productId/reviews', reviewController.addProductReview);
router.put('/reviews/:reviewId', reviewController.updateProductReview);
router.delete('/reviews/:reviewId', reviewController.deleteProductReview);

module.exports = router;