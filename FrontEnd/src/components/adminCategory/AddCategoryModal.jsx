import React, {
  useState,
} from "react";

import {
  addCategory,
} from "../../services/adminCategoryService";

import { toast } from "react-toastify";

function AddCategoryModal({
  showModal,
  setShowModal,
  fetchCategories,
}) {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
    });

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
    });
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

        await addCategory(
          formData
        );

        toast.success(
          "Category added successfully"
        );

        await fetchCategories();

        handleClose();
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add category"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!showModal) return null;

  return (
    <div className="category-modal-overlay">
      <div className="category-modal-content">
        <div className="category-modal-header">
          <h2>
            Add Category
          </h2>

          <button
            className="category-modal-close"
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
          <div className="category-form">
            <label>
              Category Name
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
              placeholder="Enter category name"
              required
            />
          </div>

          <div className="category-form">
            <label>
              Description
            </label>

            <textarea
              name="description"
              value={
                formData.description
              }
              onChange={
                handleChange
              }
              rows="4"
              placeholder="Enter description"
            />
          </div>

          <div className="category-modal-actions">
            <button
              type="button"
              className="category-cancel"
              onClick={
                handleClose
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="category-save-btn"
              disabled={
                loading
              }
            >
              {loading
                ? "Saving..."
                : "Save Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddCategoryModal;