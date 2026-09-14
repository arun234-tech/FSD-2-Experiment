import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';

export default function RoleBasedRoute({ allowedRoles }) {
  const { user, hasRole } = useAuth();

  if (!hasRole(allowedRoles)) {
    return <Navigate to="/unauthorized" replace state={{ requiredRoles: allowedRoles, heldRole: user?.role }} />;
  }

  return <Outlet />;
}
