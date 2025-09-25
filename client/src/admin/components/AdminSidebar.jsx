import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminSidebar = () => {
  const location = useLocation();
  
  // Helper function to check if a menu item is active
  const isActive = (path) => {
    return location.pathname === path;
  };
  
  // Navigation items
  const navItems = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'Users', icon: '👥' },
    { path: '/admin/kyc', label: 'KYC Queue', icon: '📝' },
    { path: '/admin/products/moderation', label: 'Products', icon: '📦' },
    { path: '/admin/repairs', label: 'Repairs', icon: '🛠️' },
    { path: '/admin/orders', label: 'Orders', icon: '🛒' },
    { path: '/admin/payouts', label: 'Payouts', icon: '💰' },
    { path: '/admin/reports', label: 'Reports', icon: '📊' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
    { path: '/admin/notifications', label: 'Notifications', icon: '🔔' },
    { path: '/admin/audit-logs', label: 'Audit Logs', icon: '📜' },
    { path: '/admin/system', label: 'System', icon: '🖥️' },
  ];
  
  return (
    <div className="h-screen bg-gray-800 text-white w-64 fixed left-0 top-0 overflow-y-auto">
      <div className="p-5 border-b border-gray-700">
        <h2 className="text-xl font-bold">Admin Portal</h2>
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

export default AdminSidebar;