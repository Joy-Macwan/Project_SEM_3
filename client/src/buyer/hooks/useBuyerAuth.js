import { useContext } from 'react';
import { BuyerAuthContext } from '../context/BuyerAuthContext';

export const useBuyerAuth = () => {
  const context = useContext(BuyerAuthContext);
  
  if (!context) {
    throw new Error('useBuyerAuth must be used within a BuyerAuthProvider');
  }
  
  return context;
};

export default useBuyerAuth;