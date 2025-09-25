import { useContext } from 'react';
import { RepairCenterAuthContext } from '../context/RepairCenterAuthContext';

export const useRepairCenterAuth = () => {
  const context = useContext(RepairCenterAuthContext);
  
  if (!context) {
    throw new Error('useRepairCenterAuth must be used within a RepairCenterAuthProvider');
  }
  
  return context;
};