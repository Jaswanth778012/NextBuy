import React from "react";

function WishlistProductCard({
  product,
  wishlistId,
  onRemove,
}) {
  return (
    <div className="wishlist-product-card">

      <img
        src={
          product.imageUrls?.[0]
        }
        alt={product.name}
      />

      <h4>{product.name}</h4>

      <p>
        ₹{product.finalPrice}
      </p>

      <button
        onClick={() =>
          onRemove(
            wishlistId,
            product.id
          )
        }
      >
        Remove
      </button>

    </div>
  );
}

export default WishlistProductCard;