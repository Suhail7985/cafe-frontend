import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import { FaInstagram, FaGithub, FaLinkedin, FaTwitter, FaFacebook, FaPhone, FaEnvelope, FaMapMarkerAlt } from 'react-icons/fa';
import axios from 'axios';

export default function Footer() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subStatus, setSubStatus] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

  const handleSubscribe = async () => {
    try {
      setSubStatus('');
      const email = newsletterEmail.trim();
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setSubStatus('Please enter a valid email.');
        return;
      }
      setIsSubmitting(true);
      if (!API_URL) {
        setSubStatus('API not configured. Please set VITE_API_URL.');
        return;
      }
      const url = `${API_URL}/api/newsletter/subscribe`;
      console.log('Newsletter subscribe -> POST', url, { email });
      const result = await axios.post(url, { email });
      console.log('Newsletter subscribe -> response', result.status, result.data);
      setSubStatus(result.data?.message || 'Subscribed successfully');
      setNewsletterEmail('');
    } catch (err) {
      console.error('Newsletter subscribe -> error', {
        message: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      let message = err.response?.data?.message;
      if (!message) {
        if (typeof window !== 'undefined' && window.location?.protocol === 'https:' && API_URL?.startsWith('http://')) {
          message = 'Blocked by browser: calling HTTP API from HTTPS page. Use HTTPS backend or set a proxy.';
        } else if (err.message?.toLowerCase().includes('network')) {
          message = `Network error. Check API URL: ${API_URL}`;
        }
      }
      setSubStatus(message || 'Subscription failed. Try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Main Footer Content */}
        <div className="footer-main">
          {/* Company Info */}
          <div className="footer-section">
            <div className="footer-logo">
              <span className="footer-logo-icon">🍰</span>
              <h3>The Dessert Lab</h3>
            </div>
            <p className="footer-description">
              Crafting delightful desserts with passion and precision. Every bite tells a story of quality and creativity.
            </p>
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="social-link">
                <FaInstagram />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="social-link">
                <FaFacebook />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noreferrer" className="social-link">
                <FaTwitter />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-section">
            <h4 className="footer-title">Quick Links</h4>
            <div className="footer-links">
              <Link to="/" className="footer-link">🏠 Home</Link>
              <Link to="/products" className="footer-link">🍰 Products</Link>
              <Link to="/cart" className="footer-link">🛒 Cart</Link>
              <Link to="/order" className="footer-link">📋 Orders</Link>
              
            </div>
          </div>

          {/* Contact Info */}
          <div className="footer-section">
            <h4 className="footer-title">Contact Us</h4>
            <div className="contact-info">
              <div className="contact-item">
                <FaPhone className="contact-icon" />
                <span>+91 9555635456</span>
              </div>
              <div className="contact-item">
                <FaEnvelope className="contact-icon" />
                <span>thedessertlab7985@gmail.com</span>
              </div>
              <div className="contact-item">
                <FaMapMarkerAlt className="contact-icon" />
                <span>Adil nagar, Lucknow, Uttar Pradesh, Lucknow, India, Uttar Pradesh, India, 226020</span>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="footer-section">
            <h4 className="footer-title">Stay Sweet</h4>
            <p className="newsletter-text">Subscribe to our newsletter for exclusive offers and dessert updates!</p>
            <div className="newsletter-form">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="newsletter-input"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                onKeyDown={(e) => { if (e.key === 'Enter') handleSubscribe(); }}
                disabled={isSubmitting}
              />
              <button className="newsletter-button" onClick={handleSubscribe} disabled={isSubmitting}>
                {isSubmitting ? 'Subscribing...' : 'Subscribe'}
              </button>
            </div>
            {subStatus ? <p style={{ marginTop: '0.75rem' }}>{subStatus}</p> : null}
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copy">
              &copy; {new Date().getFullYear()} <span className="company-name">The Dessert Lab</span>. All rights reserved.
            </p>
            <div className="footer-bottom-links">
              <a href="#" className="footer-bottom-link">Privacy Policy</a>
              <a href="#" className="footer-bottom-link">Terms of Service</a>
              <a href="#" className="footer-bottom-link">Cookie Policy</a>
            </div>
          </div>
          <div className="developer-credit">
            <p>Built with 💙 by <a href="https://github.com" target="_blank" rel="noreferrer" className="developer-link">Mohd Suhail</a></p>
          </div>
        </div>
      </div>
    </footer>
  );
}