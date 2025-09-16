const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../../middleware/auth.middleware');
const { auditLog } = require('../../middleware/audit.middleware');
const productsController = require('../../controllers/seller/products.controller');

// All routes require authentication
router.use(authenticateToken);

// Get seller products
router.get('/', productsController.getSellerProducts);

// Get product by ID
router.get('/:id', productsController.getProductById);

// Create product
router.post('/', auditLog('SELLER_CREATE_PRODUCT'), productsController.createProduct);

// Update product
router.put('/:id', auditLog('SELLER_UPDATE_PRODUCT'), productsController.updateProduct);

// Delete product
router.delete('/:id', auditLog('SELLER_DELETE_PRODUCT'), productsController.deleteProduct);

// Upload product images
router.post('/:id/images', auditLog('SELLER_UPLOAD_PRODUCT_IMAGES'), productsController.uploadProductImages);

// Bulk upload products
router.post('/bulk-upload', auditLog('SELLER_BULK_UPLOAD_PRODUCTS'), productsController.bulkUploadProducts);

module.exports = router;