import React, {
  useEffect,
  useState,
} from "react";

import {
  addProduct,
} from "../../services/adminProductService";

import {
  getAllCategories,
} from "../../services/adminCategoryService";

import {
  getSubCategoriesByCategory,
} from "../../services/adminSubCategoryService";
import { toast } from "react-toastify";
import {
  getAllBrands,
} from "../../services/adminBrandService";

function AddProductModal({
  showModal,
  setShowModal,
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

  const [productData,
    setProductData] =
    useState({
      name: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      price: "",
      stockQuantity: "",
      discountPercentage: "",
      gstPercentage: "",
      deliveryTimeInDays: "",
      productStatus: "DRAFT",
      productCondition: "NEW",

      attributes: [
        {
          key: "",
          value: "",
        },
      ],
    });

  useEffect(() => {

    if (showModal) {

      loadDropdowns();
    }

  }, [showModal]);

  const loadDropdowns =
    async () => {

      try {

        const categoryRes =
          await getAllCategories();

        const brandRes =
          await getAllBrands();

        setCategories(
          Array.isArray(categoryRes)
            ? categoryRes
            : []
        );

        setBrands(
          Array.isArray(brandRes)
            ? brandRes
            : []
        );

      } catch (error) {

        console.error(
          "Dropdown Error:",
          error
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

        const response =
          await getSubCategoriesByCategory(
            categoryId
          );

        setSubCategories(
          Array.isArray(response)
            ? response
            : []
        );

      } catch (error) {

        console.error(
          "Subcategory Error:",
          error
        );

        setSubCategories([]);
      }
    };

  const addAttributeField =
    () => {

      setProductData(
        (prev) => ({
          ...prev,

          attributes: [
            ...prev.attributes,
            {
              key: "",
              value: "",
            },
          ],
        })
      );
    };

  const removeAttributeField =
    (index) => {

      const updated =
        [...productData.attributes];

      updated.splice(index, 1);

      setProductData(
        (prev) => ({
          ...prev,
          attributes: updated,
        })
      );
    };

  const handleAttributeChange =
    (
      index,
      field,
      value
    ) => {

      const updated =
        [...productData.attributes];

      updated[index][field] =
        value;

      setProductData(
        (prev) => ({
          ...prev,
          attributes: updated,
        })
      );
    };

const handleSubmit = async (e) => {

  e.preventDefault();

  try {

    setLoading(true);

    const attributeObject = {};

    productData.attributes.forEach(
      (attribute) => {

        if (
          attribute.key &&
          attribute.value
        ) {

          attributeObject[
            attribute.key
          ] = attribute.value;
        }
      }
    );

    const selectedCategory =
      categories.find(
        (cat) =>
          cat.id ===
          Number(
            productData.categoryId
          )
      );

    const selectedSubCategory =
      subCategories.find(
        (sub) =>
          sub.id ===
          Number(
            productData.subCategoryId
          )
      );

    const selectedBrand =
      brands.find(
        (brand) =>
          brand.id ===
          Number(
            productData.brandId
          )
      );

    const payload = {

      name: productData.name,

      description:
        productData.description,

      category:
        selectedCategory,

      subCategory:
        selectedSubCategory,

      brand:
        selectedBrand,

      mrp_price: Number(
        productData.price
      ),

      stockQuantity: Number(
        productData.stockQuantity
      ),

      discountPercentage:
        Number(
          productData.discountPercentage
        ),

      gstPercentage: Number(
        productData.gstPercentage
      ),

      deliveryTimeInDays:
        Number(
          productData.deliveryTimeInDays
        ),

      productStatus:
        productData.productStatus,

      productCondition:
        productData.productCondition,

      attributes:
        attributeObject,
    };

    const response =
      await addProduct(
        payload,
        image
      );

    console.log(
      "Add Product Response:",
      response
    );

    toast.success(
      "Product added successfully 🎉"
    );

    await fetchProducts();

    setShowModal(false);

    // Optional: Reset form

    setProductData({
      name: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      brandId: "",
      price: "",
      stockQuantity: "",
      discountPercentage: "",
      gstPercentage: "",
      deliveryTimeInDays: "",
      productStatus: "DRAFT",
      productCondition: "NEW",
      attributes: [
        {
          key: "",
          value: "",
        },
      ],
    });

    setImage(null);

  } catch (error) {

    console.error(
      "Add Product Error:",
      error
    );

    toast.error(
      error?.response?.data?.message ||
      "Failed to add product ❌"
    );

  } finally {

    setLoading(false);
  }
};

  if (!showModal) {
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
            Add Product
          </h2>

          <button
            type="button"
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
              required
            />

            <input
              type="number"
              name="price"
              placeholder="Price"
              value={
                productData.price
              }
              onChange={
                handleChange
              }
              required
            />

            <input
              type="number"
              name="stockQuantity"
              placeholder="Stock Quantity"
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
            rows="4"
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
              onClick={
                addAttributeField
              }
            >
              + Add Attribute
            </button>

          </div>

          {productData.attributes.map(
            (
              attribute,
              index
            ) => (

              <div
                key={index}
                className="attribute-row"
              >

                <input
                  type="text"
                  placeholder="Attribute Name"
                  value={
                    attribute.key
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
                  type="text"
                  placeholder="Attribute Value"
                  value={
                    attribute.value
                  }
                  onChange={(e) =>
                    handleAttributeChange(
                      index,
                      "value",
                      e.target.value
                    )
                  }
                />

                {productData.attributes
                  .length > 1 && (

                  <button
                    type="button"
                    className="attribute-remove-btn"
                    onClick={() =>
                      removeAttributeField(
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

          <button
            type="submit"
            className="product-create-submit"
            disabled={loading}
          >

            {loading
              ? "Saving..."
              : "Add Product"}

          </button>

        </form>

      </div>

    </div>
  );
}

export default AddProductModal;