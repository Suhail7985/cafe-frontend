import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../App";
import "./Payment.css";
import axios from "axios";

export default function Payment() {
  const { cart, user, setCart } = useContext(AppContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [formData, setFormData] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "India"
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errors, setErrors] = useState({});
  const [zipStatus, setZipStatus] = useState("");
  const [upiError, setUpiError] = useState("");

  // Calculate totals
  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const deliveryFee = subtotal > 500 ? 0 : 50;
  const tax = subtotal * 0.05;
  const total = subtotal + deliveryFee + tax;

  // Function to create order in database
  const createOrder = async () => {
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user.id || user._id, // Handle both id formats
        email: user.email,
        orderValue: total,
        items: cart,
        deliveryAddress: {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country
        }
      };
      
      const result = await axios.post(url, newOrder);
      console.log("Order created:", result.data);
      
      // Clear cart after successful order
      setCart([]);
      
      return result.data;
    } catch (err) {
      console.error("Error creating order:", err);
      throw new Error("Failed to create order");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleZipChange = async (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setFormData(prev => ({ ...prev, zipCode: value }));
    setZipStatus("");

    if (value.length === 6) {
      try {
        setZipStatus("Looking up location...");
        const res = await fetch(`https://api.postalpincode.in/pincode/${value}`);
        const data = await res.json();
        if (Array.isArray(data) && data[0]?.Status === "Success" && data[0]?.PostOffice?.length) {
          const po = data[0].PostOffice[0];
          const district = po.District || "";
          const state = po.State || "";
          setFormData(prev => ({ ...prev, city: district, state }));
          setZipStatus("Auto-filled city and state");
        } else {
          setZipStatus("Could not find location for this PIN. You can fill manually.");
        }
      } catch (err) {
        setZipStatus("Network error during PIN lookup. Please fill manually.");
      }
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Full name is required"; 
    }

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    }
    if (!formData.address.trim()) {
      newErrors.address = "Delivery address is required";
    }
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    if (!formData.state.trim()) {
      newErrors.state = "State is required";
    }
    if (!formData.zipCode.trim() || formData.zipCode.length !== 6) {
      newErrors.zipCode = "Valid 6-digit PIN is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const loadRazorpay = () => {
    return new Promise((resolve, reject) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => reject(new Error("Failed to load Razorpay SDK"));
      document.body.appendChild(script);
    });
  };

  const handleUPIPayment = async () => {
    if (!validateForm()) return;

    try {
      setUpiError("");
      setIsProcessing(true);

      await loadRazorpay();
      const baseUrl = import.meta.env.VITE_API_URL || "http://localhost:8080";

      const orderRes = await fetch(`${baseUrl}/api/payments/razorpay/order`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: Number(total.toFixed(2)),
          receipt: `rcpt_${Date.now()}`,
          notes: {
            email: formData.email,
            items: cart.map(i => `${i.productName}x${i.qty}`).join(", ")
          }
        })
      });

      if (!orderRes.ok) {
        const errorData = await orderRes.json();
        throw new Error(errorData.message || "Failed to create order");
      }
      const orderData = await orderRes.json();
      const { orderId, amount, currency, keyId } = orderData;

      const options = {
        key: keyId,
        order_id: orderId,
        amount,
        currency,
        name: "The Dessert Lab",
        description: "Order Payment",
        prefill: {
          email: formData.email,
          contact: formData.phone
        },
        notes: { address: formData.address },
        theme: { color: "#7c3aed" },
        handler: async function (response) {
          try {
            const verifyRes = await fetch(`${baseUrl}/api/payments/razorpay/verify`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(response)
            });
            const verifyData = await verifyRes.json();
            if (verifyRes.ok && verifyData.success) {
              // Create order after successful payment
              await createOrder();
              alert("Payment successful! Order placed successfully.");
              navigate("/order");
            } else {
              setUpiError(verifyData.message || "Verification failed.");
            }
          } catch (e) {
            console.error("Payment verification error:", e);
            setUpiError("Verification error. Please try again.");
          } finally {
            setIsProcessing(false);
          }
        },
        modal: { ondismiss: () => setIsProcessing(false) }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setUpiError(err.message || "Something went wrong. Please try again.");
      setIsProcessing(false);
    }
  };

  const handleCOD = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsProcessing(true);
      // Create order for COD
      await createOrder();
      alert("Order placed successfully with Cash on Delivery!");
      navigate("/order");
    } catch (err) {
      console.error("COD order error:", err);
      alert("Failed to place order. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="payment-page">
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some delicious desserts before proceeding to payment</p>
          <button onClick={() => navigate("/products")} className="cta-button">
            Browse Desserts
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-page">
      <div className="payment-container">
        <div className="payment-header">
          <h1>Secure Payment</h1>
          <p>Complete your order with confidence</p>
        </div>

        <div className="payment-content">
          <div className="payment-form-section">
            <h2>Payment Method</h2>

            <div className="payment-methods">
              <label className={`payment-method ${paymentMethod === 'upi' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="upi"
                  checked={paymentMethod === 'upi'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">📱</span>
                <span>UPI (Razorpay)</span>
              </label>

              <label className={`payment-method ${paymentMethod === 'cod' ? 'active' : ''}`}>
                <input
                  type="radio"
                  name="paymentMethod"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={(e) => setPaymentMethod(e.target.value)}
                />
                <span className="method-icon">💰</span>
                <span>Cash on Delivery</span>
              </label>
            </div>

            {(paymentMethod === 'upi' || paymentMethod === 'cod') && (
              <form onSubmit={paymentMethod === 'upi' ? (e) => { e.preventDefault(); handleUPIPayment(); } : handleCOD} className="payment-form">
                {/* Contact Information */}
                <div className="form-section">
                  <h3>Contact Information</h3>

                  <div className="form-group">
                    <label>Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className={errors.name ? 'error' : ''}
                    />
                    {errors.name && <span className="error-text">{errors.name}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Email</label>
                      <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="your@email.com" className={errors.email ? 'error' : ''} />
                      {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                      <label>Phone</label>
                      <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} placeholder="+91 98765 43210" className={errors.phone ? 'error' : ''} />
                      {errors.phone && <span className="error-text">{errors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Delivery Address</label>
                    <textarea name="address" value={formData.address} onChange={handleInputChange} placeholder="Enter your complete delivery address" rows="3" className={errors.address ? 'error' : ''} />
                    {errors.address && <span className="error-text">{errors.address}</span>}
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>City</label>
                      <input type="text" name="city" value={formData.city} onChange={handleInputChange} placeholder="Mumbai" className={errors.city ? 'error' : ''} />
                      {errors.city && <span className="error-text">{errors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label>State</label>
                      <input type="text" name="state" value={formData.state} onChange={handleInputChange} placeholder="Maharashtra" className={errors.state ? 'error' : ''} />
                      {errors.state && <span className="error-text">{errors.state}</span>}
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>PIN Code</label>
                      <input type="text" name="zipCode" value={formData.zipCode} onChange={handleZipChange} placeholder="400001" maxLength="6" className={errors.zipCode ? 'error' : ''} />
                      {errors.zipCode && <span className="error-text">{errors.zipCode}</span>}
                      {zipStatus && (
                        <span className={`helper-text ${zipStatus.includes('Auto-filled') ? 'success' : zipStatus.includes('Looking') ? '' : 'error'}`}>
                          {zipStatus}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {paymentMethod === 'upi' && (
                  <button type="submit" className="pay-button" disabled={isProcessing}>
                    {isProcessing ? "Starting UPI..." : `Pay ₹${total.toFixed(2)} via UPI`}
                  </button>
                )}

                {paymentMethod === 'cod' && (
                  <button type="submit" className="pay-button" disabled={isProcessing}>
                    {isProcessing ? "Placing Order..." : `Place Order (COD) - ₹${total.toFixed(2)}`}
                  </button>
                )}

                {upiError && <span className="error-text" style={{ marginTop: 8 }}>{upiError}</span>}
              </form>
            )}
          </div>

          <div className="order-summary-section">
            <h2>Order Summary</h2>
            <div className="cart-items">
              {cart.map((item) => (
                <div key={item._id} className="cart-item">
                  <div className="item-image">
                    <img src={item.imgUrl} alt={item.productName} />
                  </div>
                  <div className="item-details">
                    <h4>{item.productName}</h4>
                    <p>Qty: {item.qty}</p>
                    <span className="item-price">₹{item.price * item.qty}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="price-breakdown">
              <div className="price-row"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
              <div className="price-row"><span>Delivery Fee</span><span>{deliveryFee === 0 ? 'Free' : `₹${deliveryFee}`}</span></div>
              <div className="price-row"><span>Tax (5%)</span><span>₹{tax.toFixed(2)}</span></div>
              <div className="price-row total"><span>Total</span><span>₹{total.toFixed(2)}</span></div>
            </div>

            <div className="delivery-info">
              <h4>🚚 Delivery Information</h4>
              <p>Estimated delivery: 30-45 minutes</p>
              <p>Free delivery on orders above ₹500</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
