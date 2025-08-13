import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../App";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AppContext);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              Welcome to <span className="highlight">The Dessert Lab</span>
            </h1>
            <p className="hero-subtitle">
              Where every dessert tells a story of passion, creativity, and pure indulgence
            </p>
            <p className="hero-description">
              Discover our handcrafted collection of artisanal desserts, 
              made with the finest ingredients and baked with love. 
              From classic favorites to innovative creations, 
              we bring sweetness to every moment.
            </p>
            <div className="hero-buttons">
              <Link to="/products" className="cta-button primary">
                Explore Our Desserts
              </Link>
              <Link to="/about" className="cta-button secondary">
                Learn More
              </Link>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-icon">🍰</div>
              <div className="floating-icon">🧁</div>
              <div className="floating-icon">🍪</div>
              <div className="floating-icon">🎂</div>
            </div>
          </div>
        </div>
        <div className="hero-wave">
          <svg viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".25" fill="#ffffff"></path>
            <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".5" fill="#ffffff"></path>
            <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="#ffffff"></path>
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <h2 className="section-title">Why Choose The Dessert Lab?</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">🌟</div>
              <h3>Artisanal Quality</h3>
              <p>Every dessert is handcrafted with premium ingredients and traditional techniques</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🚚</div>
              <h3>Fast Delivery</h3>
              <p>Fresh desserts delivered to your doorstep with care and speed</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">💝</div>
              <h3>Custom Orders</h3>
              <p>Personalized desserts for special occasions and celebrations</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">🌱</div>
              <h3>Fresh Daily</h3>
              <p>Baked fresh every morning to ensure the best taste and quality</p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about-section">
        <div className="container">
          <div className="about-content">
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                The Dessert Lab was born from a simple passion: creating desserts that not only 
                taste incredible but also bring joy to every bite. Our journey began in a small 
                kitchen with big dreams, and today we're proud to serve our community with 
                love, creativity, and the finest ingredients.
              </p>
              <p>
                We believe that every dessert should be a moment of pure happiness, a sweet 
                escape from the ordinary. That's why we pour our heart into every creation, 
                from our classic chocolate chip cookies to our innovative flavor combinations.
              </p>
              <Link to="/products" className="about-cta">
                Taste the Difference →
              </Link>
            </div>
            <div className="about-image">
              <div className="image-placeholder">
                <span>🍰</span>
                <p>Fresh from our kitchen</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Experience Sweet Magic?</h2>
            <p>Join thousands of happy customers who've discovered their favorite desserts</p>
            <div className="cta-buttons">
              <Link to="/products" className="cta-button primary large">
                Start Ordering Now
              </Link>
              {!user?.token && (
                <Link to="/register" className="cta-button secondary large">
                  Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">1000+</div>
              <div className="stat-label">Happy Customers</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">50+</div>
              <div className="stat-label">Dessert Varieties</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">5⭐</div>
              <div className="stat-label">Customer Rating</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">24/7</div>
              <div className="stat-label">Online Ordering</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}