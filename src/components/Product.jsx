import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Product.css";
import { AppContext } from "../App";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { user, cart, setCart } = useContext(AppContext);

  const fetchProducts = async (page) => {
    try {
      setError("Loding");
      const url = `${API_URL}/api/products?page=${page}&limit=6`;
      const result = await axios.get(url);
      setProducts(result.data.products);
      setTotalPages(result.data.total);
      setError()
    } catch (err) {
      console.log(err);
      setError("Something went wrong");
    }
  };

  useEffect(() => {
    fetchProducts(page);
  }, [page]);

const addToCart = (product) => {
  setCart((prevCart) => {
    const found = prevCart.find((item) => item._id === product._id);
    if (found) {
      // Already in cart → do nothing
      return prevCart;
    } else {
      // Not in cart → add it
      return [...prevCart, { ...product, qty: 1 }];
    }
  });
};

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="product-page">
      {user?.firstname && (
        <h3 className="user-name">Welcome, {user.firstname}</h3>
      )}

      <div className="product-grid">
        {products &&
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.imgUrl} width={100} />
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <h4>₹{product.price}</h4>
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to Cart
              </button>
            </div>
          ))}
      </div>

      <div className="pagination">
        <button onClick={prevPage} disabled={page === 1}>
          Previous
        </button>
        <span>
          Page {page} of {totalPages}
        </span>
        <button onClick={nextPage} disabled={page === totalPages}>
          Next
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}