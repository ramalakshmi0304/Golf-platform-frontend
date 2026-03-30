import { useAuth } from '../context/useAuth';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user, profile, loading } = useAuth(); // Matches your AuthContext

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="text-lime-400 font-black animate-pulse uppercase tracking-widest">
          Authenticating Access...
        </div>
      </div>
    );
  }

  // If no user, send to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If profile exists, check if their role is in the allowedRoles array
  if (allowedRoles && !allowedRoles.includes(profile?.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};

// THIS IS THE MISSING LINE:
export default ProtectedRoute;