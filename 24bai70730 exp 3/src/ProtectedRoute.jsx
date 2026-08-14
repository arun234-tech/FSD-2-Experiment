import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("jwtToken");
  const role = localStorage.getItem("userRole");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}

export default ProtectedRoute;