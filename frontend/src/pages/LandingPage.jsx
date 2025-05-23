import React, { useEffect, useState } from "react";
import api from "../api";

export default function LandingPage() {
  const [stats, setStats] = useState({
    foodItems: 50,
    farmers: 100,
    retailers: 20,
    scans: 1000,
  });

  useEffect(() => {
    // You can customize this based on your API
    const fetchStats = async () => {
      try {
        const [items, users] = await Promise.all([
          api.get("food-items/"),
          api.get("users/"),
        ]);

        const farmers = users.data.filter((u) => u.role === "farmer").length;
        const retailers = users.data.filter((u) => u.role === "retailer").length;

        setStats({
          foodItems: items.data.length,
          farmers,
          retailers,
          scans: 50, 
        });
      } catch (err) {
        console.error("Failed to fetch dashboard stats", err);
      }
    };

    fetchStats();
  }, []);

  return (

    
    <div className="container my-5">
         
  <h1 className="text-center text-muted">Track your food from farm to shelf with confidence. Built for transparency, powered by QR codes.</h1>

      <h1 className="mb-4 text-center">Welcome to Food Traceability System</h1>

      <div className="row g-4">
        <StatCard title="Food Items Tracked" value={stats.foodItems} icon="🧺" />
        <StatCard title="Registered Farmers" value={stats.farmers} icon="👨‍🌾" />
        <StatCard title="Registered Retailers" value={stats.retailers} icon="🛒" />
        <StatCard title="QR Scans by Consumers" value={stats.scans} icon="📲" />
      </div>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <div className="col-md-6 col-lg-3">
      <div className="card text-center shadow-sm">
        <div className="card-body">
          <h2>{icon}</h2>
          <h5 className="card-title">{title}</h5>
          <p className="display-6 fw-bold">{value}</p>
        </div>
      </div>
    </div>
  );
}
