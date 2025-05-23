import React from "react";

// Footer section at the bottom of the page
const Footer = () => {
  return (
    <footer className="bg-info text-white text-center text-lg-start mt-auto">
      <div className="container p-4">
        <div className="row">

          {/* Short description of the app */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-uppercase">About</h5>
            <p>
              QR-Based Food Traceability Web App for Small Farmers: track your
              produce from farm to shelf.
            </p>
          </div>

          {/* Page navigation links */}
          <div className="col-lg-4 col-md-6 mb-4">
            <h5 className="text-uppercase">Quick Links</h5>
            <ul className="list-unstyled mb-0">
              <li><a href="/" className="text-white">Home</a></li>
              <li><a href="/login" className="text-white">Login</a></li>
              <li><a href="/register" className="text-white">Register</a></li>
              <li><a href="/dashboard" className="text-white">Dashboard</a></li>
            </ul>
          </div>

          {/* Contact information */}
          <div className="col-lg-4 col-md-12 mb-4">
            <h5 className="text-uppercase">Contact</h5>
            <p>Email: support@foodtrace.com</p>
            <p>Phone: +1 (555) 123-4567</p>
          </div>

        </div>
      </div>

      {/* Copyright line */}
      <div
        className="text-center p-3"
        style={{ backgroundColor: "rgba(84, 63, 106, 0.2)" }}
      >
        © {new Date().getFullYear()} Food Trace — Designed by Rohit Malla
      </div>
    </footer>
  );
};

export default Footer;
