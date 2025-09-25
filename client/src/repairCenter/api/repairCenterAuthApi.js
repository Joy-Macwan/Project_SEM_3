import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create an axios instance specifically for auth operations
const authApi = axios.create({
  baseURL: `${API_URL}/repair-center/auth`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Auth API functions
const repairCenterAuthApi = {
  // Register a new repair center
  register: async (userData) => {
    try {
      const response = await authApi.post('/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Login as a repair center
  login: async (credentials) => {
    try {
      const response = await authApi.post('/login', credentials);
      
      if (response.data.accessToken) {
        localStorage.setItem('repairCenterAccessToken', response.data.accessToken);
      }
      
      if (response.data.refreshToken) {
        localStorage.setItem('repairCenterRefreshToken', response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Refresh access token
  refresh: async (refreshToken) => {
    try {
      const response = await authApi.post('/refresh', { refreshToken });
      
      if (response.data.accessToken) {
        localStorage.setItem('repairCenterAccessToken', response.data.accessToken);
      }
      
      if (response.data.refreshToken) {
        localStorage.setItem('repairCenterRefreshToken', response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Logout
  logout: async (refreshToken) => {
    try {
      const response = await authApi.post('/logout', { refreshToken });
      localStorage.removeItem('repairCenterAccessToken');
      localStorage.removeItem('repairCenterRefreshToken');
      return response.data;
    } catch (error) {
      // Still clear tokens even if API call fails
      localStorage.removeItem('repairCenterAccessToken');
      localStorage.removeItem('repairCenterRefreshToken');
      throw error.response?.data || error;
    }
  },

  // Submit KYC information
  submitKyc: async (kycData) => {
    try {
      const token = localStorage.getItem('repairCenterAccessToken');
      const response = await authApi.post('/kyc', kycData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Get current KYC status
  getKycStatus: async () => {
    try {
      const token = localStorage.getItem('repairCenterAccessToken');
      const response = await authApi.get('/kyc', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Request password reset
  forgotPassword: async (email) => {
    try {
      const response = await authApi.post('/forgot-password', { email });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Reset password with token
  resetPassword: async (token, newPassword) => {
    try {
      const response = await authApi.post('/reset-password', { token, newPassword });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Update account information
  updateAccount: async (userData) => {
    try {
      const token = localStorage.getItem('repairCenterAccessToken');
      const response = await authApi.put('/account', userData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('repairCenterAccessToken');
      const response = await authApi.post('/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  }
};

export default repairCenterAuthApi;