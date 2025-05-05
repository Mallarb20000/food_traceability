// File: src/pages/Register.jsx
import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("farmer");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/users/register/", { username, password, role });
      navigate("/login");
    } catch (err) {
      console.error("Registration error:", err.response); // 👈 ADD THIS

      if (err.response?.data) {
        try {
          const msg = Object.entries(err.response.data)
            .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
            .join(" | ");
          setError(msg);
        } catch {
          setError(JSON.stringify(err.response.data));
        }
      
          } else {
            setError("Registration failed.");
          }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <form onSubmit={handleSubmit} className="p-4 shadow bg-white rounded" style={{ width: 350 }}>
        <h1 className="text-center mb-4">Register</h1>
        {error && <p className="text-danger">{error}</p>}
        <input
          className="form-control mb-3"
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          className="form-control mb-3"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <div className="mb-3">
          <label className="form-label d-block">Select Role:</label>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="farmer"
              value="farmer"
              checked={role === "farmer"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label" htmlFor="farmer">
              Farmer
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              id="retailer"
              value="retailer"
              checked={role === "retailer"}
              onChange={(e) => setRole(e.target.value)}
            />
            <label className="form-check-label" htmlFor="retailer">
              Retailer
            </label>
          </div>
        </div>
        <button className="btn btn-primary w-100" type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;
