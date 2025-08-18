import React, { useContext, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Header.css";
import { AppContext } from "../App";

export default function Header() {
  const { user, cart = [] } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Check on mount
    checkScreenSize();

    // Add resize listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

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
      <div className="header-container">
        <div className="header-left">
          <Link to="/" className="logo-link">
            <div className="logo">
              <span className="logo-icon">🍰</span>
              <h1 className="logo-text">The Dessert Lab</h1>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="header-right desktop-nav">
          <Link to="/" className="nav-link">
            <span className="nav-icon">🏠</span>
            <span className="nav-text">Home</span>
          </Link>
          <Link to="/products" className="nav-link">
            <span className="nav-icon">🍰</span>
            <span className="nav-text">Products</span>
          </Link>
          <Link to="/cart" className="nav-link cart-link">
            <span className="nav-icon">🛒</span>
            <span className="nav-text">Cart</span>
            {totalItems > 0 && (
              <span className="cart-badge">{totalItems}</span>
            )}
          </Link>
          <Link to="/order" className="nav-link">
            <span className="nav-icon">📋</span>
            <span className="nav-text">Orders</span>
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" className="nav-link admin-link">
              <span className="nav-icon">⚙️</span>
              <span className="nav-text">Admin</span>
            </Link>
          )}
          {user?.token ? (
            <Link to="/profile" className="nav-link profile-link">
              <span className="nav-icon">👤</span>
              <span className="nav-text">Profile</span>
            </Link>
          ) : (
            <Link to="/login" className="nav-link login-link">
              <span className="nav-icon">🔐</span>
              <span className="nav-text">Login</span>
            </Link>
          )}
        </nav>

        {/* Mobile Hamburger Button - Only show on mobile */}
        {isMobile && (
          <button 
            className={`hamburger ${isMenuOpen ? 'active' : ''}`} 
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        )}
      </div>

      {/* Mobile Navigation Overlay - Only show on mobile */}
      {isMobile && (
        <div className={`mobile-nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
      )}

      {/* Mobile Navigation Menu - Only show on mobile */}
      {isMobile && (
        <nav className={`mobile-nav ${isMenuOpen ? 'active' : ''}`}>
        <div className="mobile-nav-header">
          <div className="mobile-logo">
            <span className="mobile-logo-icon">🍰</span>
            <h3>The Dessert Lab</h3>
          </div>
          <button className="close-menu" onClick={closeMenu} aria-label="Close menu">
            <span>×</span>
          </button>
        </div>
        
        <div className="mobile-nav-links">
          <Link to="/" onClick={closeMenu} className="mobile-nav-link">
            <span className="mobile-nav-icon">🏠</span>
            <span>Home</span>
          </Link>
          <Link to="/products" onClick={closeMenu} className="mobile-nav-link">
            <span className="mobile-nav-icon">🍰</span>
            <span>Products</span>
          </Link>
          <Link to="/cart" onClick={closeMenu} className="mobile-nav-link">
            <span className="mobile-nav-icon">🛒</span>
            <span>Cart</span>
            {totalItems > 0 && (
              <span className="mobile-cart-badge">{totalItems}</span>
            )}
          </Link>
          <Link to="/order" onClick={closeMenu} className="mobile-nav-link">
            <span className="mobile-nav-icon">📋</span>
            <span>Orders</span>
          </Link>
          {user?.role === "admin" && (
            <Link to="/admin" onClick={closeMenu} className="mobile-nav-link admin-link">
              <span className="mobile-nav-icon">⚙️</span>
              <span>Admin</span>
            </Link>
          )}
          {user?.token ? (
            <Link to="/profile" onClick={closeMenu} className="mobile-nav-link">
              <span className="mobile-nav-icon">👤</span>
              <span>Profile</span>
            </Link>
          ) : (
            <Link to="/login" onClick={closeMenu} className="mobile-nav-link login-link">
              <span className="mobile-nav-icon">🔐</span>
              <span>Login</span>
            </Link>
          )}
        </div>

        {user?.token && (
          <div className="mobile-user-info">
            <div className="user-avatar">
              <span className="avatar-icon">👤</span>
            </div>
            <div className="user-details">
              <p className="user-name">{user.firstname} {user.lastname}</p>
              <p className="user-email">{user.email}</p>
            </div>
          </div>
        )}
        </nav>
      )}
    </header>
  );
}