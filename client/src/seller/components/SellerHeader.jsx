import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSellerAuth } from '../hooks/useSellerAuth';

const SellerHeader = () => {
  const { logout, user } = useSellerAuth();
  const location = useLocation();
  
  // Helper function to get current page title
  const getPageTitle = () => {
    const path = location.pathname;
    
    if (path.includes('/seller/dashboard')) return 'Dashboard';
    if (path.includes('/seller/products')) return 'Product Management';
    if (path.includes('/seller/orders')) return 'Orders';
    if (path.includes('/seller/inventory')) return 'Inventory';
    if (path.includes('/seller/payouts')) return 'Payouts';
    if (path.includes('/seller/returns')) return 'Returns';
    if (path.includes('/seller/messages')) return 'Messages';
    if (path.includes('/seller/settings')) return 'Settings';
    
    return 'Seller Portal';
  };
  
  return (
    <header className="bg-white shadow">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">{getPageTitle()}</h1>
        
        <div className="flex items-center space-x-4">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-gray-700 mr-2">
                {user.email || 'Seller'}
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

export default SellerHeader;