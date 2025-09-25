import React from 'react';
import SellerHeader from './SellerHeader';
import SellerSidebar from './SellerSidebar';

const SellerLayout = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-100">
      <SellerSidebar />
      
      <div className="flex-1 flex flex-col ml-64">
        <SellerHeader />
        
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default SellerLayout;