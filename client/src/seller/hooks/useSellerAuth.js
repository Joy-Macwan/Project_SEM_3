import { useContext } from 'react';
import { SellerAuthContext } from '../context/SellerAuthContext';

export const useSellerAuth = () => {
  const context = useContext(SellerAuthContext);
  
  if (!context) {
    throw new Error('useSellerAuth must be used within a SellerAuthProvider');
  }
  
  return context;
};