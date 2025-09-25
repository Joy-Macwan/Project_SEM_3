import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with base URL
const api = axios.create({
  baseURL: `${API_URL}/admin`,
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAccessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't already tried to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem('adminRefreshToken');
        if (!refreshToken) {
          // No refresh token, user needs to login again
          return Promise.reject(error);
        }
        
        const res = await axios.post(`${API_URL}/admin/auth/refresh`, { refreshToken });
        
        if (res.data.accessToken) {
          // Save the new tokens
          localStorage.setItem('adminAccessToken', res.data.accessToken);
          localStorage.setItem('adminRefreshToken', res.data.refreshToken);
          
          // Retry the original request with new token
          originalRequest.headers.Authorization = `Bearer ${res.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Refresh failed, redirect to login
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
const authApi = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  verifyMfa: (userId, code) => api.post('/auth/verify-mfa', { userId, code }),
  logout: (refreshToken) => api.post('/auth/logout', { refreshToken }),
  setupMfa: () => api.get('/auth/mfa-setup'),
  enableMfa: (code) => api.post('/auth/mfa-enable', { code }),
  disableMfa: () => api.post('/auth/mfa-disable')
};

// Users API
const usersApi = {
  getUsers: (page = 1, limit = 10, search = '', status = null, role = null) => 
    api.get('/users', { params: { page, limit, search, status, role } }),
  
  getUserById: (userId) => api.get(`/users/${userId}`),
  
  createUser: (userData) => api.post('/users', userData),
  
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData),
  
  resetUserPassword: (userId, newPassword) => 
    api.post(`/users/${userId}/reset-password`, { newPassword }),
  
  deleteUser: (userId) => api.delete(`/users/${userId}`),
  
  getUserActivityLogs: (userId, page = 1, limit = 10) => 
    api.get(`/users/${userId}/activity-logs`, { params: { page, limit } })
};

// Dashboard API
const dashboardApi = {
  getMetrics: () => api.get('/dashboard/metrics'),
  
  getSystemStatus: () => api.get('/dashboard/system-status'),
  
  getSalesStats: (period = 'week') => api.get('/dashboard/sales-stats', { params: { period } })
};

// Combine all APIs
const adminApi = {
  auth: authApi,
  users: usersApi,
  dashboard: dashboardApi
};

export default adminApi;