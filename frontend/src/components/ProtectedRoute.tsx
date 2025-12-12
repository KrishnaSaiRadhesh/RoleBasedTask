import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requirePermission?: {
    resource: 'tasks' | 'roles' | 'users';
    action: 'create' | 'read' | 'update' | 'delete';
  };
}

export const ProtectedRoute = ({ children, requirePermission }: ProtectedRouteProps) => {
  const { user, loading, hasPermission } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.hasAccess && !user.isAdmin) {
    return (
      <div className="no-access">
        <h2>Access Denied</h2>
        <p>Your account is pending admin approval. Please wait for access to be granted.</p>
      </div>
    );
  }

  if (requirePermission && !hasPermission(requirePermission.resource, requirePermission.action)) {
    return (
      <div className="no-permission">
        <h2>Permission Denied</h2>
        <p>You don't have permission to access this resource.</p>
      </div>
    );
  }

  return <>{children}</>;
};

