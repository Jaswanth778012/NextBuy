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
  onWishlistUpdated,
}) {
  const [wishlists, setWishlists] =
    useState([]);

  const [
    selectedWishlist,
    setSelectedWishlist,
  ] = useState("");

  useEffect(() => {
    if (show) {
      fetchWishlists();
    }
  }, [show]);

  const fetchWishlists = async () => {
    try {
      const data =
        await getWishlists();

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
    const response =
      await addProductToWishlist(
        selectedWishlist,
        productId
      );

    toast.success(
      response ||
      "Product added to wishlist"
    );

    if (onWishlistUpdated) {
      await onWishlistUpdated();
    }

    onClose();

  } catch (error) {

    console.log(error);

    toast.error(
      error?.response?.data?.message ||
      error?.response?.data ||
      "Product already added to wishlist"
    );
  }
};

  if (!show) return null;

  return (
    <div className="product-wishlist-overlay">

      <div className="product-wishlist-modal">

        <h3 className="product-wishlist-title">
          Select Wishlist
        </h3>

        <select
          className="product-wishlist-select"
          value={selectedWishlist}
          onChange={(e) =>
            setSelectedWishlist(
              e.target.value
            )
          }
        >
          <option value="">
            Choose Wishlist
          </option>

          {wishlists.map(
            (wishlist) => (
              <option
                key={wishlist.id}
                value={wishlist.id}
              >
                {
                  wishlist.wishListName
                }
              </option>
            )
          )}
        </select>

        <div className="product-wishlist-actions">

          <button
            className="product-wishlist-add-btn"
            onClick={handleAdd}
          >
            Add Product
          </button>

          <button
            className="product-wishlist-cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  );
}

export default WishlistModal;