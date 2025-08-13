import { useState, createContext } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import Register from "./components/Register";
import Product from "./components/Product";
import Cart from "./components/Cart";
import Order from "./components/Order";
import Admin from "./components/Admin";
import Users from "./components/Users";
import Orders from "./components/Orders";
import Header from "./components/Header";
import Profile from "./components/Profile";
import Footer from "./components/Footer";
import Login from "./components/Login";
import Products from "./components/Products";
import Payment from "./components/Payment";
import Home from "./components/Home"; // ✅ New Home component

import "./App.css";

export const AppContext = createContext();

function App() {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState({});

  return (
    <div className="App-Container">
      <AppContext.Provider value={{ cart, setCart, user, setUser }}>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route index element={<Home />} /> {/* ✅ Home page as main route */}
            <Route path="products" element={<Products />} /> {/* ✅ New products route */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="cart" element={<Cart />} />
            <Route path="payment" element={<Payment />} />
            <Route path="order" element={<Order />} />
            <Route path="profile" element={<Profile />} />
            <Route path="admin" element={<Admin />}>
              <Route index element={<Users />} />
              <Route path="products" element={<Product />} /> {/* ✅ Keep old Product component for admin */}
              <Route path="orders" element={<Orders />} />
            </Route>
          </Routes>
          <Footer />
        </BrowserRouter>
      </AppContext.Provider>
    </div>
  );
}

export default App;