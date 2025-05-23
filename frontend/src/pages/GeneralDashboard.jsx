import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// This component decides where to send the user based on their role
const GeneralDashboard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const role = localStorage.getItem("role"); // get role from storage
    console.log("Redirecting with role:", role);

    if (role === "farmer") {
      // go to farmer dashboard
      navigate("/dashboard/farmer");
    } else if (role === "retailer") {
      // go to retailer dashboard
      navigate("/dashboard/retailer");
    } else {
      // if no role found, send to login
      navigate("/login");
    }
  }, [navigate]);

  return null; // nothing visible — acts as a redirect only
};

export default GeneralDashboard;
