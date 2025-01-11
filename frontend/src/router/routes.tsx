import { createBrowserRouter, Navigate } from 'react-router-dom'; 
import LoginPage from '../Pages/loginPage';
import ContactForm from '../Pages/contactUs';
import Layout from '../Layouts/DashboardLayout';
import AdminDashboard from '../Pages/adminDashboard';
import { ProtectedRoute } from './ProtectedRoute';
import OptimizationResultsDashboard from '@/Components/optimizationResult';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/login" replace />
  },
  {
    path: '/login',
    element: <LoginPage onContactClick={() => router.navigate('/contact')} />,
  },
  {
    path: '/contact',
    element: <ContactForm onBackClick={() => router.navigate('/login')} />,
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute requiredRole="CUSTOMER">
        <Layout />
      </ProtectedRoute>
    ),
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute requiredRole="ADMIN">
        <AdminDashboard />
      </ProtectedRoute>
    ),
  },
  {
    path: '/optimizationresult',
    element: (
      <ProtectedRoute requiredRole="CUSTOMER">
        <OptimizationResultsDashboard />
      </ProtectedRoute>
    ),
  },
  
  {
    path: '*',
    element: <Navigate to="/login" replace />
  }
]);
