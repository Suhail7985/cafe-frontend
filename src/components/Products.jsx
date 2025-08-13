import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import "./Product.css";
import { AppContext } from "../App";

export default function Products() {
  const API_URL = import.meta.env.VITE_API_URL;
  const [allProducts, setAllProducts] = useState([]); // Store all products
  const [displayedProducts, setDisplayedProducts] = useState([]); // Products to display on current page
  const [error, setError] = useState();
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [productsPerPage] = useState(9); // Products per page
  const { user, cart, setCart } = useContext(AppContext);

  // Fetch all products at once
  const fetchAllProducts = async () => {
    try {
      setLoading(true);
      setError("");
      
      // Fetch a large number to get all products (adjust limit as needed)
      const url = `${API_URL}/api/products?page=1&limit=1000`;
      const result = await axios.get(url);
      setAllProducts(result.data.products || []);
      
    } catch (err) {
      console.log(err);
      setError("Something went wrong while fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  // Apply search, sort, and pagination to all products
  useEffect(() => {
    if (allProducts.length === 0) return;

    // 1. Filter products based on search term
    let filtered = allProducts.filter(product =>
      product.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // 2. Sort all filtered products
    let sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.productName.localeCompare(b.productName);
        case "price-low":
          return a.price - b.price;
        case "price-high":
          return b.price - a.price;
        default:
          return 0;
      }
    });

    // 3. Calculate pagination
    const totalFiltered = sorted.length;
    const newTotalPages = Math.ceil(totalFiltered / productsPerPage);
    
    // Reset to page 1 if current page is beyond new total pages
    if (page > newTotalPages) {
      setPage(1);
    }
    
    setTotalPages(newTotalPages);

    // 4. Get products for current page
    const startIndex = (page - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    const pageProducts = sorted.slice(startIndex, endIndex);
    
    setDisplayedProducts(pageProducts);
  }, [allProducts, searchTerm, sortBy, page, productsPerPage]);

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

  const goToPage = (pageNumber) => {
    setPage(pageNumber);
  };

  if (loading) {
    return (
      <div className="products-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading delicious desserts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="products-page">
      {/* Page Header */}
      <div className="page-header">
        <h1>Our Dessert Collection</h1>
        <p>Discover our handcrafted selection of artisanal desserts</p>
        {allProducts.length > 0 && (
          <p className="total-products">Total: {allProducts.length} desserts available</p>
        )}
      </div>

      {/* Search and Filter Section */}
      <div className="search-filter-section">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search desserts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-container">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="name">Sort by Name</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Results Summary */}
      {searchTerm && (
        <div className="results-summary">
          <p>
            Showing {displayedProducts.length} of {allProducts.filter(p => 
              p.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
              p.description.toLowerCase().includes(searchTerm.toLowerCase())
            ).length} results for "{searchTerm}"
          </p>
        </div>
      )}

      {/* Products Grid */}
      <div className="products-container">
        {displayedProducts.length > 0 ? (
          <div className="product-grid">
            {displayedProducts.map((product) => (
              <div key={product._id} className="product-card">
                <div className="product-image-container">
                  <img src={product.imgUrl} alt={product.productName} />
                  <div className="product-overlay">
                    <button
                      className="add-to-cart-btn"
                      onClick={() => addToCart(product)}
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>
                <div className="product-info">
                  <h3 className="product-title">{product.productName}</h3>
                  <p className="product-description">{product.description}</p>
                  <div className="product-price-row">
                    <span className="product-price">₹{product.price}</span>
                    <button
                      className="quick-add-btn"
                      onClick={() => addToCart(product)}
                      aria-label={`Add ${product.productName} to cart`}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-products">
            <div className="no-products-icon">🍰</div>
            <h3>No desserts found</h3>
            <p>
              {searchTerm 
                ? `No desserts match "${searchTerm}". Try different keywords.`
                : "No desserts available at the moment."
              }
            </p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={prevPage} 
            disabled={page === 1}
            className="pagination-btn"
          >
            ← Previous
          </button>
          
          {/* Page Numbers */}
          <div className="page-numbers">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(pageNum => (
              <button
                key={pageNum}
                onClick={() => goToPage(pageNum)}
                className={`page-number ${pageNum === page ? 'active' : ''}`}
              >
                {pageNum}
              </button>
            ))}
          </div>
          
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

      {/* Error Message */}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
}