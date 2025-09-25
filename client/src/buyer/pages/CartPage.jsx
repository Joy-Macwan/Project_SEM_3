import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useBuyerAuth } from '../hooks/useBuyerAuth';
import { useCart } from '../context/CartContext';

const CartPage = () => {
  const { isAuthenticated } = useBuyerAuth();
  const { cart, updateItem, removeItem, applyCoupon, removeCoupon } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const navigate = useNavigate();

  // Handle coupon application
  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;
    
    try {
      setIsApplyingCoupon(true);
      setCouponError('');
      await applyCoupon(couponCode);
      setCouponCode('');
    } catch (err) {
      setCouponError('Invalid coupon code');
    } finally {
      setIsApplyingCoupon(false);
    }
  };

  // Proceed to checkout
  const handleCheckout = () => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      navigate('/login', { state: { redirect: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your Shopping Cart</h1>
        
        {cart.loading ? (
          <div className="flex justify-center py-12">
            <svg className="animate-spin h-10 w-10 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : cart.error ? (
          <div className="bg-red-50 p-4 rounded-md mb-6">
            <div className="text-red-700">{cart.error}</div>
          </div>
        ) : cart.items.length === 0 ? (
          <div className="bg-white shadow rounded-lg p-8 text-center">
            <h2 className="text-xl font-medium text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
            <Link
              to="/products"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Cart items list */}
            <div className="lg:col-span-2">
              <div className="bg-white shadow rounded-lg overflow-hidden">
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="p-6 flex flex-col sm:flex-row">
                      <div className="flex-shrink-0 w-24 h-24 mr-6 mb-4 sm:mb-0">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-center object-cover rounded-md"
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex flex-col sm:flex-row sm:justify-between">
                          <h3 className="text-lg font-medium text-gray-900">
                            <Link to={`/products/${item.id}`} className="hover:text-indigo-600">
                              {item.name}
                            </Link>
                          </h3>
                          <p className="mt-1 sm:mt-0 text-lg font-medium text-gray-900">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                        </div>
                        <p className="mt-1 text-sm text-gray-500">${item.price.toFixed(2)} each</p>
                        
                        <div className="mt-4 flex justify-between items-center">
                          <div className="flex items-center border border-gray-300 rounded-md">
                            <button
                              type="button"
                              disabled={cart.loading}
                              onClick={() => updateItem(item.id, item.quantity - 1)}
                              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                            <span className="px-4 py-1 text-gray-700">{item.quantity}</span>
                            <button
                              type="button"
                              disabled={cart.loading}
                              onClick={() => updateItem(item.id, item.quantity + 1)}
                              className="p-2 text-gray-500 hover:text-gray-700 disabled:opacity-50"
                            >
                              <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                              </svg>
                            </button>
                          </div>
                          <button
                            type="button"
                            disabled={cart.loading}
                            onClick={() => removeItem(item.id)}
                            className="text-sm text-red-600 hover:text-red-900 disabled:opacity-50"
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mt-6">
                <Link
                  to="/products"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
            
            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
                
                {/* Coupon section */}
                <div className="mb-4">
                  {cart.coupon ? (
                    <div className="flex items-center justify-between bg-green-50 p-3 rounded-md">
                      <div>
                        <p className="text-sm font-medium text-green-800">
                          Coupon applied: {cart.coupon.code}
                        </p>
                        <p className="text-xs text-green-700">
                          {cart.coupon.description}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={removeCoupon}
                        disabled={cart.loading}
                        className="text-xs text-red-600 hover:text-red-800 disabled:opacity-50"
                      >
                        Remove
                      </button>
                    </div>
                  ) : (
                    <div>
                      <div className="flex space-x-2">
                        <input
                          type="text"
                          value={couponCode}
                          onChange={(e) => setCouponCode(e.target.value)}
                          placeholder="Coupon code"
                          className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                        />
                        <button
                          type="button"
                          onClick={handleApplyCoupon}
                          disabled={isApplyingCoupon || !couponCode.trim()}
                          className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                        >
                          Apply
                        </button>
                      </div>
                      {couponError && (
                        <p className="mt-1 text-xs text-red-600">{couponError}</p>
                      )}
                    </div>
                  )}
                </div>
                
                <div className="border-t border-gray-200 pt-4 pb-4">
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">Subtotal</p>
                    <p className="text-sm font-medium text-gray-900">${cart.subtotal.toFixed(2)}</p>
                  </div>
                  {cart.discount > 0 && (
                    <div className="flex justify-between mb-2 text-green-700">
                      <p className="text-sm">Discount</p>
                      <p className="text-sm font-medium">-${cart.discount.toFixed(2)}</p>
                    </div>
                  )}
                  <div className="flex justify-between mb-2">
                    <p className="text-sm text-gray-600">Shipping</p>
                    <p className="text-sm font-medium text-gray-900">$10.00</p>
                  </div>
                  <div className="flex justify-between">
                    <p className="text-sm text-gray-600">Tax</p>
                    <p className="text-sm font-medium text-gray-900">${cart.tax.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 pt-4">
                  <div className="flex justify-between items-center">
                    <p className="text-base font-medium text-gray-900">Order total</p>
                    <p className="text-xl font-semibold text-gray-900">${cart.total.toFixed(2)}</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    type="button"
                    onClick={handleCheckout}
                    disabled={cart.items.length === 0 || cart.loading}
                    className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    Proceed to Checkout
                  </button>
                </div>
                
                <div className="mt-4">
                  <div className="flex items-center">
                    <svg className="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                    </svg>
                    <p className="text-xs text-gray-500">Secure checkout</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;