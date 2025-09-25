import buyerApi from './buyerApi';

export const buyerAuthApi = {
  register: async (userData) => {
    const response = await buyerApi.post('/auth/register', userData);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await buyerApi.post('/auth/login', credentials);
    return response.data;
  },
  
  forgotPassword: async (email) => {
    const response = await buyerApi.post('/auth/forgot-password', { email });
    return response.data;
  },
  
  resetPassword: async (token, newPassword) => {
    const response = await buyerApi.post('/auth/reset-password', {
      token,
      newPassword
    });
    return response.data;
  },
  
  refreshToken: async (refreshToken) => {
    const response = await buyerApi.post('/auth/refresh-token', { refreshToken });
    return response.data;
  },
  
  logout: async () => {
    const response = await buyerApi.post('/auth/logout');
    return response.data;
  },
  
  getCurrentUser: async () => {
    const response = await buyerApi.get('/profile');
    return response.data;
  },
  
  updateProfile: async (profileData) => {
    const response = await buyerApi.put('/profile', profileData);
    return response.data;
  },
  
  changePassword: async (passwordData) => {
    const response = await buyerApi.post('/profile/change-password', passwordData);
    return response.data;
  }
};

export default buyerAuthApi;