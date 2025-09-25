import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials support
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include the auth token in requests
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

// Intercept 401 responses to refresh token or logout
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If error is 401 and we haven't tried to refresh the token yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Get the refresh token
        const refreshToken = localStorage.getItem('adminRefreshToken');
        
        if (!refreshToken) {
          // No refresh token, logout
          window.location.href = '/admin/login';
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/admin/auth/refresh`, { refreshToken });
        
        if (response.data && response.data.accessToken) {
          // Update tokens in storage
          localStorage.setItem('adminAccessToken', response.data.accessToken);
          
          if (response.data.refreshToken) {
            localStorage.setItem('adminRefreshToken', response.data.refreshToken);
          }
          
          // Update Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Failed to refresh token, logout
        localStorage.removeItem('adminAccessToken');
        localStorage.removeItem('adminRefreshToken');
        window.location.href = '/admin/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

const adminAuthApi = {
  /**
   * Login as admin
   * @param {Object} credentials - { email, password }
   * @returns {Promise}
   */
  login: (credentials) => {
    return api.post('/admin/auth/login', credentials);
  },
  
  /**
   * Verify MFA code
   * @param {string} userId - User ID
   * @param {string} code - MFA verification code
   * @returns {Promise}
   */
  verifyMfa: (userId, code) => {
    return api.post('/admin/auth/verify-mfa', { userId, code });
  },
  
  /**
   * Refresh access token
   * @param {string} refreshToken
   * @returns {Promise}
   */
  refresh: (refreshToken) => {
    return api.post('/admin/auth/refresh', { refreshToken });
  },
  
  /**
   * Logout admin
   * @param {string} refreshToken
   * @returns {Promise}
   */
  logout: (refreshToken) => {
    return api.post('/admin/auth/logout', { refreshToken });
  },
  
  /**
   * Setup MFA for admin account
   * @returns {Promise} - { qrCode, secret }
   */
  setupMfa: () => {
    return api.get('/admin/auth/mfa-setup');
  },
  
  /**
   * Enable MFA for admin account
   * @param {string} code - MFA verification code
   * @returns {Promise}
   */
  enableMfa: (code) => {
    return api.post('/admin/auth/mfa-enable', { code });
  },
  
  /**
   * Disable MFA for admin account
   * @returns {Promise}
   */
  disableMfa: () => {
    return api.post('/admin/auth/mfa-disable');
  }
};

export default adminAuthApi;