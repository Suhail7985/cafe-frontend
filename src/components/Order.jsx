import React, { useEffect, useState } from "react";
import axios from "axios";
import { useContext } from "react";
import "./Order.css";
import { AppContext } from "../App";

export default function Order() {
  const API_URL = import.meta.env.VITE_API_URL;
  const { user } = useContext(AppContext);
  const [error, setError] = useState();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/api/orders/${user.email}`;
      const result = await axios.get(url);
      setOrders(result.data);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchOrders();
    }
  }, [user]);

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return '⏳';
      case 'completed': return '✅';
      case 'cancelled': return '❌';
      case 'paid': return '💳';
      default: return '📋';
    }
  };

  const getStatusClass = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      case 'cancelled': return 'status-cancelled';
      case 'paid': return 'status-paid';
      default: return 'status-pending';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!user?.email) {
    return (
      <div className="order-page">
        <h2 className="order-title">My Orders</h2>
        <div className="login-prompt">
          <h3>Please Login</h3>
          <p>You need to be logged in to view your orders.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="order-page">
        <h2 className="order-title">My Orders</h2>
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your orders...</p>
        </div>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="order-page">
        <h2 className="order-title">My Orders</h2>
        <div className="no-orders">
          <div className="no-orders-icon">📋</div>
          <h3>No Orders Yet</h3>
          <p>Start shopping to see your order history here!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="order-page">
      <h2 className="order-title">My Orders</h2>
      {error && <p className="error-message">{error}</p>}
      
      {orders.map((order) => (
        <div key={order._id} className="order-card">
          {/* Order Header */}
          <div className="order-header">
            <div className="order-id">#{order._id.slice(-8)}</div>
            <div className="order-date">{formatDate(order.createdAt)}</div>
          </div>

          {/* Order Info Grid */}
          <div className="order-info">
            <div className="order-info-item">
              <div className="order-info-label">Order Value</div>
              <div className="order-info-value">₹{order.orderValue}</div>
            </div>
            <div className="order-info-item">
              <div className="order-info-label">Status</div>
              <div className="order-info-value">
                <span className={`status-badge ${getStatusClass(order.status)}`}>
                  {getStatusIcon(order.status)} {order.status}
                </span>
              </div>
            </div>
            <div className="order-info-item">
              <div className="order-info-label">Items</div>
              <div className="order-info-value">{order.items.length} products</div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="order-timeline">
            <div className="timeline-title">
              📍 Order Timeline
            </div>
            <div className="timeline-item">
              <div className={`timeline-icon ${getStatusClass(order.status)}`}>
                {getStatusIcon(order.status)}
              </div>
              <div className="timeline-content">
                <div className="timeline-status">Order {order.status}</div>
                <div className="timeline-time">{formatDate(order.updatedAt || order.createdAt)}</div>
              </div>
            </div>
          </div>

          {/* Order Items Table */}
          <table className="order-table" border="0">
            <thead>
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {order.items.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className="product-cell">
                      <img 
                        src={item.imgUrl} 
                        alt={item.productName} 
                        className="product-image"
                      />
                      <div className="product-details">
                        <div className="product-name">{item.productName}</div>
                        <div className="product-description">Delicious dessert</div>
                      </div>
                    </div>
                  </td>
                  <td>₹{item.price}</td>
                  <td>{item.qty}</td>
                  <td>₹{item.qty * item.price}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Order Total */}
          <div className="order-total">
            <div className="order-total-label">Total Order Value</div>
            <div className="order-total-value">₹{order.orderValue}</div>
          </div>
        </div>
      ))}
    </div>
  );
}