import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./Product.css";

export default function Product() {
  const API_URL = import.meta.env.VITE_API_URL;

  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(6);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState();
  const [form, setForm] = useState({
    productName: "",
    description: "",
    price: "",
    imgUrl: "",
  });
  const formRef = useRef();

  const fetchProducts = async () => {
    try {
      setError("Loading...");
      const url = `${API_URL}/api/products?page=${page}&limit=${limit}&search=${encodeURIComponent(
        search
      )}`;
      const result = await axios.get(url);
      setProducts(result.data.products || []);
      setTotalPages(result.data.total || 1);
      setError("");
    } catch (err) {
      console.log(err);
      setError("Something went wrong while fetching products.");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const resetForm = () => {
    setForm({ productName: "", description: "", price: "", imgUrl: "" });
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
      setError("Saving...");
      const url = `${API_URL}/api/products`;
      const payload = {
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        imgUrl: form.imgUrl,
      };
      await axios.post(url, payload);
      resetForm();
      setError("Product added successfully.");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError("Failed to add product.");
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
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const frm = formRef.current;
    if (!frm.checkValidity()) {
      frm.reportValidity();
      return;
    }
    try {
      setError("Updating...");
      const url = `${API_URL}/api/products/${editId}`;
      const payload = {
        productName: form.productName,
        description: form.description,
        price: Number(form.price),
        imgUrl: form.imgUrl,
      };
      await axios.patch(url, payload);
      setEditId(undefined);
      resetForm();
      setError("Product updated successfully.");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError("Failed to update product.");
    }
  };

  const handleCancel = () => {
    setEditId(undefined);
    resetForm();
  };

  const handleDelete = async (id) => {
    try {
      setError("Deleting...");
      const url = `${API_URL}/api/products/${id}`;
      await axios.delete(url);
      setError("Product deleted successfully.");
      fetchProducts();
    } catch (err) {
      console.log(err);
      setError("Failed to delete product.");
    }
  };

  const nextPage = () => {
    if (page < totalPages) setPage(page + 1);
  };

  const prevPage = () => {
    if (page > 1) setPage(page - 1);
  };

  return (
    <div className="product-page">
      <h2>Product Management</h2>
      {error && <p className="error-msg">{error}</p>}

      <div className="admin-actions" style={{ marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Search by name"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button onClick={() => { setPage(1); fetchProducts(); }}>Search</button>
      </div>

      <form ref={formRef} className="product-form" onSubmit={editId ? handleUpdate : handleAdd}>
        <input
          name="productName"
          value={form.productName}
          onChange={handleChange}
          placeholder="Product Name"
          required
        />
        <input
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <input
          name="price"
          type="number"
          step="0.01"
          value={form.price}
          onChange={handleChange}
          placeholder="Price"
          required
        />
        <input
          name="imgUrl"
          value={form.imgUrl}
          onChange={handleChange}
          placeholder="Image URL"
          required
        />
        {editId ? (
          <>
            <button type="submit">Update</button>
            <button type="button" onClick={handleCancel}>Cancel</button>
          </>
        ) : (
          <button type="submit">Add</button>
        )}
      </form>

      <div className="product-grid">
        {products &&
          products.map((product) => (
            <div key={product._id} className="product-card">
              <img src={product.imgUrl} width={120} />
              <h3>{product.productName}</h3>
              <p>{product.description}</p>
              <h4>₹{product.price}</h4>
              <div className="admin-product-actions" style={{ display: "flex", gap: 8 }}>
                <button onClick={() => handleEdit(product)}>Edit</button>
                <button onClick={() => handleDelete(product._id)}>Delete</button>
              </div>
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
    </div>
  );
}