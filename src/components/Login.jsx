import React, { useContext } from "react";
import './Login.css';
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";
import { AppContext } from "../App";
export default function Login() {
  const {user, setUser} = useContext(AppContext);
  const [error, setError] = useState();
  const Navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;
  const handleSubmit = async () => {
    try {
      const url = `${API_URL}/api/users/login`;
      console.log("Login request to:", url);
      console.log("Login data:", { email: user.email, password: user.password ? "***" : "undefined" });
      
      const result = await axios.post(url, user);
      console.log("Login successful:", result.data);
      setUser(result.data);
      Navigate("/");
    } catch (err) {
      console.error("Login error details:", {
        status: err.response?.status,
        message: err.response?.data?.message,
        data: err.response?.data
      });
      setError(err.response?.data?.message || "Something went wrong");
    }
  };
  return (
  <div className="login-page">
    <div className="login-form">
      <h2>Login</h2>
      {error && <div className="error-message">{error}</div>}
      <p>
        <input
          type="text"
          placeholder="Email Address"
          onChange={(e) => setUser({ ...user, email: e.target.value })}
        />
      </p>
      <p>
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setUser({ ...user, password: e.target.value })}
        />
      </p>
      <p>
        <button onClick={handleSubmit}>Submit</button>
      </p>
      <hr />
      <Link to="/register">Create Account</Link>
    </div>
  </div>
)};