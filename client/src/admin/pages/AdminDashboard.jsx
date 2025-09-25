import React, { useState, useEffect } from 'react';
import AdminLayout from '../components/AdminLayout';

// Sample dashboard stats (in a real app, these would come from an API)
const SAMPLE_STATS = {
  users: {
    total: 1245,
    buyers: 875,
    sellers: 312,
    repairCenters: 58,
    newToday: 12
  },
  orders: {
    total: 856,
    pending: 23,
    processing: 45,
    completed: 788
  },
  products: {
    total: 2345,
    awaitingModeration: 15,
    published: 2290,
    rejected: 40
  },
  repairs: {
    total: 352,
    pending: 18,
    inProgress: 34,
    completed: 300
  },
  revenue: {
    total: 157240,
    today: 2150,
    thisMonth: 48350
  }
};

const AdminDashboard = () => {
  const [stats, setStats] = useState(SAMPLE_STATS);
  const [loading, setLoading] = useState(false);
  
  // In a real app, fetch dashboard stats from an API
  useEffect(() => {
    // Sample API call (commented out)
    // const fetchDashboardStats = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await api.get('/admin/dashboard/stats');
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
    <AdminLayout>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Users</h3>
            <p className="text-3xl font-bold mt-2">{stats.users.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Buyers:</span>
                <span>{stats.users.buyers}</span>
              </div>
              <div className="flex justify-between">
                <span>Sellers:</span>
                <span>{stats.users.sellers}</span>
              </div>
              <div className="flex justify-between">
                <span>Repair Centers:</span>
                <span>{stats.users.repairCenters}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t">
                <span>New Today:</span>
                <span className="text-green-600 font-medium">+{stats.users.newToday}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Orders</h3>
            <p className="text-3xl font-bold mt-2">{stats.orders.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span>{stats.orders.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>Processing:</span>
                <span>{stats.orders.processing}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>{stats.orders.completed}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t">
                <span>Conversion Rate:</span>
                <span>92%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Products</h3>
            <p className="text-3xl font-bold mt-2">{stats.products.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Awaiting Moderation:</span>
                <span className="text-yellow-600 font-medium">{stats.products.awaitingModeration}</span>
              </div>
              <div className="flex justify-between">
                <span>Published:</span>
                <span>{stats.products.published}</span>
              </div>
              <div className="flex justify-between">
                <span>Rejected:</span>
                <span>{stats.products.rejected}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t">
                <span>Approval Rate:</span>
                <span>98%</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.revenue.total)}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Today:</span>
                <span>{formatCurrency(stats.revenue.today)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month:</span>
                <span>{formatCurrency(stats.revenue.thisMonth)}</span>
              </div>
              <div className="flex justify-between mt-2 pt-2 border-t">
                <span>Platform Fees:</span>
                <span>{formatCurrency(stats.revenue.total * 0.15)}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Recent Activity */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Recent Activity</h3>
            <ul className="divide-y">
              <li className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">New Seller KYC Submitted</p>
                    <p className="text-xs text-gray-500">ElectroTech Inc.</p>
                  </div>
                  <span className="text-xs text-gray-500">10 minutes ago</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Product Reported</p>
                    <p className="text-xs text-gray-500">iPhone 12 Pro - Misleading condition</p>
                  </div>
                  <span className="text-xs text-gray-500">1 hour ago</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Refund Requested</p>
                    <p className="text-xs text-gray-500">Order #1234 - $599.99</p>
                  </div>
                  <span className="text-xs text-gray-500">3 hours ago</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">New Repair Center Approved</p>
                    <p className="text-xs text-gray-500">Quick Fix Electronics</p>
                  </div>
                  <span className="text-xs text-gray-500">5 hours ago</span>
                </div>
              </li>
              <li className="py-3">
                <div className="flex justify-between">
                  <div>
                    <p className="text-sm font-medium">Payout Processed</p>
                    <p className="text-xs text-gray-500">TechResell Ltd. - $2,450.75</p>
                  </div>
                  <span className="text-xs text-gray-500">Yesterday</span>
                </div>
              </li>
            </ul>
          </div>
          
          {/* Alerts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">System Alerts</h3>
            <div className="space-y-4">
              <div className="bg-yellow-50 p-4 rounded-md border border-yellow-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-yellow-800">
                      15 products awaiting moderation
                    </h3>
                    <div className="mt-2 text-sm text-yellow-700">
                      <p>
                        Products have been waiting for more than 24 hours.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-md border border-red-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-red-800">
                      3 failed login attempts detected
                    </h3>
                    <div className="mt-2 text-sm text-red-700">
                      <p>
                        Multiple failed login attempts from IP 192.168.1.100.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-blue-800">
                      System backup scheduled
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      <p>
                        Automatic backup scheduled for tonight at 2:00 AM.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;