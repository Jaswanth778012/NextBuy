import React from "react";

function WishlistCard({
  wishlist,
  onDelete,
  onOpen,
  onAddToCart,
}) {
  return (
    <div className="wishlist-row-card">

      <div className="wishlist-info">

        <h3>
  ❤️ {wishlist.wishListName}
</h3>

        <p>
  {wishlist.wishlistItems?.length || 0}
  {" "}Products
</p>

      </div>

      <div className="wishlist-actions">

        <button
          className="wishlist-view-btn"
          onClick={() =>
            onOpen(wishlist.id)
          }
        >
          View Products
        </button>

        <button
          className="wishlist-cart-btn"
          onClick={() =>
            onAddToCart(wishlist.id)
          }
        >
          Add To Cart
        </button>

        <button
          className="wishlist-delete-btn"
          onClick={() =>
            onDelete(wishlist.id)
          }
        >
          Delete
        </button>

      </div>

    </div>
  );
}

export default WishlistCard;