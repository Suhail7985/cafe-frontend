import React, { useEffect, useRef, useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../App";
import "./Product.css";

export default function Product() {
  const { user } = useContext(AppContext);
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const formRef = useRef();

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError("");
      const url = `${API_URL}/api/products?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`;
      const result = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setProducts(result.data.products || []);
      setTotalPages(result.data.total || 1);
    } catch (err) {
      console.log(err);
      setError("Failed to fetch products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.token) {
      fetchProducts();
    }
  }, [page, user]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (search !== undefined) {
        setPage(1);
        fetchProducts();
      }
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);

  const resetForm = () => {
    setForm({ productName: "", description: "", price: "", imgUrl: "" });
    setEditId(null);
    setShowForm(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const frm = formRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      setError("Adding product...");
      const url = `${API_URL}/api/products`;
      const payload = {
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        imgUrl: form.imgUrl,
      };
      await axios.post(url, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      resetForm();
      setError("");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to add product.");
    }
  };

  const handleEdit = (prod) => {
    setEditId(prod._id);
    setForm({
      productName: prod.productName || "",
      description: prod.description || "",
      price: String(prod.price ?? ""),
      imgUrl: prod.imgUrl || "",
    });
    setShowForm(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const frm = formRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      setError("Updating product...");
      const url = `${API_URL}/api/products/${editId}`;
      const payload = {
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        imgUrl: form.imgUrl,
      };
      await axios.patch(url, payload, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setEditId(null);
      resetForm();
      setError("");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to update product.");
    }
  };

  const handleCancel = () => {
    resetForm();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) {
      return;
    }
    try {
      setError("Deleting product...");
      const url = `${API_URL}/api/products/${id}`;
      await axios.delete(url, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      });
      setError("");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError(err.response?.data?.message || "Failed to delete product.");
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="product-management-page">
      <div className="product-management-header">
        <h2>🍰 Product Management</h2>
        <button 
          className="add-product-btn"
          onClick={() => {
            resetForm();
            setShowForm(!showForm);
          }}
        >
          {showForm ? "✕ Cancel" : "+ Add New Product"}
        </button>
      </div>

      {error && (
        <div className={`error-message ${error.includes("successfully") || error.includes("Adding") || error.includes("Updating") || error.includes("Deleting") ? "info" : ""}`}>
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="product-search-bar">
        <input
          type="text"
          placeholder="🔍 Search products by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="product-search-input"
        />
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <form ref={formRef} className="product-form" onSubmit={editId ? handleUpdate : handleAdd}>
          <h3>{editId ? "Edit Product" : "Add New Product"}</h3>
          <div className="product-form-grid">
            <div className="form-group">
              <label>Product Name *</label>
              <input
                name="productName"
                value={form.productName}
                onChange={handleChange}
                placeholder="e.g., Chocolate Cake"
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Description *</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Product description..."
                rows="3"
                required
              />
            </div>
            <div className="form-group">
              <label>Price (₹) *</label>
              <input
                name="price"
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={handleChange}
                placeholder="0.00"
                required
              />
            </div>
            <div className="form-group full-width">
              <label>Image URL *</label>
              <input
                name="imgUrl"
                type="url"
                value={form.imgUrl}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              {editId ? "Update Product" : "Add Product"}
            </button>
            <button type="button" onClick={handleCancel} className="cancel-btn">
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Products Grid */}
      {loading && products.length === 0 ? (
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading products...</p>
        </div>
      ) : products.length === 0 ? (
        <div className="empty-products">
          <div className="empty-icon">🍰</div>
          <h3>No Products Found</h3>
          <p>{search ? "Try a different search term." : "Start by adding a new product."}</p>
        </div>
      ) : (
        <>
          <div className="admin-product-grid">
            {products.map((product) => (
              <div key={product._id} className="admin-product-card">
                <div className="admin-product-image">
                  <img src={product.imgUrl} alt={product.productName} />
                </div>
                <div className="admin-product-info">
                  <h3 className="admin-product-name">{product.productName}</h3>
                  <p className="admin-product-description">{product.description}</p>
                  <div className="admin-product-price">₹{product.price}</div>
                </div>
                <div className="admin-product-actions">
                  <button 
                    onClick={() => handleEdit(product)} 
                    className="edit-product-btn"
                    title="Edit product"
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(product._id)} 
                    className="delete-product-btn"
                    title="Delete product"
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="product-pagination">
              <button 
                onClick={prevPage} 
                disabled={page === 1}
                className="pagination-btn"
              >
                ← Previous
              </button>
              <span className="page-info">
                Page {page} of {totalPages}
              </span>
              <button 
                onClick={nextPage} 
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
