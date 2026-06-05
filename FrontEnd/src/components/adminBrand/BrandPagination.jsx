import React from "react";

function BrandPagination({
  currentPage,
  totalPages,
  brandsPerPage,
  setBrandsPerPage,
  setCurrentPage,
}) {

  return (

    <div className="brand-pagination-container">

      <div className="brand-pagination-left">

        <span>
          Show
        </span>

        <select
          value={brandsPerPage}
          onChange={(e) =>
            setBrandsPerPage(
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

      <div className="brand-pagination-right">

        <button
          className="brand-page-btn"
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

        <span className="brand-page-indicator">

          {currentPage}
          {" / "}
          {totalPages}

        </span>

        <button
          className="brand-page-btn"
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

export default BrandPagination;