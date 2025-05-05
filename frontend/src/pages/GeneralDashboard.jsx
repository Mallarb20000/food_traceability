import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GeneralDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role");
    console.log("Redirecting with role:", role);
    if (role === "farmer") {
      navigate("/dashboard/farmer");
    } else if (role === "retailer") {
      navigate("/dashboard/retailer");
    } else {
      // Optional: handle invalid or missing role
      navigate("/login");
    }
  }, [navigate]);

  return null; // Or a loading spinner if you prefer
};

export default GeneralDashboard;
