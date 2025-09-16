const express = require('express');
const router = express.Router();
const reviewController = require('../../controllers/buyer/review.controller');
const { authenticateToken } = require('../../middleware/auth.middleware');
const { rateLimit } = require('../../middleware/rateLimit.middleware');

// Apply rate limiting to review routes
const reviewLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // limit each IP to 20 requests per windowMs for review routes
  message: 'Too many review requests, please try again later'
});

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