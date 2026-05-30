import React from "react";

import {
  FaSearch,
} from "react-icons/fa";

function UserSearchBar({
  searchUsername,
  setSearchUsername,
  handleSearch,
  fetchUsers,
  setCurrentPage,
}) {

  return (

    <div className="users-search-bar">

      <div className="search-input-wrapper">

        <FaSearch className="search-icon" />

        <input
          type="text"
          placeholder="Search username..."
          value={searchUsername}
          onChange={(e) =>
            setSearchUsername(
              e.target.value
            )
          }
        />

      </div>

      <button
        className="search-btn"
        onClick={handleSearch}
      >

        Search

      </button>

      <button
        className="reset-btn"
        onClick={() => {

          setSearchUsername("");

          fetchUsers();

          setCurrentPage(1);

        }}
      >

        Reset

      </button>

    </div>
  );
}

export default UserSearchBar;