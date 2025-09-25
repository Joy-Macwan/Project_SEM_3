import { createContext, useState, useEffect } from 'react';
import buyerAuthApi from '../api/buyerAuthApi';

export const BuyerAuthContext = createContext();

export const BuyerAuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load user from localStorage on initial render
  useEffect(() => {
    const loadUser = async () => {
      try {
        const token = localStorage.getItem('buyerToken');
        
        if (token) {
          // Validate token by getting current user
          const userData = await buyerAuthApi.getCurrentUser();
          setCurrentUser(userData);
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error('Failed to load user:', err);
        // Clear invalid tokens
        localStorage.removeItem('buyerToken');
        localStorage.removeItem('buyerRefreshToken');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await buyerAuthApi.register(userData);
      
      // Store tokens
      localStorage.setItem('buyerToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('buyerRefreshToken', response.refreshToken);
      }
      
      // Set user state
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await buyerAuthApi.login(credentials);
      
      // Store tokens
      localStorage.setItem('buyerToken', response.token);
      if (response.refreshToken) {
        localStorage.setItem('buyerRefreshToken', response.refreshToken);
      }
      
      // Set user state
      setCurrentUser(response.user);
      setIsAuthenticated(true);
      
      return response;
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = async () => {
    setLoading(true);
    
    try {
      // Call logout API to invalidate token on server
      await buyerAuthApi.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      // Clear local storage and state regardless of API success
      localStorage.removeItem('buyerToken');
      localStorage.removeItem('buyerRefreshToken');
      setCurrentUser(null);
      setIsAuthenticated(false);
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedUser = await buyerAuthApi.updateProfile(profileData);
      setCurrentUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (passwordData) => {
    setLoading(true);
    setError(null);
    
    try {
      return await buyerAuthApi.changePassword(passwordData);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to change password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    
    try {
      return await buyerAuthApi.forgotPassword(email);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to process forgot password request');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    
    try {
      return await buyerAuthApi.resetPassword(token, newPassword);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Context value
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    register,
    login,
    logout,
    updateProfile,
    changePassword,
    forgotPassword,
    resetPassword,
  };

  return (
    <BuyerAuthContext.Provider value={value}>
      {children}
    </BuyerAuthContext.Provider>
  );
};

export default BuyerAuthProvider;