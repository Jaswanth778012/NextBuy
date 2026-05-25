import React from "react";

import { FaSearch, FaBell, FaMoon, FaSun } from "react-icons/fa";

import SearchDropdown from "./SearchDropdown";

function AdminHeader({
  searchKeyword,
  handleGlobalSearch,
  searchResults,
  setSelectedResult,
  setSelectedType,
  theme,
  toggleTheme,
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
        </div>

        <SearchDropdown
  searchResults={searchResults}
  setSelectedResult={setSelectedResult}
  setSelectedType={setSelectedType}
/>
      </div>

      <div className="header-right">
        <button
          className="header-icon theme-toggle"
          onClick={toggleTheme}
          aria-label="Toggle dark mode"
        >
          {theme === "light" ? <FaMoon /> : <FaSun />}
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