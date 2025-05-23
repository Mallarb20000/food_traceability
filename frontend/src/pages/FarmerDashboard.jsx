import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import api from "../api";
import "react-toastify/dist/ReactToastify.css";

// Validation rules for the "Add Food Item" form
const addSchema = yup.object({
  name: yup.string().required("Name is required"),
  origin: yup.string().required("Origin is required"),
  batch_number: yup.string().required("Batch number is required"),
});

export default function FarmerDashboard() {
  // Local state
  const [items, setItems] = useState([]); // all food items
  const [showEditModal, setShowEditModal] = useState(false); // edit modal
  const [showQRModal, setShowQRModal] = useState(false); // QR modal
  const [selectedItem, setSelectedItem] = useState(null); // currently selected item
  const [searchTerm, setSearchTerm] = useState(""); // search filter
  const [sortKey, setSortKey] = useState("created_at"); // sort field
  const [sortOrder, setSortOrder] = useState("asc"); // sort order

  // Filter + sort items
  const filteredItems = items
    .filter((item) =>
      [item.name, item.origin, item.batch_number]
        .join(" ")
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const valA = a[sortKey]?.toString().toLowerCase();
      const valB = b[sortKey]?.toString().toLowerCase();
      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: yupResolver(addSchema) });

  // Load items on first render
  useEffect(() => {
    fetchItems();
  }, []);

  // Fetch all food items from API
  const fetchItems = async () => {
    try {
      const res = await api.get("food-items/");
      setItems(res.data);
    } catch {
      toast.error("Failed to load food items");
    }
  };

  // Add item to DB
  const onAddSubmit = async (data) => {
    try {
      await api.post("food-items/", data);
      toast.success("Food item added!");
      reset();
      fetchItems();
    } catch {
      toast.error("Failed to add item");
    }
  };

  // Delete item
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`food-items/${id}/`);
      toast.warn("Item deleted");
      fetchItems();
    } catch {
      toast.error("Failed to delete");
    }
  };

  // Open edit modal
  const openEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };

  // Save edited item
  const handleSaveEdit = async () => {
    try {
      await api.put(`food-items/${selectedItem.id}/`, {
        name: selectedItem.name,
        origin: selectedItem.origin,
        batch_number: selectedItem.batch_number,
      });
      toast.success("Item updated");
      setShowEditModal(false);
      fetchItems();
    } catch {
      toast.error("Failed to update");
    }
  };

  // Open QR modal
  const openQR = (item) => {
    setSelectedItem(item);
    setShowQRModal(true);
  };

  return (
    <div className="container mt-4">
      <h2>Farmer Dashboard</h2>

      {/* Add New Item Form */}
      <form onSubmit={handleSubmit(onAddSubmit)} className="card p-4 my-4 shadow">
        <h4>Add New Food Item</h4>

        <input
          {...register("name")}
          placeholder="Name"
          className={`form-control mb-2 ${errors.name ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.name?.message}</div>

        <input
          {...register("origin")}
          placeholder="Origin"
          className={`form-control mb-2 ${errors.origin ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.origin?.message}</div>

        <input
          {...register("batch_number")}
          placeholder="Batch Number"
          className={`form-control mb-2 ${errors.batch_number ? "is-invalid" : ""}`}
        />
        <div className="invalid-feedback">{errors.batch_number?.message}</div>

        <button type="submit" className="btn btn-success w-100" disabled={isSubmitting}>
          {isSubmitting ? "Adding…" : "Add Item"}
        </button>
      </form>

      {/* Search + Sort Options */}
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ maxWidth: "250px" }}
        />

        <div className="d-flex gap-2">
          <select
            className="form-select"
            value={sortKey}
            onChange={(e) => setSortKey(e.target.value)}
            style={{ minWidth: "150px" }}
          >
            <option value="name">Sort by Name</option>
            <option value="batch_number">Sort by Batch</option>
            <option value="created_at">Sort by Date</option>
          </select>

          <button
            className="btn btn-outline-secondary"
            onClick={() => setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"))}
          >
            {sortOrder === "asc" ? "Asc ⬆" : "Desc ⬇"}
          </button>
        </div>
      </div>

      {/* Table of Food Items */}
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Origin</th>
              <th>Batch</th>
              <th>Created</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.name}</td>
                <td>{item.origin}</td>
                <td>{item.batch_number}</td>
                <td>{new Date(item.created_at).toLocaleString()}</td>
                <td>
                  <button className="btn btn-sm btn-outline-primary me-2" onClick={() => openQR(item)}>View QR</button>
                  <button className="btn btn-sm btn-outline-warning me-2" onClick={() => openEdit(item)}>Edit</button>
                  <button className="btn btn-sm btn-outline-danger" onClick={() => handleDelete(item.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />

      {/* QR Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>QR Code</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          {selectedItem?.qr_code ? (
            <>
              <img src={selectedItem.qr_code} alt="QR Code" className="img-fluid" style={{ maxHeight: "300px" }} />
              <p className="mt-2 text-muted">
                Food Item ID: <strong>{selectedItem.id}</strong>
              </p>
            </>
          ) : (
            <p className="text-muted">No QR available</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Food Item #{selectedItem?.id || ""}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            className="form-control mb-2"
            value={selectedItem?.name || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, name: e.target.value })}
          />
          <input
            className="form-control mb-2"
            value={selectedItem?.origin || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, origin: e.target.value })}
          />
          <input
            className="form-control mb-2"
            value={selectedItem?.batch_number || ""}
            onChange={(e) => setSelectedItem({ ...selectedItem, batch_number: e.target.value })}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSaveEdit}>Save Changes</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
