import React, { useEffect, useState } from "react";

import { createFestivalBanner } from "../../services/adminFestivalBannerService";

import { getAllCategories } from "../../services/adminCategoryService";

import { getSubCategoriesByCategory } from "../../services/adminSubCategoryService";

import { viewAllProducts } from "../../services/adminProductService";

function AddFestivalBannerModal({ showModal, setShowModal, fetchBanners }) {
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [products, setProducts] = useState([]);

  const [formData, setFormData] = useState({
    festivalName: "",
    title: "",
    subtitle: "",
    redirectUrl: "",
    startDate: "",
    endDate: "",
    priority: "",
    active: true,
    Category: "",
    SubCategory: "",
    Product: "",
  });

  useEffect(() => {
    if (showModal) {
      loadDropdowns();
    }
  }, [showModal]);

  const loadDropdowns = async () => {
    try {
      const [categoryRes, productRes] = await Promise.all([
        getAllCategories(),
        viewAllProducts(),
      ]);

      setCategories(categoryRes || []);

      setProducts(productRes?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleCategoryChange = async (e) => {
    const categoryId = e.target.value;

    const selectedCategory = categories.find(
      (cat) => cat.id === Number(categoryId),
    );

    setFormData((prev) => ({
      ...prev,
      Category: selectedCategory?.name || "",
      SubCategory: "",
    }));

    try {
      const response = await getSubCategoriesByCategory(categoryId);

      setSubCategories(response || []);
    } catch (error) {
      console.error(error);

      setSubCategories([]);
    }
  };

  const handleSubCategoryChange = (e) => {
    const selectedSubCategory = subCategories.find(
      (sub) => sub.id === Number(e.target.value),
    );

    setFormData((prev) => ({
      ...prev,
      SubCategory: selectedSubCategory?.name || "",
    }));
  };

  const handleProductChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      Product: e.target.value,
      Category: "",
      SubCategory: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
        ...formData,
      };

      await createFestivalBanner(payload, image);

      await fetchBanners();

      setShowModal(false);
    } catch (error) {
      console.error("Create Banner Error", error);
    } finally {
      setLoading(false);
    }
  };

  if (!showModal) {
    return null;
  }

  return (
    <div className="festival-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="festival-modal" onClick={(e) => e.stopPropagation()}>
        <div className="festival-modal-header">
          <h2>Add Festival Banner</h2>

          <button
            className="festival-modal-close"
            onClick={() => setShowModal(false)}
          >
            ✕
          </button>
        </div>

        <form className="festival-form" onSubmit={handleSubmit}>
          <div className="festival-form-grid">
            <input
              type="text"
              name="festivalName"
              placeholder="Festival Name"
              value={formData.festivalName}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="title"
              placeholder="Banner Title"
              value={formData.title}
              onChange={handleChange}
              required
            />

            <input
              type="text"
              name="subtitle"
              placeholder="Subtitle"
              value={formData.subtitle}
              onChange={handleChange}
            />

            <div className="festival-form-grid">
              <div className="form-group">
                <label>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <input
              type="number"
              name="priority"
              placeholder="Priority"
              value={formData.priority}
              onChange={handleChange}
            />
          </div>

          {/* CATEGORY */}

          <select onChange={handleCategoryChange} disabled={!!formData.Product}>
            <option value="">Select Category</option>

            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          {/* SUBCATEGORY */}

          <select
            onChange={handleSubCategoryChange}
            disabled={!!formData.Product}
          >
            <option value="">Select Sub Category</option>

            {subCategories.map((sub) => (
              <option key={sub.id} value={sub.id}>
                {sub.name}
              </option>
            ))}
          </select>

          {/* PRODUCT */}

          <select
            value={formData.Product}
            onChange={handleProductChange}
            disabled={!!formData.Category || !!formData.SubCategory}
          >
            <option value="">Select Product</option>

            {products.map((product) => (
              <option key={product.id} value={product.name}>
                {product.name}
              </option>
            ))}
          </select>

          <label className="festival-checkbox">
            <input
              type="checkbox"
              name="active"
              checked={formData.active}
              onChange={handleChange}
            />
            Active Banner
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            required
          />

          {image && (
            <img
              src={URL.createObjectURL(image)}
              alt="Preview"
              className="festival-preview-image"
            />
          )}

          <button
            type="submit"
            className="festival-submit-btn"
            disabled={loading}
          >
            {loading ? "Creating..." : "Create Banner"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default AddFestivalBannerModal;
