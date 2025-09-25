import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useRepairCenterAuth } from '../hooks/useRepairCenterAuth';
import RepairCenterLayout from '../components/RepairCenterLayout';

const RepairsListPage = () => {
  const { user } = useRepairCenterAuth();
  const [repairs, setRepairs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockRepairs = [
        {
          id: 1,
          trackingNumber: 'RP-2023-001',
          customerName: 'John Doe',
          deviceType: 'Smartphone',
          brand: 'Samsung',
          model: 'Galaxy S21',
          issue: 'Cracked Screen',
          status: 'pending',
          receivedDate: '2023-06-10',
          estimatedCompletionDate: '2023-06-15'
        },
        {
          id: 2,
          trackingNumber: 'RP-2023-002',
          customerName: 'Jane Smith',
          deviceType: 'Laptop',
          brand: 'Dell',
          model: 'XPS 13',
          issue: 'Battery not charging',
          status: 'in_progress',
          receivedDate: '2023-06-09',
          estimatedCompletionDate: '2023-06-14'
        },
        {
          id: 3,
          trackingNumber: 'RP-2023-003',
          customerName: 'Alice Johnson',
          deviceType: 'Tablet',
          brand: 'Apple',
          model: 'iPad Pro',
          issue: 'Won\'t power on',
          status: 'diagnosed',
          receivedDate: '2023-06-08',
          estimatedCompletionDate: '2023-06-13'
        },
        {
          id: 4,
          trackingNumber: 'RP-2023-004',
          customerName: 'Bob Wilson',
          deviceType: 'Smartphone',
          brand: 'Apple',
          model: 'iPhone 12',
          issue: 'Water damage',
          status: 'waiting_for_parts',
          receivedDate: '2023-06-07',
          estimatedCompletionDate: '2023-06-17'
        },
        {
          id: 5,
          trackingNumber: 'RP-2023-005',
          customerName: 'Carol Brown',
          deviceType: 'Desktop',
          brand: 'Custom Build',
          model: 'Gaming PC',
          issue: 'Graphics card failure',
          status: 'completed',
          receivedDate: '2023-06-05',
          estimatedCompletionDate: '2023-06-10',
          completedDate: '2023-06-09'
        }
      ];
      
      setRepairs(mockRepairs);
      setLoading(false);
    }, 1000);
  }, []);

  // Filter repairs based on selected filter and search query
  const filteredRepairs = repairs.filter(repair => {
    const matchesFilter = filter === 'all' || repair.status === filter;
    const matchesSearch = 
      repair.trackingNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.deviceType.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      repair.model.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      diagnosed: 'bg-purple-100 text-purple-800',
      waiting_for_parts: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800'
    };
    
    const statusText = {
      pending: 'Pending',
      in_progress: 'In Progress',
      diagnosed: 'Diagnosed',
      waiting_for_parts: 'Waiting for Parts',
      completed: 'Completed',
      cancelled: 'Cancelled'
    };
    
    return (
      <span className={`${badgeClasses[status]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium`}>
        {statusText[status]}
      </span>
    );
  };

  return (
    <RepairCenterLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Repair Requests</h1>
          <Link
            to="/repair-center/repairs/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            Create New Repair
          </Link>
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
                  placeholder="Search repairs..."
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
            <div className="mt-4 sm:mt-0 sm:ml-4">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="diagnosed">Diagnosed</option>
                <option value="waiting_for_parts">Waiting for Parts</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
          
          {/* Repairs table */}
          {loading ? (
            <div className="p-8 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              <p className="mt-2 text-gray-500">Loading repairs...</p>
            </div>
          ) : filteredRepairs.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No repair requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Tracking #
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Device
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Issue
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Received Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Est. Completion
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRepairs.map((repair) => (
                    <tr key={repair.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                        <Link to={`/repair-center/repairs/${repair.id}`}>
                          {repair.trackingNumber}
                        </Link>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {repair.customerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {repair.brand} {repair.model}
                        <div className="text-xs text-gray-400">{repair.deviceType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {repair.issue}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <StatusBadge status={repair.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {repair.receivedDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {repair.estimatedCompletionDate}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <Link 
                          to={`/repair-center/repairs/${repair.id}`} 
                          className="text-blue-600 hover:text-blue-900 mr-4"
                        >
                          View
                        </Link>
                        <Link 
                          to={`/repair-center/repairs/${repair.id}/edit`} 
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

export default RepairsListPage;