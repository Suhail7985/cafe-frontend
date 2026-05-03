import React, { useState } from "react";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Cart.css";
import { AppContext } from "../App";

export default function Cart() {
  const { user, cart, setCart } = useContext(AppContext);
  const [orderValue, setOrderValue] = useState(0);
  const navigate = useNavigate();

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

  if (cart.length === 0) {
    return (
      <div className="cart-container">
        <h2 className="cart-title">My Cart</h2>
        <div className="empty-cart">
          <div className="empty-cart-icon">🛒</div>
          <h3>Your cart is empty</h3>
          <p>Start shopping to add delicious desserts to your cart!</p>
          <button onClick={() => navigate("/products")} className="browse-btn">
            Browse Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h2 className="cart-title">My Cart</h2>
      
      {cart.map((value) => (
        value.qty > 0 && (
          <div key={value._id} className="cart-item">
            <img 
              src={value.imgUrl} 
              alt={value.productName} 
              className="cart-item-image"
            />
            <div className="cart-item-details">
              <h3 className="cart-item-name">{value.productName}</h3>
              <p className="cart-item-price">₹{value.price} each</p>
            </div>
            <div className="qty-buttons">
              <button 
                onClick={() => decrement(value._id, value.qty)}
                disabled={value.qty <= 1}
              >
                -
              </button>
              <span>{value.qty}</span>
              <button onClick={() => increment(value._id, value.qty)}>
                +
              </button>
            </div>
            <div className="cart-item-total">
              ₹{value.price * value.qty}
            </div>
          </div>
        )
      ))}
      
      <div className="order-summary">
        <h3 className="order-value">Total: ₹{orderValue}</h3>
        
        <div className="cart-actions">
          {user?.token ? (
            <button
              className="place-order-btn"
              onClick={() => navigate("/payment")}
            >
              Proceed to Payment
            </button>
          ) : (
            <button
              className="login-to-order-btn"
              onClick={() => navigate("/login")}
            >
              Login to Order
            </button>
          )}
        </div>
      </div>
    </div>
  );
}