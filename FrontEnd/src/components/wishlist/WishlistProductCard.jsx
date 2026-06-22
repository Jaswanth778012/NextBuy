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
}) {
  const product =
    wishlistItem.product;

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
            product.imageUrls?.[0]
          }
          alt={product.name}
        />

      </div>

      <div className="wishlist-content">

        {/* Name + Stock */}
        <div className="wishlist-title-row">

          <h4 className="wishlist-product-title">
            {product.name}
          </h4>

          <div className="wishlist-stock-chip">
            {product.stockStatus ===
            "AVAILABLE"
              ? "🟢 In Stock"
              : "🟠 Limited"}
          </div>

        </div>

        {/* Brand + Rating */}
        <div className="wishlist-meta-row">

          <span className="wishlist-brand">
            {product.brand?.name}
          </span>

          <span className="wishlist-rating">
            ⭐ {product.rating || 4.5}
          </span>

        </div>

        {/* Price */}
        <div className="wishlist-price-row">

          <span className="wishlist-final-price">
            ₹
            {Number(
              product.finalPrice
            ).toLocaleString()}
          </span>

          <span className="wishlist-mrp-price">
            ₹
            {Number(
              product.mrp_price
            ).toLocaleString()}
          </span>

        </div>

        {/* Savings */}
        <div className="wishlist-savings">

          Save ₹
          {Number(
            product.mrp_price -
              product.finalPrice
          ).toLocaleString()}

        </div>

      </div>

      <div className="wishlist-card-actions">

        <button
          className="wishlist-cart-btn"
          onClick={() =>
            onAddToCart(
              product.id
            )
          }
        >
          <FaShoppingCart />
          Add To Cart
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