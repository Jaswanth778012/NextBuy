import React from "react";

import {
  FaBell,
  FaShoppingCart,
  FaTrash,
} from "react-icons/fa";

function WishlistProductCard({
  wishlistItem,
  wishlistId,
  alert,
  onRemove,
  onAddToCart,
  onOpenAlertModal,

  // change by Gowtham:
  // cartLoading is received from WishlistDetailsPage.
  // It is used to disable only the clicked product cart button and show "Adding..."
  cartLoading,
}) {
  const product = wishlistItem.product;

  return (
    <div className="wishlist-product-card">
      <div className="wishlist-discount-badge">
        {product.discountPercentage}% OFF
      </div>

      <div className="wishlist-card-top">
        <button
          className={`wishlist-bell-btn ${
            alert ? "active-alert" : ""
          }`}
          title={
            alert
              ? "Delete Alert"
              : "Create Alert"
          }
          onClick={() =>
            onOpenAlertModal(product)
          }
        >
          <FaBell />
        </button>
      </div>

      <div className="wishlist-product-image-wrapper">
        <img
          src={
            product.imageUrls?.[0] ||
            product.imageUrl ||
            "https://via.placeholder.com/250"
          }
          alt={product.name}
        />
      </div>

      <div className="wishlist-content">
        <div className="wishlist-title-row">
          <h4 className="wishlist-product-title">
            {product.name}
          </h4>

          <div className="wishlist-stock-chip">
            {product.stockStatus === "AVAILABLE"
              ? "🟢 In Stock"
              : "🟠 Limited"}
          </div>
        </div>

        <div className="wishlist-meta-row">
          <span className="wishlist-brand">
            {product.brand?.name}
          </span>

          <span className="wishlist-rating">
            ⭐ {product.rating || 4.5}
          </span>
        </div>

        <div className="wishlist-price-row">
          <span className="wishlist-final-price">
            ₹
            {Number(
              product.finalPrice || 0
            ).toLocaleString()}
          </span>

          <span className="wishlist-mrp-price">
            ₹
            {Number(
              product.mrp_price || 0
            ).toLocaleString()}
          </span>
        </div>

        <div className="wishlist-savings">
          Save ₹
          {Number(
            Number(product.mrp_price || 0) -
              Number(product.finalPrice || 0)
          ).toLocaleString()}
        </div>
      </div>

      <div className="wishlist-card-actions">
        <button
          className="wishlist-cart-btn"

          // change by Gowtham:
          // sending full product object instead of only product.id.
          // Reason: CartContext can safely read product.id/product.productId.
          onClick={() =>
            onAddToCart(product)
          }

          // change by Gowtham:
          // disable button while product is adding to cart.
          disabled={cartLoading}
        >
          <FaShoppingCart />

          {/* change by Gowtham: show loading text while adding product to cart */}
          {cartLoading ? "Adding..." : "Cart"}
        </button>

        <button
          className="wishlist-remove-btn"
          onClick={() =>
            onRemove(
              wishlistId,
              product.id
            )
          }
        >
          <FaTrash />
          Remove
        </button>
      </div>
    </div>
  );
}

export default WishlistProductCard;