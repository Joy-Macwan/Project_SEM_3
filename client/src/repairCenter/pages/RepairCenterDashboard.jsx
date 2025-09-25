import React, { useState, useEffect } from 'react';
import RepairCenterLayout from '../components/RepairCenterLayout';

// Sample dashboard stats (in a real app, these would come from an API)
const SAMPLE_STATS = {
  repairs: {
    total: 58,
    pending: 12,
    inProgress: 15,
    completed: 31
  },
  appointments: {
    today: 6,
    upcoming: 15,
    totalMonth: 42
  },
  revenue: {
    today: 1250,
    thisWeek: 6780,
    thisMonth: 24650
  },
  inventory: {
    parts: 126,
    lowStock: 8
  }
};

const RepairCenterDashboard = () => {
  const [stats, setStats] = useState(SAMPLE_STATS);
  const [loading, setLoading] = useState(false);
  
  // In a real app, fetch dashboard stats from an API
  useEffect(() => {
    // Sample API call (commented out)
    // const fetchDashboardStats = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await repairCenterApi.getDashboardStats();
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
    <RepairCenterLayout>
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Stats Cards */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Repairs</h3>
            <p className="text-3xl font-bold mt-2">{stats.repairs.total}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Pending:</span>
                <span className="text-yellow-600 font-medium">{stats.repairs.pending}</span>
              </div>
              <div className="flex justify-between">
                <span>In Progress:</span>
                <span className="text-blue-600 font-medium">{stats.repairs.inProgress}</span>
              </div>
              <div className="flex justify-between">
                <span>Completed:</span>
                <span>{stats.repairs.completed}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Appointments</h3>
            <p className="text-3xl font-bold mt-2">{stats.appointments.upcoming}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Today:</span>
                <span className="text-green-600 font-medium">{stats.appointments.today}</span>
              </div>
              <div className="flex justify-between">
                <span>This Month:</span>
                <span>{stats.appointments.totalMonth}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Revenue</h3>
            <p className="text-3xl font-bold mt-2">{formatCurrency(stats.revenue.thisMonth)}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Today:</span>
                <span>{formatCurrency(stats.revenue.today)}</span>
              </div>
              <div className="flex justify-between">
                <span>This Week:</span>
                <span>{formatCurrency(stats.revenue.thisWeek)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900">Inventory</h3>
            <p className="text-3xl font-bold mt-2">{stats.inventory.parts}</p>
            <div className="mt-4 text-sm text-gray-500">
              <div className="flex justify-between">
                <span>Low Stock Items:</span>
                <span className="text-red-600 font-medium">{stats.inventory.lowStock}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          {/* Today's Appointments */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Today's Appointments</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Time
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">9:00 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">John Doe</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">iPhone 12</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Screen Replacement</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">11:30 AM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Jane Smith</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MacBook Pro</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Battery Replacement</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">2:15 PM</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Alice Johnson</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Samsung Galaxy S21</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Diagnostic</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/repair-center/appointments" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                View all appointments
              </a>
            </div>
          </div>
          
          {/* Pending Repairs */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Pending Repairs</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Repair ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#R12345</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Mark Wilson</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">iPad Pro</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        Waiting Parts
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#R12344</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Sarah Davis</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Dell XPS 13</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        In Progress
                      </span>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#R12343</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Robert Brown</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Google Pixel 5</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-purple-100 text-purple-800">
                        Awaiting Approval
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/repair-center/repairs" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                View all repairs
              </a>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mt-8">
          {/* Low Stock Parts */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Low Stock Parts</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Part Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      SKU
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Compatible Devices
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Stock
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reorder Level
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">iPhone 12 LCD Screen</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">IP12-LCD</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">iPhone 12, iPhone 12 Pro</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">2</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Order
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">MacBook Pro Battery (2019-2020)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MBP-BAT-19</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">MacBook Pro 13" (2019-2020)</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500 font-medium">1</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Order
                      </button>
                    </td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">Samsung Galaxy S21 Charging Port</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">SGS21-CHRG</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Samsung Galaxy S21, S21+</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-yellow-500 font-medium">3</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">5</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button className="text-indigo-600 hover:text-indigo-900">
                        Order
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 text-center">
              <a href="/repair-center/inventory" className="text-indigo-600 hover:text-indigo-900 text-sm font-medium">
                View inventory
              </a>
            </div>
          </div>
        </div>
      </div>
    </RepairCenterLayout>
  );
};

export default RepairCenterDashboard;