import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({children, roles}) {
  const {isAuthenticated, user} = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (roles && !roles.includes(user?.role)) return <Navigate to="/" replace />;
  return children;
};