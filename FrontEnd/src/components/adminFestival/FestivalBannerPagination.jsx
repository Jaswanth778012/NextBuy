import React from "react";

function FestivalBannerPagination({
  currentPage,
  totalPages,
  bannersPerPage,
  setBannersPerPage,
  setCurrentPage,
}) {
  return (
    <div className="festival-pagination-container">

      <div className="festival-pagination-left">
        <span>Show</span>

        <select
          value={bannersPerPage}
          onChange={(e) =>
            setBannersPerPage(Number(e.target.value))
          }
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>

      <div className="festival-pagination-right">
        <button
          className="festival-page-btn"
          disabled={currentPage === 1}
          onClick={() => setCurrentPage(currentPage - 1)}
        >
          Prev
        </button>

        <span className="festival-page-indicator">
          {currentPage} / {totalPages}
        </span>

        <button
          className="festival-page-btn"
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage(currentPage + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
}

export default FestivalBannerPagination;