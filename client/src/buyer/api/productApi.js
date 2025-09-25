import buyerApi from './buyerApi';

export const productApi = {
  // Get featured products for homepage
  getFeaturedProducts: async () => {
    const response = await buyerApi.get('/products/featured');
    return response.data;
  },
  
  // Get all product categories
  getCategories: async () => {
    const response = await buyerApi.get('/products/categories');
    return response.data;
  },
  
  // Get products by category
  getProductsByCategory: async (categoryId, page = 1, limit = 12, sort = 'newest') => {
    const response = await buyerApi.get(`/products/category/${categoryId}`, {
      params: { page, limit, sort }
    });
    return response.data;
  },
  
  // Search products
  searchProducts: async (query, page = 1, limit = 12, filters = {}) => {
    const response = await buyerApi.get('/products/search', {
      params: {
        q: query,
        page,
        limit,
        ...filters
      }
    });
    return response.data;
  },
  
  // Get product details
  getProductDetails: async (productId) => {
    const response = await buyerApi.get(`/products/${productId}`);
    return response.data;
  },
  
  // Get product reviews
  getProductReviews: async (productId, page = 1, limit = 10) => {
    const response = await buyerApi.get(`/products/${productId}/reviews`, {
      params: { page, limit }
    });
    return response.data;
  },
  
  // Get related products
  getRelatedProducts: async (productId, limit = 4) => {
    const response = await buyerApi.get(`/products/${productId}/related`, {
      params: { limit }
    });
    return response.data;
  }
};

export default productApi;