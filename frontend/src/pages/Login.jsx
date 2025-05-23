import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Validation schema
const schema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async ({ username, password }) => {
    try {
      const res = await api.post("users/login/", { username, password });
      const { role } = res.data;

      localStorage.setItem("role", role);
      localStorage.setItem("username", username);

      if (role === "farmer") navigate("/dashboard/farmer");
      else if (role === "retailer") navigate("/dashboard/retailer");
      else navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err.response?.data || err);
      toast.error("🚫 Invalid credentials. Please try again.", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
      });
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="card shadow p-5"
        style={{ width: "100%", maxWidth: "480px", minHeight: "480px" }}
      >
        <h2 className="mb-5 text-center">Login</h2>

        {/* Username */}
        <div className="mb-4">
          <input
            {...register("username")}
            className={`form-control ${errors.username ? "is-invalid" : ""}`}
            placeholder="Username"
          />
          {errors.username && (
            <div className="invalid-feedback">{errors.username.message}</div>
          )}
        </div>

        {/* Password + Toggle */}
        <div className="mb-5 input-group">
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            className={`form-control ${errors.password ? "is-invalid" : ""}`}
            placeholder="Password"
          />
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? "Hide" : "Show"}
          </button>
          {errors.password && (
            <div className="invalid-feedback d-block">{errors.password.message}</div>
          )}
        </div>

        <button
          type="submit"
          className="btn btn-primary w-100"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Logging in…" : "Login"}
        </button>
      </form>
    </div>
  );
}
