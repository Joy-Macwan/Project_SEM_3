import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

export const SellerAuthContext = createContext();

export const SellerAuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('sellerAccessToken');
      
      if (accessToken) {
        try {
          // Check if token is expired
          const decodedToken = jwtDecode(accessToken);
          const currentTime = Date.now() / 1000;
          
          if (decodedToken.exp < currentTime) {
            // Token is expired, try to refresh
            await refreshToken();
          } else {
            // Token is valid
            setUser(decodedToken);
            setIsAuthenticated(true);
          }
        } catch (error) {
          console.error('Invalid token:', error);
          logout();
        }
      }
      
      setLoading(false);
    };
    
    checkAuth();
  }, []);

  // Refresh token function
  const refreshToken = async () => {
    try {
      // This is a placeholder - will be implemented with proper API call
      // const refreshToken = localStorage.getItem('sellerRefreshToken');
      // const response = await sellerAuthApi.refresh(refreshToken);
      
      // For now, just logout as the refresh functionality is not implemented
      logout();
      return false;
    } catch (error) {
      console.error('Error refreshing token:', error);
      logout();
      return false;
    }
  };

  // Login function
  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      // This is a placeholder - will be implemented with proper API call
      // const response = await sellerAuthApi.login(credentials);
      
      // For demo purposes, simulate a successful login
      const mockResponse = {
        success: true,
        accessToken: 'mock_access_token',
        refreshToken: 'mock_refresh_token',
        user: {
          id: 1,
          name: 'Seller User',
          email: credentials.email,
          role: 'seller'
        }
      };
      
      localStorage.setItem('sellerAccessToken', mockResponse.accessToken);
      localStorage.setItem('sellerRefreshToken', mockResponse.refreshToken);
      
      setUser(mockResponse.user);
      setIsAuthenticated(true);
      
      return { success: true };
    } catch (error) {
      console.error('Login error:', error);
      setError('Failed to login. Please try again.');
      return { 
        success: false, 
        error: 'Failed to login' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // This is a placeholder - will be implemented with proper API call
      // const refreshToken = localStorage.getItem('sellerRefreshToken');
      // await sellerAuthApi.logout(refreshToken);
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('sellerAccessToken');
      localStorage.removeItem('sellerRefreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <SellerAuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        refreshToken
      }}
    >
      {children}
    </SellerAuthContext.Provider>
  );
};