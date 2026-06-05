import React from "react";

function CouponPagination({
  currentPage,
  totalPages,
  couponsPerPage,
  setCouponsPerPage,
  setCurrentPage,
}) {

  return (

    <div className="coupon-pagination-container">

      <div className="coupon-pagination-left">

        <span>
          Show
        </span>

        <select
          value={couponsPerPage}
          onChange={(e) =>
            setCouponsPerPage(
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

      <div className="coupon-pagination-right">

        <button
          className="coupon-page-btn"
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

        <span className="coupon-page-indicator">

          {currentPage}
          {" / "}
          {totalPages}

        </span>

        <button
          className="coupon-page-btn"
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

export default CouponPagination;
