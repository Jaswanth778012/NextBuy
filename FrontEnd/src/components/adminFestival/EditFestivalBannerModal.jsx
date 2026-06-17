import React, { useEffect, useState } from "react";

import { updateFestivalBanner } from "../../services/adminFestivalBannerService";

import { getAllCategories } from "../../services/adminCategoryService";

import { getSubCategoriesByCategory } from "../../services/adminSubCategoryService";

import { viewAllProducts } from "../../services/adminProductService";

import Select from "react-select";

function EditFestivalBannerModal({
  showModal,
  setShowModal,
  banner,
  fetchBanners,
}) {
  const [loading, setLoading] = useState(false);

  const [image, setImage] = useState(null);

  const [categories, setCategories] = useState([]);

  const [subCategories, setSubCategories] = useState([]);

  const [products, setProducts] = useState([]);
const [formData, setFormData] = useState({
  festivalName: "",
  title: "",
  subtitle: "",
  description: "",
  startDate: "",
  endDate: "",
  priority: "",
  active: true,

  categories: [],
  subCategories: [],
  productIds: [],
});

  useEffect(() => {
    if (showModal && banner) {
      initializeModal();
    }
  }, [showModal, banner]);

  const initializeModal = async () => {
    try {
      const [categoryRes, productRes] = await Promise.all([
        getAllCategories(),
        viewAllProducts(),
      ]);

      setCategories(categoryRes || []);

      setProducts(productRes?.data || []);

      setFormData({
  festivalName: banner.festivalName || "",
  title: banner.title || "",
  subtitle: banner.subtitle || "",
  description: banner.description || "",
 startDate: banner.startDate
  ? banner.startDate.split("T")[0]
  : "",

endDate: banner.endDate
  ? banner.endDate.split("T")[0]
  : "",
  priority: banner.priority || 1,
  active: banner.active ?? true,

  categories: banner.categories || [],
  subCategories: banner.subCategories || [],

  productIds:
    banner.products?.map((product) => product.id) || [],
});

if (banner.categories?.length > 0) {
  let allSubs = [];

  for (const category of categoryRes) {
    if (banner.categories.includes(category.name)) {
      const response =
        await getSubCategoriesByCategory(category.id);

      allSubs.push(...response);
    }
  }

  const uniqueSubs = [
    ...new Map(
      allSubs.map((sub) => [sub.id, sub])
    ).values(),
  ];

  setSubCategories(uniqueSubs);
}
    } catch (error) {
      console.error(error);
    }
  };

const handleChange = (e) => {
  console.log(
    "name:",
    e.target.name,
    "value:",
    e.target.value
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
    productIds: [],
  }));

  if (!selectedOptions?.length) {
    setSubCategories([]);
    return;
  }

  let allSubs = [];

  for (const item of selectedOptions) {
    const response =
      await getSubCategoriesByCategory(item.value);

    allSubs.push(...response);
  }

  const uniqueSubs = [
    ...new Map(
      allSubs.map((sub) => [sub.id, sub])
    ).values(),
  ];

  setSubCategories(uniqueSubs);
};

 const handleSubCategoryChange = (selectedOptions) => {
  setFormData((prev) => ({
    ...prev,
    subCategories:
      selectedOptions?.map((item) => item.label) || [],
    productIds: [],
  }));
};

const handleProductChange = (selectedOptions) => {
  setFormData((prev) => ({
    ...prev,
    productIds:
      selectedOptions?.map((item) => item.value) || [],

    categories: [],
    subCategories: [],
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const payload = {
  festivalName: formData.festivalName,
  title: formData.title,
  subtitle: formData.subtitle,
  description: formData.description,
  startDate: formData.startDate,
  endDate: formData.endDate,
  priority: formData.priority,
  active: formData.active,

  categories: formData.categories,
  subCategories: formData.subCategories,
  productIds: formData.productIds,
};

await updateFestivalBanner(
  banner.id,
  payload,
  image
);

toast.success("Festival banner updated successfully");

      await fetchBanners();

      setShowModal(false);
    } catch (error) {
      console.error("Update Banner Error", error);
      toast.error(
      error?.response?.data?.message ||
      "Failed to update festival banner"
    );
    } finally {
      setLoading(false);
    }
  };

  if (!showModal || !banner) {
    return null;
  }

  return (
    <div className="festival-modal-overlay" onClick={() => setShowModal(false)}>
      <div className="festival-modal" onClick={(e) => e.stopPropagation()}>
        <div className="festival-modal-header">
          <h2>Edit Festival Banner</h2>

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

          {/* CATEGORY */}

          <h4>Categories</h4>

<Select
  isMulti
  isDisabled={formData.productIds.length > 0}
  value={categories
    .filter((cat) =>
      formData.categories.includes(cat.name)
    )
    .map((cat) => ({
      value: cat.id,
      label: cat.name,
    }))
  }
  options={categories.map((cat) => ({
    value: cat.id,
    label: cat.name,
  }))}
  onChange={handleCategoryChange}
/>

          {/* SUB CATEGORY */}

<h4 style={{ marginTop: "15px" }}>
  Sub Categories
</h4>

<Select
  isMulti
  isDisabled={formData.productIds.length > 0}
  value={subCategories
    .filter((sub) =>
      formData.subCategories.includes(sub.name)
    )
    .map((sub) => ({
      value: sub.id,
      label: sub.name,
    }))
  }
  options={subCategories.map((sub) => ({
    value: sub.id,
    label: sub.name,
  }))}
  onChange={handleSubCategoryChange}
/>

          {/* PRODUCT */}

          <h4 style={{ marginTop: "15px" }}>
  Products
</h4>

<Select
  isMulti
  isDisabled={
    formData.categories.length > 0 ||
    formData.subCategories.length > 0
  }
  value={products
    .filter((product) =>
      formData.productIds.includes(product.id)
    )
    .map((product) => ({
      value: product.id,
      label: product.name,
    }))
  }
  options={products.map((product) => ({
    value: product.id,
    label: product.name,
  }))}
  onChange={handleProductChange}
/>

<h4 style={{ marginTop: "15px" }}>
  Description
</h4>

<textarea
  name="description"
  placeholder="Enter banner description..."
  value={formData.description}
  onChange={handleChange}
  rows={4}
  className="festival-description"
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
          />

          {(image || banner.imageUrl) && (
            <img
              src={image ? URL.createObjectURL(image) : banner.imageUrl}
              alt="Preview"
              className="festival-preview-image"
            />
          )}

          <button
            type="submit"
            className="festival-submit-btn"
            disabled={loading}
          >
            {loading ? "Updating..." : "Update Banner"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditFestivalBannerModal;
