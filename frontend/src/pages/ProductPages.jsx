// src/pages/ProductPage.jsx

import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, Table, Button, Row, Col, Spinner, Alert, Container } from "react-bootstrap";
import api from "../api";

const ProductPage = () => {
  const { id } = useParams();
  const [item, setItem] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    // Fetch the FoodItem
    api.get(`food-items/${id}/`)
      .then(res => setItem(res.data))
      .catch(() => setError("Failed to load product details."));

    // Fetch transport logs for this item
    api.get("transport-logs/")
      .then(res => {
        const filtered = res.data.filter(log => log.food_item === Number(id));
        setLogs(filtered);
      })
      .catch(() => setError("Failed to load transport history."));
  }, [id]);

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container className="py-5 text-center">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading…</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Hero */}
      <h1 className="mb-4 text-center">Product Traceability - Item #{item.id}</h1>

      {/* Product Card */}
      <Card className="mb-5 shadow-sm">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={8}>
              <h3 className="fw-bold">{item.name}</h3>
              <p className="mb-1">
                <strong>Origin:</strong> {item.origin}
              </p>
              <p className="mb-1">
                <strong>Batch:</strong> {item.batch_number}
              </p>
              <p className="text-muted mb-0">
                <strong>Added:</strong>{" "}
                {new Date(item.created_at).toLocaleString()}
              </p>
            </Col>
            <Col md={4} className="text-center mt-4 mt-md-0">
              {item.qr_code && (
                <img
                  src={item.qr_code}
                  alt="QR Code"
                  className="img-fluid"
                  style={{ maxWidth: 220 }}
                />
              )}
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Transport History */}
      <h4 className="mb-3">Transport History</h4>
      {logs.length === 0 ? (
        <Alert variant="secondary">No transport records found.</Alert>
      ) : (
        <Table responsive striped hover className="mb-4">
          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>From</th>
              <th>To</th>
              <th>Vehicle</th>
              <th>On Shelf</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.id}>
                <td>{new Date(log.transport_date).toLocaleString()}</td>
                <td>{item.origin}</td>
                <td>{log.destination}</td>
                <td>{log.vehicle_details}</td>
                <td>{log.on_shelf ? "✅" : "⏳"}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      {/* Callout / Value-add */}
      <Card bg="light" className="p-3 mb-5">
        <Card.Text className="mb-2">
          “Our decentralized traceability ensures each step—harvest, transit,
          shelf placement—is cryptographically recorded. Scan the QR code above
          anytime to verify freshness and handling.”
        </Card.Text>
        <Button variant="primary" href="#" className="mt-2">
          View Full Trace Details
        </Button>
      </Card>
    </Container>
  );
};

export default ProductPage;
