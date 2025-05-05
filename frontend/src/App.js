import logo from './logo.svg';
import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import FarmerDashboard from './pages/FarmerDashboard';
import RetailerDashboard from './pages/RetailerDashboard';
import GeneralDashboard from './pages/GeneralDashboard';
import PrivateRoute from "./components/PrivateRoutes";

function App() {
  return (
    <Router>
    <Routes>
      <Route path="/" element={<div>Welcome to Food Traceability</div>} />  
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
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
    </Router>
  );
}

export default App;