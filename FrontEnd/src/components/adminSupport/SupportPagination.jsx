import React from "react";

function SupportPagination({
  currentPage,
  totalPages,
  ticketsPerPage,
  setTicketsPerPage,
  setCurrentPage,
}) {
  return (
    <div className="support-pagination-container">

      <div className="support-pagination-left">

        <span>
          Show
        </span>

        <select
          value={ticketsPerPage}
          onChange={(e) =>
            setTicketsPerPage(
              Number(e.target.value)
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

      <div className="support-pagination-right">

        <button
          className="support-page-btn"
          disabled={currentPage === 1}
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
        >
          Previous
        </button>

        <span className="support-page-indicator">
          {currentPage}
          {" / "}
          {totalPages}
        </span>

        <button
          className="support-page-btn"
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

export default SupportPagination;