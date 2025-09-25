import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials support
const api = axios.create({
  baseURL: `${API_URL}/seller`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('sellerAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept 401 responses to refresh token or logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem('sellerRefreshToken');
        
        if (!refreshToken) {
          // No refresh token, logout
          window.location.href = '/seller/login';
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/seller/auth/refresh-token`, { refreshToken });
        
        if (response.data && response.data.accessToken) {
          // Update tokens in storage
          localStorage.setItem('sellerAccessToken', response.data.accessToken);
          
          if (response.data.refreshToken) {
            localStorage.setItem('sellerRefreshToken', response.data.refreshToken);
          }
          
          // Update Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Failed to refresh token, logout
        localStorage.removeItem('sellerAccessToken');
        localStorage.removeItem('sellerRefreshToken');
        window.location.href = '/seller/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
const authApi = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  refresh: (refreshToken) => api.post('/auth/refresh', { refreshToken }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  submitKyc: (kycData) => api.post('/auth/kyc', kycData),
  getKycStatus: () => api.get('/auth/kyc')
};

// Products API
const productsApi = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  uploadImages: (id, formData) => api.post(`/products/${id}/images`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  }),
  bulkUpload: (formData) => api.post('/products/bulk-upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
};

// Orders API
const ordersApi = {
  getOrders: (params) => api.get('/orders', { params }),
  getOrder: (id) => api.get(`/orders/${id}`),
  acceptOrder: (id) => api.post(`/orders/${id}/accept`),
  rejectOrder: (id, reason) => api.post(`/orders/${id}/reject`, { reason }),
  shipOrder: (id, shipmentData) => api.post(`/orders/${id}/ship`, shipmentData),
  getPackingSlip: (id) => api.get(`/orders/${id}/packing-slip`),
  partialShip: (id, shipmentData) => api.post(`/orders/${id}/partial-ship`, shipmentData)
};

// Combine all APIs
const sellerApi = {
  auth: authApi,
  products: productsApi,
  orders: ordersApi
};

export default sellerApi;