import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";

// Form component for login and register
function Form({ route, method }) {
  const [username, setUsername] = useState(""); // stores username input
  const [password, setPassword] = useState(""); // stores password input
  const navigate = useNavigate(); // lets us move between pages

  // what happens when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // stop page from refreshing
    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        // save token and go to homepage
        localStorage.setItem(ACCESS_TOKEN, res.data.token);
        navigate("/");
      } else {
        // after register, go to login page
        navigate("/login");
      }
    } catch (err) {
      alert("Login or Register failed"); // show error if it didn't work
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {/ heading based on method */}
      <h1>{method === "login" ? "Login" : "Register"}</h1>

      {/* username input */}
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />

      {/* password input */}
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      {/* submit button */}
      <button type="submit">
        {method === "login" ? "Login" : "Register"}
      </button>
    </form>
  );
}

export default Form;
