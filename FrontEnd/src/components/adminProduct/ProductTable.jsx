import React, {
  useState,
} from "react";

import {
  FaEdit,
  FaTrash,
  FaPen,
} from "react-icons/fa";

import { toast } from "react-toastify";

import {
  deleteProduct,
  updateDiscount,
  updateProductStatus,
  updateProductStock,
} from "../../services/adminProductService";

import ProductActionButtons from "./ProductActionButtons";

function ProductTable({
  products,
  fetchProducts,
  openEditModal,
}) {

  const [
    editingStockId,
    setEditingStockId,
  ] = useState(null);

  const [
    stockValue,
    setStockValue,
  ] = useState("");

  const [
    editingDiscountId,
    setEditingDiscountId,
  ] = useState(null);

  const [
    discountValue,
    setDiscountValue,
  ] = useState("");

  const handleStatusUpdate =
    async (id, status) => {

      try {

        await updateProductStatus(
          id,
          status
        );

        toast.success(
          "Status updated"
        );

        fetchProducts();

      } catch {

        toast.error(
          "Failed to update status"
        );
      }
    };

  const handleSaveStock =
    async (id) => {

      try {

        await updateProductStock(
          id,
          stockValue
        );

        toast.success(
          "Stock updated"
        );

        setEditingStockId(
          null
        );

        fetchProducts();

      } catch {

        toast.error(
          "Failed to update stock"
        );
      }
    };

  const handleSaveDiscount =
    async (id) => {

      try {

        await updateDiscount(
          id,
          discountValue
        );

        toast.success(
          "Discount updated"
        );

        setEditingDiscountId(
          null
        );

        fetchProducts();

      } catch {

        toast.error(
          "Failed to update discount"
        );
      }
    };

  const handleDelete =
    async (product) => {

      try {

        await deleteProduct(
          product.id
        );

        toast.success(
          "Product deleted"
        );

        fetchProducts();

      } catch {

        toast.error(
          "Failed to delete"
        );
      }
    };

  return (

    <div className="product-table-shell">

      <div className="product-table-wrapper">

        <table className="product-grid-table">

          <thead>

            <tr>

              <th>ID</th>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Sub Category</th>
              <th>MRP</th>
              <th>Discount %</th>
              <th>GST %</th>
              <th>Final Price</th>
              <th>Status</th>
              <th>Stock</th>
              <th>Actions</th>

            </tr>

          </thead>

          <tbody>

            {products.length === 0 ? (

              <tr>

                <td
                  colSpan="12"
                  className="empty-products"
                >
                  No Products Found
                </td>

              </tr>

            ) : (

              products.map(
                (product) => (

                  <tr
                    key={product.id}
                  >

                    <td>
                      {product.id}
                    </td>

                    <td>

  <img
    src={
      product.imageUrls?.[0] ||
      "/no-image.png"
    }
    alt={product.name}
    className="product-thumb"
  />

</td>

                    <td>
                      {product.name}
                    </td>

                    <td>
                      {
                        product.category
                          ?.name
                      }
                    </td>

                    <td>
                      {
                        product.subCategory
                          ?.name
                      }
                    </td>

                    <td>
                      ₹
                      {product.mrp_price?.toLocaleString()}
                    </td>

                    <td>

                      {editingDiscountId ===
                      product.id ? (

                        <div className="inline-editor">

                          <input
                            type="number"
                            value={
                              discountValue
                            }
                            onChange={(e) =>
                              setDiscountValue(
                                e.target.value
                              )
                            }
                          />

                          <button
                            onClick={() =>
                              handleSaveDiscount(
                                product.id
                              )
                            }
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingDiscountId(
                                null
                              )
                            }
                          >
                            Cancel
                          </button>

                        </div>

                      ) : (

                        <div className="inline-value">

                          {
                            product.discountPercentage
                          }%

                          <FaPen
                            className="edit-icon"
                            onClick={() => {

                              setEditingDiscountId(
                                product.id
                              );

                              setDiscountValue(
                                product.discountPercentage
                              );
                            }}
                          />

                        </div>

                      )}

                    </td>

                    <td>
                      {
                        product.gstPercentage
                      }%
                    </td>

                    <td>
                      ₹
                      {product.finalPrice?.toLocaleString()}
                    </td>

                    <td>

                      <select
                        value={
                          product.productStatus
                        }
                        onChange={(e) =>
                          handleStatusUpdate(
                            product.id,
                            e.target.value
                          )
                        }
                      >

                        <option value="ACTIVE">
                          ACTIVE
                        </option>

                        <option value="DRAFT">
                          DRAFT
                        </option>

                        <option value="INACTIVE">
                          INACTIVE
                        </option>

                      </select>

                    </td>

                    <td>

                      {editingStockId ===
                      product.id ? (

                        <div className="inline-editor">

                          <input
                            type="number"
                            value={
                              stockValue
                            }
                            onChange={(e) =>
                              setStockValue(
                                e.target.value
                              )
                            }
                          />

                          <button
                            onClick={() =>
                              handleSaveStock(
                                product.id
                              )
                            }
                          >
                            Save
                          </button>

                          <button
                            onClick={() =>
                              setEditingStockId(
                                null
                              )
                            }
                          >
                            Cancel
                          </button>

                        </div>

                      ) : (

                        <div className="inline-value">

                          {
                            product.stockQuantity
                          }

                          <FaPen
                            className="edit-icon"
                            onClick={() => {

                              setEditingStockId(
                                product.id
                              );

                              setStockValue(
                                product.stockQuantity
                              );
                            }}
                          />

                        </div>

                      )}

                    </td>

                    <td>

                      <div className="product-actions">

                        <button
                          className="edit-btn"
                          onClick={() =>
                            openEditModal(
                              product
                            )
                          }
                        >
                          <FaEdit />
                        </button>

                        <button
                          className="delete-btn"
                          onClick={() =>
                            handleDelete(
                              product
                            )
                          }
                        >
                          <FaTrash />
                        </button>

                      </div>

                    </td>

                  </tr>

                )
              )

            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default ProductTable;