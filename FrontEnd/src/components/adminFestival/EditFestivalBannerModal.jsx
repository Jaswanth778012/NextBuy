import React, {
  useEffect,
  useState,
} from "react";

import {
  updateFestivalBanner,
} from "../../services/adminFestivalBannerService";

import {
  getAllCategories,
} from "../../services/adminCategoryService";

import {
  getSubCategoriesByCategory,
} from "../../services/adminSubCategoryService";

import {
  viewAllProducts,
} from "../../services/adminProductService";

function EditFestivalBannerModal({
  showModal,
  setShowModal,
  banner,
  fetchBanners,
}) {

  const [loading, setLoading] =
    useState(false);

  const [image, setImage] =
    useState(null);

  const [categories,
    setCategories] =
    useState([]);

  const [subCategories,
    setSubCategories] =
    useState([]);

  const [products,
    setProducts] =
    useState([]);

  const [formData,
    setFormData] =
    useState({
      festivalName: "",
      title: "",
      subtitle: "",
      redirectUrl: "",
      startDate: "",
      endDate: "",
      priority: 1,
      active: true,
      Category: "",
      SubCategory: "",
      Product: "",
    });

  useEffect(() => {

    if (
      showModal &&
      banner
    ) {

      initializeModal();
    }

  }, [
    showModal,
    banner,
  ]);

  const initializeModal =
    async () => {

      try {

        const [
          categoryRes,
          productRes,
        ] = await Promise.all([
          getAllCategories(),
          viewAllProducts(),
        ]);

        setCategories(
          categoryRes || []
        );

        setProducts(
          productRes?.data || []
        );

        setFormData({
          festivalName:
            banner.festivalName || "",

          title:
            banner.title || "",

          subtitle:
            banner.subtitle || "",

          redirectUrl:
            banner.redirectUrl || "",

          startDate:
            banner.startDate || "",

          endDate:
            banner.endDate || "",

          priority:
            banner.priority || 1,

          active:
            banner.active ?? true,

          Category:
            banner.Category || "",

          SubCategory:
            banner.SubCategory || "",

          Product:
            banner.Product || "",
        });

      } catch (error) {

        console.error(
          error
        );
      }
    };

  const handleChange =
    (e) => {

      const {
        name,
        value,
        type,
        checked,
      } = e.target;

      setFormData(
        (prev) => ({
          ...prev,
          [name]:
            type === "checkbox"
              ? checked
              : value,
        })
      );
    };

  const handleCategoryChange =
    async (e) => {

      const categoryId =
        e.target.value;

      const selectedCategory =
        categories.find(
          (cat) =>
            cat.id ===
            Number(categoryId)
        );

      setFormData(
        (prev) => ({
          ...prev,
          Category:
            selectedCategory?.name ||
            "",
          SubCategory: "",
          Product: "",
        })
      );

      try {

        const response =
          await getSubCategoriesByCategory(
            categoryId
          );

        setSubCategories(
          response || []
        );

      } catch (error) {

        console.error(
          error
        );

        setSubCategories([]);
      }
    };

  const handleSubCategoryChange =
    (e) => {

      const selectedSubCategory =
        subCategories.find(
          (sub) =>
            sub.id ===
            Number(
              e.target.value
            )
        );

      setFormData(
        (prev) => ({
          ...prev,
          SubCategory:
            selectedSubCategory?.name ||
            "",
          Product: "",
        })
      );
    };

  const handleProductChange =
    (e) => {

      setFormData(
        (prev) => ({
          ...prev,
          Product:
            e.target.value,
          Category: "",
          SubCategory: "",
        })
      );
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        await updateFestivalBanner(
          banner.id,
          formData,
          image
        );

        await fetchBanners();

        setShowModal(false);

      } catch (error) {

        console.error(
          "Update Banner Error",
          error
        );

      } finally {

        setLoading(false);
      }
    };

  if (
    !showModal ||
    !banner
  ) {
    return null;
  }

  return (

    <div
      className="festival-modal-overlay"
      onClick={() =>
        setShowModal(false)
      }
    >

      <div
        className="festival-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="festival-modal-header">

          <h2>
            Edit Festival Banner
          </h2>

          <button
            className="festival-modal-close"
            onClick={() =>
              setShowModal(false)
            }
          >
            ✕
          </button>

        </div>

        <form
          className="festival-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="festival-form-grid">

            <input
              type="text"
              name="festivalName"
              placeholder="Festival Name"
              value={
                formData.festivalName
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="text"
              name="title"
              placeholder="Banner Title"
              value={
                formData.title
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="text"
              name="subtitle"
              placeholder="Subtitle"
              value={
                formData.subtitle
              }
              onChange={
                handleChange
              }
            />

            <input
              type="text"
              name="redirectUrl"
              placeholder="Redirect URL"
              value={
                formData.redirectUrl
              }
              onChange={
                handleChange
              }
            />

            <input
              type="date"
              name="startDate"
              value={
                formData.startDate
              }
              onChange={
                handleChange
              }
            />

            <input
              type="date"
              name="endDate"
              value={
                formData.endDate
              }
              onChange={
                handleChange
              }
            />

            <input
              type="number"
              name="priority"
              value={
                formData.priority
              }
              onChange={
                handleChange
              }
            />

          </div>

          {/* CATEGORY */}

          <select
            onChange={
              handleCategoryChange
            }
            disabled={
              !!formData.Product
            }
          >

            <option value="">
              Select Category
            </option>

            {categories.map(
              (cat) => (

                <option
                  key={cat.id}
                  value={cat.id}
                >
                  {cat.name}
                </option>

              )
            )}

          </select>

          {/* SUB CATEGORY */}

          <select
            onChange={
              handleSubCategoryChange
            }
            disabled={
              !!formData.Product
            }
          >

            <option value="">
              Select Sub Category
            </option>

            {subCategories.map(
              (sub) => (

                <option
                  key={sub.id}
                  value={sub.id}
                >
                  {sub.name}
                </option>

              )
            )}

          </select>

          {/* PRODUCT */}

          <select
            value={
              formData.Product
            }
            onChange={
              handleProductChange
            }
            disabled={
              !!formData.Category ||
              !!formData.SubCategory
            }
          >

            <option value="">
              Select Product
            </option>

            {products.map(
              (product) => (

                <option
                  key={product.id}
                  value={
                    product.name
                  }
                >
                  {product.name}
                </option>

              )
            )}

          </select>

          <label className="festival-checkbox">

            <input
              type="checkbox"
              name="active"
              checked={
                formData.active
              }
              onChange={
                handleChange
              }
            />

            Active Banner

          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />

          {(image ||
            banner.imageUrl) && (

            <img
              src={
                image
                  ? URL.createObjectURL(
                      image
                    )
                  : banner.imageUrl
              }
              alt="Preview"
              className="festival-preview-image"
            />

          )}

          <button
            type="submit"
            className="festival-submit-btn"
            disabled={loading}
          >

            {loading
              ? "Updating..."
              : "Update Banner"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default EditFestivalBannerModal;