import { Navigate } from 'react-router-dom';
import { useAuth } from '../Contexts/authContext';
import { Role } from '../types/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole: Role;
}

export const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
  const { isAuthenticated, hasRole } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!hasRole(requiredRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};
