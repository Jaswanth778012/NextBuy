import React, { useEffect, useMemo, useState } from 'react';
import adminProductService from '../../services/adminProductService';
import ProductForm from './ProductForm';
import { FaSearch } from 'react-icons/fa';

function ProductList({ searchKeyword: outerSearchKeyword = '' }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);

  // Search filter operational states
  const [searchInput, setSearchInput] = useState('');
  const [activeSearchTerm, setActiveSearchTerm] = useState('');

  // 🟢 NEW: Pagination Mathematical Control States (User Management System Alignment)
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10); // Standard starting tier: 10 rows

  const [editingStockId, setEditingStockId] = useState(null);
  const [stockValue, setStockValue] = useState('');
  const [updatingStockId, setUpdatingStockId] = useState(null);
  const [statusUpdatingId, setStatusUpdatingId] = useState(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const data = await adminProductService.listProducts();
      setProducts(data || []);
      setError('');
    } catch (err) {
      console.error(err);
      setError('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Reset the current page index whenever search input terms shift to prevent blank views
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setActiveSearchTerm(searchInput);
    setCurrentPage(1);
  };

  const handleResetClick = () => {
    setSearchInput('');
    setActiveSearchTerm('');
    setCurrentPage(1);
  };

  const finalSearchTerm = activeSearchTerm || outerSearchKeyword;

  // 1. Compute completely filtered list sequence array map variations
  const filteredProducts = useMemo(() => {
    if (!finalSearchTerm) return products;

    return products.filter((product) =>
      [
        product.name,
        product.category?.name,
        product.brand?.name,
        product.slug,
      ]
        .filter(Boolean)
        .some((value) =>
          value.toLowerCase().includes(finalSearchTerm.toLowerCase())
        )
    );
  }, [products, finalSearchTerm]);

  // 🟢 NEW: Pagination Logic Math Blocks
  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredProducts.length / itemsPerPage));
  }, [filteredProducts.length, itemsPerPage]);

  // Automatically safe guard bounds constraint checks if filtering shrinks total rows underneath active page index
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);

  // 🟢 NEW: Slice down array data dynamically to fit within boundary coordinates
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProducts.slice(startIndex, endIndex);
  }, [filteredProducts, currentPage, itemsPerPage]);

  const handleItemsPerPageChange = (e) => {
    setItemsPerPage(Number(e.target.value));
    setCurrentPage(1); // Force return sequence loops safely onto standard view index 1
  };

  const formatPrice = (value) => {
    const number = Number(value);
    if (!Number.isFinite(number)) return '0';
    return new Intl.NumberFormat('en-IN').format(number);
  };

  const getDisplayPrice = (product) => {
    return Number(product.finalPrice || 0);
  };

  const getTotalAmount = (product) => {
    const finalPrice = Number(product.finalPrice || 0);
    const quantity = Number(product.stockQuantity || 0);
    return finalPrice * quantity;
  };

  const statusClass = (status) => {
    const normalized = (status || '')
      .toString()
      .trim()
      .toLowerCase();

    if (normalized === 'active') return 'active';
    if (normalized === 'draft') return 'draft';

    return 'inactive';
  };

  const handleCreate = () => {
    setEditing(null);
    setShowForm(true);
  };

  const handleEdit = (product) => {
    const normalizedProduct = {
      ...product,
      id: product.id,
      mrp_price: product.mrp_price || product.price || '',
      stockQuantity: product.stockQuantity || '',
      gstPercentage: product.gstPercentage || '',
      discountPercentage: product.discountPercentage || 0,
      productStatus: product.productStatus || 'ACTIVE',
      productCondition: product.productCondition || 'NEW',
      brandId: product.brand?.id || '',
      categoryId: product.category?.id || '',
      subCategoryId: product.subCategory?.id || '',
    };

    setEditing(normalizedProduct);
    setShowForm(true);
  };

  const handleDelete = async (product) => {
    const productId = product.id;

    if (!productId) {
      alert('Invalid product id');
      return;
    }

    if (!window.confirm(`Delete product "${product.name}"?`)) {
      return;
    }

    try {
      await adminProductService.deleteProduct(product.name, productId);
      fetchProducts();
      alert('Product deleted successfully');
    } catch (err) {
      console.error(err);
      alert(err.response?.data || 'Failed to delete product');
    }
  };

  const handleSaved = () => {
    fetchProducts();
    setShowForm(false);
  };

  const startStockEdit = (product) => {
    setEditingStockId(product.id);
    setStockValue(String(product.stockQuantity || 0));
  };

  const cancelStockEdit = () => {
    setEditingStockId(null);
    setStockValue('');
  };

  const saveStock = async (product) => {
    const currentId = product.id;
    const newStock = Number(stockValue);

    if (Number.isNaN(newStock) || newStock < 0) {
      alert('Please enter valid stock');
      return;
    }

    setUpdatingStockId(currentId);

    try {
      await adminProductService.updateStock(currentId, newStock);

      setProducts((prevProducts) =>
        prevProducts.map((item) => {
          const itemId = item.id;
          return itemId === currentId
            ? {
                ...item,
                stockQuantity: newStock,
              }
            : item;
        })
      );

      cancelStockEdit();
    } catch (err) {
      console.error(err);
      alert('Failed to update stock');
    } finally {
      setUpdatingStockId(null);
    }
  };

  const handleStatusChange = async (product, newStatus) => {
    if (!newStatus) return;

    const currentId = product.id;
    setStatusUpdatingId(currentId);

    try {
      await adminProductService.updateStatus(currentId, newStatus);

      setProducts((prevProducts) =>
        prevProducts.map((item) => {
          const itemId = item.id;
          return itemId === currentId
            ? {
                ...item,
                productStatus: newStatus,
              }
            : item;
        })
      );
    } catch (err) {
      console.error(err);
      alert('Failed to update status');
    } finally {
      setStatusUpdatingId(null);
    }
  };

  return (
    <div className="product-management-card">
      {/* 👑 Top Header Row Area */}
      <div className="product-management-header">
        <div>
          <h2>Product Management</h2>
          <p>Manage the product catalog, stock, and pricing from one place.</p>
        </div>

        <div className="product-count-badge">
          📦 {products.length} Products
        </div>
      </div>

      {/* 🔍 Search Input Bar Row Control Elements */}
      <form onSubmit={handleSearchSubmit} className="users-search-bar">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
          />
        </div>
        <button type="submit" className="primary-button inline-search-btn">
          Search
        </button>
        <button type="button" className="secondary-button inline-reset-btn" onClick={handleResetClick}>
          Reset
        </button>
      </form>

      {/* ➕ Separate Add Product row aligned right */}
      <div className="add-product-row-container">
        <button className="primary-button" onClick={handleCreate}>
          + Add Product
        </button>
      </div>

      {loading && <p className="status-message">Loading products...</p>}
      {error && <p className="status-message error">{error}</p>}

      {!loading && !error && filteredProducts.length === 0 && (
        <p className="status-message">No products found.</p>
      )}

      {/* 📊 Data Grid Table Area */}
      {!loading && !error && filteredProducts.length > 0 && (
        <>
          <div className="table-wrapper">
            <table className="product-table">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Category</th>
                  <th>Brand</th>
                  <th>MRP</th>
                  <th>Discount</th>
                  <th>GST</th>
                  <th>Final Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th style={{ textAlign: 'center' }}>Actions</th>
                </tr>
              </thead>

              <tbody>
                {/* 🟢 MODIFIED: Iterates securely over sliced arrays matching page filters */}
                {paginatedProducts.map((product, index) => {
                  const currentId = product.id;
                  const displayStatus = product.productStatus || 'ACTIVE';
                  const currentStatusValue = displayStatus.toString().toUpperCase();
                  const displayStock = product.stockQuantity || 0;
                  const displayDiscount = product.discountPercentage || 0;

                  // Calibrate numerical indexes based on current active visibility bounds
                  const dynamicRowIndex = (currentPage - 1) * itemsPerPage + index + 1;

                  return (
                    <tr key={currentId || dynamicRowIndex}>
                      <td className="product-cell">
                        {product.imageUrl ? (
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="product-thumb"
                          />
                        ) : (
                          <div className="product-thumb placeholder">No Image</div>
                        )}

                        <div>
                          <strong>{product.name}</strong>
                          <div className="muted-text">
                            {product.slug || product.name}
                          </div>
                        </div>
                      </td>

                      <td>{product.category?.name || '—'}</td>
                      <td>{product.brand?.name || '—'}</td>
                      <td>₹{formatPrice(product.mrp_price || product.price)}</td>
                      <td>{displayDiscount > 0 ? `${displayDiscount}% off` : '0%'}</td>
                      <td>{product.gstPercentage || 0}%</td>
                      <td>₹{formatPrice(getDisplayPrice(product))}</td>

                      <td className="stock-cell">
                        {editingStockId === currentId ? (
                          <div className="stock-editor">
                            <input
                              className="stock-input"
                              type="number"
                              min="0"
                              value={stockValue}
                              onChange={(e) => setStockValue(e.target.value)}
                            />
                            <button
                              type="button"
                              className="primary-button small-action-btn"
                              onClick={() => saveStock(product)}
                              disabled={updatingStockId === currentId}
                            >
                              Save
                            </button>
                            <button 
                              type="button" 
                              className="secondary-button small-action-btn" 
                              onClick={cancelStockEdit}
                            >
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <div className="stock-display-row">
                            <span className="stock-count-pill">{displayStock}</span>
                            <button
                              type="button"
                              className="icon-button"
                              onClick={() => startStockEdit(product)}
                            >
                              ✏️
                            </button>
                          </div>
                        )}
                      </td>

                      <td>
                        <select
                          className={`status-select ${statusClass(currentStatusValue)}`}
                          value={currentStatusValue}
                          onChange={(e) => handleStatusChange(product, e.target.value)}
                          disabled={statusUpdatingId === currentId}
                        >
                          <option value="ACTIVE">Active</option>
                          <option value="DRAFT">Draft</option>
                          <option value="INACTIVE">Inactive</option>
                        </select>
                      </td>

                      <td>
                        <div className="action-row-flex-container">
                          <button className="secondary-button inline-table-btn" onClick={() => handleEdit(product)}>
                            Edit
                          </button>
                          <button className="danger-button inline-table-btn" onClick={() => handleDelete(product)}>
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 🟢 NEW: Complete Pagination Footer Controller. Styled word-for-word like user-management */}
          <div className="pagination-container">
            <div className="pagination-left">
              <span>Show</span>
              <select value={itemsPerPage} onChange={handleItemsPerPageChange}>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
              <span>entries</span>
            </div>

            <div className="pagination-right">
              <button 
                type="button"
                className="pagination-btn" 
                onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </button>
              
              <span className="page-indicator">
                Page {currentPage} of {totalPages}
              </span>

              <button 
                type="button"
                className="pagination-btn" 
                onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

      {showForm && (
        <div className="modal-overlay">
          <div className="product-form-modal">
            <ProductForm
              initialData={editing}
              onClose={() => setShowForm(false)}
              onSaved={handleSaved}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductList;