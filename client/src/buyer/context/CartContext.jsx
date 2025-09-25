import React, { createContext, useContext, useState, useEffect } from 'react';
import cartApi from '../api/cartApi';
import { useBuyerAuth } from '../hooks/useBuyerAuth';

// Create cart context
const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({
    items: [],
    totalItems: 0,
    subtotal: 0,
    discount: 0,
    tax: 0,
    total: 0,
    coupon: null,
    loading: false,
    error: null
  });

  const { isAuthenticated } = useBuyerAuth();

  // Fetch cart when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    } else {
      // Clear cart when logged out
      setCart({
        items: [],
        totalItems: 0,
        subtotal: 0,
        discount: 0,
        tax: 0,
        total: 0,
        coupon: null,
        loading: false,
        error: null
      });
    }
  }, [isAuthenticated]);

  // Fetch cart data from API
  const fetchCart = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      const cartData = await cartApi.getCart();
      
      // Calculate totals
      const totalItems = cartData.items.reduce((total, item) => total + item.quantity, 0);
      const subtotal = cartData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
      
      setCart({
        items: cartData.items,
        totalItems,
        subtotal,
        discount: cartData.discount || 0,
        tax: cartData.tax || 0,
        total: cartData.total || subtotal - (cartData.discount || 0) + (cartData.tax || 0),
        coupon: cartData.coupon || null,
        loading: false,
        error: null
      });
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to fetch cart'
      }));
    }
  };

  // Add item to cart
  const addItem = async (productId, quantity = 1) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.addToCart(productId, quantity);
      await fetchCart(); // Refresh cart after adding item
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to add item to cart'
      }));
    }
  };

  // Update cart item quantity
  const updateItem = async (cartItemId, quantity) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.updateCartItem(cartItemId, quantity);
      await fetchCart(); // Refresh cart after updating
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to update cart item'
      }));
    }
  };

  // Remove item from cart
  const removeItem = async (cartItemId) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.removeFromCart(cartItemId);
      await fetchCart(); // Refresh cart after removing item
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to remove item from cart'
      }));
    }
  };

  // Clear all items from cart
  const clearCart = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.clearCart();
      await fetchCart(); // Refresh cart after clearing
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to clear cart'
      }));
    }
  };

  // Apply coupon to cart
  const applyCoupon = async (couponCode) => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.applyCoupon(couponCode);
      await fetchCart(); // Refresh cart after applying coupon
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Invalid coupon code'
      }));
    }
  };

  // Remove coupon from cart
  const removeCoupon = async () => {
    try {
      setCart(prev => ({ ...prev, loading: true, error: null }));
      await cartApi.removeCoupon();
      await fetchCart(); // Refresh cart after removing coupon
    } catch (error) {
      setCart(prev => ({ 
        ...prev, 
        loading: false, 
        error: error.response?.data?.message || 'Failed to remove coupon'
      }));
    }
  };

  return (
    <CartContext.Provider 
      value={{ 
        cart, 
        addItem, 
        updateItem, 
        removeItem, 
        clearCart, 
        applyCoupon, 
        removeCoupon,
        refreshCart: fetchCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext;