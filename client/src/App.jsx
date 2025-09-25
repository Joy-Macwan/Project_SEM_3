import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Landing page
import RoleSelectionPage from './components/RoleSelectionPage';

// Admin pages
import AdminLoginPage from './admin/pages/AdminLoginPage';
import AdminDashboard from './admin/pages/AdminDashboard';
import UsersPage from './admin/pages/UsersPage';
import UserDetailPage from './admin/pages/UserDetailPage';
import SellersKYCQueue from './admin/pages/SellersKYCQueue';
import ProductsModerationPage from './admin/pages/ProductsModerationPage';
import RepairsAdminPage from './admin/pages/RepairsAdminPage';
import OrdersPage from './admin/pages/OrdersPage';
import PayoutsPage from './admin/pages/PayoutsPage';
import ReportsPage from './admin/pages/ReportsPage';
import PlatformSettingsPage from './admin/pages/PlatformSettingsPage';
import NotificationsPage from './admin/pages/NotificationsPage';
import AuditLogsPage from './admin/pages/AuditLogsPage';
import SystemOpsPage from './admin/pages/SystemOpsPage';

// Buyer pages
import HomePage from './buyer/pages/HomePage';
import LoginPage from './buyer/pages/LoginPage';
import RegisterPage from './buyer/pages/RegisterPage';
import ForgotPasswordPage from './buyer/pages/ForgotPasswordPage';
import ResetPasswordPage from './buyer/pages/ResetPasswordPage';
import ProfilePage from './buyer/pages/ProfilePage';
import CartPage from './buyer/pages/CartPage';
import ProductsPage from './buyer/pages/ProductsPage';
import ProductDetailPage from './buyer/pages/ProductDetailPage';
import SearchResultsPage from './buyer/pages/SearchResultsPage';
import CheckoutPage from './buyer/pages/CheckoutPage';
import OrderSuccessPage from './buyer/pages/OrderSuccessPage';

// Seller pages
import SellerDashboard from './seller/pages/SellerDashboard';
import SellerLoginPage from './seller/pages/SellerLoginPage';
import SellerRegisterPage from './seller/pages/SellerRegisterPage';
import ProductsListPage from './seller/pages/ProductsListPage';
import ProductFormPage from './seller/pages/ProductFormPage';
import SellerOrdersPage from './seller/pages/OrdersPage';

// Repair Center pages
import RepairCenterDashboard from './repairCenter/pages/RepairCenterDashboard';
import RepairCenterLoginPage from './repairCenter/pages/RepairCenterLoginPage';
import RepairCenterRegisterPage from './repairCenter/pages/RepairCenterRegisterPage';
import RepairsListPage from './repairCenter/pages/RepairsListPage';
import RepairDetailPage from './repairCenter/pages/RepairDetailPage';
import AppointmentsPage from './repairCenter/pages/AppointmentsPage';
import InventoryPage from './repairCenter/pages/InventoryPage';
import RepairCenterReportsPage from './repairCenter/pages/ReportsPage';

// Layout components
import BuyerLayout from './buyer/components/BuyerLayout';
import SellerLayout from './seller/components/SellerLayout';
import RepairCenterLayout from './repairCenter/components/RepairCenterLayout';

// Protected route components
import AdminProtectedRoute from './admin/components/ProtectedRoute';
import BuyerProtectedRoute from './buyer/components/ProtectedRoute';
import SellerProtectedRoute from './seller/components/ProtectedRoute';
import RepairCenterProtectedRoute from './repairCenter/components/ProtectedRoute';

// Auth contexts
import { AuthProvider } from './admin/context/AuthContext';

// Cart context provider
import { CartProvider } from './buyer/context/CartContext';
import { BuyerAuthProvider } from './buyer/context/BuyerAuthContext';
import { SellerAuthProvider } from './seller/context/SellerAuthContext';
import { RepairCenterAuthProvider } from './repairCenter/context/RepairCenterAuthContext';

const App = () => {
  return (
    <>
      <ToastContainer />
      <Routes>
        {/* Main Landing Page */}
        <Route path="/" element={<RoleSelectionPage />} />
        
        {/* Buyer Routes */}
        <Route path="/buyer/*" element={
          <BuyerAuthProvider>
            <CartProvider>
              <Routes>
                <Route path="/" element={<BuyerLayout />}>
                  <Route index element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="register" element={<RegisterPage />} />
                  <Route path="forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="reset-password" element={<ResetPasswordPage />} />
                  <Route path="reset-password/:token" element={<ResetPasswordPage />} />
                  <Route path="cart" element={<CartPage />} />
                  <Route path="products" element={<ProductsPage />} />
                  <Route path="products/:id" element={<ProductDetailPage />} />
                  <Route path="search" element={<SearchResultsPage />} />
                  <Route path="checkout" element={
                    <BuyerProtectedRoute>
                      <CheckoutPage />
                    </BuyerProtectedRoute>
                  } />
                  <Route path="order/success" element={
                    <BuyerProtectedRoute>
                      <OrderSuccessPage />
                    </BuyerProtectedRoute>
                  } />
                  <Route path="profile" element={
                    <BuyerProtectedRoute>
                      <ProfilePage />
                    </BuyerProtectedRoute>
                  } />
                </Route>
              </Routes>
            </CartProvider>
          </BuyerAuthProvider>
        } />

        {/* Admin Routes */}
        <Route path="/admin/*" element={
          <AuthProvider>
            <Routes>
              <Route path="login" element={<AdminLoginPage />} />
              <Route path="dashboard" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
              <Route path="users" element={<AdminProtectedRoute><UsersPage /></AdminProtectedRoute>} />
              <Route path="users/:id" element={<AdminProtectedRoute><UserDetailPage /></AdminProtectedRoute>} />
              <Route path="kyc" element={<AdminProtectedRoute><SellersKYCQueue /></AdminProtectedRoute>} />
              <Route path="products/moderation" element={<AdminProtectedRoute><ProductsModerationPage /></AdminProtectedRoute>} />
              <Route path="repairs" element={<AdminProtectedRoute><RepairsAdminPage /></AdminProtectedRoute>} />
              <Route path="orders" element={<AdminProtectedRoute><OrdersPage /></AdminProtectedRoute>} />
              <Route path="payouts" element={<AdminProtectedRoute><PayoutsPage /></AdminProtectedRoute>} />
              <Route path="reports" element={<AdminProtectedRoute><ReportsPage /></AdminProtectedRoute>} />
              <Route path="settings" element={<AdminProtectedRoute><PlatformSettingsPage /></AdminProtectedRoute>} />
              <Route path="notifications" element={<AdminProtectedRoute><NotificationsPage /></AdminProtectedRoute>} />
              <Route path="audit-logs" element={<AdminProtectedRoute><AuditLogsPage /></AdminProtectedRoute>} />
              <Route path="system" element={<AdminProtectedRoute><SystemOpsPage /></AdminProtectedRoute>} />
              <Route index element={<Navigate to="login" />} />
            </Routes>
          </AuthProvider>
        } />
        
        {/* Seller Routes */}
        <Route path="/seller/*" element={
          <SellerAuthProvider>
            <Routes>
              <Route path="login" element={<SellerLoginPage />} />
              <Route path="register" element={<SellerRegisterPage />} />
              <Route path="dashboard" element={
                <SellerProtectedRoute>
                  <SellerLayout />
                </SellerProtectedRoute>
              }>
                <Route index element={<SellerDashboard />} />
                <Route path="products" element={<ProductsListPage />} />
                <Route path="products/new" element={<ProductFormPage />} />
                <Route path="products/edit/:id" element={<ProductFormPage />} />
                <Route path="orders" element={<SellerOrdersPage />} />
              </Route>
              <Route index element={<Navigate to="login" />} />
            </Routes>
          </SellerAuthProvider>
        } />

        {/* Repair Center Routes */}
        <Route path="/repair-center/*" element={
          <RepairCenterAuthProvider>
            <Routes>
              <Route path="login" element={<RepairCenterLoginPage />} />
              <Route path="register" element={<RepairCenterRegisterPage />} />
              <Route path="dashboard" element={
                <RepairCenterProtectedRoute>
                  <RepairCenterDashboard />
                </RepairCenterProtectedRoute>
              } />
              <Route path="repairs" element={
                <RepairCenterProtectedRoute>
                  <RepairsListPage />
                </RepairCenterProtectedRoute>
              } />
              <Route path="repairs/:id" element={
                <RepairCenterProtectedRoute>
                  <RepairDetailPage />
                </RepairCenterProtectedRoute>
              } />
              <Route path="appointments" element={
                <RepairCenterProtectedRoute>
                  <AppointmentsPage />
                </RepairCenterProtectedRoute>
              } />
              <Route path="inventory" element={
                <RepairCenterProtectedRoute>
                  <InventoryPage />
                </RepairCenterProtectedRoute>
              } />
              <Route path="reports" element={
                <RepairCenterProtectedRoute>
                  <RepairCenterReportsPage />
                </RepairCenterProtectedRoute>
              } />
              <Route index element={<Navigate to="login" />} />
            </Routes>
          </RepairCenterAuthProvider>
        } />

        {/* Default route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </>
  );
};

export default App;