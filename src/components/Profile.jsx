import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const [form, setForm] = useState({});
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [profilePicture, setProfilePicture] = useState(null);
  const { user, setUser } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setProfile(result.data);
      setForm({
        firstname: result.data.firstname || "",
        lastname: result.data.lastname || "",
        email: result.data.email || "",
        phoneNo: result.data.phoneNo || "",
        password: ""
      });
    } catch (err) {
      console.log(err);
      setError("Something went wrong while fetching profile");
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchProfile();
    }
  }, [user]);

  const logout = () => {
    setUser({});
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setSuccess("");
  };

  const handleProfilePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfilePicture(file);
      // Here you would typically upload the image to your server
      // For now, we'll just store it locally
    }
  };

  const getPasswordStrength = (password) => {
    if (!password) return null;
    if (password.length < 6) return "weak";
    if (password.length < 10) return "medium";
    return "strong";
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const updateData = { ...form };
      if (!updateData.password) {
        delete updateData.password;
      }

      const url = `${API_URL}/api/users/${user.id}/profile`;
      await axios.patch(url, updateData, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      
      setSuccess("Profile updated successfully!");
      fetchProfile();
      setForm({ ...form, password: "" });
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user?.id) {
    Navigate("/login");
    return null;
  }

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <button className="logout-btn" onClick={logout}>
          🚪 Logout
        </button>

        <div className="profile-header">
          <h2>👤 My Profile</h2>
        </div>

        {/* Profile Picture Section */}
        <div className="profile-picture-section">
          <div className="profile-picture">
            {profilePicture ? (
              <img 
                src={URL.createObjectURL(profilePicture)} 
                alt="Profile" 
              />
            ) : (
              profile.firstname?.charAt(0)?.toUpperCase() || "U"
            )}
          </div>
          <div className="profile-picture-upload">
            <label htmlFor="profile-picture" className="upload-btn">
              📷 Change Photo
              <input
                id="profile-picture"
                type="file"
                accept="image/*"
                onChange={handleProfilePictureChange}
              />
            </label>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && <div className="success-message">{success}</div>}
        {error && <div className="error-message">{error}</div>}

        {/* Profile Form */}
        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="firstname">👤 First Name</label>
            <input
              id="firstname"
              name="firstname"
              type="text"
              value={form.firstname || ""}
              onChange={handleChange}
              placeholder="Enter your first name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="lastname">👤 Last Name</label>
            <input
              id="lastname"
              name="lastname"
              type="text"
              value={form.lastname || ""}
              onChange={handleChange}
              placeholder="Enter your last name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email || ""}
              onChange={handleChange}
              placeholder="Enter your email"
              disabled
            />
          </div>

          <div className="form-group">
            <label htmlFor="phoneNo">📱 Phone Number</label>
            <input
              id="phoneNo"
              name="phoneNo"
              type="tel"
              value={form.phoneNo || ""}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-group full-width">
            <label htmlFor="password">🔒 New Password (optional)</label>
            <input
              id="password"
              name="password"
              type="password"
              value={form.password || ""}
              onChange={handleChange}
              placeholder="Enter new password (leave blank to keep current)"
            />
            {form.password && (
              <div className={`password-strength ${getPasswordStrength(form.password)}`}>
                Password strength: {getPasswordStrength(form.password)}
              </div>
            )}
          </div>

          <button 
            className={`update-btn ${loading ? 'loading' : ''}`}
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="loading-spinner"></div>
                Updating...
              </>
            ) : (
              '💾 Update Profile'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}