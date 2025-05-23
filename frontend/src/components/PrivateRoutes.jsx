import React from "react";
import { Navigate } from "react-router-dom";

// This makes sure only the right users can see certain pages
const PrivateRoute = ({ children, allowedRoles }) => {
  const role = localStorage.getItem("role"); // get user role from storage

  if (!role) {
    // not logged in at all
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(role)) {
    // logged in, but not the right role
    return <Navigate to="/login" />;
  }

  // user is allowed, show the page
  return children;
};

export default PrivateRoute;
