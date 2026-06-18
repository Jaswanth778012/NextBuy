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

import WishlistCard from "../components/wishlist/WishlistCard";
import WishlistCreateForm from "../components/wishlist/WishlistCreateForm";

import "../styles/Wishlist.css";

function WishlistPage() {
  const navigate =
    useNavigate();

  const [wishlists, setWishlists] =
    useState([]);

  const [search, setSearch] =
    useState("");

  const [
    showCreateModal,
    setShowCreateModal,
  ] = useState(false);

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const itemsPerPage = 5;

  useEffect(() => {
    fetchWishlists();
  }, []);

const fetchWishlists =
  async () => {
    try {
      const data =
        await getWishlists();

      console.log(
        "Wishlist Response:",
        data
      );

      setWishlists(data);
    } catch (error) {
      console.log(error);
    }
  };
  const handleCreate =
    async (data) => {
      try {
        await createWishlist(data);

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

  const handleDelete =
    async (id) => {
      try {
        await deleteWishlist(id);

        toast.success(
          "Wishlist deleted"
        );

        fetchWishlists();
      } catch (error) {
        toast.error(
          "Failed to delete wishlist"
        );
      }
    };

  const handleAddToCart =
    async (wishlistId) => {
      try {
        await addWishlistToCart(
          wishlistId
        );

        toast.success(
          "Wishlist added to cart"
        );
      } catch (error) {
        toast.error(
          "Failed to add wishlist to cart"
        );
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
    currentPage *
    itemsPerPage;

  const firstIndex =
    lastIndex -
    itemsPerPage;

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
          Organize products you
          love and move them to
          cart anytime.
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
            setShowCreateModal(
              true
            )
          }
        >
          + Create Wishlist
        </button>

      </div>

      {showCreateModal && (
        <WishlistCreateForm
          onCreate={
            handleCreate
          }
          onClose={() =>
            setShowCreateModal(
              false
            )
          }
        />
      )}

      <div className="wishlist-grid">

        {currentWishlists.map(
          (wishlist) => (
            <WishlistCard
              key={wishlist.id}
              wishlist={wishlist}
              onDelete={
                handleDelete
              }
              onAddToCart={
                handleAddToCart
              }
              onOpen={(id) =>
                navigate(
                  `/wishlist/${id}`
                )
              }
            />
          )
        )}

      </div>

      {totalPages > 1 && (
        <div className="pagination">

          <button
            disabled={
              currentPage === 1
            }
            onClick={() =>
              setCurrentPage(
                currentPage - 1
              )
            }
          >
            Previous
          </button>

          {[
            ...Array(
              totalPages
            ),
          ].map(
            (_, index) => (
              <button
                key={index}
                className={
                  currentPage ===
                  index + 1
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
            )
          )}

          <button
            disabled={
              currentPage ===
              totalPages
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