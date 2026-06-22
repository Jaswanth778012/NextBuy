import React, {
  useState,
} from "react";

import {
  updateAlert,
} from "../../services/wishlistAlertService";

import { toast } from "react-toastify";

function WishlistAlertEditModal({
  alert,
  onClose,
  onSuccess,
}) {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      alertType:
        alert.alertType,
      targetPrice:
        alert.targetPrice || "",
      emailEnabled:
        alert.emailEnabled,
    });

  const handleChange = (e) => {
    const {
      name,
      value,
      checked,
      type,
    } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : value,
    }));
  };

  const handleSubmit = async (
    e
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      await updateAlert(
        alert.id,
        {
          alertType:
            formData.alertType,

          targetPrice:
            formData.alertType ===
            "PRICE_TARGET"
              ? Number(
                  formData.targetPrice
                )
              : null,

          emailEnabled:
            formData.emailEnabled,
        }
      );

      toast.success(
        "Alert updated"
      );

      onSuccess();
      onClose();
    } catch (error) {
      toast.error(
        "Failed to update alert"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content alert-edit-modal">

        <h3>
          Edit Alert
        </h3>

        <form
          onSubmit={
            handleSubmit
          }
        >
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

          {formData.alertType ===
            "PRICE_TARGET" && (
            <div className="form-group">

              <label>
                Target Price
              </label>

              <input
                type="number"
                name="targetPrice"
                value={
                  formData.targetPrice
                }
                onChange={
                  handleChange
                }
              />

            </div>
          )}

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

          <div className="modal-actions">

            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="btn-save"
              disabled={loading}
            >
              {loading
                ? "Updating..."
                : "Update Alert"}
            </button>

          </div>

        </form>

      </div>
    </div>
  );
}

export default WishlistAlertEditModal;