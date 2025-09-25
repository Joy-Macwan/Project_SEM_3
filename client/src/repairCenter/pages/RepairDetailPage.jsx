import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import RepairCenterLayout from '../components/RepairCenterLayout';

const RepairDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [repair, setRepair] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);
  const [notes, setNotes] = useState('');
  
  // Fetch repair details
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data for demonstration
      const mockRepair = {
        id: parseInt(id),
        trackingNumber: `RP-2023-00${id}`,
        customerName: 'John Doe',
        customerEmail: 'john.doe@example.com',
        customerPhone: '(555) 123-4567',
        deviceType: 'Smartphone',
        brand: 'Samsung',
        model: 'Galaxy S21',
        serialNumber: 'SN1234567890',
        issue: 'Cracked Screen',
        customerDescription: 'Phone dropped and screen cracked. Touch functionality still works but display is damaged.',
        technicianNotes: 'Front glass and LCD damaged. Requires full display assembly replacement.',
        status: 'diagnosed',
        receivedDate: '2023-06-10',
        estimatedCompletionDate: '2023-06-15',
        priority: 'medium',
        cost: {
          estimate: 150.00,
          parts: 120.00,
          labor: 30.00,
          approved: true
        },
        history: [
          { date: '2023-06-10 09:30', status: 'pending', note: 'Repair request received' },
          { date: '2023-06-10 11:15', status: 'in_progress', note: 'Device check-in completed' },
          { date: '2023-06-10 14:45', status: 'diagnosed', note: 'Diagnosis completed. Screen replacement needed.' }
        ],
        parts: [
          { id: 1, name: 'Samsung Galaxy S21 Display Assembly', status: 'ordered', eta: '2023-06-12' }
        ]
      };
      
      setRepair(mockRepair);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Handle status update
  const handleStatusUpdate = async (newStatus) => {
    setStatusUpdateLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Update repair state with new status and add to history
      setRepair(prev => {
        if (!prev) return null;
        
        const now = new Date();
        const dateString = now.toISOString().split('T')[0] + ' ' + 
                           now.toTimeString().split(' ')[0].substring(0, 5);
        
        return {
          ...prev,
          status: newStatus,
          history: [
            ...prev.history,
            { 
              date: dateString, 
              status: newStatus, 
              note: notes || `Status updated to ${newStatus}` 
            }
          ]
        };
      });
      
      // Reset notes field
      setNotes('');
    } catch (err) {
      setError('Failed to update status. Please try again.');
    } finally {
      setStatusUpdateLoading(false);
    }
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      in_progress: 'bg-blue-100 text-blue-800',
      diagnosed: 'bg-purple-100 text-purple-800',
      waiting_for_parts: 'bg-orange-100 text-orange-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
      picked_up: 'bg-gray-100 text-gray-800'
    };
    
    const statusText = {
      pending: 'Pending',
      in_progress: 'In Progress',
      diagnosed: 'Diagnosed',
      waiting_for_parts: 'Waiting for Parts',
      completed: 'Completed',
      cancelled: 'Cancelled',
      picked_up: 'Picked Up'
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
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        ) : repair ? (
          <>
            {/* Header */}
            <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="flex items-center">
                  <h1 className="text-2xl font-bold text-gray-800 mr-3">
                    Repair #{repair.trackingNumber}
                  </h1>
                  <StatusBadge status={repair.status} />
                </div>
                <p className="text-gray-600 mt-1">
                  {repair.brand} {repair.model} - {repair.issue}
                </p>
              </div>
              <div className="mt-4 md:mt-0 flex space-x-3">
                <Link
                  to={`/repair-center/repairs/${repair.id}/edit`}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  Edit
                </Link>
                <button
                  onClick={() => navigate(-1)}
                  className="bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md"
                >
                  Back
                </button>
              </div>
            </div>
            
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left column - Repair details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Customer & Device Info */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Customer & Device Information</h2>
                  </div>
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Customer</h3>
                        <div className="mt-1 text-sm text-gray-900">
                          <p className="font-medium">{repair.customerName}</p>
                          <p>{repair.customerEmail}</p>
                          <p>{repair.customerPhone}</p>
                        </div>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Device</h3>
                        <div className="mt-1 text-sm text-gray-900">
                          <p>
                            <span className="font-medium">{repair.brand} {repair.model}</span> ({repair.deviceType})
                          </p>
                          <p>Serial Number: {repair.serialNumber}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Repair Details */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Repair Details</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Issue</h3>
                        <p className="mt-1 text-sm text-gray-900">{repair.issue}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Customer Description</h3>
                        <p className="mt-1 text-sm text-gray-900">{repair.customerDescription}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">Technician Notes</h3>
                        <p className="mt-1 text-sm text-gray-900">{repair.technicianNotes}</p>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Received Date</h3>
                          <p className="mt-1 text-sm text-gray-900">{repair.receivedDate}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Est. Completion</h3>
                          <p className="mt-1 text-sm text-gray-900">{repair.estimatedCompletionDate}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Priority</h3>
                          <p className="mt-1 text-sm text-gray-900 capitalize">{repair.priority}</p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">Cost Estimate</h3>
                          <p className="mt-1 text-sm text-gray-900">
                            ${repair.cost.estimate.toFixed(2)}
                            {repair.cost.approved ? 
                              <span className="ml-2 text-green-600 text-xs">(Approved)</span> : 
                              <span className="ml-2 text-yellow-600 text-xs">(Pending Approval)</span>
                            }
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Parts */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                    <h2 className="text-lg font-medium text-gray-900">Parts</h2>
                    <button className="text-sm text-blue-600 hover:text-blue-800">
                      Add Part
                    </button>
                  </div>
                  <div className="p-4">
                    {repair.parts.length === 0 ? (
                      <p className="text-sm text-gray-500">No parts required for this repair.</p>
                    ) : (
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Part Name
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Status
                            </th>
                            <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              ETA
                            </th>
                            <th scope="col" className="px-4 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {repair.parts.map((part) => (
                            <tr key={part.id}>
                              <td className="px-4 py-4 text-sm text-gray-900">
                                {part.name}
                              </td>
                              <td className="px-4 py-4 text-sm">
                                <span className="capitalize">{part.status}</span>
                              </td>
                              <td className="px-4 py-4 text-sm text-gray-500">
                                {part.eta}
                              </td>
                              <td className="px-4 py-4 text-right text-sm font-medium">
                                <button className="text-blue-600 hover:text-blue-900">
                                  Edit
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
              
              {/* Right column - Status & History */}
              <div className="space-y-6">
                {/* Status Update */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Update Status</h2>
                  </div>
                  <div className="p-4">
                    <div className="space-y-4">
                      <div>
                        <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                          Notes
                        </label>
                        <textarea
                          id="notes"
                          rows="3"
                          className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                          placeholder="Add status notes here..."
                          value={notes}
                          onChange={(e) => setNotes(e.target.value)}
                        ></textarea>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2">
                        {repair.status !== 'pending' && (
                          <button
                            onClick={() => handleStatusUpdate('pending')}
                            disabled={statusUpdateLoading}
                            className="bg-yellow-100 hover:bg-yellow-200 text-yellow-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            Pending
                          </button>
                        )}
                        
                        {repair.status !== 'in_progress' && (
                          <button
                            onClick={() => handleStatusUpdate('in_progress')}
                            disabled={statusUpdateLoading}
                            className="bg-blue-100 hover:bg-blue-200 text-blue-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            In Progress
                          </button>
                        )}
                        
                        {repair.status !== 'diagnosed' && (
                          <button
                            onClick={() => handleStatusUpdate('diagnosed')}
                            disabled={statusUpdateLoading}
                            className="bg-purple-100 hover:bg-purple-200 text-purple-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            Diagnosed
                          </button>
                        )}
                        
                        {repair.status !== 'waiting_for_parts' && (
                          <button
                            onClick={() => handleStatusUpdate('waiting_for_parts')}
                            disabled={statusUpdateLoading}
                            className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            Waiting for Parts
                          </button>
                        )}
                        
                        {repair.status !== 'completed' && (
                          <button
                            onClick={() => handleStatusUpdate('completed')}
                            disabled={statusUpdateLoading}
                            className="bg-green-100 hover:bg-green-200 text-green-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            Completed
                          </button>
                        )}
                        
                        {repair.status !== 'picked_up' && (
                          <button
                            onClick={() => handleStatusUpdate('picked_up')}
                            disabled={statusUpdateLoading}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            Picked Up
                          </button>
                        )}
                        
                        {repair.status !== 'cancelled' && (
                          <button
                            onClick={() => handleStatusUpdate('cancelled')}
                            disabled={statusUpdateLoading}
                            className="bg-red-100 hover:bg-red-200 text-red-800 font-medium py-2 px-4 rounded-md text-sm"
                          >
                            Cancel
                          </button>
                        )}
                      </div>
                      
                      {statusUpdateLoading && (
                        <div className="text-center">
                          <div className="inline-block animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-blue-500"></div>
                          <p className="text-sm text-gray-500 mt-1">Updating status...</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                
                {/* Repair History */}
                <div className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="px-4 py-5 border-b border-gray-200 bg-gray-50">
                    <h2 className="text-lg font-medium text-gray-900">Repair History</h2>
                  </div>
                  <div className="p-4">
                    <div className="flow-root">
                      <ul className="-mb-8">
                        {repair.history.map((event, eventIdx) => (
                          <li key={eventIdx}>
                            <div className="relative pb-8">
                              {eventIdx !== repair.history.length - 1 ? (
                                <span
                                  className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                                  aria-hidden="true"
                                ></span>
                              ) : null}
                              <div className="relative flex space-x-3">
                                <div>
                                  <span className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center">
                                    <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div>
                                    <div className="text-sm text-gray-500">
                                      <span className="font-medium text-gray-900 capitalize">
                                        {event.status.replace('_', ' ')}
                                      </span>{' '}
                                      on {event.date}
                                    </div>
                                  </div>
                                  <div className="mt-2 text-sm text-gray-700">
                                    <p>{event.note}</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-700">Repair not found.</p>
            <button
              onClick={() => navigate('/repair-center/repairs')}
              className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
            >
              Back to Repairs
            </button>
          </div>
        )}
      </div>
    </RepairCenterLayout>
  );
};

export default RepairDetailPage;