// src/components/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-background">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background p-4">
        <h1 className="text-2xl font-bold text-red-500 mb-4">
          Acceso no autorizado
        </h1>
        <p className="text-center text-muted-foreground">
          Tu rol ({user.rol}) no tiene permiso para acceder a esta página.
        </p>
      </div>
    );
  }

  return children;
};

export default ProtectedRoute;