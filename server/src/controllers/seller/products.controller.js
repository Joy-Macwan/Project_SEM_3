const { Product, ProductImage, Seller, Category, ProductCategory } = require('../../database/allModels');
const { Op } = require('sequelize');
const path = require('path');
const fs = require('fs');
const uuid = require('uuid').v4;

// Get all products for a seller
const getSellerProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Get query parameters for filtering and pagination
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;
    const status = req.query.status || null;
    const category = req.query.category || null;
    const search = req.query.search || '';
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order || 'DESC';
    
    // Build where conditions
    const whereConditions = { sellerId: seller.id };
    
    if (status) {
      whereConditions.status = status;
    }
    
    if (search) {
      whereConditions[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ];
    }
    
    // Query products
    const { count, rows: products } = await Product.findAndCountAll({
      where: whereConditions,
      include: [
        {
          model: ProductImage,
          required: false
        }
      ],
      order: [[sortBy, order]],
      limit,
      offset,
      distinct: true
    });
    
    // If category filter is applied, filter results on the application level
    // since we need to check the junction table
    let filteredProducts = products;
    
    if (category) {
      // Get all product IDs in this category
      const categoryProducts = await ProductCategory.findAll({
        include: [
          {
            model: Category,
            where: { 
              [Op.or]: [
                { id: category },
                { slug: category }
              ]
            }
          }
        ]
      });
      
      const categoryProductIds = categoryProducts.map(cp => cp.productId);
      
      // Filter products that belong to the category
      filteredProducts = products.filter(product => 
        categoryProductIds.includes(product.id)
      );
    }
    
    // Calculate total pages
    const totalPages = Math.ceil(count / limit);
    
    return res.status(200).json({
      error: false,
      products: filteredProducts,
      pagination: {
        total: count,
        page,
        limit,
        totalPages
      }
    });
  } catch (error) {
    console.error('Get seller products error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching products'
    });
  }
};

// Get a single product by ID
const getProductById = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Find product
    const product = await Product.findOne({
      where: { 
        id,
        sellerId: seller.id
      },
      include: [
        {
          model: ProductImage,
          required: false
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
    
    // Get product categories
    const productCategories = await ProductCategory.findAll({
      where: { productId: product.id },
      include: [{ model: Category }]
    });
    
    const categories = productCategories.map(pc => pc.Category);
    
    // Add categories to product
    const productData = product.toJSON();
    productData.categories = categories;
    
    return res.status(200).json({
      error: false,
      product: productData
    });
  } catch (error) {
    console.error('Get product error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching product'
    });
  }
};

// Create a new product
const createProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { 
      title, 
      description, 
      price, 
      condition, 
      category, 
      brand, 
      model, 
      quantity,
      categoryIds
    } = req.body;
    
    // Validate required fields
    if (!title || !price || !condition) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_FIELDS',
        message: 'Title, price, and condition are required'
      });
    }
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Check if seller is verified
    if (seller.kycStatus !== 'approved') {
      return res.status(403).json({
        error: true,
        code: 'SELLER_NOT_VERIFIED',
        message: 'Your account must be verified to create products'
      });
    }
    
    // Create product
    const product = await Product.create({
      sellerId: seller.id,
      title,
      description: description || '',
      price,
      condition,
      category: category || 'Electronics', // Default category
      brand: brand || '',
      model: model || '',
      quantity: quantity || 1,
      status: 'pending_approval' // All products start as pending approval
    });
    
    // If category IDs are provided, associate product with categories
    if (categoryIds && Array.isArray(categoryIds) && categoryIds.length > 0) {
      for (const categoryId of categoryIds) {
        // Check if category exists
        const categoryExists = await Category.findByPk(categoryId);
        
        if (categoryExists) {
          await ProductCategory.create({
            productId: product.id,
            categoryId
          });
        }
      }
    }
    
    return res.status(201).json({
      error: false,
      message: 'Product created successfully and is pending approval',
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while creating product'
    });
  }
};

// Update an existing product
const updateProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    const { 
      title, 
      description, 
      price, 
      condition, 
      category, 
      brand, 
      model, 
      quantity,
      categoryIds
    } = req.body;
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Find product
    const product = await Product.findOne({
      where: { 
        id,
        sellerId: seller.id
      }
    });
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Check if product can be updated
    if (['published', 'approved'].includes(product.status)) {
      // If the product is already published or approved, updating it will set it back to pending
      product.status = 'pending_approval';
    } else if (product.status === 'rejected') {
      // If rejected, allow update but keep as pending
      product.status = 'pending_approval';
    }
    
    // Update product
    await product.update({
      title: title || product.title,
      description: description !== undefined ? description : product.description,
      price: price || product.price,
      condition: condition || product.condition,
      category: category || product.category,
      brand: brand !== undefined ? brand : product.brand,
      model: model !== undefined ? model : product.model,
      quantity: quantity !== undefined ? quantity : product.quantity,
      status: product.status // Use the status we determined above
    });
    
    // If category IDs are provided, update product categories
    if (categoryIds && Array.isArray(categoryIds)) {
      // Remove existing category associations
      await ProductCategory.destroy({
        where: { productId: product.id }
      });
      
      // Add new category associations
      for (const categoryId of categoryIds) {
        // Check if category exists
        const categoryExists = await Category.findByPk(categoryId);
        
        if (categoryExists) {
          await ProductCategory.create({
            productId: product.id,
            categoryId
          });
        }
      }
    }
    
    return res.status(200).json({
      error: false,
      message: 'Product updated successfully and is pending approval',
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating product'
    });
  }
};

