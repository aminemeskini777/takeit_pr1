import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();

 
  if (loading) return <div>Loading...</div>;

  
  if (!user) return <Navigate to="/login" replace />;

  
  if (role && user.role !== role) {
    return <Navigate to="/unauthorized" replace />;
  }

  
  return children;
};

export default ProtectedRoute;