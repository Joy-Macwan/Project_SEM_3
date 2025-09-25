import React from 'react';
import { useNavigate } from 'react-router-dom';

const RoleSelectionPage = () => {
  const navigate = useNavigate();

  const roles = [
    {
      id: 'buyer',
      title: 'Buyer',
      description: 'Browse and purchase products, manage orders',
      icon: '🛒',
      color: 'bg-blue-500 hover:bg-blue-600',
      path: '/buyer'
    },
    {
      id: 'seller',
      title: 'Seller',
      description: 'Sell products, manage inventory and orders',
      icon: '🏪',
      color: 'bg-green-500 hover:bg-green-600',
      path: '/seller'
    },
    {
      id: 'repairCenter',
      title: 'Repair Center',
      description: 'Provide repair services, manage appointments',
      icon: '🔧',
      color: 'bg-orange-500 hover:bg-orange-600',
      path: '/repair-center'
    },
    {
      id: 'admin',
      title: 'Admin',
      description: 'Manage platform, users, and system settings',
      icon: '⚙️',
      color: 'bg-purple-500 hover:bg-purple-600',
      path: '/admin'
    }
  ];

  const handleRoleSelect = (role) => {
    navigate(role.path);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Repair, Reuse, Reduce
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Welcome to our sustainable e-commerce platform
          </p>
          <p className="text-lg text-gray-500">
            Choose your role to get started
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roles.map((role) => (
            <div
              key={role.id}
              onClick={() => handleRoleSelect(role)}
              className="bg-white rounded-xl shadow-lg p-6 cursor-pointer transform transition-all duration-200 hover:scale-105 hover:shadow-xl"
            >
              <div className="text-center">
                <div className="text-4xl mb-4">{role.icon}</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {role.title}
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  {role.description}
                </p>
                <button
                  className={`w-full py-2 px-4 rounded-lg text-white font-medium transition-colors duration-200 ${role.color}`}
                >
                  Continue as {role.title}
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            New to our platform? You can register after selecting your role.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RoleSelectionPage;