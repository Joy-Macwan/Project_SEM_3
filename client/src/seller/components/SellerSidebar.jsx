import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SellerSidebar = () => {
  const location = useLocation();
  
  // Helper function to check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Navigation items
  const navItems = [
    { path: '/seller/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/seller/products', label: 'Products', icon: '📦' },
    { path: '/seller/orders', label: 'Orders', icon: '🛒' },
    { path: '/seller/inventory', label: 'Inventory', icon: '🔖' },
    { path: '/seller/returns', label: 'Returns', icon: '↩️' },
    { path: '/seller/payouts', label: 'Payouts', icon: '💰' },
    { path: '/seller/messages', label: 'Messages', icon: '💬' },
    { path: '/seller/settings', label: 'Settings', icon: '⚙️' },
  ];
  
  return (
    <div className="h-screen bg-gray-800 text-white w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-xl font-bold">Seller Portal</h2>
        <p className="text-gray-400 text-sm">Repair • Reuse • Reduce</p>
      </div>
      
      <nav className="mt-5">
        <ul className="space-y-2 px-2">
          {navItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-lg ${
                  isActive(item.path)
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default SellerSidebar;