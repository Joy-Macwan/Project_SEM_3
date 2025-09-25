import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance with credentials support
const api = axios.create({
  baseURL: `${API_URL}/repair-center`,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add interceptor to include the auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('repairCenterAccessToken');
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
        const refreshToken = localStorage.getItem('repairCenterRefreshToken');
        
        if (!refreshToken) {
          // No refresh token, logout
          window.location.href = '/repair-center/login';
          return Promise.reject(error);
        }
        
        // Attempt to refresh the token
        const response = await axios.post(`${API_URL}/repair-center/auth/refresh-token`, { refreshToken });
        
        if (response.data && response.data.accessToken) {
          // Update tokens in storage
          localStorage.setItem('repairCenterAccessToken', response.data.accessToken);
          
          if (response.data.refreshToken) {
            localStorage.setItem('repairCenterRefreshToken', response.data.refreshToken);
          }
          
          // Update Authorization header and retry the original request
          originalRequest.headers.Authorization = `Bearer ${response.data.accessToken}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        // Failed to refresh token, logout
        localStorage.removeItem('repairCenterAccessToken');
        localStorage.removeItem('repairCenterRefreshToken');
        window.location.href = '/repair-center/login';
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

// Repair Requests API
const repairRequestsApi = {
  getRequests: (params) => api.get('/repair-requests', { params }),
  getRequest: (id) => api.get(`/repair-requests/${id}`),
  acceptRequest: (id) => api.post(`/repair-requests/${id}/accept`),
  rejectRequest: (id, reason) => api.post(`/repair-requests/${id}/reject`, { reason }),
  updateStatus: (id, status, notes) => api.put(`/repair-requests/${id}/status`, { status, notes }),
  completeRepair: (id, repairData) => api.post(`/repair-requests/${id}/complete`, repairData)
};

// Quotes API
const quotesApi = {
  getQuotes: (params) => api.get('/quotes', { params }),
  getQuote: (id) => api.get(`/quotes/${id}`),
  createQuote: (repairRequestId, quoteData) => api.post('/quotes', { repairRequestId, ...quoteData }),
  updateQuote: (id, quoteData) => api.put(`/quotes/${id}`, quoteData)
};

// Combine all APIs
const repairCenterApi = {
  auth: authApi,
  repairRequests: repairRequestsApi,
  quotes: quotesApi
};

export default repairCenterApi;