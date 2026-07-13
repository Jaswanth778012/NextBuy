import React, {
  useEffect,
  useState,
} from "react";

import {
  getWishlists,
  createWishlist,
  deleteWishlist,
  addWishlistToCart,
} from "../services/wishlistService";

import {
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";

// change by Gowtham: imported useCart to refresh cart count and cart data after wishlist items are added to cart
import { useCart } from "../context/CartContext";

import WishlistCard from "../components/wishlist/WishlistCard";
import WishlistCreateForm from "../components/wishlist/WishlistCreateForm";

import "../styles/Wishlist.css";

function WishlistPage() {
  const navigate = useNavigate();

  // change by Gowtham:
  // added loadCart from CartContext.
  // Reason: after clicking Add to Cart from wishlist, cart data was not refreshing immediately.
  const { loadCart } = useCart();

  const [wishlists, setWishlists] = useState([]);
  const [search, setSearch] = useState("");

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  // change by Gowtham:
  // added loading state for only the clicked wishlist Add to Cart button.
  // Reason: user should know which wishlist is currently adding to cart.
  const [
    addToCartLoadingId,
    setAddToCartLoadingId,
  ] = useState(null);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchWishlists();
  }, []);

  const fetchWishlists = async () => {
    try {
      const data = await getWishlists();

      console.log(
        "Wishlist Response:",
        data
      );

      setWishlists(data);
    } catch (error) {
      console.log(error);

      // change by Gowtham: added error toast when wishlist loading fails
      toast.error(
        "Failed to load wishlists"
      );
    }
  };

  const handleCreate = async (data) => {
    try {
      await createWishlist(data);

      // change by Gowtham: added await before fetchWishlists to reload wishlist after create
      await fetchWishlists();

      toast.success(
        "Wishlist created"
      );

      setShowCreateModal(false);
    } catch (error) {
      toast.error(
        "Failed to create wishlist"
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteWishlist(id);

      toast.success(
        "Wishlist deleted"
      );

      // change by Gowtham: added await before fetchWishlists to reload wishlist after delete
      await fetchWishlists();
    } catch (error) {
      toast.error(
        "Failed to delete wishlist"
      );
    }
  };

  const handleAddToCart = async (wishlistId) => {
    try {
      // change by Gowtham:
      // setting loading id before API call.
      // This helps to show loading only for the clicked wishlist.
      setAddToCartLoadingId(wishlistId);

      // change by Gowtham:
      // this API should add all products from selected wishlist to cart.
      await addWishlistToCart(wishlistId);

      // change by Gowtham:
      // after wishlist products are added, reload cart data.
      // This updates cart count in header and cart page data.
      await loadCart();

      toast.success(
        "Wishlist products added to cart"
      );

      // change by Gowtham:
      // redirecting to cart page after success.
      // User can immediately verify the products added in cart.
      navigate("/cart");
    } catch (error) {
      console.log(
        "Wishlist add to cart error:",
        error
      );

      // change by Gowtham:
      // improved error message handling to show backend error if available.
      toast.error(
        error.response?.data?.message ||
          error.response?.data ||
          error.message ||
          "Failed to add wishlist to cart"
      );
    } finally {
      // change by Gowtham: stop loading after success or failure
      setAddToCartLoadingId(null);
    }
  };

  const filteredWishlists =
    wishlists.filter(
      (wishlist) =>
        wishlist.wishListName
          ?.toLowerCase()
          .includes(
            search.toLowerCase()
          )
    );

  const lastIndex =
    currentPage * itemsPerPage;

  const firstIndex =
    lastIndex - itemsPerPage;

  const currentWishlists =
    filteredWishlists.slice(
      firstIndex,
      lastIndex
    );

  const totalPages =
    Math.ceil(
      filteredWishlists.length /
        itemsPerPage
    );

  return (
    <div className="wishlist-page">
      <div className="wishlist-header">
        <h1>
          ❤️ My Wishlists
        </h1>

        <p>
          Organize products you love and move them to cart anytime.
        </p>
      </div>

      <div className="wishlist-toolbar">
        <input
          type="text"
          placeholder="Search wishlist..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
        />

        <button
          className="create-wishlist-btn"
          onClick={() =>
            setShowCreateModal(true)
          }
        >
          + Create Wishlist
        </button>
      </div>

      {showCreateModal && (
        <WishlistCreateForm
          onCreate={handleCreate}
          onClose={() =>
            setShowCreateModal(false)
          }
        />
      )}

      <div className="wishlist-grid">
        {currentWishlists.map(
          (wishlist) => (
            <WishlistCard
              key={wishlist.id}
              wishlist={wishlist}
              onDelete={handleDelete}
              onAddToCart={handleAddToCart}
              onOpen={(id) =>
                navigate(
                  `/wishlist/${id}`
                )
              }

              // change by Gowtham:
              // passing loading status to WishlistCard.
              // In WishlistCard button, use this to show "Adding..." and disable button.
              addToCartLoading={
                Number(addToCartLoadingId) ===
                Number(wishlist.id)
              }
            />
          )
        )}
      </div>

      {/* change by Gowtham: added empty wishlist message when search/result list is empty */}
      {currentWishlists.length === 0 && (
        <div className="empty-wishlist-box">
          <h2>No wishlist found</h2>
          <p>
            Create your first wishlist and save your favorite products.
          </p>
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={currentPage === 1}
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>

          {[
            ...Array(totalPages),
          ].map((_, index) => (
            <button
              key={index}
              className={
                currentPage === index + 1
                  ? "active"
                  : ""
              }
              onClick={() =>
                setCurrentPage(
                  index + 1
                )
              }
            >
              {index + 1}
            </button>
          ))}

          <button
            disabled={
              currentPage === totalPages
            }
            onClick={() =>
              setCurrentPage(
                currentPage + 1
              )
            }
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default WishlistPage;