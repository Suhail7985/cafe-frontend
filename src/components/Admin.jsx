import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import "./Admin.css";

export default function Admin() {
  return (
    <div className="admin-container">
      <div className="admin-nav">
        <NavLink to="/admin" end>Users</NavLink>
        <NavLink to="/admin/products">Products</NavLink>
        <NavLink to="/admin/orders">Orders</NavLink>
      </div>
      <div className="admin-content">
        <Outlet />
      </div>
    </div>
  );
}