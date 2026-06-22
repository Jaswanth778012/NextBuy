import React, { useState } from "react";

import { toast } from "react-toastify";

import {
  createAlert,
} from "../../services/wishlistAlertService";

import "../../styles/WishlistAlerts.css";

function WishlistAlertModal({
  product,
  onClose,
  onAlertCreated,
})  {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      alertType: "PRICE_DROP",
      targetPrice: "",
      emailEnabled: true,
    });

  const handleChange = (e) => {
    const {
      name,
      value,
      type,
      checked,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    setLoading(true);

    const payload = {
      productId: product.id,
      alertType: formData.alertType,
      targetPrice:
        formData.alertType === "PRICE_TARGET"
          ? Number(formData.targetPrice)
          : null,
      emailEnabled: formData.emailEnabled,
    };

    const response = await createAlert(payload);

    toast.success(
      "🔔 Alert created successfully"
    );

    // Notify parent component
    if (typeof onAlertCreated === "function") {
      onAlertCreated(product.id);
    }

    onClose();
  } catch (error) {
    console.error(error);

    const message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error?.message ||
      "";

    if (
      message.includes("already exists") ||
      message.includes(
        "An active alert already exists"
      )
    ) {
      toast.warning(
        "🔔 Alert already exists for this product"
      );
    } else {
      toast.error(
        message || "Failed to create alert"
      );
    }
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="modal-overlay">

      <div className="modal-content">

        <h3>
          Create Wishlist Alert
        </h3>

        <div className="product-mini">

          <img
            src={
              product.imageUrls?.[0] ||
              "/placeholder-product.png"
            }
            alt={product.name}
          />

          <div>
            <span>
              {product.name}
            </span>

            <strong>
              ₹
              {Number(
                product.finalPrice
              ).toLocaleString()}
            </strong>
          </div>

        </div>

        <form
          onSubmit={handleSubmit}
        >

          {/* Alert Type */}

          <div className="form-group">

            <label>
              Alert Type
            </label>

            <select
              name="alertType"
              value={
                formData.alertType
              }
              onChange={
                handleChange
              }
            >
              <option value="PRICE_DROP">
                Price Drop
              </option>

              <option value="BACK_IN_STOCK">
                Back In Stock
              </option>

              <option value="PRICE_TARGET">
                Target Price
              </option>

            </select>

          </div>

          {/* Target Price */}

          {formData.alertType ===
            "PRICE_TARGET" && (
            <div className="form-group">

              <label>
                Target Price
              </label>

              <input
                type="number"
                name="targetPrice"
                placeholder="Enter target price"
                value={
                  formData.targetPrice
                }
                onChange={
                  handleChange
                }
                min="1"
                required
              />

            </div>
          )}

          {/* Email */}

          <div className="checkbox-row">

            <label>

              <input
                type="checkbox"
                name="emailEnabled"
                checked={
                  formData.emailEnabled
                }
                onChange={
                  handleChange
                }
              />

              Email Notifications

            </label>

          </div>

          {/* Actions */}

          <div className="modal-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading
                ? "Creating..."
                : "Create Alert"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}

export default WishlistAlertModal;