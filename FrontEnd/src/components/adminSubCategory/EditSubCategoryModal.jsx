import React, {
  useEffect,
  useState,
} from "react";

import {
  updateSubCategory,
} from "../../services/adminSubCategoryService";

import { toast } from "react-toastify";

function EditSubCategoryModal({
  showModal,
  setShowModal,
  selectedSubCategory,
  categories,
  fetchData,
}) {
  const [loading, setLoading] =
    useState(false);

  const [formData, setFormData] =
    useState({
      name: "",
      description: "",
      categoryId: "",
    });

  useEffect(() => {
    if (selectedSubCategory) {
      setFormData({
        name:
          selectedSubCategory.name ||
          "",
        description:
          selectedSubCategory.description ||
          "",
        categoryId:
          selectedSubCategory.categoryId ||
          "",
      });
    }
  }, [selectedSubCategory]);

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

        await updateSubCategory(
          selectedSubCategory.id,
          formData
        );

        toast.success(
          "Sub category updated successfully"
        );

        await fetchData();

        handleClose();
      } catch (error) {
        console.error(error);

        toast.error(
          error?.response?.data
            ?.message ||
            "Failed to update sub category"
        );
      } finally {
        setLoading(false);
      }
    };

  if (
    !showModal ||
    !selectedSubCategory
  )
    return null;

  return (
    <div className="subcate-edit-overlay">
      <div className="subcate-edit-content">
        <div className="subcate-edit-header">
          <h2>
            Edit Sub Category
          </h2>

          <button
            className="subcate-edit-close"
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
          <div className="subcate-edit-form">
            <label>
              Category
            </label>

            <select
              name="categoryId"
              value={
                formData.categoryId
              }
              onChange={
                handleChange
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

          <div className="subcate-edit-form">
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
              required
            />
          </div>

          <div className="subcate-edit-form">
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

          <div className="subcate-edit-actions">
            <button
              type="button"
              className="subcate-edit-cancel"
              onClick={
                handleClose
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="subcate-edit-save"
              disabled={
                loading
              }
            >
              {loading
                ? "Updating..."
                : "Update Sub Category"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditSubCategoryModal;