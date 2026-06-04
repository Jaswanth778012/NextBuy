import React, {
  useEffect,
  useState,
} from "react";

import { toast } from "react-toastify";

import {
  updateProduct,
} from "../../services/adminProductService";

import {
  getAllCategories,
} from "../../services/adminCategoryService";

import {
  getSubCategoriesByCategory,
} from "../../services/adminSubCategoryService";

import {
  getAllBrands,
} from "../../services/adminBrandService";

function EditProductModal({
  showModal,
  setShowModal,
  product,
  fetchProducts,
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

  const [brands,
    setBrands] =
    useState([]);

  const [attributes,
    setAttributes] =
    useState([]);

  const [productData,
    setProductData] =
    useState({
      name: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      mrp_price: "",
      stockQuantity: "",
      discountPercentage: "",
      gstPercentage: "",
      deliveryTimeInDays: "",
      productStatus: "ACTIVE",
      productCondition: "NEW",
      attributes: {},
    });

  useEffect(() => {

    if (
      showModal &&
      product
    ) {

      initializeModal();
    }

  }, [
    showModal,
    product,
  ]);

  const initializeModal =
    async () => {

      try {

        const [
          categoryData,
          brandData,
        ] = await Promise.all([
          getAllCategories(),
          getAllBrands(),
        ]);

        setCategories(
          Array.isArray(categoryData)
            ? categoryData
            : []
        );

        setBrands(
          Array.isArray(brandData)
            ? brandData
            : []
        );

        if (
          product?.category?.id
        ) {

          const subData =
            await getSubCategoriesByCategory(
              product.category.id
            );

          setSubCategories(
            Array.isArray(subData)
              ? subData
              : []
          );
        }

        const attrs =
          Object.entries(
            product.attributes || {}
          ).map(
            ([key, value]) => ({
              key,
              value,
            })
          );

        setAttributes(
          attrs.length
            ? attrs
            : [
                {
                  key: "",
                  value: "",
                },
              ]
        );

        setProductData({
          name:
            product.name || "",

          description:
            product.description || "",

          categoryId:
            product.category?.id || "",

          subCategoryId:
            product.subCategory?.id || "",

          brandId:
            product.brand?.id || "",

          mrp_price:
            product.mrp_price || "",

          stockQuantity:
            product.stockQuantity || "",

          discountPercentage:
            product.discountPercentage || "",

          gstPercentage:
            product.gstPercentage || "",

          deliveryTimeInDays:
            product.deliveryTimeInDays || "",

          productStatus:
            product.productStatus ||
            "ACTIVE",

          productCondition:
  product.productCondition ||
  "NEW",

          attributes:
            product.attributes || {},
        });

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to load product data"
        );
      }
    };

  const handleChange =
    (e) => {

      const {
        name,
        value,
      } = e.target;

      setProductData(
        (prev) => ({
          ...prev,
          [name]: value,
        })
      );
    };

  const handleCategoryChange =
    async (e) => {

      const categoryId =
        e.target.value;

      setProductData(
        (prev) => ({
          ...prev,
          categoryId,
          subCategoryId: "",
        })
      );

      try {

        const data =
          await getSubCategoriesByCategory(
            categoryId
          );

        setSubCategories(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {

        console.error(error);

        setSubCategories([]);
      }
    };

  const handleAttributeChange =
    (
      index,
      field,
      value
    ) => {

      const updated =
        [...attributes];

      updated[index][field] =
        value;

      setAttributes(
        updated
      );
    };

  const addAttribute =
    () => {

      setAttributes(
        (prev) => [
          ...prev,
          {
            key: "",
            value: "",
          },
        ]
      );
    };

  const removeAttribute =
    (index) => {

      setAttributes(
        attributes.filter(
          (_, i) =>
            i !== index
        )
      );
    };

  const resetForm =
    () => {

      setImage(null);
      setCategories([]);
      setBrands([]);
      setSubCategories([]);
      setAttributes([]);
    };

  const handleSubmit =
    async (e) => {

      e.preventDefault();

      try {

        setLoading(true);

        const attributeObject =
          {};

        attributes.forEach(
          (attr) => {

            if (
              attr.key?.trim() &&
              attr.value?.trim()
            ) {

              attributeObject[
                attr.key
              ] = attr.value;
            }
          }
        );

        const selectedCategory =
  categories.find(
    (cat) =>
      cat.id ===
      Number(productData.categoryId)
  );

const selectedSubCategory =
  subCategories.find(
    (sub) =>
      sub.id ===
      Number(productData.subCategoryId)
  );

const selectedBrand =
  brands.find(
    (brand) =>
      brand.id ===
      Number(productData.brandId)
  );

const payload = {

  ...productData,

  category:
    selectedCategory,

  subCategory:
    selectedSubCategory,

  brand:
    selectedBrand,

  attributes:
    attributeObject,
};

        await updateProduct(
          product.id,
          payload,
          image
        );

        toast.success(
          "Product Updated Successfully"
        );

        await fetchProducts();

        resetForm();

        setShowModal(false);

      } catch (error) {

        console.error(error);

        toast.error(
          "Failed to Update Product"
        );

      } finally {

        setLoading(false);
      }
    };

  if (
    !showModal ||
    !product
  ) {
    return null;
  }

  return (

    <div
      className="product-create-overlay"
      onClick={() =>
        setShowModal(false)
      }
    >

      <div
        className="product-create-modal"
        onClick={(e) =>
          e.stopPropagation()
        }
      >

        <div className="product-create-header">

          <h2>
            Edit Product
          </h2>

          <button
            className="product-create-close"
            onClick={() =>
              setShowModal(false)
            }
          >
            ✕
          </button>

        </div>

        <form
          className="product-create-form"
          onSubmit={
            handleSubmit
          }
        >

          <div className="product-create-grid">

            <input
              name="name"
              placeholder="Product Name"
              value={
                productData.name
              }
              onChange={
                handleChange
              }
            />

            <input
              type="number"
              name="mrp_price"
              placeholder="Price"
              value={
                productData.mrp_price
              }
              onChange={
                handleChange
              }
            />

            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock"
              value={
                productData.stockQuantity
              }
              onChange={
                handleChange
              }
            />

            <input
              type="number"
              name="discountPercentage"
              placeholder="Discount %"
              value={
                productData.discountPercentage
              }
              onChange={
                handleChange
              }
            />

            <input
              type="number"
              name="gstPercentage"
              placeholder="GST %"
              value={
                productData.gstPercentage
              }
              onChange={
                handleChange
              }
            />

            <input
              type="number"
              name="deliveryTimeInDays"
              placeholder="Delivery Days"
              value={
                productData.deliveryTimeInDays
              }
              onChange={
                handleChange
              }
            />

            <select
            name="categoryId"
              value={
                productData.categoryId
              }
              onChange={
                handleCategoryChange
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

            <select
              name="subCategoryId"
              value={
                productData.subCategoryId
              }
              onChange={
                handleChange
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

            <select
              name="brandId"
              value={
                productData.brandId
              }
              onChange={
                handleChange
              }
            >

              <option value="">
                Select Brand
              </option>

              {brands.map(
                (brand) => (
                  <option
                    key={brand.id}
                    value={brand.id}
                  >
                    {brand.name}
                  </option>
                )
              )}

            </select>

            <select
              name="productStatus"
              value={
                productData.productStatus
              }
              onChange={
                handleChange
              }
            >

              <option value="ACTIVE">
                ACTIVE
              </option>

              <option value="DRAFT">
                DRAFT
              </option>

              <option value="INACTIVE">
                INACTIVE
              </option>

            </select>

            <select
  name="productCondition"
  value={
    productData.productCondition
  }
  onChange={
    handleChange
  }
>

  <option value="NEW">
    NEW
  </option>

  <option value="USED">
    USED
  </option>

  <option value="REFURBISHED">
    REFURBISHED
  </option>

</select>

          </div>

          <textarea
            rows="5"
            name="description"
            placeholder="Description"
            value={
              productData.description
            }
            onChange={
              handleChange
            }
          />

          <div className="attribute-header">

  <h4>
    Product Attributes
  </h4>

  <button
    type="button"
    className="attribute-add-btn"
    onClick={addAttribute}
  >
    + Add Attribute
  </button>

</div>

          {attributes.map(
            (
              attr,
              index
            ) => (

              <div
                key={index}
                className="attribute-row"
              >

                <input
                  placeholder="Attribute Name"
                  value={
                    attr.key
                  }
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "key",
                      e.target.value
                    )
                  }
                />

                <input
                  placeholder="Attribute Value"
                  value={
                    attr.value
                  }
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "value",
                      e.target.value
                    )
                  }
                />

                {attributes.length > 1 && (

  <button
    type="button"
    className="attribute-remove-btn"
    onClick={() =>
      removeAttribute(
        index
      )
    }
  >
    ✕
  </button>

)}

              </div>

            )
          )}

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(
                e.target.files[0]
              )
            }
          />

          {product.imageUrl && (

            <img
              src={
                image
                  ? URL.createObjectURL(
                      image
                    )
                  : product.imageUrl
              }
              alt="Preview"
              className="product-preview-image"
            />

          )}

          <button
            type="submit"
            className="product-create-submit"
            disabled={loading}
          >

            {loading
              ? "Updating..."
              : "Update Product"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default EditProductModal;