import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with baseURL
const buyerApi = axios.create({
  baseURL: `${API_URL}/buyer`,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

// Request interceptor to add auth token to requests
buyerApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('buyerToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
buyerApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('buyerRefreshToken');
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }
        
        const response = await axios.post(`${API_URL}/buyer/auth/refresh-token`, {
          refreshToken,
        });
        
        const { token } = response.data;
        
        // Store the new token
        localStorage.setItem('buyerToken', token);
        
        // Update the authorization header
        originalRequest.headers.Authorization = `Bearer ${token}`;
        
        // Retry the original request
        return buyerApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, logout user
        localStorage.removeItem('buyerToken');
        localStorage.removeItem('buyerRefreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default buyerApi;