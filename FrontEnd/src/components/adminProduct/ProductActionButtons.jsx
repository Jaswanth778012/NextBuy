import React, { useState } from "react";

import {
  FaEdit,
  FaTrash,
  FaBoxes,
  FaPercentage,
} from "react-icons/fa";

import {
  deleteProduct,
  updateProductStock,
  updateDiscount,
  updateProductStatus,
} from "../../services/adminProductService";

import EditProductModal from "./EditProductModal";

function ProductActionButtons({
  product,
  fetchProducts,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  /* =========================
     DELETE PRODUCT
  ========================== */
  const handleDelete = async () => {
    const confirmDelete = window.confirm(
      `Delete ${product.name}?`
    );

    if (!confirmDelete) return;

    try {
      await deleteProduct(product.id);
      await fetchProducts();
    } catch (error) {
      console.error("Delete Error", error);
      alert("Failed to delete product");
    }
  };

  /* =========================
     STOCK UPDATE
  ========================== */
  const handleStockUpdate = async () => {
    const stock = window.prompt(
      "Enter New Stock Quantity",
      product.stockQuantity
    );

    if (!stock || isNaN(stock)) return;

    try {
      await updateProductStock(product.id, Number(stock));
      await fetchProducts();
    } catch (error) {
      console.error("Stock Update Error", error);
      alert("Failed to update stock");
    }
  };

  /* =========================
     DISCOUNT UPDATE
  ========================== */
  const handleDiscountUpdate = async () => {
    const discount = window.prompt(
      "Enter Discount %",
      product.discountPercentage
    );

    if (!discount || isNaN(discount)) return;

    try {
      await updateDiscount(product.id, Number(discount));
      await fetchProducts();
    } catch (error) {
      console.error("Discount Update Error", error);
      alert("Failed to update discount");
    }
  };

  /* =========================
     STATUS UPDATE
  ========================== */
  const handleStatusChange = async (status) => {
    try {
      await updateProductStatus(product.id, status);
      await fetchProducts();
    } catch (error) {
      console.error("Status Update Error", error);
      alert("Failed to update status");
    }
  };

  return (
    <>
      <div className="product-action-group">

        <button
          className="product-action-btn edit-btn"
          onClick={() => setShowEditModal(true)}
          title="Edit Product"
        >
          <FaEdit />
        </button>

        <button
          className="product-action-btn stock-btn"
          onClick={handleStockUpdate}
          title="Update Stock"
        >
          <FaBoxes />
        </button>

        <button
          className="product-action-btn discount-btn"
          onClick={handleDiscountUpdate}
          title="Update Discount"
        >
          <FaPercentage />
        </button>

        <select
          className="product-status-dropdown"
          value={product.productStatus}
          onChange={(e) => handleStatusChange(e.target.value)}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="DRAFT">DRAFT</option>
          <option value="INACTIVE">INACTIVE</option>
        </select>

        <button
          className="product-action-btn delete-btn"
          onClick={handleDelete}
          title="Delete Product"
        >
          <FaTrash />
        </button>

      </div>

      <EditProductModal
        showModal={showEditModal}
        setShowModal={setShowEditModal}
        product={product}
        fetchProducts={fetchProducts}
      />
    </>
  );
}

export default ProductActionButtons;