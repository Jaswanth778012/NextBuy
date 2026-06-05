import React, {
  useEffect,
  useState,
} from "react";

import {
  updateBrand,
} from "../../services/adminBrandService";

import { toast } from "react-toastify";

function EditBrandModal({
  showModal,
  setShowModal,
  selectedBrand,
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

  useEffect(() => {
    if (selectedBrand) {
      setFormData({
        name:
          selectedBrand.name || "",
        description:
          selectedBrand.description ||
          "",
        country:
          selectedBrand.country || "",
      });

      setPreview(
        selectedBrand.logoUrl || ""
      );

      setLogo(null);
    }
  }, [selectedBrand]);

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

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await updateBrand(
          selectedBrand.id,
          formData,
          logo
        );

        toast.success(
          "Brand updated successfully"
        );

        await fetchBrands();

        handleClose();
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update brand"
        );
      } finally {
        setLoading(false);
      }
    };

  if (
    !showModal ||
    !selectedBrand
  )
    return null;

  return (
    <div className="brand-edit-overlay">
      <div className="brand-edit-content">
        <div className="brand-edit-header">
          <h2>Edit Brand</h2>

          <button
            className="brand-edit-close"
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
          <div className="brand-edit-form">
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
              required
            />
          </div>

          <div className="brand-edit-form">
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
              required
            />
          </div>

          <div className="brand-edit-form">
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
            />
          </div>

          <div className="brand-edit-form">
            <label>
              Replace Logo
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
            <div className="brand-edit-image-preview">
              <img
                src={preview}
                alt="Brand Preview"
                className="brand-preview"
              />
            </div>
          )}

          <div className="brand-edit-actions">
            <button
              type="button"
              className="brand-edit-cancel"
              onClick={
                handleClose
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="brand-edit-save"
              disabled={
                loading
              }
            >
              {loading
                ? "Updating..."
                : "Update Brand"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditBrandModal;