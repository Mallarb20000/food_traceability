import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";

const Navbar = () => {
  const [role, setRole] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);


  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    const token = localStorage.getItem("access");
    setRole(storedRole);
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleHelpSubmit = (e) => {
    e.preventDefault();
    // You could send this to a backend or email API
    alert("Complaint sent! We'll get back to you.");
    setShowHelp(false);
  };

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary sticky-top shadow-sm" style={{ zIndex: 1030 }}>
        <div className="container-fluid">
          <a className="navbar-brand fw-bold" href="/">🥗 Food Trace</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {!isLoggedIn && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/login">Login</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="/register">Register</a>
                  </li>
                </>
              )}

              {isLoggedIn && role === "farmer" && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard/farmer">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => setShowProfile(true)}>
                        Profile
                    </button>
                    </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => setShowHelp(true)}>
                      Help
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}

              {isLoggedIn && role === "retailer" && (
                <>
                  <li className="nav-item">
                    <a className="nav-link" href="/dashboard/retailer">Dashboard</a>
                  </li>
                  <li className="nav-item">
                    <a className="nav-link" href="#">Profile</a>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-link nav-link" onClick={() => setShowHelp(true)}>
                      Help
                    </button>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light btn-sm ms-2" onClick={handleLogout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      {/* Help Modal */}
      <Modal show={showHelp} onHide={() => setShowHelp(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Help / Complaint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleHelpSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your message</Form.Label>
              <Form.Control as="textarea" rows={4} required placeholder="Describe your issue or question..." />
            </Form.Group>
            <Button variant="primary" type="submit">
              Send Message
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      
<Modal show={showProfile} onHide={() => setShowProfile(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Your Profile</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <p><strong>Username:</strong> {localStorage.getItem("username") || "N/A"}</p>
    <p><strong>Role:</strong> {localStorage.getItem("role") || "N/A"}</p>
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
