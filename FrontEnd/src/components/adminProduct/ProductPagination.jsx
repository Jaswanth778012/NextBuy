import React from "react";

function ProductPagination({
  currentPage,
  totalPages,
  productsPerPage,
  setProductsPerPage,
  setCurrentPage,
}) {

  return (

    <div className="product-pagination-container">

      <div className="product-pagination-left">

        <span>
          Show
        </span>

        <select
          value={productsPerPage}
          onChange={(e) =>
            setProductsPerPage(
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

      <div className="product-pagination-right">

        <button
          className="product-page-btn"
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

        <span className="product-page-indicator">

          {currentPage}
          {" / "}
          {totalPages}

        </span>

        <button
          className="product-page-btn"
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

export default ProductPagination;