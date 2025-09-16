const { Review, Product, Order, OrderItem, User } = require('../../database/models');

// Get product reviews
const getProductReviews = async (req, res) => {
  try {
    const { productId } = req.params;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Get reviews with pagination
    const { count, rows: reviews } = await Review.findAndCountAll({
      where: { productId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });
    
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      error: false,
      reviews,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching product reviews'
    });
  }
};

// Add product review
const addProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    const { rating, title, body, images } = req.body;
    
    // Validate required fields
    if (!rating || !title || !body) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Rating, title, and body are required'
      });
    }
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Check if product exists
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Check if user has purchased the product
    const orders = await Order.findAll({
      where: { userId, status: 'delivered' },
      include: [
        {
          model: OrderItem,
          where: { productId }
        }
      ]
    });
    
    if (orders.length === 0) {
      return res.status(403).json({
        error: true,
        code: 'NOT_PURCHASED',
        message: 'You can only review products you have purchased'
      });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      where: { userId, productId }
    });
    
    if (existingReview) {
      return res.status(400).json({
        error: true,
        code: 'ALREADY_REVIEWED',
        message: 'You have already reviewed this product'
      });
    }
    
    // Create review
    const review = await Review.create({
      userId,
      productId,
      rating,
      title,
      body,
      images: images || []
    });
    
    // Get full review with user
    const fullReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    
    return res.status(201).json({
      error: false,
      message: 'Review added successfully',
      review: fullReview
    });
  } catch (error) {
    console.error('Add product review error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while adding product review'
    });
  }
};

// Update product review
const updateProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    const { rating, title, body, images } = req.body;
    
    // Find review
    const review = await Review.findOne({
      where: { id: reviewId, userId }
    });
    
    if (!review) {
      return res.status(404).json({
        error: true,
        code: 'REVIEW_NOT_FOUND',
        message: 'Review not found or not owned by user'
      });
    }
    
    // Validate rating if provided
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_RATING',
        message: 'Rating must be between 1 and 5'
      });
    }
    
    // Update review
    await review.update({
      rating: rating || review.rating,
      title: title || review.title,
      body: body || review.body,
      images: images || review.images,
      updatedAt: new Date()
    });
    
    // Get updated review with user
    const updatedReview = await Review.findByPk(review.id, {
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name']
        }
      ]
    });
    
    return res.status(200).json({
      error: false,
      message: 'Review updated successfully',
      review: updatedReview
    });
  } catch (error) {
    console.error('Update product review error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating product review'
    });
  }
};

// Delete product review
const deleteProductReview = async (req, res) => {
  try {
    const userId = req.user.id;
    const { reviewId } = req.params;
    
    // Find review
    const review = await Review.findOne({
      where: { id: reviewId, userId }
    });
    
    if (!review) {
      return res.status(404).json({
        error: true,
        code: 'REVIEW_NOT_FOUND',
        message: 'Review not found or not owned by user'
      });
    }
    
    // Delete review
    await review.destroy();
    
    return res.status(200).json({
      error: false,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete product review error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while deleting product review'
    });
  }
};

module.exports = {
  getProductReviews,
  addProductReview,
  updateProductReview,
  deleteProductReview
};