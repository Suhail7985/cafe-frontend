import React, { useContext, useState } from "react";
import "./Login.css";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { AppContext } from "../App";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const { user, setUser } = useContext(AppContext);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    try {
      setError("");
      setIsSubmitting(true);
      const url = `${API_URL}/api/users/login`;
      const payload = { email: user?.email, password: user?.password };
      const result = await axios.post(url, payload);
      setUser(result.data);
      try { localStorage.setItem("user", JSON.stringify(result.data)); } catch {}
      Navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setIsSubmitting(false);
    }
  };

  const canSubmit = Boolean(user?.email) && Boolean(user?.password) && !isSubmitting;

  return (
    <div className="login-root">
      <div className="login-card">
        <div className="login-hero-pane" aria-hidden="true">
          <div className="brand">
            <div className="brand-logo">🍰</div>
            <div className="brand-name">The Dessert Lab</div>
          </div>
          <h1>Welcome Back</h1>
          <p>Sign in to track orders, manage your profile, and enjoy exclusive treats.</p>
        </div>
        <div className="login-form-pane">
          <div className="login-form-header">
            <h2>Sign in</h2>
            <p className="muted">New here? <Link to="/register">Create an account</Link></p>
          </div>
          {error ? <div className="error-message">{error}</div> : null}
          <form onSubmit={handleSubmit} noValidate className="login-form-fields">
            <label className="field">
              <span>Email</span>
              <input
                type="email"
                placeholder="Enter your email"
                value={user?.email || ""}
                onChange={(e) => setUser({ ...user, email: e.target.value })}
                required
              />
            </label>
            <label className="field">
              <span>Password</span>
              <div className="password-wrap">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={user?.password || ""}
                  onChange={(e) => setUser({ ...user, password: e.target.value })}
                  required
                />
                <button
                  type="button"
                  className="toggle-password"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </label>
            <button type="submit" disabled={!canSubmit} className="submit-btn">
              {isSubmitting ? "Signing in…" : "Sign In"}
            </button>
          </form>
          <div className="terms muted">By continuing, you agree to our Terms and Privacy Policy.</div>
        </div>
      </div>
    </div>
  );
}