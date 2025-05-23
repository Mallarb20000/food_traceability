import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";
import "react-toastify/dist/ReactToastify.css";

// Validation schema for TransportLog form
const logSchema = yup.object({
  destination: yup.string().required("Destination is required"),
  vehicle_details: yup.string().required("Vehicle details are required"),
  transport_date: yup.string().required("Transport date is required"),
});

export default function RetailerDashboard() {
  // State for items, logs, and modals
  const [items, setItems] = useState([]);
  const [itemMap, setItemMap] = useState({});
  const [logs, setLogs] = useState([]);
  const [showLogModal, setShowLogModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [qrItem, setQRItem] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  // State for searching and sorting logs
  const [logSearch, setLogSearch] = useState("");
  const [logSortKey, setLogSortKey] = useState("transport_date");
  const [logSortOrder, setLogSortOrder] = useState("asc");

  // State for searching and sorting food items
  const [itemSearch, setItemSearch] = useState("");
  const [itemSortKey, setItemSortKey] = useState("name");
  const [itemSortOrder, setItemSortOrder] = useState("asc");

  // Form setup with validation
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(logSchema) });

  // Fetch all data from backend
  const fetchAll = async () => {
    try {
      const [itemsRes, logsRes] = await Promise.all([
        api.get("food-items/"),
        api.get("transport-logs/"),
      ]);
      setItems(itemsRes.data);
      const map = {};
      itemsRes.data.forEach((i) => (map[i.id] = i));
      setItemMap(map);
      setLogs(logsRes.data);
    } catch {
      toast.error("Failed to load dashboard data");
    }
  };

  // Load data when component mounts
  useEffect(() => {
    fetchAll();
  }, []);

  // Handle adding new transport log
  const onLogSubmit = async (data) => {
  try {
    await api.post("transport-logs/", {
      food_item: selectedItem.id,
      ...data,
    });
    toast.success("Transport log added!");
    reset();
    setShowLogModal(false);
    fetchAll();
  } catch (err) {
    if (err.response?.status === 400) {
      const errors = err.response.data;
      if (errors.batch_number) {
        toast.error("Batch number already exists.");
      } else {
        toast.error("Invalid data. Please check the form.");
      }
    } else {
      toast.error("Failed to add transport log.");
    }
  }
};

  // Mark log as on shelf
  const markOnShelf = async (logId) => {
    try {
      await api.patch(`transport-logs/${logId}/`, { on_shelf: true });
      toast.success("Marked as on shelf!");
      fetchAll();
    } catch {
      toast.error("Failed to update status");
    }
  };

  // Filter + sort transport logs
  const filteredLogs = logs
    .filter((log) => {
      const fi = itemMap[log.food_item] || {};
      return [log.destination, log.vehicle_details, fi.name]
        .join(" ")
        .toLowerCase()
        .includes(logSearch.toLowerCase());
    })
    .sort((a, b) => {
      const valA = a[logSortKey]?.toString().toLowerCase();
      const valB = b[logSortKey]?.toString().toLowerCase();
      return logSortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  // Filter + sort food items
  const filteredItems = items
    .filter((item) =>
      [item.name, item.origin, item.batch_number]
        .join(" ")
        .toLowerCase()
        .includes(itemSearch.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[itemSortKey]?.toString().toLowerCase();
      const valB = b[itemSortKey]?.toString().toLowerCase();
      return itemSortOrder === "asc"
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    });

  return (
    <div className="container mt-4">
      <h2>Retailer Dashboard</h2>

      {/* Transport Logs Table */}
      <h4 className="mt-4">Transported Items</h4>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search logs..."
          value={logSearch}
          onChange={(e) => setLogSearch(e.target.value)}
          style={{ maxWidth: "250px" }}
        />
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={logSortKey}
            onChange={(e) => setLogSortKey(e.target.value)}
          >
            <option value="destination">Sort by Destination</option>
            <option value="vehicle_details">Sort by Vehicle</option>
            <option value="transport_date">Sort by Date</option>
          </select>
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              setLogSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {logSortOrder === "asc" ? "Asc ⬆" : "Desc ⬇"}
          </button>
        </div>
      </div>
      <table className="table table-bordered table-sm">
        <thead>
          <tr>
            <th>Log ID</th>
            <th>Item ID</th>
            <th>Name</th>
            <th>Destination</th>
            <th>Vehicle</th>
            <th>Date</th>
            <th>On Shelf</th>
            <th>QR</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredLogs.map((log) => {
            const fi = itemMap[log.food_item] || {};
            return (
              <tr key={log.id}>
                <td>{log.id}</td>
                <td>{fi.id || log.food_item}</td>
                <td>{fi.name || "—"}</td>
                <td>{log.destination}</td>
                <td>{log.vehicle_details}</td>
                <td>{new Date(log.transport_date).toLocaleString()}</td>
                <td>{log.on_shelf ? "✅" : "⏳"}</td>
                <td>
                  {fi.qr_code ? (
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => {
                        setQRItem(fi);
                        setShowQRModal(true);
                      }}
                    >
                      View QR
                    </button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
                <td>
                  {!log.on_shelf ? (
                    <button
                      className="btn btn-sm btn-outline-success"
                      onClick={() => markOnShelf(log.id)}
                    >
                      Mark On Shelf
                    </button>
                  ) : (
                    <span className="text-muted">—</span>
                  )}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Food Items Table */}
      <h4 className="mt-5">Available Food Items</h4>
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <input
          type="text"
          className="form-control"
          placeholder="Search items..."
          value={itemSearch}
          onChange={(e) => setItemSearch(e.target.value)}
          style={{ maxWidth: "250px" }}
        />
        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={itemSortKey}
            onChange={(e) => setItemSortKey(e.target.value)}
          >
            <option value="name">Sort by Name</option>
            <option value="origin">Sort by Origin</option>
            <option value="batch_number">Sort by Batch</option>
          </select>
          <button
            className="btn btn-outline-secondary"
            onClick={() =>
              setItemSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))
            }
          >
            {itemSortOrder === "asc" ? "Asc ⬆" : "Desc ⬇"}
          </button>
        </div>
      </div>
      <table className="table table-striped table-hover">
        <thead>
          <tr>
            <th>Item ID</th>
            <th>Name</th>
            <th>Origin</th>
            <th>Batch</th>
            <th>QR</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.origin}</td>
              <td>{item.batch_number}</td>
              <td>
                {item.qr_code ? (
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => {
                      setQRItem(item);
                      setShowQRModal(true);
                    }}
                  >
                    View QR
                  </button>
                ) : (
                  <span className="text-muted">—</span>
                )}
              </td>
              <td>
                <button
                  className="btn btn-sm btn-outline-success"
                  onClick={() => {
                    setSelectedItem(item);
                    setShowLogModal(true);
                  }}
                >
                  Add Transport
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* QR Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code & Item ID</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {qrItem?.qr_code ? (
            <>
              <img
                src={qrItem.qr_code}
                alt="QR Code"
                className="img-fluid"
                style={{ maxHeight: "300px" }}
              />
              <p className="mt-2 text-muted">
                Item ID: <strong>{qrItem.id}</strong>
              </p>
            </>
          ) : (
            <p className="text-muted">No QR available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Transport Log Modal */}
      <Modal show={showLogModal} onHide={() => setShowLogModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Transport Log</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit(onLogSubmit)}>
            <Form.Group className="mb-2">
              <Form.Label>Destination</Form.Label>
              <Form.Control
                {...register("destination")}
                isInvalid={!!errors.destination}
              />
              <Form.Control.Feedback type="invalid">
                {errors.destination?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Vehicle Details</Form.Label>
              <Form.Control
                {...register("vehicle_details")}
                isInvalid={!!errors.vehicle_details}
              />
              <Form.Control.Feedback type="invalid">
                {errors.vehicle_details?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Transport Date</Form.Label>
              <Form.Control
                {...register("transport_date")}
                type="datetime-local"
                isInvalid={!!errors.transport_date}
              />
              <Form.Control.Feedback type="invalid">
                {errors.transport_date?.message}
              </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Submitting…" : "Proceed"}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
