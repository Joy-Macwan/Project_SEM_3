import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const AdminHeader = () => {
  const { logout, user } = useAuth();
  const location = useLocation();
  
  // Helper function to get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/admin/dashboard')) return 'Dashboard';
    if (path.includes('/admin/users')) return 'User Management';
    if (path.includes('/admin/kyc')) return 'KYC Verification Queue';
    if (path.includes('/admin/products/moderation')) return 'Product Moderation';
    if (path.includes('/admin/repairs')) return 'Repair Requests';
    if (path.includes('/admin/orders')) return 'Orders Management';
    if (path.includes('/admin/payouts')) return 'Payouts';
    if (path.includes('/admin/reports')) return 'Reports & Analytics';
    if (path.includes('/admin/settings')) return 'Platform Settings';
    if (path.includes('/admin/notifications')) return 'Notifications';
    if (path.includes('/admin/audit-logs')) return 'Audit Logs';
    if (path.includes('/admin/system')) return 'System Operations';
    
    return 'Admin Portal';
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {user.email || 'Admin'}
              </span>
              <button
                onClick={logout}
                className="inline-flex items-center px-3 py-1.5 border border-gray-300 text-xs font-medium rounded shadow-sm text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;