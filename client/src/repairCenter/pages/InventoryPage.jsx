import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RepairCenterLayout from '../components/RepairCenterLayout';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockInventory = [
        {
          id: 1,
          name: 'iPhone 12 Display Assembly',
          sku: 'IP12-DISP-BLK',
          category: 'display',
          brand: 'Apple',
          compatibleModels: ['iPhone 12', 'iPhone 12 Pro'],
          price: 89.99,
          cost: 65.00,
          quantity: 12,
          minQuantity: 3,
          location: 'A1-03',
          status: 'in_stock'
        },
        {
          id: 2,
          name: 'Samsung Galaxy S21 Battery',
          sku: 'SG21-BAT',
          category: 'battery',
          brand: 'Samsung',
          compatibleModels: ['Galaxy S21', 'Galaxy S21+'],
          price: 39.99,
          cost: 25.00,
          quantity: 8,
          minQuantity: 5,
          location: 'B2-12',
          status: 'in_stock'
        },
        {
          id: 3,
          name: 'MacBook Pro Retina Display 2019',
          sku: 'MBP-DISP-19',
          category: 'display',
          brand: 'Apple',
          compatibleModels: ['MacBook Pro 13" 2019', 'MacBook Pro 13" 2020'],
          price: 349.99,
          cost: 280.00,
          quantity: 2,
          minQuantity: 1,
          location: 'C3-05',
          status: 'low_stock'
        },
        {
          id: 4,
          name: 'iPad Pro 12.9" Charging Port',
          sku: 'IP-PRO-CHRG',
          category: 'charging',
          brand: 'Apple',
          compatibleModels: ['iPad Pro 12.9" 2018', 'iPad Pro 12.9" 2020'],
          price: 29.99,
          cost: 18.00,
          quantity: 0,
          minQuantity: 2,
          location: 'A2-08',
          status: 'out_of_stock'
        },
        {
          id: 5,
          name: 'Dell XPS 13 Keyboard',
          sku: 'DL-XPS-KB-13',
          category: 'keyboard',
          brand: 'Dell',
          compatibleModels: ['XPS 13 9310', 'XPS 13 9300'],
          price: 79.99,
          cost: 55.00,
          quantity: 4,
          minQuantity: 2,
          location: 'D1-15',
          status: 'in_stock'
        },
        {
          id: 6,
          name: 'HP Spectre x360 Hinge',
          sku: 'HP-SP-HING',
          category: 'hinge',
          brand: 'HP',
          compatibleModels: ['Spectre x360 13"', 'Spectre x360 15"'],
          price: 49.99,
          cost: 30.00,
          quantity: 3,
          minQuantity: 2,
          location: 'D2-07',
          status: 'in_stock'
        },
        {
          id: 7,
          name: 'OnePlus 9 Pro Camera Module',
          sku: 'OP9-CAM',
          category: 'camera',
          brand: 'OnePlus',
          compatibleModels: ['OnePlus 9 Pro'],
          price: 59.99,
          cost: 42.00,
          quantity: 1,
          minQuantity: 1,
          location: 'B3-10',
          status: 'low_stock'
        }
      ];
      
      setInventory(mockInventory);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Get unique categories from inventory
  const categories = ['all', ...new Set(inventory.map(item => item.category))];
  
  // Filter inventory based on selected filters and search query
  const filteredInventory = inventory.filter(item => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'low_stock' && item.quantity <= item.minQuantity && item.quantity > 0) ||
      (filter === 'out_of_stock' && item.quantity === 0) ||
      (filter === 'in_stock' && item.quantity > item.minQuantity);
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.compatibleModels.some(model => model.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return matchesFilter && matchesCategory && matchesSearch;
  });
  
  // Status badge component
  const StatusBadge = ({ status, quantity, minQuantity }) => {
    const badgeClasses = {
      in_stock: 'bg-green-100 text-green-800',
      low_stock: 'bg-yellow-100 text-yellow-800',
      out_of_stock: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      in_stock: 'In Stock',
      low_stock: 'Low Stock',
      out_of_stock: 'Out of Stock'
    };
    
    // Determine status based on quantity
    let displayStatus = status;
    if (quantity === 0) {
      displayStatus = 'out_of_stock';
    } else if (quantity <= minQuantity) {
      displayStatus = 'low_stock';
    } else {
      displayStatus = 'in_stock';
    }
    
    return (
      <span className={`${badgeClasses[displayStatus]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {statusText[displayStatus]}
      </span>
    );
  };
  
  return (
    <RepairCenterLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Parts Inventory</h1>
          <div className="flex space-x-3">
            <Link
              to="/repair-center/inventory/new"
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Add New Part
            </Link>
            <button
              className="border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 font-medium py-2 px-4 rounded-md"
              onClick={() => alert('Order parts functionality')}
            >
              Order Parts
            </button>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {/* Search and filter controls */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 sm:flex sm:items-center sm:justify-between">
            <div className="flex-1 min-w-0">
              <div className="max-w-lg w-full relative">
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
            <div className="mt-4 sm:mt-0 sm:ml-4 flex space-x-3">
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Categories</option>
                {categories
                  .filter(cat => cat !== 'all')
                  .map(category => (
                    <option key={category} value={category} className="capitalize">
                      {category.replace('_', ' ')}
                    </option>
                  ))
                }
              </select>
              
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Stock Status</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
            </div>
          </div>
          
          {/* Inventory table */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">Loading inventory...</p>
            </div>
          ) : filteredInventory.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No inventory items found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Part Info
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compatible With
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Quantity
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-gray-900">{item.name}</div>
                        <div className="text-sm text-gray-500">SKU: {item.sku}</div>
                        <div className="text-sm text-gray-500">Location: {item.location}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900 capitalize">{item.category.replace('_', ' ')}</div>
                        <div className="text-sm text-gray-500">{item.brand}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {item.compatibleModels.map((model, index) => (
                            <span key={index} className="inline-block mr-1">
                              {model}{index < item.compatibleModels.length - 1 ? ',' : ''}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">${item.price.toFixed(2)}</div>
                        <div className="text-sm text-gray-500">Cost: ${item.cost.toFixed(2)}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="font-medium text-gray-900">{item.quantity}</span>
                        <span className="text-xs text-gray-500 ml-1">(Min: {item.minQuantity})</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge 
                          status={item.status} 
                          quantity={item.quantity} 
                          minQuantity={item.minQuantity} 
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/repair-center/inventory/${item.id}`} 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/repair-center/inventory/${item.id}/edit`} 
                          className="text-indigo-600 hover:text-indigo-900"
                        >
                          Edit
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </RepairCenterLayout>
  );
};

export default InventoryPage;