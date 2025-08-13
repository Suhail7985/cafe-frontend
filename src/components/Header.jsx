import React, { useContext, useState } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { AppContext } from "../App";

export default function Header() {
  const { user, cart = [] } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Show total quantity of items in cart
  const totalItems = cart.length;

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="header">
      <div className="header-left">
        <h1>The Dessert Lab</h1>
      </div>

      {/* Desktop Navigation */}
      <nav className="header-right desktop-nav">
        <Link to="/">Home</Link>
        <Link to="/products">Products</Link>
        <Link to="/cart">
          MyCart{totalItems > 0 ? `(${totalItems})` : ""}
        </Link>
        <Link to="/order">MyOrder</Link>
        {user?.role === "admin" && <Link to="/admin">Admin</Link>}
        {user?.token ? (
          <Link to="/profile">Profile</Link>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      {/* Mobile Hamburger Button */}
      <button 
        className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Mobile Navigation Overlay */}
      <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>

      {/* Mobile Navigation Menu */}
      <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <h3>Menu</h3>
          <button className="close-menu" onClick={closeMenu} aria-label="Close menu">
            <span>×</span>
          </button>
        </div>
        
        <div className="mobile-nav-links">
          <Link to="/" onClick={closeMenu}>🏠 Home</Link>
          <Link to="/products" onClick={closeMenu}>🍰 Products</Link>
          <Link to="/cart" onClick={closeMenu}>
            🛒 MyCart{totalItems > 0 ? `(${totalItems})` : ""}
          </Link>
          <Link to="/order" onClick={closeMenu}>📋 MyOrder</Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={closeMenu}>⚙️ Admin</Link>
          )}
          {user?.token ? (
            <Link to="/profile" onClick={closeMenu}>👤 Profile</Link>
          ) : (
            <Link to="/login" onClick={closeMenu}>🔐 Login</Link>
          )}
        </div>

        {user?.token && (
          <div className="mobile-user-info">
            <div className="user-avatar">👤</div>
            <div className="user-details">
              <p className="user-name">{user.firstname} {user.lastname}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}