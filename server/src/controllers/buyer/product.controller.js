const { Product, ProductImage, Category, User, Review } = require('../../database/models');
const { Op } = require('sequelize');
const sequelize = require('sequelize');

// Get products with filters, pagination, and sorting
const getProducts = async (req, res) => {
  try {
    const {
      q,
      category,
      condition,
      minPrice,
      maxPrice,
      sellerId,
      sort = 'createdAt_desc',
      page = 1,
      limit = 12,
      location
    } = req.query;
    
    const offset = (parseInt(page) - 1) * parseInt(limit);
    
    // Build where conditions
    const whereConditions = {
      status: ['published', 'approved'] // Only show published and approved products
    };
    
    // Search by query
    if (q) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${q}%` } },
        { description: { [Op.like]: `%${q}%` } }
      ];
    }
    
    // Filter by category
    if (category) {
      whereConditions.categoryId = category;
    }
    
    // Filter by condition
    if (condition) {
      whereConditions.condition = condition;
    }
    
    // Filter by price range
    if (minPrice) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.gte]: parseFloat(minPrice)
      };
    }
    
    if (maxPrice) {
      whereConditions.price = {
        ...whereConditions.price,
        [Op.lte]: parseFloat(maxPrice)
      };
    }
    
    // Filter by seller
    if (sellerId) {
      whereConditions.sellerId = sellerId;
    }
    
    // Prepare sort order
    const [sortField, sortDirection] = sort.split('_');
    const order = [[sortField, sortDirection.toUpperCase()]];
    
    // Query products
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereConditions,
      order,
      limit: parseInt(limit),
      offset
    });
    
    // Calculate pagination
    const totalPages = Math.ceil(count / parseInt(limit));
    
    return res.status(200).json({
      error: false,
      products,
      pagination: {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching products'
    });
  }
};

// Get product by ID
const getProductById = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find product
    const product = await Product.findByPk(productId, {
      include: [
        {
          model: ProductImage,
          as: 'images'
        },
        {
          model: Category,
          as: 'category'
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'role']
        },
        {
          model: Review,
          as: 'reviews',
          include: [
            {
              model: User,
              as: 'user',
              attributes: ['id', 'name']
            }
          ]
        }
      ]
    });
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Calculate average rating
    let avgRating = 0;
    if (product.reviews && product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      avgRating = totalRating / product.reviews.length;
    }
    
    // Add average rating to product
    const productData = product.toJSON();
    productData.avgRating = avgRating;
    productData.reviewCount = product.reviews.length;
    
    return res.status(200).json({
      error: false,
      product: productData
    });
  } catch (error) {
    console.error('Get product by ID error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching product'
    });
  }
};

// Get related products
const getRelatedProducts = async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find product to get category
    const product = await Product.findByPk(productId);
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Find related products in same category
    const relatedProducts = await Product.findAll({
      where: {
        id: { [Op.ne]: productId }, // Exclude current product
        categoryId: product.categoryId,
        status: 'active'
      },
      limit: 8,
      include: [
        {
          model: ProductImage,
          as: 'images',
          limit: 1
        },
        {
          model: User,
          as: 'seller',
          attributes: ['id', 'name', 'role']
        }
      ]
    });
    
    return res.status(200).json({
      error: false,
      relatedProducts
    });
  } catch (error) {
    console.error('Get related products error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching related products'
    });
  }
};

// Get categories
const getCategories = async (req, res) => {
  try {
    // Find all categories
    const categories = await Category.findAll({
      attributes: ['id', 'name', 'slug', 'parentId'],
      order: [['name', 'ASC']]
    });
    
    return res.status(200).json({
      error: false,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching categories'
    });
  }
};

module.exports = {
  getProducts,
  getProductById,
  getRelatedProducts,
  getCategories
};