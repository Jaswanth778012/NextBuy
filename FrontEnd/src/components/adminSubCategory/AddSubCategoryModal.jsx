import React, {
  useState,
} from "react";

import {
  addSubCategory,
} from "../../services/adminSubCategoryService";

import { toast } from "react-toastify";

function AddSubCategoryModal({
  showModal,
  setShowModal,
  categories,
  fetchData,
}) {
  const [loading, setLoading] =
    useState(false);

  const [categoryId,
    setCategoryId] =
    useState("");

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

  const handleClose = () => {
    setFormData({
      name: "",
      description: "",
    });

    setCategoryId("");

    setShowModal(false);
  };

  const handleSubmit =
    async (e) => {
      e.preventDefault();

      if (!categoryId) {
        toast.error(
          "Please select a category"
        );
        return;
      }

      try {
        setLoading(true);

        await addSubCategory(
          categoryId,
          formData
        );

        toast.success(
          "Sub category added successfully"
        );

        await fetchData();

        handleClose();
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to add sub category"
        );
      } finally {
        setLoading(false);
      }
    };

  if (!showModal) return null;

  return (
    <div className="subcate-modal-overlay">
      <div className="subcate-modal-content">
        <div className="subcate-modal-header">
          <h2>
            Add Sub Category
          </h2>

          <button
            className="subcate-close"
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
          <div className="subcate-form">
            <label>
              Category
            </label>

            <select
              value={
                categoryId
              }
              onChange={(e) =>
                setCategoryId(
                  e.target.value
                )
              }
              required
            >
              <option value="">
                Select Category
              </option>

              {categories.map(
                (
                  category
                ) => (
                  <option
                    key={
                      category.id
                    }
                    value={
                      category.id
                    }
                  >
                    {
                      category.name
                    }
                  </option>
                )
              )}
            </select>
          </div>

          <div className="subcate-form">
            <label>
              Sub Category Name
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
              placeholder="Enter sub category name"
              required
            />
          </div>

          <div className="subcate-form">
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

          <div className="subcate-modal-actions">
            <button
              type="button"
              className="subcate-cancel"
              onClick={
                handleClose
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="subcate-save"
              disabled={
                loading
              }
            >
              {loading
                ? "Saving..."
                : "Save Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddSubCategoryModal;