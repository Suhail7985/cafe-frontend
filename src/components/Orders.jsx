import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Orders.css";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(5);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState("");
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/orders/?page=${page}&limit=${limit}&status=${status}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setOrders(result.data.orders);
      setTotalPages(result.data.total);
    } catch (err) {
      console.log(err);
      setError("Something went wrong while fetching orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [page, limit, status]);

  const updateOrder = async (newStatus, id) => {
    try {
      const url = `${API_URL}/api/orders/${id}`;
      await axios.patch(url, { status: newStatus });
      fetchOrders();
    } catch (err) {
      console.log(err);
      setError("Error updating order.");
    }
  };

  if (loading) {
    return (
      <div className="orders-container">
        <h2>Order Management</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="orders-container">
        <h2>Order Management</h2>
        <div className="empty-orders">
          <div className="empty-orders-icon">📋</div>
          <h3>No Orders Found</h3>
          <p>There are no orders matching your current filter.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="orders-container">
      <h2>Order Management</h2>

      {error && <div className="error">{error}</div>}

      <div className="orders-filter">
        <label htmlFor="status">Filter by Status:</label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Orders</option>
          <option value="Pending">Pending</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <table className="orders-table">
        <thead>
          <tr>
            <th>Order Details</th>
            <th>Amount</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id}>
              <td>
                <div className="order-details">
                  <div className="order-id">#{order._id.slice(-8)}</div>
                  <div className="order-amount">₹{order.orderValue}</div>
                </div>
              </td>
              <td>
                <span className="order-amount">₹{order.orderValue}</span>
              </td>
              <td>
                <span className={`status ${order.status.toLowerCase()}`}>
                  {order.status === "Pending" ? "⏳" : ""}
                  {order.status === "completed" ? "✅" : ""}
                  {order.status === "cancelled" ? "❌" : ""}
                  {order.status}
                </span>
              </td>
              <td>
                {order.status === "Pending" ? (
                  <div className="action-buttons">
                    <button
                      onClick={() => updateOrder("cancelled", order._id)}
                      className="cancel-btn"
                    >
                      ❌ Cancel
                    </button>
                    <button
                      onClick={() => updateOrder("completed", order._id)}
                      className="complete-btn"
                    >
                      ✅ Complete
                    </button>
                  </div>
                ) : (
                  <span className="no-actions">No actions available</span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="orders-pagination">
        <button 
          disabled={page === 1} 
          onClick={() => setPage(page - 1)}
        >
          ← Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button
          disabled={page === totalPages}
          onClick={() => setPage(page + 1)}
        >
          Next →
        </button>
      </div>
    </div>
  );
}