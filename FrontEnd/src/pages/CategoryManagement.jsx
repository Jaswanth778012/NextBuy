import React, {
  useEffect,
  useState,
} from "react";

import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaFolder,
  FaSearch,
} from "react-icons/fa";

import {
  getAllCategories,
  deleteCategory,
} from "../services/adminCategoryService";

import ConfirmDeleteModal from "../components/adminDelete/ConfirmDeleteModal";

import AddCategoryModal from "../components/adminCategory/AddCategoryModal";
import EditCategoryModal from "../components/adminCategory/EditCategoryModal";

import { toast } from "react-toastify";

import "../styles/CategoryManagement.css";

function CategoryManagement() {
  const [categories, setCategories] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [showAddModal,
    setShowAddModal] =
    useState(false);

  const [showEditModal,
    setShowEditModal] =
    useState(false);

  const [showDeleteModal,
    setShowDeleteModal] =
    useState(false);

  const [selectedCategory,
    setSelectedCategory] =
    useState(null);

  const [currentPage,
    setCurrentPage] =
    useState(1);

  const itemsPerPage = 10;

  const fetchCategories =
    async () => {
      try {
        setLoading(true);

        const data =
          await getAllCategories();

        setCategories(data);
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to load categories"
        );
      } finally {
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete =
    async () => {
      try {
        await deleteCategory(
          selectedCategory.id
        );

        toast.success(
          "Category deleted successfully"
        );

        setShowDeleteModal(
          false
        );

        fetchCategories();
      } catch (error) {
        console.error(error);

        toast.error(
          "Failed to delete category"
        );
      }
    };

  const filteredCategories =
    categories.filter(
      (category) =>
        category.name
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const totalPages =
    Math.ceil(
      filteredCategories.length /
        itemsPerPage
    );

  const paginatedCategories =
    filteredCategories.slice(
      (currentPage - 1) *
        itemsPerPage,
      currentPage *
        itemsPerPage
    );

  return (
    <div className="category-page">

      {/* HEADER */}

      <div className="category-header">
        <div className="category-header-left">
          <h1>
            Category Management
          </h1>

          <p>
            Manage all product
            categories
          </p>
        </div>

        <div className="category-header-actions">
          <div className="category-total-card">
            <FaFolder />
            <span>
              {categories.length}
              {" "}
              Categories
            </span>
          </div>

          <button
            className="category-add-btn"
            onClick={() =>
              setShowAddModal(
                true
              )
            }
          >
            <FaPlus />
            Add Category
          </button>
        </div>
      </div>

      {/* SEARCH */}

      <div className="category-search-box">
        <FaSearch />

        <input
          type="text"
          placeholder="Search categories..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />
      </div>

      {loading ? (
        <div className="category-loader-card">
          <div className="dashboard-loader" />
          <h2>
            Loading Categories
          </h2>
        </div>
      ) : (
        <>
          {/* TABLE */}

          <div className="category-table-shell">
            <div className="category-table-wrapper">
              <table className="category-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Description</th>
                    <th>
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {paginatedCategories.length >
                  0 ? (
                    paginatedCategories.map(
                      (
                        category
                      ) => (
                        <tr
                          key={
                            category.id
                          }
                        >
                          <td>
                            {
                              category.id
                            }
                          </td>

                          <td>
                            {
                              category.name
                            }
                          </td>

                          <td>
                            {category.description ||
                              "-"}
                          </td>

                          <td>
                            <div className="category-actions">
                              <button
                                className="category-edit-btn"
                                onClick={() => {
                                  setSelectedCategory(
                                    category
                                  );

                                  setShowEditModal(
                                    true
                                  );
                                }}
                              >
                                <FaEdit />
                              </button>

                              <button
                                className="category-delete-btn"
                                onClick={() => {
                                  setSelectedCategory(
                                    category
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
                        colSpan="4"
                        className="empty-products"
                      >
                        No categories
                        found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PAGINATION */}

          {totalPages > 1 && (
            <div className="category-pagination-container">
              <div className="category-pagination-left">
                Showing{" "}
                {
                  paginatedCategories.length
                }
                {" "}
                of{" "}
                {
                  filteredCategories.length
                }
                {" "}
                categories
              </div>

              <div className="category-pagination-right">
                <button
                  className="category-page-btn"
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

                <div className="category-page-indicator">
                  Page{" "}
                  {
                    currentPage
                  }
                  {" "}
                  of{" "}
                  {
                    totalPages
                  }
                </div>

                <button
                  className="category-page-btn"
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

      <AddCategoryModal
        showModal={
          showAddModal
        }
        setShowModal={
          setShowAddModal
        }
        fetchCategories={
          fetchCategories
        }
      />

      <EditCategoryModal
        showModal={
          showEditModal
        }
        setShowModal={
          setShowEditModal
        }
        selectedCategory={
          selectedCategory
        }
        fetchCategories={
          fetchCategories
        }
      />

      <ConfirmDeleteModal
        show={
          showDeleteModal
        }
        title="Delete Category"
        message="Are you sure you want to delete this category?"
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

export default CategoryManagement;