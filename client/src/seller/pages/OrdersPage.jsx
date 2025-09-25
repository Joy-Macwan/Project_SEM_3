import React, { useState, useEffect } from 'react';
import SellerLayout from '../components/SellerLayout';

// Sample orders data (in a real app, this would come from an API)
const SAMPLE_ORDERS = [
  {
    id: '12345',
    customer: {
      name: 'John Doe',
      email: 'john.doe@example.com'
    },
    date: '2023-10-15',
    status: 'pending',
    total: 129.99,
    items: [
      {
        id: 1,
        name: 'iPhone 12 Pro (Refurbished)',
        quantity: 1,
        price: 699.99
      }
    ],
    shipping: {
      address: '123 Main St, Anytown, US 12345',
      method: 'Standard Shipping',
      trackingNumber: ''
    },
    payment: {
      method: 'Credit Card',
      status: 'completed'
    }
  },
  {
    id: '12344',
    customer: {
      name: 'Jane Smith',
      email: 'jane.smith@example.com'
    },
    date: '2023-10-14',
    status: 'shipped',
    total: 89.99,
    items: [
      {
        id: 2,
        name: 'Samsung Galaxy S21 (Refurbished)',
        quantity: 1,
        price: 599.99
      }
    ],
    shipping: {
      address: '456 Oak Ave, Somecity, US 54321',
      method: 'Express Shipping',
      trackingNumber: 'TRACK123456789'
    },
    payment: {
      method: 'PayPal',
      status: 'completed'
    }
  },
  {
    id: '12343',
    customer: {
      name: 'Alice Johnson',
      email: 'alice.johnson@example.com'
    },
    date: '2023-10-13',
    status: 'processing',
    total: 259.99,
    items: [
      {
        id: 3,
        name: 'MacBook Air M1 (Used)',
        quantity: 1,
        price: 849.99
      }
    ],
    shipping: {
      address: '789 Pine Ln, Othercity, US 67890',
      method: 'Standard Shipping',
      trackingNumber: ''
    },
    payment: {
      method: 'Credit Card',
      status: 'completed'
    }
  },
  {
    id: '12342',
    customer: {
      name: 'Bob Williams',
      email: 'bob.williams@example.com'
    },
    date: '2023-10-12',
    status: 'delivered',
    total: 79.99,
    items: [
      {
        id: 4,
        name: 'iPad Pro 11" (Used)',
        quantity: 1,
        price: 649.99
      }
    ],
    shipping: {
      address: '101 Elm Blvd, Anycity, US 13579',
      method: 'Standard Shipping',
      trackingNumber: 'TRACK987654321'
    },
    payment: {
      method: 'PayPal',
      status: 'completed'
    }
  },
  {
    id: '12341',
    customer: {
      name: 'Charlie Brown',
      email: 'charlie.brown@example.com'
    },
    date: '2023-10-11',
    status: 'cancelled',
    total: 149.99,
    items: [
      {
        id: 5,
        name: 'Dell XPS 13 (Refurbished)',
        quantity: 1,
        price: 899.99
      }
    ],
    shipping: {
      address: '202 Maple Dr, Newtown, US 24680',
      method: 'Express Shipping',
      trackingNumber: ''
    },
    payment: {
      method: 'Credit Card',
      status: 'refunded'
    }
  }
];

