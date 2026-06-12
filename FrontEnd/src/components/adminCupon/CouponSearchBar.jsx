import React from "react";

import {
  FaSearch,
} from "react-icons/fa";

function CouponSearchBar({
  searchKeyword,
  setSearchKeyword,
}) {

  return (

    <div className="coupon-search-section">

      <div className="coupon-search-box">

        <FaSearch
          className="coupon-search-icon"
        />

        <input
          type="text"
          placeholder="Search Coupon..."
          value={searchKeyword}
          onChange={(e) =>
            setSearchKeyword(
              e.target.value
            )
          }
        />

      </div>

    </div>
  );
}

export default CouponSearchBar;
