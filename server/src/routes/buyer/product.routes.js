const express = require('express');
const router = express.Router();
const productController = require('../../controllers/buyer/product.controller');
const { generalLimiter } = require('../../middleware/rateLimit.middleware');

// Apply the general rate limiter to all product routes
router.use(generalLimiter);

// Product routes (public)
router.get('/', productController.getProducts);
router.get('/categories', productController.getCategories);
router.get('/:productId', productController.getProductById);
router.get('/:productId/related', productController.getRelatedProducts);

module.exports = router;