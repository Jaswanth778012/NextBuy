import React from "react";

function UserPagination({
  currentPage,
  totalPages,
  usersPerPage,
  setUsersPerPage,
  setCurrentPage,
}) {

  return (

    <div className="pagination-container">

      <div className="pagination-left">

        <span>
          Show
        </span>

        <select
          value={usersPerPage}
          onChange={(e) => {

            setUsersPerPage(
              Number(e.target.value)
            );

            setCurrentPage(1);

          }}
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

        <span>
          users per page
        </span>

      </div>

      <div className="pagination-right">

        <button
          className="pagination-btn"
          onClick={() =>
            setCurrentPage(
              currentPage - 1
            )
          }
          disabled={
            currentPage === 1
          }
        >

          Previous

        </button>

        <div className="page-indicator">

          Page {currentPage} of{" "}
          {totalPages || 1}

        </div>

        <button
          className="pagination-btn"
          onClick={() =>
            setCurrentPage(
              currentPage + 1
            )
          }
          disabled={
            currentPage === totalPages ||
            totalPages === 0
          }
        >

          Next

        </button>

      </div>

    </div>
  );
}

export default UserPagination;