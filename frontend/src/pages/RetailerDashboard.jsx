import { useEffect, useState } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const RetailerDashboard = () => {
  const [items, setItems] = useState([]);
  const [transportLogs, setTransportLogs] = useState([]);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrItem, setQRItem] = useState(null);

  const [showTransportModal, setShowTransportModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const [form, setForm] = useState({
    destination: "",
    vehicle_details: "",
    transport_date: "",
  });

  const token = localStorage.getItem("access");

  const headers = {
    Authorization: `Bearer ${token}`,
  };

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/food-items/", { headers });
      setItems(res.data);
    } catch (err) {
      console.error("Error fetching food items", err);
    }
  };

  const fetchTransportLogs = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/transport-logs/", { headers });
      setTransportLogs(res.data);
    } catch (err) {
      console.error("Error fetching transport logs", err);
    }
  };

  useEffect(() => {
    fetchItems();
    fetchTransportLogs();
  }, []);

  const openQR = (item) => {
    setQRItem(item);
    setShowQRModal(true);
  };

  const handleTransportOpen = (item) => {
    setSelectedItem(item);
    setForm({ destination: "", vehicle_details: "", transport_date: "" });
    setShowTransportModal(true);
  };

  const handleTransportChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const confirmTransport = (e) => {
    e.preventDefault();
    setShowTransportModal(false);
    setShowConfirmModal(true);
  };

  const submitTransport = async () => {
    try {
      await axios.post(
        "http://localhost:8000/api/transport-logs/",
        {
          food_item: selectedItem.id,
          ...form,
        },
        { headers }
      );
      toast.success("Transport log added successfully!");
      setShowConfirmModal(false);
      fetchTransportLogs();
    } catch (err) {
      console.error("Failed to add transport log", err);
      toast.error("Error adding transport log");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Retailer Dashboard</h2>

      {/* ✅ Top: Logged Transport */}
      <h4 className="mt-4">Transported Items</h4>
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Food Item</th>
            <th>Destination</th>
            <th>Vehicle</th>
            <th>Date</th>
            <th>On Shelf</th>
          </tr>
        </thead>
        <tbody>
          {transportLogs.map((log) => (
            <tr key={log.id}>
              <td>{log.food_item}</td>
              <td>{log.destination}</td>
              <td>{log.vehicle_details}</td>
              <td>{new Date(log.transport_date).toLocaleString()}</td>
              <td>{log.on_shelf ? "✅ Yes" : "⏳ No"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* ✅ Food Items Table */}
      <h4 className="mt-5">Available Food Items</h4>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Name</th>
            <th>Origin</th>
            <th>Batch</th>
            <th>QR</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map((item) => (
            <tr key={item.id}>
              <td>{item.name}</td>
              <td>{item.origin}</td>
              <td>{item.batch_number}</td>
              <td>
                <button
                  className="btn btn-sm btn-outline-primary"
                  onClick={() => openQR(item)}
                >
                  View QR
                </button>
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => handleTransportOpen(item)}
                >
                  Add Transport Log
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* ✅ QR Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrItem?.qr_code && (
            <img
              src={`http://localhost:8000/media/${qrItem.qr_code}`}
              alt="QR Code"
              className="img-fluid"
              style={{ maxHeight: "300px" }}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* ✅ Transport Form Modal */}
      <Modal show={showTransportModal} onHide={() => setShowTransportModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transport Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={confirmTransport}>
            <Form.Group className="mb-2">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                type="text"
                name="destination"
                value={form.destination}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Vehicle</Form.Label>
              <Form.Control
                type="text"
                name="vehicle_details"
                value={form.vehicle_details}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Transport Date</Form.Label>
              <Form.Control
                type="datetime-local"
                name="transport_date"
                value={form.transport_date}
                onChange={handleTransportChange}
                required
              />
            </Form.Group>
            <Button type="submit" variant="primary">
              Proceed
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      {/* ✅ Confirm Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Transport Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to add this transport log?</p>
          <ul>
            <li><strong>Item:</strong> {selectedItem?.name}</li>
            <li><strong>Destination:</strong> {form.destination}</li>
            <li><strong>Vehicle:</strong> {form.vehicle_details}</li>
            <li><strong>Date:</strong> {form.transport_date}</li>
          </ul>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Cancel
          </Button>
          <Button variant="success" onClick={submitTransport}>
            Confirm & Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default RetailerDashboard;
