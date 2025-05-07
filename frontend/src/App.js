import './App.css';
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import ProductPage from "./pages/ProductPages";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from './pages/FarmerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import GeneralDashboard from './pages/GeneralDashboard';
import PrivateRoute from "./components/PrivateRoutes";
import Navbar from "./components/Navbar";

function App() {
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    setRole(localStorage.getItem("role"));
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <>
      <Navbar />


      {/* ✅ Routes */}
      <Routes>
        <Route path="/" element={<div className="p-4">Welcome to Food Traceability</div>} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/product/:id" element={<ProductPage />} />


        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <GeneralDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/farmer"
          element={
            <PrivateRoute allowedRoles={["farmer"]}>
              <FarmerDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/dashboard/retailer"
          element={
            <PrivateRoute allowedRoles={["retailer"]}>
              <RetailerDashboard />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;
