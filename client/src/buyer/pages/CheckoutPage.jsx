import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useBuyerAuth } from '../hooks/useBuyerAuth';

const CheckoutPage = () => {
  const { cart } = useCart();
  const { user } = useBuyerAuth();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState('shipping');
  
  // Form states
  const [shippingInfo, setShippingInfo] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    address: '',
    apartment: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
    phone: user?.phone || '',
    email: user?.email || '',
    saveInfo: true
  });
  
  const [paymentInfo, setPaymentInfo] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    saveCard: false
  });
  
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);

  // Handle shipping form input changes
  const handleShippingChange = (e) => {
    const { name, value, type, checked } = e.target;
    setShippingInfo({
      ...shippingInfo,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle payment form input changes
  const handlePaymentChange = (e) => {
    const { name, value, type, checked } = e.target;
    setPaymentInfo({
      ...paymentInfo,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear errors for this field
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  // Validate shipping form
  const validateShippingForm = () => {
    const newErrors = {};
    
    // Required fields
    const requiredFields = [
      'firstName', 'lastName', 'address', 'city', 
      'state', 'postalCode', 'country', 'phone', 'email'
    ];
    
    requiredFields.forEach(field => {
      if (!shippingInfo[field].trim()) {
        newErrors[field] = 'This field is required';
      }
    });
    
    // Email validation
    if (shippingInfo.email && !/\S+@\S+\.\S+/.test(shippingInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    // Phone validation
    if (shippingInfo.phone && !/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Please enter a valid 10-digit phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Validate payment form
  const validatePaymentForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!paymentInfo.cardName.trim()) {
      newErrors.cardName = 'Name on card is required';
    }
    
    // Card number validation
    if (!paymentInfo.cardNumber.trim()) {
      newErrors.cardNumber = 'Card number is required';
    } else if (!/^\d{16}$/.test(paymentInfo.cardNumber.replace(/\s/g, ''))) {
      newErrors.cardNumber = 'Please enter a valid 16-digit card number';
    }
    
    // Expiry date validation
    if (!paymentInfo.expiryDate.trim()) {
      newErrors.expiryDate = 'Expiry date is required';
    } else if (!/^\d{2}\/\d{2}$/.test(paymentInfo.expiryDate)) {
      newErrors.expiryDate = 'Please use MM/YY format';
    }
    
    // CVV validation
    if (!paymentInfo.cvv.trim()) {
      newErrors.cvv = 'Security code is required';
    } else if (!/^\d{3,4}$/.test(paymentInfo.cvv)) {
      newErrors.cvv = 'CVV must be 3 or 4 digits';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle moving to next step
  const handleContinue = () => {
    if (activeStep === 'shipping') {
      if (validateShippingForm()) {
        setActiveStep('payment');
      }
    } else if (activeStep === 'payment') {
      if (validatePaymentForm()) {
        setActiveStep('review');
      }
    }
  };
  
  // Handle going back to previous step
  const handleBack = () => {
    if (activeStep === 'payment') {
      setActiveStep('shipping');
    } else if (activeStep === 'review') {
      setActiveStep('payment');
    }
  };
  
  // Handle order placement
  const handlePlaceOrder = async () => {
    try {
      setProcessing(true);
      
      // This would be where you'd integrate with your payment processor
      // and create the order in your backend
      
      // Simulate a network request
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect to order confirmation
      navigate('/order/success', { 
        state: { 
          orderId: 'ORD' + Math.floor(100000 + Math.random() * 900000) 
        }
      });
    } catch (error) {
      setErrors({
        submit: 'There was a problem processing your order. Please try again.'
      });
    } finally {
      setProcessing(false);
    }
  };
  
  // If cart is empty, redirect to cart page
  if (cart.items.length === 0 && !cart.loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 mb-6">Your cart is empty</h1>
          <p className="text-gray-500 mb-8">You need to add items to your cart before checking out.</p>
          <Link
            to="/products"
            className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Browse Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-extrabold text-gray-900 mb-8">Checkout</h1>
        
        {/* Checkout steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center">
            <div className={`flex items-center relative ${activeStep === 'shipping' ? 'text-indigo-600' : 'text-gray-500'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeStep === 'shipping' ? 'border-indigo-600 bg-indigo-100' : (activeStep === 'payment' || activeStep === 'review') ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}>
                {(activeStep === 'payment' || activeStep === 'review') ? (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-sm font-medium ${activeStep === 'shipping' ? 'text-indigo-600' : 'text-gray-500'}`}>1</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium">Shipping</span>
            </div>
            
            <div className="w-12 mx-2 h-1 bg-gray-200">
              <div className={`h-full ${(activeStep === 'payment' || activeStep === 'review') ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className={`flex items-center relative ${activeStep === 'payment' ? 'text-indigo-600' : activeStep === 'review' ? 'text-green-500' : 'text-gray-500'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeStep === 'payment' ? 'border-indigo-600 bg-indigo-100' : activeStep === 'review' ? 'border-green-500 bg-green-100' : 'border-gray-300'}`}>
                {activeStep === 'review' ? (
                  <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <span className={`text-sm font-medium ${activeStep === 'payment' ? 'text-indigo-600' : 'text-gray-500'}`}>2</span>
                )}
              </div>
              <span className="ml-2 text-sm font-medium">Payment</span>
            </div>
            
            <div className="w-12 mx-2 h-1 bg-gray-200">
              <div className={`h-full ${activeStep === 'review' ? 'bg-green-500' : 'bg-gray-200'}`}></div>
            </div>
            
            <div className={`flex items-center relative ${activeStep === 'review' ? 'text-indigo-600' : 'text-gray-500'}`}>
              <div className={`rounded-full h-10 w-10 flex items-center justify-center border-2 ${activeStep === 'review' ? 'border-indigo-600 bg-indigo-100' : 'border-gray-300'}`}>
                <span className={`text-sm font-medium ${activeStep === 'review' ? 'text-indigo-600' : 'text-gray-500'}`}>3</span>
              </div>
              <span className="ml-2 text-sm font-medium">Review</span>
            </div>
          </div>
        </div>
        
        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12">
          {/* Main content */}
          <div className="lg:col-span-7">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              {/* Shipping address form */}
              {activeStep === 'shipping' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping information</h2>
                  
                  <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First name</label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={shippingInfo.firstName}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.firstName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.firstName && <p className="mt-1 text-sm text-red-600">{errors.firstName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last name</label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={shippingInfo.lastName}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.lastName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.lastName && <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={shippingInfo.address}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.address ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <label htmlFor="apartment" className="block text-sm font-medium text-gray-700">Apartment, suite, etc. (optional)</label>
                      <input
                        type="text"
                        id="apartment"
                        name="apartment"
                        value={shippingInfo.apartment}
                        onChange={handleShippingChange}
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={shippingInfo.city}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.city ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="state" className="block text-sm font-medium text-gray-700">State / Province</label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={shippingInfo.state}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.state ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700">Postal code</label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        value={shippingInfo.postalCode}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.postalCode ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.postalCode && <p className="mt-1 text-sm text-red-600">{errors.postalCode}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="country" className="block text-sm font-medium text-gray-700">Country</label>
                      <select
                        id="country"
                        name="country"
                        value={shippingInfo.country}
                        onChange={handleShippingChange}
                        className="mt-1 block w-full rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500 shadow-sm sm:text-sm"
                      >
                        <option value="United States">United States</option>
                        <option value="Canada">Canada</option>
                        <option value="Mexico">Mexico</option>
                      </select>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
                      <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={shippingInfo.phone}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.phone ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={shippingInfo.email}
                        onChange={handleShippingChange}
                        className={`mt-1 block w-full rounded-md ${errors.email ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                    </div>
                    
                    <div className="sm:col-span-2">
                      <div className="flex items-start">
                        <div className="flex items-center h-5">
                          <input
                            id="saveInfo"
                            name="saveInfo"
                            type="checkbox"
                            checked={shippingInfo.saveInfo}
                            onChange={handleShippingChange}
                            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                          />
                        </div>
                        <div className="ml-3 text-sm">
                          <label htmlFor="saveInfo" className="font-medium text-gray-700">Save this information for next time</label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Payment method form */}
              {activeStep === 'payment' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment method</h2>
                  
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="cardName" className="block text-sm font-medium text-gray-700">Name on card</label>
                      <input
                        type="text"
                        id="cardName"
                        name="cardName"
                        value={paymentInfo.cardName}
                        onChange={handlePaymentChange}
                        className={`mt-1 block w-full rounded-md ${errors.cardName ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.cardName && <p className="mt-1 text-sm text-red-600">{errors.cardName}</p>}
                    </div>
                    
                    <div>
                      <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700">Card number</label>
                      <input
                        type="text"
                        id="cardNumber"
                        name="cardNumber"
                        value={paymentInfo.cardNumber}
                        onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456"
                        className={`mt-1 block w-full rounded-md ${errors.cardNumber ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                      />
                      {errors.cardNumber && <p className="mt-1 text-sm text-red-600">{errors.cardNumber}</p>}
                    </div>
                    
                    <div className="flex space-x-4">
                      <div className="flex-1">
                        <label htmlFor="expiryDate" className="block text-sm font-medium text-gray-700">Expiration date (MM/YY)</label>
                        <input
                          type="text"
                          id="expiryDate"
                          name="expiryDate"
                          value={paymentInfo.expiryDate}
                          onChange={handlePaymentChange}
                          placeholder="MM/YY"
                          className={`mt-1 block w-full rounded-md ${errors.expiryDate ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                        />
                        {errors.expiryDate && <p className="mt-1 text-sm text-red-600">{errors.expiryDate}</p>}
                      </div>
                      
                      <div className="flex-1">
                        <label htmlFor="cvv" className="block text-sm font-medium text-gray-700">CVV</label>
                        <input
                          type="text"
                          id="cvv"
                          name="cvv"
                          value={paymentInfo.cvv}
                          onChange={handlePaymentChange}
                          placeholder="123"
                          className={`mt-1 block w-full rounded-md ${errors.cvv ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-gray-300 focus:border-indigo-500 focus:ring-indigo-500'} shadow-sm sm:text-sm`}
                        />
                        {errors.cvv && <p className="mt-1 text-sm text-red-600">{errors.cvv}</p>}
                      </div>
                    </div>
                    
                    <div className="flex items-start">
                      <div className="flex items-center h-5">
                        <input
                          id="saveCard"
                          name="saveCard"
                          type="checkbox"
                          checked={paymentInfo.saveCard}
                          onChange={handlePaymentChange}
                          className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="saveCard" className="font-medium text-gray-700">Save this card for future purchases</label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Order review */}
              {activeStep === 'review' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Review your order</h2>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-base font-medium text-gray-900">Shipping information</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{`${shippingInfo.firstName} ${shippingInfo.lastName}`}</p>
                      <p>{shippingInfo.address}</p>
                      {shippingInfo.apartment && <p>{shippingInfo.apartment}</p>}
                      <p>{`${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.postalCode}`}</p>
                      <p>{shippingInfo.country}</p>
                      <p className="mt-2">{shippingInfo.phone}</p>
                      <p>{shippingInfo.email}</p>
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t border-gray-200 pt-4">
                    <h3 className="text-base font-medium text-gray-900">Payment information</h3>
                    <div className="mt-2 text-sm text-gray-500">
                      <p>{paymentInfo.cardName}</p>
                      <p>Card ending in {paymentInfo.cardNumber.slice(-4)}</p>
                      <p>Expires {paymentInfo.expiryDate}</p>
                    </div>
                  </div>
                  
                  {errors.submit && (
                    <div className="mt-6 p-4 bg-red-50 rounded-md">
                      <p className="text-sm text-red-700">{errors.submit}</p>
                    </div>
                  )}
                </div>
              )}
              
              {/* Navigation buttons */}
              <div className="mt-8 flex justify-between">
                {activeStep !== 'shipping' ? (
                  <button
                    type="button"
                    onClick={handleBack}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Back
                  </button>
                ) : (
                  <Link
                    to="/cart"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Return to cart
                  </Link>
                )}
                
                {activeStep !== 'review' ? (
                  <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    Continue
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handlePlaceOrder}
                    disabled={processing}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                  >
                    {processing ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing...
                      </>
                    ) : (
                      'Place order'
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
          
          {/* Order summary */}
          <div className="lg:col-span-5">
            <div className="bg-white shadow rounded-lg p-6 sticky top-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order summary</h2>
              
              <div className="flow-root">
                <ul className="divide-y divide-gray-200">
                  {cart.items.map((item) => (
                    <li key={item.id} className="py-4 flex">
                      <div className="flex-shrink-0 w-16 h-16 rounded-md overflow-hidden">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-center object-cover"
                        />
                      </div>
                      <div className="ml-4 flex-1 flex flex-col">
                        <div>
                          <div className="flex justify-between text-sm font-medium text-gray-900">
                            <h3>{item.name}</h3>
                            <p className="ml-4">${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                          <p className="mt-1 text-sm text-gray-500">Qty {item.quantity}</p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="border-t border-gray-200 pt-4 pb-4">
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium text-gray-900">${cart.subtotal.toFixed(2)}</p>
                </div>
                {cart.discount > 0 && (
                  <div className="flex justify-between text-sm mb-2 text-green-700">
                    <p>Discount</p>
                    <p className="font-medium">-${cart.discount.toFixed(2)}</p>
                  </div>
                )}
                <div className="flex justify-between text-sm mb-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium text-gray-900">$10.00</p>
                </div>
                <div className="flex justify-between text-sm">
                  <p className="text-gray-600">Tax</p>
                  <p className="font-medium text-gray-900">${cart.tax.toFixed(2)}</p>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4">
                <div className="flex justify-between">
                  <p className="text-base font-medium text-gray-900">Order total</p>
                  <p className="text-xl font-semibold text-gray-900">${cart.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;