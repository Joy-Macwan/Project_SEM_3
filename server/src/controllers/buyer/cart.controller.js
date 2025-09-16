const { User, Product, ProductImage, Cart, CartItem } = require('../../database/allModels');

// Get cart
const getCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find or create cart
    let [cart, created] = await Cart.findOrCreate({
      where: { userId },
      defaults: { userId }
    });
    
    // Get cart items with product details
    const cartItems = await CartItem.findAll({
      where: { cartId: cart.id },
      include: [
        {
          model: Product,
          include: [
            {
              model: ProductImage,
              limit: 1
            }
          ]
        }
      ]
    });
    
    // Calculate total
    let total = 0;
    const items = cartItems.map(item => {
      const subtotal = item.quantity * parseFloat(item.Product.price);
      total += subtotal;
      
      return {
        id: item.id,
        productId: item.productId,
        quantity: item.quantity,
        price: parseFloat(item.Product.price),
        subtotal,
        product: {
          id: item.Product.id,
          title: item.Product.title,
          price: parseFloat(item.Product.price),
          condition: item.Product.condition,
          brand: item.Product.brand,
          model: item.Product.model,
          image: item.Product.ProductImages && item.Product.ProductImages.length > 0 
            ? item.Product.ProductImages[0].url 
            : null
        }
      };
    });
    
    return res.status(200).json({
      error: false,
      cart: {
        id: cart.id,
        items,
        total
      }
    });
  } catch (error) {
    console.error('Get cart error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while fetching cart'
    });
  }
};

// Add to cart
const addToCart = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity = 1 } = req.body;
    
    if (!productId) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_PRODUCT_ID',
        message: 'Product ID is required'
      });
    }
    
    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({
        error: true,
        code: 'INVALID_QUANTITY',
        message: 'Quantity must be greater than 0'
      });
    }
    
    // Check if product exists and is published
    const product = await Product.findOne({
      where: { id: productId, status: 'published' }
    });
    
    if (!product) {
      return res.status(404).json({
        error: true,
        code: 'PRODUCT_NOT_FOUND',
        message: 'Product not found or not available'
      });
    }
    
    // Check if product has enough stock
    if (product.quantity < quantity) {
      return res.status(400).json({
        error: true,
        code: 'INSUFFICIENT_STOCK',
        message: `Only ${product.quantity} items available`
      });
    }
    
    // Find or create cart
    let [cart, created] = await Cart.findOrCreate({
      where: { userId },
      defaults: { userId }
    });
    
    // Check if product already in cart
    let cartItem = await CartItem.findOne({
      where: { cartId: cart.id, productId }
    });
    
    if (cartItem) {
      // Update quantity
      const newQuantity = cartItem.quantity + quantity;
      
      // Check if new quantity exceeds stock
      if (newQuantity > product.quantity) {
        return res.status(400).json({
          error: true,
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${product.quantity} items available`
        });
      }
      
      await cartItem.update({ quantity: newQuantity });
    } else {
      // Add new item
      cartItem = await CartItem.create({
        cartId: cart.id,
        productId,
        quantity
      });
    }
    
    // Get updated cart
    return await getCart(req, res);
  } catch (error) {
    console.error('Add to cart error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while adding to cart'
    });
  }
};

// Update cart item
const updateCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    const { quantity } = req.body;
    
    if (!quantity && quantity !== 0) {
      return res.status(400).json({
        error: true,
        code: 'MISSING_QUANTITY',
        message: 'Quantity is required'
      });
    }
    
    // Find cart
    const cart = await Cart.findOne({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        error: true,
        code: 'CART_NOT_FOUND',
        message: 'Cart not found'
      });
    }
    
    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id: itemId, cartId: cart.id },
      include: [{ model: Product }]
    });
    
    if (!cartItem) {
      return res.status(404).json({
        error: true,
        code: 'ITEM_NOT_FOUND',
        message: 'Cart item not found'
      });
    }
    
    // If quantity is 0, remove item
    if (quantity === 0) {
      await cartItem.destroy();
    } else {
      // Check if quantity exceeds stock
      if (quantity > cartItem.Product.quantity) {
        return res.status(400).json({
          error: true,
          code: 'INSUFFICIENT_STOCK',
          message: `Only ${cartItem.Product.quantity} items available`
        });
      }
      
      // Update quantity
      await cartItem.update({ quantity });
    }
    
    // Get updated cart
    return await getCart(req, res);
  } catch (error) {
    console.error('Update cart item error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while updating cart item'
    });
  }
};

// Remove cart item
const removeCartItem = async (req, res) => {
  try {
    const userId = req.user.id;
    const { itemId } = req.params;
    
    // Find cart
    const cart = await Cart.findOne({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        error: true,
        code: 'CART_NOT_FOUND',
        message: 'Cart not found'
      });
    }
    
    // Find cart item
    const cartItem = await CartItem.findOne({
      where: { id: itemId, cartId: cart.id }
    });
    
    if (!cartItem) {
      return res.status(404).json({
        error: true,
        code: 'ITEM_NOT_FOUND',
        message: 'Cart item not found'
      });
    }
    
    // Remove item
    await cartItem.destroy();
    
    // Get updated cart
    return await getCart(req, res);
  } catch (error) {
    console.error('Remove cart item error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while removing cart item'
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Find cart
    const cart = await Cart.findOne({
      where: { userId }
    });
    
    if (!cart) {
      return res.status(404).json({
        error: true,
        code: 'CART_NOT_FOUND',
        message: 'Cart not found'
      });
    }
    
    // Remove all items
    await CartItem.destroy({
      where: { cartId: cart.id }
    });
    
    return res.status(200).json({
      error: false,
      message: 'Cart cleared successfully',
      cart: {
        id: cart.id,
        items: [],
        total: 0
      }
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    return res.status(500).json({
      error: true,
      code: 'SERVER_ERROR',
      message: 'An error occurred while clearing cart'
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};