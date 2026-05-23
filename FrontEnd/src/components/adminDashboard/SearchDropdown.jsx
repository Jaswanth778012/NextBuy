import React from "react";

function SearchDropdown({ searchResults }) {
  if (!searchResults) return null;

  return (
    <div className="search-results">
      {/* USERS */}
      {searchResults.users?.length > 0 && (
        <div className="search-section">
          <h4>Users</h4>

          {searchResults.users.map((user, index) => (
            <div key={index} className="search-item">
              👤 {user.username}
            </div>
          ))}
        </div>
      )}

      {/* PRODUCTS */}
      {searchResults.products?.length > 0 && (
        <div className="search-section">
          <h4>Products</h4>

          {searchResults.products.map((product, index) => (
            <div key={index} className="search-item">
              📦 {product.name}
            </div>
          ))}
        </div>
      )}

      {/* BRANDS */}
      {searchResults.brands?.length > 0 && (
        <div className="search-section">
          <h4>Brands</h4>

          {searchResults.brands.map((brand, index) => (
            <div key={index} className="search-item">
              🏷️ {brand.name}
            </div>
          ))}
        </div>
      )}

      {/* ORDERS */}
      {searchResults.orders?.length > 0 && (
        <div className="search-section">
          <h4>Orders</h4>

          {searchResults.orders.map((order, index) => (
            <div key={index} className="search-item">
              🧾 Order ID: {order.id}
            </div>
          ))}
        </div>
      )}

      {/* CATEGORIES */}
      {searchResults.categories?.length > 0 && (
        <div className="search-section">
          <h4>Categories</h4>

          {searchResults.categories.map((category, index) => (
            <div key={index} className="search-item">
              📂 {category.name}
            </div>
          ))}
        </div>
      )}

      {/* SUB CATEGORIES */}
      {searchResults.subCategories?.length > 0 && (
        <div className="search-section">
          <h4>Sub Categories</h4>

          {searchResults.subCategories.map((subCategory, index) => (
            <div key={index} className="search-item">
              🗂️ {subCategory.name}
            </div>
          ))}
        </div>
      )}

      {/* EMPTY */}
      {searchResults.users?.length === 0 &&
        searchResults.products?.length === 0 &&
        searchResults.orders?.length === 0 &&
        searchResults.brands?.length === 0 &&
        searchResults.categories?.length === 0 &&
        searchResults.subCategories?.length === 0 && (
          <div className="empty-search">No Results Found</div>
        )}
    </div>
  );
}

export default SearchDropdown;