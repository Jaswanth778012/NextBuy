import React from "react";
import { FaSearch } from "react-icons/fa";

function ProductSearchBar({
  searchKeyword,
  setSearchKeyword,
}) {

  return (

    <div className="product-search-section">

      <div className="product-search-box">

        <FaSearch
          className="product-search-icon"
        />

        <input
          type="text"
          placeholder="Search Product..."
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

export default ProductSearchBar;