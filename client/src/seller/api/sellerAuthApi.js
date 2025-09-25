import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Create axios instance without auth interceptors
const authApi = axios.create({
  baseURL: `${API_URL}/seller/auth`,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Storage keys
const ACCESS_TOKEN_KEY = 'sellerAccessToken';
const REFRESH_TOKEN_KEY = 'sellerRefreshToken';
const USER_INFO_KEY = 'sellerUserInfo';

// Authentication helper functions
export const getSellerToken = () => localStorage.getItem(ACCESS_TOKEN_KEY);

export const getSellerRefreshToken = () => localStorage.getItem(REFRESH_TOKEN_KEY);

export const getSellerUserInfo = () => {
  const userInfoStr = localStorage.getItem(USER_INFO_KEY);
  return userInfoStr ? JSON.parse(userInfoStr) : null;
};

export const setSellerAuthData = (accessToken, refreshToken, userInfo) => {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(userInfo));
};

export const clearSellerAuthData = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
};

// Authentication API calls
export const loginSeller = async (email, password) => {
  try {
    const response = await authApi.post('/login', { email, password });
    const { accessToken, refreshToken, user } = response.data;
    
    setSellerAuthData(accessToken, refreshToken, user);
    
    return { success: true, user };
  } catch (error) {
    console.error('Login error:', error);
    
    let errorMessage = 'An error occurred during login';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const registerSeller = async (sellerData) => {
  try {
    const response = await authApi.post('/register', sellerData);
    return { success: true, data: response.data };
  } catch (error) {
    console.error('Registration error:', error);
    
    let errorMessage = 'An error occurred during registration';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const refreshSellerToken = async () => {
  try {
    const refreshToken = getSellerRefreshToken();
    
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }
    
    const response = await authApi.post('/refresh', { refreshToken });
    const { accessToken, newRefreshToken } = response.data;
    
    // Update tokens in storage
    localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
    
    if (newRefreshToken) {
      localStorage.setItem(REFRESH_TOKEN_KEY, newRefreshToken);
    }
    
    return accessToken;
  } catch (error) {
    console.error('Token refresh error:', error);
    clearSellerAuthData();
    throw error;
  }
};

export const logoutSeller = async () => {
  try {
    const refreshToken = getSellerRefreshToken();
    
    if (refreshToken) {
      // Notify the server about the logout
      await authApi.post('/logout', { refreshToken });
    }
    
    // Clear local storage regardless of server response
    clearSellerAuthData();
    
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    
    // Still clear local storage even if server request fails
    clearSellerAuthData();
    
    return { success: false, error: 'Error during logout' };
  }
};

export const forgotPassword = async (email) => {
  try {
    await authApi.post('/forgot-password', { email });
    return { success: true };
  } catch (error) {
    console.error('Forgot password error:', error);
    
    let errorMessage = 'An error occurred while processing your request';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    await authApi.post('/reset-password', { token, newPassword });
    return { success: true };
  } catch (error) {
    console.error('Reset password error:', error);
    
    let errorMessage = 'An error occurred while resetting your password';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const token = getSellerToken();
    
    if (!token) {
      throw new Error('Not authenticated');
    }
    
    await authApi.post('/change-password', 
      { currentPassword, newPassword },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return { success: true };
  } catch (error) {
    console.error('Change password error:', error);
    
    let errorMessage = 'An error occurred while changing your password';
    if (error.response) {
      errorMessage = error.response.data.message || errorMessage;
    }
    
    return { success: false, error: errorMessage };
  }
};

export default {
  loginSeller,
  registerSeller,
  refreshSellerToken,
  logoutSeller,
  forgotPassword,
  resetPassword,
  changePassword,
  getSellerToken,
  getSellerRefreshToken,
  getSellerUserInfo,
  setSellerAuthData,
  clearSellerAuthData
};