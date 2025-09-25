import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import AdminTable from '../components/AdminTable';
import ConfirmationModal from '../components/ConfirmationModal';

// Sample user data (in a real app, this would come from an API)
const SAMPLE_USERS = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    role: 'buyer',
    status: 'active',
    kycStatus: 'N/A',
    createdAt: '2025-01-15T10:30:00Z',
    lastLogin: '2025-09-14T08:45:00Z',
  },
  {
    id: 2,
    name: 'Jane Smith',
    email: 'jane.smith@example.com',
    role: 'seller',
    status: 'active',
    kycStatus: 'approved',
    createdAt: '2025-02-20T14:15:00Z',
    lastLogin: '2025-09-13T16:22:00Z',
  },
  {
    id: 3,
    name: 'Tech Repair Inc.',
    email: 'contact@techrepair.com',
    role: 'repairCenter',
    status: 'active',
    kycStatus: 'approved',
    createdAt: '2025-03-10T09:00:00Z',
    lastLogin: '2025-09-15T09:10:00Z',
  },
  {
    id: 4,
    name: 'Alice Johnson',
    email: 'alice.j@example.com',
    role: 'buyer',
    status: 'active',
    kycStatus: 'N/A',
    createdAt: '2025-04-05T11:45:00Z',
    lastLogin: '2025-09-10T14:30:00Z',
  },
  {
    id: 5,
    name: 'Bob\'s Electronics',
    email: 'bob@bobselectronics.com',
    role: 'seller',
    status: 'suspended',
    kycStatus: 'approved',
    createdAt: '2025-01-30T16:20:00Z',
    lastLogin: '2025-08-25T10:15:00Z',
  },
  {
    id: 6,
    name: 'Quick Fix Repairs',
    email: 'info@quickfixrepairs.com',
    role: 'repairCenter',
    status: 'pending',
    kycStatus: 'pending',
    createdAt: '2025-09-01T08:30:00Z',
    lastLogin: 'N/A',
  },
  {
    id: 7,
    name: 'Charlie Brown',
    email: 'charlie.b@example.com',
    role: 'buyer',
    status: 'active',
    kycStatus: 'N/A',
    createdAt: '2025-05-12T13:40:00Z',
    lastLogin: '2025-09-12T18:05:00Z',
  },
  {
    id: 8,
    name: 'Delta Tech',
    email: 'sales@deltatech.com',
    role: 'seller',
    status: 'active',
    kycStatus: 'approved',
    createdAt: '2025-06-22T10:10:00Z',
    lastLogin: '2025-09-14T11:30:00Z',
  },
  {
    id: 9,
    name: 'Eve Wilson',
    email: 'eve.w@example.com',
    role: 'buyer',
    status: 'active',
    kycStatus: 'N/A',
    createdAt: '2025-07-18T15:50:00Z',
    lastLogin: '2025-09-08T09:45:00Z',
  },
  {
    id: 10,
    name: 'Frank\'s Repair Shop',
    email: 'frank@repairshop.com',
    role: 'repairCenter',
    status: 'active',
    kycStatus: 'approved',
    createdAt: '2025-08-03T12:25:00Z',
    lastLogin: '2025-09-15T08:20:00Z',
  },
];

const UsersPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showSuspendModal, setShowSuspendModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [suspensionReason, setSuspensionReason] = useState('');
  
  const navigate = useNavigate();
  
  // In a real app, fetch users from an API with pagination
  useEffect(() => {
    // Simulating API call with filters
    const fetchUsers = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call with query params
        // const response = await api.get('/admin/users', {
        //   params: {
        //     q: searchTerm,
        //     role: roleFilter !== 'all' ? roleFilter : undefined,
        //     status: statusFilter !== 'all' ? statusFilter : undefined,
        //     page: currentPage,
        //     limit: 10
        //   }
        // });
        
        // For this demo, we'll filter the sample data client-side
        let filteredUsers = [...SAMPLE_USERS];
        
        if (searchTerm) {
          filteredUsers = filteredUsers.filter(
            (user) =>
              user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
              user.email.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        if (roleFilter !== 'all') {
          filteredUsers = filteredUsers.filter((user) => user.role === roleFilter);
        }
        
        if (statusFilter !== 'all') {
          filteredUsers = filteredUsers.filter((user) => user.status === statusFilter);
        }
        
        // Simulate pagination
        setTotalPages(Math.ceil(filteredUsers.length / 10));
        const paginatedUsers = filteredUsers.slice((currentPage - 1) * 10, currentPage * 10);
        
        setUsers(paginatedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [searchTerm, roleFilter, statusFilter, currentPage]);
  
  // Format date to readable string
  const formatDate = (dateString) => {
    if (dateString === 'N/A') return 'N/A';
    
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };
  
  // Table columns configuration
  const columns = [
    {
      key: 'name',
      label: 'Name',
      sortable: true,
      render: (user) => (
        <div>
          <div className="font-medium text-gray-900">{user.name}</div>
          <div className="text-gray-500">{user.email}</div>
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      sortable: true,
      render: (user) => {
        const roleBadgeClasses = {
          buyer: 'bg-blue-100 text-blue-800',
          seller: 'bg-green-100 text-green-800',
          repairCenter: 'bg-purple-100 text-purple-800',
          admin: 'bg-red-100 text-red-800',
        };
        
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              roleBadgeClasses[user.role] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.role === 'repairCenter' ? 'Repair Center' : user.role.charAt(0).toUpperCase() + user.role.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (user) => {
        const statusBadgeClasses = {
          active: 'bg-green-100 text-green-800',
          suspended: 'bg-red-100 text-red-800',
          pending: 'bg-yellow-100 text-yellow-800',
        };
        
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              statusBadgeClasses[user.status] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'kycStatus',
      label: 'KYC Status',
      sortable: true,
      render: (user) => {
        if (user.role === 'buyer') return <span className="text-gray-500">N/A</span>;
        
        const kycBadgeClasses = {
          approved: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          rejected: 'bg-red-100 text-red-800',
        };
        
        return (
          <span
            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
              kycBadgeClasses[user.kycStatus] || 'bg-gray-100 text-gray-800'
            }`}
          >
            {user.kycStatus.charAt(0).toUpperCase() + user.kycStatus.slice(1)}
          </span>
        );
      },
    },
    {
      key: 'createdAt',
      label: 'Registered',
      sortable: true,
      render: (user) => formatDate(user.createdAt),
    },
    {
      key: 'lastLogin',
      label: 'Last Login',
      sortable: true,
      render: (user) => formatDate(user.lastLogin),
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (user) => (
        <div className="flex space-x-2">
          <button
            className="text-indigo-600 hover:text-indigo-900"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/admin/users/${user.id}`);
            }}
          >
            View
          </button>
          {user.status === 'active' ? (
            <button
              className="text-red-600 hover:text-red-900"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedUser(user);
                setShowSuspendModal(true);
              }}
            >
              Suspend
            </button>
          ) : user.status === 'suspended' ? (
            <button
              className="text-green-600 hover:text-green-900"
              onClick={(e) => {
                e.stopPropagation();
                // In a real app, this would call an API to reactivate the user
                alert(`Reactivate user: ${user.name}`);
              }}
            >
              Reactivate
            </button>
          ) : null}
        </div>
      ),
    },
  ];
  
  // Handle user row click
  const handleUserClick = (user) => {
    navigate(`/admin/users/${user.id}`);
  };
  
  // Handle suspend user confirmation
  const handleSuspendUser = () => {
    if (!selectedUser) return;
    
    // In a real app, this would call an API to suspend the user
    console.log(`Suspending user ${selectedUser.id} for reason: ${suspensionReason}`);
    
    // Update local state to reflect the change
    const updatedUsers = users.map((user) =>
      user.id === selectedUser.id ? { ...user, status: 'suspended' } : user
    );
    
    setUsers(updatedUsers);
    setShowSuspendModal(false);
    setSuspensionReason('');
    setSelectedUser(null);
  };
  
  return (
    <AdminLayout>
      <div className="container mx-auto">
        <div className="bg-white shadow rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
            <h2 className="text-xl font-bold text-gray-900">Users</h2>
            
            <div className="mt-4 md:mt-0">
              <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                {/* Search Input */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search users..."
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Role Filter */}
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                >
                  <option value="all">All Roles</option>
                  <option value="buyer">Buyer</option>
                  <option value="seller">Seller</option>
                  <option value="repairCenter">Repair Center</option>
                  <option value="admin">Admin</option>
                </select>
                
                {/* Status Filter */}
                <select
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="all">All Statuses</option>
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
          </div>
          
          <AdminTable
            columns={columns}
            data={users}
            onRowClick={handleUserClick}
            pagination={true}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            loading={loading}
            noDataMessage="No users found matching your filters."
            rowsPerPage={10}
          />
        </div>
      </div>
      
      {/* Suspend User Modal */}
      <ConfirmationModal
        isOpen={showSuspendModal}
        onClose={() => {
          setShowSuspendModal(false);
          setSuspensionReason('');
          setSelectedUser(null);
        }}
        onConfirm={handleSuspendUser}
        title={`Suspend User: ${selectedUser?.name}`}
        message="Suspending this user will prevent them from logging in or performing any actions on the platform. This action will be logged in the audit trail."
        confirmText="Suspend User"
        cancelText="Cancel"
        type="warning"
        confirmationText={
          <div className="mt-4">
            <label htmlFor="suspension-reason" className="block text-sm font-medium text-gray-700">
              Suspension Reason
            </label>
            <textarea
              id="suspension-reason"
              rows="3"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Enter reason for suspension..."
              value={suspensionReason}
              onChange={(e) => setSuspensionReason(e.target.value)}
            ></textarea>
          </div>
        }
      />
    </AdminLayout>
  );
};

export default UsersPage;