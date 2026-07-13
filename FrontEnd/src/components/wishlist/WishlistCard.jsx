import React from "react";

function WishlistCard({
  wishlist,
  onDelete,
  onOpen,
  onAddToCart,

  // change by Gowtham:
  // added this prop to receive loading status from WishlistPage.
  // This helps to show "Adding..." when user clicks Add To Cart.
  addToCartLoading,
}) {
  return (
    <div className="wishlist-row-card">
      <div className="wishlist-info">
        <h3>
          ❤️ {wishlist.wishListName}
        </h3>

        <p>
          {wishlist.wishlistItems?.length || 0} Products
        </p>
      </div>

      <div className="wishlist-actions">
        <button
          className="wishlist-view-btn"
          onClick={() => onOpen(wishlist.id)}
        >
          View Products
        </button>

        <button
          className="wishlist-cart-btn"
          onClick={() => onAddToCart(wishlist.id)}

          // change by Gowtham:
          // button disabled while wishlist products are adding to cart.
          // This prevents double click and duplicate API calls.
          disabled={addToCartLoading}
        >
          {/* change by Gowtham: button text changes while adding to cart */}
          {addToCartLoading ? "Adding..." : "Add To Cart"}
        </button>

        <button
          className="wishlist-delete-btn"
          onClick={() => onDelete(wishlist.id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export default WishlistCard;