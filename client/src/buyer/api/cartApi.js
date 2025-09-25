import buyerApi from './buyerApi';

export const cartApi = {
  // Get current user's cart
  getCart: async () => {
    const response = await buyerApi.get('/cart');
    return response.data;
  },
  
  // Add item to cart
  addToCart: async (productId, quantity = 1) => {
    const response = await buyerApi.post('/cart', { productId, quantity });
    return response.data;
  },
  
  // Update cart item quantity
  updateCartItem: async (cartItemId, quantity) => {
    const response = await buyerApi.put(`/cart/${cartItemId}`, { quantity });
    return response.data;
  },
  
  // Remove item from cart
  removeFromCart: async (cartItemId) => {
    const response = await buyerApi.delete(`/cart/${cartItemId}`);
    return response.data;
  },
  
  // Clear cart
  clearCart: async () => {
    const response = await buyerApi.delete('/cart');
    return response.data;
  },
  
  // Apply coupon to cart
  applyCoupon: async (couponCode) => {
    const response = await buyerApi.post('/cart/coupon', { code: couponCode });
    return response.data;
  },
  
  // Remove coupon from cart
  removeCoupon: async () => {
    const response = await buyerApi.delete('/cart/coupon');
    return response.data;
  }
};

export default cartApi;