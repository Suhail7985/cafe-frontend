import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import "./Header.css";

import App, { AppContext } from "../App";
export default function Header() {
  const { user, cart } = useContext(AppContext);
  
  return (
    <header className="header">
    <div className="header-left">
        <h1>The Dessert Lab</h1>
    </div>
    <nav className="header-right">
      
      <Link to="/">Home</Link> 
      <Link to="/cart">MyCart
      {cart.length > 0 && `(${cart.length})`} </Link>

      
      <Link to="/order">MyOrder</Link>
      {/* <Link to="/admin">Admin</Link> */}

      {user?.role === "admin" && <Link to="/admin">Admin</Link>}
      
      {user?.token ? <Link to="/profile">Profile</Link> : <Link to="/login">Login</Link> }


    </nav>
    </header>
  );
}