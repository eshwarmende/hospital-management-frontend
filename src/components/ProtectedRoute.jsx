import React from "react";
import { Navigate } from "react-router-dom";

/**
 * Route protection component ensuring user is logged in
 * and has the appropriate role to access the page.
 */
function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem("token");
  const userRole = (localStorage.getItem("userRole") || "").toLowerCase();

  // If not authenticated, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If role is specified and does not match, redirect to the user's actual role dashboard
  if (allowedRoles && allowedRoles.length > 0) {
    const isAllowed = allowedRoles.map((r) => r.toLowerCase()).includes(userRole);
    if (!isAllowed) {
      if (userRole === "admin") return <Navigate to="/admin/dashboard" replace />;
      if (userRole === "doctor") return <Navigate to="/doctor/dashboard" replace />;
      return <Navigate to="/patient/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
