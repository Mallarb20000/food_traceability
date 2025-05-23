import { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const Navbar = ({ role, onLogout }) => {
  const [showHelp, setShowHelp] = useState(false); // for Help popup
  const [showProfile, setShowProfile] = useState(false); // for Profile popup
  const [isDark, setIsDark] = useState(false); // toggle theme
  const location = useLocation();
  const isLoggedIn = Boolean(role); // check if user is logged in

  // update <body> class when theme changes
  useEffect(() => {
    document.body.classList.toggle("dark-mode", isDark);
  }, [isDark]);

  // when help form is submitted
  const handleHelpSubmit = (e) => {
    e.preventDefault();
    alert("Complaint sent! We'll get back to you.");
    setShowHelp(false);
  };

  return (
    <>
      {/* Navbar bar itself */}
      <nav
        className={`navbar navbar-expand-lg sticky-top shadow-sm ${
          isDark ? "navbar-dark bg-dark" : "navbar-dark bg-primary"
        }`}
        style={{ zIndex: 1030 }}
      >
        <div className="container-fluid">
          {/* Brand logo / title */}
          <NavLink className="navbar-brand fw-bold" to="/">
            🥗 SFT
          </NavLink>

          {/* Button for mobile toggle */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon" />
          </button>

          {/* Navigation links */}
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {/* Shown when user is NOT logged in */}
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/login">
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/register">
                      Register
                    </NavLink>
                  </li>
                </>
              )}

              {/* Shown only to Farmer */}
              {isLoggedIn && role === "farmer" && (
                <>
                  <li className="nav-item">
                    <NavLink
                      className="nav-link"
                      to="/dashboard/farmer"
                      isActive={() =>
                        location.pathname.startsWith("/dashboard/farmer")
                      }
                    >
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={() => setShowProfile(true)}
                    >
                      Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={() => setShowHelp(true)}
                    >
                      Help
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light btn-sm ms-2"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}

              {/* Shown only to Retailer */}
              {isLoggedIn && role === "retailer" && (
                <>
                  <li className="nav-item">
                    <NavLink className="nav-link" to="/dashboard/retailer">
                      Dashboard
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link">
                      Profile
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-link nav-link"
                      onClick={() => setShowHelp(true)}
                    >
                      Help
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className="btn btn-outline-light btn-sm ms-2"
                      onClick={onLogout}
                    >
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>

          {/* Theme switch (Light/Dark) */}
          <div className="form-check form-switch ms-3">
            <input
              className="form-check-input"
              type="checkbox"
              id="themeSwitch"
              checked={isDark}
              onChange={() => setIsDark(!isDark)}
            />
            <label className="form-check-label text-white" htmlFor="themeSwitch">
              {isDark ? "Dark" : "Light"}
            </label>
          </div>
        </div>
      </nav>

      {/* Help popup */}
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Help / Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleHelpSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                required
                placeholder="Describe your issue or question..."
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Profile popup */}
      <Modal show={showProfile} onHide={() => setShowProfile(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Your Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            <strong>Username:</strong> {localStorage.getItem("username")}
          </p>
          <p>
            <strong>Role:</strong> {role}
          </p>
          <p className="text-muted">More profile features coming soon...</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowProfile(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Navbar;