const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  // In a real app, fetch orders from an API
  useEffect(() => {
    // Sample API call (commented out)
    // const fetchOrders = async () => {
    //   setLoading(true);
    //   try {
    //     const response = await sellerApi.getOrders();
    //     setOrders(response.data);
    //   } catch (error) {
    //     console.error('Error fetching orders:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // 
    // fetchOrders();
    
    // For demo purposes, we'll just use the sample data
    setLoading(true);
    setTimeout(() => {
      setOrders(SAMPLE_ORDERS);
      setLoading(false);
    }, 500);
  }, []);
  
  // Filter orders based on search term, status, and date
  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.includes(searchTerm) || 
                         order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.customer.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === '' || order.status === statusFilter;
    const matchesDate = dateFilter === '' || order.date === dateFilter;
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    let badgeClass = '';
    let statusText = '';
    
    switch(status) {
      case 'pending':
        badgeClass = 'bg-yellow-100 text-yellow-800';
        statusText = 'Pending';
        break;
      case 'processing':
        badgeClass = 'bg-blue-100 text-blue-800';
        statusText = 'Processing';
        break;
      case 'shipped':
        badgeClass = 'bg-indigo-100 text-indigo-800';
        statusText = 'Shipped';
        break;
      case 'delivered':
        badgeClass = 'bg-green-100 text-green-800';
        statusText = 'Delivered';
        break;
      case 'cancelled':
        badgeClass = 'bg-red-100 text-red-800';
        statusText = 'Cancelled';
        break;
      default:
        badgeClass = 'bg-gray-100 text-gray-800';
        statusText = status;
    }
    
    return (
      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${badgeClass}`}>
        {statusText}
      </span>
    );
  };
  
  // Handle updating order status
  const handleUpdateStatus = (orderId, newStatus) => {
    // In a real app, this would call an API
    // For demo purposes, we'll just update the local state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({ ...prev, status: newStatus }));
    }
  };
  
  // Handle adding tracking information
  const handleAddTracking = (orderId, trackingNumber) => {
    // In a real app, this would call an API
    // For demo purposes, we'll just update the local state
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { 
              ...order, 
              shipping: { 
                ...order.shipping, 
                trackingNumber 
              },
              status: order.status === 'processing' ? 'shipped' : order.status
            } 
          : order
      )
    );
    
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder(prev => ({
        ...prev,
        shipping: {
          ...prev.shipping,
          trackingNumber
        },
        status: prev.status === 'processing' ? 'shipped' : prev.status
      }));
    }
  };
  
  // Open order details modal
  const openOrderDetails = (order) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };
  
  // Close order details modal
  const closeOrderDetails = () => {
    setIsOrderDetailsOpen(false);
  };
  
  // Order Details Modal
  const OrderDetailsModal = () => {
    if (!selectedOrder) return null;
    
    const [trackingNumber, setTrackingNumber] = useState(selectedOrder.shipping.trackingNumber || '');
    
    return (
      <div className="fixed inset-0 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
        <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true" onClick={closeOrderDetails}></div>
          
          <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
          
          <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full md:max-w-2xl">
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900" id="modal-title">
                      Order #{selectedOrder.id}
                    </h3>
                    <StatusBadge status={selectedOrder.status} />
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Customer</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer.name}</p>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.customer.email}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Order Date</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.date}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-500">Items</h4>
                    <div className="mt-2 flow-root">
                      <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                        <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
                          <table className="min-w-full divide-y divide-gray-300">
                            <thead>
                              <tr>
                                <th scope="col" className="py-2 pl-4 pr-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th scope="col" className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Quantity
                                </th>
                                <th scope="col" className="px-3 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                              {selectedOrder.items.map((item) => (
                                <tr key={item.id}>
                                  <td className="py-2 pl-4 pr-3 text-sm text-gray-900">
                                    {item.name}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500">
                                    {item.quantity}
                                  </td>
                                  <td className="px-3 py-2 text-sm text-gray-500 text-right">
                                    {formatCurrency(item.price)}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                            <tfoot>
                              <tr>
                                <th scope="row" colSpan="2" className="pl-4 pr-3 pt-4 text-sm font-semibold text-gray-900 text-right">
                                  Total
                                </th>
                                <td className="pl-3 pr-4 pt-4 text-sm font-semibold text-gray-900 text-right">
                                  {formatCurrency(selectedOrder.total)}
                                </td>
                              </tr>
                            </tfoot>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 border-t border-gray-200 pt-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Shipping Address</h4>
                        <p className="mt-1 text-sm text-gray-900">{selectedOrder.shipping.address}</p>
                        <p className="mt-2 text-sm text-gray-900">
                          <span className="font-medium">Method:</span> {selectedOrder.shipping.method}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium text-gray-500">Payment</h4>
                        <p className="mt-1 text-sm text-gray-900">
                          <span className="font-medium">Method:</span> {selectedOrder.payment.method}
                        </p>
                        <p className="mt-1 text-sm text-gray-900">
                          <span className="font-medium">Status:</span> {selectedOrder.payment.status}
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  {['pending', 'processing'].includes(selectedOrder.status) && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500">Update Order Status</h4>
                      <div className="mt-2 flex flex-col space-y-3">
                        {selectedOrder.status === 'pending' && (
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'processing')}
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Mark as Processing
                          </button>
                        )}
                        
                        {selectedOrder.status === 'processing' && (
                          <div>
                            <label htmlFor="tracking-number" className="block text-sm font-medium text-gray-700 mb-1">
                              Tracking Number
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <input
                                type="text"
                                name="tracking-number"
                                id="tracking-number"
                                className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                                placeholder="Enter tracking number"
                                value={trackingNumber}
                                onChange={(e) => setTrackingNumber(e.target.value)}
                              />
                              <button
                                type="button"
                                onClick={() => handleAddTracking(selectedOrder.id, trackingNumber)}
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                disabled={!trackingNumber.trim()}
                              >
                                Mark as Shipped
                              </button>
                            </div>
                          </div>
                        )}
                        
                        <button
                          type="button"
                          onClick={() => handleUpdateStatus(selectedOrder.id, 'cancelled')}
                          className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  )}
                  
                  {selectedOrder.status === 'shipped' && (
                    <div className="mt-4 border-t border-gray-200 pt-4">
                      <h4 className="text-sm font-medium text-gray-500">Tracking Information</h4>
                      {selectedOrder.shipping.trackingNumber ? (
                        <div className="mt-2">
                          <p className="text-sm text-gray-900">
                            <span className="font-medium">Tracking Number:</span> {selectedOrder.shipping.trackingNumber}
                          </p>
                          <button
                            type="button"
                            onClick={() => handleUpdateStatus(selectedOrder.id, 'delivered')}
                            className="mt-3 inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            Mark as Delivered
                          </button>
                        </div>
                      ) : (
                        <div className="mt-2">
                          <div className="flex rounded-md shadow-sm">
                            <input
                              type="text"
                              name="tracking-number"
                              id="tracking-number"
                              className="focus:ring-indigo-500 focus:border-indigo-500 flex-1 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                              placeholder="Enter tracking number"
                              value={trackingNumber}
                              onChange={(e) => setTrackingNumber(e.target.value)}
                            />
                            <button
                              type="button"
                              onClick={() => handleAddTracking(selectedOrder.id, trackingNumber)}
                              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                              disabled={!trackingNumber.trim()}
                            >
                              Add Tracking
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={closeOrderDetails}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  return (
    <SellerLayout>
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Orders</h1>
        </div>
        
        <div className="bg-white shadow overflow-hidden sm:rounded-md mb-8">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <label htmlFor="search" className="sr-only">Search Orders</label>
                <div className="relative rounded-md shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="search"
                    id="search"
                    className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search by order ID, customer name, or email"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="w-full md:w-48">
                <label htmlFor="status" className="sr-only">Status</label>
                <select
                  id="status"
                  name="status"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              
              <div className="w-full md:w-48">
                <label htmlFor="date" className="sr-only">Date</label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  value={dateFilter}
                  onChange={(e) => setDateFilter(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                {loading ? (
                  <div className="px-4 py-6 text-center text-gray-500">Loading...</div>
                ) : filteredOrders.length === 0 ? (
                  <div className="px-4 py-6 text-center text-gray-500">No orders found</div>
                ) : (
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Order ID
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Customer
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Date
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Status
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Total
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">Actions</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredOrders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            #{order.id}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div>{order.customer.name}</div>
                            <div className="text-xs text-gray-400">{order.customer.email}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {order.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <StatusBadge status={order.status} />
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {formatCurrency(order.total)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openOrderDetails(order)}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              View Details
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {isOrderDetailsOpen && <OrderDetailsModal />}
    </SellerLayout>
  );
};

export default OrdersPage;