import React, {
  useEffect,
  useState,
} from "react";

import {
  updateCategory,
} from "../../services/adminCategoryService";

import { toast } from "react-toastify";

function EditCategoryModal({
  showModal,
  setShowModal,
  selectedCategory,
  fetchCategories,
}) {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
    });

  useEffect(() => {
    if (selectedCategory) {
      setFormData({
        name:
          selectedCategory.name || "",
        description:
          selectedCategory.description ||
          "",
      });
    }
  }, [selectedCategory]);

  const handleChange = (e) => {
    const { name, value } =
      e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      try {
        setLoading(true);

        await updateCategory(
          selectedCategory.id,
          formData
        );

        toast.success(
          "Category updated successfully"
        );

        await fetchCategories();

        handleClose();
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update category"
        );
      } finally {
        setLoading(false);
      }
    };

  if (
    !showModal ||
    !selectedCategory
  )
    return null;

  return (
    <div className="category-edit-overlay">
      <div className="category-edit-content">
        <div className="category-edit-header">
          <h2>
            Edit Category
          </h2>

          <button
            className="category-edit-close"
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
          <div className="category-edit-form">
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
              required
            />
          </div>

          <div className="category-edit-form">
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
            />
          </div>

          <div className="category-edit-actions">
            <button
              type="button"
              className="category-edit-cancel"
              onClick={
                handleClose
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="category-edit-save"
              disabled={
                loading
              }
            >
              {loading
                ? "Updating..."
                : "Update Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditCategoryModal;