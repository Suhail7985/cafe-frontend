import React, { useEffect, useState, useContext, useCallback } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Users.css";

export default function Users() {
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";
  
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phoneNo: "",
    role: "user",
    status: "active",
    password: ""
  });
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchUsers = async () => {
    if (!user?.token) {
      setError("Please login to view users.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");
      const url = `${API_URL}/api/users?page=${page}&limit=${limit}&search=${encodeURIComponent(search || "")}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setUsers(result.data.users || []);
      setTotalPages(result.data.total || 1);
    } catch (err) {
      console.error("Error fetching users:", err);
      if (err.response?.status === 401 || err.response?.status === 403) {
        setError("Access denied. Admin privileges required.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Failed to fetch users. Please try again.";
        setError(errorMessage);
      }
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch when component mounts or user token becomes available
  useEffect(() => {
    if (user?.token) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.token]);

  // Fetch users when page changes
  useEffect(() => {
    if (user?.token && page) {
      fetchUsers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  // Debounced search - reset to page 1 when search changes
  useEffect(() => {
    if (!user?.token) return;
    
    const timer = setTimeout(() => {
      if (page !== 1) {
        setPage(1);
      } else {
        fetchUsers();
      }
    }, 500);
    
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search]);

  const resetForm = () => {
    setForm({
      firstname: "",
      lastname: "",
      email: "",
      phoneNo: "",
      role: "user",
      status: "active",
      password: ""
    });
    setEditId(null);
    setShowAddForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      setError("Adding user...");
      const url = `${API_URL}/api/users`;
      await axios.post(url, form, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      resetForm();
      setError("");
      fetchUsers();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add user.");
    }
  };

  const handleEdit = (userData) => {
    setEditId(userData._id);
    setForm({
      firstname: userData.firstname || "",
      lastname: userData.lastname || "",
      email: userData.email || "",
      phoneNo: userData.phoneNo || "",
      role: userData.role || "user",
      status: userData.status || "active",
      password: "" // Don't prefill password
    });
    setShowAddForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      setError("Updating user...");
      const url = `${API_URL}/api/users/${editId}`;
      const payload = { ...form };
      // Remove password if empty
      if (!payload.password) {
        delete payload.password;
      }
      await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      resetForm();
      setError("");
      fetchUsers();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update user.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) {
      return;
    }
    try {
      setError("Deleting user...");
      const url = `${API_URL}/api/users/${id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setError("");
      fetchUsers();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to delete user.");
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  if (loading && users.length === 0) {
    return (
      <div className="users-container">
        <h2>User Management</h2>
        <div className="loading">
          <div className="loading-spinner"></div>
          <p>Loading users...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="users-container">
      <div className="users-header">
        <h2>👥 User Management</h2>
        <button 
          className="add-user-btn"
          onClick={() => {
            resetForm();
            setShowAddForm(!showAddForm);
          }}
        >
          {showAddForm ? "✕ Cancel" : "+ Add New User"}
        </button>
      </div>

      {error && (
        <div className={`error-message ${error.includes("successfully") ? "success" : ""}`}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="users-search">
        <input
          type="text"
          placeholder="🔍 Search users by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <form className="user-form" onSubmit={editId ? handleUpdate : handleAdd}>
          <h3>{editId ? "Edit User" : "Add New User"}</h3>
          <div className="form-grid">
            <div className="form-group">
              <label>First Name *</label>
              <input
                type="text"
                name="firstname"
                value={form.firstname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Last Name *</label>
              <input
                type="text"
                name="lastname"
                value={form.lastname}
                onChange={handleChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                required
                disabled={!!editId}
              />
            </div>
            <div className="form-group">
              <label>Phone Number</label>
              <input
                type="tel"
                name="phoneNo"
                value={form.phoneNo}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Role *</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                required
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="form-group">
              <label>Status *</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                required
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div className="form-group full-width">
              <label>Password {editId ? "(leave empty to keep current)" : "*"}</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                required={!editId}
                minLength={6}
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editId ? "Update User" : "Add User"}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Users Table */}
      {users.length === 0 ? (
        <div className="empty-users">
          <div className="empty-icon">👥</div>
          <h3>No Users Found</h3>
          <p>{search ? "Try a different search term." : "Start by adding a new user."}</p>
        </div>
      ) : (
        <>
          <div className="users-table-container">
            <table className="users-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((userData) => (
                  <tr key={userData._id}>
                    <td>
                      <div className="user-name">
                        <strong>{userData.firstname} {userData.lastname}</strong>
                      </div>
                    </td>
                    <td>{userData.email}</td>
                    <td>{userData.phoneNo || "N/A"}</td>
                    <td>
                      <span className={`role-badge ${userData.role}`}>
                        {userData.role === "admin" ? "👑 Admin" : "👤 User"}
                      </span>
                    </td>
                    <td>
                      <span className={`status-badge ${userData.status}`}>
                        {userData.status === "active" ? "✅ Active" : "❌ Inactive"}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button
                          onClick={() => handleEdit(userData)}
                          className="edit-btn"
                          title="Edit user"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(userData._id)}
                          className="delete-btn"
                          title="Delete user"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="users-pagination">
              <button
                onClick={() => setPage(page - 1)}
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage(page + 1)}
                disabled={page === totalPages}
                className="pagination-btn"
              >
                Next →
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
