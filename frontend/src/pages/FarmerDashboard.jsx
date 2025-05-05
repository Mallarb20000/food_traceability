import { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const FarmerDashboard = () => {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({
    name: "",
    origin: "",
    batch_number: ""
  });
  const [error, setError] = useState(null);

  const [showEditModal, setShowEditModal] = useState(false);
const [showQRModal, setShowQRModal] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("access");

  const fetchItems = async () => {
    try {
      const res = await axios.get("http://localhost:8000/api/food-items/", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setItems(res.data);
    } catch (err) {
      console.error(err);
      setError("Could not fetch items.");
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form:", form);
    console.log("Token:", token);
  
    try {
      const res = await axios.post(
        "http://localhost:8000/api/food-items/",
        JSON.stringify(form),
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      console.log("Success:", res.data);
      setForm({ name: "", origin: "", batch_number: "" });
      fetchItems();
      toast.success("Item added successfully!");
    } catch (err) {
      console.error("Failed to add:", err.response?.data || err);
      setError("Failed to add item.");
    }
  };
  const handleEdit = (item) => {
    setSelectedItem(item);
    setShowEditModal(true);
  };
  
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      await axios.delete(`http://localhost:8000/api/food-items/${id}/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchItems(); // refresh list
      toast.error("Item deleted.");
    } catch (err) {
      console.error("Failed to delete:", err);
    }
  };
  const handleEditChange = (e) => {
    setSelectedItem({ ...selectedItem, [e.target.name]: e.target.value });
  };
  
  const handleSaveEdit = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/food-items/${selectedItem.id}/`,
        {
          name: selectedItem.name,
          origin: selectedItem.origin,
          batch_number: selectedItem.batch_number,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setShowEditModal(false);
      fetchItems();
      toast.success("Item updated.");
    } catch (err) {
      console.error("Failed to update:", err);
    }
  };
  
  
  

  return (
    <>
    <div className="container mt-4">
      <h2>Farmer Dashboard</h2>

      <form onSubmit={handleSubmit} className="card p-4 my-4 shadow">
        <h4>Add New Food Item</h4>

        <input
          type="text"
          name="name"
          placeholder="Name"
          className="form-control mb-2"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="origin"
          placeholder="Origin"
          className="form-control mb-2"
          value={form.origin}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="batch_number"
          placeholder="Batch Number"
          className="form-control mb-2"
          value={form.batch_number}
          onChange={handleChange}
          required
        />

        <button type="submit" className="btn btn-success w-100">
          Add Item
        </button>
        {error && <p className="text-danger mt-2">{error}</p>}
      </form>

      <table className="table table-striped">
  <thead>
    <tr>
      <th>Name</th>
      <th>Origin</th>
      <th>Batch</th>
      <th>Created</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {items.map((item) => (
      <tr key={item.id}>
        <td>{item.name}</td>
        <td>{item.origin}</td>
        <td>{item.batch_number}</td>
        <td>{new Date(item.created_at).toLocaleString()}</td>
        <td>
          <button
            className="btn btn-sm btn-outline-primary me-2"
            onClick={() => {
              setSelectedItem(item);
              setShowQRModal(true);
            }}
          >
            View QR
          </button>
          <button
            className="btn btn-sm btn-outline-warning me-2"
            onClick={() => handleEdit(item)}
          >
            Edit
          </button>
          <button
            className="btn btn-sm btn-outline-danger"
            onClick={() => handleDelete(item.id)}
          >
            Delete
          </button>
        </td>
      </tr>
    ))}
  </tbody>
</table>

    </div>
 
    <ToastContainer position="top-right" autoClose={3000} />
    


{/* Edit Modal */}
<Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
  <Modal.Header closeButton>
    <Modal.Title>Edit Food Item</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    <input
      name="name"
      className="form-control mb-2"
      value={selectedItem?.name || ""}
      onChange={handleEditChange}
    />
    <input
      name="origin"
      className="form-control mb-2"
      value={selectedItem?.origin || ""}
      onChange={handleEditChange}
    />
    <input
      name="batch_number"
      className="form-control mb-2"
      value={selectedItem?.batch_number || ""}
      onChange={handleEditChange}
    />
  </Modal.Body>
  <Modal.Footer>
    <Button variant="secondary" onClick={() => setShowEditModal(false)}>
      Cancel
    </Button>
    <Button variant="primary" onClick={handleSaveEdit}>
      Save Changes
    </Button>
  </Modal.Footer>
</Modal>

{/* QR Modal */}
<Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered>
  <Modal.Header closeButton>
    <Modal.Title>QR Code</Modal.Title>
  </Modal.Header>
  <Modal.Body className="text-center">
    {selectedItem?.qr_code && (
      <img
        src={selectedItem.qr_code}
        alt="QR Code"
        className="img-fluid"
        style={{ maxHeight: "300px" }}
      />
    )}
  </Modal.Body>
</Modal>

</>
);
};


export default FarmerDashboard;
