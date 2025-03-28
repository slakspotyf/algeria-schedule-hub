
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

type ProtectedRouteProps = {
  children?: React.ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, isLoading, isDemoMode } = useAuth();

  useEffect(() => {
    if (isDemoMode && user) {
      toast({
        title: "Demo Mode Active",
        description: "You're using Sahla-Post in demo mode. Some features may be limited.",
        duration: 5000,
      });
    }
  }, [isDemoMode, user]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Redirect to login if user is not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Render children or outlet for nested routes
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoute;
