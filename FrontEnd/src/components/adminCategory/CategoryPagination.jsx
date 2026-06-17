import React from "react";

function CategoryPagination({
  currentPage,
  totalPages,
  categoryPerPage,
  setCategoryPerPage,
  setCurrentPage,
}) {

  return (

    <div className="category-pagination-container">

      <div className="category-pagination-left">

        <span>
          Show
        </span>

        <select
          value={categoryPerPage}
          onChange={(e) =>
            setCategoryPerPage(
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

      <div className="category-pagination-right">

        <button
          className="category-page-btn"
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

        <span className="category-page-indicator">

          {currentPage}
          {" / "}
          {totalPages}

        </span>

        <button
          className="category-page-btn"
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

export default CategoryPagination;