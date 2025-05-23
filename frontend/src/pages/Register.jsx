import React, { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [username, setUsername]         = useState("");
  const [password, setPassword]         = useState("");
  const [confirmPassword, setConfirm]   = useState("");
  const [role, setRole]                 = useState("farmer");
  const [error, setError]               = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm]   = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      await api.post("users/register/", { username, password, role });
      navigate("/login");
    } catch (err) {
      const data = err.response?.data;
      setError(
        data
          ? Object.entries(data)
              .map(([k, v]) =>
                `${k}: ${Array.isArray(v) ? v.join(", ") : v}`
              )
              .join(" | ")
          : "Registration failed."
      );
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <form
        onSubmit={handleSubmit}
        className="card p-5 shadow-lg"
        style={{ width: 400, maxWidth: "90%" }}
      >
        <h2 className="text-center mb-4">Register</h2>
        {error && <div className="alert alert-danger">{error}</div>}

        <div className="mb-5">
          <input
            className="form-control"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>

        <div className="mb-5 input-group">
          <input
            className="form-control"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword((s) => !s)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>

        <div className="mb-4 input-group">
          <input
            className="form-control"
            type={showConfirm ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirm(e.target.value)}
            required
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowConfirm((s) => !s)}
          >
            {showConfirm ? "Hide" : "Show"}
          </button>
        </div>

        <div className="mb-4">
          <label className="form-label d-block">Select Role:</label>
          <div className="form-check form-check-inline">
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
          <div className="form-check form-check-inline">
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

        <button className="btn btn-primary w-100" type="submit">
          Register
        </button>
      </form>
    </div>
  );
}
