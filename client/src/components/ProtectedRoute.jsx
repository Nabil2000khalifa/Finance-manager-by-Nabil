import { Navigate, Outlet } from "react-router-dom";

import { useAuth } from "../hooks/useAuth.js";

const ProtectedRoute = () => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <h2>Loading your workspace</h2>
          <p>We are checking your saved session.</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
