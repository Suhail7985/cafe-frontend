import React, { useContext, useEffect, useRef, useState } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Subscribers.css";

export default function Subscribers() {
  const { user } = useContext(AppContext);
  const [subscribers, setSubscribers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [error, setError] = useState("");
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

  const fetchSubscribers = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/newsletter?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const result = await axios.get(url, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setSubscribers(result.data?.subscribers || []);
      setTotalPages(result.data?.total || 1);
      setError("");
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  useEffect(() => {
    fetchSubscribers();
  }, [page]);

  const handleDelete = async (id) => {
    try {
      const url = `${API_URL}/api/newsletter/${id}`;
      await axios.delete(url, { headers: { Authorization: `Bearer ${user.token}` } });
      fetchSubscribers();
    } catch (err) {
      console.log(err);
      setError("Delete failed");
    }
  };

  const handleExport = async () => {
    try {
      const url = `${API_URL}/api/newsletter/export/csv`;
      const res = await axios.get(url, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const blob = new Blob([res.data], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "subscribers.csv";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.log(err);
      setError("Export failed");
    }
  };

  return (
    <div className="subscribers-container">
      <h2>Subscribers</h2>
      {error && <p className="error-message">{error}</p>}
      <div className="subscribers-actions">
        <div className="search-bar">
          <input
            placeholder="Search by email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <button onClick={() => { setPage(1); fetchSubscribers(); }}>Search</button>
        </div>
        <button className="export-btn" onClick={handleExport}>Export CSV</button>
      </div>
      <table className="subscribers-table">
        <thead>
          <tr>
            <th>Email</th>
            <th>Subscribed At</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subscribers.map((s) => (
            <tr key={s._id}>
              <td>{s.email}</td>
              <td>{new Date(s.createdAt).toLocaleString()}</td>
              <td>
                <button className="delete-btn" onClick={() => handleDelete(s._id)}>Delete</button>
              </td>
            </tr>
          ))}
          {subscribers.length === 0 && (
            <tr>
              <td colSpan="3">No subscribers found.</td>
            </tr>
          )}
        </tbody>
      </table>
      <div className="pagination">
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Previous</button>
        <span>Page {page} of {totalPages}</span>
        <button disabled={page === totalPages} onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}


