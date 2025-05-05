import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.token);
        navigate("/");
      } else {
        navigate("/login");
      }
    } catch (err) {
      alert("Login or Register failed");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{method === "login" ? "Login" : "Register"}</h1>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button type="submit">
        {method === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
