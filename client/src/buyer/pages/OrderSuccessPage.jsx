import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

const OrderSuccessPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { refreshCart } = useCart();
  
  // Get order ID from location state
  const orderId = location.state?.orderId;
  
  // If no order ID is provided, redirect to home
  useEffect(() => {
    if (!orderId) {
      navigate('/');
    } else {
      // Refresh cart to clear it after successful order
      refreshCart();
    }
  }, [orderId, navigate, refreshCart]);

  if (!orderId) {
    return null; // Will redirect in useEffect
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
            <svg className="h-10 w-10 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          
          <h1 className="text-3xl font-extrabold text-gray-900 mb-4">Thank you for your order!</h1>
          <p className="text-lg text-gray-600 mb-6">
            Your order #{orderId} has been placed successfully.
          </p>
          
          <div className="bg-gray-50 p-6 rounded-md mb-8">
            <h2 className="text-lg font-medium text-gray-900 mb-2">What happens next?</h2>
            <ol className="text-left text-gray-600 space-y-4 mt-4">
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">1</div>
                <p>You will receive an email confirmation with your order details.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">2</div>
                <p>Our team will process your order and prepare it for shipping.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">3</div>
                <p>Once your order ships, we'll send you tracking information.</p>
              </li>
              <li className="flex items-start">
                <div className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-indigo-100 text-indigo-800 font-medium text-sm mr-3">4</div>
                <p>Delivery typically takes 3-5 business days depending on your location.</p>
              </li>
            </ol>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              to="/orders"
              className="inline-flex items-center justify-center px-5 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              View your orders
            </Link>
            
            <Link
              to="/products"
              className="inline-flex items-center justify-center px-5 py-3 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Continue shopping
            </Link>
          </div>
        </div>
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            Having trouble with your order? <a href="#" className="text-indigo-600 hover:text-indigo-500">Contact our support team</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrderSuccessPage;