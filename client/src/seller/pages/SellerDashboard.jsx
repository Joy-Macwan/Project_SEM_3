import React, { useState, useEffect } from 'react';
import SellerLayout from '../components/SellerLayout';

// Sample dashboard stats (in a real app, these would come from an API)
const SAMPLE_STATS = {
  products: {
    total: 48,
    active: 35,
    outOfStock: 5,
    draft: 8
  },
  orders: {
    total: 124,
    pending: 12,
    processing: 5,
    shipped: 107
  },
  sales: {
    today: 2150,
    thisWeek: 12480,
    thisMonth: 42750
  },
  returns: {
    total: 8,
    pending: 2,
    approved: 6
  }
};

const SellerDashboard = () => {
  const [stats, setStats] = useState(SAMPLE_STATS);
  const [loading, setLoading] = useState(false);
  
  // In a real app, fetch dashboard stats from an API
  useEffect(() => {
    // Sample API call (commented out)
    // const fetchDashboardStats = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await sellerApi.getDashboardStats();
    //     setStats(response.data);
    //   } catch (error) {
    //     console.error('Error fetching dashboard stats:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // 
    // fetchDashboardStats();
    
    // For demo purposes, we'll just use the sample data
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <p className="text-3xl font-bold mt-2">{stats.products.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Active:</span>
                <span>{stats.products.active}</span>
              </div>
              <div className="flex justify-between">
                <span>Out of Stock:</span>
                <span className="text-yellow-600 font-medium">{stats.products.outOfStock}</span>
              </div>
              <div className="flex justify-between">
                <span>Draft:</span>
                <span>{stats.products.draft}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Orders</h3>
            <p className="text-3xl font-bold mt-2">{stats.orders.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="text-yellow-600 font-medium">{stats.orders.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing:</span>
                <span>{stats.orders.processing}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipped:</span>
                <span>{stats.orders.shipped}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Sales</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.sales.thisMonth)}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Today:</span>
                <span>{formatCurrency(stats.sales.today)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Week:</span>
                <span>{formatCurrency(stats.sales.thisWeek)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Returns</h3>
            <p className="text-3xl font-bold mt-2">{stats.returns.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="text-yellow-600 font-medium">{stats.returns.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Approved:</span>
                <span>{stats.returns.approved}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Orders</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12345</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Pending
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$129.99</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12344</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        Shipped
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$89.99</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#12343</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Alice Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        Processing
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">$259.99</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/seller/orders" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                View all orders
              </a>
            </div>
          </div>
          
          {/* Low Stock Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Alerts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">iPhone 12 Pro (Refurbished)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IP12P-REF</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Restock
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">MacBook Air M1 (Used)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MBA-M1-USD</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Restock
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Samsung Galaxy S21 (Refurbished)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SGS21-REF</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 font-medium">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Restock
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/seller/inventory" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                View inventory
              </a>
            </div>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
};

export default SellerDashboard;