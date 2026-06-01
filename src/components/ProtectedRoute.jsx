import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, isAdmin } = useAuth();
  const location = useLocation();

  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  if (adminOnly && !isAdmin) return <Navigate to="/" replace />;
  return children;
};

export default ProtectedRoute;
