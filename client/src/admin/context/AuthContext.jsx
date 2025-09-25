import React, { createContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import adminAuthApi from '../api/adminAuth.api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is already authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const accessToken = localStorage.getItem('adminAccessToken');
      
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
      const refreshToken = localStorage.getItem('adminRefreshToken');
      
      if (!refreshToken) {
        throw new Error('No refresh token available');
      }
      
      const response = await adminAuthApi.refresh(refreshToken);
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('adminAccessToken', response.data.accessToken);
        
        if (response.data.refreshToken) {
          localStorage.setItem('adminRefreshToken', response.data.refreshToken);
        }
        
        const decodedToken = jwtDecode(response.data.accessToken);
        setUser(decodedToken);
        setIsAuthenticated(true);
        return true;
      }
      
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
      
      const response = await adminAuthApi.login(credentials);
      const data = response.data;
      
      // Check if MFA is required
      if (data.requireMfa) {
        return { 
          success: false, 
          requireMfa: true, 
          userId: data.userId,
          email: data.email
        };
      }
      
      // If not MFA or MFA already passed, we have tokens
      if (data.accessToken) {
        localStorage.setItem('adminAccessToken', data.accessToken);
        localStorage.setItem('adminRefreshToken', data.refreshToken);
        
        const decodedToken = jwtDecode(data.accessToken);
        setUser(decodedToken);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('Login error:', error);
      setError(error.response?.data?.message || 'Failed to login. Please try again.');
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to login' 
      };
    } finally {
      setLoading(false);
    }
  };

  // Verify MFA
  const verifyMfa = async (userId, code) => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await adminAuthApi.verifyMfa(userId, code);
      
      if (response.data && response.data.accessToken) {
        localStorage.setItem('adminAccessToken', response.data.accessToken);
        localStorage.setItem('adminRefreshToken', response.data.refreshToken);
        
        const decodedToken = jwtDecode(response.data.accessToken);
        setUser(decodedToken);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      return { success: false, error: 'Invalid response from server' };
    } catch (error) {
      console.error('MFA verification error:', error);
      setError(error.response?.data?.message || 'Failed to verify MFA code. Please try again.');
      return { 
        success: false, 
        error: error.response?.data?.message || 'Failed to verify MFA'
      };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('adminRefreshToken');
      
      if (refreshToken) {
        await adminAuthApi.logout(refreshToken);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('adminAccessToken');
      localStorage.removeItem('adminRefreshToken');
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        loading,
        error,
        login,
        logout,
        refreshToken,
        verifyMfa,
        setupMfa: async () => {
          try {
            setLoading(true);
            setError(null);
            
            const response = await adminAuthApi.setupMfa();
            return { success: true, data: response.data };
          } catch (error) {
            console.error('MFA setup error:', error);
            setError(error.response?.data?.message || 'Failed to setup MFA. Please try again.');
            return { success: false, error: error.response?.data?.message || 'Failed to setup MFA' };
          } finally {
            setLoading(false);
          }
        },
        enableMfa: async (code) => {
          try {
            setLoading(true);
            setError(null);
            
            const response = await adminAuthApi.enableMfa(code);
            return { success: true };
          } catch (error) {
            console.error('MFA enable error:', error);
            setError(error.response?.data?.message || 'Failed to enable MFA. Please try again.');
            return { success: false, error: error.response?.data?.message || 'Failed to enable MFA' };
          } finally {
            setLoading(false);
          }
        },
        disableMfa: async () => {
          try {
            setLoading(true);
            setError(null);
            
            const response = await adminAuthApi.disableMfa();
            return { success: true };
          } catch (error) {
            console.error('MFA disable error:', error);
            setError(error.response?.data?.message || 'Failed to disable MFA. Please try again.');
            return { success: false, error: error.response?.data?.message || 'Failed to disable MFA' };
          } finally {
            setLoading(false);
          }
        }
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};