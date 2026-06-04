import React, {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  useOutletContext,
} from "react-router-dom";

import {
  FaBoxOpen,
  FaPlus,
} from "react-icons/fa";

import ProductSearchBar from "../components/adminProduct/ProductSearchBar";
import ProductTable from "../components/adminProduct/ProductTable";
import ProductPagination from "../components/adminProduct/ProductPagination";
import AddProductModal from "../components/adminProduct/AddProductModal";
import EditProductModal from "../components/adminProduct/EditProductModal";

import {
  viewAllProducts,
} from "../services/adminProductService";

import "../styles/ProductManagement.css";

function ProductManagement() {

  const {
    sidebarOpen,
    theme,
  } = useOutletContext();

  const [products,
    setProducts] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [showModal,
    setShowModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [selectedProduct,
    setSelectedProduct] =
    useState(null);

  const [searchKeyword,
    setSearchKeyword] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [productsPerPage,
    setProductsPerPage] =
    useState(10);

  const fetchProducts =
    async () => {

      try {

        setLoading(true);

        const response =
          await viewAllProducts();

        console.log(
          "Products Response:",
          response
        );

        setProducts(
          response?.data || []
        );

      } catch (error) {

        console.error(
          "Fetch Products Error:",
          error
        );

        setProducts([]);

      } finally {

        setLoading(false);
      }
    };

  useEffect(() => {

    fetchProducts();

  }, []);

  useEffect(() => {

    setCurrentPage(1);

  }, [searchKeyword]);

  const openEditModal =
    (product) => {

      setSelectedProduct(
        product
      );

      setShowEditModal(
        true
      );
    };

  const filteredProducts =
    useMemo(() => {

      return products.filter(
        (product) =>

          product.name
            ?.toLowerCase()
            .includes(
              searchKeyword.toLowerCase()
            )
      );

    }, [
      products,
      searchKeyword,
    ]);

  const indexOfLastProduct =
    currentPage *
    productsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct -
    productsPerPage;

  const currentProducts =
    filteredProducts.slice(
      indexOfFirstProduct,
      indexOfLastProduct
    );

  const totalPages =
    Math.ceil(
      filteredProducts.length /
      productsPerPage
    );

  if (loading) {

    return (

      <div className="product-panel-page">

        <div className="product-loader-card">

          <div className="dashboard-loader" />

          <h2>
            Loading Products
          </h2>

          <p>
            Fetching inventory...
          </p>

        </div>

      </div>
    );
  }

  return (

    <div
      className={`product-panel-page ${
        sidebarOpen
          ? "sidebar-open"
          : "sidebar-closed"
      } ${
        theme === "dark"
          ? "dark-mode"
          : ""
      }`}
    >

      <div className="product-panel-header">

        <div>

          <h1>
            Product Management
          </h1>

          <p>
            Manage inventory,
            stock, pricing,
            discounts and
            availability
          </p>

        </div>

        <div className="product-header-actions">

          <div className="product-total-card">

            <FaBoxOpen />

            <span>
              {products.length}
              {" "}
              Products
            </span>

          </div>

          <button
            className="add-product-btn"
            onClick={() =>
              setShowModal(true)
            }
          >

            <FaPlus />

            Add Product

          </button>

        </div>

      </div>

      <ProductSearchBar
        searchKeyword={
          searchKeyword
        }
        setSearchKeyword={
          setSearchKeyword
        }
      />

      <ProductTable
        products={
          currentProducts
        }
        fetchProducts={
          fetchProducts
        }
        openEditModal={
          openEditModal
        }
      />

      {filteredProducts.length >
        0 && (

        <ProductPagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          productsPerPage={
            productsPerPage
          }
          setProductsPerPage={
            setProductsPerPage
          }
          setCurrentPage={
            setCurrentPage
          }
        />

      )}

      <AddProductModal
        showModal={
          showModal
        }
        setShowModal={
          setShowModal
        }
        fetchProducts={
          fetchProducts
        }
      />

      <EditProductModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        product={
          selectedProduct
        }
        fetchProducts={
          fetchProducts
        }
      />

    </div>
  );
}

export default ProductManagement;