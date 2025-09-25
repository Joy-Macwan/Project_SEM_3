import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import RepairCenterLayout from '../components/RepairCenterLayout';

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState('day'); // 'day', 'week', or 'month'
  
  // Mock data for demonstration
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const today = new Date();
      
      const mockAppointments = [
        {
          id: 1,
          customerName: 'John Doe',
          customerPhone: '(555) 123-4567',
          type: 'diagnostic',
          deviceType: 'Smartphone',
          brand: 'Samsung',
          model: 'Galaxy S21',
          issue: 'Cracked Screen',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 9, 30),
          duration: 30, // minutes
          status: 'confirmed'
        },
        {
          id: 2,
          customerName: 'Jane Smith',
          customerPhone: '(555) 987-6543',
          type: 'dropoff',
          deviceType: 'Laptop',
          brand: 'Dell',
          model: 'XPS 13',
          issue: 'Battery not charging',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 11, 0),
          duration: 15, // minutes
          status: 'confirmed'
        },
        {
          id: 3,
          customerName: 'Alice Johnson',
          customerPhone: '(555) 555-5555',
          type: 'pickup',
          deviceType: 'Tablet',
          brand: 'Apple',
          model: 'iPad Pro',
          issue: 'Repaired - Screen Replacement',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 14, 15),
          duration: 15, // minutes
          status: 'confirmed'
        },
        {
          id: 4,
          customerName: 'Bob Wilson',
          customerPhone: '(555) 222-3333',
          type: 'consultation',
          deviceType: 'Desktop',
          brand: 'Custom Build',
          model: 'Gaming PC',
          issue: 'Performance issues',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate(), 16, 0),
          duration: 45, // minutes
          status: 'pending'
        },
        {
          id: 5,
          customerName: 'Carol Brown',
          customerPhone: '(555) 444-7777',
          type: 'diagnostic',
          deviceType: 'Smartphone',
          brand: 'Apple',
          model: 'iPhone 12',
          issue: 'Won\'t power on',
          date: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1, 10, 0),
          duration: 30, // minutes
          status: 'confirmed'
        }
      ];
      
      setAppointments(mockAppointments);
      setLoading(false);
    }, 1000);
  }, []);
  
  // Navigate to previous day/week/month
  const handlePrevious = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() - 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() - 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() - 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Navigate to next day/week/month
  const handleNext = () => {
    const newDate = new Date(currentDate);
    
    if (view === 'day') {
      newDate.setDate(newDate.getDate() + 1);
    } else if (view === 'week') {
      newDate.setDate(newDate.getDate() + 7);
    } else if (view === 'month') {
      newDate.setMonth(newDate.getMonth() + 1);
    }
    
    setCurrentDate(newDate);
  };
  
  // Filter appointments based on the current view
  const filteredAppointments = appointments.filter(appointment => {
    const appointmentDate = appointment.date;
    
    if (view === 'day') {
      return appointmentDate.getDate() === currentDate.getDate() &&
             appointmentDate.getMonth() === currentDate.getMonth() &&
             appointmentDate.getFullYear() === currentDate.getFullYear();
    } else if (view === 'week') {
      // Get the week start and end dates
      const weekStart = new Date(currentDate);
      weekStart.setDate(currentDate.getDate() - currentDate.getDay());
      
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      
      return appointmentDate >= weekStart && appointmentDate <= weekEnd;
    } else if (view === 'month') {
      return appointmentDate.getMonth() === currentDate.getMonth() &&
             appointmentDate.getFullYear() === currentDate.getFullYear();
    }
    
    return false;
  });
  
  // Format date for display
  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };
  
  // Format time for display
  const formatTime = (date) => {
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };
  
  // Type badge component
  const TypeBadge = ({ type }) => {
    const badgeClasses = {
      diagnostic: 'bg-blue-100 text-blue-800',
      dropoff: 'bg-green-100 text-green-800',
      pickup: 'bg-purple-100 text-purple-800',
      consultation: 'bg-yellow-100 text-yellow-800'
    };
    
    return (
      <span className={`${badgeClasses[type]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize`}>
        {type}
      </span>
    );
  };
  
  // Status badge component
  const StatusBadge = ({ status }) => {
    const badgeClasses = {
      confirmed: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      cancelled: 'bg-red-100 text-red-800',
      completed: 'bg-gray-100 text-gray-800'
    };
    
    return (
      <span className={`${badgeClasses[status]} inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize`}>
        {status}
      </span>
    );
  };
  
  return (
    <RepairCenterLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Appointments</h1>
          <Link
            to="/repair-center/appointments/new"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md"
          >
            New Appointment
          </Link>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow overflow-hidden mb-6">
          {/* Calendar navigation */}
          <div className="p-4 border-b border-gray-200 bg-gray-50 flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePrevious}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-label="Previous"
              >
                <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <h2 className="text-lg font-medium text-gray-900">
                {view === 'day' && formatDate(currentDate)}
                {view === 'week' && (
                  <>
                    Week of{' '}
                    {new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate() - currentDate.getDay()
                    ).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {' - '}
                    {new Date(
                      currentDate.getFullYear(),
                      currentDate.getMonth(),
                      currentDate.getDate() - currentDate.getDay() + 6
                    ).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </>
                )}
                {view === 'month' && currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </h2>
              
              <button
                onClick={handleNext}
                className="p-2 rounded-full hover:bg-gray-200"
                aria-label="Next"
              >
                <svg className="h-5 w-5 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </button>
              
              <button
                onClick={() => setCurrentDate(new Date())}
                className="ml-2 px-3 py-1 text-sm bg-gray-200 hover:bg-gray-300 rounded"
              >
                Today
              </button>
            </div>
            
            <div className="mt-2 sm:mt-0">
              <div className="flex border border-gray-300 rounded-md p-1">
                <button
                  onClick={() => setView('day')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === 'day' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Day
                </button>
                <button
                  onClick={() => setView('week')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === 'week' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Week
                </button>
                <button
                  onClick={() => setView('month')}
                  className={`px-3 py-1 text-sm rounded-md ${
                    view === 'month' ? 'bg-blue-600 text-white' : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  Month
                </button>
              </div>
            </div>
          </div>
          
          {/* Appointments list */}
          <div className="divide-y divide-gray-200">
            {loading ? (
              <div className="p-8 text-center">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-2 text-gray-500">Loading appointments...</p>
              </div>
            ) : filteredAppointments.length === 0 ? (
              <div className="p-8 text-center">
                <p className="text-gray-500">No appointments scheduled for this period.</p>
              </div>
            ) : (
              filteredAppointments
                .sort((a, b) => a.date - b.date)
                .map((appointment) => (
                  <div key={appointment.id} className="p-4 hover:bg-gray-50">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                      <div className="mb-2 sm:mb-0">
                        <div className="flex items-center">
                          <span className="text-gray-900 font-medium">{formatTime(appointment.date)}</span>
                          <span className="mx-2 text-gray-500">·</span>
                          <TypeBadge type={appointment.type} />
                          <span className="mx-2 text-gray-500">·</span>
                          <StatusBadge status={appointment.status} />
                        </div>
                        <div className="mt-1">
                          <span className="text-gray-900">{appointment.customerName}</span>
                          <span className="mx-2 text-gray-500">·</span>
                          <span className="text-gray-500">{appointment.customerPhone}</span>
                        </div>
                      </div>
                      <div className="flex flex-col sm:items-end">
                        <div className="text-gray-900">{appointment.brand} {appointment.model}</div>
                        <div className="text-gray-500 text-sm">{appointment.issue}</div>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end space-x-3">
                      <Link
                        to={`/repair-center/appointments/${appointment.id}`}
                        className="text-blue-600 hover:text-blue-900 text-sm font-medium"
                      >
                        View Details
                      </Link>
                      <button
                        className="text-gray-600 hover:text-gray-900 text-sm font-medium"
                        onClick={() => alert(`Editing appointment ${appointment.id}`)}
                      >
                        Edit
                      </button>
                      {appointment.status === 'confirmed' && (
                        <button
                          className="text-red-600 hover:text-red-900 text-sm font-medium"
                          onClick={() => alert(`Cancelling appointment ${appointment.id}`)}
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </RepairCenterLayout>
  );
};

export default AppointmentsPage;