const { Wishlist, Product, ProductImage } = require('../../database/models');

// Get wishlist
const getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find wishlist items
    const wishlistItems = await Wishlist.findAll({
      where: { userId },
      include: [
        {
          model: Product,
          include: [
            {
              model: ProductImage,
              as: 'images',
              limit: 1
            }
          ]
        }
      ]
    });
    
    return res.status(200).json({
      error: false,
      wishlist: wishlistItems
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching wishlist'
    });
  }
};

// Add to wishlist
const addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_PRODUCT_ID',
        message: 'Product ID is required'
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
    
    // Check if product already in wishlist
    const existingItem = await Wishlist.findOne({
      where: { userId, productId }
    });
    
    if (existingItem) {
      return res.status(400).json({
        error: true,
        code: 'ALREADY_IN_WISHLIST',
        message: 'Product already in wishlist'
      });
    }
    
    // Add to wishlist
    await Wishlist.create({
      userId,
      productId
    });
    
    return res.status(201).json({
      error: false,
      message: 'Product added to wishlist'
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while adding to wishlist'
    });
  }
};

// Remove from wishlist
const removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    
    // Find wishlist item
    const wishlistItem = await Wishlist.findOne({
      where: { userId, productId }
    });
    
    if (!wishlistItem) {
      return res.status(404).json({
        error: true,
        code: 'ITEM_NOT_FOUND',
        message: 'Product not found in wishlist'
      });
    }
    
    // Remove from wishlist
    await wishlistItem.destroy();
    
    return res.status(200).json({
      error: false,
      message: 'Product removed from wishlist'
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while removing from wishlist'
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist
};