import React from "react";
import ReactDOM from "react-dom/client";

// Global CSS styles and Bootstrap
import "./index.css"; // Global base styles (e.g., fonts, body)
import 'bootstrap/dist/css/bootstrap.min.css'; // Bootstrap CSS

// Main app component
import App from "./App";

// Optional: performance logging 
import reportWebVitals from "./reportWebVitals";

// React Router to handle page navigation
import { BrowserRouter } from "react-router-dom";

// Attach app to the root element in index.html
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render the whole app with routing and dev checks
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);

// Logs performance info
reportWebVitals();
