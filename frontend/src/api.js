import axios from "axios";

// Axios instance for making API calls to the backend
const api = axios.create({
  baseURL: "http://localhost:8000/api/", // backend base URL
  headers: {
    "Content-Type": "application/json", // send JSON data
  },
  withCredentials: true, // include cookies if needed
});

export default api;
