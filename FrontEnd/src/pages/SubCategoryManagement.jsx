import React, {
  useEffect,
  useState,
} from "react";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaLayerGroup,
  FaSearch,
} from "react-icons/fa";

import {
  getAllSubCategories,
  deleteSubCategory,
} from "../services/adminSubCategoryService";

import {
  getAllCategories,
} from "../services/adminCategoryService";

import ConfirmDeleteModal from "../components/adminDelete/ConfirmDeleteModal";

import AddSubCategoryModal from "../components/adminSubCategory/AddSubCategoryModal";
import EditSubCategoryModal from "../components/adminSubCategory/EditSubCategoryModal";

import { toast } from "react-toastify";

import "../styles/SubCategoryManagement.css";

function SubCategoryManagement() {
  const [subCategories,
    setSubCategories] =
    useState([]);

  const [categories,
    setCategories] =
    useState([]);

  const [loading,
    setLoading] =
    useState(true);

  const [search,
    setSearch] =
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

  const [selectedSubCategory,
    setSelectedSubCategory] =
    useState(null);

  const itemsPerPage = 10;

  const fetchData =
    async () => {
      try {
        setLoading(true);

        const [
          subCategoryData,
          categoryData,
        ] = await Promise.all([
          getAllSubCategories(),
          getAllCategories(),
        ]);

        setSubCategories(
          subCategoryData
        );

        setCategories(
          categoryData
        );
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load data"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete =
    async () => {
      try {
        await deleteSubCategory(
          selectedSubCategory.id
        );

        toast.success(
          "Sub Category deleted successfully"
        );

        setShowDeleteModal(
          false
        );

        fetchData();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to delete sub category"
        );
      }
    };

  const filteredSubCategories =
    subCategories.filter(
      (subCategory) =>
        subCategory.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          ) ||
        subCategory.categoryName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const totalPages =
    Math.ceil(
      filteredSubCategories.length /
        itemsPerPage
    );

  const paginatedSubCategories =
    filteredSubCategories.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage *
        itemsPerPage
    );

  return (
    <div className="subcategory-page">

      {/* HEADER */}

      <div className="subcategory-header">
        <div className="subcategory-header-left">
          <h1>
            Sub Category Management
          </h1>

          <p>
            Manage all product
            sub categories
          </p>
        </div>

        <div className="subcategory-header-actions">
          <div className="subcategory-total-card">
            <FaLayerGroup />

            <span>
              {
                subCategories.length
              }{" "}
              Sub Categories
            </span>
          </div>

          <button
            className="subcategory-add-btn"
            onClick={() =>
              setShowAddModal(
                true
              )
            }
          >
            <FaPlus />
            Add Sub Category
          </button>
        </div>
      </div>

      {/* SEARCH */}

      <div className="subcategory-search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search sub category..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {loading ? (
        <div className="subcategory-loader-card">
          <div className="dashboard-loader" />

          <h2>
            Loading Sub Categories
          </h2>

          <p>
            Please wait...
          </p>
        </div>
      ) : (
        <>
          {/* TABLE */}

          <div className="subcategory-table-shell">
            <div className="subcategory-table-wrapper">
              <table className="subcategory-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>
                      Category
                    </th>
                    <th>
                      Sub Category
                    </th>
                    <th>
                      Description
                    </th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedSubCategories.length >
                  0 ? (
                    paginatedSubCategories.map(
                      (
                        subCategory
                      ) => (
                        <tr
                          key={
                            subCategory.id
                          }
                        >
                          <td>
                            {
                              subCategory.id
                            }
                          </td>

                          <td>
                            {
                              subCategory.categoryName
                            }
                          </td>

                          <td>
                            {
                              subCategory.name
                            }
                          </td>

                          <td>
                            {subCategory.description ||
                              "-"}
                          </td>

                          <td>
                            <div className="subcategory-actions">
                              <button
                                className="subcategory-edit-btn"
                                onClick={() => {
                                  setSelectedSubCategory(
                                    subCategory
                                  );

                                  setShowEditModal(
                                    true
                                  );
                                }}
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="subcategory-delete-btn"
                                onClick={() => {
                                  setSelectedSubCategory(
                                    subCategory
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
                        colSpan="5"
                        className="subcategory-empty"
                      >
                        No Sub Categories
                        Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="subcategory-pagination-container">

              <div className="subcategory-pagination-left">
                Showing{" "}
                {
                  paginatedSubCategories.length
                }{" "}
                of{" "}
                {
                  filteredSubCategories.length
                }{" "}
                sub categories
              </div>

              <div className="subcategory-pagination-right">
                <button
                  className="subcategory-page-btn"
                  disabled={
                    currentPage ===
                    1
                  }
                  onClick={() =>
                    setCurrentPage(
                      (
                        prev
                      ) =>
                        prev - 1
                    )
                  }
                >
                  Previous
                </button>

                <div className="subcategory-page-indicator">
                  Page{" "}
                  {
                    currentPage
                  }{" "}
                  of{" "}
                  {
                    totalPages
                  }
                </div>

                <button
                  className="subcategory-page-btn"
                  disabled={
                    currentPage ===
                    totalPages
                  }
                  onClick={() =>
                    setCurrentPage(
                      (
                        prev
                      ) =>
                        prev + 1
                    )
                  }
                >
                  Next
                </button>
              </div>

            </div>
          )}
        </>
      )}

      <AddSubCategoryModal
        showModal={
          showAddModal
        }
        setShowModal={
          setShowAddModal
        }
        categories={
          categories
        }
        fetchData={
          fetchData
        }
      />

      <EditSubCategoryModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        selectedSubCategory={
          selectedSubCategory
        }
        categories={
          categories
        }
        fetchData={
          fetchData
        }
      />

      <ConfirmDeleteModal
        show={
          showDeleteModal
        }
        title="Delete Sub Category"
        message="Are you sure you want to delete this sub category?"
        onCancel={() =>
          setShowDeleteModal(
            false
          )
        }
        onConfirm={
          handleDelete
        }
      />
    </div>
  );
}

export default SubCategoryManagement;