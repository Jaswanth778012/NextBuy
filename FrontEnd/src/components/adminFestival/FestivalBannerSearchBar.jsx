import React from "react";
import { FaSearch } from "react-icons/fa";

function FestivalBannerSearchBar({
  searchKeyword,
  setSearchKeyword,
}) {
  return (
    <div className="festival-search-section">
      <div className="festival-search-box">
        <FaSearch className="festival-search-icon" />

        <input
          type="text"
          placeholder="Search festival banners..."
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
      </div>
    </div>
  );
}

export default FestivalBannerSearchBar;