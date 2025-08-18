import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../App";
import "./Home.css";

export default function Home() {
  const { user } = useContext(AppContext);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  return (
    <div className="home-container">
      {/* Hero Section with Modern Gradient */}
      <section className={`hero-section ${isVisible ? 'visible' : ''}`}>
        <div className="hero-background">
          <div className="gradient-overlay"></div>
          <div className="floating-shapes">
            <div className="shape shape-1"></div>
            <div className="shape shape-2"></div>
            <div className="shape shape-3"></div>
            <div className="shape shape-4"></div>
          </div>
        </div>
        
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
              {!user?.token && (
                <Link to="/register" className="cta-button secondary">
                  Join Sweet Rewards
                </Link>
              )}
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-elements">
              <div className="floating-icon">🍰</div>
              <div className="floating-icon">🧁</div>
              <div className="floating-icon">🍪</div>
              <div className="floating-icon">🎂</div>
              <div className="floating-icon">🍮</div>
              <div className="floating-icon">🍩</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section with Cards */}
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

      {/* About Section with Modern Design */}
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

      {/* Popular Categories Section */}
      <section className="categories-section">
        <div className="container">
          <h2 className="section-title">Popular Categories</h2>
          <div className="categories-grid">
            <div className="category-card">
              <div className="category-icon">🍰</div>
              <h3>Cakes</h3>
              <p>Birthday, Wedding & Celebration</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🍪</div>
              <h3>Cookies</h3>
              <p>Classic & Gourmet Varieties</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🧁</div>
              <h3>Cupcakes</h3>
              <p>Artistic & Flavorful</p>
            </div>
            <div className="category-card">
              <div className="category-icon">🍮</div>
              <h3>Puddings</h3>
              <p>Rich & Creamy Delights</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section with Enhanced Design */}
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

      {/* Stats Section with Modern Cards */}
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

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <h2 className="section-title">What Our Customers Say</h2>
          <div className="testimonials-grid">
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The best desserts I've ever tasted! Fresh, delicious, and beautifully presented."</p>
                <div className="testimonial-author">
                  <strong>Sarah Johnson</strong>
                  <span>Regular Customer</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"Amazing quality and fast delivery. Perfect for my daughter's birthday party!"</p>
                <div className="testimonial-author">
                  <strong>Mike Chen</strong>
                  <span>Happy Parent</span>
                </div>
              </div>
            </div>
            <div className="testimonial-card">
              <div className="testimonial-content">
                <p>"The custom cake was exactly what I wanted. Highly recommend!"</p>
                <div className="testimonial-author">
                  <strong>Emma Davis</strong>
                  <span>Wedding Customer</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}