import React, { useEffect, useState } from "react";

import { createFestivalBanner } from "../../services/adminFestivalBannerService";

import { getAllCategories } from "../../services/adminCategoryService";

import { getSubCategoriesByCategory } from "../../services/adminSubCategoryService";

import { viewAllProducts } from "../../services/adminProductService";


import Select from "react-select";

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

  categories: [],
  subCategories: [],
  productIds: [],
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
  console.log(
    "name:",
    e.target.name,
    "value:",
    e.target.value,
    "type:",
    e.type
  );

  const { name, value, type, checked } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: type === "checkbox" ? checked : value,
  }));
};
  const handleCategoryChange = async (selectedOptions) => {
  const selectedCategories =
    selectedOptions?.map((item) => item.label) || [];

  setFormData((prev) => ({
    ...prev,
    categories: selectedCategories,
    subCategories: [],
  }));

  if (!selectedOptions || selectedOptions.length === 0) {
    setSubCategories([]);
    return;
  }

  let allSubCategories = [];

  for (const item of selectedOptions) {
    const response =
      await getSubCategoriesByCategory(item.value);

    allSubCategories.push(...response);
  }

  const uniqueSubs = [
    ...new Map(
      allSubCategories.map((sub) => [sub.id, sub])
    ).values(),
  ];

  setSubCategories(uniqueSubs);
};

const handleSubCategoryChange = (selectedOptions) => {
  setFormData((prev) => ({
    ...prev,
    subCategories:
      selectedOptions?.map((item) => item.label) || [],
  }));
};

const handleProductChange = (selectedOptions) => {
  setFormData((prev) => ({
    ...prev,
    productIds:
      selectedOptions?.map((item) => item.value) || [],
  }));
};
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
       console.log("Priority in state:", formData.priority);

const payload = {
  festivalName: formData.festivalName,
  title: formData.title,
  subtitle: formData.subtitle,
  redirectUrl: formData.redirectUrl,
  startDate: formData.startDate,
  endDate: formData.endDate,
  priority: formData.priority,
  active: formData.active,

  categories: formData.categories,
  subCategories: formData.subCategories,
  productIds: formData.productIds,
};

  console.log(payload);
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
    {/* Row 1 */}

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

    {/* Row 2 */}

    <div className="form-group">
      <label>Priority</label>
      <input
        type="number"
        name="priority"
        placeholder="Priority"
        value={formData.priority}
        onChange={handleChange}
      />
    </div>

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

  <h4>Categories</h4>

  <Select
    isMulti
    value={categories
      .filter((cat) =>
        formData.categories.includes(cat.name)
      )
      .map((cat) => ({
        value: cat.id,
        label: cat.name,
      }))
    }
    isDisabled={formData.productIds.length > 0}
    options={categories.map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))}
    onChange={handleCategoryChange}
  />

  <h4 style={{ marginTop: "15px" }}>
    Sub Categories
  </h4>

  <Select
    isMulti
    value={subCategories
      .filter((sub) =>
        formData.subCategories.includes(sub.name)
      )
      .map((sub) => ({
        value: sub.id,
        label: sub.name,
      }))
    }
    isDisabled={formData.productIds.length > 0}
    options={subCategories.map((sub) => ({
      value: sub.id,
      label: sub.name,
    }))}
    onChange={handleSubCategoryChange}
  />

  <h4 style={{ marginTop: "15px" }}>
    Products
  </h4>

  <Select
    isMulti
    value={products
      .filter((product) =>
        formData.productIds.includes(product.id)
      )
      .map((product) => ({
        value: product.id,
        label: product.name,
      }))
    }
    isDisabled={
      formData.categories.length > 0 ||
      formData.subCategories.length > 0
    }
    options={products.map((product) => ({
      value: product.id,
      label: product.name,
    }))}
    onChange={handleProductChange}
  />

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
</form>      </div>
    </div>
  );
}

export default AddFestivalBannerModal;
