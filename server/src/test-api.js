// API Test Script
const axios = require('axios');

// Base URL
const baseURL = 'http://localhost:5000/api';

// Test buyer endpoints
const testBuyerEndpoints = async () => {
  try {
    console.log('Testing Buyer Endpoints:');
    
    // Registration
    console.log('1. Testing buyer registration...');
    const registerResponse = await axios.post(`${baseURL}/buyer/auth/register`, {
      name: 'Test Buyer',
      email: 'testbuyer@example.com',
      password: 'password123'
    });
    console.log('Registration response:', registerResponse.status, registerResponse.data);
    
    // Login
    console.log('2. Testing buyer login...');
    const loginResponse = await axios.post(`${baseURL}/buyer/auth/login`, {
      email: 'testbuyer@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.status, loginResponse.data);
    
    // Store tokens
    const accessToken = loginResponse.data.accessToken;
    const refreshToken = loginResponse.data.refreshToken;
    
    // Get products
    console.log('3. Testing get products...');
    const productsResponse = await axios.get(`${baseURL}/buyer/products`);
    console.log('Products response:', productsResponse.status, productsResponse.data.products?.length || 0);
    
    // Get product details
    if (productsResponse.data.products && productsResponse.data.products.length > 0) {
      const productId = productsResponse.data.products[0].id;
      console.log(`4. Testing get product details for ID ${productId}...`);
      const productResponse = await axios.get(`${baseURL}/buyer/products/${productId}`);
      console.log('Product details response:', productResponse.status);
    }
    
    // Add to cart (requires authentication)
    console.log('5. Testing add to cart...');
    try {
      const cartResponse = await axios.post(
        `${baseURL}/buyer/cart/add`,
        {
          productId: 1, // Assuming product ID 1 exists
          quantity: 1
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Add to cart response:', cartResponse.status);
    } catch (error) {
      console.log('Add to cart error:', error.response?.status, error.response?.data);
    }
    
    console.log('Buyer endpoint tests completed\n');
  } catch (error) {
    console.error('Buyer endpoint test error:', error.response?.status, error.response?.data || error.message);
  }
};

// Test seller endpoints
const testSellerEndpoints = async () => {
  try {
    console.log('Testing Seller Endpoints:');
    
    // Registration
    console.log('1. Testing seller registration...');
    const registerResponse = await axios.post(`${baseURL}/seller/auth/register`, {
      name: 'Test Seller',
      email: 'testseller@example.com',
      password: 'password123',
      businessName: 'Test Seller Business',
      businessAddress: '123 Test Street',
      taxId: '123456789',
      contactPhone: '123-456-7890'
    });
    console.log('Registration response:', registerResponse.status, registerResponse.data);
    
    // Login
    console.log('2. Testing seller login...');
    const loginResponse = await axios.post(`${baseURL}/seller/auth/login`, {
      email: 'testseller@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.status, loginResponse.data);
    
    // Store tokens
    const accessToken = loginResponse.data.accessToken;
    const refreshToken = loginResponse.data.refreshToken;
    
    // Get seller products
    console.log('3. Testing get seller products...');
    try {
      const productsResponse = await axios.get(
        `${baseURL}/seller/products`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Products response:', productsResponse.status, productsResponse.data.products?.length || 0);
    } catch (error) {
      console.log('Get seller products error:', error.response?.status, error.response?.data);
    }
    
    // Create product
    console.log('4. Testing create product...');
    try {
      const createProductResponse = await axios.post(
        `${baseURL}/seller/products`,
        {
          title: 'Test Product',
          description: 'This is a test product',
          price: 99.99,
          condition: 'new',
          category: 'Electronics',
          brand: 'Test Brand',
          model: 'Test Model',
          quantity: 10
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Create product response:', createProductResponse.status);
      
      // Store product ID for later tests
      const productId = createProductResponse.data.product.id;
      
      // Update product
      console.log(`5. Testing update product for ID ${productId}...`);
      const updateProductResponse = await axios.put(
        `${baseURL}/seller/products/${productId}`,
        {
          price: 89.99,
          quantity: 5
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Update product response:', updateProductResponse.status);
      
      // Delete product
      console.log(`6. Testing delete product for ID ${productId}...`);
      const deleteProductResponse = await axios.delete(
        `${baseURL}/seller/products/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Delete product response:', deleteProductResponse.status);
    } catch (error) {
      console.log('Product management error:', error.response?.status, error.response?.data);
    }
    
    console.log('Seller endpoint tests completed\n');
  } catch (error) {
    console.error('Seller endpoint test error:', error.response?.status, error.response?.data || error.message);
  }
};

// Test repair center endpoints
const testRepairCenterEndpoints = async () => {
  try {
    console.log('Testing Repair Center Endpoints:');
    
    // Registration
    console.log('1. Testing repair center registration...');
    const registerResponse = await axios.post(`${baseURL}/repair-center/auth/register`, {
      name: 'Test Repair Center',
      email: 'testrepair@example.com',
      password: 'password123',
      businessName: 'Test Repair Business',
      businessAddress: '123 Repair Street',
      taxId: '987654321',
      contactPhone: '123-456-7890',
      serviceRadius: 25.0
    });
    console.log('Registration response:', registerResponse.status, registerResponse.data);
    
    // Login
    console.log('2. Testing repair center login...');
    const loginResponse = await axios.post(`${baseURL}/repair-center/auth/login`, {
      email: 'testrepair@example.com',
      password: 'password123'
    });
    console.log('Login response:', loginResponse.status, loginResponse.data);
    
    // Store tokens
    const accessToken = loginResponse.data.accessToken;
    const refreshToken = loginResponse.data.refreshToken;
    
    // Get repair requests
    console.log('3. Testing get repair requests...');
    try {
      const repairRequestsResponse = await axios.get(
        `${baseURL}/repair-center/repair-requests`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Repair requests response:', repairRequestsResponse.status, repairRequestsResponse.data.repairRequests?.length || 0);
    } catch (error) {
      console.log('Get repair requests error:', error.response?.status, error.response?.data);
    }
    
    console.log('Repair center endpoint tests completed\n');
  } catch (error) {
    console.error('Repair center endpoint test error:', error.response?.status, error.response?.data || error.message);
  }
};

// Test admin endpoints
const testAdminEndpoints = async () => {
  try {
    console.log('Testing Admin Endpoints:');
    
    // Login with default admin credentials
    console.log('1. Testing admin login...');
    const loginResponse = await axios.post(`${baseURL}/admin/auth/login`, {
      email: 'admin@example.com',
      password: 'admin123'
    });
    console.log('Login response:', loginResponse.status, loginResponse.data);
    
    // Store tokens
    const accessToken = loginResponse.data.accessToken;
    const refreshToken = loginResponse.data.refreshToken;
    
    // Get users
    console.log('2. Testing get users...');
    try {
      const usersResponse = await axios.get(
        `${baseURL}/admin/users`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        }
      );
      console.log('Users response:', usersResponse.status, usersResponse.data.users?.length || 0);
    } catch (error) {
      console.log('Get users error:', error.response?.status, error.response?.data);
    }
    
    console.log('Admin endpoint tests completed\n');
  } catch (error) {
    console.error('Admin endpoint test error:', error.response?.status, error.response?.data || error.message);
  }
};

// Run all tests
const runAllTests = async () => {
  try {
    console.log('Starting API endpoint tests...\n');
    
    await testBuyerEndpoints();
    await testSellerEndpoints();
    await testRepairCenterEndpoints();
    await testAdminEndpoints();
    
    console.log('All API endpoint tests completed');
  } catch (error) {
    console.error('Test runner error:', error);
  }
};

// Run the tests
runAllTests();