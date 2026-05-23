import React from "react";

import { FaSearch, FaBell, FaMoon } from "react-icons/fa";

import SearchDropdown from "./SearchDropdown";

function AdminHeader({
  searchKeyword,
  handleGlobalSearch,
  searchResults,
}) {
  return (
    <header className="admin-header">
      <div className="search-container">
        <div className="search-box">
          <FaSearch className="search-icon" />

          <input
            type="text"
            placeholder="Search users, products, brands..."
            value={searchKeyword}
            onChange={handleGlobalSearch}
          />

          <span className="shortcut">⌘ K</span>
        </div>

        <SearchDropdown searchResults={searchResults} />
      </div>

      <div className="header-right">
        <button className="header-icon">
          <FaMoon />
        </button>

        <button className="header-icon notification">
          <FaBell />
          <span className="dot"></span>
        </button>

        <div className="profile-box">
          <img src="https://i.pravatar.cc/100" alt="profile" />
          <span>Musharof</span>
        </div>
      </div>
    </header>
  );
}

export default AdminHeader;