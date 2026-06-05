import React, {
  useState,
} from "react";

import {
  addBrand,
} from "../../services/adminBrandService";

import { toast } from "react-toastify";

function AddBrandModal({
  showModal,
  setShowModal,
  fetchBrands,
}) {
  const [loading, setLoading] =
    useState(false);

  const [logo, setLogo] =
    useState(null);

  const [preview, setPreview] =
    useState("");

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      country: "",
    });

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (
    e
  ) => {
    const file =
      e.target.files[0];

    if (!file) return;

    setLogo(file);

    setPreview(
      URL.createObjectURL(file)
    );
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      country: "",
    });

    setLogo(null);
    setPreview("");
  };

  const handleClose = () => {
    resetForm();
    setShowModal(false);
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await addBrand(
          formData,
          logo
        );

        toast.success(
          "Brand added successfully"
        );

        await fetchBrands();

        handleClose();
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add brand"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!showModal) return null;

  return (
    <div className="brand-modal-overlay">
      <div className="brandmodal-content">
        <div className="brand-modal-header">
          <h2>Add Brand</h2>

          <button
            className="brand-close"
            onClick={
              handleClose
            }
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={
            handleSubmit
          }
        >
          <div className="brand-form">
            <label>
              Brand Name
            </label>

            <input
              type="text"
              name="name"
              value={
                formData.name
              }
              onChange={
                handleChange
              }
              placeholder="Enter brand name"
              required
            />
          </div>

          <div className="brand-form">
            <label>
              Country
            </label>

            <input
              type="text"
              name="country"
              value={
                formData.country
              }
              onChange={
                handleChange
              }
              placeholder="Enter country"
              required
            />
          </div>

          <div className="brand-form">
            <label>
              Description
            </label>

            <textarea
              rows="4"
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              placeholder="Enter description"
            />
          </div>

          <div className="brand-form">
            <label>
              Brand Logo
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageChange
              }
            />
          </div>

          {preview && (
            <div className="brand-image-preview">
              <img
                src={preview}
                alt="Preview"
                className="brand-preview"
              />
            </div>
          )}

          <div className="brand-modal-actions">
            <button
              type="button"
              className="brand-cancel-btn"
              onClick={
                handleClose
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="brand-save-btn"
              disabled={
                loading
              }
            >
              {loading
                ? "Saving..."
                : "Save Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddBrandModal;