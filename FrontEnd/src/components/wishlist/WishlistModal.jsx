import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

import {
  getWishlists,
  addProductToWishlist,
} from "../../services/wishlistService";

function WishlistModal({
  show,
  onClose,
  productId,
}) {
  const [wishlists, setWishlists] = useState([]);
  const [selectedWishlist, setSelectedWishlist] =
    useState("");

  useEffect(() => {
    if (show) {
      fetchWishlists();
    }
  }, [show]);

  const fetchWishlists = async () => {
    try {
      const data = await getWishlists();
      setWishlists(data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAdd = async () => {
    if (!selectedWishlist) {
      toast.error("Select a wishlist");
      return;
    }

    try {
      await addProductToWishlist(
        selectedWishlist,
        productId
      );

      toast.success(
        "Product added to wishlist"
      );

      onClose();
    } catch (error) {
      toast.error(
        error?.response?.data ||
          "Failed to add product"
      );
    }
  };

  if (!show) return null;

  return (
    <div className="wishlist-modal-overlay">
      <div className="wishlist-modal">
        <h3>Select Wishlist</h3>

        {wishlists.map((wishlist) => (
          <label
            key={wishlist.id}
            className="wishlist-option"
          >
            <input
              type="radio"
              value={wishlist.id}
              checked={
                selectedWishlist === wishlist.id
              }
              onChange={() =>
                setSelectedWishlist(
                  wishlist.id
                )
              }
            />

            {wishlist.wishListName}
          </label>
        ))}

        <div className="wishlist-modal-actions">
          <button onClick={handleAdd}>
            Add Product
          </button>

          <button onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default WishlistModal;