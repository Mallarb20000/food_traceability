// src/App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
// import "./App.css"; // ← likely safe to remove if not using .App classes

// Reusable layout components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Auth pages
import Login from "./pages/Login";
import Register from "./pages/Register";

// Public product view
import ProductPage from "./pages/ProductPages";

// Dashboards
import GeneralDashboard from "./pages/GeneralDashboard";
import FarmerDashboard from "./pages/FarmerDashboard";
import RetailerDashboard from "./pages/RetailerDashboard";

// Landing page
import LandingPage from "./pages/LandingPage";

// Protected route logic
import PrivateRoute from "./components/PrivateRoutes";

export default function App() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Update role on path change
  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, [location.pathname]);

  // Logout function: clears everything and redirects
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top navigation bar */}
      <Navbar onLogout={handleLogout} role={role} />

      {/* Main routing area */}
      <div className="flex-grow-1">
        <Routes>
          {/* Public routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductPage />} />

          {/* Protected general dashboard → redirects based on role */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <GeneralDashboard />
              </PrivateRoute>
            }
          />

          {/* Farmer dashboard (only farmers allowed) */}
          <Route
            path="/dashboard/farmer"
            element={
              <PrivateRoute allowedRoles={["farmer"]}>
                <FarmerDashboard />
              </PrivateRoute>
            }
          />

          {/* Retailer dashboard (only retailers allowed) */}
          <Route
            path="/dashboard/retailer"
            element={
              <PrivateRoute allowedRoles={["retailer"]}>
                <RetailerDashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>

      {/* Bottom footer – always visible */}
      <Footer />
    </div>
  );
}
