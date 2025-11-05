import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../state/AuthContext.jsx';

export default function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (roles && !roles.includes(user.role)) return <Navigate to="/stores" replace />;
  return children;
}
