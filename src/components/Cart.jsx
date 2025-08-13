import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { AppContext } from "../App";
import axios from "axios";
export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const [error, setError] = useState();
  const Navigate = useNavigate();
  const navigate= useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const increment = (id, qty) => {
    const updatedCart = cart.map((product) =>
      product._id === id ? { ...product, qty: qty + 1 } : product
    );
    setCart(updatedCart);
  };

  const decrement = (id, qty) => {
    if (qty <= 1) {
      // Remove item from cart when quantity reaches 0 or below
      const updatedCart = cart.filter((product) => product._id !== id);
      setCart(updatedCart);
    } else {
      // Decrease quantity if it's greater than 1
      const updatedCart = cart.map((product) =>
        product._id === id ? { ...product, qty: qty - 1 } : product
      );
      setCart(updatedCart);
    }
  };

  useEffect(() => {
    setOrderValue(
      cart.reduce((sum, value) => {
        return sum + value.qty * value.price;
      }, 0)
    );
  }, [cart]);

  const placeOrder = async () => {
    try {
      const url = `${API_URL}/api/orders`;
      const newOrder = {
        userId: user._id,
        email: user.email,
        orderValue,
        items: cart,
      };
      const result = await axios.post(url, newOrder);
      setCart([])
      Navigate("/order");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="cart-container">
  <h2 className="cart-title">My Cart</h2>
  {error && <p className="error-message">{error}</p>}
  {cart &&
    cart.map(
      (value) =>
        value.qty > 0 && (
          <div key={value._id} className="cart-item">
            <span>{value.productName}</span>
            <span>₹{value.price}</span>
            <div className="qty-buttons">
              <button onClick={() => decrement(value._id, value.qty)}>-</button>
              <span>{value.qty}</span>
              <button onClick={() => increment(value._id, value.qty)}>+</button>
            </div>
            <span>₹{value.price * value.qty}</span>
          </div>
        )
    )}
<h5 className="order-value">Order Value: ₹{orderValue}</h5>
{user?.token ? (
  <button
    className="place-order-btn"
    onClick={() => {
      const hasItems = cart.some(item => item.qty > 0);
      if (!hasItems) {
        alert("Your cart is empty! Please add items before placing an order.");
        return;
      }
      navigate("/payment");
    }}
  >
    Place Order
  </button>
) : (
  <button
    className="place-order-btn"
    onClick={() => navigate("/login")}
  >
    Login to Order
  </button>
)}

</div>
  );
}