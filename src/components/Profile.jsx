import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import { useNavigate } from "react-router-dom";
import "./Profile.css";

export default function Profile() {
  const [profile, setProfile] = useState({});
  const { user, setUser } = useContext(AppContext);
  const [form, setForm] = useState({});
  const [error, setError] = useState();
  const API_URL = import.meta.env.VITE_API_URL;
  const Navigate = useNavigate();

  const fetchProfile = async () => {
    try {
      const url = `${API_URL}/api/users/${user.id}/profile`;
      const result = await axios.get(url);
      setProfile(result.data);
      console.log(profile);
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const logout = () => {
    setUser({});
    Navigate("/");
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const url = `${API_URL}/api/users/${user._id}/profile`;
      const result = await axios.post(url, form);
      fetchProfile();
      setError("Data saved successfully.");
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  return (
    <div className="profile-wrapper">
      <div className="profile-card">
        <h2>👤 My Profile</h2>
        <button className="logout-btn" onClick={logout}>Logout</button>
        {error && <p className="error-msg">{error}</p>}
        <input
          name="firstname"
          type="text"
          onChange={handleChange}
          defaultValue={profile.firstname}
          placeholder="First Name"
        />
        <input
          name="lastname"
          type="text"
          onChange={handleChange}
          defaultValue={profile.lastname}
          placeholder="Last Name"
        />
        <input
          name="email"
          type="text"
          onChange={handleChange}
          defaultValue={profile.email}
          placeholder="Email"
        />
        <input
          name="phoneNo"
          type="text"
          onChange={handleChange}
          defaultValue={profile.phoneNo}
          placeholder="Phone Number"
        />
        <input
          name="password"
          type="password"
          onChange={handleChange}
          defaultValue={profile.password}
          placeholder="Password"
        />
        <button className="update-btn" onClick={handleSubmit}>Update Profile</button>
      </div>
    </div>
  );
}