// Delete a product
const deleteProduct = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Find product
    const product = await Product.findOne({
      where: { 
        id,
        sellerId: seller.id
      }
    });
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Check if product has orders
    const { OrderItem } = require('../../database/allModels');
    const orderItems = await OrderItem.findOne({
      where: { productId: product.id }
    });
    
    if (orderItems) {
      // Don't delete, just mark as unavailable
      await product.update({
        status: 'out_of_stock',
        quantity: 0
      });
      
      return res.status(200).json({
        error: false,
        message: 'Product marked as out of stock due to existing orders'
      });
    }
    
    // Delete product images
    await ProductImage.destroy({
      where: { productId: product.id }
    });
    
    // Delete product category associations
    await ProductCategory.destroy({
      where: { productId: product.id }
    });
    
    // Delete product
    await product.destroy();
    
    return res.status(200).json({
      error: false,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while deleting product'
    });
  }
};

// Upload product images
const uploadProductImages = async (req, res) => {
  try {
    const userId = req.user.id;
    const { id } = req.params;
    
    // Check if files are uploaded
    if (!req.files || Object.keys(req.files).length === 0) {
      return res.status(400).json({
        error: true,
        code: 'NO_FILES',
        message: 'No files were uploaded'
      });
    }
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Find product
    const product = await Product.findOne({
      where: { 
        id,
        sellerId: seller.id
      }
    });
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found'
      });
    }
    
    // Get current images
    const currentImages = await ProductImage.findAll({
      where: { productId: product.id }
    });
    
    // Check if max images reached
    const maxImages = 5;
    if (currentImages.length + Object.keys(req.files).length > maxImages) {
      return res.status(400).json({
        error: true,
        code: 'MAX_IMAGES',
        message: `Maximum of ${maxImages} images allowed per product`
      });
    }
    
    // Save files
    const uploadDir = path.join(__dirname, '../../../uploads/products');
    
    // Create upload directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    const images = [];
    
    // Process each file
    for (const key in req.files) {
      const file = req.files[key];
      
      // Generate unique filename
      const filename = `${uuid()}-${file.name}`;
      const filepath = path.join(uploadDir, filename);
      
      // Move file to upload directory
      await file.mv(filepath);
      
      // Create image record
      const image = await ProductImage.create({
        productId: product.id,
        url: `/uploads/products/${filename}`,
        order: currentImages.length + images.length + 1,
        altText: `${product.title} image ${currentImages.length + images.length + 1}`
      });
      
      images.push(image);
    }
    
    return res.status(200).json({
      error: false,
      message: 'Product images uploaded successfully',
      images
    });
  } catch (error) {
    console.error('Upload product images error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while uploading product images'
    });
  }
};

// Bulk upload products
const bulkUploadProducts = async (req, res) => {
  try {
    const userId = req.user.id;
    const { products } = req.body;
    
    if (!products || !Array.isArray(products) || products.length === 0) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_DATA',
        message: 'Invalid product data'
      });
    }
    
    // Find seller
    const seller = await Seller.findOne({ where: { userId } });
    
    if (!seller) {
      return res.status(404).json({
        error: true,
        code: 'SELLER_NOT_FOUND',
        message: 'Seller profile not found'
      });
    }
    
    // Check if seller is verified
    if (seller.kycStatus !== 'approved') {
      return res.status(403).json({
        error: true,
        code: 'SELLER_NOT_VERIFIED',
        message: 'Your account must be verified to create products'
      });
    }
    
    // Process each product
    const createdProducts = [];
    const errors = [];
    
    for (let i = 0; i < products.length; i++) {
      const productData = products[i];
      
      try {
        // Validate required fields
        if (!productData.title || !productData.price || !productData.condition) {
          errors.push({
            index: i,
            error: 'Missing required fields'
          });
          continue;
        }
        
        // Create product
        const product = await Product.create({
          sellerId: seller.id,
          title: productData.title,
          description: productData.description || '',
          price: productData.price,
          condition: productData.condition,
          category: productData.category || 'Electronics',
          brand: productData.brand || '',
          model: productData.model || '',
          quantity: productData.quantity || 1,
          status: 'pending_approval'
        });
        
        // If category IDs are provided, associate product with categories
        if (productData.categoryIds && Array.isArray(productData.categoryIds) && productData.categoryIds.length > 0) {
          for (const categoryId of productData.categoryIds) {
            // Check if category exists
            const categoryExists = await Category.findByPk(categoryId);
            
            if (categoryExists) {
              await ProductCategory.create({
                productId: product.id,
                categoryId
              });
            }
          }
        }
        
        createdProducts.push(product);
      } catch (error) {
        console.error(`Error creating product at index ${i}:`, error);
        errors.push({
          index: i,
          error: error.message
        });
      }
    }
    
    return res.status(200).json({
      error: false,
      message: `${createdProducts.length} products created successfully`,
      successCount: createdProducts.length,
      errorCount: errors.length,
      errors: errors.length > 0 ? errors : undefined,
      products: createdProducts
    });
  } catch (error) {
    console.error('Bulk upload products error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while processing bulk upload'
    });
  }
};

module.exports = {
  getSellerProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  uploadProductImages,
  bulkUploadProducts
};