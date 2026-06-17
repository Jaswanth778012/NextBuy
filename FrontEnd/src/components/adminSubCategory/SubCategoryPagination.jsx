import React from "react";

function SubCategoryPagination({
  currentPage,
  totalPages,
  subcategoryPerPage,
  setSubcategoryPerPage,
  setCurrentPage,
}) {

  return (

    <div className="subcategory-pagination-container">

      <div className="subcategory-pagination-left">

        <span>
          Show
        </span>

        <select
          value={subcategoryPerPage}
          onChange={(e) =>
            setSubcategoryPerPage(
              Number(
                e.target.value
              )
            )
          }
        >

          <option value={10}>
            10
          </option>

          <option value={20}>
            20
          </option>

          <option value={50}>
            50
          </option>

        </select>

      </div>

      <div className="subcategory-pagination-right">

        <button
          className="subcategory-page-btn"
          disabled={
            currentPage === 1
          }
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          Previous
        </button>

        <span className="subcategory-page-indicator">

          {currentPage}
          {" / "}
          {totalPages}

        </span>

        <button
          className="subcategory-page-btn"
          disabled={
            currentPage === totalPages
          }
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
        >
          Next
        </button>

      </div>

    </div>
  );
}

export default SubCategoryPagination;