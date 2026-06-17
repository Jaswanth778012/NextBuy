import React, {
  useEffect,
  useState,
} from "react";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaTrademark,
  FaSearch,
} from "react-icons/fa";

import {
  getAllBrands,
  deleteBrand,
} from "../services/adminBrandService";

import ConfirmDeleteModal from "../components/adminDelete/ConfirmDeleteModal";

import AddBrandModal from "../components/adminBrand/AddBrandModal";
import EditBrandModal from "../components/adminBrand/EditBrandModal";
import BrandPagination from "../components/adminBrand/BrandPagination";
import { toast } from "react-toastify";

import "../styles/BrandManagement.css";

function BrandManagement() {
  const [brands, setBrands] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const [showAddModal,
    setShowAddModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [showDeleteModal,
    setShowDeleteModal] =
    useState(false);

  const [selectedBrand,
    setSelectedBrand] =
    useState(null);

  const [brandsPerPage,
    setBrandsPerPage] =
    useState(10);

  const fetchBrands =
    async () => {
      try {
        setLoading(true);

        const data =
          await getAllBrands();

        setBrands(data);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load brands"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchBrands();
  }, []);

   useEffect(() => {
  setCurrentPage(1);
}, [search]);

  const handleDelete =
    async () => {
      try {
        await deleteBrand(
          selectedBrand.id
        );

        toast.success(
          "Brand deleted successfully"
        );

        setShowDeleteModal(
          false
        );

        fetchBrands();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to delete brand"
        );
      }
    };

  const filteredBrands =
    brands.filter(
      (brand) =>
        brand.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        brand.country
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

 const indexOfLastProduct =
    currentPage *
    brandsPerPage;

  const indexOfFirstProduct =
    indexOfLastProduct -
    brandsPerPage;

 const paginatedBrands =
  filteredBrands.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

const totalPages =
  Math.ceil(
    filteredBrands.length /
    brandsPerPage
  );

  return (
    <div className="brand-page">

      {/* HEADER */}

      <div className="brand-header">
        <div className="brand-header-left">
          <h1>
            Brand Management
          </h1>

          <p>
            Manage all product
            brands
          </p>
        </div>

        <div className="brand-header-actions">

          <div className="brand-total-card">
            <FaTrademark />

            <span>
              {brands.length}
              {" "}
              Brands
            </span>
          </div>

          <button
            className="brand-add-btn"
            onClick={() =>
              setShowAddModal(
                true
              )
            }
          >
            <FaPlus />
            Add Brand
          </button>

        </div>
      </div>

      {/* SEARCH */}

      <div className="brand-search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search brand..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {loading ? (
        <div className="brand-loader-card">
          <div className="dashboard-loader" />

          <h2>
            Loading Brands
          </h2>

          <p>
            Please wait...
          </p>
        </div>
      ) : (
        <>
          {/* TABLE */}

          <div className="brand-table-shell">
            <div className="brand-table-wrapper">
              <table className="brand-table">
                <thead>
                  <tr>
                    <th>Logo</th>
                    <th>ID</th>
                    <th>Name</th>
                    <th>
                      Description
                    </th>
                    <th>
                      Country
                    </th>
                    <th>
                      Created
                    </th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedBrands.length >
                  0 ? (
                    paginatedBrands.map(
                      (
                        brand
                      ) => (
                        <tr
                          key={
                            brand.id
                          }
                        >
                          <td>
                            <img
                              src={
                                brand.logoUrl
                              }
                              alt={
                                brand.name
                              }
                              className="brand-logo"
                            />
                          </td>

                          <td>
                            {
                              brand.id
                            }
                          </td>

                          <td>
                            {
                              brand.name
                            }
                          </td>

                          <td>
                            {brand.description ||
                              "-"}
                          </td>

                          <td>
                            {
                              brand.country
                            }
                          </td>

                          <td>
                            {
                              brand.createdAt
                            }
                          </td>

                          <td>
                            <div className="brand-actions">

                              <button
                                className="brand-edit-btn"
                                onClick={() => {
                                  setSelectedBrand(
                                    brand
                                  );

                                  setShowEditModal(
                                    true
                                  );
                                }}
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="brand-delete-btn"
                                onClick={() => {
                                  setSelectedBrand(
                                    brand
                                  );

                                  setShowDeleteModal(
                                    true
                                  );
                                }}
                              >
                                <FaTrash />
                              </button>

                            </div>
                          </td>
                        </tr>
                      )
                    )
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="brand-empty"
                      >
                        No Brands Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}

          {filteredBrands.length >
        0 && (

        <BrandPagination
          currentPage={
            currentPage
          }
          totalPages={
            totalPages
          }
          brandsPerPage={
            brandsPerPage
          }
          setBrandsPerPage={
            setBrandsPerPage
          }
          setCurrentPage={
            setCurrentPage
          }
        />

      )}

      <AddBrandModal
        showModal={
          showAddModal
        }
        setShowModal={
          setShowAddModal
        }
        fetchBrands={
          fetchBrands
        }
      />

      <EditBrandModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        selectedBrand={
          selectedBrand
        }
        fetchBrands={
          fetchBrands
        }
      />

      <ConfirmDeleteModal
        show={
          showDeleteModal
        }
        title="Delete Brand"
        message="Are you sure you want to delete this brand?"
        onCancel={() =>
          setShowDeleteModal(
            false
          )
        }
        onConfirm={
          handleDelete
        }
      />

      </>
)}
      
    </div>
  );
}

export default BrandManagement;