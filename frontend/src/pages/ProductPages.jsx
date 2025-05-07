import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ProductPage = () => {
  const { id } = useParams();                // FoodItem ID from URL
  const [item, setItem] = useState(null);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch item details
    axios
      .get(`http://localhost:8000/api/food-items/${id}/`)
      .then(res => setItem(res.data))
      .catch(err => setError("Failed to load product."));

    // Fetch all logs then filter by food_item
    axios
      .get("http://localhost:8000/api/transport-logs/")
      .then(res => {
        const filtered = res.data.filter(log => log.food_item === parseInt(id));
        setLogs(filtered);
      })
      .catch(err => setError("Failed to load transport history."));
  }, [id]);

  if (error) return <div className="p-4 text-danger">{error}</div>;
  if (!item) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mt-4">
      <h2>Product Traceability</h2>

      <div className="card p-4 mb-4 shadow-sm">
        <h4>{item.name}</h4>
        <p><strong>Origin:</strong> {item.origin}</p>
        <p><strong>Batch:</strong> {item.batch_number}</p>
        <p><strong>Added:</strong> {new Date(item.created_at).toLocaleString()}</p>
        {item.qr_code && (
          <img
            src={item.qr_code}
            alt="QR Code"
            className="img-fluid mt-3"
            style={{ maxWidth: "200px" }}
          />
        )}
      </div>

      <h5>Transport History</h5>
      {logs.length === 0 ? (
        <p className="text-muted">No transport records found.</p>
      ) : (
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Date</th>
              <th>Destination</th>
              <th>Vehicle</th>
              <th>On Shelf</th>
            </tr>
          </thead>
          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{new Date(log.transport_date).toLocaleString()}</td>
                <td>{log.destination}</td>
                <td>{log.vehicle_details}</td>
                <td>{log.on_shelf ? "✅ Yes" : "⏳ No"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ProductPage;
